/**
 * Rules-based Decision Readiness Profile scoring.
 * No AI required.
 */

export interface OnboardingData {
  role: "PM" | "EM" | "IC"
  companyStage: string
  industry: string
  aiFamiliarity: "NONE" | "BASIC" | "MODERATE" | "ADVANCED"
  biggestChallenge: string
  goals: string[]
}

export interface ReadinessProfile {
  conceptualScore: number    // Understanding of AI/ML concepts
  vendorScore: number        // Ability to evaluate AI vendors/tools
  workflowScore: number      // Workflow design and integration
  executionScore: number     // Execution and implementation
}

const familiarityScores: Record<string, number> = {
  NONE: 1,
  BASIC: 2,
  MODERATE: 3,
  ADVANCED: 4,
}

const challengeWeights: Record<string, keyof ReadinessProfile> = {
  "understanding-ai": "conceptualScore",
  "evaluating-tools": "vendorScore",
  "implementing-workflows": "workflowScore",
  "leading-ai-initiatives": "executionScore",
  "measuring-roi": "executionScore",
  "team-adoption": "workflowScore",
}

export function computeReadinessProfile(data: OnboardingData): ReadinessProfile {
  const base = familiarityScores[data.aiFamiliarity] ?? 1

  // Base scores from familiarity
  const scores: ReadinessProfile = {
    conceptualScore: base,
    vendorScore: Math.max(1, base - 1),
    workflowScore: Math.max(1, base - 1),
    executionScore: Math.max(1, base - 2),
  }

  // Role adjustments
  if (data.role === "EM") {
    scores.executionScore = Math.min(5, scores.executionScore + 1)
    scores.workflowScore = Math.min(5, scores.workflowScore + 1)
  }
  if (data.role === "PM") {
    scores.vendorScore = Math.min(5, scores.vendorScore + 1)
  }
  if (data.role === "IC") {
    scores.conceptualScore = Math.min(5, scores.conceptualScore + 1)
    scores.workflowScore = Math.min(5, scores.workflowScore + 1)
  }

  // Challenge adjustment — boost the area they're focused on
  const challengeArea = challengeWeights[data.biggestChallenge]
  if (challengeArea) {
    // They're aware of it, slight boost from focused attention
    scores[challengeArea] = Math.min(5, scores[challengeArea] + 1)
  }

  // Goals adjustment — if they mention execution-oriented goals
  const executionGoals = ["implement-ai", "lead-initiative", "build-roadmap"]
  const hasExecutionGoal = data.goals.some((g) => executionGoals.includes(g))
  if (hasExecutionGoal) {
    scores.executionScore = Math.min(5, scores.executionScore + 1)
  }

  return scores
}
