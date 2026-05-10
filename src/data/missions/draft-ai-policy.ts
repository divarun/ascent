export const draftAiPolicy = {
  slug: "draft-ai-policy",
  title: "Draft an AI Usage Policy",
  isUnlocked: true,
  description:
    "Write a practical AI usage policy for your team — one they'll actually follow.",
  roles: ["PM", "EM", "IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Draft an AI Usage Policy

Your team is using AI tools — Copilot, ChatGPT, Claude, or others. You don't have a clear policy. That's a risk.

Your task: write a practical AI usage policy for your team of 5–15 people. Not a legal document — a working document that tells your team what to do.

### Your policy must address:

**1. What's allowed**
Which tools can be used for which purposes? Be explicit.

**2. What's not allowed (or requires approval)**
What types of data, code, or decisions should NOT go through AI tools without explicit review?

**3. Review requirements**
What level of human review is required for AI-generated output? Does it vary by context?

**4. Data classification**
How does your team classify data sensitivity? What types of data can/can't go into third-party AI tools?

**5. Attribution and disclosure**
When (if ever) should AI use be disclosed? To customers? To stakeholders? In code comments?

**6. Quality standards**
What's the minimum standard for AI-generated work before it's considered done?

### Tone and format
Write this as if you're actually going to share it with your team next week. It should be:
- Direct and clear
- Practical, not theoretical
- Short enough to actually be read (under 600 words)
- Opinionated where it needs to be

### What makes a strong policy:
A strong policy makes decisions, doesn't just enumerate considerations. It tells someone what to do in a real situation, not just what to think about.`,
  staticGuidance: `Evaluate your policy against these criteria:

**Clarity:** Can a new team member understand what to do in any situation?

**Specificity:** Does it address the actual tools your team uses?

**Risk-calibration:** Are restrictions proportional to actual risk?

**Enforceability:** Is there any mechanism to know if it's being followed?

**Practicality:** Would people actually follow this, or does it create so much friction that they'll find workarounds?

Common policy failures:
- Too long — no one reads it
- Too vague — doesn't resolve actual decisions
- Too restrictive — creates workarounds that are less safe than the tool
- No data classification — the hardest and most important part is often skipped

Strong policies are opinionated. They make tradeoffs explicit.`,
  checklist: [
    "Policy is under 600 words",
    "Allowed tools are explicitly listed",
    "Data sensitivity categories are defined",
    "Review requirements are clear",
    "At least one concrete example scenario is addressed",
    "Written in plain language",
  ],
  staticFeedback: {
    assessment: "Strong policies are short, specific, and opinionated. They name the actual tools your team uses, classify data clearly, and tell people exactly what to do in the situations they'll actually encounter — not just principles to apply.",
    highlights: [
      "Addressing data classification, which is the most commonly skipped section",
      "Keeping the policy concise enough that people will actually read and remember it",
    ],
    suggestions: [
      "Make sure each section gives a concrete answer, not a principle — 'use your judgment on sensitive data' is not a policy decision",
      "Add at least one specific scenario the policy resolves unambiguously, so readers can calibrate the intent",
    ],
    nextSteps: [
      "Share the draft with one person who wasn't involved and ask: 'What would you do if X happened?' — if they're unsure, the policy needs more specificity",
      "Set a calendar reminder to review in 90 days — AI tool availability and team norms change quickly",
    ],
  },
}