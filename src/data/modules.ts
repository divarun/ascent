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
import { writingAiFeatureBriefs } from "./modules/writing-ai-feature-briefs"
import { evaluatingAiVendorPitches } from "./modules/evaluating-ai-vendor-pitches"
import { aiMediatedDiscovery } from "./modules/ai-mediated-discovery"
import { measuringAiTeamImpact } from "./modules/measuring-ai-team-impact"
import { aiHeadcountQuestion } from "./modules/ai-headcount-question"
import { governingAiGeneratedCode } from "./modules/governing-ai-generated-code"
import { redTeamingAiFeatures } from "./modules/red-teaming-ai-features"
import { icJudgmentAndTaste } from "./modules/ic-judgment-and-taste"
import { aiTechnicalDebt } from "./modules/ai-technical-debt"
import { contextEngineeringForTeams } from "./modules/context-engineering-for-teams"
import { readingModelBenchmarks } from "./modules/reading-model-benchmarks"
import { pmRoleAfterAi } from "./modules/pm-role-after-ai"
import { growingJuniorEngineers } from "./modules/growing-junior-engineers"
import { usingAiWithoutLosingYourEdge } from "./modules/using-ai-without-losing-your-edge"

// enabled: true  = visible at launch
// enabled: false = queued for a future wave (toggle via admin)
export const sampleModules = [
  { ...whatAiIs,                              enabled: true },
  { ...aiBuildingBlocks,                      enabled: true },
  { ...whatLlmsActuallyDo,                    enabled: true },
  { ...whatAiIsBadAt,                         enabled: true },
  { ...promptingIsNotProgramming,             enabled: true },
  { ...modelSelectionBasics,                  enabled: true },
  { ...buildVsBuy,                            enabled: true },
  { ...aiProductFailureModes,                 enabled: true },
  { ...aiUxHumanInTheLoop,                    enabled: true },
  { ...ragContextMemory,                      enabled: true },
  { ...agenticAi,                             enabled: true },
  { ...fineTuningModelCustomization,          enabled: true },
  { ...aiEthicsBias,                          enabled: true },
  { ...dataPrivacyAiGovernance,               enabled: true },
  { ...aiSecurityPromptInjection,             enabled: true },
  { ...aiEvaluationReliability,               enabled: true },
  { ...aiInProductionMonitoringObservability, enabled: true },
  { ...buildingReliableAiFeatures,            enabled: true },
  { ...measuringAiRoi,                        enabled: true },
  { ...leadingAiAtOrgLevel,                   enabled: true },
  { ...aiEconomicsScaling,                    enabled: true },
  { ...aiCodingAssistants,                    enabled: true },
  { ...writingAiFeatureBriefs,                enabled: true },
  { ...evaluatingAiVendorPitches,             enabled: true },
  { ...aiMediatedDiscovery,                   enabled: true },
  { ...measuringAiTeamImpact,                 enabled: true },
  { ...aiHeadcountQuestion,                   enabled: true },
  { ...governingAiGeneratedCode,              enabled: true },
  { ...redTeamingAiFeatures,                  enabled: true },
  { ...icJudgmentAndTaste,                    enabled: true },
  { ...aiTechnicalDebt,                       enabled: true },
  { ...contextEngineeringForTeams,            enabled: true },
  { ...readingModelBenchmarks,                enabled: true },
  { ...pmRoleAfterAi,                         enabled: true },
  { ...growingJuniorEngineers,                enabled: true },
  { ...usingAiWithoutLosingYourEdge,          enabled: true },
]
