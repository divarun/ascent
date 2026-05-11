import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AppShell } from "@/components/layout/AppShell"
import { ScenariosList } from "@/components/ScenariosList"
import { sampleScenarios } from "@/data/scenarios"

export const revalidate = 60

export default async function ScenariosPage() {
  const session = await getServerSession(authOptions)

  let scenarios = await db.scenario.findMany({
    where: { published: true, enabled: true },
    select: { id: true, slug: true, title: true, summary: true, roles: true, difficulty: true, industry: true },
    orderBy: { createdAt: "asc" },
  })

  if (scenarios.length === 0) {
    scenarios = sampleScenarios.filter((s) => s.enabled).map((s) => ({
      id: s.slug,
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      roles: [...s.roles],
      difficulty: s.difficulty,
      industry: s.industry ?? null,
    }))
  }

  let completedIds: string[] = []
  if (session?.user?.id) {
    const progress = await db.progress.findUnique({ where: { userId: session.user.id } })
    completedIds = progress?.completedScenarios ?? []
  }

  const scenariosWithCompletion = scenarios.map((s) => ({
    ...s,
    completed: completedIds.includes(s.id),
  }))

  return (
    <AppShell>
      <div className="mb-9 pb-9 border-b border-border">
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "#65605A", display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
          Scenarios
        </div>
        <h1
          className="m-0 font-normal"
          style={{ fontFamily: '"Instrument Serif", serif', fontSize: 56, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#1A1814" }}
        >
          Work through the decisions.
        </h1>
        <p className="mt-6 mb-0 max-w-2xl" style={{ fontSize: 16, lineHeight: 1.6, color: "#65605A" }}>
          Each scenario presents a realistic situation with a few prompts. Write your response, then review the feedback on what you addressed and what you missed.
        </p>
      </div>

      <ScenariosList scenarios={scenariosWithCompletion} isGuest={!session} />
    </AppShell>
  )
}
