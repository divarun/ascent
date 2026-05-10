"use client"

import { useState } from "react"
import { AppShell } from "@/components/layout/AppShell"
import Link from "next/link"

const SURFACES = [
  "Dashboard",
  "Foundation / Learn",
  "Scenarios",
  "Missions",
  "Basics",
  "Onboarding",
  "Sign-up / Login",
  "Feedback form",
  "Something else",
]

const SEVERITY_OPTIONS = [
  { v: "critical", l: "Broken",   d: "I can't continue or lost data." },
  { v: "medium",   l: "Annoying", d: "There's a workaround, but it's bad." },
  { v: "low",      l: "Minor",    d: "Cosmetic or barely noticeable." },
]

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#65605A", marginBottom: 18 }}>
      <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
      {children}
    </div>
  )
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section style={{ paddingTop: 24, marginTop: 24, borderTop: "1px solid #DDDCD9" }}>
      <h2 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: 26, lineHeight: 1.15, letterSpacing: "-0.01em", color: "#1A1814", fontWeight: 400 }}>{title}</h2>
      {sub && <p style={{ margin: "6px 0 18px", fontSize: 13.5, color: "#65605A" }}>{sub}</p>}
      {!sub && <div style={{ height: 18 }} />}
      {children}
    </section>
  )
}

type FormData = {
  title: string
  severity: string
  surface: string
  description: string
  steps: string
  email: string
}

export default function BugReportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState<FormData>({
    title: "",
    severity: "",
    surface: "",
    description: "",
    steps: "",
    email: "",
  })

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
    lineHeight: 1.55,
    boxSizing: "border-box" as const,
  }

  const canSubmit = data.title.trim() && data.severity && data.description.trim()

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/bug-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed")
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <AppShell>
        <div style={{ borderBottom: "1px solid #DDDCD9", paddingBottom: 36, marginBottom: 36 }}>
          <Kicker>Bug Report</Kicker>
          <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: 56, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#1A1814", fontWeight: 400 }}>
            Got it. We&apos;ll look into it.
          </h1>
        </div>
        <div style={{ padding: 32, border: "1px solid #DDDCD9", background: "#F8F7F5", maxWidth: 720 }}>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: "#1A1814" }}>
            Your report has been logged. A human reads every one.{" "}
            {data.email && <>We&apos;ll reach out at <strong>{data.email}</strong> once we have a fix or need more context.</>}
          </p>
          <div style={{ marginTop: 28, display: "flex", gap: 12 }}>
            <Link href="/learn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: "#1A1814", color: "#F8F7F5", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>
              Back to learning
            </Link>
            <button
              onClick={() => { setSubmitted(false); setData({ title: "", severity: "", surface: "", description: "", steps: "", email: "" }) }}
              style={{ background: "transparent", border: "none", fontSize: 13.5, color: "#65605A", cursor: "pointer", padding: "11px 4px" }}
            >
              Report another →
            </button>
          </div>
        </div>
        <div style={{ marginTop: 48, padding: 24, border: "1px dashed #DDDCD9", maxWidth: 720, fontSize: 13.5, color: "#65605A", lineHeight: 1.6 }}>
          <strong style={{ color: "#1A1814" }}>What happens next.</strong> Bug reports are triaged by severity. Broken issues go to the top of the queue. We don&apos;t share your email with anyone outside the team.
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Page header */}
      <div style={{ borderBottom: "1px solid #DDDCD9", paddingBottom: 36, marginBottom: 36 }}>
        <Kicker>Bug Report</Kicker>
        <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: 56, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#1A1814", fontWeight: 400 }}>
          Something broken?
        </h1>
        <p style={{ marginTop: 24, marginBottom: 0, maxWidth: 640, fontSize: 16, lineHeight: 1.6, color: "#65605A" }}>
          Tell us exactly what went wrong. The more specific you are, the faster we can fix it.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, alignItems: "start" }}>
        {/* Left: form */}
        <div>
          {/* Title */}
          <Section title="01 — One-line summary" sub="What broke, in plain terms.">
            <input
              type="text"
              placeholder="e.g. Scenario submit button does nothing on mobile"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              style={{ ...inputStyle, resize: undefined }}
            />
          </Section>

          {/* Severity */}
          <Section title="02 — How bad is it?">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {SEVERITY_OPTIONS.map((o) => {
                const sel = data.severity === o.v
                return (
                  <button
                    key={o.v}
                    onClick={() => setData({ ...data, severity: o.v })}
                    style={{ flex: "1 1 160px", textAlign: "left", padding: "16px 18px", border: `1px solid ${sel ? "#1A1814" : "#DDDCD9"}`, background: sel ? "#F8F7F5" : "#F0EFEB", fontFamily: "inherit", cursor: "pointer", borderRadius: 4 }}
                  >
                    <div style={{ fontSize: 15, color: "#1A1814", fontWeight: sel ? 500 : 400 }}>{o.l}</div>
                    <div style={{ fontSize: 12.5, color: "#65605A", marginTop: 4 }}>{o.d}</div>
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Surface */}
          <Section title="03 — Where did it happen?" sub="Pick the closest match.">
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

          {/* Description */}
          <Section title="04 — What went wrong?" sub="What did you expect to happen vs. what actually happened?">
            <textarea
              rows={5}
              placeholder="e.g. I clicked 'Submit answer' and nothing happened — no error, no confirmation, the response just disappeared."
              value={data.description}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
          </Section>

          {/* Steps */}
          <Section title="05 — How do I reproduce it?" sub="Optional but very helpful. Step by step if you can.">
            <textarea
              rows={4}
              placeholder={"1. Open Scenarios\n2. Start 'Vendor pitch' scenario\n3. Type an answer and click Submit\n4. Page freezes"}
              value={data.steps}
              onChange={(e) => setData({ ...data, steps: e.target.value })}
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
          </Section>

          {/* Email */}
          <Section title="06 — Email for follow-up?" sub="Optional. Only used to ask for more context or share a fix.">
            <input
              type="email"
              placeholder="you@work.com"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              style={{ ...inputStyle, resize: undefined }}
            />
          </Section>

          {/* Submit */}
          {error && (
            <div style={{ marginTop: 16, padding: "12px 14px", background: "#F8F7F5", border: "1px solid #DDDCD9", borderRadius: 4, fontSize: 13.5, color: "#65605A" }}>
              {error}
            </div>
          )}
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #DDDCD9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#65605A" }}>
              {[data.title && "title", data.severity && "severity", data.description && "description"].filter(Boolean).length} / 3 REQUIRED FIELDS
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: !canSubmit || submitting ? "#8A857E" : "#1A1814", color: "#F8F7F5", borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "none", cursor: !canSubmit || submitting ? "not-allowed" : "pointer", opacity: !canSubmit || submitting ? 0.45 : 1 }}
            >
              {submitting ? "Sending…" : "Send report →"}
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <aside style={{ position: "sticky", top: 32 }}>
          <div style={{ padding: 24, border: "1px solid #DDDCD9", background: "#F8F7F5", marginBottom: 18 }}>
            <Kicker>What makes a good report</Kicker>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["Be specific", "\"Submit button does nothing\" beats \"it's broken.\""],
                ["Include steps", "The easier it is to reproduce, the faster we fix it."],
                ["Note the severity", "Broken issues are prioritized immediately."],
              ].map(([title, desc]) => (
                <li key={title as string}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: "#1A1814", marginBottom: 3 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#65605A", lineHeight: 1.55 }}>{desc}</div>
                </li>
              ))}
            </ul>
          </div>
<div style={{ padding: 18, border: "1px dashed #DDDCD9", fontSize: 12.5, color: "#65605A", lineHeight: 1.55 }}>
            Reports are read by a human. Your email, if provided, is never shared outside the team.
          </div>
        </aside>
      </div>
    </AppShell>
  )
}
