"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

function AscentMark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={22} height={22} viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M2 18 L8 7 L11 12 L14 4 L20 18 Z" stroke="#1A1814" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
        <line x1="2" y1="18.6" x2="20" y2="18.6" stroke="#1A1814" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, lineHeight: 1, letterSpacing: "-0.01em", color: "#1A1814" }}>
        Ascent
      </span>
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [nameFocus, setNameFocus] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)
  const [pwFocus, setPwFocus] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? "Something went wrong")
        setLoading(false)
        return
      }
      const result = await signIn("credentials", { email, password, redirect: false })
      setLoading(false)
      if (result?.error) router.push("/login")
      else router.push("/onboarding")
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const inputStyle = (focus: boolean) => ({
    width: "100%",
    padding: "12px 14px",
    background: "#F0EFEB",
    border: `1px solid ${focus ? "#1A1814" : "#DDDCD9"}`,
    borderRadius: 4,
    fontFamily: "inherit",
    fontSize: 14,
    color: "#1A1814",
    outline: "none",
    transition: "border-color 120ms",
    boxSizing: "border-box" as const,
  })

  const labelStyle = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 10.5,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#65605A",
    marginBottom: 8,
    display: "block",
  }

  return (
    <div
      style={{ minHeight: "100vh", background: "#F0EFEB", color: "#1A1814", display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}
    >
      {/* Left: form */}
      <div style={{ padding: 40, display: "flex", flexDirection: "column" }}>
        <AscentMark />
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: 440 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
              Create account
            </div>
            <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: 52, lineHeight: 1, letterSpacing: "-0.02em", color: "#1A1814", fontWeight: 400 }}>
              Begin the ascent.
            </h1>
            <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.6, color: "#65605A" }}>
              An account adds progress, points, and recommendations. The content was already free.
            </p>

            <form style={{ marginTop: 36 }} onSubmit={handleSubmit}>
              <label style={{ display: "block", marginBottom: 18 }}>
                <div style={labelStyle}>Your name</div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => setNameFocus(false)}
                  style={inputStyle(nameFocus)}
                />
              </label>
              <label style={{ display: "block", marginBottom: 18 }}>
                <div style={labelStyle}>Email</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@work.com"
                  required
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  style={inputStyle(emailFocus)}
                />
              </label>
              <label style={{ display: "block", marginBottom: 18 }}>
                <div style={labelStyle}>Password</div>
                <div style={{ fontSize: 12, color: "#8A857E", marginBottom: 6 }}>Eight characters minimum.</div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  onFocus={() => setPwFocus(true)}
                  onBlur={() => setPwFocus(false)}
                  style={inputStyle(pwFocus)}
                />
              </label>

              {error && (
                <div style={{ padding: "10px 12px", border: "1px solid #A65A2E", color: "#A65A2E", fontSize: 13, borderRadius: 4, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: "#1A1814", color: "#F8F7F5", borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}
              >
                {loading && <Loader2 style={{ width: 14, height: 14 }} />}
                Create account →
              </button>

              <div style={{ marginTop: 18, fontSize: 13, color: "#65605A" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "#1A1814" }}>Sign in</Link>
              </div>
            </form>
          </div>
        </div>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A" }}>ASCENT · v1.0</div>
      </div>

      {/* Right: curriculum panel */}
      <div style={{ padding: 56, background: "#1A1814", color: "#F8F7F5", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "rgba(248,247,245,0.5)", textTransform: "uppercase" }}>
          What's inside
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            {
              label: "01 — Foundation",
              meta: "20 modules",
              desc: "What LLMs actually do. Build vs buy. Evals. Ethics. Security. Agentic AI. The full technical and strategic picture.",
            },
            {
              label: "02 — Scenarios",
              meta: "15 decision scenarios",
              desc: "Vendor pitches, scope fights, biased models, rogue agents, legal escalations. Write your reasoning under pressure.",
            },
            {
              label: "03 — Missions",
              meta: "12 applied exercises",
              desc: "Design a prompt system. Run a bias check. Write a feature brief. Completed on your real work, not hypotheticals.",
            },
          ].map((track, i) => (
            <div
              key={track.label}
              style={{
                paddingTop: i === 0 ? 0 : 28,
                paddingBottom: 28,
                borderBottom: i < 2 ? "1px solid rgba(248,247,245,0.1)" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8, gap: 16 }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#F8F7F5" }}>
                  {track.label}
                </span>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: "0.08em", color: "rgba(248,247,245,0.4)", whiteSpace: "nowrap" as const }}>
                  {track.meta}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "rgba(248,247,245,0.65)" }}>
                {track.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", paddingTop: 24, borderTop: "1px solid rgba(248,247,245,0.15)" }}>
          {[["20", "modules"], ["15", "scenarios"], ["12", "missions"]].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 36, lineHeight: 1, color: "#F8F7F5" }}>{n}</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", color: "rgba(248,247,245,0.5)", textTransform: "uppercase", marginTop: 6 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
