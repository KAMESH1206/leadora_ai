import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Leadora AI — Discover Opportunities. Build Connections. Win Clients.',
    template: '%s | Leadora AI',
  },
  description:
    'Leadora AI helps web developers, software agencies, and freelancers discover local businesses, audit their online presence, and convert qualified leads into paying clients.',
  keywords: [
    'lead generation',
    'business discovery',
    'website audit',
    'AI proposals',
    'local business',
    'web development leads',
    'SaaS',
  ],
  authors: [{ name: 'Leadora AI' }],
  creator: 'Leadora AI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Leadora AI — Discover Opportunities. Build Connections. Win Clients.',
    description:
      'AI-powered lead discovery and client acquisition platform for web professionals.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Leadora AI',
    description: 'AI-powered lead discovery for web professionals.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
      </body>
    </html>
  )
}
