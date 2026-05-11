import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ attempt: null })
  }

  const scenario = await db.scenario.findUnique({ where: { slug: params.slug } })
  if (!scenario) {
    return NextResponse.json({ attempt: null })
  }

  const attempt = await db.scenarioAttempt.findFirst({
    where: { userId: session.user.id, scenarioId: scenario.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      responses: true,
      feedback: true,
      score: true,
      selfAssessment: true,
      createdAt: true,
    },
  })

  return NextResponse.json({ attempt })
}
