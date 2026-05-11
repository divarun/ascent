import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const
const ROLES = ["PM", "EM", "IC"] as const

const schema = z.object({
  type: z.enum(["module", "scenario", "mission"]),
  slug: z.string().min(1),
  // Toggle-only fields
  enabled: z.boolean().optional(),
  published: z.boolean().optional(),
  // Shared editable fields
  title: z.string().min(1).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  roles: z.array(z.enum(ROLES)).min(1).optional(),
  // Module-specific
  summary: z.string().optional(),
  order: z.number().int().min(0).optional(),
  // Scenario-specific
  industry: z.string().nullable().optional(),
  // Mission-specific
  description: z.string().optional(),
})

export async function PATCH(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const { type, slug, enabled, published, title, difficulty, roles, summary, order, industry, description } = parsed.data

  const common = Object.fromEntries(
    Object.entries({ enabled, published, title, difficulty, roles }).filter(([, v]) => v !== undefined)
  )

  try {
    if (type === "module") {
      await db.module.update({
        where: { slug },
        data: { ...common, ...(summary !== undefined && { summary }), ...(order !== undefined && { order }) },
      })
    } else if (type === "scenario") {
      await db.scenario.update({
        where: { slug },
        data: { ...common, ...(summary !== undefined && { summary }), ...(industry !== undefined && { industry }) },
      })
    } else {
      await db.mission.update({
        where: { slug },
        data: { ...common, ...(description !== undefined && { description }) },
      })
    }

    revalidatePath("/learn")
    revalidatePath("/scenarios")
    revalidatePath("/missions")
    revalidatePath("/dashboard")

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
