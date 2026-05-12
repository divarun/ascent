"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
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

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)
  const [pwFocus, setPwFocus] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (result?.error) setError("Invalid email or password.")
    else router.push(searchParams.get("callbackUrl") ?? "/dashboard")
  }

  return (
    <div
      className="min-h-screen grid md:grid-cols-2"
      style={{ background: "#F0EFEB", color: "#1A1814", fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}
    >
      {/* Left: form */}
      <div className="p-6 sm:p-10 flex flex-col">
        <AscentMark />
        <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: 440 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
              Sign in
            </div>
            <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: 52, lineHeight: 1, letterSpacing: "-0.02em", color: "#1A1814", fontWeight: 400 }}>
              Welcome back.
            </h1>
            <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.6, color: "#65605A" }}>
              Pick up where you left off.
            </p>

            <form style={{ marginTop: 36 }} onSubmit={handleSubmit}>
              <label style={{ display: "block", marginBottom: 18 }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#65605A", marginBottom: 8 }}>
                  Email
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@work.com"
                  required
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => setEmailFocus(false)}
                  style={{ width: "100%", padding: "12px 14px", background: "#F0EFEB", border: `1px solid ${emailFocus ? "#1A1814" : "#DDDCD9"}`, borderRadius: 4, fontFamily: "inherit", fontSize: 14, color: "#1A1814", outline: "none", transition: "border-color 120ms", boxSizing: "border-box" }}
                />
              </label>
              <label style={{ display: "block", marginBottom: 18 }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#65605A", marginBottom: 8 }}>
                  Password
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  onFocus={() => setPwFocus(true)}
                  onBlur={() => setPwFocus(false)}
                  style={{ width: "100%", padding: "12px 14px", background: "#F0EFEB", border: `1px solid ${pwFocus ? "#1A1814" : "#DDDCD9"}`, borderRadius: 4, fontFamily: "inherit", fontSize: 14, color: "#1A1814", outline: "none", transition: "border-color 120ms", boxSizing: "border-box" }}
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
                {loading && <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />}
                Sign in →
              </button>

              <div style={{ marginTop: 18, fontSize: 13, color: "#65605A" }}>
                <Link href="/forgot-password" style={{ color: "#1A1814" }}>Forgot password?</Link>
              </div>
              <div style={{ marginTop: 10, fontSize: 13, color: "#65605A" }}>
                New here?{" "}
                <Link href="/signup" style={{ color: "#1A1814" }}>Create an account</Link>
                {" "}or{" "}
                <Link href="/learn" style={{ color: "#1A1814" }}>continue as guest</Link>
              </div>
            </form>
          </div>
        </div>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A" }}>ASCENT · v1.0</div>
      </div>

      {/* Right: testimonial panel */}
      <div className="hidden md:flex flex-col justify-between" style={{ padding: 56, background: "#1A1814", color: "#F8F7F5" }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "rgba(251,248,242,0.6)", textTransform: "uppercase" }}>
          What you get
        </div>
        <div>
          <p style={{ fontFamily: '"Instrument Serif", serif', fontSize: 42, lineHeight: 1.1, fontStyle: "italic", margin: 0, color: "#F8F7F5" }}>
            Build AI judgment. One decision at a time.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
