"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

const C = { bg: "#F0EFEB", ink: "#1A1814", sub: "#65605A", line: "#DDDCD9", warn: "#A65A2E", good: "#2C5F4F" }

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [focus, setFocus] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })
    setLoading(false)
    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push("/login"), 2500)
    } else {
      const data = await res.json()
      setError(data.error ?? "Something went wrong")
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "inherit" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: C.sub, fontSize: 15 }}>Invalid reset link.</p>
          <Link href="/forgot-password" style={{ color: C.ink, fontSize: 14 }}>Request a new one →</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.sub, display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span style={{ width: 16, height: 1, background: C.sub, display: "inline-block" }} />
          New password
        </div>
        <h1 style={{ margin: "0 0 12px", fontFamily: '"Instrument Serif", serif', fontSize: 44, lineHeight: 1, letterSpacing: "-0.02em", color: C.ink, fontWeight: 400 }}>
          Set a new password.
        </h1>

        {done ? (
          <div style={{ padding: "16px 20px", border: `1px solid ${C.good}`, background: "#F0FDF8", borderRadius: 4 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", color: C.good, marginBottom: 6 }}>
              PASSWORD UPDATED
            </div>
            <p style={{ margin: 0, fontSize: 14, color: C.ink }}>Redirecting you to sign in…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
            <label style={{ display: "block", marginBottom: 20 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: C.sub, marginBottom: 8 }}>
                New password
              </div>
              <div style={{ fontSize: 12, color: "#8A857E", marginBottom: 6 }}>Eight characters minimum.</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={{ width: "100%", padding: "12px 14px", background: C.bg, border: `1px solid ${focus ? C.ink : C.line}`, borderRadius: 4, fontFamily: "inherit", fontSize: 14, color: C.ink, outline: "none", transition: "border-color 120ms", boxSizing: "border-box" }}
              />
            </label>

            {error && (
              <div style={{ padding: "10px 12px", border: `1px solid ${C.warn}`, color: C.warn, fontSize: 13, borderRadius: 4, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || password.length < 8}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.ink, color: "#F8F7F5", borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "none", cursor: loading || password.length < 8 ? "not-allowed" : "pointer", opacity: loading || password.length < 8 ? 0.5 : 1 }}
            >
              {loading && <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" />}
              Update password →
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
