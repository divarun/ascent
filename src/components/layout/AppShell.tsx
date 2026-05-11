import Link from "next/link"
import { Sidebar } from "./Sidebar"
import { appConfig } from "@/config/app"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-5xl mx-auto px-14 py-14 w-full">
          {children}
        </main>
        <footer className="max-w-5xl mx-auto w-full px-14 py-6 border-t border-border flex items-center justify-between">
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A" }}>
            ASCENT · v{appConfig.version}
          </span>
          <Link
            href={appConfig.bugReportUrl}
            style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A", textDecoration: "none" }}
            className="hover:text-foreground transition-colors"
          >
            Report a Bug →
          </Link>
          <Link
                      href={appConfig.feedbackUrl}
                      style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A", textDecoration: "none" }}
                      className="hover:text-foreground transition-colors"
                    >
                      Submit Feedback →
                    </Link>
        </footer>
      </div>
    </div>
  )
}
