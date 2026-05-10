export const designPromptSystem = {
  slug: "design-prompt-system",
  title: "Design a Prompt System",
  isUnlocked: false,
  description:
    "Write a production-ready prompt for a real task, complete with a test suite and a failure taxonomy.",
  roles: ["IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Design a Prompt System

Pick a real task you need an LLM to do — something from your actual work, not a toy example. Your goal is to design a complete prompt system around it, not just write a prompt.

### What you'll deliver:

**1. The task**
Describe the task clearly: what input does the model receive, what output does it need to produce, and what does "correct" mean for this specific task? Be specific enough that someone else could evaluate your prompt's outputs.

**2. The prompt**
Write the full system prompt (or prompt template). Include:
- Clear task framing
- Output format specification
- Any constraints or guardrails
- 2–3 few-shot examples if the output format is non-obvious

**3. The test suite**
Write 8–10 test cases that cover:
- Representative normal cases (what you expect most of the time)
- Edge cases (short inputs, ambiguous inputs, inputs at the boundary of the task)
- Adversarial cases (inputs designed to trigger failure modes)

For each test case, specify the input and what a correct output looks like (or what criteria it must meet).

**4. The failure taxonomy**
Based on your test cases, identify at least 3 specific failure modes:
- What type of input triggers the failure
- What the model does wrong
- How you'd detect it in production

### What makes a strong submission:
- The task is real and specific — "summarize customer support tickets" is too vague; "extract action items and owner from a support escalation email and return as JSON" is specific
- The test suite includes cases you'd actually expect to fail, not just cases you expect to pass
- The failure taxonomy is grounded in actual observed behavior, not theoretical possibilities`,
  staticGuidance: `Designing a prompt system is engineering work. The test suite is not optional polish — it's how you know the prompt actually works before it ships.

Common mistakes:
- Writing test cases only for the happy path
- Writing a prompt that works on your examples but not on real user inputs
- Skipping output format specification (this causes the most parsing failures in production)
- Not thinking about what happens when the input is malformed, empty, or off-topic

Before finalizing:
- Run your prompt against all 8–10 test cases manually
- Identify which ones failed and why
- Update the prompt at least once based on what you learned
- Report the before/after in your submission`,
  checklist: [
    "Task is specific and real — not a toy example",
    "Prompt includes output format specification",
    "Test suite covers normal, edge, and adversarial cases",
    "At least 3 distinct failure modes identified",
    "Prompt was iterated at least once based on test results",
  ],
  staticFeedback: {
    assessment: "Strong prompt systems include explicit output format specification (the most common source of parsing failures), test cases that include adversarial inputs alongside happy-path ones, and failure modes grounded in actual observed behavior — not hypothetical ones.",
    highlights: [
      "Iterating on the prompt based on test results rather than shipping the first draft",
      "Including adversarial test cases designed to expose limits, not just confirm success",
    ],
    suggestions: [
      "If your test suite only includes inputs you expect to pass, add 3 specifically designed to break the prompt — those cases are more valuable than the ones that confirm it works",
      "Document failure modes you actually observed during testing — observed failures lead to specific fixes; hypothetical ones don't",
    ],
    nextSteps: [
      "Run your prompt against 10 real inputs from your actual work and count how many require manual correction",
      "Add your test suite to version control alongside the prompt so both evolve together when the task changes",
    ],
  },
}
