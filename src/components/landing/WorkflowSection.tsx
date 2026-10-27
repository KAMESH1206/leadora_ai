'use client'

import { Search, Globe, Zap, FileText, Mail, TrendingUp } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Discover Local Businesses',
    description:
      'Search by category and location using Google Places. Filter for no-website or poor-website businesses. Save search jobs for background processing.',
    color: 'var(--blue-400)',
  },
  {
    step: '02',
    icon: Globe,
    title: 'Audit Their Online Presence',
    description:
      'Leadora automatically checks for websites, runs PageSpeed audits, evaluates SEO, mobile usability, contact options, and booking functionality.',
    color: 'var(--cyan-400)',
  },
  {
    step: '03',
    icon: Zap,
    title: 'Score & Qualify Leads',
    description:
      'Each business gets an explainable 0–100 opportunity score. See the breakdown of signals — website gaps, audit findings, and project fit.',
    color: 'var(--violet-400)',
  },
  {
    step: '04',
    icon: FileText,
    title: 'Generate AI Proposals',
    description:
      'Create personalized proposals in seconds using verified business data. Customize scope, pricing, timeline, and export to a professional PDF.',
    color: 'var(--amber-400)',
  },
  {
    step: '05',
    icon: Mail,
    title: 'Reach Out Compliantly',
    description:
      'Draft personalized email and WhatsApp messages. Every message goes through a review-and-approve queue before sending — no bulk spam.',
    color: 'var(--emerald-400)',
  },
  {
    step: '06',
    icon: TrendingUp,
    title: 'Track & Optimize',
    description:
      'Monitor your full pipeline in the CRM. Analyze conversion rates, winning categories, and revenue attribution to double down on what works.',
    color: 'var(--rose-400)',
  },
]

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 relative bg-[var(--navy-950)]">
      <div className="container-app">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="badge badge-blue inline-flex mb-4">6-Step Workflow</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
            From Search to{' '}
            <span className="text-gradient-cyan">Signed Contract</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            Leadora AI streamlines every step of the client acquisition process so you can focus on delivering great work.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-8 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-gradient-to-r from-transparent via-[var(--border-default)] to-transparent" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="relative">
                  {/* Step number connector dot */}
                  <div className="lg:flex lg:justify-center mb-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-[var(--navy-900)]"
                      style={{ borderColor: step.color, color: step.color }}
                    >
                      {step.step}
                    </div>
                  </div>

                  <div
                    className="card p-5 h-full group hover:border-[color:var(--border-strong)] transition-all"
                    style={{ '--border-strong': step.color + '40' } as React.CSSProperties}
                  >
                    <div
                      className="feature-icon mb-4"
                      style={{ color: step.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-[var(--text-primary)] mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
