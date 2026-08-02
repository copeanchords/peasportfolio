// Pure parsing/filtering logic for the WhatsApp Chat Viewer tool.
// No DOM access, no React — safe to unit test in isolation.
//
// Ported 1:1 from legacy-reference/tools/whatsapp-chat-viewer/index.html, with
// the "compute HTML string" step replaced by a small discriminated union
// (BodyContent) so the React layer can render media pickers/lightbox/etc.
// as real interactive elements instead of dangerouslySetInnerHTML strings.

export interface Participant {
  name: string
  count: number
}

export type BodyContent =
  | { kind: 'text'; text: string }
  | {
      kind: 'placeholder'
      icon: string
      label: string
      mediaType: 'image' | 'video' | 'audio' | 'any'
      mediaId: string
    }
  | { kind: 'file'; fname: string; ext: string; caption: string }

export interface ParsedMessage {
  id: string
  date: Date | null
  dateKey: string
  timeStr: string
  sender: string
  senderLower: string
  isSystem: boolean
  body: string
  bodyLower: string
  bodyContent: BodyContent
}

// Handles all WhatsApp export formats:
//   [DD/MM/YYYY, HH:MM:SS] Sender: msg     (iOS, square brackets)
//   DD/MM/YYYY, HH:MM - Sender: msg        (Android, no brackets)
//   MM/DD/YY, H:MM AM/PM - Sender: msg     (US locale 12h)
const LINE_REGEX =
  /^\[?(\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4}),\s*(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]?\s*[-–]?\s*(.*)/i

const MEDIA_EXT_RE = /\.(jpg|jpeg|png|gif|mp4|mov|webp|opus|aac|mp3|pdf|webm)/
const MEDIA_WORDS_RE = /(media omitted|image omitted|audio omitted|video omitted|sticker omitted|file attached)/

export function parseDate(str: string): Date | null {
  const parts = str.split(/[/.-]/).map(Number)
  if (parts.length < 3) return null
  const [a, b] = parts
  let c = parts[2]
  if (c < 100) c += 2000
  let day = a
  let month = b
  if (a > 12) {
    day = a
    month = b
  } else if (b > 12) {
    day = b
    month = a
  }
  const d = new Date(c, month - 1, day)
  return isNaN(d.getTime()) ? null : d
}

export function formatDate(d: Date | null): string {
  if (!d) return 'Unknown Date'
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

export function isoDate(d: Date | null): string {
  if (!d) return ''
  return d.toISOString().split('T')[0]
}

function computeBodyContent(body: string, mediaId: string): BodyContent {
  if (/image omitted|<image omitted>/i.test(body)) {
    return { kind: 'placeholder', icon: '🖼️', label: 'Image', mediaType: 'image', mediaId }
  }
  if (/video omitted|<video omitted>/i.test(body)) {
    return { kind: 'placeholder', icon: '🎥', label: 'Video', mediaType: 'video', mediaId }
  }
  if (/audio omitted|<audio omitted>/i.test(body)) {
    return { kind: 'placeholder', icon: '🎙️', label: 'Audio', mediaType: 'audio', mediaId }
  }
  if (/sticker omitted|<sticker omitted>/i.test(body)) {
    return { kind: 'placeholder', icon: '🎨', label: 'Sticker', mediaType: 'image', mediaId }
  }
  if (/<Media omitted>/i.test(body)) {
    return { kind: 'placeholder', icon: '📎', label: 'Media', mediaType: 'any', mediaId }
  }
  if (/\(file attached\)/i.test(body)) {
    return { kind: 'placeholder', icon: '📎', label: 'Attached file', mediaType: 'any', mediaId }
  }
  const fileMatch = body.match(/^(.+\.(jpg|jpeg|png|gif|mp4|mov|webp|opus|aac|mp3|pdf|webm))(\s*.*)?$/i)
  if (fileMatch) {
    const fname = fileMatch[1].trim()
    const ext = fname.split('.').pop()!.toLowerCase()
    const caption = fileMatch[3]?.trim() || ''
    return { kind: 'file', fname, ext, caption }
  }
  return { kind: 'text', text: body }
}

/**
 * Parses a raw WhatsApp `_chat.txt` export into structured messages.
 * Mirrors the original's single-pass, streaming-friendly parse: one pass
 * over the lines, no intermediate large allocations besides the result array.
 */
export function parseWhatsApp(text: string): ParsedMessage[] {
  const msgs: ParsedMessage[] = []
  const clean = text.replace(/[‎‏​﻿]/g, '')
  const lines = clean.split('\n')
  let current: ParsedMessage | null = null
  let idx = 0

  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue

    const m = line.match(LINE_REGEX)
    if (m) {
      if (current) msgs.push(current)
      const [, dateStr, timeStr, rest] = m
      const date = parseDate(dateStr)
      const colonIdx = rest.indexOf(': ')
      let sender: string
      let body: string
      if (colonIdx > 0 && colonIdx < 60) {
        sender = rest.slice(0, colonIdx).trim()
        body = rest.slice(colonIdx + 2).trim()
      } else {
        sender = 'System'
        body = rest.trim()
      }
      const dateKey = date ? isoDate(date) : 'unknown'
      const id = `msg_${idx++}`
      current = {
        id,
        date,
        dateKey,
        timeStr,
        sender,
        senderLower: sender.toLowerCase(),
        isSystem: sender === 'System',
        body,
        bodyLower: body.toLowerCase(),
        bodyContent: computeBodyContent(body, id),
      }
    } else if (current) {
      // Continuation line: append to body and recompute derived fields
      current.body += '\n' + line
      current.bodyLower = current.body.toLowerCase()
      current.bodyContent = computeBodyContent(current.body, current.id)
    }
  }
  if (current) msgs.push(current)
  return msgs
}

export function buildParticipants(messages: ParsedMessage[]): Participant[] {
  const counts = new Map<string, number>()
  for (const m of messages) {
    if (!m.isSystem) counts.set(m.sender, (counts.get(m.sender) || 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }))
}

export function isMediaMsg(m: Pick<ParsedMessage, 'bodyLower'>): boolean {
  return MEDIA_EXT_RE.test(m.bodyLower) || MEDIA_WORDS_RE.test(m.bodyLower)
}

export interface FilterOptions {
  selectedParticipants: Set<string>
  dateFrom: string // yyyy-mm-dd, or '' for no lower bound
  dateTo: string // yyyy-mm-dd, or '' for no upper bound
  search: string // raw text, lower-cased/trimmed internally
  mediaOnly: boolean
}

export function filterMessages(messages: ParsedMessage[], opts: FilterOptions): ParsedMessage[] {
  const fromDate = opts.dateFrom ? new Date(opts.dateFrom) : null
  const toDate = opts.dateTo ? new Date(opts.dateTo + 'T23:59:59') : null
  const search = opts.search.toLowerCase().trim()

  return messages.filter((m) => {
    if (!m.isSystem && !opts.selectedParticipants.has(m.sender)) return false
    if (m.date) {
      if (fromDate && m.date < fromDate) return false
      if (toDate && m.date > toDate) return false
    }
    if (search && !m.bodyLower.includes(search) && !m.senderLower.includes(search)) return false
    if (opts.mediaOnly && !isMediaMsg(m)) return false
    return true
  })
}

const AVATAR_COLORS = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#1abc9c',
  '#3498db', '#9b59b6', '#e91e63', '#00bcd4', '#ff5722',
]

const colorCache = new Map<string, string>()

export function colorForName(name: string): string {
  const cached = colorCache.get(name)
  if (cached) return cached
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff
  const color = AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
  colorCache.set(name, color)
  return color
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function acceptFor(type: 'image' | 'video' | 'audio' | 'any'): string {
  if (type === 'image') return 'image/*'
  if (type === 'video') return 'video/*'
  if (type === 'audio') return 'audio/*'
  return '*/*'
}
