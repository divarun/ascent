import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AppShell } from "@/components/layout/AppShell"
import { sampleModules } from "@/data/modules"
import { ModuleList } from "@/components/ModuleList"

export default async function LearnPage() {
  const session = await getServerSession(authOptions)

  let modules = await db.module.findMany({ where: { published: true }, orderBy: { order: "asc" } })

  let completedIds: string[] = []

  if (session?.user?.id) {
    const progress = await db.progress.findUnique({ where: { userId: session.user.id } })
    completedIds = progress?.completedModules ?? []
  }

  const DIFFICULTY_ORDER: Record<string, number> = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 }

  const displayModules = (modules.length > 0
    ? modules.map((m) => ({
        id: m.id,
        slug: m.slug,
        title: m.title,
        summary: m.summary,
        difficulty: m.difficulty,
        roles: m.roles as string[],
        completed: completedIds.includes(m.id),
        relevant: true,
      }))
    : sampleModules.map((m) => ({
        id: m.slug,
        slug: m.slug,
        title: m.title,
        summary: m.summary,
        difficulty: m.difficulty,
        roles: [...m.roles] as string[],
        completed: false,
        relevant: true,
      }))).sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty])

  return (
    <AppShell>
      <div className="mb-9 pb-9 border-b border-border">
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "#65605A", display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
          Foundation
        </div>
        <h1
          className="m-0 font-normal"
          style={{ fontFamily: '"Instrument Serif", serif', fontSize: 56, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#1A1814" }}
        >
          The {displayModules.length} modules.
        </h1>
        <p className="mt-6 mb-0 max-w-2xl" style={{ fontSize: 16, lineHeight: 1.6, color: "#65605A" }}>
          Text-first. Read what&apos;s relevant; skip what isn&apos;t. Modules don&apos;t gate each other.
        </p>
      </div>

      <ModuleList modules={displayModules} isGuest={!session} />
    </AppShell>
  )
}
