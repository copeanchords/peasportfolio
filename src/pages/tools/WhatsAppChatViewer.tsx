import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent, KeyboardEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './whatsapp-chat-viewer.css'
import {
  acceptFor,
  buildParticipants,
  colorForName,
  filterMessages,
  formatDate,
  initials,
  isoDate,
  parseWhatsApp,
} from './whatsapp-chat-parser'
import type { BodyContent, ParsedMessage, Participant } from './whatsapp-chat-parser'

// Fixed row height used by the virtual scroller. The original used a
// generous fixed estimate rather than measuring real row heights — jank
// from adaptive measurement was worse than the small scrollbar-size error.
// Because every row uses the SAME height, row position is just `i * ITEM_HEIGHT`,
// so no cumulative position table (or binary search over one) is needed.
const ITEM_HEIGHT = 72
const OVERSCAN = 15 // extra rows rendered above/below the viewport

type Stage = 'upload' | 'loading' | 'app'

interface MediaEntry {
  url: string
  name: string
}

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp']
const VIDEO_EXTS = ['mp4', 'mov', 'webm']
const AUDIO_EXTS = ['opus', 'aac', 'mp3', 'm4a']

// Splits text into plain-string / <mark> chunks around case-insensitive
// matches of `search`. Kept allocation-light: returns the original string
// untouched (not an array) when there's nothing to highlight.
function renderHighlighted(text: string, search: string): ReactNode {
  if (!search) return text
  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escaped, 'gi')
  const out: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) out.push(text.slice(lastIndex, match.index))
    out.push(
      <mark className="search-mark" key={key++}>
        {match[0]}
      </mark>,
    )
    lastIndex = match.index + match[0].length
    if (match[0].length === 0) regex.lastIndex++
  }
  if (!out.length) return text
  if (lastIndex < text.length) out.push(text.slice(lastIndex))
  return out
}

function renderMediaByExt(ext: string, url: string, name: string, onOpenLightbox: (src: string) => void): ReactNode | null {
  if (IMAGE_EXTS.includes(ext)) {
    return <img className="media-preview" src={url} alt={name} onClick={() => onOpenLightbox(url)} />
  }
  if (VIDEO_EXTS.includes(ext)) {
    return <video className="media-preview" src={url} controls />
  }
  if (AUDIO_EXTS.includes(ext)) {
    return <audio controls src={url} style={{ marginTop: 6, width: '100%' }} />
  }
  return null
}

function renderMediaPreview(url: string, name: string, onOpenLightbox: (src: string) => void): ReactNode {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const preview = renderMediaByExt(ext, url, name, onOpenLightbox)
  if (preview) return preview
  return (
    <a className="media-download-link" href={url} download={name}>
      ⬇ {name}
    </a>
  )
}

interface RenderBodyArgs {
  bodyContent: BodyContent
  search: string
  mediaUrlByFilename: Record<string, string>
  mediaEntryByMessageId: Record<string, MediaEntry>
  onAttachNamed: (file: File, fname: string) => void
  onAttachPlaceholder: (file: File, mediaId: string) => void
  onOpenLightbox: (src: string) => void
}

function renderBodyContent(args: RenderBodyArgs): ReactNode {
  const { bodyContent: bc, search, mediaUrlByFilename, mediaEntryByMessageId, onAttachNamed, onAttachPlaceholder, onOpenLightbox } = args

  if (bc.kind === 'text') {
    return renderHighlighted(bc.text, search)
  }

  if (bc.kind === 'placeholder') {
    const entry = mediaEntryByMessageId[bc.mediaId]
    if (entry) return renderMediaPreview(entry.url, entry.name, onOpenLightbox)
    return (
      <>
        <span className="media-badge">
          {bc.icon} {bc.label}
        </span>
        <label className="media-upload-area">
          <input
            type="file"
            accept={acceptFor(bc.mediaType)}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const f = e.target.files?.[0]
              if (f) onAttachPlaceholder(f, bc.mediaId)
            }}
          />
          📎 Attach {bc.label.toLowerCase()} file…
        </label>
      </>
    )
  }

  // bc.kind === 'file'
  const url = mediaUrlByFilename[bc.fname]
  if (url) {
    const preview = renderMediaByExt(bc.ext, url, bc.fname, onOpenLightbox)
    if (preview) {
      return (
        <>
          {preview}
          {bc.caption && <div>{renderHighlighted(bc.caption, search)}</div>}
        </>
      )
    }
  }
  return (
    <>
      <span className="media-badge">📎 {renderHighlighted(bc.fname, search)}</span>
      <label className="media-upload-area">
        <input
          type="file"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0]
            if (f) onAttachNamed(f, bc.fname)
          }}
        />
        📎 Attach file…
      </label>
      {bc.caption && <div>{renderHighlighted(bc.caption, search)}</div>}
    </>
  )
}

interface MessageBubbleProps {
  msg: ParsedMessage
  isGroup: boolean
  isOut: boolean
  search: string
  mediaUrlByFilename: Record<string, string>
  mediaEntryByMessageId: Record<string, MediaEntry>
  onAttachNamed: (file: File, fname: string) => void
  onAttachPlaceholder: (file: File, mediaId: string) => void
  onOpenLightbox: (src: string) => void
}

function MessageBubble(props: MessageBubbleProps) {
  const { msg, isGroup, isOut, search, onOpenLightbox } = props
  const body = renderBodyContent({
    bodyContent: msg.bodyContent,
    search,
    mediaUrlByFilename: props.mediaUrlByFilename,
    mediaEntryByMessageId: props.mediaEntryByMessageId,
    onAttachNamed: props.onAttachNamed,
    onAttachPlaceholder: props.onAttachPlaceholder,
    onOpenLightbox,
  })

  if (msg.isSystem) {
    return <div className="msg-system">{body}</div>
  }

  const dir = isOut ? 'out' : 'in'
  return (
    <div className={`msg-wrapper ${dir}`}>
      <div className="bubble">
        {!isOut && isGroup && (
          <div className="bubble-sender" style={{ color: colorForName(msg.sender) }}>
            {msg.sender}
          </div>
        )}
        <div className="bubble-text">{body}</div>
        <div className="bubble-meta">{msg.timeStr}</div>
      </div>
    </div>
  )
}

type Row = { type: 'divider'; key: string; label: string } | { type: 'message'; key: string; msg: ParsedMessage }

export default function WhatsAppChatViewer() {
  const [stage, setStage] = useState<Stage>('upload')
  const [isDragOver, setIsDragOver] = useState(false)
  const [loadingLabel, setLoadingLabel] = useState('Reading file…')
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [allMessages, setAllMessages] = useState<ParsedMessage[]>([])
  const [participants, setParticipants] = useState<Participant[]>([])
  const [selectedParticipants, setSelectedParticipants] = useState<Set<string>>(new Set())
  const [myName, setMyName] = useState<string | null>(null)

  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [searchText, setSearchText] = useState('')
  const [showMediaOnly, setShowMediaOnly] = useState(false)
  const [filteredMessages, setFilteredMessages] = useState<ParsedMessage[]>([])

  const [mediaByFilename, setMediaByFilename] = useState<Record<string, string>>({})
  const [mediaByMessageId, setMediaByMessageId] = useState<Record<string, MediaEntry>>({})
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const objectUrlsRef = useRef<Set<string>>(new Set())
  const scrollRafRef = useRef<number | null>(null)

  // ===== FILE HANDLING =====
  // FIX 2 (from original): readAsText is fine for large files in modern
  // browsers — the real bottleneck was DOM rendering, solved below with
  // virtual scrolling, not by chunking the read itself.
  function handleFiles(files: FileList | File[]) {
    const file = Array.from(files).find((f) => f.name.endsWith('.txt'))
    if (!file) {
      window.alert('Please select a WhatsApp .txt export file.')
      return
    }

    setStage('loading')
    setLoadingLabel('Reading file…')
    setLoadingProgress(10)

    const reader = new FileReader()
    reader.onprogress = (e) => {
      if (e.lengthComputable) setLoadingProgress(Math.round((e.loaded / e.total) * 40))
    }
    reader.onerror = () => {
      window.alert('Could not read the file. Please try again.')
      setStage('upload')
    }
    reader.onload = (e) => {
      const text = (e.target?.result ?? '') as string
      setLoadingLabel('Parsing messages…')
      setLoadingProgress(45)
      // Defer parsing to the next task so the loading UI paints first.
      window.setTimeout(() => loadChat(text), 30)
    }
    reader.readAsText(file, 'UTF-8')
  }

  // Staged with setTimeout slices (matching the original) so the loading
  // bar/label actually paint between each heavy step instead of the whole
  // parse+aggregate blocking in one synchronous frame.
  function loadChat(text: string) {
    setLoadingLabel('Parsing messages…')
    setLoadingProgress(50)

    window.setTimeout(() => {
      const parsed = parseWhatsApp(text)

      if (!parsed.length) {
        setStage('upload')
        window.alert('Could not parse this file. Make sure it is a WhatsApp exported _chat.txt file.')
        return
      }

      setLoadingProgress(70)
      setLoadingLabel('Building participant list…')

      window.setTimeout(() => {
        const parts = buildParticipants(parsed)
        const myN = parts[0]?.name ?? null

        const dates = parsed.map((m) => m.date).filter((d): d is Date => d !== null)
        let dFrom = ''
        let dTo = ''
        if (dates.length) {
          const minDate = dates.reduce((a, b) => (a < b ? a : b))
          const maxDate = dates.reduce((a, b) => (a > b ? a : b))
          dFrom = isoDate(minDate)
          dTo = isoDate(maxDate)
        }

        const allSelected = new Set(parts.map((p) => p.name))

        setLoadingProgress(90)
        setLoadingLabel('Rendering…')

        window.setTimeout(() => {
          const initialFiltered = filterMessages(parsed, {
            selectedParticipants: allSelected,
            dateFrom: dFrom,
            dateTo: dTo,
            search: '',
            mediaOnly: false,
          })

          setAllMessages(parsed)
          setParticipants(parts)
          setMyName(myN)
          setDateFrom(dFrom)
          setDateTo(dTo)
          setSearchText('')
          setShowMediaOnly(false)
          setSelectedParticipants(allSelected)
          setFilteredMessages(initialFiltered)
          setLoadingProgress(100)
          // Show the app shell so the container gets real pixel dimensions;
          // the scroll-to-bottom effect below waits two rAFs before reading
          // clientHeight, mirroring the original's layout-settle trick.
          setStage('app')
        }, 30)
      }, 30)
    }, 30)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(true)
  }
  function handleDragLeave() {
    setIsDragOver(false)
  }
  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }
  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files)
  }

  // ===== FILTERING =====
  // Every trigger (Apply button, Enter in a field, toggling a participant,
  // select-all, media-only) re-reads whatever is CURRENTLY in the date/search
  // fields — same semantics as the original's applyFilters(), which always
  // read live DOM values regardless of what triggered it. `overrides` lets a
  // toggle handler filter using its just-computed value before React commits
  // the corresponding state.
  function runFilters(overrides?: { selected?: Set<string>; media?: boolean }) {
    const selected = overrides?.selected ?? selectedParticipants
    const media = overrides?.media ?? showMediaOnly
    const result = filterMessages(allMessages, {
      selectedParticipants: selected,
      dateFrom,
      dateTo,
      search: searchText,
      mediaOnly: media,
    })
    setFilteredMessages(result)
  }

  function handleApplyFilters() {
    runFilters()
  }

  function handleFilterKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') runFilters()
  }

  function toggleParticipant(name: string) {
    const next = new Set(selectedParticipants)
    if (next.has(name)) next.delete(name)
    else next.add(name)
    setSelectedParticipants(next)
    runFilters({ selected: next })
  }

  function toggleSelectAll() {
    const next = selectedParticipants.size === participants.length ? new Set<string>() : new Set(participants.map((p) => p.name))
    setSelectedParticipants(next)
    runFilters({ selected: next })
  }

  function toggleMediaMode() {
    const next = !showMediaOnly
    setShowMediaOnly(next)
    runFilters({ media: next })
  }

  // ===== MEDIA ATTACH / LIGHTBOX =====
  function handleMediaAttachPlaceholder(file: File, mediaId: string) {
    const url = URL.createObjectURL(file)
    objectUrlsRef.current.add(url)
    setMediaByMessageId((prev) => ({ ...prev, [mediaId]: { url, name: file.name } }))
  }

  function handleMediaAttachNamed(file: File, fname: string) {
    const url = URL.createObjectURL(file)
    objectUrlsRef.current.add(url)
    setMediaByFilename((prev) => ({ ...prev, [fname]: url }))
  }

  function openLightbox(src: string) {
    setLightboxSrc(src)
  }
  function closeLightbox() {
    setLightboxSrc(null)
  }

  function resetApp() {
    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
    objectUrlsRef.current.clear()
    setAllMessages([])
    setFilteredMessages([])
    setParticipants([])
    setSelectedParticipants(new Set())
    setMediaByFilename({})
    setMediaByMessageId({})
    setShowMediaOnly(false)
    setMyName(null)
    setDateFrom('')
    setDateTo('')
    setSearchText('')
    setScrollTop(0)
    setLightboxSrc(null)
    setStage('upload')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Escape closes the lightbox, matching the original's document-level listener.
  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxSrc(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Revoke every object URL we ever created, on unmount, so attached media
  // doesn't leak memory once the tool is left.
  useEffect(() => {
    return () => {
      if (scrollRafRef.current != null) cancelAnimationFrame(scrollRafRef.current)
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [])

  // Track container size for the virtual scroller.
  useEffect(() => {
    if (stage !== 'app') return
    const el = containerRef.current
    if (!el) return
    setContainerHeight(el.clientHeight)
    const ro = new ResizeObserver(() => setContainerHeight(el.clientHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [stage])

  // Every filter change jumps to the newest (bottom) message, like the
  // original's scheduleRender(true) call at the end of applyFilters()/init.
  // Double rAF mirrors the original's wait for the shell's layout to settle
  // before reading clientHeight.
  useEffect(() => {
    if (stage !== 'app') return
    const el = containerRef.current
    if (!el) return
    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const totalH = filteredMessages.length * ITEM_HEIGHT
        const target = Math.max(0, totalH - el.clientHeight)
        el.scrollTop = target
        setScrollTop(target)
        setContainerHeight(el.clientHeight)
      })
    })
    return () => cancelAnimationFrame(raf1)
  }, [filteredMessages, stage])

  function handleScroll() {
    if (scrollRafRef.current != null) return
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = null
      if (containerRef.current) setScrollTop(containerRef.current.scrollTop)
    })
  }

  // ===== VIRTUAL SCROLL SLICE =====
  const totalRows = filteredMessages.length
  const totalHeight = totalRows * ITEM_HEIGHT

  const { startIdx, endIdx, padTop, padBottom } = useMemo(() => {
    if (!totalRows || containerHeight <= 0) return { startIdx: 0, endIdx: -1, padTop: 0, padBottom: 0 }
    const rawStart = Math.floor(scrollTop / ITEM_HEIGHT)
    const rawEnd = Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT)
    const s = Math.max(0, rawStart - OVERSCAN)
    const en = Math.min(totalRows - 1, rawEnd + OVERSCAN)
    return { startIdx: s, endIdx: en, padTop: s * ITEM_HEIGHT, padBottom: Math.max(0, totalHeight - (en + 1) * ITEM_HEIGHT) }
  }, [scrollTop, containerHeight, totalRows, totalHeight])

  const rows = useMemo(() => {
    const out: Row[] = []
    let lastDateKey = startIdx > 0 ? (filteredMessages[startIdx - 1]?.dateKey ?? null) : null
    for (let i = startIdx; i <= endIdx; i++) {
      const msg = filteredMessages[i]
      if (msg.dateKey !== lastDateKey) {
        lastDateKey = msg.dateKey
        out.push({ type: 'divider', key: `divider-${msg.id}`, label: formatDate(msg.date) })
      }
      out.push({ type: 'message', key: msg.id, msg })
    }
    return out
  }, [filteredMessages, startIdx, endIdx])

  const isGroup = participants.length > 2
  const liveSearch = searchText.trim()

  const chatTitle = useMemo(() => {
    const names = [...selectedParticipants]
    if (names.length === 1) return names[0]
    if (names.length > 1) return `${names.length} participants`
    return 'No participants selected'
  }, [selectedParticipants])

  return (
    <div className="whatsapp-viewer-tool">
      {stage !== 'app' && (
        <div className="wcv-back-link-floating">
          <Link to="/" className="wcv-back-link">
            ← Back to tools
          </Link>
        </div>
      )}

      <AnimatePresence mode="wait">
        {stage === 'upload' && (
          <motion.div
            key="upload"
            className="upload-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="upload-icon"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              💬
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
              <div className="upload-title">
                WhatsApp <span>Chat Viewer</span>
              </div>
              <p className="upload-subtitle">
                Import your exported chat backup and explore conversations with filters, search, and media support. Works with
                files of any size.
              </p>
            </motion.div>
            <motion.div
              className={`drop-zone${isDragOver ? ' dragover' : ''}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input ref={fileInputRef} type="file" accept=".txt" multiple onChange={handleFileInputChange} />
              <strong>Drop your chat export here</strong>
              <p>
                or click to browse — supports <code>_chat.txt</code> files exported from WhatsApp
              </p>
            </motion.div>
            <motion.div className="media-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay: 0.18 }}>
              <strong>📎 Large files?</strong> This viewer uses virtual scrolling — it handles files with 500k+ messages without
              any slowdown. Only the visible messages are rendered at any time.
            </motion.div>
            <motion.div className="media-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay: 0.24 }}>
              <strong>💬 Why this exists.</strong> I lost the backup of an old chat with a friend. Built
              this to read the exported <code>.txt</code> directly — searchable, with attachments
              rendered inline wherever they showed up in the export.
            </motion.div>
          </motion.div>
        )}

        {stage === 'loading' && (
          <motion.div
            key="loading"
            className="loading-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="upload-icon" style={{ fontSize: 28 }}>
              ⏳
            </div>
            <div className="loading-label">{loadingLabel}</div>
            <div className="loading-bar-wrap">
              <div className="loading-bar" style={{ width: `${loadingProgress}%` }} />
            </div>
          </motion.div>
        )}

        {stage === 'app' && (
          <motion.div key="app" className="app-shell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
            <div className="app-header">
              <Link to="/" className="wcv-back-link in-header">
                ← Tools
              </Link>
              <div className="app-logo">💬 WA Viewer</div>
              <span className="stats-badge">
                {allMessages.length.toLocaleString()} messages · {participants.length} participants
              </span>
              <div className="app-header-right">
                <button type="button" className="btn-reset" onClick={resetApp}>
                  ← New Import
                </button>
              </div>
            </div>
            <div className="app-body">
              <div className="sidebar">
                <div className="sidebar-section">
                  <div className="sidebar-label">Date Range</div>
                  <div className="date-inputs">
                    <div className="date-input-row">
                      <label>From</label>
                      <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} onKeyDown={handleFilterKeyDown} />
                    </div>
                    <div className="date-input-row">
                      <label>To</label>
                      <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} onKeyDown={handleFilterKeyDown} />
                    </div>
                  </div>
                </div>
                <div className="sidebar-section">
                  <div className="sidebar-label">Search</div>
                  <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search messages…"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={handleFilterKeyDown}
                    />
                  </div>
                </div>
                <div className="sidebar-section">
                  <button type="button" className="apply-btn" onClick={handleApplyFilters}>
                    Apply Filters
                  </button>
                </div>
                <div className="sidebar-section" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div className="sidebar-label">Participants</div>
                  <button type="button" className="select-all-btn" onClick={toggleSelectAll}>
                    Select All
                  </button>
                  <div className="contacts-list">
                    {participants.map((p) => (
                      <button
                        type="button"
                        key={p.name}
                        className={`contact-item${selectedParticipants.has(p.name) ? ' active' : ''}`}
                        onClick={() => toggleParticipant(p.name)}
                      >
                        <span className="contact-avatar" style={{ background: colorForName(p.name) }}>
                          {initials(p.name)}
                        </span>
                        <span className="contact-info">
                          <span className="contact-name">{p.name}</span>
                          <span className="contact-count">{p.count.toLocaleString()} msgs</span>
                        </span>
                        <span className="contact-check">✓</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chat-area">
                <div className="chat-toolbar">
                  <span className="chat-toolbar-title">{chatTitle}</span>
                  <button type="button" className={`show-media-toggle${showMediaOnly ? ' active' : ''}`} onClick={toggleMediaMode}>
                    {showMediaOnly ? '💬 Show All Messages' : '📎 Show Media Only'}
                  </button>
                  <span className="msg-count">{filteredMessages.length.toLocaleString()} messages</span>
                </div>
                <div className="messages-container" ref={containerRef} onScroll={handleScroll}>
                  {totalRows === 0 ? (
                    <div className="messages-viewport" style={{ paddingTop: 12, paddingBottom: 12 }}>
                      <div className="empty-state">
                        <span className="big">🔍</span>
                        <span>No messages match your filters</span>
                      </div>
                    </div>
                  ) : (
                    <div className="messages-viewport" style={{ paddingTop: padTop, paddingBottom: padBottom }}>
                      {rows.map((row) =>
                        row.type === 'divider' ? (
                          <div className="date-divider" key={row.key}>
                            <span>{row.label}</span>
                          </div>
                        ) : (
                          <MessageBubble
                            key={row.key}
                            msg={row.msg}
                            isGroup={isGroup}
                            isOut={row.msg.sender === myName}
                            search={liveSearch}
                            mediaUrlByFilename={mediaByFilename}
                            mediaEntryByMessageId={mediaByMessageId}
                            onAttachNamed={handleMediaAttachNamed}
                            onAttachPlaceholder={handleMediaAttachPlaceholder}
                            onOpenLightbox={openLightbox}
                          />
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            className="lightbox"
            onClick={closeLightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <img src={lightboxSrc} alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
