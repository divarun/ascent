export const improveWorkflowWithAi = {
  slug: "improve-workflow-with-ai",
  title: "Improve an Existing Workflow with AI",
  isUnlocked: true,
  description:
    "Redesign a real workflow with AI augmentation — and define how you'd know if it worked.",
  roles: ["IC", "PM", "EM"] as const,
  difficulty: "BEGINNER" as const,
  instructions: `## Mission: Improve an Existing Workflow with AI

The hardest part of AI adoption isn't the technology — it's knowing which workflows to redesign, where AI fits, and where human judgment should stay.

Pick a real workflow from your current job. Map it as it works today. Then redesign it with AI augmentation and define how you'd measure whether the new version is actually better.

### Step 1: Map the current workflow

Describe the workflow step-by-step. Not vague ("we review documents") — concrete ("engineer reads a PR description, checks 3 criteria, leaves a comment, assigns reviewer"). Include:
- Who does each step
- How long it takes
- Where errors happen or quality is inconsistent
- What makes it tedious at scale

### Step 2: Identify the AI opportunity

Where in this workflow could AI meaningfully help? Be specific:
- Draft → human reviews (AI writes first, human edits or approves)
- Flag → human decides (AI surfaces anomalies or patterns, human acts)
- Classify → route (AI categorizes, system routes, human handles exceptions)
- Summarize → human uses (AI compresses information, human applies judgment)

**Augmentation vs. replacement:** AI should augment human judgment where judgment is valuable. It should replace human effort where the task is mechanical and errors are cheap to catch. Be explicit about which you're doing and why.

### Step 3: Redesign the workflow

Describe the new workflow step-by-step. Show what changes, what stays the same, and where humans remain in the loop. Be specific about:
- What the AI receives as input
- What the AI produces as output
- What a human does with that output
- What happens when the AI output is wrong or low-confidence

### Step 4: Define measurable leverage

How would you know the redesigned workflow is better? Define 2–3 specific metrics. Examples:
- Time per task (before: 45 min, target: 15 min)
- Error rate (before: 12% rework rate, target: <5%)
- Throughput (before: 8 reviews/day/person, target: 20)
- Coverage (before: 30% of documents reviewed, target: 100% with AI triage)

At least one metric should be measurable without waiting months. What would you check in the first two weeks to know if it's working?

### Step 5: Acknowledge one risk

Where is this most likely to go wrong? What's the failure mode you'd watch for?`,
  staticGuidance: `The most common mistake in workflow redesign: jumping straight to "AI does this step" without mapping what the step actually involves. Workflows that look simple are often load-bearing in unexpected ways — the manual step you want to automate is where a human catches edge cases that would cause downstream failures.

**What separates strong submissions:**

The augmentation/replacement distinction matters in practice. Workflows where AI drafts and a human reviews have much higher adoption and fewer failure modes than workflows where AI replaces the human entirely. The extra friction of human review catches errors and builds appropriate trust in the AI output. Don't propose full replacement unless you can explain why the errors are cheap to miss.

Measurable leverage is the hardest part to get right. Teams often define metrics that sound measurable but aren't: "quality improves," "team feels less burdened," "faster than before." Useful metrics have a current baseline, a target, and a way to collect data in the first two weeks.

The failure mode you acknowledge should be specific. "The AI makes mistakes" is not a failure mode. "The AI misclassifies tickets where the user describes a billing issue using technical language, causing them to wait 48 hours for a response instead of 4 hours" is. Specific failure modes lead to specific mitigations.

AI adds the most leverage where:
- The task is high-frequency and follows patterns
- The human is currently doing something tedious that doesn't require their best judgment
- Errors are visible and correctable before they compound
- The time saved is large enough that even partial success has clear value`,
  checklist: [
    "Current workflow is described step-by-step with who does each step and how long it takes",
    "AI's specific role is named (draft, flag, classify, summarize) — not just 'AI helps with'",
    "Augmentation vs. replacement is explicitly addressed with reasoning",
    "Redesigned workflow shows what changes, what stays human, and what happens when AI is wrong",
    "2–3 specific metrics defined with current baseline and target",
    "At least one failure mode is identified and described specifically",
  ],
  staticFeedback: {
    assessment: "Strong redesigns describe the current workflow step-by-step with time costs, name the AI's exact role, and address augmentation vs. replacement explicitly. The metrics section is where most submissions are weakest — useful metrics have a current baseline, not just a target.",
    highlights: [
      "Describing the current workflow in enough detail that someone else could follow it",
      "Naming AI's role specifically rather than describing it as a general assist",
    ],
    suggestions: [
      "If you proposed full replacement, revisit — augmentation (AI drafts, human approves) has higher adoption and fewer failure modes for most workflows",
      "Add a current baseline to each metric so you can measure improvement after two weeks of running the redesigned workflow",
    ],
    nextSteps: [
      "Run the redesigned workflow on one real task this week before committing to a full rollout",
      "Define what 'good enough for week one' looks like so you don't optimize prematurely before you have real usage data",
    ],
  },
}