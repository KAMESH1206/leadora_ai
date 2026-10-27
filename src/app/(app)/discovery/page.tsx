'use client'

import { useState } from 'react'
import {
  Search, MapPin, Filter, Loader2, Building2, WifiOff, Globe, Zap,
  ArrowRight, CheckCircle2, ShieldAlert, Sparkles, X, ExternalLink,
  ChevronRight, Phone, DollarSign, Star
} from 'lucide-react'
import { DiscoveredBusiness } from '@/lib/discovery'
import { WebsiteAuditResult } from '@/lib/audit-engine'

const CATEGORIES = [
  'Auto Repair',
  'Bakery & Cafe',
  'Dental Clinic',
  'Physical Therapy',
  'Hospitality & Boutique Hotels',
  'Contractors & Custom Cabinetry',
  'Legal Services & Estate Planning',
  'Landscaping & Tree Service',
  'Restaurants',
  'Gyms & Fitness Studios',
  'Salons & Spas',
  'Plumbers & Electricians',
]

export default function DiscoveryPage() {
  const [category, setCategory] = useState('Auto Repair')
  const [location, setLocation] = useState('San Francisco, CA')
  const [radiusMeters, setRadiusMeters] = useState(5000)
  const [websiteFilter, setWebsiteFilter] = useState<'ALL' | 'NO_WEBSITE_ONLY' | 'OUTDATED_ONLY' | 'HAS_WEBSITE'>('ALL')

  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DiscoveredBusiness[]>([])
  const [searched, setSearched] = useState(false)
  const [providerInfo, setProviderInfo] = useState<{ provider: string; hasLiveCredentials: boolean } | null>(null)

  // Audit modal state
  const [auditingBiz, setAuditingBiz] = useState<DiscoveredBusiness | null>(null)
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditResult, setAuditResult] = useState<WebsiteAuditResult | null>(null)

  // CRM saving state
  const [savedLeads, setSavedLeads] = useState<Record<string, boolean>>({})
  const [savingLeadId, setSavingLeadId] = useState<string | null>(null)

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setLoading(true)
    setSearched(true)

    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, location, radiusMeters, websiteFilter }),
      })
      const data = await res.json()
      setResults(data.businesses || [])
      setProviderInfo({ provider: data.provider, hasLiveCredentials: data.hasLiveCredentials })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleRunAudit(biz: DiscoveredBusiness) {
    setAuditingBiz(biz)
    setAuditLoading(true)
    setAuditResult(null)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: biz.website || biz.name,
          isNoWebsite: biz.websiteStatus === 'NO_WEBSITE',
        }),
      })
      const data = await res.json()
      setAuditResult(data)
    } catch (err) {
      console.error(err)
    } finally {
      setAuditLoading(false)
    }
  }

  async function handleSaveLead(biz: DiscoveredBusiness) {
    setSavingLeadId(biz.id)
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_lead', business: biz }),
      })
      if (res.ok) {
        setSavedLeads((prev) => ({ ...prev, [biz.id]: true }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSavingLeadId(null)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-[var(--blue-400)]" />
            Business Discovery Engine
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Search local businesses, uncover missing/outdated websites, and discover high-margin development opportunities.
          </p>
        </div>

        {providerInfo && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--border-subtle)] bg-[var(--navy-900)]">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: providerInfo.hasLiveCredentials ? 'var(--emerald-400)' : 'var(--blue-400)' }}
            />
            <span className="text-[var(--text-secondary)]">
              {providerInfo.hasLiveCredentials ? 'Google Places Live API' : 'Leadora Development Adapter'}
            </span>
          </div>
        )}
      </div>

      {/* Search Form Card */}
      <form onSubmit={handleSearch} className="card p-6 shadow-xl border border-[var(--border-default)]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category */}
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Business Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input w-full bg-[var(--navy-900)]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              City or Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Austin, TX"
                className="input pl-9 w-full"
                required
              />
            </div>
          </div>

          {/* Website Filter */}
          <div className="md:col-span-1">
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
              Website Filter
            </label>
            <select
              value={websiteFilter}
              onChange={(e: any) => setWebsiteFilter(e.target.value)}
              className="input w-full bg-[var(--navy-900)]"
            >
              <option value="ALL">All Businesses</option>
              <option value="NO_WEBSITE_ONLY">No Website Detected (High Margin)</option>
              <option value="OUTDATED_ONLY">Outdated / Insecure Sites</option>
              <option value="HAS_WEBSITE">Has Existing Website</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-6 text-xs text-[var(--text-muted)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <span>Radius:</span>
              <select
                value={radiusMeters}
                onChange={(e) => setRadiusMeters(Number(e.target.value))}
                className="bg-[var(--navy-800)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded px-2 py-0.5 text-xs"
              >
                <option value={2000}>2 km (Dense Urban)</option>
                <option value={5000}>5 km (Standard)</option>
                <option value={15000}>15 km (Suburban)</option>
                <option value={30000}>30 km (Metro Area)</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-6 gap-2"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Scanning Area...</>
            ) : (
              <><Search className="w-4 h-4" /> Discover Opportunities</>
            )}
          </button>
        </div>
      </form>

      {/* Results Section */}
      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Discovered Opportunities ({results.length})
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              Ranked by Agency Opportunity Score
            </span>
          </div>

          {results.length === 0 && !loading && (
            <div className="card p-12 text-center border-dashed">
              <Building2 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
              <h3 className="text-base font-medium text-[var(--text-primary)]">No businesses matched this filter</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Try widening your search radius or selecting &quot;All Businesses&quot;.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {results.map((biz) => {
              const isNoWeb = biz.websiteStatus === 'NO_WEBSITE'
              const isOutdated = biz.websiteStatus === 'OUTDATED' || biz.websiteStatus === 'NEEDS_UPGRADE'
              const isSaved = savedLeads[biz.id]
              const isSaving = savingLeadId === biz.id

              return (
                <div
                  key={biz.id}
                  className="card p-5 hover:border-[var(--blue-500)] transition-all duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    {/* Business Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--blue-400)] transition-colors">
                          {biz.name}
                        </h3>

                        {/* Status Badge */}
                        {isNoWeb ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(244,63,94,0.12)] text-[var(--rose-400)] border border-[rgba(244,63,94,0.25)]">
                            <WifiOff className="w-3 h-3" /> No Website Detected
                          </span>
                        ) : isOutdated ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(245,158,11,0.12)] text-[var(--amber-400)] border border-[rgba(245,158,11,0.25)]">
                            <ShieldAlert className="w-3 h-3" /> Outdated / Needs Upgrade
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(16,185,129,0.12)] text-[var(--emerald-400)] border border-[rgba(16,185,129,0.25)]">
                            <Globe className="w-3 h-3" /> Active Web Domain
                          </span>
                        )}

                        {/* Rating */}
                        {biz.rating && (
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--amber-400)] font-medium">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {biz.rating} ({biz.reviewCount} reviews)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] flex-wrap">
                        <span className="flex items-center gap-1 text-[var(--text-muted)]">
                          <MapPin className="w-3.5 h-3.5" /> {biz.address}, {biz.city}
                        </span>
                        {biz.phone && (
                          <span className="flex items-center gap-1 text-[var(--text-muted)]">
                            <Phone className="w-3.5 h-3.5" /> {biz.phone}
                          </span>
                        )}
                        {biz.website && (
                          <a
                            href={biz.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[var(--blue-400)] hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> {biz.website}
                          </a>
                        )}
                      </div>

                      {/* Pitch recommendation preview */}
                      <p className="text-xs text-[var(--text-secondary)] bg-[var(--navy-950)] p-2.5 rounded-lg border border-[var(--border-subtle)] leading-relaxed">
                        <strong className="text-[var(--blue-400)]">Angle: </strong>
                        {biz.recommendedPitch}
                      </p>

                      {/* Tech stack badges */}
                      {biz.detectedTech && biz.detectedTech.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-wider">Detected:</span>
                          {biz.detectedTech.map((tech) => (
                            <span key={tech} className="px-2 py-0.5 rounded bg-[var(--navy-800)] text-[var(--text-secondary)] text-[10px] font-mono border border-[var(--border-subtle)]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Score & Actions */}
                    <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--border-subtle)]">
                      {/* Opportunity Score */}
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <span className="text-xs text-[var(--text-muted)] block">Opportunity Score</span>
                            <span className="text-2xl font-black text-gradient">
                              {biz.opportunityScore}/100
                            </span>
                          </div>
                          <div className="w-10 h-10 rounded-full border-2 border-[var(--blue-400)] flex items-center justify-center font-bold text-xs text-[var(--cyan-400)] bg-[var(--navy-900)]">
                            {biz.opportunityScore}%
                          </div>
                        </div>
                        <div className="text-[11px] text-[var(--emerald-400)] font-medium mt-1">
                          Est. Value: ${biz.estimatedProjectValue.toLocaleString()}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRunAudit(biz)}
                          className="btn btn-secondary btn-sm gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[var(--cyan-400)]" />
                          Audit
                        </button>

                        <button
                          onClick={() => handleSaveLead(biz)}
                          disabled={isSaved || isSaving}
                          className="btn btn-primary btn-sm gap-1.5"
                        >
                          {isSaved ? (
                            <><CheckCircle2 className="w-3.5 h-3.5 text-[var(--emerald-400)]" /> Saved to CRM</>
                          ) : isSaving ? (
                            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
                          ) : (
                            <><PlusIcon className="w-3.5 h-3.5" /> Save as Lead</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {auditingBiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[var(--border-default)]">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[var(--blue-400)]" />
                  Website Audit & Opportunity Analysis
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {auditingBiz.name} · {auditingBiz.website || 'No Website'}
                </p>
              </div>
              <button
                onClick={() => setAuditingBiz(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[var(--navy-800)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {auditLoading ? (
              <div className="py-20 text-center space-y-3">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--blue-400)] mx-auto" />
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  Running multi-point performance, SEO & security audit...
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Analyzing SSL protocols, mobile viewports, and conversion bottlenecks
                </p>
              </div>
            ) : auditResult ? (
              <div className="py-5 space-y-6">
                {/* Score Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="stat-card p-3 text-center">
                    <span className="text-xs text-[var(--text-muted)]">Opportunity</span>
                    <div className="text-2xl font-bold text-[var(--blue-400)] mt-1">
                      {auditResult.opportunityScore}/100
                    </div>
                  </div>
                  <div className="stat-card p-3 text-center">
                    <span className="text-xs text-[var(--text-muted)]">Performance</span>
                    <div className="text-2xl font-bold text-[var(--amber-400)] mt-1">
                      {auditResult.performanceScore}/100
                    </div>
                  </div>
                  <div className="stat-card p-3 text-center">
                    <span className="text-xs text-[var(--text-muted)]">SEO & Schema</span>
                    <div className="text-2xl font-bold text-[var(--cyan-400)] mt-1">
                      {auditResult.seoScore}/100
                    </div>
                  </div>
                  <div className="stat-card p-3 text-center">
                    <span className="text-xs text-[var(--text-muted)]">Mobile UX</span>
                    <div className="text-2xl font-bold text-[var(--rose-400)] mt-1">
                      {auditResult.mobileUsabilityScore}/100
                    </div>
                  </div>
                </div>

                {/* Summary Statement */}
                <div className="p-4 rounded-xl bg-[rgba(59,130,246,0.08)] border border-[var(--border-default)]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--blue-400)] mb-1">
                    Executive Summary
                  </h4>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                    {auditResult.summaryStatement}
                  </p>
                </div>

                {/* Explainable Findings */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    Audit Findings & Client Pitch Angles ({auditResult.findings.length})
                  </h4>

                  {auditResult.findings.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-xl bg-[var(--navy-900)] border border-[var(--border-subtle)] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${f.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                          {f.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--navy-800)] text-[var(--text-muted)]">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">{f.description}</p>
                      <div className="p-2.5 rounded bg-[var(--navy-950)] border border-[var(--border-subtle)] text-xs text-[var(--cyan-300)] font-sans">
                        <strong>Pitch Angle: </strong>&ldquo;{f.clientPitch}&rdquo;
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Recommendation */}
                <div className="p-4 rounded-xl bg-[var(--navy-900)] border border-[var(--border-default)] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[var(--text-muted)] block">Recommended Agency Package</span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {auditResult.estimatedAgencyPricing.recommendedPackage}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[var(--text-muted)] block">Recommended Price</span>
                    <span className="text-base font-bold text-[var(--emerald-400)]">
                      ${auditResult.estimatedAgencyPricing.minPrice} - ${auditResult.estimatedAgencyPricing.maxPrice}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => {
                      handleSaveLead(auditingBiz)
                      setAuditingBiz(null)
                    }}
                    className="btn btn-primary gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Save Lead to CRM
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
