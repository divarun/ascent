import { appConfig } from "@/config/app"
import Link from "next/link"

export function BetaBanner() {
  if (!appConfig.beta) return null

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "#FFFBEB",
        borderBottom: "1px solid #FDE68A",
        padding: "7px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
      }}
    >
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          background: "#FDE68A",
          color: "#78350F",
          padding: "2px 7px",
          borderRadius: 3,
          fontWeight: 500,
        }}
      >
        Beta
      </span>
      <span
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: "#92400E",
          letterSpacing: "0.02em",
        }}
      >
        Ascent {appConfig.version} is in early access — you may encounter rough edges.
      </span>
      <Link
        href={appConfig.bugReportUrl}
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: "#92400E",
          textDecoration: "underline",
          textUnderlineOffset: 2,
          whiteSpace: "nowrap",
        }}
      >
        Report a bug →
      </Link>
      <Link
              href={appConfig.feedbackUrl}
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                color: "#92400E",
                textDecoration: "underline",
                textUnderlineOffset: 2,
                whiteSpace: "nowrap",
              }}
            >
              Submit Feedback →
            </Link>
    </div>
  )
}
