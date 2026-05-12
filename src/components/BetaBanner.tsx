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
        padding: "7px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "nowrap",
        gap: "0 12px",
        overflow: "hidden",
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
          flexShrink: 0,
        }}
      >
        Beta
      </span>
      <span
        className="hidden sm:inline"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: "#92400E",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
        }}
      >
        Ascent {appConfig.version} is in early access — you may encounter rough edges.
      </span>
      <span
        className="sm:hidden"
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: 11,
          color: "#92400E",
          letterSpacing: "0.02em",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Early access — rough edges expected.
      </span>
      <div className="hidden sm:flex" style={{ gap: 12, flexShrink: 0 }}>
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
    </div>
  )
}
