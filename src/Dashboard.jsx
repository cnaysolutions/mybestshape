import { useState, useEffect, useCallback } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { supabase } from './supabaseClient'
import Onboarding from './Onboarding'
import { MEAL_TYPES, mealTypeLabel, dailyCalorieTarget } from './nutrition'

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

function defaultMealType() {
  const h = new Date().getHours()
  if (h < 10) return 'breakfast'
  if (h < 12) return 'morning_snack'
  if (h < 15) return 'lunch'
  if (h < 17) return 'afternoon_snack'
  if (h < 21) return 'dinner'
  return 'evening_snack'
}

const isSameDay = (iso, date) => new Date(iso).toDateString() === date.toDateString()

export default function Dashboard({ user, onLogout }) {
  const [profile, setProfile] = useState(undefined) // undefined = loading, null = needs onboarding

  const loadProfile = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle()
    setProfile(data)
  }, [user.id])

  useEffect(() => { loadProfile() }, [loadProfile])

  if (profile === undefined) return null
  if (profile === null) return <Onboarding user={user} onDone={loadProfile} />

  return <MainDashboard user={user} profile={profile} onLogout={onLogout} />
}

function MainDashboard({ user, profile, onLogout }) {
  const [photoDataUrl, setPhotoDataUrl] = useState(null)
  const [description, setDescription] = useState('')
  const [mealType, setMealType] = useState(defaultMealType())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [meals, setMeals] = useState([])
  const [loadingMeals, setLoadingMeals] = useState(true)

  const loadMeals = useCallback(async () => {
    setLoadingMeals(true)
    const { data, error: fetchError } = await supabase
      .from('meals')
      .select('id, photo_url, description, meal_type, calories, protein_g, carbs_g, fat_g, quality_score, coach_comment, analysis_status, created_at')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setLoadingMeals(false)
      return
    }

    const withUrls = await Promise.all(
      (data || []).map(async meal => {
        if (!meal.photo_url) return { ...meal, signedUrl: null }
        const { data: signed } = await supabase
          .storage
          .from('meal-photos')
          .createSignedUrl(meal.photo_url, 3600)
        return { ...meal, signedUrl: signed?.signedUrl || null }
      })
    )
    setMeals(withUrls)
    setLoadingMeals(false)
  }, [])

  useEffect(() => { loadMeals() }, [loadMeals])

  async function takePhoto() {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 70,
      })
      setPhotoDataUrl(photo.dataUrl)
    } catch {
      // user cancelled the photo picker
    }
  }

  async function analyzeMeal(meal, sourcePhotoDataUrl) {
    try {
      let photoBase64 = null
      let mimeType = null
      if (sourcePhotoDataUrl) {
        const [header, base64] = sourcePhotoDataUrl.split(',')
        mimeType = header.match(/:(.*?);/)[1]
        photoBase64 = base64
      }

      const { data, error: fnError } = await supabase.functions.invoke('analyze-meal', {
        body: {
          photoBase64,
          mimeType,
          description: meal.description,
          mealType: meal.meal_type,
          profile,
        },
      })
      if (fnError) throw fnError

      await supabase.from('meals').update({
        calories: data.calories,
        protein_g: data.protein_g,
        carbs_g: data.carbs_g,
        fat_g: data.fat_g,
        quality_score: data.quality_score,
        coach_comment: data.comment,
        analysis_status: 'done',
      }).eq('id', meal.id)
    } catch {
      await supabase.from('meals').update({ analysis_status: 'failed' }).eq('id', meal.id)
    } finally {
      loadMeals()
    }
  }

  async function saveMeal(e) {
    e.preventDefault()
    if (!photoDataUrl && !description.trim()) return

    setSaving(true)
    setError('')
    try {
      let photoPath = null
      if (photoDataUrl) {
        photoPath = `${user.id}/${Date.now()}.jpg`
        const blob = dataUrlToBlob(photoDataUrl)
        const { error: uploadError } = await supabase
          .storage
          .from('meal-photos')
          .upload(photoPath, blob, { contentType: blob.type })
        if (uploadError) throw uploadError
      }

      const { data: inserted, error: insertError } = await supabase
        .from('meals')
        .insert({
          user_id: user.id,
          photo_url: photoPath,
          description: description.trim(),
          meal_type: mealType,
        })
        .select()
        .single()
      if (insertError) throw insertError

      const savedPhotoDataUrl = photoDataUrl
      setPhotoDataUrl(null)
      setDescription('')
      setMealType(defaultMealType())
      await loadMeals()

      analyzeMeal(inserted, savedPhotoDataUrl)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const today = new Date()
  const todayMeals = meals.filter(m => isSameDay(m.created_at, today))
  const consumed = todayMeals.reduce((sum, m) => sum + (m.calories || 0), 0)
  const target = dailyCalorieTarget(profile)
  const remaining = target - consumed
  const progressPct = Math.min(100, Math.round((consumed / target) * 100))

  const buckets = { breakfast: 0, lunch: 0, dinner: 0, snacks: 0 }
  todayMeals.forEach(m => {
    const cal = m.calories || 0
    if (m.meal_type === 'breakfast') buckets.breakfast += cal
    else if (m.meal_type === 'lunch') buckets.lunch += cal
    else if (m.meal_type === 'dinner') buckets.dinner += cal
    else buckets.snacks += cal
  })

  const trend = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const total = meals.filter(m => isSameDay(m.created_at, d)).reduce((s, m) => s + (m.calories || 0), 0)
    return { label: d.toLocaleDateString('en', { weekday: 'short' }), total }
  })
  const maxTrend = Math.max(...trend.map(t => t.total), 1)

  return (
    <div className="min-h-screen bg-paper px-[16px] py-[32px]">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-[32px]">
          <span className="font-sketch text-3xl text-ink tracking-wide">MyBestShape</span>
          <button
            onClick={() => supabase.auth.signOut().then(onLogout)}
            className="font-body text-gray-300 text-sm underline"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Log out
          </button>
        </div>

        <p className="font-body text-gray-400 mb-[24px]">
          Logged in as <strong className="text-ink">{user.email}</strong>
        </p>

        {/* ─ Today's calorie target ─ */}
        <div className="card p-[24px] mb-[24px]">
          <h3 className="font-display text-lg text-ink mb-[16px]">DAILY CALORIE TARGET</h3>
          <div className="grid grid-cols-3 gap-[16px] text-center">
            <div>
              <p className="section-label mb-[4px]">Goal</p>
              <p className="font-display text-2xl text-ink">{target}</p>
            </div>
            <div>
              <p className="section-label mb-[4px]">Consumed</p>
              <p className="font-display text-2xl text-red">{consumed}</p>
            </div>
            <div>
              <p className="section-label mb-[4px]">Remaining</p>
              <p className="font-display text-2xl text-ink">{remaining}</p>
            </div>
          </div>
          <div className="mt-[16px] h-[10px] bg-gray-100 overflow-hidden">
            <div className="h-full bg-red" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* ─ Meal breakdown ─ */}
        <div className="grid grid-cols-4 gap-[8px] mb-[24px]">
          {[['Breakfast', buckets.breakfast], ['Lunch', buckets.lunch], ['Dinner', buckets.dinner], ['Snacks', buckets.snacks]].map(([label, cal]) => (
            <div key={label} className="card p-[12px] text-center">
              <p className="font-display text-xs tracking-wider text-ink">{label.toUpperCase()}</p>
              <p className="font-display text-xl text-ink mt-[4px]">{cal}</p>
            </div>
          ))}
        </div>

        {/* ─ 7-day trend ─ */}
        <div className="card p-[24px] mb-[32px]">
          <h3 className="font-display text-lg text-ink mb-[16px]">7-DAY TREND</h3>
          <div className="flex items-end justify-between gap-[8px] h-32">
            {trend.map(({ label, total }) => (
              <div key={label} className="flex-1 flex flex-col items-center">
                <p className="font-mono text-xs text-gray-300 mb-[4px]">{total || ''}</p>
                <div className="w-full max-w-[32px] bg-ink" style={{ height: `${(total / maxTrend) * 100}%`, minHeight: total ? '2px' : 0 }} />
                <p className="font-display text-xs text-gray-400 mt-[8px]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─ Add meal ─ */}
        <form onSubmit={saveMeal} className="card-featured p-[24px] mb-[32px]">
          <h3 className="font-display text-lg text-ink mb-[16px]">LOG A MEAL</h3>

          <div className="mb-[16px]">
            <select value={mealType} onChange={e => setMealType(e.target.value)}>
              {MEAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {photoDataUrl && (
            <img src={photoDataUrl} alt="Meal preview" className="w-full mb-[16px]" style={{ border: '3px solid var(--ink)' }} />
          )}

          <button type="button" onClick={takePhoto} className="btn-dark w-full mb-[16px]">
            {photoDataUrl ? 'RETAKE PHOTO' : 'ADD PHOTO'}
          </button>

          <textarea
            placeholder="What did you eat?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mb-[16px]"
          />

          <button type="submit" className="btn-primary w-full" disabled={saving} style={{ opacity: saving ? 0.6 : 1 }}>
            {saving ? 'SAVING...' : 'SAVE MEAL'}
          </button>

          {error && <p className="text-red text-sm mt-[12px] font-body">{error}</p>}
        </form>

        {/* ─ Meal history ─ */}
        <h3 className="font-display text-lg text-ink mb-[16px]">YOUR MEALS</h3>
        {loadingMeals ? (
          <p className="font-body text-gray-400">Loading...</p>
        ) : meals.length === 0 ? (
          <p className="font-body text-gray-400">No meals logged yet.</p>
        ) : (
          <div className="space-y-[16px]">
            {meals.map(meal => (
              <div key={meal.id} className="card p-[16px]">
                <div className="flex items-center justify-between mb-[8px]">
                  <span className="badge" style={{ fontSize: '10px', padding: '4px 10px' }}>{mealTypeLabel(meal.meal_type)}</span>
                  {meal.analysis_status === 'done' && meal.calories != null && (
                    <span className="font-display text-lg text-ink">{meal.calories} cal</span>
                  )}
                </div>

                {meal.signedUrl && (
                  <img src={meal.signedUrl} alt="Meal" className="w-full mb-[12px]" style={{ border: '2px solid var(--ink)' }} />
                )}
                {meal.description && <p className="font-body text-ink mb-[8px]">{meal.description}</p>}

                {meal.analysis_status === 'pending' && (
                  <p className="font-sketch text-gray-300 text-lg italic">Analyzing meal...</p>
                )}
                {meal.analysis_status === 'failed' && (
                  <p className="font-body text-gray-300 text-sm">Coach analysis unavailable for this meal.</p>
                )}
                {meal.analysis_status === 'done' && (
                  <>
                    {(meal.protein_g != null || meal.carbs_g != null || meal.fat_g != null) && (
                      <p className="font-mono text-xs text-gray-400 mb-[8px]">
                        P {meal.protein_g ?? '-'}g &nbsp; C {meal.carbs_g ?? '-'}g &nbsp; F {meal.fat_g ?? '-'}g
                        {meal.quality_score != null && <> &nbsp; Quality {meal.quality_score}/10</>}
                      </p>
                    )}
                    {meal.coach_comment && (
                      <p className="font-sketch text-gray-400 text-lg italic pl-[12px]" style={{ borderLeft: '3px solid var(--red)' }}>
                        {meal.coach_comment}
                      </p>
                    )}
                  </>
                )}

                <p className="font-mono text-xs text-gray-300 mt-[8px]">
                  {new Date(meal.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
