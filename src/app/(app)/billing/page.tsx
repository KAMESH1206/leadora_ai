'use client'

import { useState } from 'react'
import {
  CreditCard, CheckCircle2, Zap, ArrowRight, ShieldCheck,
  AlertCircle, Sparkles, Building2, ExternalLink
} from 'lucide-react'

const PLANS = [
  {
    name: 'Starter',
    priceMonthly: 49,
    priceAnnual: 39,
    badge: 'Freelancers',
    desc: 'Ideal for solo developers and freelancers starting client acquisition.',
    discoveryQuota: 250,
    auditQuota: 50,
    proposalQuota: 20,
    seats: 1,
    features: [
      '250 Discovery Scans / month',
      '50 Full Website Audits / month',
      '20 Proposal Studio exports',
      'CAN-SPAM Compliant Email Outreach',
      'Standard Google Places Adapter',
      '1 Workspace Seat',
    ],
  },
  {
    name: 'Professional',
    priceMonthly: 129,
    priceAnnual: 99,
    popular: true,
    badge: 'Growing Agencies',
    desc: 'For digital agencies scaling outbound client acquisition and pitch proposals.',
    discoveryQuota: 1000,
    auditQuota: 250,
    proposalQuota: 100,
    seats: 5,
    features: [
      '1,000 Discovery Scans / month',
      '250 Full Website Audits / month',
      '100 Proposal Studio exports',
      'Interactive Before/After Demo Studio',
      'Full API Access & Webhooks',
      '5 Workspace Team Seats',
      'Priority Email & Chat Support',
    ],
  },
  {
    name: 'Agency Scale',
    priceMonthly: 299,
    priceAnnual: 249,
    badge: 'Established Firms',
    desc: 'Unlimited power for high-volume agencies and digital holding companies.',
    discoveryQuota: 5000,
    auditQuota: 1000,
    proposalQuota: 500,
    seats: 15,
    features: [
      '5,000 Discovery Scans / month',
      '1,000 Full Website Audits / month',
      'Unlimited Proposal Studio exports',
      'Dedicated Custom Domain Client Portals',
      'White-label Proposal PDF Branding',
      '15 Workspace Seats',
      'Dedicated Account Strategist',
    ],
  },
]

export default function BillingPage() {
  const [annual, setAnnual] = useState(false)
  const [currentPlan, setCurrentPlan] = useState('Professional')
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null)
  const [successNotice, setSuccessNotice] = useState('')

  function handleUpgrade(planName: string) {
    setUpgradingPlan(planName)
    setTimeout(() => {
      setCurrentPlan(planName)
      setUpgradingPlan(null)
      setSuccessNotice(`Successfully switched workspace subscription to ${planName}!`)
      setTimeout(() => setSuccessNotice(''), 4000)
    }, 800)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-[var(--blue-400)]" />
            Workspace Subscription & Usage
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage your subscription plan, billing details, and monthly discovery quotas.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[rgba(59,130,246,0.1)] text-[var(--blue-400)] border border-[rgba(59,130,246,0.25)]">
          <ShieldCheck className="w-4 h-4" /> Current Plan: {currentPlan}
        </div>
      </div>

      {successNotice && (
        <div className="p-4 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-sm font-semibold text-[var(--emerald-400)] flex items-center gap-2.5 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Usage Meters */}
      <div className="card p-6 border border-[var(--border-default)] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Current Billing Period Usage
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            Renews on November 25, 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Discovery Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)] font-medium">Discovery Searches</span>
              <span className="text-[var(--text-primary)] font-bold">184 / 1,000 used</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--navy-900)] overflow-hidden">
              <div className="h-full bg-[var(--blue-500)] rounded-full" style={{ width: '18.4%' }} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">816 searches remaining</span>
          </div>

          {/* Audit Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)] font-medium">Website Audits</span>
              <span className="text-[var(--text-primary)] font-bold">42 / 250 used</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--navy-900)] overflow-hidden">
              <div className="h-full bg-[var(--cyan-400)] rounded-full" style={{ width: '16.8%' }} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">208 audits remaining</span>
          </div>

          {/* Proposals Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--text-secondary)] font-medium">Proposals Generated</span>
              <span className="text-[var(--text-primary)] font-bold">14 / 100 used</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--navy-900)] overflow-hidden">
              <div className="h-full bg-[var(--purple-400)] rounded-full" style={{ width: '14%' }} />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">86 proposals remaining</span>
          </div>
        </div>
      </div>

      {/* Plan Selection Header & Toggle */}
      <div className="text-center space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Upgrade or Switch Workspace Plan
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          Scale your client acquisition volume with higher search quotas and team collaboration.
        </p>

        {/* Monthly/Annual Toggle */}
        <div className="inline-flex items-center gap-3 p-1 rounded-full bg-[var(--navy-900)] border border-[var(--border-subtle)]">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              !annual ? 'bg-[var(--blue-500)] text-white' : 'text-[var(--text-secondary)]'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              annual ? 'bg-[var(--blue-500)] text-white' : 'text-[var(--text-secondary)]'
            }`}
          >
            Annual Billing
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.name
          const price = annual ? plan.priceAnnual : plan.priceMonthly

          return (
            <div
              key={plan.name}
              className={`card p-6 flex flex-col justify-between transition-all relative ${
                plan.popular
                  ? 'border-[var(--blue-500)] shadow-2xl bg-[var(--navy-900)]'
                  : 'border-[var(--border-default)]'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--blue-500)] text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-[var(--blue-400)] uppercase font-semibold">
                    {plan.badge}
                  </span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {plan.desc}
                  </p>
                </div>

                <div className="py-2">
                  <span className="text-4xl font-extrabold text-[var(--text-primary)]">
                    ${price}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] ml-1">/ month</span>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-[var(--border-subtle)]">
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--emerald-400)] flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => handleUpgrade(plan.name)}
                  disabled={isCurrent || upgradingPlan !== null}
                  className={`btn w-full justify-center ${
                    isCurrent
                      ? 'btn-secondary opacity-60 cursor-default'
                      : plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {isCurrent
                    ? 'Current Plan'
                    : upgradingPlan === plan.name
                    ? 'Processing...'
                    : `Upgrade to ${plan.name}`}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
