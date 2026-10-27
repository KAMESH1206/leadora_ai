import Link from 'next/link'
import { Zap, ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[var(--navy-950)]" />
      <div className="glow-orb glow-orb-blue w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <div className="container-app relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8 mx-auto"
            style={{ background: 'var(--gradient-blue)', boxShadow: '0 0 40px rgba(59,130,246,0.35)' }}
          >
            <Zap className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6">
            Ready to{' '}
            <span className="text-gradient">Win More Clients?</span>
          </h2>

          <p className="text-[var(--text-secondary)] text-xl leading-relaxed mb-10">
            Join web professionals using Leadora AI to discover opportunities, build connections, and grow their client base — systematically.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/sign-up" className="btn btn-primary btn-xl gap-2">
              <Zap className="w-4 h-4" />
              Start For Free — 14 Days
            </Link>
            <Link href="/sign-in" className="btn btn-secondary btn-xl gap-2">
              Already have an account?
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-xs text-[var(--text-muted)] mt-6">
            No credit card required · Cancel any time · GDPR-conscious design
          </p>
        </div>
      </div>
    </section>
  )
}
