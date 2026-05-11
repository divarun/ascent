import { db } from "@/lib/db"
import { ResolveButton } from "@/components/admin/ResolveButton"

export const dynamic = "force-dynamic"

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#6B1A1A",
  high: "#5A2A1A",
  medium: "#4A3A1A",
  low: "#1A3A2A",
}

export default async function AdminBugReportsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let reports: any[] = []
  try {
    reports = await db.bugReport.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    })
  } catch {
    // db not yet available
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#65605A", marginBottom: 8 }}>
          Bug Reports
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "#F0EFEB" }}>
          {reports.length} report{reports.length !== 1 ? "s" : ""}
        </h1>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {reports.map((r) => (
          <div key={r.id} style={{ border: "1px solid #222220", borderRadius: 6, padding: "20px 24px", background: "#161614" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" as const }}>
                <span style={{ padding: "3px 10px", borderRadius: 3, background: SEVERITY_COLORS[r.severity] ?? "#2A2A2A", fontSize: 12, color: "#D4D1CB", textTransform: "uppercase" as const, fontFamily: '"JetBrains Mono", monospace', letterSpacing: "0.08em" }}>
                  {r.severity}
                </span>
                {r.surface && (
                  <span style={{ padding: "3px 10px", borderRadius: 3, background: "#1E2A3A", fontSize: 12, color: "#A09A94" }}>
                    {r.surface}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: "#65605A", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              </div>
            </div>

            <div style={{ fontSize: 16, fontWeight: 500, color: "#F0EFEB", marginBottom: 10 }}>
              {r.title}
            </div>

            <Field label="Description">{r.description}</Field>
            {r.steps && <Field label="Steps to reproduce">{r.steps}</Field>}
            {r.device && <Field label="Browser / device">{r.device}</Field>}

            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #1E1E1C", display: "flex", gap: 24, fontSize: 12, color: "#65605A" }}>
              {r.email && <span>✉ {r.email}</span>}
              {r.user ? (
                <span>👤 {r.user.name || r.user.email}</span>
              ) : (
                <span style={{ color: "#3A3A38" }}>Anonymous</span>
              )}
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, marginLeft: "auto", color: "#3A3A38" }}>{r.id}</span>
              <ResolveButton id={r.id} status={r.status ?? "open"} endpoint="bug-reports" resolvedLabel="resolved" />
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#65605A", fontSize: 14 }}>
            No bug reports yet.
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#65605A", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13.5, color: "#C0BCB5", lineHeight: 1.55, whiteSpace: "pre-wrap" as const }}>{children}</div>
    </div>
  )
}
