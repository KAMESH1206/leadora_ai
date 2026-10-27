'use client'

import {
  BarChart3, TrendingUp, Users, DollarSign, Target,
  CheckCircle2, Globe, Mail, ArrowUpRight, Zap
} from 'lucide-react'

export default function AnalyticsPage() {
  const funnelSteps = [
    { label: 'Discovered Businesses', count: 184, percent: 100, color: 'var(--blue-500)' },
    { label: 'High Opportunity Leads', count: 96, percent: 52, color: 'var(--blue-400)' },
    { label: 'Outreach Contacted', count: 48, percent: 26, color: 'var(--cyan-400)' },
    { label: 'Demos / Meetings', count: 19, percent: 10, color: 'var(--amber-400)' },
    { label: 'Proposals Delivered', count: 12, percent: 6.5, color: 'var(--purple-400)' },
    { label: 'Closed Won Clients', count: 5, percent: 2.7, color: 'var(--emerald-400)' },
  ]

  const categoryDemand = [
    { name: 'Auto Repair & Mechanics', demandScore: 94, avgDeal: '$4,200', count: 32 },
    { name: 'Dental & Medical Clinics', demandScore: 89, avgDeal: '$5,800', count: 28 },
    { name: 'Boutique Hotels & Inns', demandScore: 92, avgDeal: '$7,500', count: 18 },
    { name: 'Contractors & Cabinetry', demandScore: 85, avgDeal: '$4,900', count: 42 },
    { name: 'Artisan Bakeries & Cafes', demandScore: 82, avgDeal: '$3,500', count: 35 },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[var(--blue-400)]" />
            Agency Analytics & Funnel Velocity
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Real-time pipeline metrics, conversion rates, and industry opportunity trends.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--navy-900)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
          <span>Reporting Period: Last 30 Days</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Agency Win Rate</span>
          <div className="text-2xl font-bold text-[var(--emerald-400)] mt-1">41.6%</div>
          <span className="text-[11px] text-[var(--text-secondary)]">From proposal to won</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Average Deal Size</span>
          <div className="text-2xl font-bold text-[var(--blue-400)] mt-1">$4,860</div>
          <span className="text-[11px] text-[var(--text-secondary)]">Per client web contract</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Outreach Response Rate</span>
          <div className="text-2xl font-bold text-[var(--cyan-400)] mt-1">34.2%</div>
          <span className="text-[11px] text-[var(--text-secondary)]">Using video pitch angles</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Sales Cycle Length</span>
          <div className="text-2xl font-bold text-[var(--amber-400)] mt-1">11 Days</div>
          <span className="text-[11px] text-[var(--text-secondary)]">First touch to signed deal</span>
        </div>
      </div>

      {/* Main Conversion Funnel */}
      <div className="card p-6 border border-[var(--border-default)] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Lead Conversion Funnel
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Progression from discovery scan to paying agency client
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--blue-400)] bg-[var(--navy-900)] px-2.5 py-1 rounded">
            Total Pipeline: $48,200
          </span>
        </div>

        <div className="space-y-4">
          {funnelSteps.map((step) => (
            <div key={step.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[var(--text-primary)]">
                  {step.label}
                </span>
                <span className="text-[var(--text-muted)]">
                  <strong className="text-[var(--text-primary)]">{step.count}</strong> ({step.percent}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[var(--navy-900)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${step.percent}%`, background: step.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Performance */}
      <div className="card p-6 border border-[var(--border-default)] space-y-5">
        <h3 className="text-base font-bold text-[var(--text-primary)]">
          High-Yield Industry Niches
        </h3>
        <p className="text-xs text-[var(--text-secondary)]">
          Local industries with the highest opportunity scores and average contract values
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryDemand.map((cat) => (
            <div
              key={cat.name}
              className="p-4 rounded-xl bg-[var(--navy-900)] border border-[var(--border-subtle)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[var(--text-primary)]">{cat.name}</h4>
                <span className="text-[10px] font-bold text-[var(--cyan-400)] bg-[var(--navy-950)] px-2 py-0.5 rounded">
                  {cat.demandScore}% Opp
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[var(--text-muted)]">Average Deal:</span>
                <span className="font-bold text-[var(--emerald-400)]">{cat.avgDeal}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
