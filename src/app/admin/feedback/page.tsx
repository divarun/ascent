import { db } from "@/lib/db"
import { ResolveButton } from "@/components/admin/ResolveButton"

export const dynamic = "force-dynamic"

const MOOD_LABELS: Record<string, string> = {
  great: "Great",
  ok: "Decent",
  stuck: "Stuck",
  off: "Not for me",
}

export default async function AdminFeedbackPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let entries: any[] = []
  try {
    entries = await db.feedback.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    })
  } catch (err) {
    console.error(err)
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#65605A", marginBottom: 8 }}>
          Feedback
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "#F0EFEB" }}>
          {entries.length} submission{entries.length !== 1 ? "s" : ""}
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {entries.map((f) => (
          <div key={f.id} style={{ border: "1px solid #222220", borderRadius: 6, padding: "20px 24px", background: "#161614" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 16 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, alignItems: "center" }}>
                {f.mood && (
                  <Tag color="#2A4A2A">{MOOD_LABELS[f.mood] ?? f.mood}</Tag>
                )}
                {f.surface && <Tag color="#2A2A4A">{f.surface}</Tag>}
                {f.nps !== null && (
                  <Tag color="#4A3A1A">NPS {f.nps}</Tag>
                )}
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: "#65605A", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                {f.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              </div>
            </div>

            {f.pains.length > 0 && (
              <Field label="Pain points">
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                  {(f.pains as string[]).map((p) => (
                    <span key={p} style={{ padding: "2px 8px", border: "1px solid #2A2A28", borderRadius: 3, fontSize: 12, color: "#A09A94" }}>{p}</span>
                  ))}
                </div>
              </Field>
            )}
            {f.stuck && <Field label="Stuck">{f.stuck}</Field>}
            {f.missing && <Field label="Missing">{f.missing}</Field>}

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1E1E1C", display: "flex", gap: 24, fontSize: 12, color: "#65605A" }}>
              {f.email && <span>✉ {f.email}</span>}
              {f.user ? (
                <span>👤 {f.user.name || f.user.email}</span>
              ) : (
                <span style={{ color: "#3A3A38" }}>Guest</span>
              )}
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, marginLeft: "auto", color: "#3A3A38" }}>{f.id}</span>
              <ResolveButton id={f.id} status={f.status ?? "open"} endpoint="feedback" resolvedLabel="archived" />
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#65605A", fontSize: 14 }}>
            No feedback yet.
          </div>
        )}
      </div>
    </div>
  )
}

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{ padding: "3px 10px", borderRadius: 3, background: color, fontSize: 12, color: "#D4D1CB" }}>
      {children}
    </span>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#65605A", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13.5, color: "#C0BCB5", lineHeight: 1.55 }}>{children}</div>
    </div>
  )
}
