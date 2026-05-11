import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

type Params = { params: { type: string; slug: string } }

const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const
const ROLES = ["PM", "EM", "IC"] as const

const moduleSchema = z.object({
  title: z.string().min(1),
  summary: z.string(),
  content: z.string(),
  quiz: z.unknown(),
  difficulty: z.enum(DIFFICULTIES),
  roles: z.array(z.enum(ROLES)).min(1),
  tags: z.array(z.string()),
  order: z.number().int().min(0),
  published: z.boolean(),
  enabled: z.boolean(),
})

const scenarioSchema = z.object({
  title: z.string().min(1),
  summary: z.string(),
  context: z.string(),
  difficulty: z.enum(DIFFICULTIES),
  roles: z.array(z.enum(ROLES)).min(1),
  industry: z.string().nullable(),
  prompts: z.unknown(),
  rubric: z.unknown(),
  staticFeedback: z.unknown(),
  isUnlocked: z.boolean(),
  published: z.boolean(),
  enabled: z.boolean(),
})

const missionSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  instructions: z.string(),
  difficulty: z.enum(DIFFICULTIES),
  roles: z.array(z.enum(ROLES)).min(1),
  staticGuidance: z.string(),
  staticFeedback: z.unknown().nullable(),
  checklist: z.array(z.string()),
  isUnlocked: z.boolean(),
  published: z.boolean(),
  enabled: z.boolean(),
})

export async function GET(_req: NextRequest, { params }: Params) {
  const { type, slug } = params
  try {
    if (type === "module") {
      const record = await db.module.findUnique({ where: { slug } })
      if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 })
      return NextResponse.json(record)
    }
    if (type === "scenario") {
      const record = await db.scenario.findUnique({ where: { slug } })
      if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 })
      return NextResponse.json(record)
    }
    if (type === "mission") {
      const record = await db.mission.findUnique({ where: { slug } })
      if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 })
      return NextResponse.json(record)
    }
    return NextResponse.json({ error: "Invalid type" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { type, slug } = params
  const body = await req.json()

  try {
    if (type === "module") {
      const parsed = moduleSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: "Invalid data", issues: parsed.error.issues }, { status: 400 })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.module.update({ where: { slug }, data: parsed.data as any })
    } else if (type === "scenario") {
      const parsed = scenarioSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: "Invalid data", issues: parsed.error.issues }, { status: 400 })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.scenario.update({ where: { slug }, data: parsed.data as any })
    } else if (type === "mission") {
      const parsed = missionSchema.safeParse(body)
      if (!parsed.success) return NextResponse.json({ error: "Invalid data", issues: parsed.error.issues }, { status: 400 })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.mission.update({ where: { slug }, data: parsed.data as any })
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    revalidatePath("/learn")
    revalidatePath("/scenarios")
    revalidatePath("/missions")
    revalidatePath("/dashboard")
    revalidatePath("/admin/content")

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
