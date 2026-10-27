import { NextRequest, NextResponse } from 'next/server'
import { getLeads, updateLeadStatus } from '@/lib/store'

export async function GET() {
  const leads = await getLeads()
  return NextResponse.json({ leads })
}

export async function PATCH(req: NextRequest) {
  try {
    const { leadId, status } = await req.json()
    if (!leadId || !status) {
      return NextResponse.json({ error: 'leadId and status are required' }, { status: 400 })
    }
    const updated = await updateLeadStatus(leadId, status)
    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, lead: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update lead' }, { status: 500 })
  }
}
