"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/AppShell"
import { Loader2, Check } from "lucide-react"

const C = {
  bg:    "#F0EFEB",
  panel: "#F8F7F5",
  ink:   "#1A1814",
  sub:   "#65605A",
  line:  "#DDDCD9",
  green: "#2A6B4A",
}

const ROLES = [
  { value: "PM", label: "Product Manager" },
  { value: "EM", label: "Engineering Manager" },
  { value: "IC", label: "Individual Contributor" },
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
  { value: "keeping-up",             label: "Keeping up with the pace of AI change" },
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

const SCORE_LABELS: Record<string, string> = {
  conceptualScore: "Conceptual",
  vendorScore:     "Vendor evaluation",
  workflowScore:   "Workflow design",
  executionScore:  "Execution",
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
    padding: "9px 14px",
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

function ScoreBar({ score }: { score: number }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          style={{
            width: 28, height: 6, borderRadius: 2,
            background: n <= score ? C.ink : C.line,
            transition: "background 200ms",
          }}
        />
      ))}
    </div>
  )
}

interface ProfileData {
  role: string
  aiFamiliarity: string
  biggestChallenge: string
  goals: string[]
  conceptualScore: number
  vendorScore: number
  workflowScore: number
  executionScore: number
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [form, setForm] = useState({
    role: "",
    aiFamiliarity: "",
    biggestChallenge: "",
    goals: [] as string[],
  })
  const [scores, setScores] = useState({ conceptualScore: 0, vendorScore: 0, workflowScore: 0, executionScore: 0 })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }
    if (status !== "authenticated") return

    fetch("/api/profile")
      .then((r) => r.json())
      .then(({ user, profile }) => {
        setUserName(user?.name ?? "")
        setUserEmail(user?.email ?? "")
        if (profile) {
          setProfileData(profile)
          setForm({
            role: profile.role,
            aiFamiliarity: profile.aiFamiliarity,
            biggestChallenge: profile.biggestChallenge,
            goals: profile.goals,
          })
          setScores({
            conceptualScore: profile.conceptualScore,
            vendorScore: profile.vendorScore,
            workflowScore: profile.workflowScore,
            executionScore: profile.executionScore,
          })
        }
        setLoading(false)
      })
  }, [status, router])

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    setSaved(false)
  }

  function toggleGoal(value: string) {
    setForm((f) => ({
      ...f,
      goals: f.goals.includes(value)
        ? f.goals.filter((g) => g !== value)
        : [...f.goals, value],
    }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        setError("Failed to save changes.")
        setSaving(false)
        return
      }
      const updated = await res.json()
      setScores({
        conceptualScore: updated.conceptualScore,
        vendorScore:     updated.vendorScore,
        workflowScore:   updated.workflowScore,
        executionScore:  updated.executionScore,
      })
      setSaved(true)
    } catch {
      setError("Failed to save changes.")
    } finally {
      setSaving(false)
    }
  }

  const canSave = !!form.role && !!form.aiFamiliarity && !!form.biggestChallenge && form.goals.length > 0

  if (status === "loading" || loading) {
    return (
      <AppShell>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
          <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite", color: C.sub }} />
        </div>
      </AppShell>
    )
  }

  if (!profileData) {
    return (
      <AppShell>
        <p style={{ color: C.sub }}>No profile found. Complete onboarding first.</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 600 }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.sub, display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ width: 16, height: 1, background: C.sub, display: "inline-block" }} />
            Profile
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 500, color: C.ink }}>{userName || "Your profile"}</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: C.sub }}>{userEmail}</p>
        </div>

        {/* Readiness scores */}
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ ...fieldLabel, marginBottom: 16 }}>Decision Readiness Profile</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {Object.entries(SCORE_LABELS).map(([key, label]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <span style={{ fontSize: 13.5, color: C.ink, minWidth: 150 }}>{label}</span>
                <ScoreBar score={scores[key as keyof typeof scores]} />
              </div>
            ))}
          </div>
          <p style={{ margin: "14px 0 0", fontSize: 12, color: C.sub, lineHeight: 1.5 }}>
            Scores update automatically when you save changes.
          </p>
        </div>

        {/* Edit form */}
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "24px 24px 20px" }}>
          <div style={{ ...fieldLabel, marginBottom: 20 }}>Edit profile</div>

          {/* Role */}
          <div style={{ marginBottom: 22 }}>
            <div style={fieldLabel}>Role</div>
            <div style={{ display: "flex", gap: 8 }}>
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => update("role", r.value)}
                  style={{
                    flex: 1, padding: "9px 12px",
                    border: `1px solid ${form.role === r.value ? C.ink : C.line}`,
                    background: form.role === r.value ? C.bg : "transparent",
                    borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
                    fontSize: 13, color: C.ink, fontWeight: form.role === r.value ? 500 : 400,
                    transition: "border-color 120ms",
                  }}
                >
                  {r.value}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 6 }}>
              {ROLES.find((r) => r.value === form.role)?.label}
            </div>
          </div>

          {/* AI familiarity */}
          <div style={{ marginBottom: 22 }}>
            <div style={fieldLabel}>AI familiarity</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {AI_FAMILIARITY.map((f) => (
                <button key={f.value} onClick={() => update("aiFamiliarity", f.value)} style={{ ...optionButton(form.aiFamiliarity === f.value), padding: "10px 14px" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: C.ink }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 1 }}>{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Biggest challenge */}
          <div style={{ marginBottom: 22 }}>
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
          <div style={{ marginBottom: 24 }}>
            <div style={fieldLabel}>Goals</div>
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

          {/* Save */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 18px",
                background: C.ink, color: C.panel,
                borderRadius: 4, fontSize: 13.5, fontWeight: 500, border: "none",
                cursor: canSave && !saving ? "pointer" : "not-allowed",
                opacity: canSave && !saving ? 1 : 0.4,
                fontFamily: "inherit", transition: "opacity 120ms",
              }}
            >
              {saving
                ? <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                : saved
                  ? <Check style={{ width: 14, height: 14 }} />
                  : null
              }
              {saving ? "Saving…" : saved ? "Saved" : "Save changes"}
            </button>
            {error && <span style={{ fontSize: 13, color: "#B94A3A" }}>{error}</span>}
          </div>
        </div>

      </div>
    </AppShell>
  )
}
