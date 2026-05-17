import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { AppShell } from "@/components/layout/AppShell"
import { MissionsList } from "@/components/MissionsList"
import { sampleMissions } from "@/data/missions"
import { DIFFICULTY_ORDER } from "@/lib/utils"

export const revalidate = 60

export default async function MissionsPage() {
  const session = await getServerSession(authOptions)

  let missions = await db.mission.findMany({
    where: { published: true, enabled: true },
    orderBy: { createdAt: "asc" },
  })

  let missionList: Array<{
    id: string; slug: string; title: string; description: string;
    roles: string[]; difficulty: string; completed: boolean
  }>

  let completedIds: string[] = []
  if (session?.user?.id) {
    const progress = await db.progress.findUnique({ where: { userId: session.user.id } })
    completedIds = progress?.completedMissions ?? []
  }

  if (missions.length === 0) {
    missionList = sampleMissions.filter((m) => m.enabled).map((m) => ({
      id: m.slug,
      slug: m.slug,
      title: m.title,
      description: m.description,
      roles: [...m.roles],
      difficulty: m.difficulty,
      completed: completedIds.includes(m.slug),
    }))
  } else {
    missionList = missions.map((m) => ({
      id: m.id,
      slug: m.slug,
      title: m.title,
      description: m.description,
      roles: m.roles,
      difficulty: m.difficulty,
      completed: completedIds.includes(m.id),
    }))
  }

  missionList.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty])

  return (
    <AppShell>
      <div className="mb-9 pb-9 border-b border-border">
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "#65605A", display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
          Missions
        </div>
        <h1
          className="m-0 font-normal"
          style={{ fontFamily: '"Instrument Serif", serif', fontSize: 56, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#1A1814" }}
        >
          Exercises on your real work.
        </h1>
        <p className="mt-6 mb-0 max-w-2xl" style={{ fontSize: 16, lineHeight: 1.6, color: "#65605A" }}>
          Missions don&apos;t simulate. They ask you to do the thing — on a workflow you actually own — and submit what you wrote. New missions ship on a release schedule.
        </p>
      </div>

      <MissionsList missions={missionList} isGuest={!session} />
    </AppShell>
  )
}
