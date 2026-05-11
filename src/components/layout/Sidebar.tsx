"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const ROLE_KEY = "ascent_guest_role"
const ROLES = ["PM", "EM", "IC"] as const

const navItems = [
  { href: "/dashboard", label: "Dashboard", authOnly: true },
  { href: "/learn",     label: "Foundation", authOnly: false },
  { href: "/scenarios", label: "Scenarios", authOnly: false },
  { href: "/missions",  label: "Missions",  authOnly: false },
  { href: "/profile",   label: "Profile",   authOnly: true },
]

function AscentMark({ small = false }: { small?: boolean }) {
  const size = small ? 18 : 22
  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden>
        <path
          d="M2 18 L8 7 L11 12 L14 4 L20 18 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="2" y1="18.6" x2="20" y2="18.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span
        className="text-foreground leading-none"
        style={{ fontFamily: '"Instrument Serif", serif', fontSize: small ? 20 : 24, letterSpacing: "-0.01em" }}
      >
        Ascent
      </span>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [guestRole, setGuestRole] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setGuestRole(localStorage.getItem(ROLE_KEY))
  }, [])

  function selectGuestRole(role: string) {
    const next = guestRole === role ? null : role
    setGuestRole(next)
    if (next) localStorage.setItem(ROLE_KEY, next)
    else localStorage.removeItem(ROLE_KEY)
  }

  const signedIn = !!session?.user

  return (
    <aside className="w-60 min-h-screen border-r border-border bg-background flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href={signedIn ? "/dashboard" : "/"} className="text-foreground no-underline">
          <AscentMark small />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3.5 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => {
          if (item.authOnly && !signedIn) return null
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between px-3 py-2 rounded text-sm no-underline transition-all duration-150"
              style={{
                color: active ? "#F8F7F5" : "#1A1814",
                background: active ? "#1A1814" : "transparent",
              }}
            >
              <span>{item.label}</span>
              {active && <span style={{ opacity: 0.6, fontSize: 13 }}>→</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {signedIn ? (
        <div className="px-4 py-4 border-t border-border">
          <div className="text-sm font-medium text-foreground truncate mb-2.5">{session.user.name ?? session.user.email}</div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out →
          </button>
        </div>
      ) : (
        <div className="px-3.5 py-4 border-t border-border flex flex-col gap-2">
          {mounted && (
            <div className="px-1 mb-1">
              <div className="text-xs text-muted-foreground mb-2">I&rsquo;m a:</div>
              <div className="flex gap-1">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => selectGuestRole(r)}
                    className="flex-1 py-1 text-xs rounded transition-all duration-150"
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      border: `1px solid ${guestRole === r ? "#1A1814" : "#DDDCD9"}`,
                      background: guestRole === r ? "#1A1814" : "transparent",
                      color: guestRole === r ? "#F8F7F5" : "#65605A",
                      cursor: "pointer",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          <Link
            href="/signup"
            className="block text-center py-2 rounded text-sm font-medium no-underline transition-colors"
            style={{ background: "#1A1814", color: "#F8F7F5" }}
          >
            Create account
          </Link>
          <Link
            href="/login"
            className="block text-center py-2 text-sm no-underline"
            style={{ color: "#65605A" }}
          >
            Sign in
          </Link>
        </div>
      )}
    </aside>
  )
}
