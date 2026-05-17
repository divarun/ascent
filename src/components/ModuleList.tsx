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

const TIER_ORDER = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const
const TIER_LABEL: Record<string, string> = {
  BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced",
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
  const { role, selectRole, resetAll, visible, showRoleFilter, mounted } = useContentFilters(modules)
  const [localCompleted, setLocalCompleted] = useState<string[]>([])
  const [activeTier, setActiveTier] = useState<string>("BEGINNER")

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? "[]")
      setLocalCompleted(stored)
    } catch {
      setLocalCompleted([])
    }
  }, [])

  if (!mounted) return null

  // Group visible modules by difficulty tier, preserve order within each tier
  const grouped: Record<string, Module[]> = { BEGINNER: [], INTERMEDIATE: [], ADVANCED: [] }
  visible.forEach(m => {
    const tier = m.difficulty in grouped ? m.difficulty : "BEGINNER"
    grouped[tier].push(m)
  })

  // Global F## index across all tiers (based on full unfiltered list)
  let fIndex = 0
  const moduleCodes: Record<string, string> = {}
  modules.forEach(m => {
    fIndex++
    moduleCodes[m.id] = `F${String(fIndex).padStart(2, "0")}`
  })

  const activeItems = grouped[activeTier] ?? []

  return (
    <div>
      <FilterBar
        role={role}
        showRoleFilter={showRoleFilter}
        onRoleChange={selectRole}
      />

      {/* Difficulty tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #DDDCD9", marginBottom: 2 }}>
        {TIER_ORDER.map(tier => {
          const count = grouped[tier].length
          const isActive = tier === activeTier
          return (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "12px 20px",
                color: isActive ? "#1A1814" : "#65605A",
                background: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #1A1814" : "2px solid transparent",
                cursor: "pointer",
                marginBottom: -1,
                transition: "color 120ms",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {TIER_LABEL[tier]}
              <span style={{ opacity: isActive ? 0.45 : 0.3 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Module list for active tier */}
      {activeItems.length === 0 ? (
        <div className="py-12 text-center" style={{ color: "#65605A", fontSize: 14 }}>
          No modules match those filters.{" "}
          <button onClick={resetAll} className="underline hover:no-underline">Show all</button>
        </div>
      ) : (
        activeItems.map(m => {
          const completed = m.completed || localCompleted.includes(m.slug)
          const code = moduleCodes[m.id] ?? ""
          return (
            <Link
              key={m.id}
              href={`/learn/${m.slug}`}
              className="grid items-center no-underline transition-colors duration-150 [grid-template-columns:48px_1fr_24px]"
              style={{ gap: 16, padding: "20px 8px", borderBottom: "1px solid #E5E4E0", color: "#1A1814" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#E8E6E1")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: "#65605A", letterSpacing: "0.06em" }}>
                {code}
              </span>
              <span className="flex items-center gap-2.5 font-medium" style={{ fontSize: 15.5 }}>
                {m.title}
                {completed && <Pill tone="good">✓ done</Pill>}
              </span>
              <span style={{ color: "#65605A", fontSize: 14 }}>→</span>
            </Link>
          )
        })
      )}
    </div>
  )
}
