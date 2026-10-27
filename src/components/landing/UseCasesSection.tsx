'use client'

import { Building2, Users, Globe, Laptop } from 'lucide-react'

const useCases = [
  {
    icon: Building2,
    audience: 'Web Agencies',
    headline: 'Scale Your Pipeline at Speed',
    description:
      'Run automated discovery campaigns across entire cities. Your team gets pre-qualified leads with full website audits, opportunity scores, and personalized proposals ready to send.',
    bullets: [
      'Multi-city search campaigns',
      'Team workspaces with role-based access',
      'Bulk lead management and assignment',
      'Agency-branded proposal exports',
    ],
    color: 'var(--blue-400)',
  },
  {
    icon: Users,
    audience: 'Freelancers',
    headline: 'Your Own AI Prospecting Team',
    description:
      'Stop cold-calling from business directories. Leadora finds businesses that need exactly what you offer, audits their online presence, and drafts outreach tailored to each prospect.',
    bullets: [
      'Hyper-local niche targeting',
      'One-click opportunity scoring',
      'Personalized outreach templates',
      'Solo-friendly pricing',
    ],
    color: 'var(--cyan-400)',
  },
  {
    icon: Globe,
    audience: 'Digital Service Providers',
    headline: 'Identify Gaps. Propose Solutions.',
    description:
      'Whether you offer SEO, maintenance, e-commerce, or mobile apps — Leadora identifies businesses with the exact gaps that match your service offering.',
    bullets: [
      'Service-specific opportunity filters',
      'E-commerce & booking gap detection',
      'Competitive gap analysis',
      'Revenue projection in proposals',
    ],
    color: 'var(--violet-400)',
  },
  {
    icon: Laptop,
    audience: 'SaaS & Product Teams',
    headline: 'Market Research at Scale',
    description:
      'Use Leadora to map the digitization gap in target verticals. Understand which business categories are most underserved and shape your GTM strategy with real data.',
    bullets: [
      'Category-level analytics',
      'Geographic heat maps',
      'Digitization gap reporting',
      'API integrations for custom workflows',
    ],
    color: 'var(--emerald-400)',
  },
]

export function UseCasesSection() {
  return (
    <section id="use-cases" className="py-24 relative">
      <div className="container-app">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="badge badge-emerald inline-flex mb-4">Built For You</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
            Who Uses{' '}
            <span className="text-gradient">Leadora AI?</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg">
            Purpose-built for web professionals who are serious about growing their client base.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((uc) => {
            const Icon = uc.icon
            return (
              <div key={uc.audience} className="card p-6 group">
                <div className="flex items-start gap-4 mb-5">
                  <div className="feature-icon flex-shrink-0" style={{ color: uc.color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: uc.color }}>
                      {uc.audience}
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                      {uc.headline}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                  {uc.description}
                </p>

                <ul className="space-y-2">
                  {uc.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: uc.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
