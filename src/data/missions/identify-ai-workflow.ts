export const identifyAiWorkflow = {
  slug: "identify-ai-workflow",
  title: "Find the AI Opportunity",
  isUnlocked: true,
  description:
    "Identify one workflow in your current work that AI could meaningfully augment.",
  roles: ["PM", "EM", "IC"] as const,
  difficulty: "BEGINNER" as const,
  instructions: `## Mission: Find the AI Opportunity

Your task is to identify one specific workflow in your current work where AI could meaningfully augment what you or your team already does.

**This is not about automation.** We're looking for augmentation — where AI makes a human decision or process better, faster, or more informed.

### Your submission should cover:

**1. The workflow**
Describe the workflow in detail. What happens, who does it, how often, how long does it take?

**2. The pain point**
What's tedious, slow, error-prone, or inconsistent about it today?

**3. The AI opportunity**
Where specifically could AI help? Be concrete — "AI writes the first draft" or "AI flags anomalies for human review" is better than "AI helps with the process."

**4. The risks**
What could go wrong? Where does human judgment still need to be in the loop?

**5. The test**
How would you know if the AI augmentation actually worked? What would you measure?

### Good examples of AI augmentation:
- Engineering Manager: "I review 15-20 PRs per week. AI pre-review could flag potential issues before I look, reducing my cognitive load without removing my judgment."
- Product Manager: "I synthesize 50+ customer interviews per quarter. AI could draft the themes and I'd validate — cutting synthesis time from 8 hours to 2."

### What makes a strong submission:
- Specific, not vague
- Honest about risks
- Clear measurement criteria
- Realistic about what AI can and can't do`,
  staticGuidance: `Strong workflow augmentation candidates share these characteristics:

✓ High frequency — the more often the task happens, the more value AI adds
✓ Pattern-heavy — tasks that follow predictable patterns benefit most from AI
✓ Clear quality signal — you can tell if the AI output is good or not
✓ Human judgment still valuable — augmentation, not replacement
✓ Reversible — easy to correct when AI is wrong

Common mistakes to avoid:
- Choosing a task that's already automated or nearly so
- Selecting a task where errors are high-stakes with no human review
- Overestimating how "smart" the AI will be with your specific context
- Ignoring the data input requirements (what does the AI need to know to help?)

Review your submission against these criteria before finalizing.`,
  checklist: [
    "Workflow is specific and concrete",
    "Pain point is clearly articulated",
    "AI role is well-defined (augment, not automate)",
    "Risks are acknowledged",
    "Success metric is measurable",
  ],
  staticFeedback: {
    assessment: "Strong workflow submissions name a specific workflow with its frequency and time cost, define the exact AI role (draft, flag, classify — not 'helps with'), and identify a concrete success metric with a current baseline.",
    highlights: [
      "Identifying a high-frequency, pattern-heavy task where AI output can be verified by a human",
      "Keeping the human in the loop rather than proposing full replacement",
    ],
    suggestions: [
      "Make the AI role more specific: 'AI drafts the first version for human approval' is clearer than 'AI assists with the process'",
      "Add a current baseline to your success metric so you can measure improvement — e.g., 'currently takes 3 hours; target is under 45 minutes'",
    ],
    nextSteps: [
      "Try augmenting one real task with AI this week — hands-on experience will surface constraints no plan anticipates",
      "Share the plan with the person who currently does the workflow and get their reaction before committing",
    ],
  },
}
