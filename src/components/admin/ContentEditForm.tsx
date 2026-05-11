"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"

type ContentType = "module" | "scenario" | "mission"

// Fields that are stored as JSON in the DB and edited as JSON text in the form
const JSON_FIELDS: Record<ContentType, string[]> = {
  module: ["quiz"],
  scenario: ["prompts", "rubric", "staticFeedback"],
  mission: ["staticFeedback"],
}

// Fields that are string[] in the DB and edited as newline-separated text
const LINES_FIELDS: Record<ContentType, string[]> = {
  module: ["tags"],
  scenario: [],
  mission: ["checklist"],
}

function initState(type: ContentType, record: Record<string, unknown>): Record<string, unknown> {
  const state: Record<string, unknown> = { ...record }
  for (const f of JSON_FIELDS[type]) {
    state[f] = record[f] != null ? JSON.stringify(record[f], null, 2) : ""
  }
  for (const f of LINES_FIELDS[type]) {
    state[f] = Array.isArray(record[f]) ? (record[f] as string[]).join("\n") : ""
  }
  return state
}

function buildPayload(type: ContentType, state: Record<string, unknown>): Record<string, unknown> | { _error: string } {
  const payload: Record<string, unknown> = { ...state }
  for (const f of JSON_FIELDS[type]) {
    try {
      payload[f] = JSON.parse(state[f] as string)
    } catch {
      return { _error: `"${f}" contains invalid JSON` }
    }
  }
  for (const f of LINES_FIELDS[type]) {
    payload[f] = (state[f] as string)
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
  }
  return payload
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "#111110",
  border: "1px solid #2A2A28",
  borderRadius: 4,
  color: "#D4D1CB",
  padding: "8px 10px",
  fontSize: 13.5,
  fontFamily: "system-ui, -apple-system, sans-serif",
  boxSizing: "border-box",
  outline: "none",
}

const monoInput: React.CSSProperties = {
  ...inputBase,
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 12.5,
}

const sectionHead: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#65605A",
  marginBottom: 16,
  paddingBottom: 8,
  borderBottom: "1px solid #1E1E1C",
}

const fieldLabel: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 10.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#65605A",
  display: "block",
  marginBottom: 6,
}

const DIFFICULTIES = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const
const ROLES = ["PM", "EM", "IC"] as const

// ─── Sub-field components ─────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input style={inputBase} value={value} onChange={e => onChange(e.target.value)} />
}

function TextArea({ value, onChange, rows = 5, mono }: { value: string; onChange: (v: string) => void; rows?: number; mono?: boolean }) {
  return (
    <textarea
      style={{ ...(mono ? monoInput : inputBase), minHeight: rows * 22, resize: "vertical" }}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  )
}

function DifficultySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select style={{ ...inputBase, cursor: "pointer" }} value={value} onChange={e => onChange(e.target.value)}>
      {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>)}
    </select>
  )
}

function RolesCheckboxes({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={{ display: "flex", gap: 16 }}>
      {ROLES.map(r => (
        <label key={r} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", color: "#D4D1CB", fontSize: 13.5 }}>
          <input
            type="checkbox"
            checked={value.includes(r)}
            onChange={e => onChange(e.target.checked ? [...value, r] : value.filter(x => x !== r))}
          />
          {r}
        </label>
      ))}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#D4D1CB", fontSize: 13.5 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  )
}

// ─── Quiz editor ─────────────────────────────────────────────────────────────

type QuizQuestion = { question: string; options: string[]; correct: number; explanation: string }

const removeBtn: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 10,
  letterSpacing: "0.08em",
  padding: "3px 8px",
  border: "1px solid #3A2020",
  borderRadius: 3,
  background: "transparent",
  color: "#A05050",
  cursor: "pointer",
  flexShrink: 0,
}

const addBtn: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 10,
  letterSpacing: "0.1em",
  padding: "5px 12px",
  border: "1px solid #2A3A2A",
  borderRadius: 3,
  background: "transparent",
  color: "#6DBF9E",
  cursor: "pointer",
  alignSelf: "flex-start",
}

function QuizEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const questions: QuizQuestion[] = useMemo(() => {
    try {
      const p = JSON.parse(value)
      return Array.isArray(p) ? p : []
    } catch {
      return []
    }
  }, [value])

  function push(next: QuizQuestion[]) {
    onChange(JSON.stringify(next, null, 2))
  }

  function setQ(i: number, patch: Partial<QuizQuestion>) {
    const next = [...questions]
    next[i] = { ...next[i], ...patch }
    push(next)
  }

  function setOpt(qi: number, oi: number, text: string) {
    const opts = [...questions[qi].options]
    opts[oi] = text
    setQ(qi, { options: opts })
  }

  function addOpt(qi: number) {
    setQ(qi, { options: [...questions[qi].options, ""] })
  }

  function removeOpt(qi: number, oi: number) {
    const opts = questions[qi].options.filter((_, idx) => idx !== oi)
    const correct = Math.max(0, questions[qi].correct > oi ? questions[qi].correct - 1 : questions[qi].correct === oi ? 0 : questions[qi].correct)
    setQ(qi, { options: opts, correct })
  }

  function addQuestion() {
    push([...questions, { question: "", options: ["", "", ""], correct: 0, explanation: "" }])
  }

  function removeQuestion(i: number) {
    push(questions.filter((_, idx) => idx !== i))
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {questions.length === 0 && (
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: "#3A3A38", padding: "16px 0" }}>
          No questions yet. Click &quot;Add Question&quot; to start.
        </div>
      )}

      {questions.map((q, qi) => (
        <div key={qi} style={{ border: "1px solid #2A2A28", borderRadius: 6, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: "0.12em", color: "#65605A" }}>
              QUESTION {qi + 1}
            </span>
            <button style={removeBtn} onClick={() => removeQuestion(qi)}>Remove</button>
          </div>

          {/* Question text */}
          <div>
            <label style={fieldLabel}>Question</label>
            <textarea
              style={{ ...monoInput, minHeight: 44, resize: "vertical" }}
              value={q.question}
              onChange={e => setQ(qi, { question: e.target.value })}
            />
          </div>

          {/* Options */}
          <div>
            <label style={fieldLabel}>Options — select correct answer</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.options.map((opt, oi) => (
                <div key={oi} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={q.correct === oi}
                    onChange={() => setQ(qi, { correct: oi })}
                    style={{ flexShrink: 0, accentColor: "#6DBF9E", cursor: "pointer" }}
                  />
                  <input
                    style={{ ...inputBase, flex: 1 }}
                    value={opt}
                    placeholder={`Option ${oi + 1}`}
                    onChange={e => setOpt(qi, oi, e.target.value)}
                  />
                  {q.options.length > 2 && (
                    <button style={removeBtn} onClick={() => removeOpt(qi, oi)}>×</button>
                  )}
                </div>
              ))}
              <button style={{ ...addBtn, marginTop: 2 }} onClick={() => addOpt(qi)}>+ Add Option</button>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label style={fieldLabel}>Explanation</label>
            <textarea
              style={{ ...monoInput, minHeight: 44, resize: "vertical" }}
              value={q.explanation}
              onChange={e => setQ(qi, { explanation: e.target.value })}
            />
          </div>
        </div>
      ))}

      <button style={addBtn} onClick={addQuestion}>+ Add Question</button>
    </div>
  )
}

// ─── Main form ────────────────────────────────────────────────────────────────

export function ContentEditForm({ type, record }: { type: ContentType; record: Record<string, unknown> }) {
  const [form, setForm] = useState(() => initState(type, record))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  function set(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function save() {
    const payload = buildPayload(type, form)
    if ("_error" in payload) {
      setError(payload._error as string)
      return
    }

    setSaving(true)
    setError("")
    const res = await fetch(`/api/admin/content/${type}/${record.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      router.push("/admin/content")
      router.refresh()
    } else {
      const body = await res.json().catch(() => ({}))
      setError(body.error ?? "Save failed")
      setSaving(false)
    }
  }

  const roles = (form.roles as string[] | undefined) ?? []

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

      {/* ── Meta ── */}
      <section>
        <div style={sectionHead}>Meta</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          <Field label="Slug">
            <div style={{ ...monoInput, color: "#65605A", padding: "8px 10px" }}>{String(record.slug)}</div>
          </Field>

          <Field label="Title">
            <TextInput value={String(form.title ?? "")} onChange={v => set("title", v)} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 18 }}>
            <Field label="Difficulty">
              <DifficultySelect value={String(form.difficulty ?? "BEGINNER")} onChange={v => set("difficulty", v)} />
            </Field>
            <Field label="Roles">
              <div style={{ paddingTop: 6 }}>
                <RolesCheckboxes value={roles} onChange={v => set("roles", v)} />
              </div>
            </Field>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <Toggle label="Published" checked={Boolean(form.published)} onChange={v => set("published", v)} />
            <Toggle label="Enabled" checked={Boolean(form.enabled)} onChange={v => set("enabled", v)} />
            {"isUnlocked" in record && (
              <Toggle label="Unlocked" checked={Boolean(form.isUnlocked)} onChange={v => set("isUnlocked", v)} />
            )}
          </div>

        </div>
      </section>

      {/* ── Module fields ── */}
      {type === "module" && (
        <section>
          <div style={sectionHead}>Content</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <Field label="Summary">
              <TextArea value={String(form.summary ?? "")} onChange={v => set("summary", v)} rows={3} />
            </Field>
            <Field label="Content (Markdown)">
              <TextArea value={String(form.content ?? "")} onChange={v => set("content", v)} rows={20} mono />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 18 }}>
              <Field label="Order">
                <input
                  type="number"
                  style={inputBase}
                  value={String(form.order ?? 0)}
                  onChange={e => set("order", parseInt(e.target.value, 10) || 0)}
                />
              </Field>
              <Field label="Tags (one per line)">
                <TextArea value={String(form.tags ?? "")} onChange={v => set("tags", v)} rows={3} mono />
              </Field>
            </div>
            <div>
              <label style={fieldLabel}>Quiz</label>
              <QuizEditor value={String(form.quiz ?? "[]")} onChange={v => set("quiz", v)} />
            </div>
          </div>
        </section>
      )}

      {/* ── Scenario fields ── */}
      {type === "scenario" && (
        <>
          <section>
            <div style={sectionHead}>Overview</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Industry">
                <TextInput value={String(form.industry ?? "")} onChange={v => set("industry", v || null)} />
              </Field>
              <Field label="Summary">
                <TextArea value={String(form.summary ?? "")} onChange={v => set("summary", v)} rows={3} />
              </Field>
              <Field label="Context">
                <TextArea value={String(form.context ?? "")} onChange={v => set("context", v)} rows={12} />
              </Field>
            </div>
          </section>
          <section>
            <div style={sectionHead}>Prompts &amp; Rubric (JSON)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Prompts">
                <TextArea value={String(form.prompts ?? "")} onChange={v => set("prompts", v)} rows={14} mono />
              </Field>
              <Field label="Rubric">
                <TextArea value={String(form.rubric ?? "")} onChange={v => set("rubric", v)} rows={10} mono />
              </Field>
              <Field label="Static Feedback">
                <TextArea value={String(form.staticFeedback ?? "")} onChange={v => set("staticFeedback", v)} rows={8} mono />
              </Field>
            </div>
          </section>
        </>
      )}

      {/* ── Mission fields ── */}
      {type === "mission" && (
        <>
          <section>
            <div style={sectionHead}>Overview</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Description">
                <TextArea value={String(form.description ?? "")} onChange={v => set("description", v)} rows={3} />
              </Field>
              <Field label="Instructions (Markdown)">
                <TextArea value={String(form.instructions ?? "")} onChange={v => set("instructions", v)} rows={16} />
              </Field>
              <Field label="Static Guidance (Markdown)">
                <TextArea value={String(form.staticGuidance ?? "")} onChange={v => set("staticGuidance", v)} rows={10} />
              </Field>
            </div>
          </section>
          <section>
            <div style={sectionHead}>Checklist &amp; Feedback</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Checklist (one item per line)">
                <TextArea value={String(form.checklist ?? "")} onChange={v => set("checklist", v)} rows={6} mono />
              </Field>
              <Field label="Static Feedback (JSON, optional)">
                <TextArea value={String(form.staticFeedback ?? "")} onChange={v => set("staticFeedback", v)} rows={8} mono />
              </Field>
            </div>
          </section>
        </>
      )}

      {/* ── Actions ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8, borderTop: "1px solid #1E1E1C" }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: "0.1em",
            padding: "9px 20px",
            border: "1px solid #2C5F4F",
            borderRadius: 4,
            background: saving ? "transparent" : "#1A3A2E",
            color: saving ? "#65605A" : "#6DBF9E",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? "SAVING···" : "SAVE CHANGES"}
        </button>
        <button
          onClick={() => router.back()}
          disabled={saving}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: 11,
            letterSpacing: "0.1em",
            padding: "9px 20px",
            border: "1px solid #3A3A38",
            borderRadius: 4,
            background: "transparent",
            color: "#65605A",
            cursor: "pointer",
          }}
        >
          CANCEL
        </button>
        {error && (
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: "#E57373" }}>{error}</span>
        )}
      </div>

    </div>
  )
}
