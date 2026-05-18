"use client"

import Link from "next/link"
import { GUEST_SCENARIOS } from "@/config/access"
import { useContentFilters } from "@/hooks/useContentFilters"
import { FilterBar } from "@/components/FilterBar"

type Scenario = {
  id: string
  slug: string
  title: string
  summary: string
  roles: string[]
  difficulty: string
  industry: string | null
  completed: boolean
}

const diffLabel: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
}

// Dossier structured fields per scenario slug
const DOSSIER: Record<string, { stakes: string; pressure: string; deadline: string; calls: string }> = {
  "hallucinating-executive-demo": {
    stakes: "CEO demoed your AI live to enterprise customers. Two facts were fabricated. They noticed.",
    pressure: "Follow-up meeting is already on the calendar.",
    deadline: "9am.",
    calls: "Disclose · contain · re-demo · pause",
  },
  "ai-vendor-evaluation": {
    stakes: "Vendor claims 60% accuracy, $180k/year contract on the table.",
    pressure: "CEO wants a yes by Friday. Legal hasn't been looped in.",
    deadline: "CEO meeting in 3 days.",
    calls: "Verify · pilot · negotiate · decline",
  },
  "broken-prompt": {
    stakes: "AI feature producing wrong outputs for 30% of users. Nothing in the code changed.",
    pressure: "Manager wants root cause by EOD and a prevention plan.",
    deadline: "End of day.",
    calls: "Debug · hypothesize · reproduce · prevent",
  },
  "agent-went-rogue": {
    stakes: "AI outreach agent sent 1,200 customers pricing emails at 40% below actual rates. Some have already replied.",
    pressure: "Customers are responding to lock in the price. Legal and sales don't know yet.",
    deadline: "Morning.",
    calls: "Contain · communicate · correct · prevent",
  },
  "build-eval-first": {
    stakes: "Enterprise launch in 14 days. No evals exist to verify AI summary accuracy across document types.",
    pressure: "PM says ship. Customers cited it as buying criteria. VP will ask about any delay.",
    deadline: "14 days.",
    calls: "Delay · de-scope · add guardrails · ship and measure",
  },
  "senior-refuses-ai": {
    stakes: "Your best engineer tried AI tools seriously for 3 weeks and concluded they're slower. Team is split.",
    pressure: "No conflict yet — but the divergence is visible and growing across the team.",
    deadline: "Next 1:1.",
    calls: "Require · accommodate · investigate · leave it",
  },
  "junior-ai-dependence": {
    stakes: "Junior IC is shipping high volume with AI but can't explain their own code or debug independently.",
    pressure: "PRs are getting approved. The problem is invisible in metrics — only visible up close.",
    deadline: "No hard deadline, but the pattern is hardening.",
    calls: "Intervene · restrict · mentor · let it play out",
  },
  "competitor-launched-ai": {
    stakes: "Competitor's AI brief generator is on Product Hunt. CEO forwarded the article: 'We need this.'",
    pressure: "Engineering says 3 months. Your research shows it wasn't a user need. Roadmap gets paused.",
    deadline: "CEO wants a timeline now.",
    calls: "Build it · investigate first · push back · reframe the ask",
  },
  "board-ai-roadmap": {
    stakes: "10 minutes at the board meeting to present three AI initiatives with mixed evidence.",
    pressure: "'What's your AI strategy?' went unanswered last quarter. One board member will push on ROI.",
    deadline: "Board meeting.",
    calls: "Honest · selective · reframe scope · buy time",
  },
  "cto-cut-juniors": {
    stakes: "CTO wants to eliminate 3 junior positions at the next headcount review. You disagree.",
    pressure: "Senior engineers are ambivalent. Juniors don't know. Your 1:1 with the CTO is next Wednesday.",
    deadline: "Headcount review in 6 weeks.",
    calls: "Push back · propose alternatives · gather data · comply",
  },
  "half-team-claude-code": {
    stakes: "Production incident traced to AI-generated code. Half the team faster; other half doing extra review burden.",
    pressure: "No policy. Team tension is building. Sprint planning is in 3 days.",
    deadline: "Sprint planning in 3 days.",
    calls: "Ban · require · set guardrails · do nothing",
  },
  "ai-pr-security-bug": {
    stakes: "420-line AI-generated PR with a suspected SQL injection in a user data export endpoint.",
    pressure: "Release train confirmed. Three other teams' PRs are on it. Deployment is in 2 hours.",
    deadline: "4pm. 2 hours away.",
    calls: "Block · investigate · escalate · approve with note",
  },
  "expensive-ai-endpoint": {
    stakes: "AI feature running at 8x estimated cost — $2,232/day vs $288/day budget.",
    pressure: "CEO: 'It either gets cheaper this week or we pull it.' Feature is live with 6,000 daily users.",
    deadline: "One week.",
    calls: "Cache · switch models · rate-limit · pull the feature",
  },
  "designing-the-eval": {
    stakes: "Building an AI code reviewer with no eval infrastructure. Engineers will turn it off if it's noisy.",
    pressure: "Manager: 'Don't start building until you know how you'll know if it's working.' One week to design.",
    deadline: "One week before implementation begins.",
    calls: "Define metrics · build golden set · set thresholds · design feedback loop",
  },
  "chatbot-nobody-wanted": {
    stakes: "PM committed to an AI chatbot in the roadmap. Your analytics show 12% usage on the existing AI feature.",
    pressure: "Roadmap deck went to the VP. Enterprise accounts are already asking about timelines.",
    deadline: "Q3 roadmap committed.",
    calls: "Build it · push back · propose alternative · negotiate scope",
  },
  "autonomy-creep": {
    stakes: "AI assistant gained email access through 8 months of incremental approvals. Sent a message to a customer at 2am.",
    pressure: "Postmortem is starting. You approved several of the expansions. Customer relationship at risk.",
    deadline: "Postmortem now.",
    calls: "Revoke access · tighten approval · establish policy · communicate",
  },
}

// Top border color by primary role(s)
function getRoleBorderColor(roles: string[]): string {
  const has = (r: string) => roles.includes(r)
  if (has("PM") && has("EM")) return "#3A4A6B"
  if (has("EM") && has("IC")) return "#6B4A3A"
  if (has("PM")) return "#3A4A6B"
  if (has("EM")) return "#6B4A3A"
  return "#65605A"
}

function RolePill({ role }: { role: string }) {
  const colors: Record<string, { border: string; color: string }> = {
    PM:    { border: "#3A4A6B", color: "#3A4A6B" },
    "PM/EM": { border: "#3A4A6B", color: "#3A4A6B" },
    EM:    { border: "#6B4A3A", color: "#6B4A3A" },
    "EM/IC": { border: "#6B4A3A", color: "#6B4A3A" },
    IC:    { border: "#65605A", color: "#65605A" },
  }
  const c = colors[role] ?? { border: "#DDDCD9", color: "#65605A" }
  return (
    <span style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 10.5,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "3px 7px",
      border: `1px solid ${c.border}`,
      borderRadius: 999,
      color: c.color,
      background: "transparent",
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}>
      {role}
    </span>
  )
}

function DiffPill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 10.5,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      padding: "3px 7px",
      border: "1px solid #DDDCD9",
      borderRadius: 999,
      color: "#65605A",
      background: "transparent",
      lineHeight: 1,
      whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  )
}

export function ScenariosList({ scenarios, isGuest }: { scenarios: Scenario[]; isGuest: boolean }) {
  const { role, selectRole, resetAll, visible, showRoleFilter, mounted } = useContentFilters(scenarios)

  if (!mounted) return null

  // Global S## codes
  const sCodes: Record<string, string> = {}
  scenarios.forEach((s, i) => { sCodes[s.id] = `S${String(i + 1).padStart(2, "0")}` })

  return (
    <div>
      <FilterBar
        role={role}
        showRoleFilter={showRoleFilter}
        onRoleChange={selectRole}
      />

      <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 14, marginTop: 24 }}>
        {visible.map(s => {
          const locked = isGuest && !GUEST_SCENARIOS.has(s.slug)
          const borderColor = getRoleBorderColor(s.roles)
          const dossier = DOSSIER[s.slug]
          const roleLabel = s.roles.join("/")
          const code = sCodes[s.id] ?? ""
          const bg = locked ? "#EAE9E5" : "#F8F7F5"

          return (
            <Link
              key={s.id}
              href={locked ? "/signup" : `/scenarios/${s.slug}`}
              className="no-underline flex flex-col"
              style={{
                background: bg,
                border: "1px solid #DDDCD9",
                borderTop: `2px solid ${borderColor}`,
                padding: "22px 24px 20px",
                gap: 14,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                opacity: locked ? 0.78 : 1,
                transition: "background 140ms",
              }}
              onMouseEnter={e => { if (!locked) e.currentTarget.style.background = "#F0EFEB" }}
              onMouseLeave={e => { e.currentTarget.style.background = bg }}
            >
              {/* Case header */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 11,
                letterSpacing: "0.14em",
                color: "#65605A",
                textTransform: "uppercase",
                paddingBottom: 10,
                borderBottom: "1px solid #DDDCD9",
              }}>
                <span>Case <strong style={{ color: "#1A1814" }}>{code}</strong></span>
                <span>{diffLabel[s.difficulty] ?? s.difficulty}</span>
              </div>

              {/* Title */}
              <h3 style={{
                margin: 0,
                fontFamily: '"Instrument Serif", serif',
                fontWeight: 400,
                fontSize: 24,
                lineHeight: 1.08,
                letterSpacing: "-0.01em",
                color: "#1A1814",
              }}>
                {s.title}
              </h3>

              {/* Dossier fields or summary */}
              {dossier ? (
                <div style={{ display: "grid", gridTemplateColumns: "78px 1fr", gap: "8px 14px", fontSize: 13, lineHeight: 1.4 }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", color: "#65605A", textTransform: "uppercase", paddingTop: 2 }}>Stakes</span>
                  <span style={{ color: "#1A1814" }}>{dossier.stakes}</span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", color: "#65605A", textTransform: "uppercase", paddingTop: 2 }}>Pressure</span>
                  <span style={{ color: "#1A1814" }}>{dossier.pressure}</span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", color: "#65605A", textTransform: "uppercase", paddingTop: 2 }}>Deadline</span>
                  <span style={{ color: "#1A1814" }}>{dossier.deadline}</span>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.12em", color: "#65605A", textTransform: "uppercase", paddingTop: 2 }}>Calls</span>
                  <span style={{ color: "#65605A", fontStyle: "italic" }}>{dossier.calls}</span>
                </div>
              ) : (
                <p style={{ margin: 0, flex: 1, fontSize: 13.5, lineHeight: 1.55, color: "#65605A" }}>{s.summary}</p>
              )}

              {/* Footer */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "1px dashed #DDDCD9",
                paddingTop: 12,
                marginTop: "auto",
              }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <RolePill role={roleLabel} />
                  {s.completed && !locked && (
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 7px", border: "1px solid #2C5F4F", borderRadius: 999, color: "#2C5F4F", lineHeight: 1 }}>✓ done</span>
                  )}
                </div>
                {locked ? (
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#1A1814", textTransform: "uppercase" }}>
                    🔒&nbsp;&nbsp;Account required →
                  </span>
                ) : (
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#1A1814", textTransform: "uppercase" }}>
                    {s.completed ? "Review case →" : "Open case →"}
                  </span>
                )}
              </div>
            </Link>
          )
        })}

        {visible.length === 0 && (
          <div className="col-span-2 py-12 text-center" style={{ color: "#65605A", fontSize: 14 }}>
            No scenarios match those filters.{" "}
            <button onClick={resetAll} className="underline hover:no-underline">Show all</button>
          </div>
        )}
      </div>
    </div>
  )
}
