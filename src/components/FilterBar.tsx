"use client"

const ROLE_OPTIONS = ["ALL", "PM", "EM", "IC"] as const

interface FilterBarProps {
  role: string
  showRoleFilter: boolean
  onRoleChange: (r: string) => void
}

const ROLE_ACTIVE: Record<string, { bg: string; border: string }> = {
  PM:  { bg: "#3A4A6B", border: "#3A4A6B" },
  EM:  { bg: "#6B4A3A", border: "#6B4A3A" },
  IC:  { bg: "#1A1814", border: "#1A1814" },
  ALL: { bg: "#1A1814", border: "#1A1814" },
}

function chipStyle(active: boolean, key: string): React.CSSProperties {
  if (active) {
    const c = ROLE_ACTIVE[key] ?? ROLE_ACTIVE.ALL
    return {
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 11,
      letterSpacing: "0.1em",
      padding: "6px 12px",
      borderRadius: 999,
      border: `1px solid ${c.border}`,
      background: c.bg,
      color: "#F8F7F5",
      cursor: "pointer",
    }
  }
  return {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: 11,
    letterSpacing: "0.1em",
    padding: "6px 12px",
    borderRadius: 999,
    border: "1px solid #DDDCD9",
    background: "transparent",
    color: "#65605A",
    cursor: "pointer",
  }
}

const rowLabel: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 11,
  color: "#65605A",
  letterSpacing: "0.12em",
  marginRight: 6,
  flexShrink: 0,
}

export function FilterBar({ role, showRoleFilter, onRoleChange }: FilterBarProps) {
  if (!showRoleFilter) return null

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, paddingBottom: 20, borderBottom: "1px solid #DDDCD9", marginBottom: 0 }}>
      <span style={rowLabel}>FILTER /</span>
      {ROLE_OPTIONS.map(r => (
        <button key={r} onClick={() => onRoleChange(r)} style={chipStyle(role === r, r)}>{r}</button>
      ))}
    </div>
  )
}
