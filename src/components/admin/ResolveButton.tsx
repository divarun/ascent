"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type Props = {
  id: string
  status: string
  endpoint: "bug-reports" | "feedback"
  resolvedLabel?: string
}

export function ResolveButton({ id, status, endpoint, resolvedLabel = "resolved" }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isResolved = status !== "open"

  async function toggle() {
    setLoading(true)
    const newStatus = isResolved ? "open" : resolvedLabel
    await fetch(`/api/admin/${endpoint}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 10,
        letterSpacing: "0.1em",
        padding: "4px 10px",
        border: `1px solid ${isResolved ? "#2C5F4F" : "#3A3A38"}`,
        borderRadius: 3,
        background: "transparent",
        color: isResolved ? "#2C5F4F" : "#65605A",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        textTransform: "uppercase" as const,
      }}
    >
      {isResolved ? `✓ ${resolvedLabel}` : "open"}
    </button>
  )
}
