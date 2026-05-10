import { NextRequest, NextResponse } from "next/server"

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

const DENY = new NextResponse("Unauthorized", {
  status: 401,
  headers: { "WWW-Authenticate": 'Basic realm="Ascent Admin"' },
})

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD

  if (!adminUser || !adminPass) {
    return new NextResponse("Admin access not configured", { status: 503 })
  }

  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Basic ")) return DENY

  const decoded = atob(authHeader.slice(6))
  const colonIdx = decoded.indexOf(":")
  const username = decoded.substring(0, colonIdx)
  const password = decoded.substring(colonIdx + 1)

  if (constantTimeEqual(username, adminUser) && constantTimeEqual(password, adminPass)) {
    return NextResponse.next()
  }

  return DENY
}

export const config = {
  matcher: "/admin/:path*",
}
