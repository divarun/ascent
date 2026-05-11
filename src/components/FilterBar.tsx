"use client"

const ROLE_OPTIONS = ["ALL", "PM", "EM", "IC"] as const
const DIFF_OPTIONS = [
  ["ALL", "All"],
  ["BEGINNER", "Beginner"],
  ["INTERMEDIATE", "Intermediate"],
  ["ADVANCED", "Advanced"],
] as const

interface FilterBarProps {
  role: string
  difficulty: string
  showRoleFilter: boolean
  showDiffFilter: boolean
  onRoleChange: (r: string) => void
  onDifficultyChange: (d: string) => void
}

const chipStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 11,
  letterSpacing: "0.1em",
  padding: "6px 12px",
  borderRadius: 999,
  border: `1px solid ${active ? "#1A1814" : "#DDDCD9"}`,
  background: active ? "#1A1814" : "transparent",
  color: active ? "#F8F7F5" : "#65605A",
  cursor: "pointer",
})

const rowLabel: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 11,
  color: "#65605A",
  letterSpacing: "0.12em",
  marginRight: 6,
  flexShrink: 0,
}

export function FilterBar({ role, difficulty, showRoleFilter, showDiffFilter, onRoleChange, onDifficultyChange }: FilterBarProps) {
  if (!showRoleFilter && !showDiffFilter) return null

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
      {showRoleFilter && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={rowLabel}>ROLE /</span>
          {ROLE_OPTIONS.map(r => (
            <button key={r} onClick={() => onRoleChange(r)} style={chipStyle(role === r)}>{r}</button>
          ))}
        </div>
      )}
      {showDiffFilter && (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={rowLabel}>LEVEL /</span>
          {DIFF_OPTIONS.map(([val, label]) => (
            <button key={val} onClick={() => onDifficultyChange(val)} style={chipStyle(difficulty === val)}>{label}</button>
          ))}
        </div>
      )}
    </div>
  )
}
