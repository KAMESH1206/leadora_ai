'use client'

import { useState, useEffect } from 'react'
import {
  FileText, Plus, CheckCircle2, DollarSign, Calendar,
  ArrowRight, Download, Eye, Sparkles, Send, X, Loader2
} from 'lucide-react'
import { AppProposal } from '@/lib/store'

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<AppProposal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProposal, setSelectedProposal] = useState<AppProposal | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Demo studio tab
  const [demoMode, setDemoMode] = useState<'BEFORE' | 'AFTER'>('AFTER')

  // Form state
  const [clientBusiness, setClientBusiness] = useState('')
  const [clientName, setClientName] = useState('')
  const [serviceType, setServiceType] = useState('FULL_WEBSITE')
  const [title, setTitle] = useState('')
  const [priceMin, setPriceMin] = useState(4500)
  const [priceMax, setPriceMax] = useState(6500)
  const [timeline, setTimeline] = useState('3 Weeks')
  const [problemStatement, setProblemStatement] = useState('')
  const [solution, setSolution] = useState('')

  useEffect(() => {
    fetchProposals()
  }, [])

  async function fetchProposals() {
    setLoading(true)
    try {
      const res = await fetch('/api/proposals')
      const data = await res.json()
      setProposals(data.proposals || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateProposal(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: `lead-${Date.now()}`,
          clientName: clientName || 'Business Owner',
          clientBusiness: clientBusiness || 'Local Enterprise',
          serviceType,
          title: title || `${clientBusiness} Modern Web Upgrade`,
          status: 'DRAFT',
          priceMin: Number(priceMin),
          priceMax: Number(priceMax),
          timeline,
          problemStatement: problemStatement || 'Lacks a modern conversion-optimized digital presence.',
          solution: solution || 'Custom headless web platform with instant booking, edge SSL, and local SEO.',
          features: [
            { title: 'Responsive Next.js Architecture', description: 'Sub-second page speeds on all mobile and desktop viewports.', included: true },
            { title: 'Online Inquiries & Appointment Engine', description: 'Automated 24/7 client booking and SMS reminders.', included: true },
            { title: 'Local Search SEO & Schema Markup', description: 'Structured JSON-LD schema for Google Maps prominence.', included: true },
          ],
        }),
      })

      if (res.ok) {
        setShowCreateModal(false)
        fetchProposals()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-[var(--blue-400)]" />
            Proposal Studio & Generator
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Build high-converting, tailored development proposals with interactive scope, deliverables, and pricing.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary btn-sm gap-1.5"
        >
          <Plus className="w-4 h-4" /> New Proposal
        </button>
      </div>

      {/* Proposals Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--blue-400)] mx-auto" />
          <p className="text-sm text-[var(--text-secondary)] mt-2">Loading proposal records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="card p-5 flex flex-col justify-between hover:border-[var(--blue-500)] transition-all cursor-pointer group"
              onClick={() => setSelectedProposal(prop)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono text-[var(--cyan-400)] bg-[var(--navy-800)] px-2 py-0.5 rounded">
                    {prop.serviceType}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prop.status === 'SENT'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {prop.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--blue-400)] transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    For: {prop.clientBusiness} ({prop.clientName})
                  </p>
                </div>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {prop.solution}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[var(--text-muted)] block">Investment</span>
                  <span className="text-sm font-bold text-[var(--emerald-400)]">
                    ${prop.priceMin.toLocaleString()} - ${prop.priceMax.toLocaleString()}
                  </span>
                </div>

                <span className="btn btn-secondary btn-sm gap-1">
                  <Eye className="w-3.5 h-3.5" /> Preview
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proposal Preview Modal */}
      {selectedProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-[var(--border-default)] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--blue-400)]">
                  Client Proposal Document
                </span>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                  {selectedProposal.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Prepared for: {selectedProposal.clientBusiness} · Attn: {selectedProposal.clientName}
                </p>
              </div>
              <button
                onClick={() => setSelectedProposal(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-white hover:bg-[var(--navy-800)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Demo Studio Preview */}
            <div className="p-5 rounded-2xl bg-[var(--navy-900)] border border-[var(--border-subtle)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--cyan-400)]" />
                  <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                    Interactive Demo Studio (Before & After Preview)
                  </span>
                </div>
                <div className="flex items-center p-0.5 rounded-lg bg-[var(--navy-950)] border border-[var(--border-subtle)]">
                  <button
                    onClick={() => setDemoMode('BEFORE')}
                    className={`px-3 py-1 rounded text-xs font-semibold ${demoMode === 'BEFORE' ? 'bg-rose-500/20 text-rose-400' : 'text-[var(--text-muted)]'}`}
                  >
                    Current State
                  </button>
                  <button
                    onClick={() => setDemoMode('AFTER')}
                    className={`px-3 py-1 rounded text-xs font-semibold ${demoMode === 'AFTER' ? 'bg-emerald-500/20 text-emerald-400' : 'text-[var(--text-muted)]'}`}
                  >
                    Leadora Redesign Prototype
                  </button>
                </div>
              </div>

              {demoMode === 'BEFORE' ? (
                <div className="p-6 rounded-xl bg-black/40 border border-rose-500/30 space-y-2 text-center py-10">
                  <span className="text-xs font-mono text-rose-400 uppercase">Current Audit Obstacles</span>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    Sluggish Page Load (3.8s) · Missing SSL Security Alert · No Mobile Direct Booking
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                    Customer drop-off rate estimated at 42% due to unoptimized mobile interface and lack of modern conversion triggers.
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-[var(--blue-500)]/40 space-y-3">
                  <span className="text-xs font-mono text-[var(--cyan-400)] uppercase">Proposed Production Architecture</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-[var(--navy-950)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Page Speed</span>
                      <span className="text-base font-bold text-[var(--emerald-400)]">0.4s (99/100)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--navy-950)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Direct Bookings</span>
                      <span className="text-base font-bold text-[var(--blue-400)]">1-Click Mobile</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--navy-950)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] text-[var(--text-muted)] block">Expected ROI</span>
                      <span className="text-base font-bold text-[var(--cyan-400)]">+28% Bookings</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Scope & Solution */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  1. The Opportunity & Problem Statement
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {selectedProposal.problemStatement}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  2. Proposed High-Impact Solution
                </h4>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {selectedProposal.solution}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                  3. Scope of Work & Included Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProposal.features?.map((f, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[var(--navy-900)] border border-[var(--border-subtle)] flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-[var(--emerald-400)] flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-[var(--text-primary)]">{f.title}</h5>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{f.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment & Timeline Strip */}
            <div className="p-5 rounded-2xl bg-[var(--navy-900)] border border-[var(--border-default)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-[var(--text-muted)] block">Project Timeline</span>
                <span className="text-base font-bold text-[var(--text-primary)]">{selectedProposal.timeline}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-xs text-[var(--text-muted)] block">Total Investment</span>
                <span className="text-2xl font-black text-[var(--emerald-400)]">
                  ${selectedProposal.priceMin.toLocaleString()} - ${selectedProposal.priceMax.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Print / Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
              <button
                onClick={() => window.print()}
                className="btn btn-secondary gap-2"
              >
                <Download className="w-4 h-4" /> Export Proposal PDF
              </button>
              <button
                onClick={() => setSelectedProposal(null)}
                className="btn btn-primary gap-2"
              >
                <Send className="w-4 h-4" /> Send to Client via Outreach
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Proposal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleCreateProposal}
            className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[var(--border-default)] space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--blue-400)]" />
                Generate New Agency Proposal
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Client Business Name
                </label>
                <input
                  type="text"
                  required
                  value={clientBusiness}
                  onChange={(e) => setClientBusiness(e.target.value)}
                  placeholder="e.g. Apex Auto Repair"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Contact Person / Owner
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Dave Miller"
                  className="input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Proposal Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. High-Converting Mobile Booking Portal & Brand Redesign"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Minimum Price ($)
                </label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value))}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Maximum Price ($)
                </label>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Problem Statement
                </label>
                <textarea
                  rows={2}
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Describe the current website or conversion bottleneck..."
                  className="input"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                  Proposed Solution
                </label>
                <textarea
                  rows={2}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  placeholder="Outline the modern architecture, design, and ROI..."
                  className="input"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Create Proposal Document</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
