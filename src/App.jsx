import { useState, useEffect, useRef } from 'react'

/* ── SVG Illustrations (Bauhaus sketch style) ── */

function TransformationMan({ className }) {
  return (
    <svg className={className} viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="80" rx="45" ry="50" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M155 130 Q120 140 100 180 Q90 210 95 250" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M245 130 Q280 140 300 180 Q310 210 305 250" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M95 250 Q80 300 100 350 Q130 400 200 410 Q270 400 300 350 Q320 300 305 250" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M150 400 Q140 440 135 480" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M250 400 Q260 440 265 480" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M120 200 Q160 195 180 210" stroke="#0a0a0a" strokeWidth="1" opacity="0.1" fill="none"/>
      <path d="M130 270 Q180 260 200 280" stroke="#0a0a0a" strokeWidth="1" opacity="0.1" fill="none"/>
    </svg>
  )
}

function TransformationWoman({ className }) {
  return (
    <svg className={className} viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="200" cy="75" rx="40" ry="45" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M160 60 Q155 30 170 20 Q190 10 210 15 Q230 20 240 40 Q245 55 240 70" stroke="#0a0a0a" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M160 60 Q140 80 135 120" stroke="#0a0a0a" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"/>
      <path d="M240 55 Q260 75 265 115" stroke="#0a0a0a" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round"/>
      <path d="M160 120 Q125 135 110 170 Q100 200 105 240" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M240 120 Q275 135 290 170 Q300 200 295 240" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M105 240 Q90 290 105 340 Q125 385 200 400 Q275 385 295 340 Q310 290 295 240" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.6" strokeLinecap="round"/>
      <path d="M155 390 Q145 430 140 480" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
      <path d="M245 390 Q255 430 260 480" stroke="#0a0a0a" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round"/>
    </svg>
  )
}

function PhoneSketch({ className }) {
  return (
    <svg className={className} viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="10" width="140" height="320" stroke="#0a0a0a" strokeWidth="3" fill="none"/>
      <rect x="40" y="40" width="120" height="250" stroke="#0a0a0a" strokeWidth="2" fill="rgba(10,10,10,0.02)"/>
      <circle cx="100" cy="25" r="5" stroke="#0a0a0a" strokeWidth="2" fill="none"/>
      <ellipse cx="100" cy="140" rx="45" ry="30" stroke="#0a0a0a" strokeWidth="2" fill="none"/>
      <path d="M80 130 Q90 120 100 125 Q110 120 115 130" stroke="#0a0a0a" strokeWidth="1.5" fill="none"/>
      <circle cx="90" cy="145" r="8" stroke="#0a0a0a" strokeWidth="1" fill="none"/>
      <circle cx="100" cy="210" r="18" stroke="#d32027" strokeWidth="3" fill="none"/>
      <circle cx="100" cy="210" r="7" fill="#d32027" opacity="0.3"/>
      <line x1="70" y1="305" x2="130" y2="305" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  )
}

function CoachIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="22" stroke="#0a0a0a" strokeWidth="2" fill="none"/>
      <circle cx="24" cy="18" r="8" stroke="#0a0a0a" strokeWidth="2" fill="none"/>
      <path d="M10 42 Q10 32 24 30 Q38 32 38 42" stroke="#0a0a0a" strokeWidth="2" fill="none"/>
      <path d="M32 14 L38 8" stroke="#d32027" strokeWidth="3" strokeLinecap="round"/>
      <path d="M36 12 L40 10" stroke="#d32027" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="39" cy="7" r="3" fill="#d32027" opacity="0.5"/>
    </svg>
  )
}

/* Hand-drawn swash underline — draws once on mount */
function SwashUnderline() {
  const pathRef = useRef(null)
  useEffect(() => {
    const path = pathRef.current
    if (!path) return
    const len = path.getTotalLength()
    path.style.strokeDasharray = len
    path.style.strokeDashoffset = len
    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 0.8s ease-out'
      path.style.strokeDashoffset = '0'
    })
  }, [])
  return (
    <svg className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] w-[105%]" viewBox="0 0 300 18" fill="none" preserveAspectRatio="none">
      <path
        ref={pathRef}
        d="M5 12 Q40 4 75 13 Q110 20 150 9 Q190 0 225 12 Q260 20 295 8"
        stroke="#d32027"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* Geometric primitives — Kandinsky: circle=red, square=yellow, triangle=blue */
function GeoDivider() {
  return (
    <div className="geo-divider">
      <svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#d32027"/></svg>
      <svg width="18" height="18" viewBox="0 0 18 18"><rect width="16" height="16" x="1" y="1" fill="#f5c518"/></svg>
      <svg width="20" height="20" viewBox="0 0 20 20"><polygon points="10,2 18,18 2,18" fill="#1c4fb5"/></svg>
    </div>
  )
}

function Section({ children, className = '' }) {
  return <section className={className}>{children}</section>
}

const SHEET_WEBHOOK = 'https://script.google.com/macros/s/AKfycbxDU04c5C9jj-5uM2EZROy5PWi9L1f1uqhWcYQM4DedALb4x1O2c-OssVt6nUAskPvb/exec'

/* ── Main App ── */
export default function App() {
  const [email, setEmail] = useState('')
  const [honey, setHoney] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (honey) return
    if (!email || !email.includes('@') || !email.includes('.')) return

    setStatus('sending')
    try {
      await fetch(SHEET_WEBHOOK, {
        method: 'POST',
        mode: 'no-cors',
        body: new URLSearchParams({ email, timestamp: new Date().toISOString() }),
      })
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-paper">

      {/* ═══════════ HERO ═══════════ */}
      <header className="relative overflow-hidden px-[16px] pt-[32px] pb-[64px] md:pt-[48px] md:pb-[96px]">
        {/* Logo */}
        <div className="text-center mb-[32px]">
          <span className="font-sketch text-3xl md:text-4xl text-ink tracking-wide">
            MyBestShape
          </span>
        </div>

        {/* Transformation figures + CTA */}
        <div className="max-w-6xl mx-auto relative">
          <div className="flex items-end justify-center gap-0 md:gap-[16px]">
            <div className="w-1/3 md:w-1/4 flex justify-end">
              <TransformationMan className="w-full max-w-[280px] h-auto" />
            </div>

            <div className="w-full md:w-1/2 text-center px-[16px] py-[32px] z-10">
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-ink leading-none mb-[24px]" style={{ fontWeight: 800 }}>
                LOSE <span className="relative inline-block">WEIGHT<SwashUnderline /></span><br/>
                <span className="font-sketch text-red text-4xl md:text-6xl lg:text-8xl" style={{ textTransform: 'none' }}>Without Counting</span><br/>
                EVERY CALORIE
              </h1>
              <p className="font-body text-gray-400 text-lg md:text-xl mb-[8px] max-w-md mx-auto">
                Share a photo of your meal.
              </p>
              <p className="font-body text-gray-400 text-lg md:text-xl mb-[8px] max-w-md mx-auto">
                Get instant guidance from your AI Nutrition Coach.
              </p>
              <p className="font-body text-gray-400 text-lg md:text-xl mb-[32px] max-w-md mx-auto">
                Track your calories, habits, and progress every day.
              </p>

              {status === 'success' ? (
                <div className="max-w-sm mx-auto card-featured p-[32px]">
                  <p className="font-sketch text-2xl text-red mb-[8px]">Welcome!</p>
                  <p className="font-body text-gray-400">
                    Check your inbox at <strong className="text-ink">{email}</strong> — your free trial starts now.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                  <p className="font-sketch text-gray-400 text-xl mb-[16px]">Start Your Free 3-Day Trial</p>
                  {/* Honeypot — hidden from humans, visible to bots */}
                  <input
                    type="text"
                    name="website"
                    value={honey}
                    onChange={e => setHoney(e.target.value)}
                    style={{ position: 'absolute', left: '-9999px', tabIndex: -1 }}
                    autoComplete="off"
                    aria-hidden="true"
                  />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="mb-[20px] text-center"
                  />
                  <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={status === 'sending'}
                    style={{ opacity: status === 'sending' ? 0.6 : 1 }}
                  >
                    {status === 'sending' ? 'SENDING...' : 'START FREE'}
                  </button>
                  {status === 'error' && (
                    <p className="text-red text-sm mt-[12px] font-body">Something went wrong — please try again.</p>
                  )}
                  <p className="text-gray-300 text-sm mt-[12px] font-body">No credit card required.</p>
                </form>
              )}
            </div>

            <div className="w-1/3 md:w-1/4 flex justify-start">
              <TransformationWoman className="w-full max-w-[280px] h-auto" />
            </div>
          </div>
        </div>
      </header>

      <hr className="bauhaus-rule max-w-4xl mx-auto" />

      {/* ═══════════ BY THE NUMBERS ═══════════ */}
      <Section className="py-[48px] px-[16px]" style={{ borderBottom: '3px solid #0a0a0a' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-[16px] text-center">
          <div>
            <p className="font-display text-4xl md:text-6xl text-ink" style={{ fontWeight: 800, lineHeight: 0.9 }}>900+</p>
            <p className="font-display text-xs md:text-sm text-gray-400 tracking-widest mt-[8px]">MEALS ANALYZED</p>
          </div>
          <div>
            <p className="font-display text-4xl md:text-6xl text-red" style={{ fontWeight: 800, lineHeight: 0.9 }}>4.9<span className="text-yellow">★</span></p>
            <p className="font-display text-xs md:text-sm text-gray-400 tracking-widest mt-[8px]">USER RATING</p>
          </div>
          <div>
            <p className="font-display text-4xl md:text-6xl text-ink" style={{ fontWeight: 800, lineHeight: 0.9 }}>7</p>
            <p className="font-display text-xs md:text-sm text-gray-400 tracking-widest mt-[8px]">DAYS TO SEE RESULTS</p>
          </div>
        </div>
      </Section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <Section className="py-[64px] md:py-[96px] px-[16px]">
        <div className="max-w-5xl mx-auto">
          <p className="section-label text-center mb-[16px]">The Process</p>
          <h2 className="font-display text-4xl md:text-5xl text-center text-ink mb-[64px]">
            HOW IT WORKS
          </h2>

          <div className="grid md:grid-cols-3 gap-[48px] md:gap-[32px]">
            {/* Step 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-[24px]">
                <PhoneSketch className="w-32 h-auto" />
              </div>
              <div className="flex justify-center mb-[8px]">
                <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#d32027"/></svg>
              </div>
              <h3 className="font-display text-xl text-ink mb-[12px]">SHARE YOUR DISH</h3>
              <p className="font-body text-gray-400 leading-relaxed">
                Take a photo of your breakfast, lunch, dinner, or snack.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-[24px]">
                <svg width="128" height="128" viewBox="0 0 128 128" fill="none">
                  <circle cx="64" cy="64" r="50" stroke="#0a0a0a" strokeWidth="3" fill="none" strokeDasharray="6 4"/>
                  <path d="M44 64 L58 78 L84 50" stroke="#d32027" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="flex justify-center mb-[8px]">
                <svg width="22" height="22" viewBox="0 0 22 22"><rect width="20" height="20" x="1" y="1" fill="#f5c518"/></svg>
              </div>
              <h3 className="font-display text-xl text-ink mb-[12px]">AI ANALYZES YOUR MEAL</h3>
              <p className="font-body text-gray-400 leading-relaxed">
                Our nutrition engine estimates calories, protein, carbs, fat, meal quality score, and weight-loss impact.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-[24px]">
                <svg width="128" height="128" viewBox="0 0 128 128" fill="none">
                  <path d="M20 30 Q20 15 35 15 L93 15 Q108 15 108 30 L108 75 Q108 90 93 90 L50 90 L35 108 L38 90 L35 90 Q20 90 20 75 Z" stroke="#0a0a0a" strokeWidth="3" fill="none"/>
                  <line x1="35" y1="38" x2="93" y2="38" stroke="#0a0a0a" strokeWidth="2" opacity="0.3" strokeLinecap="round"/>
                  <line x1="35" y1="52" x2="80" y2="52" stroke="#0a0a0a" strokeWidth="2" opacity="0.3" strokeLinecap="round"/>
                  <line x1="35" y1="66" x2="70" y2="66" stroke="#d32027" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex justify-center mb-[8px]">
                <svg width="24" height="22" viewBox="0 0 24 22"><polygon points="12,2 22,20 2,20" fill="#1c4fb5"/></svg>
              </div>
              <h3 className="font-display text-xl text-ink mb-[12px]">RECEIVE INSTANT COACHING</h3>
              <p className="font-body text-gray-400 leading-relaxed mb-[16px]">
                Get practical advice immediately.
              </p>
              <div className="space-y-[8px] text-left max-w-xs mx-auto">
                {[
                  '"Reduce bread at dinner today."',
                  '"Great protein intake. Keep it up."',
                  '"Add vegetables to improve satiety."',
                  '"Drink more water this afternoon."'
                ].map((tip, i) => (
                  <p key={i} className="font-sketch text-gray-400 text-lg italic pl-[16px]" style={{ borderLeft: '3px solid #d32027' }}>
                    {tip}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <GeoDivider />

      {/* ═══════════ DAILY DASHBOARD ═══════════ */}
      <Section className="py-[64px] md:py-[96px] px-[16px]">
        <div className="max-w-4xl mx-auto">
          <p className="section-label text-center mb-[16px]">Dashboard Preview</p>
          <h2 className="font-display text-4xl md:text-5xl text-center text-ink mb-[64px]">
            YOUR DAILY DASHBOARD
          </h2>

          {/* Calorie target */}
          <div className="card p-[32px] md:p-[40px] mb-[32px]">
            <h3 className="font-display text-xl text-ink mb-[24px]">DAILY CALORIE TARGET</h3>
            <div className="grid grid-cols-3 gap-[24px] text-center">
              <div>
                <p className="section-label mb-[4px]">Today's Goal</p>
                <p className="font-display text-3xl md:text-4xl text-ink mt-[4px]">1,850</p>
                <p className="font-body text-gray-300 text-sm">Calories</p>
              </div>
              <div>
                <p className="section-label mb-[4px]">Consumed</p>
                <p className="font-display text-3xl md:text-4xl text-red mt-[4px]">1,240</p>
                <p className="font-body text-gray-300 text-sm">Calories</p>
              </div>
              <div>
                <p className="section-label mb-[4px]">Remaining</p>
                <p className="font-display text-3xl md:text-4xl text-ink mt-[4px]">610</p>
                <p className="font-body text-gray-300 text-sm">Calories</p>
              </div>
            </div>
            {/* Progress bar — flat, no gradient */}
            <div className="mt-[24px] h-[12px] bg-gray-100 overflow-hidden">
              <div className="h-full bg-red" style={{ width: '67%' }} />
            </div>
          </div>

          {/* Meals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[32px]">
            {[
              { meal: 'Breakfast', cal: 420, icon: '☀' },
              { meal: 'Lunch', cal: 520, icon: '◐' },
              { meal: 'Dinner', cal: 300, icon: '☽' },
              { meal: 'Snacks', cal: 0, icon: '·' },
            ].map(({ meal, cal, icon }) => (
              <div key={meal} className="card p-[20px] text-center">
                <div className="text-2xl mb-[8px] opacity-30">{icon}</div>
                <p className="font-display text-sm tracking-widest text-ink">{meal.toUpperCase()}</p>
                <p className="font-display text-2xl text-ink mt-[4px]">{cal}</p>
                <p className="font-body text-gray-300 text-xs">Calories</p>
              </div>
            ))}
          </div>

          {/* Progress Timeline */}
          <div className="card p-[32px] md:p-[40px]">
            <h3 className="font-display text-xl text-ink mb-[24px]">PROGRESS TIMELINE</h3>
            <div className="flex items-end justify-between gap-[8px] h-40">
              {[
                { day: 'Day 1', cal: 1950, h: 100 },
                { day: 'Day 2', cal: 1780, h: 85 },
                { day: 'Day 3', cal: 1640, h: 72 },
                { day: 'Day 4', cal: 1510, h: 60 },
                { day: 'Day 5', cal: 1400, h: 50 },
                { day: 'Day 6', cal: 1350, h: 45 },
                { day: 'Day 7', cal: 1300, h: 40 },
              ].map(({ day, cal, h }) => (
                <div key={day} className="flex-1 flex flex-col items-center">
                  <p className="font-mono text-xs text-gray-300 mb-[4px]">{cal}</p>
                  <div
                    className="w-full max-w-[40px] bg-ink"
                    style={{ height: `${h}%` }}
                  />
                  <p className="font-display text-xs text-gray-400 mt-[8px] tracking-wider">{day.replace('Day ', 'D')}</p>
                </div>
              ))}
            </div>
            <svg className="w-full h-[32px] mt-[8px]" viewBox="0 0 700 30" fill="none">
              <path d="M50 25 Q150 22 200 18 Q300 12 400 8 Q500 4 650 2" stroke="#d32027" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="6 4"/>
            </svg>
            <p className="font-display text-center text-gray-300 text-xs tracking-widest mt-[4px]">CALORIES TRENDING DOWN →</p>
          </div>
        </div>
      </Section>

      <hr className="bauhaus-rule-red max-w-4xl mx-auto" />

      {/* ═══════════ LIVE COACH ═══════════ */}
      <Section className="py-[64px] md:py-[96px] px-[16px]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-[48px]">
            <div className="flex justify-center mb-[16px]">
              <CoachIcon />
            </div>
            <p className="section-label mb-[12px]">AI-Powered</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-[16px]">
              LIVE COACH
            </h2>
            <p className="font-display text-xl text-gray-400 mb-[8px]">
              YOUR PERSONAL NUTRITION COACH — AVAILABLE 24/7
            </p>
            <div className="badge-red inline-block badge mt-[16px]">
              40+ NUTRITION RESEARCH FILES
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-[32px]">
            <div className="card p-[24px]">
              <h3 className="font-display text-lg text-ink mb-[16px]">TRAINED TO GUIDE YOU ON</h3>
              <ul className="space-y-[12px] font-body text-gray-400">
                {[
                  'Food habits & meal balance',
                  'Weight-loss principles',
                  'Calorie management',
                  'Portion control',
                  'Sustainable eating behavior',
                  'Long-term healthy routines',
                  'Gut health & inflammation',
                  'Hormonal & cycle-aware nutrition',
                ].map(item => (
                  <li key={item} className="check-item flex items-start">{item}</li>
                ))}
              </ul>
            </div>

            <div className="card p-[24px]">
              <h3 className="font-display text-lg text-ink mb-[16px]">ASK QUESTIONS ANYTIME</h3>
              <div className="space-y-[16px]">
                {[
                  'What should I eat tonight?',
                  'I had pizza. What should I do next?',
                  'How many calories are in this meal?',
                  'How can I reduce belly fat?',
                  'Is intermittent fasting good for me?',
                  'I feel bloated after eating — why?',
                ].map(q => (
                  <div key={q} className="flex gap-[12px] items-start">
                    <span className="text-red text-lg font-bold shrink-0">→</span>
                    <p className="font-sketch text-gray-400 text-lg italic">"{q}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <GeoDivider />

      {/* ═══════════ FOCUSED ON REAL RESULTS ═══════════ */}
      <Section className="py-[64px] md:py-[96px] px-[16px]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label mb-[16px]">Our Promise</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-[40px]">
            FOCUSED ON REAL RESULTS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-[48px]">
            {[
              'NOT bodybuilding.',
              'NOT extreme dieting.',
              'NOT calorie obsession.',
            ].map(no => (
              <div key={no} className="card p-[20px]">
                <span className="font-display text-3xl text-gray-200">✕</span>
                <p className="font-display text-gray-400 mt-[8px] text-sm tracking-wider">{no.toUpperCase()}</p>
              </div>
            ))}
          </div>

          <p className="font-display text-2xl text-ink mb-[32px]">
            THIS IS <span className="font-sketch text-red text-3xl" style={{ textTransform: 'none' }}>sustainable fat loss.</span>
          </p>

          <div className="max-w-md mx-auto text-left space-y-[12px]">
            {[
              'Belly fat reduction',
              'Better eating habits',
              'Healthy weight management',
              'Daily accountability',
              'Long-term consistency',
            ].map(item => (
              <p key={item} className="check-item flex items-center font-body text-lg text-gray-400">
                {item}
              </p>
            ))}
          </div>
        </div>
      </Section>

      <hr className="bauhaus-rule max-w-4xl mx-auto" />

      {/* ═══════════ PRICING ═══════════ */}
      <Section className="py-[64px] md:py-[96px] px-[16px]">
        <div className="max-w-lg mx-auto text-center">
          <p className="section-label mb-[16px]">One Plan</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-[48px]">
            SIMPLE PRICING
          </h2>

          <div className="card-featured p-[40px]">
            <div className="badge-red badge mb-[24px]">
              3 DAYS FREE
            </div>

            <p className="font-display text-gray-400 text-lg mb-[8px]">THEN</p>

            <div className="mb-[24px]">
              <span className="font-display text-5xl text-ink">€4.99</span>
              <span className="font-body text-gray-400 text-lg"> / month</span>
            </div>

            <div className="text-left max-w-xs mx-auto space-y-[12px] mb-[32px]">
              {[
                'Unlimited meal analysis',
                'Unlimited coaching',
                'Progress tracking',
                'Daily calorie monitoring',
                'Personalized recommendations',
                'Email notifications & reminders',
              ].map(item => (
                <p key={item} className="check-item flex items-center font-body text-gray-400">
                  {item}
                </p>
              ))}
            </div>

            <button
              className="btn-primary w-full"
              onClick={() => document.querySelector('input[type="email"]')?.focus() || window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              START FREE
            </button>
          </div>
        </div>
      </Section>

      <hr className="bauhaus-rule-red max-w-4xl mx-auto" />

      {/* ═══════════ FINAL CTA ═══════════ */}
      <Section className="py-[80px] md:py-[128px] px-[16px] text-center">
        <h2 className="font-display text-3xl md:text-5xl text-ink mb-[12px]">
          SHARE YOUR DISH.
        </h2>
        <h2 className="font-sketch text-4xl md:text-6xl text-red mb-[40px]" style={{ textTransform: 'none' }}>
          Shape Your Future.
        </h2>
        <p className="font-body text-gray-400 text-lg mb-[32px]">
          Start your free 3-day trial today.
        </p>
        <button
          className="btn-dark text-2xl px-[48px] py-[20px]"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          START FREE
        </button>
      </Section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-[32px] px-[16px] text-center" style={{ borderTop: '4px solid #0a0a0a' }}>
        <p className="font-sketch text-xl text-ink mb-[8px]">MyBestShape</p>
        <p className="font-body text-gray-300 text-sm">
          Share Your Dish. Shape Your Future.
        </p>
        <p className="font-body text-gray-200 text-xs mt-[16px]">
          © {new Date().getFullYear()} MyBestShape. All rights reserved.
        </p>
      </footer>

    </div>
  )
}
