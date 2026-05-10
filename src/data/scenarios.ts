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

export const sampleScenarios = [
  aiVendorEvaluation,
  aiFeatureScope,
  buildVsBuyDecision,
  hallucinatingExecutiveDemo,
  legalComplianceEscalation,
  aiTeamCantShip,
  brokenPrompt,
  expensiveAiEndpoint,
  biasedModel,
  agentWentRogue,
  enterpriseDataBlocker,
  designingTheEval,
  promptThatLeaked,
  silentRollback,
  aiOrgQuestion,
]
