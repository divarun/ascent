"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AppShell } from "@/components/layout/AppShell"
import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { isModuleFree } from "@/config/access"
import { C } from "@/lib/colors"
import { LevelUpBanner } from "@/components/LevelUpBanner"
import { getPoints } from "@/config/scoring"

const COMPLETED_KEY = "ascent_completed_modules"

function getLocalCompletions(): string[] {
  try { return JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? "[]") } catch { return [] }
}
function saveLocalCompletion(slug: string) {
  const existing = getLocalCompletions()
  if (!existing.includes(slug)) localStorage.setItem(COMPLETED_KEY, JSON.stringify([...existing, slug]))
}
function removeLocalCompletion(slug: string) {
  const existing = getLocalCompletions()
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(existing.filter((s) => s !== slug)))
}

type QuizQuestion = { question: string; options: string[]; correct: number; explanation: string }

function QuizBlock({
  question,
  index,
  total,
  onCorrect,
}: {
  question: QuizQuestion
  index: number
  total: number
  onCorrect: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const [attempts, setAttempts] = useState(0)
  const calledCorrect = useRef(false)

  const answered = selected !== null
  const correct = answered && selected === question.correct

  function pick(idx: number) {
    if (answered && correct) return
    setSelected(idx)
    setAttempts((a) => a + 1)
    if (idx === question.correct && !calledCorrect.current) {
      calledCorrect.current = true
      onCorrect()
    }
  }

  function retry() {
    setSelected(null)
  }

  return (
    <div style={{ paddingTop: 24, marginTop: 28, borderTop: `1px solid ${C.line}` }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", color: C.sub, marginBottom: 14 }}>
        CHECK YOUR UNDERSTANDING {total > 1 ? `· ${index + 1} / ${total}` : ""}
      </div>
      <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.5, color: C.ink, fontWeight: 500 }}>
        {question.question}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {question.options.map((opt, idx) => {
          const isSelected = selected === idx
          const isCorrect = idx === question.correct
          let border = C.line
          let bg = "transparent"
          let opacity = 1
          if (answered) {
            if (isCorrect) { border = C.good; bg = C.chip }
            else if (isSelected && !correct) { border = C.warn }
            else if (!isSelected && !correct) { opacity = 0.4 }
          }
          return (
            <button
              key={idx}
              onClick={() => pick(idx)}
              disabled={answered && correct}
              style={{
                textAlign: "left",
                padding: "12px 16px",
                border: `1px solid ${border}`,
                background: bg,
                fontSize: 14,
                lineHeight: 1.5,
                color: C.ink,
                cursor: answered && correct ? "default" : "pointer",
                fontFamily: "inherit",
                opacity,
                transition: "border-color 120ms",
                borderRadius: 2,
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <div style={{ marginTop: 16 }}>
          <div style={{ padding: "14px 16px", border: `1px dashed ${correct ? C.good : C.warn}`, background: C.panel, borderRadius: 2, marginBottom: correct ? 0 : 12 }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", color: correct ? C.good : C.warn, marginBottom: 8 }}>
              {correct ? "CORRECT" : "NOT QUITE"}
            </div>
            <div style={{ fontSize: 13.5, lineHeight: 1.65, color: C.sub }}>{question.explanation}</div>
          </div>
          {!correct && (
            <button
              onClick={retry}
              style={{ padding: "9px 16px", background: "transparent", color: C.ink, border: `1px solid ${C.line}`, borderRadius: 4, fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
            >
              Try again →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function ModulePage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { data: session, status } = useSession()

  const [module, setModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passedQuestions, setPassedQuestions] = useState<Set<number>>(new Set())
  const [levelUp, setLevelUp] = useState<{ level: number; name: string } | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (!session && !isModuleFree()) {
      router.replace(`/login?callbackUrl=/learn/${slug}`)
      return
    }
    async function load() {
      const res = await fetch(`/api/modules/${slug}`)
      if (res.ok) {
        const found = await res.json()
        setModule(found)
        setCompleted(found.completed || (!session && getLocalCompletions().includes(slug)))
      } else {
        setModule(null)
      }
      setLoading(false)
    }
    load()
  }, [slug, session, status, router])

  async function handleComplete() {
    setCompleting(true)
    setError(null)
    saveLocalCompletion(slug)
    setCompleted(true)
    const res = await fetch(`/api/modules/${slug}/complete`, { method: "POST" })
    if (!res.ok && session) {
      removeLocalCompletion(slug)
      setCompleted(false)
      setError("Failed to save progress. Please try again.")
    } else if (res.ok && session) {
      const data = await res.json()
      if (data.leveledUp) setLevelUp({ level: data.newLevel, name: data.levelName })
    }
    setCompleting(false)
  }

  const quiz: QuizQuestion[] = module?.quiz ?? []
  const [redoingQuiz, setRedoingQuiz] = useState(false)
  const showQuiz = quiz.length > 0 && (!completed || redoingQuiz)
  const allPassed = quiz.length === 0 || passedQuestions.size >= quiz.length
  const canComplete = allPassed || completed

  if (loading) {
    return (
      <AppShell>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <Loader2 style={{ width: 18, height: 18, color: C.sub }} className="animate-spin" />
        </div>
      </AppShell>
    )
  }

  if (!module) {
    return (
      <AppShell>
        <button onClick={() => router.push("/learn")} style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer", marginBottom: 32 }}>
          ← Foundation
        </button>
        <p style={{ color: C.sub, fontSize: 14 }}>Module not found.</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      {/* Back */}
      <button
        onClick={() => router.push("/learn")}
        style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer", marginBottom: 36, display: "flex", alignItems: "center", gap: 6 }}
      >
        ← Foundation
      </button>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.line}`, paddingBottom: 32, marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.12em", color: C.sub, flexWrap: "wrap" }}>
          {module.roles.map((r: string) => (
            <span key={r} style={{ padding: "3px 8px", border: `1px solid ${C.line}`, borderRadius: 999 }}>{r}</span>
          ))}
          <span style={{ color: C.line }}>·</span>
          <span style={{ textTransform: "uppercase" }}>{module.difficulty}</span>
        </div>
        <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontSize: "clamp(36px, 4vw, 52px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: C.ink, fontWeight: 400 }}>
          {module.title}
        </h1>
        {module.summary && (
          <p style={{ marginTop: 16, marginBottom: 0, maxWidth: 640, fontSize: 16, lineHeight: 1.6, color: C.sub }}>
            {module.summary}
          </p>
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720 }}>
        <div className="prose-ascent">
          <ReactMarkdown>{module.content}</ReactMarkdown>
        </div>

        {/* Quiz questions */}
        {showQuiz && (
          <div style={{ marginTop: 40 }}>
            {quiz.map((q: QuizQuestion, i: number) => (
              <QuizBlock
                key={i}
                question={q}
                index={i}
                total={quiz.length}
                onCorrect={() => setPassedQuestions((prev) => new Set([...prev, i]))}
              />
            ))}
          </div>
        )}

        {/* Complete strip */}
        <div style={{ marginTop: 56, paddingTop: 28, borderTop: `1px solid ${C.line}` }}>
          {completed ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.12em", color: C.good }}>
                  ✓ MODULE COMPLETE{session ? ` — +${getPoints("module", module.difficulty)} PTS` : ""}
                </span>
                <button
                  onClick={() => router.push("/learn")}
                  style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: "none", cursor: "pointer" }}
                >
                  ← Back to Foundation
                </button>
                {quiz.length > 0 && (
                  <button
                    onClick={() => {
                      setRedoingQuiz((r) => !r)
                      setPassedQuestions(new Set())
                    }}
                    style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub, background: "none", border: `1px solid ${C.line}`, borderRadius: 4, padding: "5px 12px", cursor: "pointer" }}
                  >
                    {redoingQuiz ? "Hide quiz" : "Redo quiz →"}
                  </button>
                )}
              </div>
              {levelUp && <LevelUpBanner level={levelUp.level} name={levelUp.name} />}
            </div>
          ) : (
            <div>
              {quiz.length > 0 && !allPassed && (
                <div style={{ marginBottom: 16, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: C.sub }}>
                  Answer the comprehension questions above to mark this module complete.
                </div>
              )}
              <button
                onClick={handleComplete}
                disabled={completing || !canComplete}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 18px",
                  background: !canComplete ? C.line : completing ? C.sub : C.ink,
                  color: "#F8F7F5",
                  border: "none",
                  borderRadius: 4,
                  fontSize: 13.5,
                  fontWeight: 500,
                  cursor: !canComplete || completing ? "not-allowed" : "pointer",
                  opacity: !canComplete ? 0.6 : completing ? 0.6 : 1,
                  fontFamily: "inherit",
                }}
              >
                {completing && <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" />}
                Mark as complete →
              </button>
              {error && (
                <p style={{ marginTop: 10, fontSize: 13, color: C.warn }}>{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
