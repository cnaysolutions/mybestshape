import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Onboarding({ user, onDone }) {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('male')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [goal, setGoal] = useState('lose')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!weight || !height || !age) return

    setSaving(true)
    setError('')
    const { error: upsertError } = await supabase.from('profiles').upsert({
      user_id: user.id,
      weight_kg: Number(weight),
      height_cm: Number(height),
      age: Number(age),
      sex,
      activity_level: activityLevel,
      goal,
    })
    setSaving(false)
    if (upsertError) {
      setError(upsertError.message)
      return
    }
    onDone()
  }

  return (
    <div className="min-h-screen bg-paper px-[16px] py-[32px] flex items-center">
      <div className="max-w-sm mx-auto w-full">
        <p className="font-sketch text-3xl text-ink tracking-wide text-center mb-[8px]">MyBestShape</p>
        <p className="font-body text-gray-400 text-center mb-[32px]">
          A few details so your coach can give you real numbers, not guesses.
        </p>

        <form onSubmit={handleSubmit} className="card-featured p-[24px] space-y-[20px]">
          <div>
            <p className="section-label mb-[8px]">Weight (kg)</p>
            <input type="number" step="0.1" min="1" value={weight} onChange={e => setWeight(e.target.value)} required placeholder="75" />
          </div>

          <div>
            <p className="section-label mb-[8px]">Height (cm)</p>
            <input type="number" step="0.1" min="1" value={height} onChange={e => setHeight(e.target.value)} required placeholder="178" />
          </div>

          <div>
            <p className="section-label mb-[8px]">Age</p>
            <input type="number" min="1" value={age} onChange={e => setAge(e.target.value)} required placeholder="35" />
          </div>

          <div>
            <p className="section-label mb-[8px]">Sex</p>
            <div className="flex gap-[8px]">
              {['male', 'female'].map(opt => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setSex(opt)}
                  className={sex === opt ? 'btn-dark flex-1' : 'btn-primary flex-1'}
                  style={{ opacity: sex === opt ? 1 : 0.35 }}
                >
                  {opt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="section-label mb-[8px]">Activity Level</p>
            <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} className="w-full">
              <option value="sedentary">Sedentary (little to no exercise)</option>
              <option value="light">Light (exercise 1-3 days/week)</option>
              <option value="moderate">Moderate (exercise 3-5 days/week)</option>
              <option value="active">Active (exercise 6-7 days/week)</option>
              <option value="very_active">Very active (hard exercise daily)</option>
            </select>
          </div>

          <div>
            <p className="section-label mb-[8px]">Goal</p>
            <div className="flex gap-[8px]">
              {[['lose', 'LOSE'], ['maintain', 'MAINTAIN'], ['gain', 'GAIN']].map(([val, label]) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setGoal(val)}
                  className={goal === val ? 'btn-dark flex-1' : 'btn-primary flex-1'}
                  style={{ opacity: goal === val ? 1 : 0.35, fontSize: '12px', padding: '14px 8px' }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
            {saving ? 'SAVING...' : 'START COACHING'}
          </button>

          {error && <p className="text-red text-sm font-body">{error}</p>}
        </form>
      </div>
    </div>
  )
}
