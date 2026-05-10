import { C } from "@/lib/colors"

export function MonoLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: color ?? C.sub, marginBottom: 10 }}>{children}</div>
}

export function Panel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ padding: "20px 24px", border: `1px solid ${C.line}`, background: C.panel, ...style }}>{children}</div>
}

export function BulletList({ items, color }: { items: string[]; color?: string }) {
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, lineHeight: 1.55, color: C.ink }}>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: color ?? C.ink, flexShrink: 0, marginTop: 8, display: "inline-block" }} />
          {item}
        </li>
      ))}
    </ul>
  )
}
