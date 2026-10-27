'use client'

import { useState, useEffect } from 'react'
import {
  Briefcase, CheckCircle2, Clock, Calendar, DollarSign,
  Plus, CheckSquare, Square, ChevronRight, Loader2, Sparkles
} from 'lucide-react'
import { AppProject } from '@/lib/store'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<AppProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleMilestone(projectId: string, index: number) {
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p
        const updatedMilestones = [...p.milestones]
        updatedMilestones[index] = {
          ...updatedMilestones[index],
          completed: !updatedMilestones[index].completed,
        }
        return { ...p, milestones: updatedMilestones }
      })
    )

    try {
      await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, milestoneIndex: index }),
      })
    } catch (err) {
      console.error(err)
      fetchProjects()
    }
  }

  const activeCount = projects.filter((p) => p.status !== 'COMPLETED').length
  const totalRevenue = projects.reduce((s, p) => s + (p.budget || 0), 0)

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-[var(--blue-400)]" />
            Client Project Management & Delivery
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Track implementation milestones, deliverable progress, and revenue for won clients.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[rgba(59,130,246,0.1)] text-[var(--blue-400)] border border-[rgba(59,130,246,0.25)]">
          <Sparkles className="w-4 h-4" /> Won CRM leads convert here automatically
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Active Projects</span>
          <div className="text-2xl font-bold text-[var(--text-primary)] mt-1">{activeCount}</div>
          <span className="text-[11px] text-[var(--text-secondary)]">In delivery pipeline</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Total Project Revenue</span>
          <div className="text-2xl font-bold text-[var(--emerald-400)] mt-1">
            ${totalRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-[var(--text-secondary)]">Contracted deal values</span>
        </div>

        <div className="stat-card">
          <span className="text-xs text-[var(--text-muted)]">Average Delivery Time</span>
          <div className="text-2xl font-bold text-[var(--cyan-400)] mt-1">14 Days</div>
          <span className="text-[11px] text-[var(--text-secondary)]">Kickoff to domain launch</span>
        </div>
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--blue-400)] mx-auto" />
          <p className="text-sm text-[var(--text-secondary)] mt-2">Loading client projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="card p-12 text-center border-dashed">
          <Briefcase className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-medium text-[var(--text-primary)]">No active projects yet</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Move any lead to &quot;Won&quot; in the CRM to automatically generate an active delivery workspace here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => {
            const completedMilestones = proj.milestones.filter((m) => m.completed).length
            const totalMilestones = proj.milestones.length
            const percent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

            return (
              <div
                key={proj.id}
                className="card p-6 border border-[var(--border-default)] space-y-6 hover:border-[var(--blue-500)] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">
                        {proj.name}
                      </h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--navy-800)] text-[var(--cyan-400)]">
                        {proj.serviceType}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Client: {proj.clientName} · Target Delivery: {proj.deliveryDate}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[var(--text-muted)] block">Contract Value</span>
                    <span className="text-xl font-bold text-[var(--emerald-400)]">
                      ${proj.budget.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)] font-medium">Milestones Completed</span>
                    <span className="text-[var(--blue-400)] font-bold">{percent}% ({completedMilestones}/{totalMilestones})</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--navy-800)] overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Project Deliverables Checklist
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {proj.milestones.map((m, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleToggleMilestone(proj.id, idx)}
                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                          m.completed
                            ? 'bg-[rgba(16,185,129,0.06)] border-[rgba(16,185,129,0.2)] text-[var(--text-primary)]'
                            : 'bg-[var(--navy-900)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--blue-500)]'
                        }`}
                      >
                        {m.completed ? (
                          <CheckSquare className="w-4 h-4 text-[var(--emerald-400)] flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className={`text-xs font-medium block truncate ${m.completed ? 'line-through text-[var(--text-muted)]' : ''}`}>
                            {m.title}
                          </span>
                          <span className="text-[10px] text-[var(--text-muted)]">Due {m.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
