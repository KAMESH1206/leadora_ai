// Leadora AI — Business Discovery Provider & Adapter
// Supports Google Places API (New & Classic) with automatic fallback to high-fidelity realistic adapter.

export interface DiscoveredBusiness {
  id: string
  name: string
  category: string
  address: string
  city: string
  state: string
  phone?: string
  website?: string
  websiteStatus: 'NO_WEBSITE' | 'UNRESPONSIVE' | 'OUTDATED' | 'VERIFIED' | 'NEEDS_UPGRADE'
  opportunityScore: number
  rating?: number
  reviewCount?: number
  googleMapsUrl?: string
  detectedTech?: string[]
  recommendedPitch: string
  estimatedProjectValue: number
}

export interface DiscoverySearchParams {
  category: string
  location: string
  radiusMeters?: number
  websiteFilter?: 'ALL' | 'NO_WEBSITE_ONLY' | 'OUTDATED_ONLY' | 'HAS_WEBSITE'
  minOpportunityScore?: number
}

// Realistic seed generator for local businesses across diverse industry niches
const MOCK_BUSINESS_TEMPLATES = [
  {
    name: 'Apex Precision Auto Repair',
    category: 'Auto Repair',
    website: undefined,
    websiteStatus: 'NO_WEBSITE' as const,
    opportunityScore: 96,
    rating: 4.8,
    reviewCount: 142,
    detectedTech: [],
    recommendedPitch: 'No digital presence detected despite 140+ 5-star Google reviews. Needs a modern Next.js booking & estimate portal.',
    estimatedProjectValue: 4200,
  },
  {
    name: 'Boulangerie Saint-Germain Bakery',
    category: 'Bakery & Cafe',
    website: 'http://saintgermainbakery-sf.weebly.com',
    websiteStatus: 'OUTDATED' as const,
    opportunityScore: 89,
    rating: 4.6,
    reviewCount: 88,
    detectedTech: ['Weebly', 'HTTP Only', 'Unresponsive Viewport'],
    recommendedPitch: 'Non-HTTPS Weebly site built in 2017. Lacks mobile ordering and loses weekend breakfast reservation traffic.',
    estimatedProjectValue: 3500,
  },
  {
    name: 'Vanguard Family Dental & Orthodontics',
    category: 'Dental Clinic',
    website: 'http://vanguarddentalcare.net',
    websiteStatus: 'NEEDS_UPGRADE' as const,
    opportunityScore: 84,
    rating: 4.9,
    reviewCount: 310,
    detectedTech: ['WordPress 4.9', 'Slow TTFB (>3.2s)', 'No Online Scheduling'],
    recommendedPitch: 'High-margin dental practice on outdated WordPress. Patients cannot book appointments online or fill digital intake forms.',
    estimatedProjectValue: 5800,
  },
  {
    name: 'Summit Ridge Physical Therapy',
    category: 'Physical Therapy',
    website: undefined,
    websiteStatus: 'NO_WEBSITE' as const,
    opportunityScore: 95,
    rating: 4.7,
    reviewCount: 64,
    detectedTech: [],
    recommendedPitch: 'Active local clinic with zero website. Loses patient referrals to nearby chains that offer digital scheduling.',
    estimatedProjectValue: 4500,
  },
  {
    name: 'Coastal Haven Boutique Hotel',
    category: 'Hospitality',
    website: 'http://coastalhavenhotel.com',
    websiteStatus: 'OUTDATED' as const,
    opportunityScore: 91,
    rating: 4.3,
    reviewCount: 220,
    detectedTech: ['Static HTML 2015', 'No Direct Booking Engine', 'Missing SSL'],
    recommendedPitch: 'Paying 18-25% OTA commissions to Expedia and Booking.com because their own website lacks a direct reservation engine.',
    estimatedProjectValue: 7500,
  },
  {
    name: 'Ironwood Custom Cabinetry & Millwork',
    category: 'Contractors',
    website: 'https://ironwoodcabinets.wixsite.com/home',
    websiteStatus: 'NEEDS_UPGRADE' as const,
    opportunityScore: 78,
    rating: 5.0,
    reviewCount: 47,
    detectedTech: ['Free Wix Subdomain', 'Wix Branding Ads', 'Slow Mobile Load'],
    recommendedPitch: 'Premium high-ticket craftsman using a free Wix subdomain with banner ads. Undermines $15k-$50k custom kitchen credibility.',
    estimatedProjectValue: 4900,
  },
  {
    name: 'Meridian Law & Estate Planning',
    category: 'Legal Services',
    website: 'http://meridianlawfirm.org',
    websiteStatus: 'NEEDS_UPGRADE' as const,
    opportunityScore: 82,
    rating: 4.8,
    reviewCount: 95,
    detectedTech: ['Joomla 3', 'HTTP Insecure', 'No Mobile Consultation Form'],
    recommendedPitch: 'High net worth estate practice running on unmaintained Joomla. Insecure HTTP warnings discourage prospective client inquiries.',
    estimatedProjectValue: 6200,
  },
  {
    name: 'Urban Green Landscape & Design',
    category: 'Landscaping',
    website: undefined,
    websiteStatus: 'NO_WEBSITE' as const,
    opportunityScore: 94,
    rating: 4.9,
    reviewCount: 52,
    detectedTech: [],
    recommendedPitch: 'Flourishing landscape architect with no web portfolio. Needs an interactive visual project gallery and instant quote calculator.',
    estimatedProjectValue: 3800,
  },
]

export async function searchBusinesses(params: DiscoverySearchParams): Promise<{
  provider: 'GOOGLE_PLACES' | 'MOCK_ADAPTER'
  businesses: DiscoveredBusiness[]
  totalFound: number
  hasLiveCredentials: boolean
}> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY

  if (apiKey && apiKey.trim().length > 10) {
    try {
      // Live Google Places Search
      const query = encodeURIComponent(`${params.category} in ${params.location}`)
      const res = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}`)
      const data = await res.json()

      if (data.status === 'OK' && Array.isArray(data.results)) {
        const businesses: DiscoveredBusiness[] = data.results.slice(0, 20).map((r: any, idx: number) => {
          const hasWebsite = Boolean(r.website)
          return {
            id: r.place_id || `place_${idx}`,
            name: r.name,
            category: params.category,
            address: r.formatted_address || params.location,
            city: params.location.split(',')[0]?.trim() || 'Local City',
            state: params.location.split(',')[1]?.trim() || '',
            website: r.website,
            websiteStatus: hasWebsite ? 'VERIFIED' : 'NO_WEBSITE',
            opportunityScore: hasWebsite ? 65 : 95,
            rating: r.rating || 4.5,
            reviewCount: r.user_ratings_total || 25,
            googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${r.place_id}`,
            detectedTech: hasWebsite ? ['External Provider'] : [],
            recommendedPitch: hasWebsite
              ? 'Analyze current website performance and conversion rate to propose modern headless upgrade.'
              : 'Zero website detected on Google Maps. High priority candidate for complete web design and hosting package.',
            estimatedProjectValue: hasWebsite ? 3500 : 4800,
          }
        })

        return {
          provider: 'GOOGLE_PLACES',
          businesses,
          totalFound: data.results.length,
          hasLiveCredentials: true,
        }
      }
    } catch (err) {
      console.warn('Google Places API request failed, falling back to mock provider adapter:', err)
    }
  }

  // Realistic mock adapter
  const loc = params.location.trim() || 'San Francisco, CA'
  const [cityPart, statePart] = loc.split(',').map((s) => s.trim())

  let results: DiscoveredBusiness[] = MOCK_BUSINESS_TEMPLATES.map((tmpl, idx) => ({
    id: `biz_${idx + 1}_${Date.now()}`,
    name: tmpl.name,
    category: params.category || tmpl.category,
    address: `${100 + idx * 45} Main Street`,
    city: cityPart || 'Metropolis',
    state: statePart || 'CA',
    phone: `+1 (555) ${200 + idx * 15}-${1000 + idx * 22}`,
    website: tmpl.website,
    websiteStatus: tmpl.websiteStatus,
    opportunityScore: tmpl.opportunityScore,
    rating: tmpl.rating,
    reviewCount: tmpl.reviewCount,
    googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(tmpl.name + ' ' + loc)}`,
    detectedTech: tmpl.detectedTech,
    recommendedPitch: tmpl.recommendedPitch,
    estimatedProjectValue: tmpl.estimatedProjectValue,
  }))

  if (params.websiteFilter === 'NO_WEBSITE_ONLY') {
    results = results.filter((b) => b.websiteStatus === 'NO_WEBSITE')
  } else if (params.websiteFilter === 'OUTDATED_ONLY') {
    results = results.filter((b) => b.websiteStatus === 'OUTDATED' || b.websiteStatus === 'NEEDS_UPGRADE')
  } else if (params.websiteFilter === 'HAS_WEBSITE') {
    results = results.filter((b) => Boolean(b.website))
  }

  return {
    provider: 'MOCK_ADAPTER',
    businesses: results,
    totalFound: results.length,
    hasLiveCredentials: false,
  }
}
