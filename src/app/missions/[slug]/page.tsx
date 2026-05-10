"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppShell } from "@/components/layout/AppShell"
import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import { isMissionFree } from "@/config/access"
import { C } from "@/lib/colors"
import { MonoLabel, Panel, BulletList } from "@/components/detail-layout"

type MissionData = { id: string; slug: string; title: string; description: string; instructions: string; roles: string[]; difficulty: string; staticGuidance: string; checklist: string[] }
type MissionFeedback = { assessment: string; highlights: string[]; suggestions: string[]; nextSteps: string[] }
type ChecklistScore = "yes" | "partial" | "no"
type SelfAssessment = "missed" | "partial" | "covered"

const SELF_ASSESSMENT_OPTIONS: { value: SelfAssessment; label: string }[] = [
  { value: "missed", label: "Missed the mark" },
  { value: "partial", label: "Partial" },
  { value: "covered", label: "Covered it well" },
]

export default function MissionPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { data: session, status } = useSession()

  const [mission, setMission] = useState<MissionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<MissionFeedback | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [phase, setPhase] = useState<"instructions" | "write" | "feedback">("instructions")
  const [checklistScores, setChecklistScores] = useState<Record<number, ChecklistScore>>({})
  const [selfAssessment, setSelfAssessment] = useState<SelfAssessment | null>(null)
  const [savingAssessment, setSavingAssessment] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session && !isMissionFree(slug)) {
      router.replace(`/login?callbackUrl=/missions/${slug}`)
      return
    }
    async function load() {
      const res = await fetch(`/api/missions/${slug}`)
      if (res.ok) setMission(await res.json())
      setLoading(false)
    }
    load()
  }, [slug, session, status, router])

  async function handleSubmit() {
    if (!mission || response.trim().length < 100) return
    setSubmitting(true)
    setSubmitError(null)
    const res = await fetch(`/api/missions/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ response }),
    })
    if (res.ok) { setFeedback((await res.json()).feedback); setPhase("feedback") }
    else setSubmitError("Submission failed. Please try again.")
    setSubmitting(false)
  }

  function setChecklistScore(idx: number, score: ChecklistScore) {
    setChecklistScores((prev) => ({ ...prev, [idx]: score }))
  }

  async function handleSelfAssessment(value: SelfAssessment) {
    setSelfAssessment(value)
    if (!session) return
    setSavingAssessment(true)
    await fetch(`/api/missions/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selfAssessment: value }),
    })
    setSavingAssessment(false)
  }

  const scoreColor = (score: ChecklistScore | undefined) =>
    score === "yes" ? C.good : score === "partial" ? C.sub : score === "no" ? C.warn : C.sub

  if (loading) return (
    <AppShell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <Loader2 style={{ width: 18, height: 18, color: C.sub }} className="animate-spin" />
      </div>
    </AppShell>
  )

  if (!mission) return (
    <AppShell>
      <button onClick={() => router.push("/missions")} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer", marginBottom: 32 }}>
        ← Missions
      </button>
      <p style={{ color: C.sub, fontSize: 14 }}>Mission not found.</p>
    </AppShell>
  )

  return (
    <AppShell>
      {/* Back */}
      <button onClick={() => router.push("/missions")} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer", marginBottom: 36 }}>
        ← Missions
      </button>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 28, marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.12em", color: C.sub, flexWrap: "wrap" as const }}>
          {mission.roles.map((r) => (
            <span key={r} style={{ padding: "3px 8px", border: `1px solid ${C.line}`, borderRadius: 999 }}>{r}</span>
          ))}
          <span style={{ color: C.line }}>·</span>
          <span style={{ textTransform: "uppercase" }}>{mission.difficulty}</span>
        </div>
        <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: "clamp(32px, 3.8vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, fontWeight: 400 }}>
          {mission.title}
        </h1>
        <p style={{ marginTop: 12, marginBottom: 0, fontSize: 15, lineHeight: 1.6, color: C.sub }}>{mission.description}</p>
      </div>

      <div style={{ maxWidth: 720 }}>

        {/* ── Instructions phase ────────────────────────────── */}
        {phase === "instructions" && (
          <div>
            <div className="prose-ascent" style={{ marginBottom: 28 }}>
              <ReactMarkdown>{mission.instructions}</ReactMarkdown>
            </div>

            <Panel style={{ marginBottom: 28 }}>
              <MonoLabel>Your submission should cover</MonoLabel>
              <BulletList items={mission.checklist} />
            </Panel>

            {!session && (
              <div style={{ padding: "10px 14px", border: `1px dashed ${C.line}`, marginBottom: 16, fontSize: 13, color: C.sub, lineHeight: 1.5 }}>
                You&apos;re not signed in — your submission won&apos;t be saved.{" "}
                <Link href="/signup" style={{ color: C.ink, textDecoration: "underline" }}>Create a free account</Link>{" "}
                to track your progress.
              </div>
            )}

            <button
              onClick={() => setPhase("write")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.ink, color: "#F8F7F5", border: "none", borderRadius: 4, fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
            >
              Start writing →
            </button>
          </div>
        )}

        {/* ── Writing phase ─────────────────────────────────── */}
        {phase === "write" && (
          <div>
            <div style={{ padding: "14px 18px", border: `1px dashed ${C.line}`, marginBottom: 20, fontSize: 13, color: C.sub, lineHeight: 1.6 }}>
              <MonoLabel>Checklist</MonoLabel>
              <BulletList items={mission.checklist} color={C.sub} />
            </div>

            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Write your mission submission here..."
              rows={18}
              style={{ width: "100%", padding: "14px 16px", background: C.bg, border: `1px solid ${C.line}`, fontSize: 14, lineHeight: 1.65, color: C.ink, fontFamily: "inherit", resize: "vertical" as const, outline: "none", boxSizing: "border-box" as const, transition: "border-color 120ms" }}
              onFocus={(e) => (e.target.style.borderColor = C.ink)}
              onBlur={(e) => (e.target.style.borderColor = C.line)}
            />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.06em", color: C.sub }}>
                  {response.length < 100 ? `${100 - response.length} more chars to submit` : `${response.length} chars`}
                </span>
                <button
                  onClick={() => setPhase("instructions")}
                  style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer" }}
                >
                  ← Instructions
                </button>
              </div>

              <div>
                <button
                  onClick={handleSubmit}
                  disabled={response.trim().length < 100 || submitting}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.ink, color: "#F8F7F5", border: "none", borderRadius: 4, fontSize: 13.5, fontWeight: 500, cursor: response.trim().length >= 100 && !submitting ? "pointer" : "not-allowed", opacity: response.trim().length >= 100 && !submitting ? 1 : 0.4, fontFamily: "inherit" }}
                >
                  {submitting && <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" />}
                  {submitting ? "Submitting..." : "Submit →"}
                </button>
                {submitError && <p style={{ marginTop: 8, fontSize: 13, color: C.warn }}>{submitError}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Feedback phase ────────────────────────────────── */}
        {phase === "feedback" && feedback && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: C.good }}>
                ✓ MISSION COMPLETE{session ? " — +40 PTS" : ""}
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", color: C.sub, marginTop: 4 }}>
                EXPERT PERSPECTIVE — WHAT STRONG SUBMISSIONS ADDRESS
              </div>
            </div>

            <Panel style={{ marginBottom: 12 }}>
              <MonoLabel>What a strong submission covers</MonoLabel>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: C.ink }}>{feedback.assessment}</p>
            </Panel>

            {feedback.highlights.length > 0 && (
              <Panel style={{ marginBottom: 12 }}>
                <MonoLabel color={C.good}>What strong submissions do</MonoLabel>
                <BulletList items={feedback.highlights} color={C.good} />
              </Panel>
            )}

            {feedback.suggestions.length > 0 && (
              <Panel style={{ marginBottom: 12 }}>
                <MonoLabel color={C.warn}>Where submissions often fall short</MonoLabel>
                <BulletList items={feedback.suggestions} color={C.warn} />
              </Panel>
            )}

            {/* Self-scoring checklist */}
            {mission.checklist.length > 0 && (
              <Panel style={{ marginBottom: 12 }}>
                <MonoLabel>Score your submission against the checklist</MonoLabel>
                <div style={{ fontSize: 12.5, color: C.sub, marginBottom: 14, lineHeight: 1.5 }}>
                  Review your submission above. For each item, mark honestly.
                </div>
                {mission.checklist.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 14, paddingTop: 12, marginTop: idx === 0 ? 0 : 0, borderTop: idx > 0 ? `1px dashed ${C.line}` : "none" }}>
                    <div style={{ flex: 1, fontSize: 13.5, lineHeight: 1.55, color: C.ink, paddingTop: 2 }}>{item}</div>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                      {(["yes", "partial", "no"] as ChecklistScore[]).map((score) => {
                        const labels = { yes: "Yes", partial: "Partial", no: "No" }
                        const selected = checklistScores[idx] === score
                        const selectedColor = score === "yes" ? C.good : score === "partial" ? C.sub : C.warn
                        return (
                          <button
                            key={score}
                            onClick={() => setChecklistScore(idx, score)}
                            style={{
                              fontFamily: '"JetBrains Mono", monospace',
                              fontSize: 10,
                              letterSpacing: "0.08em",
                              padding: "4px 8px",
                              border: `1px solid ${selected ? selectedColor : C.line}`,
                              borderRadius: 3,
                              background: selected ? selectedColor : "transparent",
                              color: selected ? "#F8F7F5" : C.sub,
                              cursor: "pointer",
                              transition: "all 120ms",
                            }}
                          >
                            {labels[score]}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </Panel>
            )}

            {/* Overall self-assessment */}
            <Panel style={{ marginBottom: 12 }}>
              <MonoLabel>Overall: how well did your submission cover this mission?</MonoLabel>
              {selfAssessment === null ? (
                <div style={{ display: "flex", gap: 8 }}>
                  {SELF_ASSESSMENT_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => handleSelfAssessment(value)}
                      style={{ padding: "9px 14px", border: `1px solid ${C.line}`, borderRadius: 4, fontSize: 13, cursor: "pointer", background: "transparent", fontFamily: "inherit", color: C.ink, transition: "border-color 120ms" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.ink)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.line)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13.5, color: selfAssessment === "covered" ? C.good : selfAssessment === "partial" ? C.ink : C.warn, fontWeight: 500 }}>
                    {selfAssessment === "missed" ? "Missed the mark" : selfAssessment === "partial" ? "Partial" : "Covered it well"}
                  </span>
                  {savingAssessment && (
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: "0.1em", color: C.sub }}>saving...</span>
                  )}
                  <button
                    onClick={() => setSelfAssessment(null)}
                    style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    CHANGE
                  </button>
                </div>
              )}
            </Panel>

            {feedback.nextSteps.length > 0 && (
              <div style={{ padding: "20px 24px", border: `1px dashed ${C.line}`, marginBottom: 12 }}>
                <MonoLabel>Next steps</MonoLabel>
                <BulletList items={feedback.nextSteps} />
              </div>
            )}

            {!session && (
              <Panel style={{ marginBottom: 24 }}>
                <p style={{ margin: 0, fontSize: 14, color: C.sub, lineHeight: 1.6 }}>
                  <span style={{ color: C.ink, fontWeight: 500 }}>Want to save your progress?</span>{" "}
                  <Link href="/signup" style={{ color: C.ink, textDecoration: "underline" }}>Create a free account</Link>{" "}
                  to track your missions and build your readiness profile over time.
                </p>
              </Panel>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => router.push("/missions")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.ink, color: "#F8F7F5", border: "none", borderRadius: 4, fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
              >
                Back to missions
              </button>
              {session && (
                <button onClick={() => router.push("/dashboard")} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer" }}>
                  Dashboard →
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </AppShell>
  )
}
