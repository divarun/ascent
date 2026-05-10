import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin — Ascent",
  robots: "noindex, nofollow",
}

const NAV_LINKS = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/feedback", label: "Feedback" },
  { href: "/admin/bug-reports", label: "Bug Reports" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#111110", color: "#D4D1CB", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <nav style={{ borderBottom: "1px solid #222220", padding: "0 32px", display: "flex", alignItems: "center", gap: 32, height: 52 }}>
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", flexShrink: 0 }}>
          Ascent / Admin
        </span>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{ fontSize: 13.5, color: "#D4D1CB", textDecoration: "none", opacity: 0.8 }}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <main style={{ padding: "36px 32px", maxWidth: 1200, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  )
}
