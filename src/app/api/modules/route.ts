import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sampleModules } from "@/data/modules"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  const { searchParams } = new URL(req.url)
  const VALID_ROLES = new Set(["PM", "EM", "IC"])
  const rawRole = searchParams.get("role")
  const role = VALID_ROLES.has(rawRole ?? "") ? (rawRole as "PM" | "EM" | "IC") : null

  let modules = await db.module.findMany({
    where: {
      published: true,
      ...(role ? { roles: { has: role } } : {}),
    },
    orderBy: { order: "asc" },
  })

  if (modules.length === 0) {
    modules = sampleModules
      .filter((m) => !role || (m.roles as readonly string[]).includes(role))
      .map((m: (typeof sampleModules)[number]) => ({
        id: m.slug,
        slug: m.slug,
        title: m.title,
        summary: m.summary,
        content: m.content,
        difficulty: m.difficulty,
        roles: [...m.roles],
        tags: [...m.tags],
        order: m.order,
        published: true,
        createdAt: new Date(),
      })) as any[]
  }

  let completedIds: string[] = []
  if (session?.user?.id) {
    const progress = await db.progress.findUnique({
      where: { userId: session.user.id },
      select: { completedModules: true },
    })
    completedIds = progress?.completedModules ?? []
  }

  const withCompletion = modules.map((m: any) => ({
    ...m,
    completed: completedIds.includes(m.id),
  }))

  return NextResponse.json(withCompletion)
}
