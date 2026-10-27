import { NextRequest, NextResponse } from 'next/server'
import { searchBusinesses } from '@/lib/discovery'
import { saveLead } from '@/lib/store'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { category, location, radiusMeters, websiteFilter, action, business } = body

    if (action === 'save_lead' && business) {
      const saved = await saveLead(business)
      return NextResponse.json({ success: true, lead: saved })
    }

    const result = await searchBusinesses({
      category: category || 'Local Businesses',
      location: location || 'San Francisco, CA',
      radiusMeters: Number(radiusMeters) || 5000,
      websiteFilter: websiteFilter || 'ALL',
    })

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Discovery search failed' }, { status: 500 })
  }
}
