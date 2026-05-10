"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GUEST_SCENARIOS } from "@/config/access"

const ROLE_KEY = "ascent_guest_role"

type Scenario = {
  id: string
  slug: string
  title: string
  summary: string
  roles: string[]
  difficulty: string
  industry: string | null
  completed: boolean
}

const diffLabel: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: "good" | "warn" | "default" }) {
  const colors =
    tone === "good" ? { border: "#2C5F4F", color: "#2C5F4F" } :
    tone === "warn" ? { border: "#A65A2E", color: "#A65A2E" } :
    { border: "#DDDCD9", color: "#65605A" }
  return (
    <span
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10.5,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        padding: "3px 7px",
        border: `1px solid ${colors.border}`,
        borderRadius: 999,
        color: colors.color,
        background: "transparent",
        lineHeight: 1,
        whiteSpace: "nowrap" as const,
      }}
    >
      {children}
    </span>
  )
}

export function ScenariosList({ scenarios, isGuest }: { scenarios: Scenario[]; isGuest: boolean }) {
  const [filter, setFilter] = useState<string>("ALL")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(ROLE_KEY)
    if (saved) setFilter(saved)
  }, [])

  function selectFilter(role: string) {
    const next = filter === role ? "ALL" : role
    setFilter(next)
    if (next !== "ALL") localStorage.setItem(ROLE_KEY, next)
    else localStorage.removeItem(ROLE_KEY)
  }

  const visible = filter === "ALL"
    ? scenarios
    : scenarios.filter((s) => s.roles.includes(filter))

  if (!mounted) return null

  return (
    <div>
      {/* Filter */}
      <div className="flex items-center gap-1.5 mb-8">
        <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: "#65605A", letterSpacing: "0.12em", marginRight: 6 }}>
          FILTER /
        </span>
        {["ALL", "PM", "EM", "IC"].map((r) => (
          <button
            key={r}
            onClick={() => selectFilter(r)}
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

      {/* 2-column grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          borderTop: "1px solid #DDDCD9",
          borderLeft: "1px solid #DDDCD9",
        }}
      >
        {visible.map((s) => {
          const locked = isGuest && !GUEST_SCENARIOS.has(s.slug)
          const bg = locked ? "#ECEAE6" : "#F0EFEB"
          const bgHover = locked ? "#EAE8E3" : "#F8F7F5"
          return (
            <Link
              key={s.id}
              href={locked ? "/signup" : `/scenarios/${s.slug}`}
              className="no-underline flex flex-col gap-3.5"
              style={{
                padding: "26px 28px",
                borderRight: "1px solid #DDDCD9",
                borderBottom: "1px solid #DDDCD9",
                background: bg,
                color: "#1A1814",
                minHeight: 200,
                transition: "background 140ms",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = bgHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = bg)}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  <Pill>{s.roles.join("/")}</Pill>
                  <Pill>{diffLabel[s.difficulty] ?? s.difficulty}</Pill>
                </div>
                {s.completed && !locked && <Pill tone="good">✓ done</Pill>}
              </div>

              <h3
                className="m-0 font-normal"
                style={{ fontFamily: '"Instrument Serif", serif', fontSize: 24, lineHeight: 1.05, letterSpacing: "-0.01em", color: "#1A1814" }}
              >
                {s.title}
              </h3>

              <p className="m-0 flex-1" style={{ fontSize: 13.5, lineHeight: 1.55, color: "#65605A" }}>
                {s.summary}
              </p>

              {locked ? (
                <div className="flex flex-col gap-2 mt-auto">
                  <div style={{ height: "1px", background: "#DDDCD9" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12.5, color: "#65605A", lineHeight: 1.4 }}>
                      Practice this scenario — free account required
                    </span>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#1A1814", whiteSpace: "nowrap" as const }}>
                      Create account →
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end items-center mt-auto">
                  <span style={{ fontSize: 13, color: "#1A1814" }}>Open →</span>
                </div>
              )}
            </Link>
          )
        })}

        {visible.length === 0 && (
          <div className="col-span-2 py-12 text-center" style={{ color: "#65605A", fontSize: 14 }}>
            No Scenarios for {filter} yet.{" "}
            <button onClick={() => selectFilter(filter)} className="underline hover:no-underline">
              Show all
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
