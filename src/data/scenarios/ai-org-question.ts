export const aiOrgQuestion = {
  slug: "ai-org-question",
  title: "The AI Org Question",
  isUnlocked: false,
  summary:
    "Your company is doubling its AI investment. The VP wants to know: build a central AI platform team, or embed ML engineers into each product team? You have one week to make a recommendation that affects 8 engineers and 4 product lines.",
  roles: ["EM"] as const,
  difficulty: "ADVANCED" as const,
  industry: "Enterprise Software",
  context: `You're a Senior EM at a 200-person enterprise software company. Over the past 18 months, AI has gone from an experiment to a core product requirement. You now have:
- 8 ML/AI engineers spread across 4 product teams (2 per team)
- 4 separate vector databases, managed independently
- 3 different LLM API integrations, with overlapping contracts
- Evaluation frameworks that were each built from scratch by each team
- No shared prompt library, no shared tooling, no shared incident response playbook

Each product team has shipped something. Quality is inconsistent. Two teams are thriving; two are struggling and burning engineer time on infrastructure instead of features.

The VP of Engineering has asked you to evaluate two models and make a recommendation:

**Option A: Centralize — build an AI Platform team**
- Pull the 8 engineers out of product teams into a dedicated platform team
- They build shared infrastructure: eval frameworks, model routing, prompt management, cost monitoring, guardrails
- Product teams become consumers of the platform
- Risk: slower feature velocity in the short term; platform team may become a bottleneck

**Option B: Keep embedded — but standardize**
- Engineers stay in their product teams
- You create standards, shared libraries, and a community of practice
- No central ownership; coordination is voluntary
- Risk: the same inconsistency and duplication continues at larger scale

Your VP wants a written recommendation in one week. The CEO has signaled the company will hire 6 more AI engineers in Q3 — the org structure needs to be in place before they arrive.`,
  prompts: [
    {
      id: "p1",
      question:
        "What's the core tradeoff between these two models? What does each optimize for, and what does each sacrifice?",
      followUp:
        "One of your strongest ML engineers says she'll quit if she's moved to a platform team — she joined to work on user-facing features. How does that affect your recommendation?",
    },
    {
      id: "p2",
      question:
        "What's your recommendation and why? If you'd modify either option rather than choose as-is, describe what that looks like.",
      followUp:
        "The VP asks: 'What does success look like in 6 months under your recommended model?' Give a concrete answer.",
    },
    {
      id: "p3",
      question:
        "The two struggling product teams are struggling for different reasons: one has weak ML fundamentals, one has strong ML but no product sense. How does your org model address both, and what does the transition plan look like for each?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Tradeoff Analysis",
      description:
        "Articulates that centralization buys consistency and infrastructure leverage at the cost of feature velocity and engineer motivation; embedding buys autonomy and speed at the cost of compounding duplication and quality variance.",
    },
    {
      criterion: "Recommendation Quality",
      description:
        "Makes a specific recommendation — ideally a hybrid (small platform team for shared infrastructure, embedded engineers for product features) — rather than presenting both options without a call. Defends it against the obvious counterargument.",
    },
    {
      criterion: "Talent Risk",
      description:
        "Takes the engineer retention concern seriously as a real constraint, not an obstacle to manage. Org design that ignores engineer motivation fails in execution regardless of structure.",
    },
    {
      criterion: "Transition Planning",
      description:
        "Addresses the two struggling teams with differentiated plans rather than a single fix. Recognizes that the root problems are different (capability vs. product judgment) and need different interventions.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The binary framing — centralize or embed — is usually a false choice. The most effective AI org structures tend to use a thin platform team for shared infrastructure (eval tooling, cost monitoring, model routing) while keeping engineers embedded in product teams for feature work. The platform team's job is to make the embedded engineers faster, not to own all AI work.",
    strengths: [
      "Recognizing that 4 independent eval frameworks and 3 separate LLM contracts is a compounding cost, not just a coordination inconvenience",
      "Understanding that adding 6 engineers to a broken org structure scales the dysfunction, not the output",
    ],
    blindSpots: [
      "The two thriving teams are a data point worth mining — understand what they're doing differently before recommending a structural change that might disrupt what's working",
      "A central platform team creates a new dependency for every product team — that dependency needs clear SLAs and escalation paths or it becomes a bottleneck immediately",
      "Engineer career paths matter: ML engineers in a platform role have a different growth trajectory than those in product roles — make this explicit in the design",
    ],
    improvements: [
      "Audit the two thriving teams first: if they're succeeding with the embedded model, document their practices and use that as the baseline for standardization",
      "Define the platform team's charter narrowly at first: eval infrastructure, cost dashboards, shared model routing — not features. Expand scope after trust is established.",
      "Create a community of practice (weekly syncs, shared Slack channel, shared prompt library) regardless of org structure — this costs nothing and captures most of the coordination benefit",
    ],
    followUpQuestion:
      "Six months in, the platform team has shipped eval infrastructure and cost monitoring. The product teams are using it inconsistently. Half the teams have adopted it; half are still doing their own thing. What do you do?",
    score: 6,
  },
}