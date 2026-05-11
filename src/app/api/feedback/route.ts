import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { z } from "zod"

const schema = z.object({
  mood: z.enum(["great", "ok", "stuck", "off"]).optional(),
  pains: z.array(z.string().max(200)).max(20).optional(),
  stuck: z.string().max(5000).optional(),
  missing: z.string().max(5000).optional(),
  nps: z.number().int().min(0).max(10).optional(),
  email: z.string().email().max(200).optional(),
  surface: z.string().max(200).optional(),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!rateLimit(`feedback:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
    const { mood, pains, stuck, missing, nps, email, surface } = parsed.data

    const session = await getServerSession(authOptions)

    await db.feedback.create({
      data: {
        mood: mood ?? null,
        pains: pains ?? [],
        surface: surface ?? null,
        stuck: stuck ?? null,
        missing: missing ?? null,
        nps: nps ?? null,
        email: email ?? null,
        userId: session?.user?.id ?? null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
}
