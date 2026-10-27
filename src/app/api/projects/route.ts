import { NextRequest, NextResponse } from 'next/server'
import { getProjects, toggleMilestone } from '@/lib/store'

export async function GET() {
  const projects = await getProjects()
  return NextResponse.json({ projects })
}

export async function PATCH(req: NextRequest) {
  try {
    const { projectId, milestoneIndex } = await req.json()
    const updated = await toggleMilestone(projectId, milestoneIndex)
    if (!updated) {
      return NextResponse.json({ error: 'Project or milestone not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, project: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update milestone' }, { status: 500 })
  }
}
