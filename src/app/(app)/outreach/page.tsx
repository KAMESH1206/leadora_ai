'use client'

import { useState, useEffect } from 'react'
import {
  Mail, Send, CheckCircle2, ShieldCheck, Clock, AlertTriangle,
  Sparkles, Plus, Eye, Check, X, RefreshCw, Loader2, MessageSquare
} from 'lucide-react'
import { AppOutreach } from '@/lib/store'

export default function OutreachPage() {
  const [messages, setMessages] = useState<AppOutreach[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState<AppOutreach | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'DRAFT' | 'APPROVED' | 'SENT'>('ALL')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    try {
      const res = await fetch('/api/outreach')
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateStatus(id: string, status: AppOutreach['status']) {
    setActionLoading(id)
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    )

    try {
      await fetch('/api/outreach', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg({ ...selectedMsg, status })
      }
    } catch (err) {
      console.error(err)
      fetchMessages()
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = messages.filter((m) => (filter === 'ALL' ? true : m.status === filter))

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-[var(--blue-400)]" />
            Compliant Outreach & Pitch Approval Workflow
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Human-in-the-loop review queue for AI-personalized pitches with built-in CAN-SPAM and rate-limit guardrails.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[rgba(16,185,129,0.1)] text-[var(--emerald-400)] border border-[rgba(16,185,129,0.25)]">
          <ShieldCheck className="w-4 h-4" /> CAN-SPAM & Rate-Limit Guardrails Active
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Drafts Awaiting Approval</span>
          <div className="text-2xl font-bold text-[var(--amber-400)] mt-1">
            {messages.filter((m) => m.status === 'DRAFT').length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Requires human review</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Approved & Queued</span>
          <div className="text-2xl font-bold text-[var(--blue-400)] mt-1">
            {messages.filter((m) => m.status === 'APPROVED').length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Ready for dispatch</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Delivered Pitches</span>
          <div className="text-2xl font-bold text-[var(--emerald-400)] mt-1">
            {messages.filter((m) => m.status === 'SENT').length}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Delivered to client inbox</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Response Rate</span>
          <div className="text-2xl font-bold text-[var(--cyan-400)] mt-1">
            34.2%
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">3x industry standard</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
        {(['ALL', 'DRAFT', 'APPROVED', 'SENT'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-[var(--blue-500)] text-white'
                : 'text-[var(--text-secondary)] hover:text-white bg-[var(--navy-900)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Messages List */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--blue-400)] mx-auto" />
          <p className="text-sm text-[var(--text-secondary)] mt-2">Loading outreach campaigns...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((msg) => {
            const isPending = msg.status === 'DRAFT'
            const isApproved = msg.status === 'APPROVED'
            const isSent = msg.status === 'SENT'

            return (
              <div
                key={msg.id}
                className="card p-5 hover:border-[var(--blue-500)] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-[var(--text-primary)]">
                        {msg.recipientBusiness}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isPending
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : isApproved
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Recipient: {msg.recipientName} ({msg.recipientEmail})
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isPending && (
                      <button
                        onClick={() => handleUpdateStatus(msg.id, 'APPROVED')}
                        className="btn btn-primary btn-sm gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve Pitch
                      </button>
                    )}

                    {isApproved && (
                      <button
                        onClick={() => handleUpdateStatus(msg.id, 'SENT')}
                        className="btn btn-primary btn-sm gap-1 bg-emerald-600 hover:bg-emerald-500"
                      >
                        <Send className="w-3.5 h-3.5" /> Send Now
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedMsg(msg)}
                      className="btn btn-secondary btn-sm gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Review Content
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[var(--navy-900)] border border-[var(--border-subtle)] space-y-1">
                  <span className="text-xs font-semibold text-[var(--text-primary)] block">
                    Subject: {msg.subject}
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {msg.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Message Review Modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[var(--border-default)] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--blue-400)] tracking-wider">
                  Outreach Review & Approval
                </span>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mt-0.5">
                  {selectedMsg.recipientBusiness}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMsg(null)}
                className="text-[var(--text-muted)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-[var(--text-muted)] block">To</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {selectedMsg.recipientName} &lt;{selectedMsg.recipientEmail}&gt;
                </span>
              </div>

              <div>
                <span className="text-xs text-[var(--text-muted)] block">Subject</span>
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {selectedMsg.subject}
                </span>
              </div>

              <div>
                <span className="text-xs text-[var(--text-muted)] block mb-1">Message Body</span>
                <div className="p-4 rounded-xl bg-[var(--navy-900)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed font-sans">
                  {selectedMsg.body}
                </div>
              </div>

              {/* Compliance Footer Preview */}
              <div className="p-3 rounded-lg bg-[var(--navy-950)] border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] space-y-1">
                <span className="font-bold text-[var(--text-secondary)] block">
                  Mandatory Compliance Footer (Automatically Injected):
                </span>
                <p>
                  You received this email because your business was identified as a local service provider in your area.
                  To stop receiving future emails, click here to Unsubscribe. Leadora AI, 100 Market St, San Francisco, CA.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
              {selectedMsg.status === 'DRAFT' && (
                <button
                  onClick={() => handleUpdateStatus(selectedMsg.id, 'APPROVED')}
                  className="btn btn-primary gap-2"
                >
                  <Check className="w-4 h-4" /> Approve for Dispatch
                </button>
              )}
              {selectedMsg.status === 'APPROVED' && (
                <button
                  onClick={() => handleUpdateStatus(selectedMsg.id, 'SENT')}
                  className="btn btn-primary gap-2 bg-emerald-600 hover:bg-emerald-500"
                >
                  <Send className="w-4 h-4" /> Dispatch Email Now
                </button>
              )}
              <button
                onClick={() => setSelectedMsg(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
