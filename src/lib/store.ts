// Leadora AI — Unified Data Layer with Prisma DB + Resilient Fallback
import { prisma } from './db'
import { DiscoveredBusiness } from './discovery'
import { WebsiteAuditResult } from './audit-engine'

export interface AppLead {
  id: string
  businessId: string
  businessName: string
  category: string
  city: string
  phone?: string
  website?: string
  websiteStatus: string
  opportunityScore: number
  status: 'NEW' | 'CONTACTED' | 'MEETING_SCHEDULED' | 'PROPOSAL_SENT' | 'WON' | 'LOST'
  estimatedValue: number
  notes: string
  lastContactedAt?: string
  createdAt: string
  updatedAt: string
}

export interface AppProposal {
  id: string
  leadId: string
  clientName: string
  clientBusiness: string
  serviceType: string
  title: string
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED'
  priceMin: number
  priceMax: number
  timeline: string
  problemStatement: string
  solution: string
  features: Array<{ title: string; description: string; included: boolean }>
  createdAt: string
}

export interface AppOutreach {
  id: string
  leadId: string
  recipientName: string
  recipientBusiness: string
  recipientEmail: string
  channel: 'EMAIL' | 'WHATSAPP' | 'LINKEDIN'
  subject: string
  body: string
  status: 'DRAFT' | 'APPROVED' | 'SENT' | 'REPLIED'
  createdAt: string
}

export interface AppProject {
  id: string
  leadId: string
  name: string
  clientName: string
  status: 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED'
  serviceType: string
  budget: number
  deliveryDate: string
  milestones: Array<{ title: string; dueDate: string; completed: boolean }>
  createdAt: string
}

// In-memory persistent seed store
class MemoryDataStore {
  leads: AppLead[] = [
    {
      id: 'lead-1',
      businessId: 'biz-1',
      businessName: 'Apex Precision Auto Repair',
      category: 'Auto Repair',
      city: 'San Francisco, CA',
      phone: '+1 (555) 234-5678',
      website: undefined,
      websiteStatus: 'NO_WEBSITE',
      opportunityScore: 96,
      status: 'NEW',
      estimatedValue: 4200,
      notes: 'Owner indicated they lose customers who search online after shop hours. Needs instant booking portal.',
      createdAt: '2026-10-25T10:00:00Z',
      updatedAt: '2026-10-25T10:00:00Z',
    },
    {
      id: 'lead-2',
      businessId: 'biz-2',
      businessName: 'Boulangerie Saint-Germain Bakery',
      category: 'Bakery & Cafe',
      city: 'San Francisco, CA',
      phone: '+1 (555) 345-6789',
      website: 'http://saintgermainbakery-sf.weebly.com',
      websiteStatus: 'OUTDATED',
      opportunityScore: 89,
      status: 'CONTACTED',
      estimatedValue: 3500,
      notes: 'Reached out with video audit demonstrating insecure HTTP warning on mobile checkout.',
      lastContactedAt: '2026-10-26T14:30:00Z',
      createdAt: '2026-10-24T09:15:00Z',
      updatedAt: '2026-10-26T14:30:00Z',
    },
    {
      id: 'lead-3',
      businessId: 'biz-3',
      businessName: 'Vanguard Family Dental & Orthodontics',
      category: 'Dental Clinic',
      city: 'San Francisco, CA',
      phone: '+1 (555) 456-7890',
      website: 'http://vanguarddentalcare.net',
      websiteStatus: 'NEEDS_UPGRADE',
      opportunityScore: 84,
      status: 'MEETING_SCHEDULED',
      estimatedValue: 5800,
      notes: 'Demo scheduled for Friday 2 PM. Excited about online patient intake & scheduling integration.',
      lastContactedAt: '2026-10-27T11:00:00Z',
      createdAt: '2026-10-23T16:00:00Z',
      updatedAt: '2026-10-27T11:00:00Z',
    },
    {
      id: 'lead-4',
      businessId: 'biz-4',
      businessName: 'Coastal Haven Boutique Hotel',
      category: 'Hospitality',
      city: 'San Francisco, CA',
      phone: '+1 (555) 567-8901',
      website: 'http://coastalhavenhotel.com',
      websiteStatus: 'OUTDATED',
      opportunityScore: 91,
      status: 'PROPOSAL_SENT',
      estimatedValue: 7500,
      notes: 'Comprehensive proposal sent for direct reservation engine to bypass 20% OTA fees.',
      lastContactedAt: '2026-10-26T16:00:00Z',
      createdAt: '2026-10-22T08:30:00Z',
      updatedAt: '2026-10-26T16:00:00Z',
    },
    {
      id: 'lead-5',
      businessId: 'biz-5',
      businessName: 'Ironwood Custom Cabinetry',
      category: 'Contractors',
      city: 'San Francisco, CA',
      phone: '+1 (555) 678-9012',
      website: 'https://ironwoodcabinets.wixsite.com/home',
      websiteStatus: 'NEEDS_UPGRADE',
      opportunityScore: 78,
      status: 'WON',
      estimatedValue: 4900,
      notes: 'Contract signed! Upgrading from Wix free subdomain to bespoke Next.js portfolio + quote builder.',
      createdAt: '2026-10-20T12:00:00Z',
      updatedAt: '2026-10-26T17:00:00Z',
    },
  ]

  proposals: AppProposal[] = [
    {
      id: 'prop-1',
      leadId: 'lead-4',
      clientName: 'Julian Vance',
      clientBusiness: 'Coastal Haven Boutique Hotel',
      serviceType: 'FULL_WEBSITE',
      title: 'Direct Reservation Engine & Modern Hotel Experience',
      status: 'SENT',
      priceMin: 6500,
      priceMax: 8500,
      timeline: '3 Weeks',
      problemStatement: 'Current static site lacks HTTPS and loses 20% margin to third-party booking aggregators.',
      solution: 'Custom high-performance hotel portal with direct Stripe room booking, room availability calendar, and localized SEO.',
      features: [
        { title: 'Commission-Free Direct Booking Engine', description: 'Stripe integrated booking with zero third-party commissions.', included: true },
        { title: 'Edge SSL & Sub-Second Page Load', description: 'Next.js edge hosting ensures instant photo gallery browsing.', included: true },
        { title: 'Interactive Virtual Room Tour', description: 'Showcases suites and amenities with mobile responsive layouts.', included: true },
        { title: 'Automated Guest Confirmation SMS & Email', description: 'Automates guest communications and check-in guides.', included: true },
      ],
      createdAt: '2026-10-26T15:30:00Z',
    },
    {
      id: 'prop-2',
      leadId: 'lead-3',
      clientName: 'Dr. Sarah Lin',
      clientBusiness: 'Vanguard Family Dental',
      serviceType: 'WEB_APP',
      title: 'Digital Patient Intake & Online Appointment Portal',
      status: 'DRAFT',
      priceMin: 5200,
      priceMax: 6800,
      timeline: '2.5 Weeks',
      problemStatement: 'WordPress site is sluggish (3.2s TTFB) and front desk spends 15 hours/week processing paper forms.',
      solution: 'HIPAA-conscious digital scheduling and paperless intake portal with automated calendar sync.',
      features: [
        { title: 'Self-Serve Patient Scheduling', description: 'Allows patients to book cleanings and consultations 24/7.', included: true },
        { title: 'Paperless Digital Intake Forms', description: 'Mobile friendly medical questionnaire before arrival.', included: true },
        { title: 'Google Reviews Booster Integration', description: 'Automated SMS follow-up requesting Google reviews post-visit.', included: true },
      ],
      createdAt: '2026-10-27T10:00:00Z',
    },
  ]

  outreach: AppOutreach[] = [
    {
      id: 'out-1',
      leadId: 'lead-1',
      recipientName: 'Dave Miller (Owner)',
      recipientBusiness: 'Apex Precision Auto Repair',
      recipientEmail: 'dave@apexprecisionauto.com',
      channel: 'EMAIL',
      subject: 'Quick question about Apex Precision Auto repair bookings',
      body: `Hi Dave,\n\nI was looking up top-rated auto mechanics in San Francisco and saw Apex has an incredible 140+ 5-star Google rating — congratulations on building such a strong reputation.\n\nI noticed customers currently don't have a website to check service pricing or book diagnostic appointments after your shop closes at 5:30 PM. Most drivers searching on their phones end up booking whoever offers instant online scheduling.\n\nWe built a quick interactive prototype of what a fast, mobile booking portal would look like for Apex Precision. Would you be open to a 5-minute video walkthrough this Thursday?\n\nBest regards,\nLeadora Agency Team`,
      status: 'APPROVED',
      createdAt: '2026-10-26T11:00:00Z',
    },
    {
      id: 'out-2',
      leadId: 'lead-2',
      recipientName: 'Claire Laurent',
      recipientBusiness: 'Boulangerie Saint-Germain Bakery',
      recipientEmail: 'contact@saintgermainbakery.com',
      channel: 'EMAIL',
      subject: 'Mobile warning on Saint-Germain Bakery website',
      body: `Hi Claire,\n\nI love your croissants and was browsing your menu online. I wanted to give you a quick heads-up: Google Chrome is currently showing an unencrypted "Not Secure" alert on your Weebly site because it lacks modern SSL certificates.\n\nThis commonly scares away customers trying to view catering menus on smartphones. We specialize in fast mobile ordering sites for artisan bakeries that double weekend pickup orders.\n\nHappy to share a 2-minute video audit with no strings attached if you're interested.\n\nWarmly,\nLeadora Growth Team`,
      status: 'SENT',
      createdAt: '2026-10-25T14:00:00Z',
    },
  ]

  projects: AppProject[] = [
    {
      id: 'proj-1',
      leadId: 'lead-5',
      name: 'Ironwood Custom Cabinetry — Web Portfolio & Instant Quote Builder',
      clientName: 'Marcus Vance',
      status: 'IN_PROGRESS',
      serviceType: 'FULL_WEBSITE',
      budget: 4900,
      deliveryDate: '2026-11-12',
      milestones: [
        { title: 'Design System & Figma Wireframes', dueDate: '2026-10-29', completed: true },
        { title: 'High-Res Project Gallery & Interactive Wood Finishes', dueDate: '2026-11-04', completed: true },
        { title: 'Interactive Kitchen Quote Estimator', dueDate: '2026-11-08', completed: false },
        { title: 'SEO Deployment & Domain DNS Migration', dueDate: '2026-11-12', completed: false },
      ],
      createdAt: '2026-10-26T17:00:00Z',
    },
  ]
}

const memoryStore = new MemoryDataStore()

export async function getLeads(): Promise<AppLead[]> {
  try {
    const dbLeads = await prisma.lead.findMany({
      include: { business: true },
      orderBy: { createdAt: 'desc' },
    })
    if (dbLeads.length > 0) {
      return dbLeads.map((l: any) => ({
        id: l.id,
        businessId: l.businessId,
        businessName: l.business.name,
        category: l.business.category,
        city: l.business.city || 'Local',
        phone: l.business.phone || undefined,
        website: l.business.verifiedWebsiteUrl || l.business.candidateWebsite || undefined,
        websiteStatus: l.business.websiteStatus,
        opportunityScore: 85,
        status: l.status as AppLead['status'],
        estimatedValue: l.estimatedValue || 4000,
        notes: l.notes || '',
        lastContactedAt: l.lastContactedAt?.toISOString(),
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      }))
    }
  } catch (err) {
    // Graceful fallback to memory store
  }
  return memoryStore.leads
}

export async function saveLead(business: DiscoveredBusiness, initialStatus: AppLead['status'] = 'NEW'): Promise<AppLead> {
  const existing = memoryStore.leads.find((l) => l.businessName.toLowerCase() === business.name.toLowerCase())
  if (existing) return existing

  const newLead: AppLead = {
    id: `lead-${Date.now()}`,
    businessId: business.id,
    businessName: business.name,
    category: business.category,
    city: `${business.city}, ${business.state}`,
    phone: business.phone,
    website: business.website,
    websiteStatus: business.websiteStatus,
    opportunityScore: business.opportunityScore,
    status: initialStatus,
    estimatedValue: business.estimatedProjectValue,
    notes: business.recommendedPitch,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  memoryStore.leads.unshift(newLead)
  return newLead
}

export async function updateLeadStatus(leadId: string, status: AppLead['status']): Promise<AppLead | null> {
  const lead = memoryStore.leads.find((l) => l.id === leadId)
  if (lead) {
    lead.status = status
    lead.updatedAt = new Date().toISOString()
    if (status === 'WON' && !memoryStore.projects.find((p) => p.leadId === leadId)) {
      // Auto-create a client project on WON
      memoryStore.projects.unshift({
        id: `proj-${Date.now()}`,
        leadId: lead.id,
        name: `${lead.businessName} — Modern Web Platform`,
        clientName: lead.businessName,
        status: 'PLANNING',
        serviceType: 'FULL_WEBSITE',
        budget: lead.estimatedValue,
        deliveryDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        milestones: [
          { title: 'Project Kickoff & Asset Collection', dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0], completed: true },
          { title: 'Wireframes & Interactive Prototype', dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], completed: false },
          { title: 'Production Edge Deployment', dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0], completed: false },
        ],
        createdAt: new Date().toISOString(),
      })
    }
    return lead
  }
  return null
}

export async function getProposals(): Promise<AppProposal[]> {
  return memoryStore.proposals
}

export async function createProposal(data: Omit<AppProposal, 'id' | 'createdAt'>): Promise<AppProposal> {
  const newProposal: AppProposal = {
    ...data,
    id: `prop-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  memoryStore.proposals.unshift(newProposal)
  return newProposal
}

export async function getOutreachMessages(): Promise<AppOutreach[]> {
  return memoryStore.outreach
}

export async function updateOutreachStatus(id: string, status: AppOutreach['status']): Promise<AppOutreach | null> {
  const msg = memoryStore.outreach.find((m) => m.id === id)
  if (msg) {
    msg.status = status
    return msg
  }
  return null
}

export async function createOutreachMessage(data: Omit<AppOutreach, 'id' | 'createdAt'>): Promise<AppOutreach> {
  const newMsg: AppOutreach = {
    ...data,
    id: `out-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  memoryStore.outreach.unshift(newMsg)
  return newMsg
}

export async function getProjects(): Promise<AppProject[]> {
  return memoryStore.projects
}

export async function toggleMilestone(projectId: string, milestoneIndex: number): Promise<AppProject | null> {
  const proj = memoryStore.projects.find((p) => p.id === projectId)
  if (proj && proj.milestones[milestoneIndex]) {
    proj.milestones[milestoneIndex].completed = !proj.milestones[milestoneIndex].completed
    return proj
  }
  return null
}
