"use client"

import Link from "next/link"
import { useState } from "react"
import { AscentMark, Sidebar } from "./Sidebar"
import { appConfig } from "@/config/app"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-background z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 -ml-1 text-foreground"
            aria-label="Open menu"
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <line x1="3" y1="5.5" x2="17" y2="5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="3" y1="14.5" x2="17" y2="14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <Link href="/" className="text-foreground no-underline">
            <AscentMark small />
          </Link>
        </header>

        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 md:px-14 md:py-14 w-full">
          {children}
        </main>
        <footer className="max-w-5xl mx-auto w-full px-4 py-4 md:px-14 md:py-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
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
