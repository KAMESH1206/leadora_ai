'use client'

import Link from 'next/link'
import { Check, Zap, Building, Crown, ArrowRight } from 'lucide-react'
import { useState } from 'react'

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    monthly: 49,
    annual: 39,
    description: 'For solo freelancers getting started with lead discovery.',
    color: 'var(--blue-400)',
    features: [
      '500 business discoveries / month',
      '100 website audits / month',
      '50 AI proposals',
      'Email outreach (500/month)',
      'Lead CRM (up to 500 leads)',
      '1 workspace',
      'PDF proposal export',
      'Standard support',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    icon: Building,
    monthly: 149,
    annual: 119,
    description: 'For growing agencies and serious freelancers.',
    color: 'var(--cyan-400)',
    features: [
      '5,000 business discoveries / month',
      '1,000 website audits / month',
      'Unlimited AI proposals',
      'Email + WhatsApp outreach',
      'Unlimited leads',
      '5 workspaces / 10 team members',
      'Demo website studio',
      'Campaign analytics',
      'Client project management',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Agency',
    icon: Crown,
    monthly: 349,
    annual: 279,
    description: 'For high-volume agencies with multiple teams.',
    color: 'var(--violet-400)',
    features: [
      'Unlimited discoveries',
      'Unlimited audits',
      'Unlimited everything',
      'Custom integrations',
      'Unlimited workspaces',
      'Unlimited team members',
      'White-label proposals',
      'API access',
      'Dedicated account manager',
      'SLA support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="py-24 relative bg-[var(--navy-950)]">
      <div className="glow-orb glow-orb-blue w-[500px] h-[500px] top-0 left-1/2 -translate-x-1/2 opacity-20" />

      <div className="container-app relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="badge badge-blue inline-flex mb-4">Transparent Pricing</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
            Simple, Scalable{' '}
            <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-8">
            Start free. No credit card required. Cancel any time.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 glass rounded-full p-1 border border-[var(--border-subtle)]">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !annual ? 'bg-[var(--blue-500)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? 'bg-[var(--blue-500)] text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Annual
              <span className="badge badge-emerald text-[10px] py-0.5">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = annual ? plan.annual : plan.monthly
            return (
              <div
                key={plan.name}
                className={`card p-6 relative ${plan.popular ? 'border-[var(--blue-500)] shadow-[0_0_40px_rgba(59,130,246,0.2)]' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge badge-blue text-xs font-semibold px-3 py-1 shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="feature-icon w-9 h-9" style={{ color: plan.color }}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)]">{plan.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-[var(--text-primary)]">${price}</span>
                    <span className="text-[var(--text-muted)] text-sm mb-1.5">/mo</span>
                  </div>
                  {annual && (
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Billed ${price * 12}/year · saves ${(plan.monthly - plan.annual) * 12}/year
                    </p>
                  )}
                </div>

                <Link
                  href="/sign-up"
                  className={`btn w-full justify-center mb-6 ${plan.popular ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <Check className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-8">
          All plans include 14-day free trial · No credit card required · Prices are illustrative — confirm before launch
        </p>
      </div>
    </section>
  )
}
