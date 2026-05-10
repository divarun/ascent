import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sampleMissions } from "@/data/missions"

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions)

  let missions = await db.mission.findMany({
    where: { published: true },
    orderBy: { createdAt: "asc" },
  })

  if (missions.length === 0) {
    missions = sampleMissions.map((m: (typeof sampleMissions)[number]) => ({
      id: m.slug,
      slug: m.slug,
      title: m.title,
      description: m.description,
      instructions: m.instructions,
      roles: [...m.roles],
      difficulty: m.difficulty,
      staticGuidance: m.staticGuidance,
      checklist: [...m.checklist],
      published: true,
      createdAt: new Date(),
    })) as any[]
  }

  let completedIds: string[] = []
  if (session?.user?.id) {
    const progress = await db.progress.findUnique({
      where: { userId: session.user.id },
      select: { completedMissions: true },
    })
    completedIds = progress?.completedMissions ?? []
  }

  const withCompletion = missions.map((m: any) => ({
    ...m,
    completed: completedIds.includes(m.id),
  }))

  return NextResponse.json(withCompletion)
}
