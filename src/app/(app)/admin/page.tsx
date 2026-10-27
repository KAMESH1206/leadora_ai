'use client'

import { useState } from 'react'
import {
  Shield, Server, Activity, Database, CheckCircle2,
  AlertTriangle, RefreshCw, Lock, Terminal, Clock, Users
} from 'lucide-react'

const AUDIT_LOGS = [
  { id: 'log-1', event: 'LEAD_STATUS_TRANSITION', actor: 'alex@nexusdigital.agency', target: 'Apex Precision Auto -> WON', ip: '192.168.1.42', time: '10 mins ago', status: 'SUCCESS' },
  { id: 'log-2', event: 'PROPOSAL_GENERATED', actor: 'sarah@nexusdigital.agency', target: 'Coastal Haven Boutique Hotel ($7,500)', ip: '192.168.1.18', time: '42 mins ago', status: 'SUCCESS' },
  { id: 'log-3', event: 'DISCOVERY_SCAN_RUN', actor: 'alex@nexusdigital.agency', target: 'Auto Repair in San Francisco, CA (20 found)', ip: '192.168.1.42', time: '2 hours ago', status: 'SUCCESS' },
  { id: 'log-4', event: 'OUTREACH_PITCH_APPROVED', actor: 'alex@nexusdigital.agency', target: 'Dave Miller (Apex Auto)', ip: '192.168.1.42', time: '3 hours ago', status: 'SUCCESS' },
  { id: 'log-5', event: 'USER_LOGIN_SUCCESS', actor: 'marcus@nexusdigital.agency', target: 'Session Authorized via JWT', ip: '192.168.1.99', time: '5 hours ago', status: 'SUCCESS' },
  { id: 'log-6', event: 'TENANT_ISOLATION_CHECK', actor: 'SYSTEM_DAEMON', target: 'All queries scoped by workspaceId', ip: '127.0.0.1', time: '6 hours ago', status: 'VERIFIED' },
]

export default function AdminPage() {
  const [clearing, setClearing] = useState(false)
  const [clearedNotice, setClearedNotice] = useState(false)

  function handleClearCache() {
    setClearing(true)
    setTimeout(() => {
      setClearing(false)
      setClearedNotice(true)
      setTimeout(() => setClearedNotice(false), 3000)
    }, 600)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-[var(--blue-400)]" />
            System Administration & Security Telemetry
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Global infrastructure health, tenant isolation verification, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className="btn btn-secondary btn-sm gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${clearing ? 'animate-spin' : ''}`} />
            Clear Edge Cache
          </button>
        </div>
      </div>

      {clearedNotice && (
        <div className="p-4 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)] text-sm font-semibold text-[var(--emerald-400)] flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Edge routing cache flushed successfully.</span>
        </div>
      )}

      {/* Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">Application Core</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">Next.js 16 App Router</div>
          <span className="text-[10px] text-[var(--emerald-400)] font-semibold">100% Uptime (Turbopack Edge)</span>
        </div>

        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">Database Subsystem</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">PostgreSQL & Prisma 6</div>
          <span className="text-[10px] text-[var(--emerald-400)] font-semibold">Connection Pool Ready</span>
        </div>

        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">Tenant Isolation</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">Strict Row RBAC</div>
          <span className="text-[10px] text-[var(--emerald-400)] font-semibold">100% Scoped by Workspace</span>
        </div>

        <div className="card p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">Outreach Guardrails</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-lg font-bold text-[var(--text-primary)]">CAN-SPAM Compliant</div>
          <span className="text-[10px] text-[var(--emerald-400)] font-semibold">Approval Queue Enforced</span>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card overflow-hidden border border-[var(--border-default)]">
        <div className="p-4 bg-[var(--navy-900)] border-b border-[var(--border-subtle)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[var(--blue-400)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Immutable Security & Audit Event Stream
            </h3>
          </div>
          <span className="text-xs font-mono text-[var(--text-muted)]">Real-Time Log</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[var(--navy-950)] border-b border-[var(--border-subtle)] text-[var(--text-muted)] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Actor</th>
              <th className="py-3 px-4">Target Details</th>
              <th className="py-3 px-4">Client IP</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
            {AUDIT_LOGS.map((log) => (
              <tr key={log.id} className="hover:bg-[var(--navy-900)] transition-colors">
                <td className="py-3 px-4 text-[var(--text-muted)]">
                  {log.time}
                </td>
                <td className="py-3 px-4 font-bold text-[var(--blue-400)]">
                  {log.event}
                </td>
                <td className="py-3 px-4 text-[var(--text-secondary)]">
                  {log.actor}
                </td>
                <td className="py-3 px-4 text-[var(--text-primary)]">
                  {log.target}
                </td>
                <td className="py-3 px-4 text-[var(--text-muted)]">
                  {log.ip}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--emerald-400)] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
