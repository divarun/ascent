import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)

  // Guests: acknowledge without persisting — client stores in localStorage
  if (!session?.user?.id) {
    return NextResponse.json({ success: true })
  }

  const module = await db.module.findUnique({ where: { slug: params.slug } })
  // When running on static data (no DB module), use the slug as the stable ID
  const moduleId = module?.id ?? params.slug

  const prog = await db.progress.findUnique({ where: { userId: session.user.id } })
  if (!prog) {
    await db.progress.create({
      data: { userId: session.user.id, completedModules: [moduleId], totalPoints: 25 },
    })
  } else if (!prog.completedModules.includes(moduleId)) {
    await db.progress.update({
      where: { userId: session.user.id },
      data: { completedModules: { push: moduleId }, totalPoints: { increment: 25 } },
    })
  }

  return NextResponse.json({ success: true })
}
