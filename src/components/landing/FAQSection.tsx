'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    q: 'How does business discovery work?',
    a: 'Leadora integrates with authorized business data providers (like Google Places API) to search for local businesses based on your selected categories, location, and radius. We display results with source attribution and discovery timestamps. You configure your own API keys for quota control.',
  },
  {
    q: 'Does Leadora scrape websites or harvest private contact information?',
    a: 'No. Leadora only checks publicly accessible information using ethical methods — domain resolution, HTTP status checks, public PageSpeed APIs, and provider-attributed business data. We do not scrape restricted websites, bypass access controls, or invent contact details.',
  },
  {
    q: 'How accurate is the "No Website" detection?',
    a: 'Website detection uses safe domain checking with SSRF protections, redirect validation, and DNS revalidation. Results have four states: Verified Website, No Website Detected, Website Check Failed, and Manual Review Required. Confidence levels are always shown. We never claim 100% certainty.',
  },
  {
    q: 'Is the AI lead score reliable?',
    a: 'The 0–100 opportunity score is based on configurable, explainable signals — website gaps, audit findings, business-service fit, and data confidence. The breakdown is always visible. The score helps prioritize work — it never guarantees a prospect will become a customer.',
  },
  {
    q: 'Can I send WhatsApp messages in bulk?',
    a: 'No. Leadora uses the official WhatsApp Business Platform API and implements a strict review-and-approve workflow. Every message requires human approval before sending. Suppression lists and opt-out handling are enforced. Bulk unsolicited messaging violates platform policies and applicable laws.',
  },
  {
    q: 'Does Leadora store business contact data indefinitely?',
    a: 'No. Leadora follows configurable data retention policies per workspace. Contact data includes provenance, verification timestamps, and consent evidence where required. You control retention durations in workspace settings, and we provide data export and deletion tools.',
  },
  {
    q: 'Do I need to provide my own API keys?',
    a: 'Yes for production features. Google Places API and PageSpeed Insights keys are required for real data. Without them, Leadora activates clearly labeled mock adapters for development. Keys are stored server-side in environment variables — never exposed to clients.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes — all plans include a 14-day free trial with no credit card required. You get full access to core features during the trial period.',
  },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24">
      <div className="container-app max-w-3xl">
        <div className="text-center mb-14">
          <div className="badge badge-blue inline-flex mb-4">Frequently Asked</div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Got <span className="text-gradient">Questions?</span>
          </h2>
          <p className="text-[var(--text-secondary)]">
            Honest answers about how Leadora AI works, what it can do, and what it can't.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-[rgba(59,130,246,0.04)] transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-semibold text-[var(--text-primary)] text-sm leading-snug">
                  {faq.q}
                </span>
                {open === i
                  ? <ChevronUp className="w-4 h-4 text-[var(--blue-400)] flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                }
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)] pt-4 animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
