"use client"

import Link from "next/link"
import { GUEST_MISSIONS } from "@/config/access"
import { useContentFilters } from "@/hooks/useContentFilters"
import { FilterBar } from "@/components/FilterBar"

type Mission = {
  id: string
  slug: string
  title: string
  description: string
  roles: string[]
  difficulty: string
  completed: boolean
}

const TIER_ORDER = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const

const TIER_META: Record<string, { code: string; name: string }> = {
  BEGINNER:     { code: "T01", name: "Beginner" },
  INTERMEDIATE: { code: "T02", name: "Intermediate" },
  ADVANCED:     { code: "T03", name: "Advanced" },
}

function Checkbox({ checked, locked }: { checked: boolean; locked?: boolean }) {
  return (
    <div style={{
      width: 14,
      height: 14,
      border: `1.4px solid ${checked ? "#2C5F4F" : "#8A857E"}`,
      borderRadius: 3,
      background: checked ? "#2C5F4F" : "transparent",
      position: "relative",
      flexShrink: 0,
      opacity: locked ? 0.4 : 1,
    }}>
      {checked && (
        <div style={{
          position: "absolute",
          left: 3,
          top: 0,
          width: 4,
          height: 8,
          border: "solid #fff",
          borderWidth: "0 1.6px 1.6px 0",
          transform: "rotate(45deg)",
        }} />
      )}
    </div>
  )
}

export function MissionsList({ missions, isGuest }: { missions: Mission[]; isGuest: boolean }) {
  const { role, selectRole, resetAll, visible, showRoleFilter, mounted } = useContentFilters(missions)

  if (!mounted) return null

  // Group by difficulty, preserving order
  const grouped: Record<string, Mission[]> = { BEGINNER: [], INTERMEDIATE: [], ADVANCED: [] }
  visible.forEach(m => {
    const tier = m.difficulty in grouped ? m.difficulty : "BEGINNER"
    grouped[tier].push(m)
  })

  // Global M## codes across all missions
  let mGlobal = 0
  const missionCodes: Record<string, string> = {}
  missions.forEach(m => {
    mGlobal++
    missionCodes[m.id] = `M${String(mGlobal).padStart(2, "0")}`
  })

  const submittedCount = visible.filter(m => m.completed).length
  const hasAny = visible.length > 0

  return (
    <div>
      <FilterBar
        role={role}
        showRoleFilter={showRoleFilter}
        onRoleChange={selectRole}
      />

      {hasAny && (
        <div style={{
          display: "flex",
          gap: 18,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "#65605A",
          textTransform: "uppercase",
          padding: "14px 0 22px",
          borderBottom: "1px solid #DDDCD9",
          marginBottom: 14,
          flexWrap: "wrap",
        }}>
          <span><strong style={{ color: "#1A1814" }}>{submittedCount}</strong> submitted</span>
          <span><strong style={{ color: "#1A1814" }}>{visible.length - submittedCount}</strong> queued</span>
          <span style={{ marginLeft: "auto" }}>+40 pts per submission</span>
        </div>
      )}

      {!hasAny ? (
        <div className="py-12 text-center" style={{ color: "#65605A", fontSize: 14 }}>
          No missions match those filters.{" "}
          <button onClick={resetAll} className="underline hover:no-underline">Show all</button>
        </div>
      ) : (
        TIER_ORDER.map(tier => {
          const items = grouped[tier]
          if (items.length === 0) return null
          const meta = TIER_META[tier]
          return (
            <div key={tier} style={{ marginBottom: 22 }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 0 12px",
                borderBottom: "1px solid #1A1814",
                marginBottom: 0,
              }}>
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "#65605A", textTransform: "uppercase" }}>{meta.code}</span>
                <span style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, lineHeight: 1, letterSpacing: "-0.01em", color: "#1A1814" }}>{meta.name}</span>
              </div>
              {items.map(m => {
                const locked = isGuest && !GUEST_MISSIONS.has(m.slug)
                const code = missionCodes[m.id] ?? ""
                const rowClass = "no-underline grid items-center [grid-template-columns:24px_1fr_auto] md:[grid-template-columns:24px_48px_1fr_auto]"
                const rowStyle: React.CSSProperties = {
                  gap: 12,
                  padding: "16px 4px",
                  borderBottom: "1px solid #E5E4E0",
                  color: "#1A1814",
                }
                return locked ? (
                  <Link
                    key={m.id}
                    href="/signup"
                    className={rowClass}
                    style={{ ...rowStyle, opacity: 0.7 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#F0EFEB")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <Checkbox checked={false} locked />
                    <span className="hidden md:inline" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A" }}>{code}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: "#65605A", marginBottom: 4 }}>{m.title}</div>
                      <div style={{ fontSize: 13, color: "#A09890", lineHeight: 1.5, maxWidth: 580 }}>Account required to attempt this mission.</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      <span>{m.roles.join("/")}</span>
                      <span style={{ color: "#1A1814" }}>→</span>
                    </div>
                  </Link>
                ) : (
                  <Link
                    key={m.id}
                    href={`/missions/${m.slug}`}
                    className={rowClass}
                    style={rowStyle}
                    onMouseEnter={e => (e.currentTarget.style.background = "#E8E6E1")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <Checkbox checked={m.completed} />
                    <span className="hidden md:inline" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A" }}>{code}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500, color: m.completed ? "#65605A" : "#1A1814", marginBottom: 4, textDecoration: m.completed ? "line-through" : "none", textDecorationColor: "#B0ABA3" }}>{m.title}</div>
                      <div style={{ fontSize: 13, color: "#65605A", lineHeight: 1.5, maxWidth: 580 }}>{m.description}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      <span>{m.roles.join("/")}</span>
                      {!m.completed && <span style={{ color: "#65605A" }}>+40</span>}
                      {m.completed && <span style={{ color: "#2C5F4F" }}>DONE</span>}
                      <span style={{ color: "#1A1814" }}>→</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        })
      )}
    </div>
  )
}
