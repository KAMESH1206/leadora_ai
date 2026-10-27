import { NextRequest, NextResponse } from 'next/server'
import { getProposals, createProposal } from '@/lib/store'

export async function GET() {
  const proposals = await getProposals()
  return NextResponse.json({ proposals })
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const proposal = await createProposal(data)
    return NextResponse.json({ success: true, proposal })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create proposal' }, { status: 500 })
  }
}
