import { whatAiIs } from "./modules/what-is-ai"
import { aiBuildingBlocks } from "./modules/ai-building-blocks"
import { whatLlmsActuallyDo } from "./modules/what-llms-actually-do"
import { whatAiIsBadAt } from "./modules/what-ai-is-bad-at"
import { promptingIsNotProgramming } from "./modules/prompting-is-not-programming"
import { modelSelectionBasics } from "./modules/model-selection-basics"
import { buildVsBuy } from "./modules/build-vs-buy"
import { aiProductFailureModes } from "./modules/ai-product-failure-modes"
import { aiUxHumanInTheLoop } from "./modules/ai-ux-human-in-the-loop"
import { ragContextMemory } from "./modules/rag-context-memory"
import { agenticAi } from "./modules/agentic-ai"
import { fineTuningModelCustomization } from "./modules/fine-tuning-model-customization"
import { aiEthicsBias } from "./modules/ai-ethics-bias"
import { dataPrivacyAiGovernance } from "./modules/data-privacy-ai-governance"
import { aiSecurityPromptInjection } from "./modules/ai-security-prompt-injection"
import { aiEvaluationReliability } from "./modules/ai-evaluation-reliability"
import { aiInProductionMonitoringObservability } from "./modules/ai-in-production-monitoring-observability"
import { buildingReliableAiFeatures } from "./modules/building-reliable-ai-features"
import { measuringAiRoi } from "./modules/measuring-ai-roi"
import { leadingAiAtOrgLevel } from "./modules/leading-ai-at-org-level"
import { aiEconomicsScaling } from "./modules/ai-economics-scaling"
import { aiCodingAssistants } from "./modules/ai-coding-assistants"

// enabled: true  = visible at launch
// enabled: false = queued for a future wave (toggle via admin)
export const sampleModules = [
  { ...whatAiIs,                           enabled: true  },
  { ...aiBuildingBlocks,                   enabled: true  },
  { ...whatLlmsActuallyDo,                 enabled: true  },
  { ...whatAiIsBadAt,                      enabled: true  },
  { ...promptingIsNotProgramming,          enabled: true  },
  { ...modelSelectionBasics,               enabled: false },
  { ...buildVsBuy,                         enabled: false },
  { ...aiProductFailureModes,              enabled: false },
  { ...aiUxHumanInTheLoop,                 enabled: false },
  { ...ragContextMemory,                   enabled: false },
  { ...agenticAi,                          enabled: false },
  { ...fineTuningModelCustomization,       enabled: false },
  { ...aiEthicsBias,                       enabled: false },
  { ...dataPrivacyAiGovernance,            enabled: false },
  { ...aiSecurityPromptInjection,          enabled: false },
  { ...aiEvaluationReliability,            enabled: false },
  { ...aiInProductionMonitoringObservability, enabled: false },
  { ...buildingReliableAiFeatures,         enabled: false },
  { ...measuringAiRoi,                     enabled: false },
  { ...leadingAiAtOrgLevel,                enabled: false },
  { ...aiEconomicsScaling,                 enabled: false },
  { ...aiCodingAssistants,                 enabled: false },
]
