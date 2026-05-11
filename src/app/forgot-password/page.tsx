"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"

const C = { bg: "#F0EFEB", ink: "#1A1814", sub: "#65605A", line: "#DDDCD9", warn: "#A65A2E", good: "#2C5F4F" }

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [focus, setFocus] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    setSent(true)
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <Link href="/login" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 36 }}>
          ← Back to sign in
        </Link>

        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.sub, display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span style={{ width: 16, height: 1, background: C.sub, display: "inline-block" }} />
          Password reset
        </div>
        <h1 style={{ margin: "0 0 12px", fontFamily: '"Instrument Serif", serif', fontSize: 44, lineHeight: 1, letterSpacing: "-0.02em", color: C.ink, fontWeight: 400 }}>
          Forgot your password?
        </h1>
        <p style={{ margin: "0 0 32px", fontSize: 15, lineHeight: 1.6, color: C.sub }}>
          Enter your email and we&apos;ll send a reset link if an account exists.
        </p>

        {sent ? (
          <div style={{ padding: "16px 20px", border: `1px solid ${C.good}`, background: "#F0FDF8", borderRadius: 4 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", color: C.good, marginBottom: 6 }}>
              CHECK YOUR INBOX
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: C.ink }}>
              If {email} has an account, a reset link is on its way. Check your spam folder if you don&apos;t see it.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", marginBottom: 20 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: C.sub, marginBottom: 8 }}>
                Email
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@work.com"
                required
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                style={{ width: "100%", padding: "12px 14px", background: C.bg, border: `1px solid ${focus ? C.ink : C.line}`, borderRadius: 4, fontFamily: "inherit", fontSize: 14, color: C.ink, outline: "none", transition: "border-color 120ms", boxSizing: "border-box" }}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.ink, color: "#F8F7F5", borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
            >
              {loading && <Loader2 style={{ width: 14, height: 14 }} className="animate-spin" />}
              Send reset link →
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
