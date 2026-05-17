import { aiVendorEvaluation } from "./scenarios/ai-vendor-evaluation"
import { aiFeatureScope } from "./scenarios/ai-feature-scope"
import { buildVsBuyDecision } from "./scenarios/build-vs-buy-decision"
import { hallucinatingExecutiveDemo } from "./scenarios/hallucinating-executive-demo"
import { legalComplianceEscalation } from "./scenarios/legal-compliance-escalation"
import { aiTeamCantShip } from "./scenarios/ai-team-cant-ship"
import { brokenPrompt } from "./scenarios/broken-prompt"
import { expensiveAiEndpoint } from "./scenarios/expensive-ai-endpoint"
import { biasedModel } from "./scenarios/biased-model"
import { agentWentRogue } from "./scenarios/agent-went-rogue"
import { enterpriseDataBlocker } from "./scenarios/enterprise-data-blocker"
import { designingTheEval } from "./scenarios/designing-the-eval"
import { promptThatLeaked } from "./scenarios/prompt-that-leaked"
import { silentRollback } from "./scenarios/silent-rollback"
import { aiOrgQuestion } from "./scenarios/ai-org-question"
import { aiFeatureWrongRate } from "./scenarios/ai-feature-wrong-rate"
import { competitorLaunchedAi } from "./scenarios/competitor-launched-ai"
import { writeSuccessMetrics } from "./scenarios/write-success-metrics"
import { pmScopeFight } from "./scenarios/pm-scope-fight"
import { boardAiRoadmap } from "./scenarios/board-ai-roadmap"
import { halfTeamClaudeCode } from "./scenarios/half-team-claude-code"
import { ctoCutJuniors } from "./scenarios/cto-cut-juniors"
import { seniorRefusesAi } from "./scenarios/senior-refuses-ai"
import { securityAuditAiCode } from "./scenarios/security-audit-ai-code"
import { measuringAiToolsValue } from "./scenarios/measuring-ai-tools-value"
import { juniorAiDependence } from "./scenarios/junior-ai-dependence"
import { buildEvalFirst } from "./scenarios/build-eval-first"
import { aiPrSecurityBug } from "./scenarios/ai-pr-security-bug"
import { estimateAiFeature } from "./scenarios/estimate-ai-feature"
import { promptIterationHell } from "./scenarios/prompt-iteration-hell"
import { aiCodeDontUnderstand } from "./scenarios/ai-code-dont-understand"
import { redTeamYourFeature } from "./scenarios/red-team-your-feature"
import { managerWantsVelocity } from "./scenarios/manager-wants-velocity"
import { chatbotNobodyWanted } from "./scenarios/chatbot-nobody-wanted"
import { frozenPrompt } from "./scenarios/frozen-prompt"
import { benchmarkTrap } from "./scenarios/benchmark-trap"
import { autonomyCreep } from "./scenarios/autonomy-creep"

// enabled: true  = visible at launch
// enabled: false = queued for a future wave (toggle via admin)
// isUnlocked (in each file): true = free/no login, false = login required
export const sampleScenarios = [
  // --- FREE (isUnlocked: true) — visible without login ---
  { ...hallucinatingExecutiveDemo, enabled: true  },  // PM/EM  INTERMEDIATE
  { ...aiVendorEvaluation,         enabled: true  },  // PM     INTERMEDIATE
  { ...brokenPrompt,               enabled: true  },  // IC     INTERMEDIATE
  { ...agentWentRogue,             enabled: true  },  // EM/IC  ADVANCED

  // --- LOGIN REQUIRED (isUnlocked: false) ---
  { ...buildEvalFirst,             enabled: true  },  // EM     INTERMEDIATE
  { ...seniorRefusesAi,            enabled: true  },  // EM     INTERMEDIATE
  { ...juniorAiDependence,         enabled: true  },  // EM     INTERMEDIATE
  { ...competitorLaunchedAi,       enabled: true  },  // PM     INTERMEDIATE
  { ...boardAiRoadmap,             enabled: true  },  // PM     ADVANCED
  { ...ctoCutJuniors,              enabled: true  },  // EM     ADVANCED
  { ...halfTeamClaudeCode,         enabled: true  },  // EM     INTERMEDIATE
  { ...aiPrSecurityBug,            enabled: true  },  // IC     INTERMEDIATE
  { ...expensiveAiEndpoint,        enabled: true  },  // EM/IC  INTERMEDIATE
  { ...designingTheEval,           enabled: true  },  // EM/IC  ADVANCED
  { ...chatbotNobodyWanted,        enabled: true  },  // EM     INTERMEDIATE
  { ...autonomyCreep,              enabled: true  },  // EM     ADVANCED

  // --- FUTURE WAVES ---
  { ...aiFeatureScope,             enabled: false },
  { ...buildVsBuyDecision,         enabled: false },
  { ...biasedModel,                enabled: false },
  { ...legalComplianceEscalation,  enabled: false },
  { ...aiOrgQuestion,              enabled: false },
  { ...promptThatLeaked,           enabled: false },
  { ...enterpriseDataBlocker,      enabled: false },
  { ...silentRollback,             enabled: false },
  { ...aiFeatureWrongRate,         enabled: false },
  { ...writeSuccessMetrics,        enabled: false },
  { ...pmScopeFight,               enabled: false },
  { ...aiTeamCantShip,             enabled: false },
  { ...securityAuditAiCode,        enabled: false },
  { ...measuringAiToolsValue,      enabled: false },
  { ...estimateAiFeature,          enabled: false },
  { ...promptIterationHell,        enabled: false },
  { ...aiCodeDontUnderstand,       enabled: false },
  { ...redTeamYourFeature,         enabled: false },
  { ...managerWantsVelocity,       enabled: false },
  { ...frozenPrompt,               enabled: false },
  { ...benchmarkTrap,              enabled: false },
]
