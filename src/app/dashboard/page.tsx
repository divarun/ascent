import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { AppShell } from "@/components/layout/AppShell"
import { calculateLevel, getLevelLabel, DIFFICULTY_ORDER } from "@/lib/utils"
import { SCORING, getPoints } from "@/config/scoring"
import Link from "next/link"
import { sampleModules } from "@/data/modules"
import { sampleScenarios } from "@/data/scenarios"
import { sampleMissions } from "@/data/missions"

const DIFF_LABEL: Record<string, string> = { BEGINNER: "Beginner", INTERMEDIATE: "Intermediate", ADVANCED: "Advanced" }

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
    const aDiff = DIFFICULTY_ORDER[a.difficulty] ?? 0
    const bDiff = DIFFICULTY_ORDER[b.difficulty] ?? 0
    const aFamiliar = aDiff <= maxDiff ? 0 : 1
    const bFamiliar = bDiff <= maxDiff ? 0 : 1
    if (aFamiliar !== bFamiliar) return aFamiliar - bFamiliar
    return aDiff - bDiff
  })
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#65605A" }}>
      <span style={{ width: 16, height: 1, background: "#65605A", display: "inline-block" }} />
      {children}
    </div>
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
      include: { scenario: { select: { title: true, slug: true, difficulty: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    db.missionSubmission.findMany({
      where: { userId: session.user.id },
      include: { mission: { select: { title: true, slug: true, difficulty: true } } },
      orderBy: { completedAt: "desc" },
      take: 5,
    }),
    db.module.findMany({ where: { published: true, enabled: true }, orderBy: { order: "asc" } }),
    db.scenario.findMany({
      where: { published: true, enabled: true },
      select: { id: true, slug: true, title: true, summary: true, roles: true, difficulty: true },
      orderBy: { createdAt: "asc" },
    }),
    db.mission.findMany({
      where: { published: true, enabled: true },
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
  const levelName = getLevelLabel(level)
  const nextLevelPts = SCORING.levels.find((l) => l.level === level + 1)?.minPoints
    ?? SCORING.levels[SCORING.levels.length - 1].minPoints
  const ptsToNext = nextLevelPts - currentPoints
  const completedModuleIds = progress?.completedModules ?? []
  const completedScenarioIds = progress?.completedScenarios ?? []
  const completedMissionIds = progress?.completedMissions ?? []

  const moduleList = dbModules.length > 0
    ? dbModules.map(m => ({ slug: m.slug, title: m.title, summary: m.summary, difficulty: m.difficulty, roles: m.roles as string[], done: completedModuleIds.includes(m.id) }))
    : sampleModules.filter(m => m.enabled).map(m => ({ slug: m.slug, title: m.title, summary: m.summary, difficulty: m.difficulty, roles: [...m.roles] as string[], done: completedModuleIds.includes(m.slug) }))

  const nextModule = sortByChallengeThenDifficulty(
    moduleList.filter(m => m.roles.includes(userRole) && !m.done),
    biggestChallenge, CHALLENGE_MODULE_SLUGS, aiFamiliarity, userGoals, GOAL_MODULE_SLUGS,
  )[0] ?? null

  const scenarioList = dbScenarios.length > 0
    ? dbScenarios
    : sampleScenarios.filter(s => s.enabled).map(s => ({ id: s.slug, slug: s.slug, title: s.title, summary: s.summary, roles: [...s.roles] as string[], difficulty: s.difficulty }))

  const nextScenario = sortByChallengeThenDifficulty(
    (scenarioList as Array<{ id: string; slug: string; title: string; summary: string; roles: string[]; difficulty: string }>)
      .filter(s => s.roles.includes(userRole) && !completedScenarioIds.includes(s.id)),
    biggestChallenge, CHALLENGE_SCENARIO_SLUGS, aiFamiliarity, userGoals, GOAL_SCENARIO_SLUGS,
  )[0] ?? null

  const missionList = dbMissions.length > 0
    ? dbMissions.map(m => ({ id: m.id, slug: m.slug, title: m.title, description: m.description, roles: m.roles as string[], difficulty: m.difficulty, done: completedMissionIds.includes(m.id) }))
    : sampleMissions.filter(m => m.enabled).map(m => ({ id: m.slug, slug: m.slug, title: m.title, description: m.description ?? "", roles: [...m.roles] as string[], difficulty: m.difficulty, done: completedMissionIds.includes(m.slug) }))

  const nextMission = sortByChallengeThenDifficulty(
    missionList.filter(m => m.roles.includes(userRole) && !m.done),
    biggestChallenge, CHALLENGE_MISSION_SLUGS, aiFamiliarity, userGoals, GOAL_MISSION_SLUGS,
  )[0] ?? null

  // Full scenario data (with prompts) from sampleScenarios for the hero
  const fullNextScenario = nextScenario
    ? sampleScenarios.find(s => s.slug === nextScenario.slug) ?? null
    : null

  type ActivityItem = { id: string; type: "scenario" | "mission"; title: string; slug: string; score: number | null; points: number; date: Date }
  const activity: ActivityItem[] = [
    ...recentScenarios.map(a => ({ id: a.id, type: "scenario" as const, title: a.scenario.title, slug: a.scenario.slug, score: a.score, points: a.score !== null ? getPoints("scenario", a.scenario.difficulty) : 0, date: a.createdAt })),
    ...recentMissions.map(m => ({ id: m.id, type: "mission" as const, title: m.mission.title, slug: m.mission.slug, score: null, points: getPoints("mission", m.mission.difficulty), date: m.completedAt })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4)

  const userName = user?.name?.split(" ")[0] ?? "there"

  // Ridge bar visual for compact strip (proportional fill)
  const ridgeHeights = [4, 6, 8, 10, 12, 14, 16, 18, 14, 10, 6, 10, 14, 18, 16, 12]
  const fillBars = Math.round((currentPoints / (nextLevelPts || 600)) * ridgeHeights.length)

  return (
    <AppShell>
      {/* Page header */}
      <div style={{ borderBottom: "1px solid #DDDCD9", paddingBottom: 24, marginBottom: 24 }}>
        <Kicker>Dashboard · {userRole}</Kicker>
        <h1 className="m-0 font-normal" style={{ fontFamily: '"Instrument Serif", serif', fontSize: 44, lineHeight: 1.08, letterSpacing: "-0.02em", color: "#1A1814", marginTop: 18 }}>
          A decision is waiting.
        </h1>
        <p style={{ marginTop: 14, marginBottom: 0, fontSize: 16, lineHeight: 1.6, color: "#65605A" }}>
          {level < 4
            ? `Pick one up. You're ${ptsToNext} point${ptsToNext === 1 ? "" : "s"} from ${getLevelLabel(level + 1)} — but that's not the point. The reps are.`
            : `You've reached Leader. Keep going — new content is added regularly.`}
        </p>
      </div>

      {/* Compact status strip */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        border: "1px solid #DDDCD9",
        background: "#F8F7F5",
        marginBottom: 24,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 11,
        letterSpacing: "0.12em",
        color: "#65605A",
        textTransform: "uppercase",
        gap: 16,
        flexWrap: "wrap" as const,
      }}>
        <span><strong style={{ color: "#1A1814" }}>L0{level}</strong> · {levelName}</span>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 18 }} aria-hidden>
          {ridgeHeights.map((h, i) => (
            <span key={i} style={{
              display: "block",
              width: 4,
              height: h,
              background: i < fillBars ? "#1A1814" : "#DDDCD9",
              borderRadius: 1,
            }} />
          ))}
        </div>
        <span>
          {currentPoints} <strong style={{ color: "#1A1814" }}>/ {nextLevelPts} PTS</strong>
          {level < 4 && ` · ${ptsToNext} to ${getLevelLabel(level + 1)} →`}
        </span>
      </div>

      {/* Decision-forward hero scenario */}
      {nextScenario && (
        <div style={{
          border: "1px solid #1A1814",
          background: "#F8F7F5",
          padding: "40px 44px 36px",
          position: "relative",
          marginBottom: 28,
        }}>
          <div style={{ position: "absolute", left: -1, top: -1, bottom: -1, width: 3, background: "#1A1814" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18, fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.14em", color: "#65605A", textTransform: "uppercase" }}>
            <span>— Recommended scenario · for you</span>
            <span>{nextScenario.roles.join("/")} · {DIFF_LABEL[nextScenario.difficulty] ?? nextScenario.difficulty}</span>
          </div>
          <h2 style={{ margin: 0, fontFamily: '"Instrument Serif", serif', fontWeight: 400, fontSize: 44, lineHeight: 1.04, letterSpacing: "-0.02em", color: "#1A1814" }}>
            {nextScenario.title}
          </h2>
          <div style={{ marginTop: 18, padding: "16px 20px", background: "#F0EFEB", borderLeft: "2px solid #1A1814", fontSize: 14.5, lineHeight: 1.6, color: "#1A1814", maxWidth: 680 }}>
            <em style={{ fontStyle: "italic", color: "#65605A" }}>The situation — </em>
            {nextScenario.summary}
          </div>
          {fullNextScenario?.prompts && fullNextScenario.prompts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3" style={{ marginTop: 24, gap: 18, borderTop: "1px dashed #DDDCD9", paddingTop: 20 }}>
              {fullNextScenario.prompts.slice(0, 3).map((p, i) => (
                <div key={p.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", color: "#65605A", textTransform: "uppercase" }}>Prompt 0{i + 1}</span>
                  <span style={{ fontSize: 13.5, lineHeight: 1.45, color: "#1A1814" }}>{p.question}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 14 }}>
            <Link href={`/scenarios/${nextScenario.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 22px", background: "#1A1814", color: "#F8F7F5", borderRadius: 4, fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}>
              Open scenario →
            </Link>
            <span style={{ fontSize: 12.5, color: "#65605A", maxWidth: 380, lineHeight: 1.5 }}>
              Picked for your role as {userRole}.
            </span>
          </div>
        </div>
      )}

      {/* 3-column queue */}
      {(nextModule || nextMission) && (
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ border: "1px solid #DDDCD9", background: "#F0EFEB", marginBottom: 28 }}>
          {nextModule ? (
            <Link href={`/learn/${nextModule.slug}`} className="border-b md:border-b-0 md:border-r border-border" style={{ padding: "22px 22px", textDecoration: "none", display: "block" }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", marginBottom: 10 }}>— Up next module</div>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 20, lineHeight: 1.1, letterSpacing: "-0.01em", color: "#1A1814", marginBottom: 8 }}>{nextModule.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "#65605A", marginBottom: 14, minHeight: 38 }}>{nextModule.summary}</div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#1A1814", textTransform: "uppercase" }}>Open module →</span>
            </Link>
          ) : (
            <Link href="/learn" className="border-b md:border-b-0 md:border-r border-border" style={{ padding: "22px 22px", textDecoration: "none", display: "block" }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", marginBottom: 10 }}>— Modules</div>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 20, lineHeight: 1.1, letterSpacing: "-0.01em", color: "#1A1814", marginBottom: 8 }}>All {userRole} modules complete.</div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A", textTransform: "uppercase" }}>Browse all →</span>
            </Link>
          )}
          {nextMission ? (
            <Link href={`/missions/${nextMission.slug}`} className="border-b md:border-b-0 md:border-r border-border" style={{ padding: "22px 22px", textDecoration: "none", display: "block" }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", marginBottom: 10 }}>— Next mission</div>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 20, lineHeight: 1.1, letterSpacing: "-0.01em", color: "#1A1814", marginBottom: 8 }}>{nextMission.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: "#65605A", marginBottom: 14, minHeight: 38 }}>{nextMission.description}</div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#1A1814", textTransform: "uppercase" }}>+{getPoints("mission", nextMission.difficulty)} pts · open →</span>
            </Link>
          ) : (
            <Link href="/missions" className="border-b md:border-b-0 md:border-r border-border" style={{ padding: "22px 22px", textDecoration: "none", display: "block" }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", marginBottom: 10 }}>— Missions</div>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontSize: 20, lineHeight: 1.1, letterSpacing: "-0.01em", color: "#1A1814", marginBottom: 8 }}>All {userRole} missions complete.</div>
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.1em", color: "#65605A", textTransform: "uppercase" }}>Browse all →</span>
            </Link>
          )}
          {/* Third column: browse links */}
          <div style={{ padding: "22px 22px" }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "#65605A", marginBottom: 10 }}>— Browse all</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Foundation", href: "/learn" },
                { label: "Scenarios", href: "/scenarios" },
                { label: "Missions", href: "/missions" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} style={{ fontFamily: '"Instrument Serif", serif', fontSize: 18, lineHeight: 1.1, letterSpacing: "-0.01em", color: "#1A1814", textDecoration: "none" }}>
                  {label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent activity */}
      {activity.length > 0 && (
        <div style={{ border: "1px solid #DDDCD9", background: "#F0EFEB", padding: "22px 24px" }}>
          <Kicker>Recent activity · last {activity.length}</Kicker>
          <div style={{ marginTop: 8 }}>
            {activity.map((item, i) => (
              <div
                key={item.id}
                className="grid [grid-template-columns:1fr_80px] md:[grid-template-columns:120px_120px_1fr_80px]"
                style={{ gap: 20, padding: "14px 0", borderTop: "1px dashed #DDDCD9", alignItems: "center" }}
              >
                <div className="hidden md:block" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#65605A" }}>
                  {i === 0 ? "RECENTLY" : `${i + 1} ITEMS AGO`}
                </div>
                <div className="hidden md:block" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: "0.08em", color: "#65605A", textTransform: "uppercase" }}>
                  {item.type}
                </div>
                <div style={{ fontSize: 14, color: "#1A1814", fontWeight: 500, minWidth: 0 }}>
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
