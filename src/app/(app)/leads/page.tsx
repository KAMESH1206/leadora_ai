'use client'

import { useState, useEffect } from 'react'
import {
  Users, Search, Filter, Plus, ArrowRight, CheckCircle2,
  DollarSign, Globe, WifiOff, Phone, MapPin, MoreHorizontal,
  LayoutGrid, List, ChevronRight, FileText, Mail, Sparkles, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { AppLead } from '@/lib/store'

const STAGES: Array<{ id: AppLead['status']; label: string; color: string; bg: string }> = [
  { id: 'NEW', label: 'New Lead', color: 'var(--blue-400)', bg: 'rgba(59,130,246,0.1)' },
  { id: 'CONTACTED', label: 'Contacted', color: 'var(--cyan-400)', bg: 'rgba(34,211,238,0.1)' },
  { id: 'MEETING_SCHEDULED', label: 'Meeting Scheduled', color: 'var(--amber-400)', bg: 'rgba(245,158,11,0.1)' },
  { id: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'var(--purple-400)', bg: 'rgba(168,85,247,0.1)' },
  { id: 'WON', label: 'Won / Client', color: 'var(--emerald-400)', bg: 'rgba(16,185,129,0.1)' },
  { id: 'LOST', label: 'Lost', color: 'var(--rose-400)', bg: 'rgba(244,63,94,0.1)' },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<AppLead[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN')
  const [selectedLead, setSelectedLead] = useState<AppLead | null>(null)

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    setLoading(true)
    try {
      const res = await fetch('/api/leads')
      const data = await res.json()
      setLeads(data.leads || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleMoveStage(leadId: string, nextStatus: AppLead['status']) {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
    )

    try {
      await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: nextStatus }),
      })
    } catch (err) {
      console.error(err)
      fetchLeads()
    }
  }

  const filteredLeads = leads.filter(
    (l) =>
      l.businessName.toLowerCase().includes(search.toLowerCase()) ||
      l.category.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase())
  )

  const totalPipelineValue = leads.reduce((sum, l) => sum + (l.estimatedValue || 0), 0)
  const wonValue = leads
    .filter((l) => l.status === 'WON')
    .reduce((sum, l) => sum + (l.estimatedValue || 0), 0)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Users className="w-6 h-6 text-[var(--blue-400)]" />
            Lead Pipeline CRM
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track qualified business leads from discovery to proposal and closed deals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/discovery" className="btn btn-primary btn-sm gap-1.5">
            <Plus className="w-4 h-4" /> Discover Leads
          </Link>
        </div>
      </div>

      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Total Pipeline</span>
          <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">
            ${totalPipelineValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">{leads.length} active leads</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Closed Won Revenue</span>
          <div className="text-2xl font-bold text-[var(--emerald-400)] mt-1">
            ${wonValue.toLocaleString()}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Converted clients</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">In Proposals</span>
          <div className="text-2xl font-bold text-[var(--purple-400)] mt-1">
            {leads.filter((l) => l.status === 'PROPOSAL_SENT').length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Awaiting decision</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Meetings Scheduled</span>
          <div className="text-2xl font-bold text-[var(--amber-400)] mt-1">
            {leads.filter((l) => l.status === 'MEETING_SCHEDULED').length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Ready for presentation</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, category, city..."
            className="input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center p-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--navy-900)]">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'KANBAN'
                  ? 'bg-[var(--blue-500)] text-white'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'TABLE'
                  ? 'bg-[var(--blue-500)] text-white'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--blue-400)] mx-auto" />
          <p className="text-sm text-[var(--text-secondary)] mt-2">Loading pipeline leads...</p>
        </div>
      ) : viewMode === 'KANBAN' ? (
        /* Kanban Board */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto pb-6">
          {STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id)
            const stageTotal = stageLeads.reduce((s, l) => s + (l.estimatedValue || 0), 0)

            return (
              <div
                key={stage.id}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--navy-950)] flex flex-col min-w-[220px]"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: stage.color }}
                    />
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {stage.label}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--navy-800)] text-[var(--text-muted)]">
                      {stageLeads.length}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    ${(stageTotal / 1000).toFixed(1)}k
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2.5 flex-1 min-h-[350px]">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="card p-3 hover:border-[var(--blue-500)] transition-all cursor-pointer space-y-2 group"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--blue-400)] transition-colors leading-tight">
                          {lead.businessName}
                        </h4>
                        <span className="text-[10px] font-bold text-[var(--cyan-400)]">
                          {lead.opportunityScore}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                        <span>{lead.category}</span>
                        <span className="text-[var(--emerald-400)] font-semibold">
                          ${lead.estimatedValue.toLocaleString()}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                        {lead.website ? (
                          <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[100px]">
                            {lead.website.replace(/^https?:\/\//, '')}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[var(--rose-400)] flex items-center gap-1">
                            <WifiOff className="w-2.5 h-2.5" /> No Website
                          </span>
                        )}

                        {/* Stage Mover Selector */}
                        <select
                          value={lead.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleMoveStage(lead.id, e.target.value as AppLead['status'])}
                          className="text-[10px] bg-[var(--navy-900)] border border-[var(--border-subtle)] rounded text-[var(--text-secondary)] px-1 py-0.5"
                        >
                          {STAGES.map((s) => (
                            <option key={s.id} value={s.id}>
                              → {s.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div className="h-28 border border-dashed border-[var(--border-subtle)] rounded-lg flex items-center justify-center text-[11px] text-[var(--text-muted)] opacity-50">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Table View */
        <div className="card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--navy-900)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Business</th>
                <th className="py-3 px-4">Category & Location</th>
                <th className="py-3 px-4">Web Status</th>
                <th className="py-3 px-4">Opportunity</th>
                <th className="py-3 px-4">Est. Value</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[var(--navy-900)] transition-colors">
                  <td className="py-3 px-4 font-bold text-[var(--text-primary)]">
                    {lead.businessName}
                  </td>
                  <td className="py-3 px-4 text-[var(--text-secondary)]">
                    {lead.category} · {lead.city}
                  </td>
                  <td className="py-3 px-4">
                    {lead.websiteStatus === 'NO_WEBSITE' ? (
                      <span className="text-[var(--rose-400)] flex items-center gap-1">
                        <WifiOff className="w-3 h-3" /> No Website
                      </span>
                    ) : (
                      <span className="text-[var(--text-secondary)] flex items-center gap-1">
                        <Globe className="w-3 h-3 text-[var(--blue-400)]" /> {lead.websiteStatus}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-[var(--cyan-400)]">
                    {lead.opportunityScore}%
                  </td>
                  <td className="py-3 px-4 font-semibold text-[var(--emerald-400)]">
                    ${lead.estimatedValue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) => handleMoveStage(lead.id, e.target.value as AppLead['status'])}
                      className="bg-[var(--navy-800)] border border-[var(--border-subtle)] text-[var(--text-secondary)] rounded px-2 py-1 text-xs"
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="btn btn-secondary btn-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail Drawer / Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[var(--navy-950)] border-l border-[var(--border-default)] w-full max-w-lg h-full p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--cyan-400)] tracking-wider">
                  Lead Details
                </span>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mt-1">
                  {selectedLead.businessName}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {selectedLead.category} · {selectedLead.city}
                </p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-[var(--text-muted)] hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-3">
                <span className="text-[10px] text-[var(--text-muted)] uppercase">Opportunity Score</span>
                <div className="text-xl font-bold text-[var(--blue-400)] mt-0.5">
                  {selectedLead.opportunityScore}/100
                </div>
              </div>
              <div className="card p-3">
                <span className="text-[10px] text-[var(--text-muted)] uppercase">Estimated Deal Value</span>
                <div className="text-xl font-bold text-[var(--emerald-400)] mt-0.5">
                  ${selectedLead.estimatedValue.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Contact & Status */}
            <div className="card p-4 space-y-3">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Pipeline Status
              </h4>
              <div className="flex items-center gap-3">
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    handleMoveStage(selectedLead.id, e.target.value as AppLead['status'])
                    setSelectedLead({ ...selectedLead, status: e.target.value as AppLead['status'] })
                  }}
                  className="input text-xs w-full"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLead.phone && (
                <div className="text-xs text-[var(--text-secondary)] flex items-center gap-2 pt-2">
                  <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  {selectedLead.phone}
                </div>
              )}
            </div>

            {/* Notes & Strategy */}
            <div className="card p-4 space-y-2">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">
                Strategic Pitch Notes
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {selectedLead.notes || 'No pitch notes logged yet.'}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2">
              <Link
                href="/proposals"
                className="btn btn-primary w-full justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> Create Proposal
              </Link>
              <Link
                href="/outreach"
                className="btn btn-secondary w-full justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Generate Outreach Pitch
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
