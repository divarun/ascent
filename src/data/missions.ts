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


export const sampleMissions = [
  identifyAiWorkflow,
  draftAiPolicy,
  evaluateVendorClaim,
  createAiEvaluationPlan,
  redTeamAiWorkflow,
  improveWorkflowWithAi,
  designPromptSystem,
  runBiasCheck,
  writeAiFeatureBrief,
  writeAiPostmortem,
  auditAiFeature,
  communicateAiDecision,
]
