import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { computeReadinessProfile } from "@/lib/onboarding"
import { z } from "zod"

const schema = z.object({
  role: z.enum(["PM", "EM", "IC"]),
  aiFamiliarity: z.enum(["NONE", "BASIC", "MODERATE", "ADVANCED"]),
  biggestChallenge: z.string().min(1),
  goals: z.array(z.string()).min(1),
})

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [user, profile] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true } }),
    db.profile.findUnique({ where: { userId: session.user.id } }),
  ])

  return NextResponse.json({ user, profile })
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = schema.parse(body)
    const scores = computeReadinessProfile(data)

    const profile = await db.profile.upsert({
      where: { userId: session.user.id },
      update: { ...data, ...scores },
      create: { userId: session.user.id, ...data, ...scores },
    })

    return NextResponse.json(profile)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
