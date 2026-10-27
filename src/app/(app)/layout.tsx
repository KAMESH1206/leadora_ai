import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { prisma } from '@/lib/db'

export const instant = false

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/sign-in')

  // Fetch workspace info
  const userId = (session.user as { id?: string }).id
  const membership = userId
    ? await prisma.workspaceMembership.findFirst({
        where: { userId, acceptedAt: { not: null } },
        include: { workspace: { select: { name: true } } },
        orderBy: { acceptedAt: 'desc' },
      })
    : null

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar
        userName={session.user.name ?? session.user.email ?? undefined}
        workspaceName={membership?.workspace.name}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
          {children}
        </main>
      </div>
    </div>
  )
}
