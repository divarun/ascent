import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { calculateLevel } from "@/lib/utils"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const progress = await db.progress.findUnique({
    where: { userId: session.user.id },
  })

  if (!progress) {
    return NextResponse.json({
      level: 1,
      totalPoints: 0,
      completedModules: [],
      completedScenarios: [],
      completedMissions: [],
    })
  }

  const level = calculateLevel(progress.totalPoints)

  // Update level if it changed
  if (level !== progress.level) {
    await db.progress.update({
      where: { userId: session.user.id },
      data: { level },
    })
  }

  return NextResponse.json({ ...progress, level })
}
