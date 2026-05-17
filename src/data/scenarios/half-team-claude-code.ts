export const halfTeamClaudeCode = {
  slug: "half-team-claude-code",
  title: "Half My Team Wants to Use Claude Code for Everything",
  isUnlocked: false,
  summary:
    "Two of your four senior engineers are shipping faster with Claude Code. The other two have caught subtle bugs and are skeptical. You have a production incident, mixed data, and no policy.",
  roles: ["EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "SaaS",
  context: `You manage four senior engineers on a product team. Two months ago, two of them — your most output-oriented engineers — started using Claude Code heavily for feature development. They're visibly shipping faster. The other two are skeptical: they say AI-generated code is harder to reason about during review, and they've surfaced two subtle bugs before they shipped — one involving incorrect error handling in a payment flow, one a race condition in a background job.

Your sprint metrics show overall PR cycle time has improved 22% since the AI tools became common. But you've also had three production incidents in the past two weeks. One incident was traced directly to AI-generated code that was approved in review without catching an off-by-one error in a pagination cursor. The other two incidents have ambiguous root causes.

You have no formal policy on AI tool usage. The team is operating on individual judgment, and that's creating friction. The two skeptical engineers feel like code review is becoming their burden because they're doing more careful scrutiny of AI-generated PRs. The two enthusiastic engineers feel like their results are being ignored.

The next sprint planning is in three days. You need to make a call.`,
  prompts: [
    {
      id: "p1",
      question: "How do you set policy? What's your stance on Claude Code usage going forward?",
      followUp:
        "Should you standardize on AI tools for the whole team, restrict them, or leave individual choice in place? What's the logic behind your position?",
    },
    {
      id: "p2",
      question:
        'The two enthusiastic engineers push back: "You\'re punishing us for being more productive." How do you respond?',
      followUp:
        "One of them says the production incident was a review failure, not an AI failure. Are they right? How does that change your response?",
    },
    {
      id: "p3",
      question:
        "What changes to your team's process need to happen regardless of the policy decision?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Data Literacy",
      description:
        "Recognizes that 22% cycle time improvement and three incidents in two weeks are not yet sufficient to draw conclusions either way; distinguishes between throughput metrics and quality metrics",
    },
    {
      criterion: "Policy Reasoning",
      description:
        "Frames policy around measurable outcomes and review standards rather than tool preference; avoids both 'ban everything' and 'everything is fine' without evidence",
    },
    {
      criterion: "Team Dynamics",
      description:
        "Addresses the underlying friction — that skeptical engineers are absorbing review burden — not just the surface disagreement about tools",
    },
    {
      criterion: "Process Changes",
      description:
        "Identifies concrete process interventions: documented review standards for AI-generated code, a measurement window, and clear accountability for review quality",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses treat this as a measurement problem before a policy problem. The data is too thin and too short to support either banning or mandating AI tools — the right move is to agree on what you'll measure for the next 60 days and what review standards apply to all PRs regardless of origin. Policy follows evidence.",
    strengths: [
      "Separating the policy question from the incident post-mortem — they require different conversations",
      "Acknowledging that 22% cycle time improvement is real signal worth protecting, not dismissing",
    ],
    blindSpots: [
      "The 22% velocity gain may be offset by review time and incident cost in ways sprint metrics don't capture yet — the skeptical engineers doing heavier reviews may be absorbing hidden cost that averages out in aggregate numbers",
      "A 'policy' without defined success metrics for the next 60 days is just vibes — you need agreement on what you'll measure before you can evaluate whether the policy worked",
      "The team has two implicit review standards: the enthusiastic engineers think passing tests is sufficient; the skeptical engineers think the bar requires structural reasoning. That gap is the actual problem, and 'allow or ban Claude Code' doesn't resolve it",
    ],
    improvements: [
      "Draft an explicit review checklist for AI-generated code that applies to every PR, regardless of who approves it",
      "Agree on a 60-day measurement window with defined leading indicators — defect rate per PR, review cycle time by author, and incident count — before drawing any policy conclusions",
      "Have a direct conversation with the skeptical engineers about whether they're spending more time on AI PR reviews and make that work visible in sprint tracking",
    ],
    followUpQuestion:
      "Sixty days later, your incident rate is unchanged but the two enthusiastic engineers have 40% higher velocity than the skeptical ones. The gap is growing. How do you handle the performance review implications?",
    score: 6,
  },
}
