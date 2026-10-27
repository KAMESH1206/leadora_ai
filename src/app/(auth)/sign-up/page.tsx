'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Zap, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
    { label: 'Special character', ok: /[!@#$%^&*]/.test(password) },
  ]
  const strength = checks.filter((c) => c.ok).length
  const colors = ['', 'var(--rose-400)', 'var(--amber-400)', 'var(--blue-400)', 'var(--emerald-400)']

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-2">
        {[1,2,3,4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i <= strength ? colors[strength] : 'var(--navy-700)' }}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {checks.map((c) => (
          <div key={c.label} className="flex items-center gap-1.5">
            <CheckCircle2
              className="w-3 h-3 flex-shrink-0"
              style={{ color: c.ok ? 'var(--emerald-400)' : 'var(--text-muted)' }}
            />
            <span className="text-[10px]" style={{ color: c.ok ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [workspace, setWorkspace] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, workspaceName: workspace }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Registration failed. Please try again.')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/sign-in'), 2000)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <CheckCircle2 className="w-16 h-16 text-[var(--emerald-400)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
          <p className="text-[var(--text-secondary)]">Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="glow-orb glow-orb-cyan w-96 h-96 bottom-0 right-0 opacity-20" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--blue-400)] opacity-70" />
              <div className="absolute inset-[6px] rounded-full border border-[var(--cyan-400)] opacity-50" />
              <div className="absolute inset-[11px] rounded-full bg-[var(--blue-500)]" />
              <div className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[var(--cyan-400)]" />
            </div>
            <span className="font-bold text-xl text-gradient">Leadora AI</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Start your 14-day free trial — no credit card needed</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-lg bg-[rgba(251,113,133,0.1)] border border-[rgba(251,113,133,0.25)]">
              <AlertCircle className="w-4 h-4 text-[var(--rose-400)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--rose-400)]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">Your name</label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Alex Johnson"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">Work email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="alex@agency.com"
              />
            </div>

            <div>
              <label htmlFor="workspace" className="label">Workspace name</label>
              <input
                id="workspace"
                type="text"
                required
                value={workspace}
                onChange={(e) => setWorkspace(e.target.value)}
                className="input"
                placeholder="Alex's Agency"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">Your team or company name</p>
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                <><Zap className="w-4 h-4" /> Create Account Free</>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--text-muted)] mt-4">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-[var(--blue-400)] hover:underline">Terms</Link> and{' '}
            <Link href="/privacy" className="text-[var(--blue-400)] hover:underline">Privacy Policy</Link>.
          </p>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[var(--blue-400)] hover:text-[var(--blue-300)] font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
