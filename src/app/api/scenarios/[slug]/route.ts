import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sampleScenarios } from "@/data/scenarios"
import { isScenarioFree } from "@/config/access"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { calculateLevel, getLevelLabel } from "@/lib/utils"
import { getPoints } from "@/config/scoring"
import { z } from "zod"

type ScenarioFeedback = {
  overallAssessment: string
  strengths: string[]
  blindSpots: string[]
  improvements: string[]
  followUpQuestion: string
  score: number
}

const submitSchema = z.object({
  responses: z.array(
    z.object({
      promptId: z.string(),
      response: z.string().max(50000),
    })
  ).min(1, "At least one response required"),
})

const assessSchema = z.object({
  selfAssessment: z.enum(["missed", "partial", "covered"]),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const dbScenario = await db.scenario.findUnique({
    where: { slug: params.slug },
  })

  if (dbScenario) {
    const { rubric: _r, staticFeedback: _sf, ...safe } = dbScenario
    return NextResponse.json(safe)
  }

  const staticScenario = sampleScenarios.find((s) => s.slug === params.slug)
  if (!staticScenario) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const { rubric: _r, staticFeedback: _sf, ...safe } = staticScenario as any
  return NextResponse.json({ ...safe, id: staticScenario.slug })
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)

  if (!isScenarioFree(params.slug) && !session) {
    return NextResponse.json({ error: "Sign in to access this scenario" }, { status: 403 })
  }

  const ip = getClientIp(req)
  const rateLimitKey = session?.user?.id ? `scenario:${session.user.id}` : `scenario:${ip}`
  if (!rateLimit(rateLimitKey, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const dbScenario = await db.scenario.findUnique({ where: { slug: params.slug } })
  const staticScenario = !dbScenario
    ? sampleScenarios.find((s) => s.slug === params.slug)
    : null

  if (!dbScenario && !staticScenario) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const parsed = submitSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { responses } = parsed.data

  const scenarioData = dbScenario ?? staticScenario!
  const staticFeedback = scenarioData.staticFeedback as any

  const feedback: ScenarioFeedback = (staticFeedback as ScenarioFeedback) ?? {
    overallAssessment: "Review your response against the scenario context and rubric criteria.",
    strengths: [],
    blindSpots: [],
    improvements: [],
    followUpQuestion: "",
    score: 5,
  }

  let leveledUp = false
  let newLevel = 1
  let levelName = "Aware"

  if (session?.user?.id && dbScenario) {
    const pts = getPoints("scenario", dbScenario.difficulty)
    const oldProg = await db.progress.findUnique({ where: { userId: session.user.id } })
    const oldLevel = calculateLevel(oldProg?.totalPoints ?? 0)
    let newPoints = oldProg?.totalPoints ?? 0

    await db.$transaction(async (tx: any) => {
      await tx.scenarioAttempt.create({
        data: {
          userId: session.user.id,
          scenarioId: dbScenario.id,
          responses,
          feedback,
          score: feedback.score,
          completedAt: new Date(),
        },
      })

      const prog = await tx.progress.findUnique({ where: { userId: session.user.id } })
      if (!prog) {
        await tx.progress.create({
          data: { userId: session.user.id, completedScenarios: [dbScenario.id], totalPoints: pts },
        })
        newPoints = pts
      } else if (!prog.completedScenarios.includes(dbScenario.id)) {
        const updated = await tx.progress.update({
          where: { userId: session.user.id },
          data: { completedScenarios: { push: dbScenario.id }, totalPoints: { increment: pts } },
        })
        newPoints = updated.totalPoints
      }
    })

    newLevel = calculateLevel(newPoints)
    levelName = getLevelLabel(newLevel)
    leveledUp = newLevel > oldLevel
  }

  const rubric = (scenarioData as any).rubric ?? []
  return NextResponse.json({ feedback, rubric, leveledUp, newLevel, levelName })
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

  const dbScenario = await db.scenario.findUnique({ where: { slug: params.slug } })
  if (!dbScenario) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const attempt = await db.scenarioAttempt.findFirst({
    where: { userId: session.user.id, scenarioId: dbScenario.id },
    orderBy: { createdAt: "desc" },
  })

  if (!attempt) {
    return NextResponse.json({ error: "No attempt found" }, { status: 404 })
  }

  await db.scenarioAttempt.update({
    where: { id: attempt.id },
    data: { selfAssessment: parsed.data.selfAssessment },
  })

  return NextResponse.json({ ok: true })
}
