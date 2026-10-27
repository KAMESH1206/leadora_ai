'use client'

import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, Zap, Loader2, AlertCircle } from 'lucide-react'

function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <>
      {error && (
        <div className="flex items-center gap-2.5 p-3 rounded-lg bg-[rgba(244,63,94,0.1)] border border-[rgba(244,63,94,0.2)] text-[var(--rose-400)] text-sm mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="you@agency.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-[var(--blue-400)] hover:text-[var(--blue-300)] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pr-10"
              placeholder="••••••••"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full justify-center mt-2"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
          ) : (
            <><Zap className="w-4 h-4" /> Sign In</>
          )}
        </button>
      </form>
    </>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="glow-orb glow-orb-blue w-96 h-96 top-0 left-1/2 -translate-x-1/2 opacity-30" />

      <div className="w-full max-w-md relative">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-full border-2 border-[var(--blue-400)] opacity-60" />
              <div className="absolute inset-[5px] rounded-full border border-[var(--cyan-400)] opacity-40" />
              <div className="absolute inset-[10px] rounded-full bg-[var(--blue-500)]" />
              <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--cyan-400)]" />
            </div>
            <span className="font-bold text-xl text-gradient">Leadora AI</span>
          </Link>
          <p className="text-sm text-[var(--text-secondary)]">Sign in to your agency workspace</p>
        </div>

        {/* Card */}
        <div className="card p-8 shadow-2xl">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12 text-[var(--text-muted)]">
              <Loader2 className="w-6 h-6 animate-spin text-[var(--blue-400)]" />
            </div>
          }>
            <SignInForm />
          </Suspense>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[var(--blue-400)] hover:text-[var(--blue-300)] font-medium transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

