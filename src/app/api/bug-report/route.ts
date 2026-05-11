import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import { z } from "zod"

const schema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  steps: z.string().max(5000).optional(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  surface: z.string().max(200).optional(),
  device: z.string().max(200).optional(),
  email: z.string().email().max(200).optional(),
})

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!rateLimit(`bug-report:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  try {
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
    const { title, description, steps, severity, surface, device, email } = parsed.data

    const session = await getServerSession(authOptions)

    const report = await db.bugReport.create({
      data: {
        title,
        description,
        steps: steps ?? null,
        severity,
        surface: surface ?? null,
        device: device ?? null,
        email: email ?? null,
        userId: session?.user?.id ?? null,
      },
    })

    return NextResponse.json({ id: report.id })
  } catch {
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 })
  }
}
