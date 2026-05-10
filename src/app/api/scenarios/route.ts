import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sampleScenarios } from "@/data/scenarios"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  const { searchParams } = new URL(req.url)
  const VALID_ROLES = new Set(["PM", "EM", "IC"])
  const rawRole = searchParams.get("role")
  const role = VALID_ROLES.has(rawRole ?? "") ? (rawRole as "PM" | "EM" | "IC") : null

  let scenarios = await db.scenario.findMany({
    where: {
      published: true,
      ...(role ? { roles: { has: role } } : {}),
    },
    select: {
      id: true, slug: true, title: true, summary: true,
      roles: true, difficulty: true, industry: true,
    },
    orderBy: { createdAt: "asc" },
  })

  if (scenarios.length === 0) {
    scenarios = sampleScenarios
      .filter((s) => !role || (s.roles as unknown as string[]).includes(role))
      .map((s: (typeof sampleScenarios)[number]) => ({
        id: s.slug,
        slug: s.slug,
        title: s.title,
        summary: s.summary,
        roles: [...s.roles] as string[],
        difficulty: s.difficulty,
        industry: s.industry ?? null,
      })) as typeof scenarios
  }

  let completedIds: string[] = []
  if (session?.user?.id) {
    const progress = await db.progress.findUnique({
      where: { userId: session.user.id },
      select: { completedScenarios: true },
    })
    completedIds = progress?.completedScenarios ?? []
  }

  const withCompletion = scenarios.map((s: any) => ({
    ...s,
    completed: completedIds.includes(s.id),
  }))

  return NextResponse.json(withCompletion)
}
