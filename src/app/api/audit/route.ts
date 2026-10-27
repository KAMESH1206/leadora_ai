import { NextRequest, NextResponse } from 'next/server'
import { runWebsiteAudit } from '@/lib/audit-engine'

export async function POST(req: NextRequest) {
  try {
    const { url, isNoWebsite } = await req.json()
    const result = await runWebsiteAudit(url, isNoWebsite)
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Audit execution failed' }, { status: 500 })
  }
}
