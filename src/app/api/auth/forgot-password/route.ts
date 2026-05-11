import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendPasswordResetEmail } from "@/lib/email"
import { rateLimit, getClientIp } from "@/lib/rate-limit"
import crypto from "crypto"
import { z } from "zod"

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  if (!rateLimit(`forgot-password:${ip}`, 5, 60_000)) {
    return NextResponse.json({ ok: true }) // silent throttle — don't reveal rate limiting
  }

  try {
    const { email } = schema.parse(await req.json())
    const user = await db.user.findUnique({ where: { email } })

    // Always respond OK to prevent email enumeration
    if (!user || !user.passwordHash) {
      return NextResponse.json({ ok: true })
    }

    const token = crypto.randomBytes(32).toString("hex")
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpires: expires },
    })

    await sendPasswordResetEmail(email, token)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true }) // silent error — don't reveal internals
  }
}
