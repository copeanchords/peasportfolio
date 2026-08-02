import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PUMPS, QUIZ_QUESTIONS, type Answers, type Pump } from './insulin-pump-data'
import './insulin-pump-finder.css'

type Screen = 'land' | 'quiz' | 'results'
type Ranked = [Pump['key'], number][]

const PUMP_KEYS = Object.keys(PUMPS) as Pump['key'][]

function ArrowIcon() {
  return (
    <span className="bico">
      <svg viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </span>
  )
}

function calcScore(a: Answers): Ranked {
  const s: Record<Pump['key'], number> = { m780g: 0, ypso: 0, renu: 0 }

  if (a.budget === 'vhigh' || a.budget === 'high') {
    s.m780g += 35
    s.ypso += 28
  } else if (a.budget === 'med') {
    s.m780g += 20
    s.ypso += 32
    s.renu += 6
  } else {
    s.renu += 48
    s.m780g += 4
    s.ypso += 4
  }

  if (a.auto === 'high') {
    s.m780g += 42
    s.ypso += 5
  } else if (a.auto === 'med') {
    s.m780g += 22
    s.ypso += 26
    s.renu += 6
  } else {
    s.ypso += 28
    s.renu += 20
    s.m780g += 4
  }

  if (a.ptype === 'patch') {
    s.renu += 42
    s.m780g -= 14
    s.ypso -= 14
  } else if (a.ptype === 'tubed') {
    s.m780g += 18
    s.ypso += 18
    s.renu -= 18
  } else {
    s.m780g += 6
    s.ypso += 6
    s.renu += 4
  }

  if (a.hypo === 'freq') {
    s.m780g += 32
    s.ypso += 7
  } else if (a.hypo === 'mod') {
    s.m780g += 16
    s.ypso += 10
  }

  if (a.a1c === 'vhigh' || a.a1c === 'high') {
    s.m780g += 22
    s.ypso += 10
  } else if (a.a1c === 'mod') {
    s.m780g += 12
    s.ypso += 12
  }

  if (a.life === 'act') {
    s.renu += 24
    s.m780g += 7
  } else if (a.life === 'sed') {
    s.ypso += 14
    s.m780g += 5
  } else {
    s.ypso += 8
    s.m780g += 8
    s.renu += 8
  }

  if (a.age === 'child' || a.age === 'teen') {
    s.renu += 14
    s.m780g += 16
  } else if (a.age === 'senior') {
    s.ypso += 22
    s.m780g += 4
  }

  if (a.dtype === 't1') {
    s.m780g += 24
    s.ypso += 12
  } else if (a.dtype === 'gest') {
    s.m780g += 20
    s.ypso += 10
  } else if (a.dtype === 't2') {
    s.ypso += 16
    s.m780g += 10
  }

  if (a.commit === 'unsure') {
    s.ypso += 16
    s.m780g -= 10
  } else if (a.commit === 'yes') {
    s.m780g += 8
  }

  const mx = Math.max(...PUMP_KEYS.map((k) => s[k]))
  const pct: Record<Pump['key'], number> = { m780g: 0, ypso: 0, renu: 0 }
  for (const k of PUMP_KEYS) {
    pct[k] = Math.round(Math.min(98, Math.max(52, (s[k] / (mx + 18)) * 100 + 26)))
  }
  return (Object.entries(pct) as Ranked).sort((a1, b1) => b1[1] - a1[1])
}

type CardItem = { type: 'card'; key: Pump['key']; pct: number; top: boolean } | { type: 'divider' }

function buildCardItems(ranked: Ranked): CardItem[] {
  const avail = ranked.filter(([k]) => PUMPS[k].india)
  const top2 = avail.slice(0, 2)
  const items: CardItem[] = top2.map(([k, pct], i) => ({ type: 'card', key: k, pct, top: i === 0 }))
  const showRenu = !top2.find(([k]) => k === 'renu')
  if (showRenu) {
    items.push({ type: 'divider' })
    const rp = ranked.find(([k]) => k === 'renu')?.[1] ?? 52
    items.push({ type: 'card', key: 'renu', pct: rp, top: false })
  }
  return items
}

function buildFallbackSummary(a: Answers, ranked: Ranked): ReactNode[] {
  const topKey = ranked[0]?.[0]
  const topName = topKey ? PUMPS[topKey].name : PUMPS.m780g.name
  const ps: ReactNode[] = []

  if (a.hypo === 'freq') {
    ps.push(
      <p key="signal">
        One of the most important signals in your profile is how frequently you experience low blood sugar. This is
        a strong clinical reason to consider Hybrid Closed-Loop automation — the Medtronic 780G's SmartGuard system
        can automatically reduce insulin when it senses your levels dropping, including overnight when lows are
        hardest to catch.
      </p>,
    )
  } else if (a.auto === 'high') {
    ps.push(
      <p key="signal">
        Since automation is very important to you, the Medtronic 780G stands out as the only pump currently
        available in India with a Hybrid Closed-Loop system — it reads your glucose every 5 minutes and adjusts
        insulin automatically, significantly reducing the day-to-day mental effort of managing your diabetes.
      </p>,
    )
  } else if (a.budget === 'low') {
    ps.push(
      <p key="signal">
        Your budget is below the cost of the two pumps currently available in India. The upcoming Renu MedTech
        InsuPatch is expected to be significantly more affordable, but it is not yet commercially available. Your
        doctor can advise on whether to wait for it or explore insurance coverage for existing pumps.
      </p>,
    )
  }

  if (a.ptype === 'patch') {
    ps.push(
      <p key="ptype">
        You prefer a tubeless, patch-style design. Both pumps currently available in India — the Medtronic 780G and
        mylife YpsoPump — are tubed. The InsuPatch from Renu MedTech will be India's first patch pump, so it may be
        worth tracking for when it launches.
      </p>,
    )
  }

  ps.push(
    <p key="verdict">
      Based on your answers, your top match is <strong>{topName}</strong>. Do keep in mind that pump consumables —
      infusion sets and CGM sensors — typically add ₹10,000–₹25,000 per month beyond the device cost, so plan your
      budget accordingly. Your next step is to bring these results to your endocrinologist, who can review your
      complete history and guide you through starting pump therapy.
    </p>,
  )

  return ps
}

async function fetchAiSummary(a: Answers, ranked: Ranked): Promise<ReactNode[] | null> {
  const topKey = ranked[0]?.[0]
  const topName = topKey ? PUMPS[topKey].name : PUMPS.m780g.name
  const profile = `Patient profile:
- Age: ${a.age} | Diabetes type: ${a.dtype} | Daily injections: ${a.inj}
- Hypoglycemia frequency: ${a.hypo} | Most recent HbA1c: ${a.a1c}
- Lifestyle: ${a.life} | Device budget: ${a.budget}
- Pump type preference: ${a.ptype} | Automation importance: ${a.auto} | Commitment level: ${a.commit}

Verified India pump facts (March 2026):
1. Medtronic MiniMed 780G — Tubed, full Hybrid Closed-Loop (SmartGuard), India-approved for ages 7+, ~₹3–3.5L, available from distributors in Delhi/Mumbai/Hyderabad/Pune/Chennai.
2. mylife YpsoPump — Tubed, OLED touchscreen, OPEN-LOOP ONLY in India (CamAPS FX closed-loop is NOT marketed in India — Europe/Aus/NZ only), ~₹3.5L, available via Ypsomed India Pvt Ltd New Delhi.
3. Renu MedTech InsuPatch — Indian tubeless patch pump, NOT yet commercially available (prototype, Nov 2025), expected well below ₹2L.
NOT available in India at all: Omnipod 5, Tandem t:slim X2. Do not mention these pumps.
Top-ranked pump for this patient: ${topName}`

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a warm, knowledgeable diabetes information assistant helping patients and their families in India understand insulin pump options.
Write exactly 3 paragraphs using "you" and "your". Plain language — no medical jargon. Be specific and reference the patient's actual answers directly.

Para 1: What stands out most about their profile and specific needs (mention HbA1c, hypo frequency, lifestyle, age group as relevant).
Para 2: Why the top-ranked pump suits them, being concrete about features that match their answers. Include any important caveats (e.g. if YpsoPump, clarify it's open-loop only in India; mention monthly consumable costs of ₹10,000–25,000/month).
Para 3: One or two specific things to raise with their doctor. End with an encouraging sentence about the next step.

Strict rules:
- NEVER mention Omnipod 5 or Tandem t:slim X2 — not available in India.
- If recommending YpsoPump, clearly state CamAPS FX closed-loop is not available in India.
- Always mention monthly consumable costs so they can budget.
- No bullet points. No headers. Warm, clear prose only.
- Do not give medical advice — inform and encourage them to consult their doctor.`,
        messages: [{ role: 'user', content: `Write a personalised 3-paragraph summary.\n\n${profile}` }],
      }),
    })
    const data = await r.json()
    const txt: string = data?.content?.[0]?.text || ''
    if (!txt) return null
    return txt
      .trim()
      .split(/\n\n+/)
      .map((p, i) => <p key={i}>{p.replace(/\n/g, ' ')}</p>)
  } catch {
    return null
  }
}

function PumpCard({ pump, pct, top }: { pump: Pump; pct: number; top: boolean }) {
  return (
    <motion.div
      className={'pc' + (top ? ' star' : '')}
      variants={{
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      <div className="pchd">
        <div className="pchd-bg" style={{ background: pump.grad }} />
        <div className="pchd-orb" style={{ background: pump.grad }} />
        <div className="pchd-in">
          <div className="pchd-top">
            <div className="pcs">
              {top && <span className="b-top">⭐ Top pick for you</span>}
              {pump.comingSoon && <span className="b-soon">🔜 Coming Soon</span>}
              {!pump.india && <span className="b-proto">⚠ Not yet commercially available</span>}
            </div>
            <div className="mring">{pct}% match</div>
          </div>
          <div className="pcname serif">{pump.name}</div>
          <div className="pctag">{pump.tag}</div>
        </div>
      </div>
      <div className="pcbody">
        <div className="prow">
          <div>
            <div className="pnum">{pump.price}</div>
            <div className="pnote">{pump.pnote}</div>
          </div>
          <div className="ptags">
            <span className="pt pt-jade">{pump.type}</span>
            <span className={'pt ' + pump.ac}>{pump.avail}</span>
          </div>
        </div>

        <div className="slbl">Best suited for</div>
        <div className="tagrow">
          {pump.bestFor.map((t) => (
            <span key={t} className="tg">
              {t}
            </span>
          ))}
        </div>

        <div className="slbl">Key features</div>
        <div className="feats">
          {pump.feats.map((f, i) => (
            <div key={i} className="feat">
              <span className="fa">→</span>
              {f}
            </div>
          ))}
        </div>

        <div className="slbl">Advantages &amp; limitations</div>
        <div className="pcgrid">
          <div className="pcc">
            <h5 className="ph">Advantages</h5>
            <div className="pcl">
              {pump.pros.map((x, i) => (
                <div key={i} className="pci">
                  <span className="ps sy">✓</span>
                  {x}
                </div>
              ))}
            </div>
          </div>
          <div className="pcc">
            <h5 className="ch">Limitations</h5>
            <div className="pcl">
              {pump.cons.map((x, i) => (
                <div key={i} className="pci">
                  <span className="ps sn">✗</span>
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="cta">
          <a href={pump.ctaUrl} target="_blank" rel="noopener noreferrer" className={'cta-a ' + pump.ctaC}>
            {pump.ctaTxt} →
          </a>
          {pump.ctaNote && <p className="cnote">{pump.ctaNote}</p>}
        </div>
      </div>
    </motion.div>
  )
}

export default function InsulinPumpFinder() {
  const [screen, setScreen] = useState<Screen>('land')
  const [step, setStep] = useState(0)
  const [ans, setAns] = useState<Answers>({})
  const [resultsToken, setResultsToken] = useState(0)
  const [aiParagraphs, setAiParagraphs] = useState<ReactNode[] | null>(null)
  const [aiLoading, setAiLoading] = useState(false)

  const ranked = useMemo(() => calcScore(ans), [ans])
  const cardItems = useMemo(() => buildCardItems(ranked), [ranked])

  const currentQ = QUIZ_QUESTIONS[step]
  const isLastQ = step === QUIZ_QUESTIONS.length - 1
  const canAdvance = !!ans[currentQ.id]

  const goQuiz = useCallback(() => {
    setStep(0)
    setAns({})
    setScreen('quiz')
  }, [])

  const goRestart = useCallback(() => {
    setScreen('land')
  }, [])

  const pick = useCallback((qid: string, val: string) => {
    setAns((prev) => ({ ...prev, [qid]: val }))
  }, [])

  const goNext = useCallback(() => {
    if (!ans[QUIZ_QUESTIONS[step].id]) return
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      setResultsToken((t) => t + 1)
      setScreen('results')
    }
  }, [step, ans])

  const goBack = useCallback(() => {
    setStep((s) => (s > 0 ? s - 1 : s))
  }, [])

  // Scroll to top on screen change, mirroring the original single-page app's show().
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [screen])

  // Keyboard navigation while the quiz is active.
  useEffect(() => {
    if (screen !== 'quiz') return
    const handler = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === 'ArrowRight') && canAdvance) goNext()
      if (e.key === 'ArrowLeft') goBack()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [screen, canAdvance, goNext, goBack])

  // Fetch (or fall back to) the AI summary each time a fresh set of results is produced.
  useEffect(() => {
    if (screen !== 'results' || resultsToken === 0) return
    let cancelled = false
    setAiLoading(true)
    setAiParagraphs(null)
    const snapshotAns = ans
    const snapshotRanked = ranked
    ;(async () => {
      const aiText = await fetchAiSummary(snapshotAns, snapshotRanked)
      if (cancelled) return
      setAiParagraphs(aiText ?? buildFallbackSummary(snapshotAns, snapshotRanked))
      setAiLoading(false)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultsToken])

  return (
    <div className="pump-finder-tool">
      <div className="pf-bg" />
      <div className="pf-bg-grain" />

      <Link to="/" className="pf-back">
        ← Back to tools
      </Link>

      <AnimatePresence mode="wait">
        {screen === 'land' && (
          <motion.div
            key="land"
            id="land"
            className="screen"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="lw">
              <div className="chip">
                <div className="chip-d">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="chip-t">🇮🇳 India 2026 · AI-assisted</span>
              </div>
              <h1 className="lh serif">
                Find your <em>perfect</em>
                <br />
                insulin pump
              </h1>
              <p className="ls">
                Answer 10 simple questions about your health, lifestyle, and budget. Get a personalised, AI-explained
                shortlist of pumps that are actually sold in India right now.
              </p>
              <div className="lcard">
                <div className="lrow">
                  <div className="lico">💛</div>
                  <div className="ltxt">
                    <h4>Why this exists</h4>
                    <p>
                      A friend was overwhelmed trying to choose an insulin pump. I researched the
                      options sold in India and turned it into a short quiz that points you to the
                      right one based on how you actually live.
                    </p>
                  </div>
                </div>
                <div className="sep" />
                <div className="lrow">
                  <div className="lico">🩺</div>
                  <div className="ltxt">
                    <h4>How it works</h4>
                    <p>
                      Our algorithm scores India-available pumps against your specific profile, then Claude AI writes
                      a plain-language explanation of why each one suits you — no jargon, no guesswork.
                    </p>
                  </div>
                </div>
                <div className="sep" />
                <div className="wbar">
                  ⚠️ <strong>Not medical advice.</strong> This is an information tool only. Always consult your
                  endocrinologist or diabetes care team before choosing an insulin pump.
                </div>
              </div>
              <div className="badges">
                <span className="bdg">⏱ ~3 minutes</span>
                <span className="bdg">🔒 Nothing stored</span>
                <span className="bdg">🇮🇳 India-verified devices</span>
                <span className="bdg">🤖 AI explanation</span>
                <span className="bdg">🖨 Printable results</span>
              </div>
              <button className="btn btn-p" onClick={goQuiz}>
                Start Questionnaire
                <ArrowIcon />
              </button>
              <p style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: '.73rem', marginTop: 11 }}>
                10 questions · Free · No login required
              </p>
            </div>
          </motion.div>
        )}

        {screen === 'quiz' && (
          <motion.div
            key="quiz"
            id="quiz"
            className="screen"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="qw">
              <div className="qtop">
                <span className="qbrand">Pump Finder</span>
                <span className="qnum">
                  {step + 1} / {QUIZ_QUESTIONS.length}
                </span>
              </div>
              <div className="prog-rail">
                <div className="prog-bar" style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  className="qcard"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="qemo">{currentQ.e}</div>
                  <h2 className="qh serif">{currentQ.h}</h2>
                  <div className="qhint">{currentQ.hint}</div>
                  <div className="opts">
                    {currentQ.opts.map((o) => (
                      <button
                        type="button"
                        key={o.v}
                        className={'opt' + (ans[currentQ.id] === o.v ? ' sel' : '')}
                        onClick={() => pick(currentQ.id, o.v)}
                      >
                        <div className="opt-rb" />
                        <div>
                          <div className="opt-l">{o.l}</div>
                          {o.s && <div className="opt-s">{o.s}</div>}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="nav-row">
                {step > 0 && (
                  <button className="btn btn-g" onClick={goBack}>
                    ← Back
                  </button>
                )}
                <button className="btn btn-p" onClick={goNext} disabled={!canAdvance}>
                  <span>{isLastQ ? 'See My Results →' : 'Next'}</span>
                  {!isLastQ && <ArrowIcon />}
                </button>
              </div>
              <p style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: '.71rem', marginTop: 14 }}>
                Answers never stored or shared
              </p>
            </div>
          </motion.div>
        )}

        {screen === 'results' && (
          <motion.div
            key="results"
            id="results"
            className="screen"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rw">
              <div className="rhdr">
                <div className="rchip">
                  <svg viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Your personalised results
                </div>
                <h2 className="rh serif">
                  Here are your
                  <br />
                  <em>best matches</em>
                </h2>
                <p className="rsub">Ranked by how well each pump fits your specific needs, lifestyle, and budget.</p>
              </div>

              <div className="aibox">
                <div className="aihead">
                  <span className="aipill">AI Summary</span>
                  <span className="ailbl">Personalised explanation of your results</span>
                </div>
                <div id="aibody">
                  {aiLoading || !aiParagraphs ? (
                    <div className="thinking">
                      <div className="dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      Generating your personalised summary…
                    </div>
                  ) : (
                    aiParagraphs
                  )}
                </div>
              </div>

              <div className="disc">
                ⚠️ <strong>Important disclaimer:</strong> This tool is for information only — not medical advice.
                Prices are approximate, sourced from Indian distributor listings (early 2026), and may vary by city
                and supplier. Always consult a qualified endocrinologist or diabetologist before purchasing any
                insulin pump. Device availability and features can change without notice.
              </div>

              <motion.div
                className="cards"
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.12 } } }}
              >
                {cardItems.map((item, i) =>
                  item.type === 'divider' ? (
                    <div key={`divider-${i}`} className="dlbl">
                      Also on the horizon
                    </div>
                  ) : (
                    <PumpCard key={item.key} pump={PUMPS[item.key]} pct={item.pct} top={item.top} />
                  ),
                )}
              </motion.div>

              <div className="actrow">
                <button
                  className="btn btn-g"
                  style={{ width: 'auto', padding: '11px 22px', fontSize: '.85rem' }}
                  onClick={() => window.print()}
                >
                  🖨 Print / Save PDF
                </button>
                <button
                  className="btn btn-p"
                  style={{ maxWidth: 200, fontSize: '.85rem', padding: '11px 22px' }}
                  onClick={goRestart}
                >
                  ↺ Start Over
                </button>
              </div>

              <div className="rft">
                <p>
                  Data verified <strong>March 2026</strong> · Only pumps with confirmed India sales presence are
                  shown
                </p>
                <p>
                  <strong>Not available in India:</strong> Omnipod 5 (Insulet) &amp; Tandem t:slim X2 — excluded from
                  results
                </p>
                <p>
                  YpsoPump CamAPS FX closed-loop available in Europe, Australia &amp; NZ — <strong>not in India</strong>
                </p>
                <p style={{ marginTop: 4 }}>Always verify current pricing and availability with your hospital or local distributor</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
