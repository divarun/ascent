import { db } from "@/lib/db"
import { sampleModules } from "@/data/modules"
import { sampleScenarios } from "@/data/scenarios"
import { sampleMissions } from "@/data/missions"
import Link from "next/link"
import { ContentToggle } from "@/components/admin/ContentToggle"

export const dynamic = "force-dynamic"

const DIFF_LABEL: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
}

const TABS = [
  { key: "modules",   label: "Modules" },
  { key: "scenarios", label: "Scenarios" },
  { key: "missions",  label: "Missions" },
] as const

type Tab = typeof TABS[number]["key"]

const rowGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 120px 100px 100px 56px",
  gap: 16,
  alignItems: "center",
  padding: "12px 16px",
  borderBottom: "1px solid #1E1E1C",
}

const colLabel: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 10.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  color: "#65605A",
}

const editLink: React.CSSProperties = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: 11,
  letterSpacing: "0.1em",
  padding: "5px 10px",
  border: "1px solid #3A3A38",
  borderRadius: 4,
  color: "#65605A",
  textDecoration: "none",
}

function TableHeader() {
  return (
    <div style={{ ...rowGrid, background: "#0E0E0C", borderBottom: "1px solid #222220" }}>
      <span style={colLabel}>Title</span>
      <span style={colLabel}>Difficulty</span>
      <span style={colLabel}>Roles</span>
      <span style={colLabel}>Status</span>
      <span />
    </div>
  )
}

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const activeTab: Tab = (TABS.some(t => t.key === searchParams.tab) ? searchParams.tab : "modules") as Tab

  const [dbModules, dbScenarios, dbMissions] = await Promise.all([
    db.module.findMany({
      select: { slug: true, title: true, summary: true, difficulty: true, roles: true, order: true, published: true, enabled: true },
      orderBy: { order: "asc" },
    }),
    db.scenario.findMany({
      select: { slug: true, title: true, summary: true, difficulty: true, roles: true, industry: true, published: true, enabled: true },
      orderBy: { createdAt: "asc" },
    }),
    db.mission.findMany({
      select: { slug: true, title: true, description: true, difficulty: true, roles: true, published: true, enabled: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  const dbModuleMap   = new Map(dbModules.map(m => [m.slug, m]))
  const dbScenarioMap = new Map(dbScenarios.map(s => [s.slug, s]))
  const dbMissionMap  = new Map(dbMissions.map(m => [m.slug, m]))

  const modules = sampleModules.map(m => {
    const row = dbModuleMap.get(m.slug)
    return { slug: m.slug, title: row?.title ?? m.title, difficulty: row?.difficulty ?? m.difficulty, roles: [...(row?.roles ?? m.roles)] as string[], enabled: row?.enabled ?? m.enabled, inDb: !!row }
  })

  const scenarios = sampleScenarios.map(s => {
    const row = dbScenarioMap.get(s.slug)
    return { slug: s.slug, title: row?.title ?? s.title, difficulty: row?.difficulty ?? s.difficulty, roles: [...(row?.roles ?? s.roles)] as string[], enabled: row?.enabled ?? s.enabled, inDb: !!row }
  })

  const missions = sampleMissions.map(m => {
    const row = dbMissionMap.get(m.slug)
    return { slug: m.slug, title: row?.title ?? m.title, difficulty: row?.difficulty ?? m.difficulty, roles: [...(row?.roles ?? m.roles)] as string[], enabled: row?.enabled ?? m.enabled, inDb: !!row }
  })

  const counts = {
    modules:   { enabled: modules.filter(m => m.enabled && m.inDb).length,   total: modules.length },
    scenarios: { enabled: scenarios.filter(s => s.enabled && s.inDb).length, total: scenarios.length },
    missions:  { enabled: missions.filter(m => m.enabled && m.inDb).length,  total: missions.length },
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", marginBottom: 8 }}>
          Content
        </div>
        <h1 style={{ margin: "0 0 6px", fontSize: 28, fontWeight: 500, color: "#F0EFEB" }}>Visibility</h1>
        <p style={{ margin: 0, fontSize: 13.5, color: "#65605A", lineHeight: 1.5 }}>
          Toggle visibility or edit records. Changes apply on next page load (within 60 s).
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, marginBottom: 28, borderBottom: "1px solid #222220" }}>
        {TABS.map(tab => {
          const active = tab.key === activeTab
          const c = counts[tab.key]
          return (
            <Link
              key={tab.key}
              href={`/admin/content?tab=${tab.key}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                textDecoration: "none",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                letterSpacing: "0.1em",
                color: active ? "#D4D1CB" : "#65605A",
                borderBottom: active ? "2px solid #6DBF9E" : "2px solid transparent",
                marginBottom: -1,
                transition: "color 120ms",
              }}
            >
              {tab.label.toUpperCase()}
              <span style={{ fontSize: 10, color: active ? "#6DBF9E" : "#3A3A38" }}>
                {c.enabled}/{c.total}
              </span>
            </Link>
          )
        })}
      </div>

      {/* Modules tab */}
      {activeTab === "modules" && (
        <div style={{ border: "1px solid #222220", borderRadius: 6, overflow: "hidden" }}>
          <TableHeader />
          {modules.map(m => (
            <div key={m.slug} style={{ ...rowGrid, background: "#161614" }}>
              <div>
                <div style={{ fontSize: 13.5, color: "#D4D1CB", fontWeight: 500 }}>{m.title}</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, color: "#65605A", marginTop: 2 }}>{m.slug}</div>
              </div>
              <span style={{ ...colLabel, color: "#D4D1CB" }}>{DIFF_LABEL[m.difficulty] ?? m.difficulty}</span>
              <span style={{ ...colLabel, color: "#D4D1CB" }}>{m.roles.join("/")}</span>
              <ContentToggle slug={m.slug} type="module" initialEnabled={m.enabled} inDb={m.inDb} />
              {m.inDb ? <Link href={`/admin/content/module/${m.slug}`} style={editLink}>EDIT</Link> : <span />}
            </div>
          ))}
        </div>
      )}

      {/* Scenarios tab */}
      {activeTab === "scenarios" && (
        <div style={{ border: "1px solid #222220", borderRadius: 6, overflow: "hidden" }}>
          <TableHeader />
          {scenarios.map(s => (
            <div key={s.slug} style={{ ...rowGrid, background: "#161614" }}>
              <div>
                <div style={{ fontSize: 13.5, color: "#D4D1CB", fontWeight: 500 }}>{s.title}</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, color: "#65605A", marginTop: 2 }}>{s.slug}</div>
              </div>
              <span style={{ ...colLabel, color: "#D4D1CB" }}>{DIFF_LABEL[s.difficulty] ?? s.difficulty}</span>
              <span style={{ ...colLabel, color: "#D4D1CB" }}>{s.roles.join("/")}</span>
              <ContentToggle slug={s.slug} type="scenario" initialEnabled={s.enabled} inDb={s.inDb} />
              {s.inDb ? <Link href={`/admin/content/scenario/${s.slug}`} style={editLink}>EDIT</Link> : <span />}
            </div>
          ))}
        </div>
      )}

      {/* Missions tab */}
      {activeTab === "missions" && (
        <div style={{ border: "1px solid #222220", borderRadius: 6, overflow: "hidden" }}>
          <TableHeader />
          {missions.map(m => (
            <div key={m.slug} style={{ ...rowGrid, background: "#161614" }}>
              <div>
                <div style={{ fontSize: 13.5, color: "#D4D1CB", fontWeight: 500 }}>{m.title}</div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, color: "#65605A", marginTop: 2 }}>{m.slug}</div>
              </div>
              <span style={{ ...colLabel, color: "#D4D1CB" }}>{DIFF_LABEL[m.difficulty] ?? m.difficulty}</span>
              <span style={{ ...colLabel, color: "#D4D1CB" }}>{m.roles.join("/")}</span>
              <ContentToggle slug={m.slug} type="mission" initialEnabled={m.enabled} inDb={m.inDb} />
              {m.inDb ? <Link href={`/admin/content/mission/${m.slug}`} style={editLink}>EDIT</Link> : <span />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
