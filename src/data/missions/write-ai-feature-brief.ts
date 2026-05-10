export const writeAiFeatureBrief = {
  slug: "write-ai-feature-brief",
  title: "Write an AI Feature Brief",
  isUnlocked: false,
  description:
    "Write a complete brief for an AI feature you want to build — including the problem, success criteria, eval plan, risks, and rollout approach.",
  roles: ["PM"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Write an AI Feature Brief

Pick a real AI feature you want to build — or one already in your roadmap. Write a complete brief for it. This is not a PRD or a spec. It's the document that answers: "Should we build this, and do we know how to build it responsibly?"

A strong brief answers these questions before the team starts building, not after.

### What you'll deliver:

**1. The problem**
What user problem does this feature solve? Be precise: who has this problem, how often, and what's the cost to them of not having a solution? Include one metric that represents the problem today (e.g., "PMs spend 4 hours per week on X").

**2. Why AI**
What makes AI the right approach here, as opposed to a simpler solution? What specifically does AI do that a rule-based system, search, or better UX design could not?

**3. Success criteria**
How will you know the feature is working? Define:
- One primary success metric with a specific target and timeframe
- One quality threshold (e.g., error rate, false positive rate, user correction rate) that is required before launch
- One signal that would tell you the feature is failing in production

**4. Eval plan**
Before launch, how will you know the AI is performing well enough to ship? Describe:
- What your golden dataset looks like (minimum 20 examples)
- How you'll score outputs
- What score is required to ship

**5. Risks**
Identify two to three specific risks for this feature — not generic AI risks, but risks that apply to this use case specifically. For each, name a mitigation.

**6. Rollout approach**
How does this feature launch? Address: who sees it first, what gates exist before broader rollout, and what the rollback plan is if something goes wrong.

### What makes a strong submission:
- The "why AI" section rules out simpler alternatives explicitly — not just assumes AI is better
- Success criteria include a quality threshold, not just a business metric
- Risks are specific to the feature, not boilerplate ("AI might hallucinate")
- The eval plan has a concrete dataset description and a specific score threshold`,
  staticGuidance: `The most common brief failure: success criteria that can't be measured before launch.

"Users will find it helpful" is not a success criterion.
"Median time to complete X drops from 4 hours to under 1 hour, measured in the first 30 days after launch" is.

The eval plan and the success criteria should be designed together. If you can't measure success during eval (before launch), you won't be able to measure it after launch either.

Also: the "why AI" section is doing real work. If you can't rule out a simpler solution, that's a signal to revisit the approach. A well-designed form or a good search experience sometimes outperforms AI for the specific user problem.`,
  checklist: [
    "Problem includes a specific metric representing the current state",
    "Why AI rules out at least one simpler alternative explicitly",
    "Primary success metric has a specific target and timeframe",
    "Eval plan includes golden dataset description and minimum score to ship",
    "Risks are feature-specific, not generic AI risks",
    "Rollout plan includes rollback criteria",
  ],
  staticFeedback: {
    assessment: "Strong briefs have success criteria that can be measured before launch, not only after. If your primary metric requires 30 days of production data to evaluate, your pre-launch eval plan can't validate success. Design the metric and the eval together so they answer the same question.",
    highlights: [
      "Ruling out simpler alternatives in the 'why AI' section rather than assuming AI is the right approach",
      "Including a quality threshold alongside the business metric — defining acceptable error rate before launch",
    ],
    suggestions: [
      "Make the eval plan specific enough that someone else could run it: name the golden dataset size, the rubric criteria, and the minimum score required to ship",
      "Make sure risks are feature-specific — 'AI might hallucinate' applies to every AI feature and doesn't lead to a mitigation",
    ],
    nextSteps: [
      "Share the brief with engineering before finalizing — if they can't build the eval plan you described, revise it together",
      "Walk the rollback criteria past your EM: 'what would make us pull this feature in week one?' — if there's no answer, the rollout plan is incomplete",
    ],
  },
}
