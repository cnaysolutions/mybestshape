import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Login() {
  const [step, setStep] = useState('email') // email | code
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [errorMsg, setErrorMsg] = useState('')

  async function sendCode(e) {
    e.preventDefault()
    if (!email || !email.includes('@') || !email.includes('.')) return

    setStatus('sending')
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
      return
    }
    setStatus('idle')
    setStep('code')
  }

  async function verifyCode(e) {
    e.preventDefault()
    if (!code) return

    setStatus('sending')
    setErrorMsg('')
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })
    if (error) {
      setStatus('error')
      setErrorMsg(error.message)
      return
    }
    // onAuthStateChange in App.jsx picks up the new session
  }

  if (step === 'code') {
    return (
      <form onSubmit={verifyCode} className="max-w-sm mx-auto">
        <p className="font-sketch text-gray-400 text-xl mb-[16px]">
          Enter the 6-digit code we sent to<br/>
          <strong className="text-ink font-body not-italic">{email}</strong>
        </p>
        <input
          type="text"
          inputMode="numeric"
          placeholder="123456"
          value={code}
          onChange={e => setCode(e.target.value)}
          required
          className="mb-[20px] text-center"
        />
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={status === 'sending'}
          style={{ opacity: status === 'sending' ? 0.6 : 1 }}
        >
          {status === 'sending' ? 'VERIFYING...' : 'LOG IN'}
        </button>
        {status === 'error' && (
          <p className="text-red text-sm mt-[12px] font-body">{errorMsg}</p>
        )}
        <button
          type="button"
          onClick={() => { setStep('email'); setCode(''); setStatus('idle'); setErrorMsg('') }}
          className="font-body text-gray-300 text-sm mt-[12px] underline"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Use a different email
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={sendCode} className="max-w-sm mx-auto">
      <p className="font-sketch text-gray-400 text-xl mb-[16px]">Start Your Free 3-Day Trial</p>
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
        <p className="text-red text-sm mt-[12px] font-body">{errorMsg}</p>
      )}
      <p className="text-gray-300 text-sm mt-[12px] font-body">No credit card required.</p>
    </form>
  )
}
