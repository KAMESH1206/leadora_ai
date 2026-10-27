'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, Zap, ChevronRight } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#workflow' },
  { label: 'Use Cases', href: '#use-cases' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-lg border-b border-[var(--border-subtle)]' : 'bg-transparent'
      }`}
    >
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8">
              {/* Radar icon */}
              <div className="absolute inset-0 rounded-full border-2 border-[#ea580c] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[5px] rounded-full border border-[#f97316] opacity-60" />
              <div className="absolute inset-[9px] rounded-full bg-gradient-to-tr from-[#ea580c] to-[#f97316]" />
              {/* Target dot */}
              <div className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full bg-[#f97316]" />
            </div>
            <span className="font-bold text-[1.1rem] tracking-tight text-gradient">
              Leadora AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sign-in" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link href="/sign-up" className="btn btn-primary btn-sm flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(59,130,246,0.08)] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass-strong border-t border-[var(--border-subtle)] animate-fade-in">
          <div className="container-app py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link flex items-center justify-between"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 opacity-40" />
              </a>
            ))}
            <div className="pt-3 mt-2 border-t border-[var(--border-subtle)] flex flex-col gap-2">
              <Link href="/sign-in" className="btn btn-secondary btn-sm justify-center">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn btn-primary btn-sm justify-center">
                <Zap className="w-3.5 h-3.5" />
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
