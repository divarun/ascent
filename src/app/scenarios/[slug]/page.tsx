"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppShell } from "@/components/layout/AppShell"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { isScenarioFree } from "@/config/access"
import { C } from "@/lib/colors"
import { MonoLabel, Panel, BulletList } from "@/components/detail-layout"

type Prompt = { id: string; question: string; followUp: string | null; modelAnswer?: string }
type ScenarioData = { id: string; slug: string; title: string; summary: string; context: string; roles: string[]; difficulty: string; industry: string | null; prompts: Prompt[] }
type Feedback = { overallAssessment: string; strengths: string[]; blindSpots: string[]; improvements: string[]; followUpQuestion: string; score: number }
type RubricCriterion = { criterion: string; description: string }
type SelfAssessment = "missed" | "partial" | "covered"

const draftKey = (slug: string) => `ascent_scenario_draft_${slug}`

function saveDraft(slug: string, responses: Record<string, string>) {
  try { localStorage.setItem(draftKey(slug), JSON.stringify(responses)) } catch {}
}
function loadDraft(slug: string): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(draftKey(slug)) ?? "{}") } catch { return {} }
}
function clearDraft(slug: string) {
  try { localStorage.removeItem(draftKey(slug)) } catch {}
}

const SELF_ASSESSMENT_OPTIONS: { value: SelfAssessment; label: string }[] = [
  { value: "missed", label: "Missed the mark" },
  { value: "partial", label: "Partial" },
  { value: "covered", label: "Covered it well" },
]

export default function ScenarioPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { data: session, status } = useSession()

  const [scenario, setScenario] = useState<ScenarioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState<"context" | "prompts" | "feedback">("context")
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [hasDraft, setHasDraft] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [rubric, setRubric] = useState<RubricCriterion[]>([])
  const [selfAssessment, setSelfAssessment] = useState<SelfAssessment | null>(null)
  const [savingAssessment, setSavingAssessment] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session && !isScenarioFree(slug)) {
      router.replace(`/login?callbackUrl=/scenarios/${slug}`)
      return
    }
    async function load() {
      const res = await fetch(`/api/scenarios/${slug}`)
      if (res.ok) {
        setScenario(await res.json())
        const draft = loadDraft(slug)
        if (Object.keys(draft).length > 0) {
          setResponses(draft)
          setHasDraft(true)
        }
      }
      setLoading(false)
    }
    load()
  }, [slug, session, status, router])

  // Auto-save responses to localStorage on every change
  useEffect(() => {
    if (Object.keys(responses).length > 0 && phase === "prompts") {
      saveDraft(slug, responses)
    }
  }, [responses, slug, phase])

  async function handleSubmit() {
    if (!scenario) return
    setSubmitting(true)
    setSubmitError(null)
    const res = await fetch(`/api/scenarios/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: scenario.prompts.map((p) => ({ promptId: p.id, response: responses[p.id] ?? "" })) }),
    })
    if (res.ok) {
      const data = await res.json()
      setFeedback(data.feedback)
      if (data.rubric) setRubric(data.rubric)
      setPhase("feedback")
      clearDraft(slug)
    } else {
      setSubmitError("Submission failed. Please try again.")
    }
    setSubmitting(false)
  }

  async function handleSelfAssessment(value: SelfAssessment) {
    setSelfAssessment(value)
    if (!session) return
    setSavingAssessment(true)
    await fetch(`/api/scenarios/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selfAssessment: value }),
    })
    setSavingAssessment(false)
  }

  const currentResponse = scenario ? (responses[scenario.prompts[currentPrompt]?.id] ?? "") : ""
  const canAdvance = currentResponse.trim().length > 50

  if (loading) return (
    <AppShell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
        <Loader2 style={{ width: 18, height: 18, color: C.sub }} className="animate-spin" />
      </div>
    </AppShell>
  )

  if (!scenario) return (
    <AppShell>
      <button onClick={() => router.push("/scenarios")} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer", marginBottom: 32 }}>
        ← Scenarios
      </button>
      <p style={{ color: C.sub, fontSize: 14 }}>Scenario not found.</p>
    </AppShell>
  )

  return (
    <AppShell>
      {/* Back */}
      <button onClick={() => router.push("/scenarios")} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer", marginBottom: 36 }}>
        ← Scenarios
      </button>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 28, marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.12em", color: C.sub, flexWrap: "wrap" as const }}>
          {scenario.roles.map((r) => (
            <span key={r} style={{ padding: "3px 8px", border: `1px solid ${C.line}`, borderRadius: 999 }}>{r}</span>
          ))}
          <span style={{ padding: "3px 8px", border: `1px solid ${C.line}`, borderRadius: 999 }}>{scenario.difficulty}</span>
          {scenario.industry && <span style={{ color: C.sub }}>{scenario.industry}</span>}
        </div>
        <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: "clamp(32px, 3.8vw, 48px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, fontWeight: 400 }}>
          {scenario.title}
        </h1>
        <p style={{ marginTop: 12, marginBottom: 0, fontSize: 15, lineHeight: 1.6, color: C.sub }}>{scenario.summary}</p>
      </div>

      <div style={{ maxWidth: 720 }}>

        {/* ── Context phase ─────────────────────────────────── */}
        {phase === "context" && (
          <div>
            <Panel style={{ marginBottom: 14 }}>
              <MonoLabel>Scenario context</MonoLabel>
              <div style={{ fontSize: 15, lineHeight: 1.7, color: C.ink, whiteSpace: "pre-line" }}>{scenario.context}</div>
            </Panel>

            {hasDraft ? (
              <div style={{ padding: "14px 18px", border: `1px dashed ${C.line}`, marginBottom: 16, fontSize: 13.5, color: C.sub, lineHeight: 1.6 }}>
                You have a draft in progress. Your responses were auto-saved — you&apos;ll pick up where you left off.
              </div>
            ) : (
              <div style={{ padding: "14px 18px", border: `1px dashed ${C.line}`, marginBottom: 16, fontSize: 13.5, color: C.sub, lineHeight: 1.6 }}>
                You&apos;ll answer {scenario.prompts.length} prompts. Write your actual reasoning — vague responses get vague feedback. Aim for at least 2–3 sentences per prompt.
              </div>
            )}

            {!session && (
              <div style={{ padding: "10px 14px", border: `1px dashed ${C.line}`, marginBottom: 16, fontSize: 13, color: C.sub, lineHeight: 1.5 }}>
                You&apos;re not signed in — your response won&apos;t be saved.{" "}
                <Link href="/signup" style={{ color: C.ink, textDecoration: "underline" }}>Create a free account</Link>{" "}
                to track your progress.
              </div>
            )}

            <button
              onClick={() => setPhase("prompts")}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.ink, color: "#F8F7F5", border: "none", borderRadius: 4, fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
            >
              {hasDraft ? "Resume scenario →" : "Begin scenario →"}
            </button>
          </div>
        )}

        {/* ── Prompts phase ─────────────────────────────────── */}
        {phase === "prompts" && (
          <div>
            {/* Progress track */}
            <div style={{ display: "flex", gap: 4, marginBottom: 28 }}>
              {scenario.prompts.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 2, background: i < currentPrompt ? C.ink : i === currentPrompt ? C.sub : C.line, transition: "background 200ms" }} />
              ))}
            </div>

            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.12em", color: C.sub, marginBottom: 18 }}>
              PROMPT {currentPrompt + 1} / {scenario.prompts.length}
            </div>

            <p style={{ margin: "0 0 20px", fontFamily: '"Instrument Serif", serif', fontSize: 24, lineHeight: 1.3, color: C.ink, fontWeight: 400 }}>
              {scenario.prompts[currentPrompt].question}
            </p>

            <textarea
              value={currentResponse}
              onChange={(e) => setResponses((prev) => ({ ...prev, [scenario.prompts[currentPrompt].id]: e.target.value }))}
              placeholder="Write your reasoning here..."
              rows={9}
              style={{ width: "100%", padding: "14px 16px", background: C.bg, border: `1px solid ${C.line}`, fontSize: 14, lineHeight: 1.6, color: C.ink, fontFamily: "inherit", resize: "vertical" as const, outline: "none", boxSizing: "border-box" as const, transition: "border-color 120ms" }}
              onFocus={(e) => (e.target.style.borderColor = C.ink)}
              onBlur={(e) => (e.target.style.borderColor = C.line)}
            />

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, marginBottom: 20, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.06em", color: C.sub }}>
              <span>{currentResponse.length > 0 && currentResponse.length < 50 ? "Keep going — a few more sentences" : ""}</span>
              <span>{currentResponse.length} chars · auto-saved</span>
            </div>

            {/* Follow-up hint */}
            {scenario.prompts[currentPrompt].followUp && currentResponse.length > 100 && (
              <div style={{ padding: "14px 18px", border: `1px dashed ${C.line}`, marginBottom: 20, fontSize: 13.5, lineHeight: 1.6, color: C.sub }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", color: C.ink, marginBottom: 6 }}>FOLLOW-UP TO CONSIDER</div>
                {scenario.prompts[currentPrompt].followUp}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button
                onClick={() => currentPrompt > 0 ? setCurrentPrompt((p) => p - 1) : setPhase("context")}
                style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer" }}
              >
                ← {currentPrompt > 0 ? "Previous" : "Back"}
              </button>

              {currentPrompt < scenario.prompts.length - 1 ? (
                <button
                  onClick={() => setCurrentPrompt((p) => p + 1)}
                  disabled={!canAdvance}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.ink, color: "#F8F7F5", border: "none", borderRadius: 4, fontSize: 13.5, fontWeight: 500, cursor: canAdvance ? "pointer" : "not-allowed", opacity: canAdvance ? 1 : 0.4, fontFamily: "inherit" }}
                >
                  Next prompt →
                </button>
              ) : (
                <div>
                  <button
                    onClick={handleSubmit}
                    disabled={!canAdvance || submitting}
                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.ink, color: "#F8F7F5", border: "none", borderRadius: 4, fontSize: 13.5, fontWeight: 500, cursor: canAdvance && !submitting ? "pointer" : "not-allowed", opacity: canAdvance && !submitting ? 1 : 0.4, fontFamily: "inherit" }}
                  >
                    {submitting && <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" />}
                    {submitting ? "Submitting..." : "Submit responses →"}
                  </button>
                  {submitError && <p style={{ marginTop: 8, fontSize: 13, color: C.warn }}>{submitError}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Feedback phase ────────────────────────────────── */}
        {phase === "feedback" && feedback && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: C.good }}>✓ SCENARIO COMPLETE</div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", color: C.sub, marginTop: 4 }}>EXPERT PERSPECTIVE — WHAT STRONG RESPONSES ADDRESS</div>
            </div>

            {/* Overall */}
            <Panel style={{ marginBottom: 12 }}>
              <MonoLabel>What this scenario tests</MonoLabel>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: C.ink }}>{feedback.overallAssessment}</p>
            </Panel>

            {rubric.length > 0 && (
              <Panel style={{ marginBottom: 12 }}>
                <MonoLabel>Score yourself against the rubric</MonoLabel>
                {rubric.map((r, i) => (
                  <div key={r.criterion} style={{ paddingTop: 10, marginTop: i === 0 ? 4 : 0, borderTop: i === 0 ? "none" : `1px dashed ${C.line}` }}>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.ink, marginBottom: 4 }}>{r.criterion}</div>
                    <div style={{ fontSize: 13.5, lineHeight: 1.6, color: C.sub }}>{r.description}</div>
                  </div>
                ))}
              </Panel>
            )}

            {feedback.strengths.length > 0 && (
              <Panel style={{ marginBottom: 12 }}>
                <MonoLabel color={C.good}>What a strong answer covers</MonoLabel>
                <BulletList items={feedback.strengths} color={C.good} />
              </Panel>
            )}

            {feedback.blindSpots.length > 0 && (
              <Panel style={{ marginBottom: 12 }}>
                <MonoLabel color={C.warn}>What most people miss</MonoLabel>
                <BulletList items={feedback.blindSpots} color={C.warn} />
              </Panel>
            )}

            {feedback.improvements.length > 0 && (
              <Panel style={{ marginBottom: 12 }}>
                <MonoLabel>Key considerations</MonoLabel>
                <BulletList items={feedback.improvements} />
              </Panel>
            )}

            {feedback.followUpQuestion && (
              <div style={{ padding: "20px 24px", border: `1px dashed ${C.line}`, marginBottom: 12 }}>
                <MonoLabel>To deepen your thinking</MonoLabel>
                <p style={{ margin: "0 0 16px", fontFamily: '"Instrument Serif", serif', fontSize: 20, lineHeight: 1.4, color: C.ink, fontStyle: "italic", fontWeight: 400 }}>
                  &ldquo;{feedback.followUpQuestion}&rdquo;
                </p>
                <textarea
                  placeholder="Jot your thoughts here — this stays in the browser and isn't submitted anywhere."
                  rows={4}
                  style={{ width: "100%", padding: "10px 12px", background: C.bg, border: `1px solid ${C.line}`, fontSize: 13.5, lineHeight: 1.6, color: C.ink, fontFamily: "inherit", resize: "vertical" as const, outline: "none", boxSizing: "border-box" as const, transition: "border-color 120ms" }}
                  onFocus={(e) => (e.target.style.borderColor = C.ink)}
                  onBlur={(e) => (e.target.style.borderColor = C.line)}
                />
              </div>
            )}

            {/* Self-assessment */}
            <Panel style={{ marginBottom: 12 }}>
              <MonoLabel>How well did your response cover these areas?</MonoLabel>
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

            {/* Example responses — always visible after assessment */}
            {scenario && scenario.prompts.some((p) => p.modelAnswer) && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", color: C.sub, marginBottom: 14, marginTop: 8 }}>
                  EXAMPLE STRONG RESPONSES
                </div>
                {scenario.prompts.map((p, i) =>
                  p.modelAnswer ? (
                    <Panel key={p.id} style={{ marginBottom: 8 }}>
                      <MonoLabel>Prompt {i + 1}</MonoLabel>
                      <p style={{ margin: "0 0 12px", fontSize: 13, lineHeight: 1.6, color: C.sub, fontStyle: "italic" }}>{p.question}</p>
                      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: C.ink }}>{p.modelAnswer}</p>
                    </Panel>
                  ) : null
                )}
              </div>
            )}

            {!session && (
              <Panel style={{ marginBottom: 24 }}>
                <p style={{ margin: 0, fontSize: 14, color: C.sub, lineHeight: 1.6 }}>
                  <span style={{ color: C.ink, fontWeight: 500 }}>Want to track your progress?</span>{" "}
                  <Link href="/signup" style={{ color: C.ink, textDecoration: "underline" }}>Create a free account</Link>{" "}
                  to save your results and see how you improve over time.
                </p>
              </Panel>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                onClick={() => router.push("/scenarios")}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: C.ink, color: "#F8F7F5", border: "none", borderRadius: 4, fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
              >
                Back to scenarios
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
