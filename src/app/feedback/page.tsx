"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"

function AscentMark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={18} height={18} viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M2 18 L8 7 L11 12 L14 4 L20 18 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
        <line x1="2" y1="18.6" x2="20" y2="18.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: 20, lineHeight: 1, letterSpacing: "-0.01em" }}>
        Ascent
      </span>
    </div>
  )
}

const PAINS = [
  "Scenarios feel too long",
  "Feedback isn't specific enough",
  "Hard to tell which module to read next",
  "I don't know if I'm 'getting' it",
  "Content too basic for my role",
  "Content too advanced for my role",
  "Missions don't fit my actual job",
  "Onboarding felt too long / asked too much",
  "Onboarding didn't give me enough context",
  "Hard to build a habit around it",
  "Mobile experience is rough",
]

const SURFACES = ["Dashboard", "A specific module", "A specific scenario", "A mission", "Onboarding", "The whole thing", "Something else"]

const MOOD_OPTIONS = [
  { v: "great",  l: "Great",        d: "I'd recommend it." },
  { v: "ok",     l: "Decent",       d: "Useful, but rough edges." },
  { v: "stuck",  l: "I'm stuck",    d: "I want it to work, but…" },
  { v: "off",    l: "Not for me",   d: "Wrong shape for what I need." },
]

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#65605A", marginBottom: 18 }}>
      <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
      {children}
    </div>
  )
}

function Section({ title, sub, children, id }: { title: string; sub?: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} style={{ paddingTop: 24, marginTop: 24, borderTop: "1px solid #DDDCD9" }}>
      <h2 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: 26, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#1A1814", fontWeight: 400 }}>{title}</h2>
      {sub && <p style={{ margin: "6px 0 18px", fontSize: 13.5, color: "#65605A" }}>{sub}</p>}
      {!sub && <div style={{ height: 18 }} />}
      {children}
    </section>
  )
}

type FormData = {
  mood: string
  pains: string[]
  surface: string
  stuck: string
  missing: string
  nps: number | null
  contact: boolean
  email: string
}

export default function FeedbackPage() {
  const { data: session } = useSession()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState<FormData>({
    mood: "", pains: [], surface: "", stuck: "", missing: "", nps: null, contact: false, email: "",
  })

  const sessionEmailApplied = useRef(false)
  const sessionEmail = session?.user?.email
  useEffect(() => {
    if (sessionEmail && !sessionEmailApplied.current) {
      sessionEmailApplied.current = true
      setData(d => ({ ...d, email: d.email || sessionEmail, contact: true }))
    }
  }, [sessionEmail])

  async function handleSubmit() {
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood: data.mood || undefined,
          pains: data.pains.length ? data.pains : undefined,
          surface: data.surface || undefined,
          stuck: data.stuck || undefined,
          missing: data.missing || undefined,
          nps: data.nps ?? undefined,
          email: data.contact && data.email ? data.email : undefined,
        }),
      })
      if (res.ok) setSubmitted(true)
      else setError("Something went wrong. Please try again.")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function togglePain(p: string) {
    setData((d) => ({ ...d, pains: d.pains.includes(p) ? d.pains.filter((x) => x !== p) : [...d.pains, p] }))
  }

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    background: "#F0EFEB",
    border: "1px solid #DDDCD9",
    borderRadius: 4,
    fontFamily: "inherit",
    fontSize: 14,
    color: "#1A1814",
    outline: "none",
    resize: "vertical" as const,
    lineHeight: 1.55,
    boxSizing: "border-box" as const,
  }

  const answeredCount = [data.mood && "mood", data.pains.length && "pains", data.surface && "surface", data.stuck && "stuck", data.missing && "missing", data.nps !== null && "score"].filter(Boolean).length

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="px-4 sm:px-14 border-b border-border flex items-center" style={{ height: 52 }}>
          <Link href="/" style={{ color: "#1A1814", textDecoration: "none" }}>
            <AscentMark />
          </Link>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8 md:px-14 md:py-14 w-full">
        <div style={{ borderBottom: "1px solid #DDDCD9", paddingBottom: 36, marginBottom: 36 }}>
          <Kicker>Feedback</Kicker>
          <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: "clamp(36px, 8vw, 56px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#1A1814", fontWeight: 400 }}>
            Got it. Thank you.
          </h1>
        </div>
        <div style={{ padding: 32, border: "1px solid #DDDCD9", background: "#F8F7F5", maxWidth: 720 }}>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: "#1A1814" }}>
            Every piece of feedback gets read by a human within a week. {data.contact && data.email && (
              <>If you opted in, we&apos;ll reach out at <strong>{data.email}</strong> when we ship something related to what you flagged — not a newsletter, just the change.</>
            )}
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            <Link href="/learn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: "#1A1814", color: "#F8F7F5", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>
              Back to learning
            </Link>
            <button
              onClick={() => { setSubmitted(false); setData({ mood: "", pains: [], surface: "", stuck: "", missing: "", nps: null, contact: false, email: "" }) }}
              style={{ background: "transparent", border: "none", fontSize: 13.5, color: "#65605A", cursor: "pointer", padding: "11px 4px" }}
            >
              Send another →
            </button>
          </div>
        </div>
        <div style={{ marginTop: 48, padding: 24, border: "1px dashed #DDDCD9", maxWidth: 720, fontSize: 13.5, color: "#65605A", lineHeight: 1.6 }}>
          <strong style={{ color: "#1A1814" }}>What we do with this.</strong> Pain-point counts go on a board ranked by frequency. Free-text answers get tagged and re-surfaced when we plan the next sprint. We don&apos;t share contact emails with anyone.
        </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="px-4 sm:px-14 border-b border-border flex items-center" style={{ height: 52 }}>
        <Link href="/" style={{ color: "#1A1814", textDecoration: "none" }}>
          <AscentMark />
        </Link>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 md:px-14 md:py-14 w-full">
      {/* Page header */}
      <div style={{ borderBottom: "1px solid #DDDCD9", paddingBottom: 36, marginBottom: 36 }}>
        <Kicker>Feedback</Kicker>
        <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: "clamp(36px, 8vw, 56px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: "#1A1814", fontWeight: 400 }}>
          Tell us how we are doing.
        </h1>
        <p style={{ marginTop: 24, marginBottom: 0, maxWidth: 640, fontSize: 16, lineHeight: 1.6, color: "#65605A" }}>
          Your honest feedback helps us build a better product.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[7fr_5fr]" style={{ gap: 40, alignItems: "start" }}>
        {/* Left: form */}
        <div>
          {/* Mood */}
          <Section title="01 — How is it going so far?">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {MOOD_OPTIONS.map((o) => {
                const sel = data.mood === o.v
                return (
                  <button
                    key={o.v}
                    onClick={() => setData({ ...data, mood: o.v })}
                    style={{ flex: "1 1 200px", textAlign: "left", padding: "16px 18px", border: `1px solid ${sel ? "#1A1814" : "#DDDCD9"}`, background: sel ? "#F8F7F5" : "#F0EFEB", fontFamily: "inherit", cursor: "pointer", borderRadius: 4 }}
                  >
                    <div style={{ fontSize: 15, color: "#1A1814", fontWeight: sel ? 500 : 400 }}>{o.l}</div>
                    <div style={{ fontSize: 12.5, color: "#65605A", marginTop: 4 }}>{o.d}</div>
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Pain points */}
          <Section title="02 — What's been getting in the way?" sub="Pick all that apply.">
            <div className="grid sm:grid-cols-2" style={{ gap: 8 }}>
              {PAINS.map((p) => {
                const sel = data.pains.includes(p)
                return (
                  <button
                    key={p}
                    onClick={() => togglePain(p)}
                    style={{ display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "12px 14px", border: `1px solid ${sel ? "#1A1814" : "#DDDCD9"}`, background: sel ? "#E8E6E1" : "transparent", fontFamily: "inherit", cursor: "pointer", borderRadius: 4, fontSize: 13.5, color: "#1A1814", lineHeight: 1.4 }}
                  >
                    <span style={{ width: 14, height: 14, flexShrink: 0, border: `1px solid #1A1814`, borderRadius: 3, background: sel ? "#1A1814" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "#F8F7F5", fontSize: 10 }}>
                      {sel && "✓"}
                    </span>
                    {p}
                  </button>
                )
              })}
            </div>
            <div style={{ marginTop: 14 }}>
              <a href="#q04" style={{ fontSize: 13, color: "#65605A", textDecoration: "none", borderBottom: "1px solid #DDDCD9" }}>
                Nothing blocked me — I just want to leave a note →
              </a>
            </div>
          </Section>

          {/* Surface */}
          <Section title="03 — Where, specifically?">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SURFACES.map((s) => {
                const sel = data.surface === s
                return (
                  <button
                    key={s}
                    onClick={() => setData({ ...data, surface: sel ? "" : s })}
                    style={{ fontFamily: "inherit", fontSize: 13.5, padding: "8px 14px", borderRadius: 999, border: `1px solid ${sel ? "#1A1814" : "#DDDCD9"}`, background: sel ? "#1A1814" : "transparent", color: sel ? "#F8F7F5" : "#1A1814", cursor: "pointer" }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Stuck */}
          <Section id="q04" title="04 — Where are you stuck?" sub="One sentence is fine. A paragraph is welcome.">
            <textarea
              rows={5}
              placeholder="e.g. I started the vendor pitch scenario, wrote a half-answer, and then realized I didn't actually know what 'pilot' should mean."
              value={data.stuck}
              onChange={(e) => setData({ ...data, stuck: e.target.value })}
              style={inputStyle}
            />
          </Section>

          {/* Missing */}
          <Section title="05 — What's missing?" sub="A scenario you wish existed. A topic we don't cover.">
            <textarea
              rows={4}
              placeholder="e.g. A scenario on building an internal AI evals team from scratch."
              value={data.missing}
              onChange={(e) => setData({ ...data, missing: e.target.value })}
              style={inputStyle}
            />
          </Section>

          {/* NPS */}
          <Section title="06 — How likely are you to recommend Ascent to a peer?" sub="0 = no chance, 10 = already have.">
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {Array.from({ length: 11 }).map((_, n) => {
                const sel = data.nps === n
                return (
                  <button
                    key={n}
                    onClick={() => setData({ ...data, nps: n })}
                    style={{ width: 44, height: 44, fontFamily: '"JetBrains Mono", monospace', fontSize: 14, border: `1px solid ${sel ? "#1A1814" : "#DDDCD9"}`, background: sel ? "#1A1814" : "transparent", color: sel ? "#F8F7F5" : "#1A1814", cursor: "pointer", borderRadius: 4 }}
                  >
                    {n}
                  </button>
                )
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#65605A" }}>
              <span>NOT AT ALL</span>
              <span>EXTREMELY</span>
            </div>
          </Section>

          {/* Contact */}
          <Section title="07 — Want us to reach out?" sub={sessionEmail ? "Pre-filled from your account. Uncheck if you'd prefer to stay anonymous." : "Optional. Only if you'd like to hear back when we ship something tied to this or if we have followup questions."}>
            <label style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "1px solid #DDDCD9", borderRadius: 4, cursor: "pointer", marginBottom: 14 }}>
              <input
                type="checkbox"
                checked={data.contact}
                onChange={(e) => setData({ ...data, contact: e.target.checked })}
              />
              <span style={{ fontSize: 14, color: "#1A1814" }}>Yes, you can email me.</span>
            </label>
            {data.contact && (
              <input
                type="email"
                placeholder="you@work.com"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
                style={{ ...inputStyle, resize: undefined }}
              />
            )}
          </Section>

          {/* Submit */}
          {error && (
            <div style={{ marginTop: 16, padding: "12px 14px", background: "#F8F7F5", border: "1px solid #DDDCD9", borderRadius: 4, fontSize: 13.5, color: "#65605A" }}>
              {error}
            </div>
          )}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #DDDCD9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#65605A" }}>
              {answeredCount} / 6 SECTIONS ANSWERED
            </div>
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0 || submitting}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: answeredCount === 0 ? "#8A857E" : "#1A1814", color: "#F8F7F5", borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "none", cursor: answeredCount === 0 || submitting ? "not-allowed" : "pointer", opacity: answeredCount === 0 || submitting ? 0.45 : 1 }}
            >
              {submitting ? "Sending…" : "Send feedback →"}
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <aside style={{ position: "sticky", top: 32 }}>
          <div style={{ padding: 24, border: "1px solid #DDDCD9", background: "#F8F7F5", marginBottom: 18 }}>
            <Kicker>Why we ask</Kicker>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "#65605A" }}>
             Your feedback helps us decide what to improve first. If something is frustrating or slowing you down, there&apos;s a good chance others are feeling it too — and we can&apos;t fix what we don’t know about.
            </p>
          </div>
        </aside>
      </div>
      </main>
    </div>
  )
}
