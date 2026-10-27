'use client'

import { useState } from 'react'
import {
  Building2, Search, Filter, Globe, WifiOff, Star, Phone,
  Sparkles, CheckCircle2, ShieldAlert, ArrowRight, ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { DiscoveredBusiness } from '@/lib/discovery'

// Business directory catalog with rich opportunity scoring
const DIRECTORY_BUSINESSES: DiscoveredBusiness[] = [
  {
    id: 'biz-1',
    name: 'Apex Precision Auto Repair',
    category: 'Auto Repair',
    address: '1420 Howard St',
    city: 'San Francisco',
    state: 'CA',
    phone: '+1 (555) 234-5678',
    website: undefined,
    websiteStatus: 'NO_WEBSITE',
    opportunityScore: 96,
    rating: 4.8,
    reviewCount: 142,
    detectedTech: [],
    recommendedPitch: 'No digital presence detected despite 140+ 5-star Google reviews. Needs an instant mobile booking and diagnostic estimate portal.',
    estimatedProjectValue: 4200,
  },
  {
    id: 'biz-2',
    name: 'Boulangerie Saint-Germain Bakery',
    category: 'Bakery & Cafe',
    address: '890 Valencia St',
    city: 'San Francisco',
    state: 'CA',
    phone: '+1 (555) 345-6789',
    website: 'http://saintgermainbakery-sf.weebly.com',
    websiteStatus: 'OUTDATED',
    opportunityScore: 89,
    rating: 4.6,
    reviewCount: 88,
    detectedTech: ['Weebly', 'HTTP Only', 'Unresponsive Viewport'],
    recommendedPitch: 'Non-HTTPS Weebly site built in 2017. Lacks mobile ordering and loses weekend breakfast reservation traffic.',
    estimatedProjectValue: 3500,
  },
  {
    id: 'biz-3',
    name: 'Vanguard Family Dental & Orthodontics',
    category: 'Dental Clinic',
    address: '500 Sutter St, Suite 400',
    city: 'San Francisco',
    state: 'CA',
    phone: '+1 (555) 456-7890',
    website: 'http://vanguarddentalcare.net',
    websiteStatus: 'NEEDS_UPGRADE',
    opportunityScore: 84,
    rating: 4.9,
    reviewCount: 310,
    detectedTech: ['WordPress 4.9', 'Slow TTFB (>3.2s)', 'No Online Scheduling'],
    recommendedPitch: 'High-margin dental practice on outdated WordPress. Patients cannot book appointments online or fill digital intake forms.',
    estimatedProjectValue: 5800,
  },
  {
    id: 'biz-4',
    name: 'Coastal Haven Boutique Hotel',
    category: 'Hospitality',
    address: '122 Beach St',
    city: 'San Francisco',
    state: 'CA',
    phone: '+1 (555) 567-8901',
    website: 'http://coastalhavenhotel.com',
    websiteStatus: 'OUTDATED',
    opportunityScore: 91,
    rating: 4.3,
    reviewCount: 220,
    detectedTech: ['Static HTML 2015', 'No Direct Booking Engine', 'Missing SSL'],
    recommendedPitch: 'Paying 18-25% OTA commissions to Expedia and Booking.com because their own website lacks a direct reservation engine.',
    estimatedProjectValue: 7500,
  },
  {
    id: 'biz-5',
    name: 'Ironwood Custom Cabinetry',
    category: 'Contractors',
    address: '3200 3rd St',
    city: 'San Francisco',
    state: 'CA',
    phone: '+1 (555) 678-9012',
    website: 'https://ironwoodcabinets.wixsite.com/home',
    websiteStatus: 'NEEDS_UPGRADE',
    opportunityScore: 78,
    rating: 5.0,
    reviewCount: 47,
    detectedTech: ['Free Wix Subdomain', 'Wix Branding Ads', 'Slow Mobile Load'],
    recommendedPitch: 'Premium high-ticket craftsman using a free Wix subdomain with banner ads. Undermines $15k-$50k custom kitchen credibility.',
    estimatedProjectValue: 4900,
  },
  {
    id: 'biz-6',
    name: 'Meridian Law & Estate Planning',
    category: 'Legal Services',
    address: '450 Sansome St',
    city: 'San Francisco',
    state: 'CA',
    phone: '+1 (555) 789-0123',
    website: 'http://meridianlawfirm.org',
    websiteStatus: 'NEEDS_UPGRADE',
    opportunityScore: 82,
    rating: 4.8,
    reviewCount: 95,
    detectedTech: ['Joomla 3', 'HTTP Insecure', 'No Mobile Form'],
    recommendedPitch: 'High net worth estate practice on unmaintained Joomla. Insecure HTTP warnings discourage prospective client inquiries.',
    estimatedProjectValue: 6200,
  },
]

export default function BusinessesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL' | 'NO_WEBSITE' | 'OUTDATED'>('ALL')
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  const filtered = DIRECTORY_BUSINESSES.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
    if (filter === 'NO_WEBSITE') return matchesSearch && b.websiteStatus === 'NO_WEBSITE'
    if (filter === 'OUTDATED') return matchesSearch && (b.websiteStatus === 'OUTDATED' || b.websiteStatus === 'NEEDS_UPGRADE')
    return matchesSearch
  })

  async function handleSaveLead(biz: DiscoveredBusiness) {
    try {
      const res = await fetch('/api/discovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_lead', business: biz }),
      })
      if (res.ok) {
        setSaved((prev) => ({ ...prev, [biz.id]: true }))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[var(--blue-400)]" />
            Discovered Business Directory
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Explore businesses cataloged across your discovery scans and monitor their digital presence.
          </p>
        </div>

        <Link href="/discovery" className="btn btn-primary btn-sm gap-1.5">
          <Sparkles className="w-4 h-4" /> Run Discovery Scan
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business name or category..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`btn btn-sm text-xs ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
          >
            All ({DIRECTORY_BUSINESSES.length})
          </button>
          <button
            onClick={() => setFilter('NO_WEBSITE')}
            className={`btn btn-sm text-xs ${filter === 'NO_WEBSITE' ? 'btn-primary' : 'btn-secondary'}`}
          >
            No Website
          </button>
          <button
            onClick={() => setFilter('OUTDATED')}
            className={`btn btn-sm text-xs ${filter === 'OUTDATED' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Outdated / Vulnerable
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((biz) => {
          const isNoWeb = biz.websiteStatus === 'NO_WEBSITE'
          const isSaved = saved[biz.id]

          return (
            <div
              key={biz.id}
              className="card p-5 flex flex-col justify-between hover:border-[var(--blue-500)] transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono text-[var(--cyan-400)] bg-[var(--navy-800)] px-2 py-0.5 rounded">
                    {biz.category}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-xs text-[var(--blue-400)]">
                    Score: {biz.opportunityScore}%
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {biz.name}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {biz.address}, {biz.city}, {biz.state}
                  </p>
                </div>

                {/* Status */}
                <div>
                  {isNoWeb ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-[rgba(244,63,94,0.1)] text-[var(--rose-400)] border border-[rgba(244,63,94,0.2)]">
                      <WifiOff className="w-3 h-3" /> No Website Detected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-[rgba(245,158,11,0.1)] text-[var(--amber-400)] border border-[rgba(245,158,11,0.2)]">
                      <ShieldAlert className="w-3 h-3" /> Outdated Web Stack
                    </span>
                  )}
                </div>

                {/* Pitch preview */}
                <p className="text-xs text-[var(--text-secondary)] bg-[var(--navy-900)] p-2.5 rounded-lg border border-[var(--border-subtle)] leading-relaxed">
                  {biz.recommendedPitch}
                </p>
              </div>

              {/* Bottom Strip */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Est. Agency Value</span>
                  <span className="text-sm font-bold text-[var(--emerald-400)]">
                    ${biz.estimatedProjectValue.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => handleSaveLead(biz)}
                  disabled={isSaved}
                  className="btn btn-secondary btn-sm gap-1.5"
                >
                  {isSaved ? (
                    <><CheckCircle2 className="w-3.5 h-3.5 text-[var(--emerald-400)]" /> Added</>
                  ) : (
                    <>Add to CRM</>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
