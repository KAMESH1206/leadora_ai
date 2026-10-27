'use client'

import { useState } from 'react'
import {
  Settings, Building2, Key, Users, Bell, Shield,
  CheckCircle2, AlertCircle, Save, ExternalLink, Plus, Trash2
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'INTEGRATIONS' | 'TEAM' | 'NOTIFICATIONS'>('GENERAL')

  // General state
  const [workspaceName, setWorkspaceName] = useState('Nexus Digital Studio')
  const [agencyWebsite, setAgencyWebsite] = useState('https://nexusdigital.agency')
  const [supportEmail, setSupportEmail] = useState('team@nexusdigital.agency')

  // Integrations state
  const [googlePlacesKey, setGooglePlacesKey] = useState('')
  const [pageSpeedKey, setPageSpeedKey] = useState('')
  const [smtpHost, setSmtpHost] = useState('smtp.resend.com')
  const [smtpUser, setSmtpUser] = useState('')

  // Team state
  const [members, setMembers] = useState([
    { id: '1', name: 'Alex Rivera', email: 'alex@nexusdigital.agency', role: 'OWNER' },
    { id: '2', name: 'Sarah Chen', email: 'sarah@nexusdigital.agency', role: 'ADMIN' },
    { id: '3', name: 'Marcus Brody', email: 'marcus@nexusdigital.agency', role: 'MEMBER' },
  ])
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('MEMBER')

  const [savedNotice, setSavedNotice] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 3000)
  }

  function handleInviteMember(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail) return
    setMembers([
      ...members,
      {
        id: `mem-${Date.now()}`,
        name: newEmail.split('@')[0],
        email: newEmail,
        role: newRole,
      },
    ])
    setNewEmail('')
  }

  function handleRemoveMember(id: string) {
    setMembers(members.filter((m) => m.id !== id))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-[var(--blue-400)]" />
            Workspace Settings & Integrations
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Configure your agency workspace profile, third-party API credentials, and team members.
          </p>
        </div>

        {savedNotice && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[rgba(16,185,129,0.1)] text-[var(--emerald-400)] border border-[rgba(16,185,129,0.25)] animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> Changes saved successfully
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3 overflow-x-auto">
        {[
          { id: 'GENERAL', label: 'Agency Profile', icon: Building2 },
          { id: 'INTEGRATIONS', label: 'API Integrations', icon: Key },
          { id: 'TEAM', label: 'Team Members & Roles', icon: Users },
          { id: 'NOTIFICATIONS', label: 'Notifications', icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-[var(--blue-500)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-white bg-[var(--navy-900)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab: General */}
      {activeTab === 'GENERAL' && (
        <form onSubmit={handleSave} className="card p-6 border border-[var(--border-default)] space-y-6 max-w-3xl">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Agency Identity
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Workspace / Agency Name
              </label>
              <input
                type="text"
                required
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Agency Website
              </label>
              <input
                type="url"
                value={agencyWebsite}
                onChange={(e) => setAgencyWebsite(e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)]">
            <button type="submit" className="btn btn-primary gap-2">
              <Save className="w-4 h-4" /> Save Profile
            </button>
          </div>
        </form>
      )}

      {/* Tab: Integrations */}
      {activeTab === 'INTEGRATIONS' && (
        <form onSubmit={handleSave} className="card p-6 border border-[var(--border-default)] space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              API Keys & Service Providers
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              When live API keys are provided, Leadora connects directly to official endpoints. Without keys, realistic simulation adapters are used automatically.
            </p>
          </div>

          <div className="space-y-5">
            {/* Google Places */}
            <div className="p-4 rounded-xl bg-[var(--navy-900)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Google Places API Key
                </span>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[var(--blue-400)] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Get Key from Google Cloud
                </a>
              </div>
              <input
                type="password"
                value={googlePlacesKey}
                onChange={(e) => setGooglePlacesKey(e.target.value)}
                placeholder="AIzaSy..."
                className="input text-xs"
              />
              <span className="text-[10px] text-[var(--text-muted)] block">
                Required for querying live business locations and operating hours globally.
              </span>
            </div>

            {/* Google PageSpeed */}
            <div className="p-4 rounded-xl bg-[var(--navy-900)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--text-primary)]">
                  Google PageSpeed Insights API Key
                </span>
                <a
                  href="https://developers.google.com/speed/docs/insights/v5/get-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[var(--blue-400)] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> PageSpeed Docs
                </a>
              </div>
              <input
                type="password"
                value={pageSpeedKey}
                onChange={(e) => setPageSpeedKey(e.target.value)}
                placeholder="Optional (falls back to Leadora edge audit engine)"
                className="input text-xs"
              />
            </div>

            {/* SMTP Cold Outreach */}
            <div className="p-4 rounded-xl bg-[var(--navy-900)] border border-[var(--border-subtle)] space-y-3">
              <span className="text-xs font-bold text-[var(--text-primary)] block">
                Outreach Mail Server (SMTP)
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] block mb-1">Host</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="input text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[var(--text-muted)] block mb-1">User / API Key</label>
                  <input
                    type="text"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="resend / sendgrid username"
                    className="input text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)]">
            <button type="submit" className="btn btn-primary gap-2">
              <Save className="w-4 h-4" /> Save Integration Keys
            </button>
          </div>
        </form>
      )}

      {/* Tab: Team */}
      {activeTab === 'TEAM' && (
        <div className="card p-6 border border-[var(--border-default)] space-y-6 max-w-3xl">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Workspace Team Members
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Manage member seats and role-based access permissions.
            </p>
          </div>

          {/* Invite form */}
          <form onSubmit={handleInviteMember} className="flex gap-2">
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="colleague@agency.com"
              className="input text-xs flex-1"
            />
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="input text-xs w-32 bg-[var(--navy-900)]"
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
              <option value="VIEWER">Viewer</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm gap-1">
              <Plus className="w-3.5 h-3.5" /> Invite
            </button>
          </form>

          {/* Members list */}
          <div className="divide-y divide-[var(--border-subtle)]">
            {members.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[var(--text-primary)] block">
                    {m.name}
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)]">{m.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--navy-800)] text-[var(--cyan-400)]">
                    {m.role}
                  </span>
                  {m.role !== 'OWNER' && (
                    <button
                      onClick={() => handleRemoveMember(m.id)}
                      className="text-[var(--text-muted)] hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Notifications */}
      {activeTab === 'NOTIFICATIONS' && (
        <form onSubmit={handleSave} className="card p-6 border border-[var(--border-default)] space-y-6 max-w-3xl">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Email & In-App Notification Preferences
          </h3>

          <div className="space-y-3">
            {[
              { title: 'New High-Score Opportunities Discovered', desc: 'Alert when a discovery scan identifies opportunities > 90% score.' },
              { title: 'Outreach Email Replied', desc: 'Receive instant notification when a prospective lead replies to a cold pitch.' },
              { title: 'Proposal Document Opened', desc: 'Notify team when a client views an active proposal link.' },
              { title: 'Weekly Pipeline Summary Report', desc: 'Digest of active leads, meetings scheduled, and won client revenue.' },
            ].map((pref) => (
              <label key={pref.title} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--navy-900)] border border-[var(--border-subtle)] cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-1 rounded accent-[var(--blue-500)]" />
                <div>
                  <span className="text-xs font-bold text-[var(--text-primary)] block">{pref.title}</span>
                  <span className="text-[11px] text-[var(--text-secondary)]">{pref.desc}</span>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-[var(--border-subtle)]">
            <button type="submit" className="btn btn-primary gap-2">
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
