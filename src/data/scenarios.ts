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

// enabled: true  = visible at launch
// enabled: false = queued for a future wave (toggle via admin)
export const sampleScenarios = [
  { ...hallucinatingExecutiveDemo, enabled: true  },
  { ...aiVendorEvaluation,         enabled: true  },
  { ...brokenPrompt,               enabled: true  },
  { ...aiFeatureScope,             enabled: false },
  { ...buildVsBuyDecision,         enabled: false },
  { ...biasedModel,                enabled: false },
  { ...legalComplianceEscalation,  enabled: false },
  { ...agentWentRogue,             enabled: false },
  { ...designingTheEval,           enabled: false },
  { ...expensiveAiEndpoint,        enabled: false },
  { ...aiTeamCantShip,             enabled: false },
  { ...aiOrgQuestion,              enabled: false },
  { ...promptThatLeaked,           enabled: false },
  { ...enterpriseDataBlocker,      enabled: false },
  { ...silentRollback,             enabled: false },
]
