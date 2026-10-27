import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import type { Prisma } from '@prisma/client'

const registerSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8).max(128),
  workspaceName: z.string().min(2).max(80).trim(),
})

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = slugify(base)
  let count = 0
  while (true) {
    const candidate = count === 0 ? slug : `${slug}-${count}`
    const existing = await prisma.workspace.findUnique({ where: { slug: candidate } })
    if (!existing) return candidate
    count++
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input: ' + parsed.error.issues.map((i) => i.message).join(', ') },
        { status: 400 }
      )
    }

    const { name, email, password, workspaceName } = parsed.data

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const slug = await uniqueSlug(workspaceName)

    // Create user + workspace in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: { name, email, passwordHash },
      })

      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName,
          slug,
          ownerId: user.id,
          memberships: {
            create: {
              userId: user.id,
              role: 'OWNER',
              acceptedAt: new Date(),
            },
          },
          subscription: {
            create: {
              plan: 'STARTER',
              status: 'TRIALING',
              trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              discoveryQuota: 500,
              auditQuota: 100,
              proposalQuota: 50,
              seats: 1,
            },
          },
        },
      })

      return { user, workspace }
    })

    return NextResponse.json(
      { userId: result.user.id, workspaceId: result.workspace.id },
      { status: 201 }
    )
  } catch (err) {
    console.error('[register] error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
