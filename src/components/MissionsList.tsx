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

const diffLabel: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
}

function Pill({ children, tone }: { children: React.ReactNode; tone?: "good" | "warn" | "default" }) {
  const colors =
    tone === "good" ? { border: "#2C5F4F", color: "#2C5F4F" } :
    tone === "warn" ? { border: "#A65A2E", color: "#A65A2E" } :
                      { border: "#DDDCD9",  color: "#65605A" }
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

export function MissionsList({ missions, isGuest }: { missions: Mission[]; isGuest: boolean }) {
  const { role, difficulty, selectRole, selectDifficulty, resetAll, visible, showRoleFilter, showDiffFilter, mounted } = useContentFilters(missions)

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

      <div className="flex flex-col border-t border-border">
        {visible.map((m, i) => {
          const locked = isGuest && !GUEST_MISSIONS.has(m.slug)
          const rowStyle: React.CSSProperties = {
            display: "grid",
            gridTemplateColumns: "auto 1fr auto",
            gap: 32,
            alignItems: "center",
            padding: "24px 8px",
            borderBottom: "1px solid #E5E4E0",
            color: "#1A1814",
          }
          const inner = locked ? (
            <>
              <div style={{ width: 60, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: "#65605A", letterSpacing: "0.06em" }}>
                M{String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-medium" style={{ fontSize: 17 }}>{m.title}</span>
                </div>
                <div className="mb-2" style={{ fontSize: 13.5, color: "#65605A", lineHeight: 1.5 }}>{m.description}</div>
                <div className="flex gap-1.5">
                  <Pill>{m.roles.join("/")}</Pill>
                  <Pill>{diffLabel[m.difficulty] ?? m.difficulty}</Pill>
                </div>
                <div style={{ marginTop: 8, fontSize: 12.5, color: "#65605A" }}>
                  Free account required to attempt this mission →
                </div>
              </div>
              <div style={{ fontSize: 13, color: "#65605A" }}>Create account</div>
            </>
          ) : (
            <>
              <div style={{ width: 60, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: "#65605A", letterSpacing: "0.06em" }}>
                M{String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-medium" style={{ fontSize: 17 }}>{m.title}</span>
                  {m.completed && <Pill tone="good">✓ submitted</Pill>}
                </div>
                <div className="mb-2" style={{ fontSize: 13.5, color: "#65605A", lineHeight: 1.5 }}>{m.description}</div>
                <div className="flex gap-1.5">
                  <Pill>{m.roles.join("/")}</Pill>
                  <Pill>{diffLabel[m.difficulty] ?? m.difficulty}</Pill>
                </div>
              </div>
              <div style={{ color: "#65605A", fontSize: 14 }}>→</div>
            </>
          )
          return locked ? (
            <Link
              key={m.id}
              href="/signup"
              className="no-underline transition-colors duration-150"
              style={rowStyle}
              onMouseEnter={e => (e.currentTarget.style.background = "#F0EFEB")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {inner}
            </Link>
          ) : (
            <Link
              key={m.id}
              href={`/missions/${m.slug}`}
              className="no-underline transition-colors duration-150"
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
            No missions match those filters.{" "}
            <button onClick={resetAll} className="underline hover:no-underline">Show all</button>
          </div>
        )}
      </div>
    </div>
  )
}
