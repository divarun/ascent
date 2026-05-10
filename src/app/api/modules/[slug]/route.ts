import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sampleModules } from "@/data/modules"

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)

  const dbModule = await db.module.findUnique({ where: { slug: params.slug } })

  if (dbModule) {
    const progress = session?.user?.id
      ? await db.progress.findUnique({
          where: { userId: session.user.id },
          select: { completedModules: true },
        })
      : null

    return NextResponse.json({
      ...dbModule,
      completed: progress?.completedModules.includes(dbModule.id) ?? false,
    })
  }

  const staticModule = sampleModules.find((m) => m.slug === params.slug)
  if (!staticModule) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Static modules use their slug as ID — check progress record with that same ID
  const staticProgress = session?.user?.id
    ? await db.progress.findUnique({
        where: { userId: session.user.id },
        select: { completedModules: true },
      })
    : null

  return NextResponse.json({
    ...staticModule,
    id: staticModule.slug,
    completed: staticProgress?.completedModules.includes(staticModule.slug) ?? false,
  })
}
