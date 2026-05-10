export const auditAiFeature = {
  slug: "audit-ai-feature",
  title: "Audit an AI Feature You Own",
  isUnlocked: true,
  description:
    "Take stock of an AI feature already in production. Map what you actually know — and what you don't.",
  roles: ["EM"] as const,
  difficulty: "BEGINNER" as const,
  instructions: `## Mission: Audit an AI Feature You Own

Most AI features ship and then go unexamined. The team moves on, the feature runs, and nobody has a clear picture of whether it's working — or what "working" even means for it.

Pick one AI feature your team owns that is live in production (or in active development). Your task is to audit it: document what you know, surface what you don't, and identify the one thing most worth investigating.

This is not a performance review. It's an inventory.

### What you'll deliver:

**1. Feature snapshot**
In 3–5 sentences: what does the feature do, who uses it, how often, and what happens to the output? Be concrete enough that someone unfamiliar with the product would understand it.

**2. What you know**
List what you can actually verify right now about this feature's quality and behavior. Examples:
- "We track API error rate and it's below 1%"
- "Users can flag bad outputs; we get ~30 flags per week"
- "We run the feature against a 40-case golden dataset on every deploy"

Be honest. Don't list things you assume are fine — list things you have evidence for.

**3. What you don't know**
List 3–5 things about this feature's quality or behavior that you cannot currently answer. Examples:
- "We don't know if output quality differs by user segment"
- "We have no monitoring on output length distribution"
- "We don't know how often users correct or ignore the AI output"
- "We haven't tested the feature on inputs outside the original design cases"

**4. The single biggest gap**
Of everything you don't know, which gap is most likely to be hiding a real problem? Explain your reasoning in 2–3 sentences.

**5. One thing to do this week**
What is the smallest action that would close the most important gap? It should be completable by one person in under a day — not a project, a task.

### What a strong audit looks like:
Honest, not defensive. The "what you don't know" section should be longer than the "what you know" section for most live AI features. A short "don't know" list usually means the audit isn't done yet.`,
  staticGuidance: `Most engineering teams have more AI monitoring than they think and less AI quality visibility than they need.

Common findings in this kind of audit:
- Teams monitor infrastructure (latency, error rate, uptime) but have no signal on output quality
- "The feature works" means "we haven't gotten complaints recently" — not "we've verified it works"
- The golden dataset was built at launch and hasn't been updated since
- Nobody has looked at a random sample of recent outputs in months

**What to look for in "what you know":**
Are these things you've measured, or things you've assumed? Infrastructure metrics don't tell you anything about whether the AI output is correct or useful. Only output-level signals do.

**What to look for in "what you don't know":**
The most valuable gaps are usually about how the feature behaves on the long tail of inputs, how output quality varies across user segments, and what users actually do with AI outputs (do they use them? edit them? ignore them?).

**The one-week task test:**
If the task you identified requires more than one person or more than a day, break it down further. The goal is a visible change in knowledge, not a project plan.`,
  checklist: [
    "Feature snapshot is concrete enough for someone unfamiliar to understand it",
    "\"What you know\" lists only verifiable facts — not assumptions",
    "\"What you don't know\" has at least 3 items",
    "Biggest gap is identified with reasoning, not just listed",
    "One-week task is completable by one person in under a day",
  ],
  staticFeedback: {
    assessment: "Strong audits are honest about the difference between 'we've measured this' and 'we assume this is fine.' For most live AI features, the don't-know list should be longer than the know list. Infrastructure metrics don't tell you whether the AI output is correct or useful — only output-level signals do.",
    highlights: [
      "Separating verified facts from assumptions in the 'what you know' section",
      "Identifying a single highest-priority gap rather than listing everything equally",
    ],
    suggestions: [
      "If your 'what you know' list is mostly infrastructure metrics (latency, uptime, error rate), those are necessary but not sufficient — add at least one output-quality signal",
      "If your one-week task involves more than one person or more than a day, break it down further — the goal is a change in knowledge, not a project kickoff",
    ],
    nextSteps: [
      "Pull a random sample of 20 recent outputs and read them — this takes under an hour and almost always surfaces something worth investigating",
      "Share the gap list with your team in your next standup and ask if anyone has context that closes any of them",
    ],
  },
}