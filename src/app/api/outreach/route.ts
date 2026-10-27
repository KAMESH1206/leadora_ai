import { NextRequest, NextResponse } from 'next/server'
import { getOutreachMessages, updateOutreachStatus, createOutreachMessage } from '@/lib/store'

export async function GET() {
  const messages = await getOutreachMessages()
  return NextResponse.json({ messages })
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const msg = await createOutreachMessage(data)
    return NextResponse.json({ success: true, message: msg })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create outreach message' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    const updated = await updateOutreachStatus(id, status)
    if (!updated) {
      return NextResponse.json({ error: 'Outreach message not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update outreach message' }, { status: 500 })
  }
}
