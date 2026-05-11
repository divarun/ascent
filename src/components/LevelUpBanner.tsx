const C = { good: "#2C5F4F", line: "#DDDCD9", ink: "#1A1814", panel: "#F0FDF8" }

export function LevelUpBanner({ level, name }: { level: number; name: string }) {
  return (
    <div
      style={{
        marginTop: 20,
        padding: "16px 20px",
        border: `1px solid ${C.good}`,
        background: C.panel,
        borderRadius: 4,
      }}
    >
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10.5,
          letterSpacing: "0.14em",
          color: C.good,
          marginBottom: 6,
        }}
      >
        ↑ LEVEL UP
      </div>
      <div style={{ fontSize: 15, color: C.ink, fontWeight: 500 }}>
        You&apos;re now L0{level} · {name}
      </div>
    </div>
  )
}
