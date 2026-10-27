'use client'

import {
  Search, Globe, FileText, Mail, TrendingUp, Users, ShieldCheck, Zap, BarChart3, Megaphone
} from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Smart Business Discovery',
    description:
      'Search local businesses by category, city, radius, and website status. Filter by service opportunity — website, e-commerce, booking, mobile app.',
    gradient: 'from-blue-500/20 to-blue-600/5',
    accent: 'var(--blue-400)',
  },
  {
    icon: Globe,
    title: 'Website Detection & Audit',
    description:
      'Automatically detect if businesses have a website. Run PageSpeed, SEO, mobile usability, and accessibility audits with confidence scores.',
    gradient: 'from-cyan-400/20 to-cyan-500/5',
    accent: 'var(--cyan-400)',
  },
  {
    icon: Zap,
    title: 'AI Lead Intelligence',
    description:
      'Get 0–100 opportunity scores with explainable breakdowns. Prioritize leads based on website gaps, business fit, and audit findings.',
    gradient: 'from-violet-400/20 to-violet-500/5',
    accent: 'var(--violet-400)',
  },
  {
    icon: Users,
    title: 'Lead CRM & Pipeline',
    description:
      'Manage leads with a full CRM — kanban boards, notes, tasks, activity history, filters, tags, and bulk actions across your pipeline.',
    gradient: 'from-emerald-400/20 to-emerald-500/5',
    accent: 'var(--emerald-400)',
  },
  {
    icon: FileText,
    title: 'AI Proposal Generator',
    description:
      'Generate personalized proposals using verified business data and audit findings. Export to PDF. Edit scope, price, timeline, and terms.',
    gradient: 'from-amber-400/20 to-amber-500/5',
    accent: 'var(--amber-400)',
  },
  {
    icon: Megaphone,
    title: 'Compliant Outreach',
    description:
      'Draft personalized email and WhatsApp messages. Review-and-approve workflow, suppression lists, opt-out handling, and delivery tracking.',
    gradient: 'from-rose-400/20 to-rose-500/5',
    accent: 'var(--rose-400)',
  },
  {
    icon: BarChart3,
    title: 'Campaign Analytics',
    description:
      'Track the full funnel — searches, leads, outreach, replies, meetings, proposals, wins. Measure conversion rates and revenue attribution.',
    gradient: 'from-blue-400/20 to-cyan-400/5',
    accent: 'var(--blue-300)',
  },
  {
    icon: ShieldCheck,
    title: 'Demo Website Studio',
    description:
      'Generate personalized landing-page previews for prospects using their verified business details. Clearly labeled as concept demos.',
    gradient: 'from-cyan-500/20 to-violet-400/5',
    accent: 'var(--cyan-300)',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-grid opacity-30" />

      <div className="container-app relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="badge badge-cyan inline-flex mb-4">
            <Zap className="w-3 h-3" />
            Everything You Need
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-5">
            One Platform.<br />
            <span className="text-gradient">Infinite Opportunities.</span>
          </h2>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            From discovery to closed deal — Leadora AI handles every step of your client acquisition workflow.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feat, i) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className="card p-5 group cursor-default animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both', opacity: 0 }}
              >
                <div
                  className="feature-icon mb-4 group-hover:scale-110 transition-transform duration-200"
                  style={{ color: feat.accent }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] text-sm mb-2 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {feat.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
