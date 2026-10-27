import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import {
  Search, Users, Globe, TrendingUp, FileText, Mail, BarChart3, CheckCircle2,
  ArrowUpRight, ArrowRight, Clock, Building2, WifiOff, AlertCircle, Zap
} from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  trend?: { value: string; positive: boolean }
  color: string
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div
          className="feature-icon w-9 h-9"
          style={{ color }}
        >
          <Icon className="w-4 h-4" />
        </div>
        {trend && (
          <span
            className="text-xs font-semibold flex items-center gap-0.5"
            style={{ color: trend.positive ? 'var(--emerald-400)' : 'var(--rose-400)' }}
          >
            <ArrowUpRight className="w-3 h-3" style={{ transform: trend.positive ? '' : 'rotate(90deg)' }} />
            {trend.value}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-[var(--text-primary)] mb-0.5">{value}</div>
      <div className="text-xs font-medium text-[var(--text-secondary)]">{label}</div>
      {sub && <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{sub}</div>}
    </div>
  )
}

// ── Activity Item ─────────────────────────────────────────────────────────────
function ActivityItem({ icon: Icon, text, time, color }: { icon: React.ElementType; text: string; time: string; color: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border border-[var(--border-subtle)]" style={{ background: `${color}20` }}>
        <Icon className="w-3 h-3" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--text-secondary)] leading-snug">{text}</p>
        <p className="text-[10px] text-[var(--text-muted)] mt-0.5 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{time}</p>
      </div>
    </div>
  )
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/sign-in')

  const userId = (session.user as { id?: string }).id
  const membership = userId
    ? await prisma.workspaceMembership.findFirst({
        where: { userId, acceptedAt: { not: null } },
        include: { workspace: true },
      })
    : null

  const workspaceId = membership?.workspaceId

  // Real metrics from DB (fall back to 0 if no data yet)
  const [
    discoveredCount,
    leadsCount,
    noWebsiteCount,
    auditCount,
    wonCount,
    proposalCount,
    recentLeads,
    recentActivity,
  ] = workspaceId
    ? await Promise.all([
        prisma.business.count({ where: { workspaceId } }),
        prisma.lead.count({ where: { workspaceId } }),
        prisma.business.count({ where: { workspaceId, websiteStatus: 'NO_WEBSITE' } }),
        prisma.websiteAudit.count({ where: { business: { workspaceId } } }),
        prisma.lead.count({ where: { workspaceId, status: 'WON' } }),
        prisma.proposal.count({ where: { workspaceId } }),
        prisma.lead.findMany({
          where: { workspaceId },
          include: { business: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
        prisma.leadActivity.findMany({
          where: { lead: { workspaceId } },
          orderBy: { createdAt: 'desc' },
          take: 8,
        }),
      ])
    : [0, 0, 0, 0, 0, 0, [], []]

  const isDemoData = discoveredCount === 0

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back, {session.user.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {membership?.workspace.name} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link href="/discovery" className="btn btn-primary btn-sm gap-1.5">
          <Search className="w-3.5 h-3.5" />
          New Search
        </Link>
      </div>

      {/* Demo Data Banner */}
      {isDemoData && (
        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-[rgba(59,130,246,0.08)] border border-[var(--border-default)]">
          <Zap className="w-5 h-5 text-[var(--blue-400)] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Start discovering businesses</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Your dashboard will populate with real data once you run your first discovery search.
              {' '}<span className="text-[10px] text-[var(--text-muted)]">(All zeros shown are real DB counts, not sample data)</span>
            </p>
          </div>
          <Link href="/discovery" className="btn btn-secondary btn-sm ml-auto flex-shrink-0">
            Discover Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} label="Businesses Discovered" value={discoveredCount} color="var(--blue-400)" />
        <StatCard icon={Users} label="Qualified Leads" value={leadsCount} color="var(--cyan-400)" />
        <StatCard icon={WifiOff} label="No Website Detected" value={noWebsiteCount} sub="Opportunities" color="var(--amber-400)" />
        <StatCard icon={Globe} label="Audits Completed" value={auditCount} color="var(--violet-400)" />
        <StatCard icon={FileText} label="Proposals Created" value={proposalCount} color="var(--emerald-400)" />
        <StatCard icon={Mail} label="Outreach Sent" value={0} sub="Awaiting setup" color="var(--blue-300)" />
        <StatCard icon={CheckCircle2} label="Clients Won" value={wonCount} color="var(--emerald-400)" />
        <StatCard icon={TrendingUp} label="Revenue Attributed" value="$0" sub="Configure billing" color="var(--cyan-300)" />
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text-primary)]">Recent Leads</h2>
            <Link href="/leads" className="text-xs text-[var(--blue-400)] hover:text-[var(--blue-300)] transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-10">
              <Users className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
              <p className="text-sm text-[var(--text-muted)]">No leads yet</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Run a discovery search to find and qualify leads.</p>
              <Link href="/discovery" className="btn btn-secondary btn-sm mt-4 inline-flex">
                <Search className="w-3.5 h-3.5" /> Start Discovery
              </Link>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Business</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead: { id: string; business: { name: string; category: string }; status: string; createdAt: Date }) => (
                  <tr key={lead.id}>
                    <td>
                      <Link href={`/leads/${lead.id}`} className="font-medium text-[var(--text-primary)] hover:text-[var(--blue-400)] transition-colors">
                        {lead.business.name}
                      </Link>
                      <div className="text-xs text-[var(--text-muted)]">{lead.business.category}</div>
                    </td>
                    <td>
                      <span className={`badge text-xs status-${lead.status.toLowerCase().replace('_', '-')}`}>
                        {lead.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-xs">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--text-primary)]">Activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <div className="text-center py-10">
              <AlertCircle className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
              <p className="text-xs text-[var(--text-muted)]">No activity yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-subtle)]">
              {recentActivity.map((a: { id: string; type: string; title: string; createdAt: Date }) => (
                <ActivityItem
                  key={a.id}
                  icon={BarChart3}
                  text={a.title}
                  time={new Date(a.createdAt).toLocaleString()}
                  color="var(--blue-400)"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
