"use client"

import { useState } from "react"
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
  { id: "role", label: "Your role" },
  { id: "context", label: "Context" },
  { id: "ai", label: "AI experience" },
  { id: "goals", label: "Goals" },
]

const ROLES = [
  { value: "PM", label: "Product Manager", desc: "Own product decisions and roadmap" },
  { value: "EM", label: "Engineering Manager", desc: "Lead engineering teams and delivery" },
  { value: "IC", label: "Individual Contributor", desc: "Apply AI tools in your day-to-day work" },
]

const COMPANY_STAGES = [
  "Seed / Early stage",
  "Series A–B",
  "Series C+",
  "Public company",
  "Enterprise (1000+)",
]

const INDUSTRIES = [
  "SaaS / B2B Software",
  "Consumer Tech",
  "Fintech",
  "Healthcare / Medtech",
  "E-commerce / Retail",
  "Enterprise Software",
  "Other",
]

const AI_FAMILIARITY = [
  { value: "NONE",     label: "None",     desc: "I've heard the terms but haven't used it" },
  { value: "BASIC",    label: "Basic",    desc: "I use ChatGPT/Claude for personal tasks" },
  { value: "MODERATE", label: "Moderate", desc: "I've been involved in AI product work" },
  { value: "ADVANCED", label: "Advanced", desc: "I regularly make AI architectural decisions" },
]

const CHALLENGES = [
  { value: "understanding-ai",       label: "Understanding what AI can actually do" },
  { value: "evaluating-tools",       label: "Evaluating and selecting AI tools" },
  { value: "implementing-workflows", label: "Integrating AI into team workflows" },
  { value: "leading-ai-initiatives", label: "Leading AI initiatives at work" },
  { value: "measuring-roi",          label: "Measuring AI ROI and impact" },
  { value: "team-adoption",          label: "Getting team buy-in and adoption" },
  { value: "applying-ai-daily",      label: "Using AI effectively in my own daily work" },
  { value: "keeping-up",             label: "Keeping up with AI developments relevant to me" },
]

const GOALS = [
  { value: "make-better-decisions",  label: "Make better AI-related decisions" },
  { value: "evaluate-vendors",       label: "Evaluate AI vendors and tools effectively" },
  { value: "implement-ai",           label: "Successfully implement AI on my team" },
  { value: "lead-initiative",        label: "Lead a company-wide AI initiative" },
  { value: "build-roadmap",          label: "Build an AI-informed product roadmap" },
  { value: "understand-fundamentals",label: "Understand AI/ML fundamentals" },
  { value: "boost-productivity",     label: "Use AI to be more productive in my work" },
  { value: "informed-contributor",   label: "Have informed opinions about AI at my company" },
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

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    role: "",
    companyStage: "",
    industry: "",
    aiFamiliarity: "",
    biggestChallenge: "",
    goals: [] as string[],
  })

  function update(key: string, value: string | string[]) {
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
    if (step === 1) return !!form.companyStage && !!form.industry
    if (step === 2) return !!form.aiFamiliarity && !!form.biggestChallenge
    if (step === 3) return form.goals.length > 0
    return true
  }

  async function handleFinish() {
    setLoading(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        console.error("Onboarding API error:", res.status)
        setLoading(false)
        return
      }
      router.push("/dashboard")
    } catch {
      setLoading(false)
    }
  }

  const isLast = step === STEPS.length - 1

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <AscentMark />
        </div>

        {/* Step progress */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
              <div style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: i <= step ? C.ink : "transparent",
                border: `1px solid ${i <= step ? C.ink : C.line}`,
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: i <= step ? C.panel : C.sub,
                flexShrink: 0,
                transition: "background 120ms, border-color 120ms",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ height: 1, flex: 1, background: i < step ? C.ink : C.line, transition: "background 120ms" }} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 4, padding: 32 }}>

          {/* Step 0: Role */}
          {step === 0 && (
            <div>
              <div style={kicker}>
                <span style={{ width: 16, height: 1, background: C.sub, display: "inline-block" }} />
                Step 1 of 4
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, color: C.ink }}>What&apos;s your role?</h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, lineHeight: 1.6, color: C.sub }}>
                Ascent tailors content and simulations to your specific challenges.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ROLES.map((r) => (
                  <button key={r.value} onClick={() => update("role", r.value)} style={{ ...optionButton(form.role === r.value), padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{r.label}</div>
                    <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Context */}
          {step === 1 && (
            <div>
              <div style={kicker}>
                <span style={{ width: 16, height: 1, background: C.sub, display: "inline-block" }} />
                Step 2 of 4
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, color: C.ink }}>About your company</h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, lineHeight: 1.6, color: C.sub }}>
                This helps us recommend the most relevant scenarios.
              </p>

              <div style={{ marginBottom: 20 }}>
                <div style={fieldLabel}>Company stage</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {COMPANY_STAGES.map((s) => (
                    <button key={s} onClick={() => update("companyStage", s)} style={optionButton(form.companyStage === s)}>{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={fieldLabel}>Industry</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {INDUSTRIES.map((ind) => (
                    <button key={ind} onClick={() => update("industry", ind)} style={{ ...optionButton(form.industry === ind), fontSize: 12.5 }}>{ind}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: AI Experience */}
          {step === 2 && (
            <div>
              <div style={kicker}>
                <span style={{ width: 16, height: 1, background: C.sub, display: "inline-block" }} />
                Step 3 of 4
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, color: C.ink }}>Your AI experience</h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, lineHeight: 1.6, color: C.sub }}>
                Honest answers lead to better recommendations.
              </p>

              <div style={{ marginBottom: 20 }}>
                <div style={fieldLabel}>AI familiarity</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {AI_FAMILIARITY.map((f) => (
                    <button key={f.value} onClick={() => update("aiFamiliarity", f.value)} style={{ ...optionButton(form.aiFamiliarity === f.value), padding: "12px 16px" }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{f.label}</div>
                      <div style={{ fontSize: 12.5, color: C.sub, marginTop: 2 }}>{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={fieldLabel}>Biggest AI challenge</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {CHALLENGES.map((c) => (
                    <button key={c.value} onClick={() => update("biggestChallenge", c.value)} style={optionButton(form.biggestChallenge === c.value)}>{c.label}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div>
              <div style={kicker}>
                <span style={{ width: 16, height: 1, background: C.sub, display: "inline-block" }} />
                Step 4 of 4
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, color: C.ink }}>What do you want to achieve?</h2>
              <p style={{ margin: "0 0 24px", fontSize: 14, lineHeight: 1.6, color: C.sub }}>
                Select all that apply.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {GOALS.map((g) => {
                  const selected = form.goals.includes(g.value)
                  return (
                    <button
                      key={g.value}
                      onClick={() => toggleGoal(g.value)}
                      style={{ ...optionButton(selected), display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div style={{
                        width: 14,
                        height: 14,
                        border: `1.5px solid ${selected ? C.ink : C.line}`,
                        background: selected ? C.ink : "transparent",
                        borderRadius: 2,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 120ms",
                      }}>
                        {selected && (
                          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                            <path d="M2 5l2.5 2.5L8 3" stroke={C.panel} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      {g.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13.5,
              color: C.sub,
              background: "transparent",
              border: "none",
              cursor: step === 0 ? "default" : "pointer",
              fontFamily: "inherit",
              opacity: step === 0 ? 0 : 1,
              transition: "opacity 120ms",
              padding: 0,
            }}
          >
            ← Back
          </button>

          {!isLast ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 18px",
                background: C.ink,
                color: C.panel,
                borderRadius: 4,
                fontSize: 13.5,
                fontWeight: 500,
                border: "none",
                cursor: canAdvance() ? "pointer" : "not-allowed",
                opacity: canAdvance() ? 1 : 0.4,
                fontFamily: "inherit",
                transition: "opacity 120ms",
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canAdvance() || loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 18px",
                background: C.ink,
                color: C.panel,
                borderRadius: 4,
                fontSize: 13.5,
                fontWeight: 500,
                border: "none",
                cursor: canAdvance() && !loading ? "pointer" : "not-allowed",
                opacity: canAdvance() && !loading ? 1 : 0.4,
                fontFamily: "inherit",
                transition: "opacity 120ms",
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
