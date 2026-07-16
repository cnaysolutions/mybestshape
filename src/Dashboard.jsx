import { useState, useEffect, useCallback } from 'react'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { supabase } from './supabaseClient'

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)[1]
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export default function Dashboard({ user, onLogout }) {
  const [photoDataUrl, setPhotoDataUrl] = useState(null)
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [meals, setMeals] = useState([])
  const [loadingMeals, setLoadingMeals] = useState(true)

  const loadMeals = useCallback(async () => {
    setLoadingMeals(true)
    const { data, error: fetchError } = await supabase
      .from('meals')
      .select('id, photo_url, description, created_at')
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

      const { error: insertError } = await supabase
        .from('meals')
        .insert({ user_id: user.id, photo_url: photoPath, description: description.trim() })
      if (insertError) throw insertError

      setPhotoDataUrl(null)
      setDescription('')
      await loadMeals()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

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

        {/* ─ Add meal ─ */}
        <form onSubmit={saveMeal} className="card-featured p-[24px] mb-[32px]">
          <h3 className="font-display text-lg text-ink mb-[16px]">LOG A MEAL</h3>

          {photoDataUrl && (
            <img src={photoDataUrl} alt="Meal preview" className="w-full mb-[16px]" style={{ border: '3px solid var(--ink)' }} />
          )}

          <button
            type="button"
            onClick={takePhoto}
            className="btn-dark w-full mb-[16px]"
          >
            {photoDataUrl ? 'RETAKE PHOTO' : 'ADD PHOTO'}
          </button>

          <textarea
            placeholder="What did you eat?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mb-[16px]"
          />

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={saving}
            style={{ opacity: saving ? 0.6 : 1 }}
          >
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
                {meal.signedUrl && (
                  <img src={meal.signedUrl} alt="Meal" className="w-full mb-[12px]" style={{ border: '2px solid var(--ink)' }} />
                )}
                {meal.description && <p className="font-body text-ink mb-[8px]">{meal.description}</p>}
                <p className="font-mono text-xs text-gray-300">
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
