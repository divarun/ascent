export const writeSuccessMetrics = {
  slug: "write-success-metrics",
  title: "Write the Success Metrics Before You Build",
  isUnlocked: false,
  summary:
    "Your team is 2 weeks from starting an AI summarization feature. Your EM asked you to define what success looks like before development begins. You don't have a clear answer yet.",
  roles: ["PM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "B2B SaaS",
  context: `You're PM for a B2B analytics platform used by financial analysts at asset management firms. Your users spend 4–6 hours per day reading research reports, earnings call transcripts, and SEC filings — documents that typically run 20–80 pages. The average user reads 12 documents per day.

Your team is adding an AI-powered summarization feature: the AI will read any document in the platform and generate a 3-paragraph executive summary (approximately 150 words) covering the key findings, key risks, and one recommended action. The feature is designed to save analysts 15–20 minutes per document and help them prioritize which documents merit deeper reading.

Engineering is 2 weeks from starting development. Your EM, Priya, asked you in your weekly sync: "Before we start, I want to know what 'working' looks like. What are we building toward?" You said you'd follow up with metrics by Friday. It's Wednesday.

Your instinct was to say "users will find it helpful" — but Priya pushed back: "That's not measurable. If users find it helpful but the summaries are missing key risk disclosures, is that a success?" You didn't have a good answer.

You now need to define three things before Friday: a primary success metric with a target, a quality threshold that's measurable before launch, and a failure signal that would trigger a rollback in week 1. These are not abstract — you need to write the actual metrics.`,
  prompts: [
    {
      id: "p1",
      question:
        "Define your primary success metric for this feature. Be specific: what are you measuring, what's your target, and over what timeframe? Explain why you chose this metric over alternatives.",
      followUp:
        "Your head of analytics points out that power users — analysts who read 20+ documents per day — might adopt the feature heavily, inflating your metric while most users ignore it. How does that change your metric design?",
    },
    {
      id: "p2",
      question:
        "Define your quality threshold: what accuracy rate, error rate, or failure rate is unacceptable? What counts as a 'wrong' summary, and how will you measure it before you launch to all users?",
      followUp:
        "Engineering says they can run automated quality checks on a sample of outputs before launch, but it would take 2 additional weeks. Your VP wants to ship on time. How do you resolve this?",
    },
    {
      id: "p3",
      question:
        "Define your week-1 failure signal: what specific event or pattern in the data would tell you the feature is failing and needs to be rolled back? How is this different from your success metric?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Primary Metric Specificity",
      description:
        "Proposes a measurable metric with a number and timeframe — e.g., '40% of active users use the summary feature at least 3 times per week within 30 days of launch' — not a vague proxy like 'user satisfaction.' Explains the choice and acknowledges what it doesn't capture.",
    },
    {
      criterion: "Quality Threshold Definition",
      description:
        "Distinguishes between helpfulness and accuracy — recognizes that users can rate a summary as helpful even if it's wrong, because they can't verify it against the source without reading the source. Proposes a pre-launch quality check that involves human review of a sample, not just user ratings.",
    },
    {
      criterion: "Rollback Criteria Distinction",
      description:
        "Defines a rollback trigger that is separate from the success metric — e.g., 'any summary that omits a disclosed risk factor present in the source document' — and explains why a feature can be meeting its adoption metric and still need to come down.",
    },
    {
      criterion: "User Segment Awareness",
      description:
        "Accounts for the power user inflation problem: designs a metric or checks for adoption breadth, not just aggregate usage, to avoid a scenario where heavy adoption by 5% of users masks non-adoption by the rest.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The hardest part of this exercise is the quality threshold — because the thing that makes this feature dangerous is that users in this domain (financial analysts reading risk documents) can find a summary helpful without it being accurate. Strong responses build the quality check around domain-specific failure modes, not generic helpfulness scores.",
    strengths: [
      "Distinguishing helpfulness from accuracy and proposing a pre-launch quality check that measures the right thing",
      "Defining a rollback trigger that is independent from the adoption metric, with a specific failure mode rather than just 'low engagement'",
    ],
    blindSpots: [
      "User helpfulness ratings are systematically misleading for summarization features in expert domains. Analysts will rate a summary as helpful if it confirms their existing view of the document — even if the summary missed the key risk buried on page 34. High helpfulness scores do not mean accurate summaries. You need a separate accuracy check that doesn't rely on users who haven't read the full document.",
      "The quality threshold argument — 'we'll define acceptable after we see the first few support tickets' — means you'll be having the acceptable quality debate under pressure, with the team who built the feature on one side and the person who filed the ticket on the other. Both sides will pick the number that defends their position. Pre-defining the threshold makes that conversation moot.",
      "Rollback criteria are not the same as success criteria, and a feature can satisfy both simultaneously in opposite directions. A scenario where 60% of users are using the summary (success metric: passing) but every third summary for SEC filings is omitting risk disclosures (rollback trigger: firing) requires you to roll back a 'successful' feature. If you haven't separated these, you won't recognize that situation when it arrives.",
    ],
    improvements: [
      "Before launch, run a blind quality audit: have 3 domain analysts read 50 source documents and rate the summaries on accuracy (not helpfulness). Use those ratings to set your pre-launch bar — e.g., 'fewer than 5% of summaries rated as materially inaccurate by a domain reviewer'",
      "Design the rollback trigger around the domain-specific failure mode: for a financial document platform, the failure is omitting disclosed risks — so the rollback trigger should be 'any summary that a domain reviewer rates as omitting material risk information from the source document'",
      "Segment your success metric by user tier from day one: track adoption among power users and regular users separately. If adoption is 80% among power users and 8% among regular users, those require different product responses",
    ],
    followUpQuestion:
      "The feature has been live for 6 weeks. Adoption is strong — 52% of users are using it weekly. Then an analyst at one of your enterprise customers discovers that a summary omitted a risk factor that later caused a significant loss. They had relied on the summary instead of reading the full filing. How does this change how you think about the metrics you defined?",
    score: 6,
  },
}
