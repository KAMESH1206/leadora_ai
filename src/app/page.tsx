import { PublicNav } from '@/components/layout/PublicNav'
import { PublicFooter } from '@/components/layout/PublicFooter'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { WorkflowSection } from '@/components/landing/WorkflowSection'
import { UseCasesSection } from '@/components/landing/UseCasesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { CTASection } from '@/components/landing/CTASection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Leadora AI — Discover Opportunities. Build Connections. Win Clients.',
  description:
    'AI-powered lead discovery platform for web developers, agencies, and freelancers. Find local businesses, audit their online presence, and convert leads into clients.',
}

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <UseCasesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <PublicFooter />
    </>
  )
}
