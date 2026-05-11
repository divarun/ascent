import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { AppShell } from "@/components/layout/AppShell"
import { calculateLevel } from "@/lib/utils"
import Link from "next/link"
import { sampleModules } from "@/data/modules"
import { sampleScenarios } from "@/data/scenarios"
import { sampleMissions } from "@/data/missions"

const LEVEL_NAMES = ["", "Aware", "Informed", "Practitioner", "Leader"]
const LEVEL_PTS = [0, 0, 100, 300, 600]
const DIFF_ORDER: Record<string, number> = { BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2 }
const DIFF_LABEL: Record<string, string> = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" }

// Challenge → content slugs that directly address that challenge
const CHALLENGE_SCENARIO_SLUGS: Record<string, string[]> = {
  "evaluating-tools":        ["ai-vendor-evaluation", "build-vs-buy-decision"],
  "understanding-ai":        ["hallucinating-executive-demo", "broken-prompt"],
  "implementing-workflows":  ["designing-the-eval", "ai-feature-scope"],
  "leading-ai-initiatives":  ["ai-org-question", "ai-team-cant-ship"],
  "measuring-roi":           ["expensive-ai-endpoint", "designing-the-eval"],
  "team-adoption":           ["ai-team-cant-ship", "ai-org-question"],
  "applying-ai-daily":       ["broken-prompt", "ai-feature-scope"],
  "keeping-up":              ["ai-vendor-evaluation", "hallucinating-executive-demo"],
}

const CHALLENGE_MODULE_SLUGS: Record<string, string[]> = {
  "understanding-ai":        ["what-ai-is", "ai-building-blocks", "what-llms-actually-do", "what-ai-is-bad-at"],
  "evaluating-tools":        ["build-vs-buy", "model-selection-basics"],
  "implementing-workflows":  ["ai-ux-human-in-the-loop", "building-reliable-ai-features"],
  "leading-ai-initiatives":  ["leading-ai-at-org-level"],
  "measuring-roi":           ["measuring-ai-roi", "ai-evaluation-reliability"],
  "team-adoption":           ["leading-ai-at-org-level", "ai-ethics-bias"],
  "applying-ai-daily":       ["prompting-is-not-programming", "agentic-ai"],
  "keeping-up":              ["what-llms-actually-do", "ai-economics-scaling"],
}

const CHALLENGE_MISSION_SLUGS: Record<string, string[]> = {
  "evaluating-tools":        ["evaluate-vendor-claim"],
  "understanding-ai":        ["audit-ai-feature", "red-team-ai-workflow"],
  "implementing-workflows":  ["identify-ai-workflow", "improve-workflow-with-ai"],
  "leading-ai-initiatives":  ["draft-ai-policy", "communicate-ai-decision"],
  "measuring-roi":           ["create-ai-evaluation-plan"],
  "team-adoption":           ["communicate-ai-decision"],
  "applying-ai-daily":       ["design-prompt-system", "improve-workflow-with-ai"],
  "keeping-up":              ["evaluate-vendor-claim"],
}

const GOAL_MODULE_SLUGS: Record<string, string[]> = {
  "make-better-decisions":   ["what-ai-is-bad-at", "ai-evaluation-reliability", "ai-ethics-bias"],
  "evaluate-vendors":        ["build-vs-buy", "model-selection-basics"],
  "implement-ai":            ["ai-ux-human-in-the-loop", "agentic-ai", "building-reliable-ai-features"],
  "lead-initiative":         ["leading-ai-at-org-level", "data-privacy-ai-governance", "ai-ethics-bias"],
  "build-roadmap":           ["ai-product-failure-modes", "build-vs-buy", "measuring-ai-roi"],
  "understand-fundamentals": ["what-ai-is", "ai-building-blocks", "what-llms-actually-do"],
  "boost-productivity":      ["prompting-is-not-programming", "agentic-ai"],
  "informed-contributor":    ["what-ai-is", "ai-building-blocks", "ai-ethics-bias", "what-ai-is-bad-at"],
}

const GOAL_SCENARIO_SLUGS: Record<string, string[]> = {
  "make-better-decisions":   ["hallucinating-executive-demo", "biased-model"],
  "evaluate-vendors":        ["ai-vendor-evaluation", "build-vs-buy-decision"],
  "implement-ai":            ["ai-feature-scope", "designing-the-eval"],
  "lead-initiative":         ["ai-org-question", "ai-team-cant-ship"],
  "build-roadmap":           ["ai-feature-scope", "expensive-ai-endpoint"],
  "understand-fundamentals": ["hallucinating-executive-demo", "broken-prompt"],
  "boost-productivity":      ["broken-prompt", "ai-feature-scope"],
  "informed-contributor":    ["biased-model", "agent-went-rogue", "legal-compliance-escalation"],
}

const GOAL_MISSION_SLUGS: Record<string, string[]> = {
  "make-better-decisions":   ["audit-ai-feature", "create-ai-evaluation-plan"],
  "evaluate-vendors":        ["evaluate-vendor-claim"],
  "implement-ai":            ["identify-ai-workflow", "improve-workflow-with-ai"],
  "lead-initiative":         ["draft-ai-policy", "communicate-ai-decision"],
  "build-roadmap":           ["write-ai-feature-brief", "create-ai-evaluation-plan"],
  "understand-fundamentals": ["audit-ai-feature"],
  "boost-productivity":      ["design-prompt-system", "improve-workflow-with-ai"],
  "informed-contributor":    ["run-bias-check", "audit-ai-feature"],
}

// Max difficulty appropriate for each familiarity level
const FAMILIARITY_MAX_DIFF: Record<string, number> = {
  NONE: 0, BASIC: 0, MODERATE: 1, ADVANCED: 2,
}

function sortByChallengeThenDifficulty<T extends { slug: string; difficulty: string }>(
  items: T[],
  challenge: string,
  challengeMap: Record<string, string[]>,
  familiarity: string,
  goals: string[],
  goalsMap: Record<string, string[]>,
): T[] {
  const challengeSlugs = challengeMap[challenge] ?? []
  const goalSlugs = new Set(goals.flatMap(g => goalsMap[g] ?? []))
  const maxDiff = FAMILIARITY_MAX_DIFF[familiarity] ?? 2
  return [...items].sort((a, b) => {
    const aScore = (challengeSlugs.includes(a.slug) ? 2 : 0) + (goalSlugs.has(a.slug) ? 1 : 0)
    const bScore = (challengeSlugs.includes(b.slug) ? 2 : 0) + (goalSlugs.has(b.slug) ? 1 : 0)
    if (aScore !== bScore) return bScore - aScore
    const aDiff = DIFF_ORDER[a.difficulty] ?? 0
    const bDiff = DIFF_ORDER[b.difficulty] ?? 0
    const aFamiliar = aDiff <= maxDiff ? 0 : 1
    const bFamiliar = bDiff <= maxDiff ? 0 : 1
    if (aFamiliar !== bFamiliar) return aFamiliar - bFamiliar
    return aDiff - bDiff
  })
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#65605A", marginBottom: 18 }}>
      <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
      {children}
    </div>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "3px 7px", border: "1px solid #DDDCD9", borderRadius: 999, color: "#65605A", lineHeight: 1, whiteSpace: "nowrap" as const }}>
      {children}
    </span>
  )
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/learn")

  const [user, profile, progress, recentScenarios, recentMissions, dbModules, dbScenarios, dbMissions] = await Promise.all([
    db.user.findUnique({ where: { id: session.user.id } }),
    db.profile.findUnique({ where: { userId: session.user.id } }),
    db.progress.findUnique({ where: { userId: session.user.id } }),
    db.scenarioAttempt.findMany({
      where: { userId: session.user.id },
      include: { scenario: { select: { title: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.missionSubmission.findMany({
      where: { userId: session.user.id },
      include: { mission: { select: { title: true, slug: true } } },
      orderBy: { completedAt: "desc" },
      take: 5,
    }),
    db.module.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    db.scenario.findMany({
      where: { published: true },
      select: { id: true, slug: true, title: true, summary: true, roles: true, difficulty: true },
      orderBy: { createdAt: "asc" },
    }),
    db.mission.findMany({
      where: { published: true },
      select: { id: true, slug: true, title: true, description: true, roles: true, difficulty: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  if (!profile) redirect("/onboarding")

  const userRole = profile.role as string
  const biggestChallenge = (profile.biggestChallenge ?? "") as string
  const aiFamiliarity = (profile.aiFamiliarity ?? "BASIC") as string
  const userGoals = (profile.goals ?? []) as string[]
  const currentPoints = progress?.totalPoints ?? 0
  const level = calculateLevel(currentPoints)
  const levelName = LEVEL_NAMES[level] ?? "Leader"
  const nextLevelPts = level < 4 ? LEVEL_PTS[level + 1] : 600
  const completedModuleIds = progress?.completedModules ?? []
  const completedScenarioIds = progress?.completedScenarios ?? []
  const completedMissionIds = progress?.completedMissions ?? []

  // Modules: role-filtered, difficulty-ordered, first incomplete
  const moduleList = dbModules.length > 0
    ? dbModules.map(m => ({ slug: m.slug, title: m.title, summary: m.summary, difficulty: m.difficulty, roles: m.roles as string[], done: completedModuleIds.includes(m.id) }))
    : sampleModules.map(m => ({ slug: m.slug, title: m.title, summary: m.summary, difficulty: m.difficulty, roles: [...m.roles] as string[], done: completedModuleIds.includes(m.slug) }))

  const nextModule = sortByChallengeThenDifficulty(
    moduleList.filter(m => m.roles.includes(userRole) && !m.done),
    biggestChallenge,
    CHALLENGE_MODULE_SLUGS,
    aiFamiliarity,
    userGoals,
    GOAL_MODULE_SLUGS,
  )[0] ?? null

  // Scenarios: role-filtered, challenge-aware, first incomplete
  const scenarioList = dbScenarios.length > 0
    ? dbScenarios
    : sampleScenarios.map(s => ({ id: s.slug, slug: s.slug, title: s.title, summary: s.summary, roles: [...s.roles] as string[], difficulty: s.difficulty }))

  const nextScenario = sortByChallengeThenDifficulty(
    (scenarioList as Array<{ id: string; slug: string; title: string; summary: string; roles: string[]; difficulty: string }>)
      .filter(s => s.roles.includes(userRole) && !completedScenarioIds.includes(s.id)),
    biggestChallenge,
    CHALLENGE_SCENARIO_SLUGS,
    aiFamiliarity,
    userGoals,
    GOAL_SCENARIO_SLUGS,
  )[0] ?? null

  // Missions: role-filtered, challenge-aware, first incomplete
  const missionList = dbMissions.length > 0
    ? dbMissions.map(m => ({ id: m.id, slug: m.slug, title: m.title, description: m.description, roles: m.roles as string[], difficulty: m.difficulty, done: completedMissionIds.includes(m.id) }))
    : sampleMissions.map(m => ({ id: m.slug, slug: m.slug, title: m.title, description: m.description ?? "", roles: [...m.roles] as string[], difficulty: m.difficulty, done: completedMissionIds.includes(m.slug) }))

  const nextMission = sortByChallengeThenDifficulty(
    missionList.filter(m => m.roles.includes(userRole) && !m.done),
    biggestChallenge,
    CHALLENGE_MISSION_SLUGS,
    aiFamiliarity,
    userGoals,
    GOAL_MISSION_SLUGS,
  )[0] ?? null

  // Combined recent activity
  type ActivityItem = { id: string; type: "scenario" | "mission"; title: string; slug: string; score: number | null; points: number; date: Date }
  const activity: ActivityItem[] = [
    ...recentScenarios.map(a => ({ id: a.id, type: "scenario" as const, title: a.scenario.title, slug: a.scenario.slug, score: a.score, points: a.score ? 50 : 0, date: a.createdAt })),
    ...recentMissions.map(m => ({ id: m.id, type: "mission" as const, title: m.mission.title, slug: m.mission.slug, score: null, points: 40, date: m.completedAt })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)

  // Level track markers
  const trackTicks = [
    { label: "L01 · 0",   pct: 0 },
    { label: "L02 · 100", pct: (100 / 600) * 100 },
    { label: "L03 · 300", pct: (300 / 600) * 100 },
    { label: "L04 · 600", pct: 100 },
  ]
  const fillPct = Math.min(100, (currentPoints / 600) * 100)
  const userName = user?.name?.split(" ")[0] ?? "there"

  return (
    <AppShell>
      {/* Page header */}
      <div style={{ borderBottom: "1px solid #DDDCD9", paddingBottom: 36, marginBottom: 36 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "#65605A", display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
          Dashboard
        </div>
        <h1 className="m-0 font-normal" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 56, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#1A1814" }}>
          Welcome back, {userName}.
        </h1>
        {level < 4 && (
          <p className="mt-6 mb-0" style={{ fontSize: 16, lineHeight: 1.6, color: "#65605A" }}>
            You&apos;re {nextLevelPts - currentPoints} points from L0{level + 1} — {LEVEL_NAMES[level + 1]}.
          </p>
        )}
      </div>

      {/* Progress strip */}
      <div style={{ border: "1px solid #DDDCD9", background: "#F8F7F5", padding: 28, marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "#65605A", marginBottom: 6 }}>
              L0{level} · {levelName.toUpperCase()}
            </div>
            <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 36, lineHeight: 1.05, color: "#1A1814", whiteSpace: "nowrap" }}>
              {currentPoints} / {nextLevelPts} pts
            </div>
          </div>
          {level < 4 && (
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "#65605A", marginBottom: 6 }}>NEXT</div>
              <div style={{ fontSize: 14, color: "#1A1814" }}>L0{level + 1} · {LEVEL_NAMES[level + 1]}</div>
            </div>
          )}
        </div>
        <div style={{ position: "relative", height: 4, background: "#DDDCD9", borderRadius: 2, marginBottom: 10 }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: 4, width: `${fillPct}%`, background: "#1A1814", borderRadius: 2 }} />
          {trackTicks.map((tick, i) => (
            <div key={i} style={{ position: "absolute", left: `${tick.pct}%`, top: -4, width: 12, height: 12, marginLeft: -6, borderRadius: 999, background: tick.pct <= fillPct ? "#1A1814" : "#F0EFEB", border: tick.pct <= fillPct ? "1.5px solid #1A1814" : "1.5px dashed #8A857E" }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#65605A" }}>
          {trackTicks.map(tick => <span key={tick.label}>{tick.label}</span>)}
        </div>
      </div>

      {/* Two-up: next scenario + next module */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginBottom: 24 }}>
        {nextScenario ? (
          <div style={{ border: "1px solid #DDDCD9", padding: 28, background: "#F0EFEB" }}>
            <Kicker>Recommended for you — {userRole}</Kicker>
            <h2 className="m-0 font-normal" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 28, lineHeight: 1.05, color: "#1A1814" }}>
              {nextScenario.title}
            </h2>
            <p style={{ marginTop: 14, color: "#65605A", fontSize: 14, lineHeight: 1.55 }}>{nextScenario.summary}</p>
            <div style={{ marginTop: 18, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A" }}>
              SCENARIO · {nextScenario.roles.join("/")} · {DIFF_LABEL[nextScenario.difficulty] ?? nextScenario.difficulty}
            </div>
            <div style={{ marginTop: 22 }}>
              <Link href={`/scenarios/${nextScenario.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 18px", background: "#1A1814", color: "#F8F7F5", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>
                Start scenario →
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ border: "1px solid #DDDCD9", padding: 28, background: "#F0EFEB" }}>
            <Kicker>Scenarios</Kicker>
            <h2 className="m-0 font-normal" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 28, lineHeight: 1.05, color: "#1A1814" }}>
              All {userRole} scenarios complete.
            </h2>
            <p style={{ marginTop: 14, color: "#65605A", fontSize: 14, lineHeight: 1.55 }}>New scenarios are added regularly. Check back soon.</p>
            <div style={{ marginTop: 22 }}>
              <Link href="/scenarios" style={{ fontSize: 13.5, color: "#65605A", textDecoration: "none" }}>Browse all scenarios →</Link>
            </div>
          </div>
        )}

        {nextModule ? (
          <div style={{ border: "1px solid #DDDCD9", padding: 28, background: "#F8F7F5" }}>
            <Kicker>Recommended module — {userRole}</Kicker>
            <h3 className="m-0 font-normal" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, lineHeight: 1.1, color: "#1A1814" }}>
              {nextModule.title}
            </h3>
            <p style={{ marginTop: 12, fontSize: 13.5, color: "#65605A", lineHeight: 1.55 }}>{nextModule.summary}</p>
            <div style={{ marginTop: 16, display: "flex", gap: 6, flexWrap: "wrap" as const }}>
              <Pill>{DIFF_LABEL[nextModule.difficulty] ?? nextModule.difficulty}</Pill>
            </div>
            <div style={{ marginTop: 20 }}>
              <Link href={`/learn/${nextModule.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "transparent", color: "#1A1814", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none", border: "1px solid #DDDCD9" }}>
                Open module →
              </Link>
            </div>
          </div>
        ) : (
          <div style={{ border: "1px solid #DDDCD9", padding: 28, background: "#F8F7F5" }}>
            <Kicker>Modules</Kicker>
            <h3 className="m-0 font-normal" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, lineHeight: 1.1, color: "#1A1814" }}>
              All {userRole} modules complete.
            </h3>
            <p style={{ marginTop: 12, fontSize: 13.5, color: "#65605A", lineHeight: 1.55 }}>New content is added regularly.</p>
            <div style={{ marginTop: 20 }}>
              <Link href="/learn" style={{ fontSize: 13.5, color: "#65605A", textDecoration: "none" }}>Browse all modules →</Link>
            </div>
          </div>
        )}
      </div>

      {/* Next mission */}
      {nextMission && (
        <div style={{ border: "1px solid #DDDCD9", padding: 28, background: "#F8F7F5", marginBottom: 36 }}>
          <Kicker>Recommended mission — {userRole}</Kicker>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "end" }}>
            <div>
              <h3 className="m-0 font-normal" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 22, lineHeight: 1.1, color: "#1A1814" }}>
                {nextMission.title}
              </h3>
              <p style={{ marginTop: 10, fontSize: 13.5, color: "#65605A", lineHeight: 1.55 }}>{nextMission.description}</p>
              <div style={{ marginTop: 12, display: "flex", gap: 6 }}>
                <Pill>{DIFF_LABEL[nextMission.difficulty] ?? nextMission.difficulty}</Pill>
                <Pill>Mission · +40 pts</Pill>
              </div>
            </div>
            <Link href={`/missions/${nextMission.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "transparent", color: "#1A1814", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none", border: "1px solid #DDDCD9", whiteSpace: "nowrap" as const }}>
              Open mission →
            </Link>
          </div>
        </div>
      )}

      {/* Recent activity */}
      {activity.length > 0 && (
        <div style={{ border: "1px solid #DDDCD9", background: "#F0EFEB", padding: 28 }}>
          <Kicker>Recent activity</Kicker>
          <div>
            {activity.map((item, i) => (
              <div
                key={item.id}
                style={{ display: "grid", gridTemplateColumns: "120px 120px 1fr 80px", gap: 20, padding: "14px 0", borderTop: "1px dashed #DDDCD9", alignItems: "center" }}
              >
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#65605A" }}>
                  {i === 0 ? "Recently" : `${i + 1} items ago`}
                </div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#65605A", textTransform: "uppercase" as const }}>
                  {item.type}
                </div>
                <div style={{ fontSize: 14, color: "#1A1814", fontWeight: 500 }}>
                  <Link href={`/${item.type === "scenario" ? "scenarios" : "missions"}/${item.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {item.title}
                  </Link>
                  {item.type === "scenario" && item.score !== null && (
                    <span style={{ marginLeft: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: "#65605A", letterSpacing: "0.08em" }}>
                      SCORE {item.score}/10
                    </span>
                  )}
                </div>
                <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: "#1A1814", textAlign: "right" }}>
                  {item.points > 0 ? `+${item.points}` : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  )
}
