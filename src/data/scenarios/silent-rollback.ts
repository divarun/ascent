export const silentRollback = {
  slug: "silent-rollback",
  title: "The Silent Rollback",
  isUnlocked: false,
  summary:
    "Your AI recommendation feature drove a 12% lift in the A/B test. Two weeks post-launch, support tickets are up 40% with users complaining the results feel 'weird.' You have no model changes logged. Do you roll back or investigate?",
  roles: ["EM"] as const,
  difficulty: "ADVANCED" as const,
  industry: "Consumer Tech",
  context: `You're an EM at a consumer tech company. Eight weeks ago, your team ran a 4-week A/B test on a new AI-powered recommendation feature. Results were strong:
- 12% lift in user engagement
- 8% improvement in session length
- No meaningful increase in support contacts during the test

You launched to 100% of users two weeks ago. Then last Monday, your support team flagged a spike in tickets. This week's picture:
- Support tickets mentioning "weird recommendations," "wrong results," or "not relevant": up 41% week-over-week
- NPS for the feature (from in-app surveys) dropped from 38 to 21
- Engagement has declined from the launch-day peak but is still slightly above pre-launch baseline

You pull the incident log: no model changes, no prompt changes, no infrastructure changes since launch. Your model is accessed via your vendor's API using a pinned version.

Your data team surfaces one anomaly: the input distribution has shifted. During the A/B test, the feature was primarily used by your most engaged users (by definition, since it was opt-in). Now it's running for all users — including low-engagement users who interact differently with the product.

Your VP of Product wants an answer by end of day: "Roll back or stay the course?"`,
  prompts: [
    {
      id: "p1",
      question:
        "Diagnose what's happening. Is this a model problem, a distribution shift problem, or something else? What evidence would distinguish between these explanations?",
      followUp:
        "Your data team tells you the model's performance metrics on your internal eval suite are unchanged. Does that resolve the issue? Why or why not?",
    },
    {
      id: "p2",
      question:
        "Do you roll back or stay the course? Make the call and defend it. What's your decision criteria?",
      followUp:
        "Your VP of Product says: 'We can't roll back — we already announced this feature to the press.' How does that change your recommendation, if at all?",
    },
    {
      id: "p3",
      question:
        "The A/B test was considered successful, but it didn't catch this. What was wrong with the test design, and how do you design the next one?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Diagnosis",
      description:
        "Identifies distribution shift as the primary hypothesis: the A/B test population (engaged users) was not representative of the full user base. Distinguishes this from a model regression, which the unchanged evals argue against.",
    },
    {
      criterion: "Rollback Decision",
      description:
        "Makes a defensible call with clear criteria. A partial rollback (targeting low-engagement segment) or a targeted fix is better than a binary stay/roll-back framing. Accounts for the engagement data showing the feature is still above baseline.",
    },
    {
      criterion: "Press Pressure Handling",
      description:
        "Does not let the press announcement override a product quality decision. Understands that maintaining a degraded feature to protect a PR narrative compounds the damage. Has a plan for communicating a rollback externally if needed.",
    },
    {
      criterion: "A/B Test Redesign",
      description:
        "Identifies the test flaw: opt-in A/B tests select for your most engaged users, who are not representative of your full population. Proposes random assignment across user segments and holdout groups that include low-engagement users.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "This is a classic distribution shift failure. The A/B test was technically correct but population-invalid: it measured performance on your best users and extrapolated to everyone. AI features that rely on user behavior signals are especially vulnerable to this — the model that works for power users often doesn't generalize. The rollback question is a judgment call, but the test design question has a clear answer: you need stratified random assignment.",
    strengths: [
      "Recognizing that unchanged internal evals don't rule out a real-world degradation — eval distribution can also fail to match production",
      "Understanding that the engagement baseline still being above pre-launch means this is a calibration problem, not a disaster",
    ],
    blindSpots: [
      "A targeted intervention (tune behavior for low-engagement users, or suppress the feature for that segment) is often better than a full rollback",
      "The support ticket spike is a lagging indicator — the problem has likely been building since launch day, not just since Monday",
      "NPS dropping from 38 to 21 for a feature is a large move that will accelerate if unaddressed — the longer you wait, the harder the recovery",
    ],
    improvements: [
      "Future A/B tests should use random stratified assignment across engagement tiers — not opt-in recruitment that self-selects engaged users",
      "Add a 48-hour post-launch monitoring window with explicit rollback criteria defined before launch — not evaluated after the fact",
      "Segment quality metrics by user engagement tier from day one: a feature that works for power users but fails casual users will always look fine in aggregate until it doesn't",
    ],
    followUpQuestion:
      "You've fixed the recommendations for low-engagement users. Six months later, you want to run another A/B test on a follow-on feature. What's different about how you design it?",
    score: 6,
  },
}