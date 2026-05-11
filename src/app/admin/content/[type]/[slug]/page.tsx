import { notFound } from "next/navigation"
import Link from "next/link"
import { db } from "@/lib/db"
import { ContentEditForm } from "@/components/admin/ContentEditForm"

type ContentType = "module" | "scenario" | "mission"
type Params = { params: { type: string; slug: string } }

const TYPE_LABEL: Record<ContentType, string> = {
  module: "Module",
  scenario: "Scenario",
  mission: "Mission",
}

async function fetchRecord(type: ContentType, slug: string): Promise<Record<string, unknown> | null> {
  if (type === "module") return db.module.findUnique({ where: { slug } }) as Promise<Record<string, unknown> | null>
  if (type === "scenario") return db.scenario.findUnique({ where: { slug } }) as Promise<Record<string, unknown> | null>
  if (type === "mission") return db.mission.findUnique({ where: { slug } }) as Promise<Record<string, unknown> | null>
  return null
}

export default async function ContentEditPage({ params }: Params) {
  const { type, slug } = params

  if (!["module", "scenario", "mission"].includes(type)) notFound()

  const record = await fetchRecord(type as ContentType, slug)
  if (!record) notFound()

  const typeLabel = TYPE_LABEL[type as ContentType]

  return (
    <div style={{ maxWidth: 860 }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em" }}>
        <Link href="/admin/content" style={{ color: "#65605A", textDecoration: "none" }}>Content</Link>
        <span style={{ color: "#3A3A38" }}>/</span>
        <span style={{ color: "#65605A" }}>{typeLabel}</span>
        <span style={{ color: "#3A3A38" }}>/</span>
        <span style={{ color: "#D4D1CB" }}>{slug}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", marginBottom: 8 }}>
          {typeLabel}
        </div>
        <h1 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 500, color: "#F0EFEB" }}>
          {String(record.title)}
        </h1>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: "#3A3A38" }}>{slug}</div>
      </div>

      <ContentEditForm type={type as ContentType} record={record} />
    </div>
  )
}
