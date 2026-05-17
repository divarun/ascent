import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { calculateLevel, getLevelLabel } from "@/lib/utils"
import { getPoints } from "@/config/scoring"
import { sampleModules } from "@/data/modules"

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)

  // Guests: acknowledge without persisting — client stores in localStorage
  if (!session?.user?.id) {
    return NextResponse.json({ success: true })
  }

  const module = await db.module.findUnique({ where: { slug: params.slug } })
  const moduleId = module?.id ?? params.slug
  const difficulty = module?.difficulty ?? sampleModules.find((m) => m.slug === params.slug)?.difficulty ?? "INTERMEDIATE"
  const pts = getPoints("module", difficulty)

  const oldProg = await db.progress.findUnique({ where: { userId: session.user.id } })
  const oldLevel = calculateLevel(oldProg?.totalPoints ?? 0)
  let newPoints = oldProg?.totalPoints ?? 0

  await db.$transaction(async (tx) => {
    const prog = await tx.progress.findUnique({ where: { userId: session.user.id } })
    if (!prog) {
      await tx.progress.create({
        data: { userId: session.user.id, completedModules: [moduleId], totalPoints: pts },
      })
      newPoints = pts
    } else if (!prog.completedModules.includes(moduleId)) {
      const updated = await tx.progress.update({
        where: { userId: session.user.id },
        data: { completedModules: { push: moduleId }, totalPoints: { increment: pts } },
      })
      newPoints = updated.totalPoints
    }
  })

  const newLevel = calculateLevel(newPoints)
  return NextResponse.json({
    success: true,
    leveledUp: newLevel > oldLevel,
    newLevel,
    levelName: getLevelLabel(newLevel),
  })
}
