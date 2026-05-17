import { NextRequest, NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

const COOKIE_NAME = "admin_session"
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

function constantTimeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a)
  const bBytes = new TextEncoder().encode(b)
  if (aBytes.length !== bBytes.length) return false
  let diff = 0
  for (let i = 0; i < aBytes.length; i++) {
    diff |= aBytes[i] ^ bBytes[i]
  }
  return diff === 0
}

function sessionToken(user: string, pass: string): string {
  // Stateless token derived from credentials — avoids storing raw password in cookie
  // btoa is used instead of Buffer (not available in Edge runtime)
  return btoa(`${user}:${pass}:ascent-admin`)
}

const DENY = new NextResponse("Unauthorized", {
  status: 401,
  headers: { "WWW-Authenticate": 'Basic realm="Ascent Admin"' },
})

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    return NextResponse.next()
  }

  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD

  if (!adminUser || !adminPass) {
    return new NextResponse("Admin access not configured", { status: 503 })
  }

  const expected = sessionToken(adminUser, adminPass)

  // API routes: accept the session cookie set by a prior page-level Basic Auth
  if (pathname.startsWith("/api/admin/")) {
    const cookie = req.cookies.get(COOKIE_NAME)
    if (cookie && constantTimeEqual(cookie.value, expected)) {
      return NextResponse.next()
    }
    return new NextResponse("Unauthorized", { status: 401 })
  }

  // Page routes: if a valid session cookie is present, skip rate limiting
  const sessionCookie = req.cookies.get(COOKIE_NAME)
  if (sessionCookie && constantTimeEqual(sessionCookie.value, expected)) {
    return NextResponse.next()
  }

  // No valid session — rate-limit to guard against brute-force login attempts
  // Skip when DISABLE_ADMIN_RATE_LIMIT=true (useful for local Docker runs)
  if (process.env.DISABLE_ADMIN_RATE_LIMIT !== "true") {
    const ip = getClientIp(req)
    if (!rateLimit(`admin:${ip}`, 10, 60_000)) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }
  }

  // Page routes: require Basic Auth and set the session cookie on success
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Basic ")) return DENY

  const decoded = atob(authHeader.slice(6))
  const colonIdx = decoded.indexOf(":")
  const username = decoded.substring(0, colonIdx)
  const password = decoded.substring(colonIdx + 1)

  if (constantTimeEqual(username, adminUser) && constantTimeEqual(password, adminPass)) {
    const res = NextResponse.next()
    res.cookies.set(COOKIE_NAME, expected, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    })
    return res
  }

  return DENY
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
