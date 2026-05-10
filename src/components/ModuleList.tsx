"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const COMPLETED_KEY = "ascent_completed_modules"

type Module = {
  id: string
  slug: string
  title: string
  summary: string
  difficulty: string
  roles: string[]
  completed: boolean
  relevant: boolean
}

const diffLabel: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: "good" | "warn" | "accent" | "default" }) {
  const colors =
    tone === "good" ? { border: "#2C5F4F", color: "#2C5F4F" } :
    tone === "warn" ? { border: "#A65A2E", color: "#A65A2E" } :
    tone === "accent" ? { border: "#1A1814", color: "#1A1814" } :
    { border: "#DDDCD9", color: "#65605A" }
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10.5,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "3px 7px",
        border: `1px solid ${colors.border}`,
        borderRadius: 999,
        color: colors.color,
        background: "transparent",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  )
}

export function ModuleList({ modules, isGuest }: { modules: Module[]; isGuest?: boolean }) {
  const [localCompleted, setLocalCompleted] = useState<string[]>([])
  const [filter, setFilter] = useState<string>("ALL")

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? "[]")
      setLocalCompleted(stored)
    } catch {
      setLocalCompleted([])
    }
    const saved = localStorage.getItem("ascent_guest_role")
    if (saved) setFilter(saved)
  }, [])

  const visible = filter === "ALL"
    ? modules
    : modules.filter((m) => m.roles.includes(filter) || m.roles.includes("ALL"))

  return (
    <div>
      {/* Filter row */}
      <div className="flex items-center gap-1.5 mb-0 pb-5 border-b border-border">
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: "#65605A", letterSpacing: "0.12em", marginRight: 6 }}>
          FILTER /
        </span>
        {["ALL", "PM", "EM", "IC"].map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: 11,
              letterSpacing: "0.1em",
              padding: "6px 12px",
              borderRadius: 999,
              border: `1px solid ${filter === r ? "#1A1814" : "#DDDCD9"}`,
              background: filter === r ? "#1A1814" : "transparent",
              color: filter === r ? "#F8F7F5" : "#65605A",
              cursor: "pointer",
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Module rows */}
      <div className="border-t border-border">
        {visible.map((m, i) => {
          const completed = m.completed || localCompleted.includes(m.slug)
          const roleLabel = m.roles.join("/")
          const locked = false
          const rowStyle: React.CSSProperties = {
            gridTemplateColumns: "60px 1fr 140px 120px 24px",
            gap: 24,
            padding: "20px 8px",
            borderBottom: `1px solid #E5E4E0`,
            color: locked ? "#A09890" : "#1A1814",
            opacity: locked ? 0.6 : 1,
          }
          const inner = (
            <>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: locked ? "#B0A8A0" : "#65605A", letterSpacing: "0.06em" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-2.5 font-medium" style={{ fontSize: 15.5 }}>
                {m.title}
                {completed && !locked && <Pill tone="good">✓ done</Pill>}
              </span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: locked ? "#B0A8A0" : "#65605A", textTransform: "uppercase" }}>
                {diffLabel[m.difficulty] ?? m.difficulty}
              </span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: locked ? "#B0A8A0" : "#65605A" }}>
                {roleLabel}
              </span>
              <span style={{ color: locked ? "#B0A8A0" : "#65605A", fontSize: 14 }}>{locked ? "🔒" : "→"}</span>
            </>
          )
          return locked ? (
            <Link
              key={m.id}
              href="/login"
              className="grid items-center no-underline transition-colors duration-150"
              style={rowStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F0EFEB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {inner}
            </Link>
          ) : (
            <Link
              key={m.id}
              href={`/learn/${m.slug}`}
              className="grid items-center no-underline transition-colors duration-150 group"
              style={rowStyle}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#E8E6E1")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {inner}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
