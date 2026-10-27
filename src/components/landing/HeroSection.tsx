'use client'

import Link from 'next/link'
import { Search, MapPin, Globe, Zap, ArrowRight, ChevronDown, Building2, Store, Utensils, Stethoscope, Dumbbell, Scissors, ShoppingBag, Wifi, WifiOff } from 'lucide-react'
import { useState, useEffect } from 'react'

const DISCOVERY_PREVIEW = [
  { name: 'FreshBite Kitchen', category: 'Restaurant', status: 'no-website', location: 'Koramangala, Bengaluru', score: 87 },
  { name: 'GreenGrocer Hub', category: 'Grocery', status: 'no-website', location: 'Indiranagar, Bengaluru', score: 82 },
  { name: 'FlexFit Gym', category: 'Gym', status: 'poor-website', location: 'HSR Layout, Bengaluru', score: 74 },
  { name: 'CureDent Clinic', category: 'Clinic', status: 'no-website', location: 'Whitefield, Bengaluru', score: 91 },
  { name: 'StyleCraft Salon', category: 'Salon', status: 'poor-website', location: 'MG Road, Bengaluru', score: 68 },
]

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Restaurant: Utensils,
  Grocery: ShoppingBag,
  Gym: Dumbbell,
  Clinic: Stethoscope,
  Salon: Scissors,
  default: Store,
}

const HERO_STATS = [
  { value: '50K+', label: 'Businesses Discovered' },
  { value: '12K+', label: 'Leads Qualified' },
  { value: '94%', label: 'Audit Accuracy' },
]

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'var(--emerald-400)' : score >= 60 ? 'var(--amber-400)' : 'var(--rose-400)'
  return (
    <div
      className="flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold border-2"
      style={{ borderColor: color, color }}
    >
      {score}
    </div>
  )
}

export function HeroSection() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((p) => (p + 1) % DISCOVERY_PREVIEW.length)
    }, 2500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background */}
      <div className="absolute inset-0 bg-grid" />
      <div className="glow-orb glow-orb-blue w-[600px] h-[600px] top-[-150px] left-[-200px] opacity-40" />
      <div className="glow-orb glow-orb-cyan w-[400px] h-[400px] bottom-[-100px] right-[-150px] opacity-30" />

      <div className="container-app relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Copy */}
          <div>
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 badge badge-blue mb-6 animate-fade-in-up">
              <Zap className="w-3 h-3" />
              <span>AI-Powered Lead Discovery Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-[-0.03em] mb-6 animate-fade-in-up delay-100">
              Discover Opportunities.<br />
              <span className="text-gradient">Build Connections.</span><br />
              Win Clients.
            </h1>

            <p className="text-lg text-[var(--text-secondary)] leading-relaxed max-w-lg mb-8 animate-fade-in-up delay-200">
              Find local businesses that need your web services, audit their online presence with AI, generate personalized proposals, and convert qualified leads into paying clients — all from one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10 animate-fade-in-up delay-300">
              <Link href="/sign-up" className="btn btn-primary btn-xl gap-2">
                <Zap className="w-4 h-4" />
                Start Discovering Free
              </Link>
              <a href="#features" className="btn btn-secondary btn-xl gap-2">
                See How It Works
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 animate-fade-in-up delay-400">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-gradient">{s.value}</div>
                  <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Discovery Preview Card */}
          <div className="relative animate-fade-in-up delay-300">
            {/* Floating radar orbs */}
            <div className="absolute -top-12 -right-8 w-24 h-24 flex items-center justify-center animate-float">
              <div className="relative">
                <div className="radar-ring w-16 h-16" />
                <div className="radar-ring w-16 h-16" />
                <div className="radar-ring w-16 h-16" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[var(--blue-500)] shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
                </div>
              </div>
            </div>

            <div className="card p-0 overflow-hidden">
              {/* Search Bar Mockup */}
              <div className="p-4 border-b border-[var(--border-subtle)] bg-[rgba(11,18,32,0.4)]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 flex-1 input py-2">
                    <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                    <span className="text-[var(--text-secondary)] text-sm">Restaurants • Bengaluru, India • 5 km</span>
                  </div>
                  <button className="btn btn-primary btn-sm px-3">
                    <Search className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                  {['No Website', 'Poor SEO', 'No Booking'].map((f) => (
                    <span key={f} className="badge badge-blue text-xs">{f}</span>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="divide-y divide-[var(--border-subtle)]">
                {DISCOVERY_PREVIEW.map((biz, i) => {
                  const Icon = CATEGORY_ICONS[biz.category] ?? CATEGORY_ICONS.default
                  const isActive = i === activeIdx
                  return (
                    <div
                      key={biz.name}
                      className={`flex items-center gap-3 p-3.5 transition-all duration-300 ${
                        isActive ? 'bg-[rgba(59,130,246,0.08)]' : 'hover:bg-[rgba(59,130,246,0.04)]'
                      }`}
                    >
                      <div className="feature-icon w-9 h-9 flex-shrink-0">
                        <Icon className="w-4 h-4 text-[var(--blue-400)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{biz.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
                          <span className="text-xs text-[var(--text-muted)] truncate">{biz.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {biz.status === 'no-website' ? (
                          <span className="badge badge-rose text-[10px] flex items-center gap-1">
                            <WifiOff className="w-2.5 h-2.5" />No Website
                          </span>
                        ) : (
                          <span className="badge badge-amber text-[10px]">Poor Site</span>
                        )}
                        <ScoreBadge score={biz.score} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-[var(--border-subtle)] bg-[rgba(11,18,32,0.4)] flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">247 businesses found · Demo data</span>
                <button className="text-xs text-[var(--blue-400)] hover:text-[var(--blue-300)] font-medium flex items-center gap-1 transition-colors">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a
        href="#features"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors animate-bounce"
      >
        <span className="text-xs">Explore</span>
        <ChevronDown className="w-4 h-4" />
      </a>
    </section>
  )
}
