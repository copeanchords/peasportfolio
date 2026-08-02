import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import './mean-sd-calculator.css'

type Mode = 'same' | 'different'

interface Result {
  mean: number
  sd: number
}

export default function MeanSdCalculator() {
  const [mode, setModeState] = useState<Mode>('same')

  const [m1, setM1] = useState('')
  const [s1, setS1] = useState('')
  const [m2, setM2] = useState('')
  const [s2, setS2] = useState('')
  const [n1, setN1] = useState('')
  const [n2, setN2] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
    }
  }, [])

  function showError(message: string) {
    setError(message)
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
    errorTimeoutRef.current = setTimeout(() => setError(null), 3000)
  }

  function hideError() {
    setError(null)
    if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current)
  }

  function setMode(m: Mode) {
    setModeState(m)
    hideError()
    setResult(null)
  }

  function calculate() {
    hideError()

    const mean1 = parseFloat(m1)
    const sd1 = parseFloat(s1)
    const mean2 = parseFloat(m2)
    const sd2 = parseFloat(s2)

    if ([mean1, sd1, mean2, sd2].some(Number.isNaN)) {
      showError('⚠️ Please enter valid numbers for all mean and standard deviation fields')
      return
    }

    if (sd1 < 0 || sd2 < 0) {
      showError('⚠️ Standard deviation cannot be negative')
      return
    }

    let mean: number
    let sd: number

    if (mode === 'same') {
      mean = (mean1 + mean2) / 2
      sd = Math.sqrt((sd1 ** 2 + sd2 ** 2) / 2 + (mean1 - mean2) ** 2 / 4)
    } else {
      const size1 = parseFloat(n1)
      const size2 = parseFloat(n2)

      if ([size1, size2].some(Number.isNaN)) {
        showError('⚠️ Please enter valid sample sizes for both groups')
        return
      }

      if (size1 <= 0 || size2 <= 0) {
        showError('⚠️ Sample sizes must be positive numbers')
        return
      }

      if (!Number.isInteger(size1) || !Number.isInteger(size2)) {
        showError('⚠️ Sample sizes should be whole numbers')
        return
      }

      mean = (size1 * mean1 + size2 * mean2) / (size1 + size2)
      sd = Math.sqrt(
        ((size1 - 1) * sd1 ** 2 +
          (size2 - 1) * sd2 ** 2 +
          size1 * (mean1 - mean) ** 2 +
          size2 * (mean2 - mean) ** 2) /
          (size1 + size2 - 1)
      )
    }

    setResult({ mean, sd })
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    calculate()
  }

  return (
    <div className="mean-sd-tool">
      <div className="back-link-wrap">
        <Link to="/" className="back-link">
          ← Back to tools
        </Link>
      </div>

      <motion.div
        className="container"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h1>📊 Combined Statistics Calculator</h1>
        <div className="subtitle">Calculate combined mean and standard deviation</div>

        <div className="why-built">
          <span className="why-built-icon">💡</span>
          <p>
            <strong>Why this exists:</strong> a friend needed to combine means and standard
            deviations across groups for her PhD study — easy formula, easy to get wrong by hand.
            So I coded it up with a clean UI she could just plug numbers into.
          </p>
        </div>

        <div className="toggle-container">
          <button
            type="button"
            className={`toggle-btn ${mode === 'same' ? 'active' : ''}`}
            onClick={() => setMode('same')}
          >
            Same Sample Size
          </button>
          <button
            type="button"
            className={`toggle-btn ${mode === 'different' ? 'active' : ''}`}
            onClick={() => setMode('different')}
          >
            Different Sample Size
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-section">
            <div className="section-label">Group 1</div>
            <div className="input-grid">
              <div className="input-group">
                <label className="input-label">Mean (μ₁)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 75.5"
                  value={m1}
                  onChange={(e) => setM1(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Std Dev (σ₁)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 10.2"
                  value={s1}
                  onChange={(e) => setS1(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="input-section">
            <div className="section-label">Group 2</div>
            <div className="input-grid">
              <div className="input-group">
                <label className="input-label">Mean (μ₂)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 82.3"
                  value={m2}
                  onChange={(e) => setM2(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Std Dev (σ₂)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 12.8"
                  value={s2}
                  onChange={(e) => setS2(e.target.value)}
                />
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {mode === 'different' && (
              <motion.div
                className="sample-size-section show"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <div className="input-group">
                  <label className="input-label">Sample Size (n₁)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g., 30"
                    value={n1}
                    onChange={(e) => setN1(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Sample Size (n₂)</label>
                  <input
                    type="number"
                    step="1"
                    placeholder="e.g., 40"
                    value={n2}
                    onChange={(e) => setN2(e.target.value)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                className="error-message show"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: [0, -5, 5, -5, 5, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="calc-btn">
            Calculate Combined Statistics
          </button>
        </form>

        <AnimatePresence>
          {result && (
            <motion.div
              className="result-container show"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div className="result-title">Combined Results</div>
              <div className="result-grid">
                <div className="result-item">
                  <div className="result-label">Combined Mean</div>
                  <div className="result-value">{result.mean.toFixed(4)}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Combined Std Dev</div>
                  <div className="result-value">{result.sd.toFixed(4)}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <details className="formula-info">
          <summary>ℹ️ How it works</summary>
          <p>
            <strong>Same sample size:</strong> Uses pooled variance formula assuming equal group
            sizes.
          </p>
          <p>
            <strong>Different sample size:</strong> Uses weighted mean and pooled standard
            deviation accounting for different group sizes.
          </p>
        </details>
      </motion.div>
    </div>
  )
}
