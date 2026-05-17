export const auditTeamAiUsage = {
  slug: "audit-team-ai-usage",
  title: "Audit Your Team's AI Tool Usage",
  isUnlocked: false,
  description: "Run an informal audit of how your team actually uses AI tools — and turn what you find into one concrete policy or skill decision.",
  roles: ["EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Audit Your Team's AI Tool Usage

Most EMs don't know how their team is actually using AI tools. They know what tools are licensed; they don't know who's using what, for what, how often, and with what results.

Your task: run an informal audit. This is not a surveillance exercise — it's a data-gathering exercise that should improve your decisions about tooling, policy, and skill development.

### Steps:

**1. Survey your team (5–10 minutes per person)**
Have a short conversation with each team member — in 1:1s or async. Cover:
- What AI tools are you using? For what tasks?
- How often?
- What's working well?
- What produces output you have to redo or throw away?
- What tasks are you deliberately NOT using AI for?

Don't lead the witness. You want what they actually do, not what they think you want to hear.

**2. Observe 2–3 recent PRs**
Look at recent PRs with an eye toward AI-generated code. Signals: consistent style breaks, overly complete boilerplate, test files that don't test the actual behavior. Look at the review thread: are reviewers asking "what does this do?" or "why did you make this choice?" Either is fine — you're looking for patterns.

**3. Analyze the spectrum**
Where are different team members in terms of AI usage? Think about: heavy users, light users, non-users — and whether that's correlated with role, seniority, or task type. Also look at quality: is there a correlation between AI usage and review depth, PR size, bug rate, or re-work?

### Your submission should include:
- A 1-page summary: who's using what, patterns you noticed, one quality signal you found (positive or negative)
- One policy change or experiment you'd make based on what you found
- One skill development action for the person who would benefit most from your help right now

### What makes a strong audit:
You're looking for something you didn't know before you started. If your summary confirms everything you already believed, you probably confirmed your priors rather than gathered real data.`,
  staticGuidance: `Strong audits name what surprised you. If you found exactly what you expected, you probably confirmed your priors rather than discovered something new. The most useful audits find one of these: someone using AI in a way that should be shared with the team, someone not using AI in a way that's costing them time or growth, or a quality gap that's not visible in output metrics yet.

The survey conversations are the hardest part to do well. People will tell you what they think you want to hear unless you explicitly signal that you're not evaluating them — you're trying to understand reality so you can make better decisions for the team.

The policy change or experiment section is where this mission pays off. Don't end with observations — end with a decision.`,
  checklist: [
    "Survey covered at least 3 team members with specific questions",
    "At least 2 PRs were reviewed with an eye toward AI signals",
    "Summary identifies at least one thing you didn't know before the audit",
    "Policy change or experiment is specific (not 'encourage better AI use')",
    "Skill development action names a person and a concrete intervention",
  ],
  staticFeedback: {
    assessment: "The value of an audit comes from what you do with it. A summary that ends with 'the team is using AI tools with mixed results' is just a description. The strong version names one thing that changes — a policy, an experiment, a conversation — based on what you found.",
    highlights: [
      "Identifying a usage pattern (positive or negative) that wasn't visible in metrics — this is the kind of signal audits are uniquely good at surfacing",
      "Turning the audit into a concrete action rather than just a description of current state",
    ],
    suggestions: [
      "If your summary doesn't name what surprised you, push harder — what did you expect to find that wasn't there? What was there that you didn't expect?",
      "Make the policy change specific enough that you could announce it in a team meeting: 'Starting next sprint, we're going to do X because we found Y'",
    ],
    nextSteps: [
      "Share the summary (anonymized if needed) with the team — people should know what you learned and why you're making the change you're making",
      "Revisit in 60 days: did the policy change or skill intervention have any effect you can observe?",
    ],
  },
}
