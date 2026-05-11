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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = schema.parse(body)

    const scores = computeReadinessProfile(data)

    const [profile] = await db.$transaction([
      db.profile.upsert({
        where: { userId: session.user.id },
        update: { ...data, ...scores },
        create: { userId: session.user.id, companyStage: "", industry: "", ...data, ...scores },
      }),
      db.progress.upsert({
        where: { userId: session.user.id },
        update: {},
        create: { userId: session.user.id },
      }),
    ])

    return NextResponse.json(profile)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(profile)
}
