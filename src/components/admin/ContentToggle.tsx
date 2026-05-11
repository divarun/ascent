"use client"

import { useState } from "react"

type ContentType = "module" | "scenario" | "mission"

export function ContentToggle({
  slug,
  type,
  initialEnabled,
  inDb,
}: {
  slug: string
  type: ContentType
  initialEnabled: boolean
  inDb: boolean
}) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [saving, setSaving] = useState(false)

  async function toggle() {
    setSaving(true)
    const res = await fetch("/api/admin/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, slug, enabled: !enabled }),
    })
    if (res.ok) setEnabled((e) => !e)
    setSaving(false)
  }

  if (!inDb) {
    return (
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#65605A" }}>
        NOT SEEDED
      </span>
    )
  }

  return (
    <button
      onClick={toggle}
      disabled={saving}
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
        letterSpacing: "0.1em",
        padding: "5px 12px",
        border: `1px solid ${enabled ? "#2C5F4F" : "#3A3A38"}`,
        borderRadius: 4,
        background: enabled ? "#1A3A2E" : "transparent",
        color: enabled ? "#6DBF9E" : "#65605A",
        cursor: saving ? "not-allowed" : "pointer",
        opacity: saving ? 0.5 : 1,
        transition: "all 120ms",
        minWidth: 80,
        textAlign: "center" as const,
      }}
    >
      {saving ? "···" : enabled ? "ENABLED" : "DISABLED"}
    </button>
  )
}
