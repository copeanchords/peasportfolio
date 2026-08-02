import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import QRCode from 'qrcode'
import './docqr.css'

type ErrorCorrectionLevel = 'L' | 'M' | 'H'
type QrSize = 128 | 200 | 300 | 400

interface ProgressState {
  visible: boolean
  percent: number
  label: string
}

interface ResultInfo {
  name: string
  size: string
  type: string
}

const MAX_BYTES = 2 * 1024 * 1024 // 2MB raw limit for QR

function getFileIcon(type: string): string {
  if (type.includes('pdf')) return '📕'
  if (type.includes('image')) return '🖼️'
  if (type.includes('video')) return '🎬'
  if (type.includes('audio')) return '🎵'
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return '📊'
  if (type.includes('presentation') || type.includes('powerpoint')) return '📊'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('text')) return '📄'
  if (type.includes('zip') || type.includes('compressed')) return '📦'
  return '📄'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function DocQR() {
  const [file, setFile] = useState<File | null>(null)
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const [qrSize, setQrSize] = useState<QrSize>(200)
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M')
  const [colorDark, setColorDark] = useState('#000000')
  const [colorLight, setColorLight] = useState('#ffffff')

  const [progress, setProgress] = useState<ProgressState>({ visible: false, percent: 0, label: '' })
  const [warning, setWarning] = useState<string | null>(null)
  const [resultVisible, setResultVisible] = useState(false)
  const [resultInfo, setResultInfo] = useState<ResultInfo | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  function handleFile(f: File) {
    setFile(f)
    setDataUrl(null)
    setResultVisible(false)
    setWarning(null)
  }

  function clearFile() {
    setFile(null)
    setDataUrl(null)
    setResultVisible(false)
    setWarning(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave() {
    setDragOver(false)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0])
  }

  function handleFileInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length) handleFile(e.target.files[0])
  }

  async function buildQR(data: string) {
    const canvas = canvasRef.current
    if (!canvas) return
    await QRCode.toCanvas(canvas, data, {
      width: qrSize,
      margin: 1,
      errorCorrectionLevel: errorCorrection,
      color: {
        dark: colorDark,
        light: colorLight,
      },
    })
  }

  function generate() {
    if (!file) return

    if (file.size > MAX_BYTES) {
      setWarning(
        `⚠️ Warning: File is ${formatSize(file.size)}. Files over 2MB may produce QR codes that are too dense for most scanners to read. Consider compressing your file first.`,
      )
    } else {
      setWarning(null)
    }

    setProgress({ visible: true, percent: 0, label: 'Reading file…' })

    const reader = new FileReader()

    reader.onprogress = (e: ProgressEvent<FileReader>) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 80)
        setProgress((p) => ({ ...p, percent: pct }))
      }
    }

    reader.onerror = () => {
      setWarning('⚠️ Could not read the file. Please try again.')
      setProgress((p) => ({ ...p, visible: false, percent: 0 }))
    }

    reader.onload = () => {
      const result = reader.result as string
      setProgress((p) => ({ ...p, percent: 90, label: 'Generating QR…' }))
      setDataUrl(result)

      window.setTimeout(async () => {
        setProgress((p) => ({ ...p, percent: 100, label: 'Done!' }))

        try {
          await buildQR(result)
          setResultInfo({
            name: file.name,
            size: `${formatSize(result.length)} encoded`,
            type: file.type || 'application/octet-stream',
          })
          setResultVisible(true)
          window.setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }, 50)
        } catch {
          setResultVisible(false)
          setWarning(
            '⚠️ Could not generate a QR code for this file — the encoded data is too large/dense to render. Try a smaller file, a lower QR size, or a lower error-correction level.',
          )
        } finally {
          window.setTimeout(() => {
            setProgress((p) => ({ ...p, visible: false, percent: 0 }))
          }, 1000)
        }
      }, 200)
    }

    reader.readAsDataURL(file)
  }

  function getFileNameBase(): string {
    return file ? file.name.replace(/\.[^.]+$/, '') : 'document'
  }

  function downloadPNG() {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = `${getFileNameBase()}-qr.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  function downloadSVG() {
    const canvas = canvasRef.current
    if (!canvas) return
    const size = canvas.width
    const dataURL = canvas.toDataURL('image/png')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">\n  <image href="${dataURL}" width="${size}" height="${size}"/>\n</svg>`
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const a = document.createElement('a')
    a.download = `${getFileNameBase()}-qr.svg`
    a.href = URL.createObjectURL(blob)
    a.click()
  }

  function openDataUrl() {
    if (!dataUrl) return
    const w = window.open()
    if (!w) return
    const name = file?.name || 'Document'
    w.document.write(`
      <!DOCTYPE html><html><head><title>${name}</title>
      <style>body{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:#111;font-family:sans-serif;color:#fff;}
      a{color:#e8ff47;font-size:16px;text-decoration:none;padding:12px 28px;border:1px solid #e8ff47;border-radius:100px;margin-top:20px;}
      a:hover{background:#e8ff47;color:#000;}p{opacity:.5;font-size:13px;}</style></head>
      <body>
      <p>📄 ${name}</p>
      <a href="${dataUrl}" download="${name}">⬇ Download File</a>
      </body></html>
    `)
  }

  return (
    <div className="docqr-tool">
      <div className="container">
        <div className="back-link-wrap">
          <Link to="/" className="back-link">
            ← Back to tools
          </Link>
        </div>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="logo">
            <div className="logo-icon">⬛</div>
            <div className="logo-text">
              Doc<span>QR</span>
            </div>
          </div>
          <div className="badge">v1.0 · Client-side only</div>
        </motion.header>

        <motion.div
          className="hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          <h1>
            Turn any document
            <br />
            into a <span className="highlight">scannable QR</span>
          </h1>
          <p>Upload a file. Get a QR code that opens it. Everything runs locally — nothing leaves your browser.</p>
          <div className="origin-note">
            <span className="origin-tag">// why this exists</span>
            <p>
              A friend needed to hand a document to people stopping by her stall at a conference —
              no printing, no mass emails. Scan the QR, get the file.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          {/* Drop Zone — the whole zone opens the file picker, not just the button,
              since that's what users expect to be able to click. */}
          <div
            className={`drop-zone${dragOver ? ' dragover' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-icon">📄</div>
            <h3>Drop your document here</h3>
            <p>
              PDF, DOCX, TXT, images, spreadsheets, presentations…
              <br />
              Any file type accepted
            </p>
            <button type="button" className="browse-btn">
              Browse Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="file-input"
              accept="*/*"
              onChange={handleFileInputChange}
            />
          </div>

          {/* File Info */}
          {file && (
            <div className="file-info visible">
              <div className="file-icon">{getFileIcon(file.type)}</div>
              <div className="file-meta">
                <div className="file-name">{file.name}</div>
                <div className="file-size">
                  {formatSize(file.size)} · {file.type || 'unknown type'}
                </div>
              </div>
              <button type="button" className="remove-btn" onClick={clearFile} title="Remove file">
                ✕
              </button>
            </div>
          )}

          {/* Options */}
          <div className="options">
            <div className="option-group">
              <div className="option-label">QR Size</div>
              <select
                className="option-select"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value) as QrSize)}
              >
                <option value={128}>Small (128px)</option>
                <option value={200}>Medium (200px)</option>
                <option value={300}>Large (300px)</option>
                <option value={400}>XL (400px)</option>
              </select>
            </div>
            <div className="option-group">
              <div className="option-label">Error Correction</div>
              <select
                className="option-select"
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
              >
                <option value="L">Low (L) — smallest size</option>
                <option value="M">Medium (M) — balanced</option>
                <option value="H">High (H) — most robust</option>
              </select>
            </div>
            <div className="option-group">
              <div className="option-label">Dark Color</div>
              <label className="color-preview-wrap">
                <div className="color-swatch">
                  <input type="color" value={colorDark} onChange={(e) => setColorDark(e.target.value)} />
                </div>
                <span className="color-hex">{colorDark}</span>
              </label>
            </div>
            <div className="option-group">
              <div className="option-label">Light Color</div>
              <label className="color-preview-wrap">
                <div className="color-swatch">
                  <input type="color" value={colorLight} onChange={(e) => setColorLight(e.target.value)} />
                </div>
                <span className="color-hex">{colorLight}</span>
              </label>
            </div>
          </div>

          {/* Progress */}
          <AnimatePresence>
            {progress.visible && (
              <motion.div
                className="progress-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="progress-label">{progress.label}</div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress.percent}%` }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Warning */}
          <AnimatePresence>
            {warning && (
              <motion.div
                className="warning visible"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {warning}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate */}
          <div className="generate-wrap">
            <button type="button" className="generate-btn" onClick={generate} disabled={!file}>
              <span>⬛</span> Generate QR Code
            </button>
            <div className="info-text">
              The QR code encodes your file as a base64 data URL, allowing it to be opened directly from the QR
              without any server.
            </div>
          </div>

          {/* Result — kept mounted so the canvas ref is always available to draw into,
              visibility is toggled via class + a Framer Motion reveal animation. */}
          <motion.div
            ref={resultRef}
            className={`result-section${resultVisible ? ' visible' : ''}`}
            initial={false}
            animate={resultVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="result-header">
              <div className="result-title">
                Your QR is <span>ready</span>
              </div>
            </div>
            <div className="result-body">
              <div className="qr-wrapper">
                <canvas ref={canvasRef} />
              </div>
              <div className="result-details">
                <div className="detail-box">
                  <div className="detail-label">File</div>
                  <div className="detail-value">{resultInfo?.name ?? '—'}</div>
                </div>
                <div className="detail-box">
                  <div className="detail-label">Encoded Size</div>
                  <div className="detail-value mono">{resultInfo?.size ?? '—'}</div>
                </div>
                <div className="detail-box">
                  <div className="detail-label">Data Type</div>
                  <div className="detail-value mono">{resultInfo?.type ?? '—'}</div>
                </div>
                <div className="download-row">
                  <button type="button" className="dl-btn primary" onClick={downloadPNG}>
                    ⬇ Download PNG
                  </button>
                  <button type="button" className="dl-btn" onClick={downloadSVG}>
                    ⬇ SVG
                  </button>
                  <button type="button" className="dl-btn" onClick={openDataUrl}>
                    ↗ Open file
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
