"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useContentFilters } from "@/hooks/useContentFilters"
import { FilterBar } from "@/components/FilterBar"

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
    tone === "good"   ? { border: "#2C5F4F", color: "#2C5F4F" } :
    tone === "warn"   ? { border: "#A65A2E", color: "#A65A2E" } :
    tone === "accent" ? { border: "#1A1814",  color: "#1A1814"  } :
                        { border: "#DDDCD9",  color: "#65605A"  }
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
  const { role, difficulty, selectRole, selectDifficulty, resetAll, visible, showRoleFilter, showDiffFilter, mounted } = useContentFilters(modules)
  const [localCompleted, setLocalCompleted] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? "[]")
      setLocalCompleted(stored)
    } catch {
      setLocalCompleted([])
    }
  }, [])

  if (!mounted) return null

  return (
    <div>
      <FilterBar
        role={role}
        difficulty={difficulty}
        showRoleFilter={showRoleFilter}
        showDiffFilter={showDiffFilter}
        onRoleChange={selectRole}
        onDifficultyChange={selectDifficulty}
      />

      <div className="border-t border-border">
        {visible.map((m, i) => {
          const completed = m.completed || localCompleted.includes(m.slug)
          const rowStyle: React.CSSProperties = {
            gridTemplateColumns: "60px 1fr 140px 120px 24px",
            gap: 24,
            padding: "20px 8px",
            borderBottom: "1px solid #E5E4E0",
            color: "#1A1814",
          }
          const inner = (
            <>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: "#65605A", letterSpacing: "0.06em" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex items-center gap-2.5 font-medium" style={{ fontSize: 15.5 }}>
                {m.title}
                {completed && <Pill tone="good">✓ done</Pill>}
              </span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A", textTransform: "uppercase" }}>
                {diffLabel[m.difficulty] ?? m.difficulty}
              </span>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A" }}>
                {m.roles.join("/")}
              </span>
              <span style={{ color: "#65605A", fontSize: 14 }}>→</span>
            </>
          )
          return (
            <Link
              key={m.id}
              href={`/learn/${m.slug}`}
              className="grid items-center no-underline transition-colors duration-150 group"
              style={rowStyle}
              onMouseEnter={e => (e.currentTarget.style.background = "#E8E6E1")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {inner}
            </Link>
          )
        })}

        {visible.length === 0 && (
          <div className="py-12 text-center" style={{ color: "#65605A", fontSize: 14 }}>
            No modules match those filters.{" "}
            <button onClick={resetAll} className="underline hover:no-underline">Show all</button>
          </div>
        )}
      </div>
    </div>
  )
}
