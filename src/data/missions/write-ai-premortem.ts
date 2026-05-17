export const writeAiPremortem = {
  slug: "write-ai-premortem",
  title: "Write a \"What Could Go Wrong\" Doc",
  isUnlocked: false,
  description: "Run a structured pre-mortem on an AI feature before it ships — imagining every way it could fail and working backwards to mitigations.",
  roles: ["PM"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Write a "What Could Go Wrong" Doc

A pre-mortem is a structured failure analysis done BEFORE the feature ships. The goal: imagine it's 6 months from now and the feature failed. Work backwards from that failure to document every way it could have happened.

Your task: pick an existing or upcoming AI feature in your product and write a complete pre-mortem.

### Structure:

**1. The feature**
What it does, who it serves, what it's supposed to improve. Be specific — "AI assistant" is not a feature description.

**2. The failure modes**
At least 5, covering:
- **Technical failures** — model quality, hallucination, latency
- **User trust failures** — users don't trust the output, use it wrong, over-rely on it
- **Business failures** — ROI doesn't materialize, costs exceed projections
- **Ethical/legal failures** — bias, regulatory issues, unintended harm
- **Operational failures** — evals degrade silently, no one monitors it

**3. For each failure mode:**
- Who gets harmed (be specific — not "users," but "enterprise customers who use this to make purchasing decisions")
- How likely is it (low / medium / high — and why)
- What's the mitigation, or if none: why you're accepting the risk

**4. The one failure you're most worried about**
Name it explicitly. What would you need to see before shipping with confidence despite that risk?

### What makes a strong pre-mortem:
Good pre-mortems are uncomfortable. If yours doesn't make you want to improve something before launch, it's not done.

Specific failure modes beat vague ones. Not "it might hallucinate" — instead: "for questions about competitor pricing, the model will confidently assert stale data from its training cutoff, and users won't know it's wrong."

Separate "mitigated" from "accepted" risks. Some failure modes are worth shipping with if they're understood and communicated. That's a real decision — own it.`,
  staticGuidance: `Strong pre-mortems have specific failure modes — not "it might hallucinate" but "for questions about competitor pricing, the model will confidently assert stale data from its training cutoff, and users won't know it's wrong." They identify who specifically gets harmed by each failure, not just that harm could occur. They separate "mitigated" from "accepted" risks — some failure modes are worth shipping with if they're understood and communicated.

The operational failure category is most commonly skipped. Ask: what happens in month 4, when the team that built this is focused on the next thing? Who owns the evals? Who sees the alert when model quality drops? If no one owns it, it will degrade silently.`,
  checklist: [
    "Feature is specifically described (not a generic 'AI feature')",
    "At least 5 failure modes identified",
    "At least one failure mode from each category (technical, user trust, business, ethical/legal, operational)",
    "Each failure mode names who gets harmed",
    "One failure mode explicitly identified as highest-concern",
    "Mitigation or acceptance rationale for each failure mode",
  ],
  staticFeedback: {
    assessment: "A strong pre-mortem makes the team uncomfortable — not because it's alarmist, but because it names real risks precisely enough that ignoring them becomes a conscious choice. The best submissions don't just list what could go wrong; they change what the team does before launch.",
    highlights: [
      "Naming who specifically gets harmed for each failure mode — this forces specificity and reveals which failures are actually acceptable",
      "Covering operational failures, which most pre-mortems skip — degradation that no one is watching is the most common real-world AI failure mode",
    ],
    suggestions: [
      "Review each failure mode: if it says 'might' or 'could,' push further — what specifically would happen, to whom, when?",
      "Make sure 'mitigated' and 'accepted' risks are clearly distinguished — accepting a risk is a valid decision, but it should be explicit and documented",
    ],
    nextSteps: [
      "Share this doc with the engineer most familiar with the model integration — they will likely have technical failure modes you missed",
      "Put the highest-concern failure mode on the launch checklist with an owner and a decision threshold: 'we ship when X is true'",
    ],
  },
}
