import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let users: any[] = []
  try {
    users = await db.user.findMany({
      include: {
        profile: { select: { role: true, companyStage: true, industry: true } },
        progress: { select: { level: true, totalPoints: true, completedModules: true, completedScenarios: true, completedMissions: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (err) {
    console.error(err)
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#65605A", marginBottom: 8 }}>
          Users
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, color: "#F0EFEB" }}>
          {users.length} registered
        </h1>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2A2A28" }}>
              {["Name", "Email", "Role", "Company Stage", "Industry", "Level", "Points", "Modules", "Scenarios", "Missions", "Joined"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#65605A", whiteSpace: "nowrap" as const }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #1E1E1C" }}>
                <td style={cell}>{user.name || <Dim>—</Dim>}</td>
                <td style={cell}>{user.email}</td>
                <td style={cell}>{user.profile?.role || <Dim>—</Dim>}</td>
                <td style={cell}>{user.profile?.companyStage || <Dim>—</Dim>}</td>
                <td style={cell}>{user.profile?.industry || <Dim>—</Dim>}</td>
                <td style={{ ...cell, fontFamily: '"JetBrains Mono", monospace' }}>
                  {user.progress ? `L${String(user.progress.level).padStart(2, "0")}` : <Dim>—</Dim>}
                </td>
                <td style={{ ...cell, fontFamily: '"JetBrains Mono", monospace' }}>
                  {user.progress?.totalPoints ?? <Dim>—</Dim>}
                </td>
                <td style={{ ...cell, fontFamily: '"JetBrains Mono", monospace' }}>
                  {user.progress?.completedModules.length ?? <Dim>—</Dim>}
                </td>
                <td style={{ ...cell, fontFamily: '"JetBrains Mono", monospace' }}>
                  {user.progress?.completedScenarios.length ?? <Dim>—</Dim>}
                </td>
                <td style={{ ...cell, fontFamily: '"JetBrains Mono", monospace' }}>
                  {user.progress?.completedMissions.length ?? <Dim>—</Dim>}
                </td>
                <td style={{ ...cell, fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: "#65605A" }}>
                  {user.createdAt.toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div style={{ padding: "48px 0", textAlign: "center", color: "#65605A", fontSize: 14 }}>
            No users yet.
          </div>
        )}
      </div>
    </div>
  )
}

const cell: React.CSSProperties = {
  padding: "10px 12px",
  color: "#D4D1CB",
  verticalAlign: "top",
  whiteSpace: "nowrap",
}

function Dim({ children }: { children: React.ReactNode }) {
  return <span style={{ color: "#3A3A38" }}>{children}</span>
}
