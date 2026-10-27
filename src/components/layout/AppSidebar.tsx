'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Search, Users, BarChart3, FileText,
  Mail, Briefcase, Settings, CreditCard, Shield,
  ChevronRight, Zap, Building2, LogOut, Bell, X
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

const navGroups = [
  {
    label: 'Core',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/discovery', label: 'Discovery', icon: Search },
      { href: '/leads', label: 'Lead CRM', icon: Users },
      { href: '/businesses', label: 'Businesses', icon: Building2 },
    ],
  },
  {
    label: 'Growth',
    items: [
      { href: '/proposals', label: 'Proposals', icon: FileText },
      { href: '/outreach', label: 'Outreach', icon: Mail },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
      { href: '/projects', label: 'Projects', icon: Briefcase },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
      { href: '/billing', label: 'Billing', icon: CreditCard },
      { href: '/admin', label: 'Admin', icon: Shield },
    ],
  },
]

interface SidebarProps {
  userName?: string
  workspaceName?: string
}

export function AppSidebar({ userName, workspaceName }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="sidebar h-full flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-[var(--border-subtle)]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="relative w-7 h-7 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-[#ea580c] opacity-80" />
            <div className="absolute inset-[4px] rounded-full border border-[#f97316] opacity-60" />
            <div className="absolute inset-[8px] rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316]" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ffedd5] shadow-sm" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-sm text-gradient block">Leadora AI</span>
            {workspaceName && (
              <span className="text-[10px] text-[var(--text-muted)] truncate block">{workspaceName}</span>
            )}
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={`sidebar-item ${active ? 'active' : ''}`}>
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[rgba(59,130,246,0.06)] transition-colors group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--blue-500)] to-[var(--cyan-500)] flex items-center justify-center flex-shrink-0 text-xs font-bold text-white">
            {userName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{userName ?? 'User'}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--rose-400)]"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
