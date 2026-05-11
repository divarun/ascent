"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const C = {
  bg:    "#F0EFEB",
  panel: "#F8F7F5",
  ink:   "#1A1814",
  sub:   "#65605A",
  line:  "#DDDCD9",
}

const STEPS = [
  { id: "role",  label: "Your role" },
  { id: "setup", label: "Your setup" },
]

const ROLES = [
  { value: "PM", label: "Product Manager",     desc: "Own product decisions and roadmap" },
  { value: "EM", label: "Engineering Manager",  desc: "Lead engineering teams and delivery" },
  { value: "IC", label: "Individual Contributor", desc: "Apply AI tools in your day-to-day work" },
]

const AI_FAMILIARITY = [
  { value: "NONE",     label: "None",     desc: "I've heard the terms but haven't used it" },
  { value: "BASIC",    label: "Basic",    desc: "I use ChatGPT/Claude for personal tasks" },
  { value: "MODERATE", label: "Moderate", desc: "I've been involved in AI product work" },
  { value: "ADVANCED", label: "Advanced", desc: "I regularly make AI architectural decisions" },
]

const CHALLENGES = [
  { value: "understanding-ai",        label: "Understanding what AI can actually do" },
  { value: "evaluating-tools",        label: "Evaluating and selecting AI tools" },
  { value: "implementing-workflows",  label: "Integrating AI into team workflows" },
  { value: "leading-ai-initiatives",  label: "Leading AI initiatives at work" },
  { value: "measuring-roi",           label: "Measuring AI ROI and impact" },
  { value: "team-adoption",           label: "Getting team buy-in and adoption" },
  { value: "applying-ai-daily",       label: "Applying AI tools in my day-to-day work" },
  { value: "keeping-up",              label: "Keeping up with the pace of AI change" },
]

const GOALS = [
  { value: "make-better-decisions",   label: "Make better AI-related decisions" },
  { value: "evaluate-vendors",        label: "Evaluate AI vendors and tools effectively" },
  { value: "implement-ai",            label: "Successfully implement AI on my team" },
  { value: "lead-initiative",         label: "Lead a company-wide AI initiative" },
  { value: "build-roadmap",           label: "Build an AI-informed product roadmap" },
  { value: "understand-fundamentals", label: "Understand AI/ML fundamentals" },
  { value: "boost-productivity",      label: "Use AI to be more productive in my work" },
  { value: "informed-contributor",    label: "Have informed opinions about AI at my company" },
]

function AscentMark() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={22} height={22} viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M2 18 L8 7 L11 12 L14 4 L20 18 Z" stroke={C.ink} strokeWidth="1.4" strokeLinejoin="round" fill="none" />
        <line x1="2" y1="18.6" x2="20" y2="18.6" stroke={C.ink} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, lineHeight: 1, letterSpacing: "-0.01em", color: C.ink }}>
        Ascent
      </span>
    </div>
  )
}

const kicker: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: C.sub,
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 16,
}

const fieldLabel: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 10.5,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: C.sub,
  marginBottom: 10,
}

function optionButton(selected: boolean): React.CSSProperties {
  return {
    width: "100%",
    textAlign: "left",
    padding: "10px 14px",
    border: `1px solid ${selected ? C.ink : C.line}`,
    background: selected ? C.bg : "transparent",
    borderRadius: 4,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13.5,
    color: C.ink,
    transition: "border-color 120ms",
  }
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: 14, height: 14, flexShrink: 0,
      border: `1.5px solid ${checked ? C.ink : C.line}`,
      background: checked ? C.ink : "transparent",
      borderRadius: 2,
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all 120ms",
    }}>
      {checked && (
        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
          <path d="M2 5l2.5 2.5L8 3" stroke={C.panel} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  )
}

function RadioDot({ checked }: { checked: boolean }) {
  return (
    <div style={{
      width: 14, height: 14, flexShrink: 0,
      border: `1.5px solid ${checked ? C.ink : C.line}`,
      background: checked ? C.ink : "transparent",
      borderRadius: 7,
      transition: "all 120ms",
    }} />
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { status } = useSession()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login")
  }, [status, router])
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    role: "",
    aiFamiliarity: "",
    biggestChallenge: "",
    goals: [] as string[],
  })

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleGoal(value: string) {
    setForm((f) => ({
      ...f,
      goals: f.goals.includes(value)
        ? f.goals.filter((g) => g !== value)
        : [...f.goals, value],
    }))
  }

  function canAdvance() {
    if (step === 0) return !!form.role
    if (step === 1) return !!form.aiFamiliarity && !!form.biggestChallenge && form.goals.length > 0
    return true
  }

  async function handleFinish() {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        setError("Something went wrong. Please try again.")
        setLoading(false)
        return
      }
      router.push("/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  const isLast = step === STEPS.length - 1

  if (status === "loading" || status === "unauthenticated") return null

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <AscentMark />
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? C.ink : C.line, transition: "background 200ms" }} />
          ))}
        </div>

        {/* Card */}
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "32px 32px 28px" }}>

          {/* Step 0: Role */}
          {step === 0 && (
            <div>
              <div style={kicker}>
                <span style={{ width: 16, height: 1, background: C.sub, display: "inline-block" }} />
                Step 1 of 2
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, color: C.ink }}>What&rsquo;s your role?</h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, lineHeight: 1.6, color: C.sub }}>
                This personalises your learning path.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ROLES.map((r) => (
                  <button key={r.value} onClick={() => update("role", r.value)} style={{ ...optionButton(form.role === r.value), padding: "12px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{r.label}</div>
                    <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: AI experience + Challenge + Goals */}
          {step === 1 && (
            <div>
              <div style={kicker}>
                <span style={{ width: 16, height: 1, background: C.sub, display: "inline-block" }} />
                Step 2 of 2
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, color: C.ink }}>A few quick questions</h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, lineHeight: 1.6, color: C.sub }}>
                Honest answers lead to better recommendations.
              </p>

              {/* AI familiarity */}
              <div style={{ marginBottom: 24 }}>
                <div style={fieldLabel}>AI familiarity</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {AI_FAMILIARITY.map((f) => (
                    <button key={f.value} onClick={() => update("aiFamiliarity", f.value)} style={{ ...optionButton(form.aiFamiliarity === f.value), padding: "11px 14px" }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>{f.label}</div>
                      <div style={{ fontSize: 12, color: C.sub, marginTop: 1 }}>{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Biggest challenge */}
              <div style={{ marginBottom: 24 }}>
                <div style={fieldLabel}>Biggest AI challenge</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {CHALLENGES.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => update("biggestChallenge", c.value)}
                      style={{ ...optionButton(form.biggestChallenge === c.value), display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <RadioDot checked={form.biggestChallenge === c.value} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div>
                <div style={fieldLabel}>Goals — select all that apply</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {GOALS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => toggleGoal(g.value)}
                      style={{ ...optionButton(form.goals.includes(g.value)), display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <Checkbox checked={form.goals.includes(g.value)} />
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p style={{ marginTop: 16, marginBottom: 0, fontSize: 13, color: "#B94A3A", textAlign: "center" }}>{error}</p>
        )}

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
          <button
            onClick={() => setStep((s) => s - 1)}
            style={{
              background: "none", border: "none", cursor: step === 0 ? "default" : "pointer",
              fontSize: 13.5, color: C.sub, fontFamily: "inherit",
              opacity: step === 0 ? 0 : 1, transition: "opacity 120ms", padding: 0,
            }}
          >
            ← Back
          </button>

          {!isLast ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "11px 18px", background: C.ink, color: C.panel,
                borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "none",
                cursor: canAdvance() ? "pointer" : "not-allowed",
                opacity: canAdvance() ? 1 : 0.4, fontFamily: "inherit", transition: "opacity 120ms",
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canAdvance() || loading}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "11px 18px", background: C.ink, color: C.panel,
                borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "none",
                cursor: canAdvance() && !loading ? "pointer" : "not-allowed",
                opacity: canAdvance() && !loading ? 1 : 0.4, fontFamily: "inherit", transition: "opacity 120ms",
              }}
            >
              {loading && <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />}
              Build my profile →
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
