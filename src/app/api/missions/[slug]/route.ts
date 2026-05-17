import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sampleMissions } from "@/data/missions"
import { isMissionFree } from "@/config/access"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { calculateLevel, getLevelLabel } from "@/lib/utils"
import { getPoints } from "@/config/scoring"
import { z } from "zod"

type MissionFeedback = {
  assessment: string
  highlights: string[]
  suggestions: string[]
  nextSteps: string[]
}

const submitSchema = z.object({
  response: z.string().min(1, "Response is required").max(50000, "Response too long"),
})

const assessSchema = z.object({
  selfAssessment: z.enum(["missed", "partial", "covered"]),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const dbMission = await db.mission.findUnique({ where: { slug: params.slug } })
  if (dbMission) {
    return NextResponse.json(dbMission)
  }

  const staticMission = sampleMissions.find((m) => m.slug === params.slug)
  if (!staticMission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ ...staticMission, id: staticMission.slug })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)

  if (!isMissionFree(params.slug) && !session) {
    return NextResponse.json({ error: "Sign in to access this mission" }, { status: 403 })
  }

  const ip = getClientIp(req)
  const rateLimitKey = session?.user?.id ? `mission:${session.user.id}` : `mission:${ip}`
  if (!rateLimit(rateLimitKey, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const dbMission = await db.mission.findUnique({ where: { slug: params.slug } })
  const staticMission = !dbMission
    ? sampleMissions.find((m) => m.slug === params.slug)
    : null

  if (!dbMission && !staticMission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const parsed = submitSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { response } = parsed.data
  const missionData = dbMission ?? staticMission!
  const staticFeedback = (missionData as any).staticFeedback as MissionFeedback | undefined

  const feedback: MissionFeedback = staticFeedback ?? {
    assessment: missionData.staticGuidance,
    highlights: [],
    suggestions: [],
    nextSteps: ["Re-read the checklist and verify your submission covers each point", "Share with a peer for feedback on your reasoning"],
  }

  let leveledUp = false
  let newLevel = 1
  let levelName = "Aware"

  if (session?.user?.id && dbMission) {
    const pts = getPoints("mission", dbMission.difficulty)
    const oldProg = await db.progress.findUnique({ where: { userId: session.user.id } })
    const oldLevel = calculateLevel(oldProg?.totalPoints ?? 0)
    let newPoints = oldProg?.totalPoints ?? 0

    await db.$transaction(async (tx: any) => {
      await tx.missionSubmission.create({
        data: {
          userId: session.user.id,
          missionId: dbMission.id,
          response,
          feedback,
        },
      })

      const prog = await tx.progress.findUnique({ where: { userId: session.user.id } })
      if (!prog) {
        await tx.progress.create({
          data: { userId: session.user.id, completedMissions: [dbMission.id], totalPoints: pts },
        })
        newPoints = pts
      } else if (!prog.completedMissions.includes(dbMission.id)) {
        const updated = await tx.progress.update({
          where: { userId: session.user.id },
          data: { completedMissions: { push: dbMission.id }, totalPoints: { increment: pts } },
        })
        newPoints = updated.totalPoints
      }
    })

    newLevel = calculateLevel(newPoints)
    levelName = getLevelLabel(newLevel)
    leveledUp = newLevel > oldLevel
  }

  return NextResponse.json({ feedback, leveledUp, newLevel, levelName })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const parsed = assessSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const dbMission = await db.mission.findUnique({ where: { slug: params.slug } })
  if (!dbMission) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const submission = await db.missionSubmission.findFirst({
    where: { userId: session.user.id, missionId: dbMission.id },
    orderBy: { completedAt: "desc" },
  })

  if (!submission) {
    return NextResponse.json({ error: "No submission found" }, { status: 404 })
  }

  await db.missionSubmission.update({
    where: { id: submission.id },
    data: { selfAssessment: parsed.data.selfAssessment },
  })

  return NextResponse.json({ ok: true })
}
