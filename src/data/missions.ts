import { identifyAiWorkflow } from "./missions/identify-ai-workflow"
import { draftAiPolicy } from "./missions/draft-ai-policy"
import { evaluateVendorClaim } from "./missions/evaluate-vendor-claim"
import { createAiEvaluationPlan } from "./missions/create-ai-evaluation-plan"
import { redTeamAiWorkflow } from "./missions/red-team-ai-workflow"
import { improveWorkflowWithAi } from "./missions/improve-workflow-with-ai"
import { designPromptSystem } from "./missions/design-prompt-system"
import { runBiasCheck } from "./missions/run-bias-check"
import { writeAiFeatureBrief } from "./missions/write-ai-feature-brief"
import { writeAiPostmortem } from "./missions/write-ai-postmortem"
import { auditAiFeature } from "./missions/audit-ai-feature"
import { communicateAiDecision } from "./missions/communicate-ai-decision"
import { writeAiPremortem } from "./missions/write-ai-premortem"
import { draftAiProductPrinciples } from "./missions/draft-ai-product-principles"
import { auditTeamAiUsage } from "./missions/audit-team-ai-usage"
import { mapAiSkillGaps } from "./missions/map-ai-skill-gaps"
import { dependencyAuditAiCode } from "./missions/dependency-audit-ai-code"
import { draftPersonalAiPolicy } from "./missions/draft-personal-ai-policy"
import { writePromptPlaybook } from "./missions/write-prompt-playbook"
import { evaluateVendorBenchmark } from "./missions/evaluate-vendor-benchmark"
import { designHitlProtocol } from "./missions/design-hitl-protocol"

// enabled: true  = visible at launch
// enabled: false = queued for a future wave (toggle via admin)
// isUnlocked (in each file): true = free/no login, false = login required
export const sampleMissions = [
  // --- FREE (isUnlocked: true) — all BEGINNER, all roles ---
  { ...identifyAiWorkflow,       enabled: true  },  // PM/EM/IC  BEGINNER
  { ...improveWorkflowWithAi,    enabled: true  },  // PM/EM/IC  BEGINNER
  { ...auditAiFeature,           enabled: true  },  // EM        BEGINNER
  { ...draftAiPolicy,            enabled: true  },  // PM/EM/IC  INTERMEDIATE

  // --- LOGIN REQUIRED (isUnlocked: false) ---
  { ...evaluateVendorClaim,      enabled: true  },  // PM        ADVANCED
  { ...writeAiFeatureBrief,      enabled: true  },  // PM        INTERMEDIATE
  { ...writeAiPremortem,         enabled: true  },  // PM        INTERMEDIATE
  { ...createAiEvaluationPlan,   enabled: true  },  // PM/EM/IC  INTERMEDIATE
  { ...designPromptSystem,       enabled: true  },  // IC        INTERMEDIATE

  // --- FUTURE WAVES ---
  { ...redTeamAiWorkflow,        enabled: false },
  { ...runBiasCheck,             enabled: false },
  { ...writeAiPostmortem,        enabled: false },
  { ...communicateAiDecision,    enabled: false },
  { ...draftAiProductPrinciples, enabled: false },
  { ...auditTeamAiUsage,         enabled: false },
  { ...mapAiSkillGaps,           enabled: false },
  { ...dependencyAuditAiCode,    enabled: false },
  { ...draftPersonalAiPolicy,    enabled: false },
  { ...writePromptPlaybook,      enabled: false },
  { ...evaluateVendorBenchmark,  enabled: false },
  { ...designHitlProtocol,       enabled: false },
]
