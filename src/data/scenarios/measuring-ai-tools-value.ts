export const measuringAiToolsValue = {
  slug: "measuring-ai-tools-value",
  title: "Proving AI Tools Are Worth the Budget",
  isUnlocked: false,
  summary:
    "The VP of Engineering wants a data-driven renewal case for $2,400/month in AI tool spend in 30 days. Your data is mixed. Sprint velocity is up but defect data is inconclusive.",
  roles: ["EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "SaaS",
  context: `Your company has been paying $200/engineer/month for AI coding tools — Cursor plus Claude Code — for 12 engineers. That's $2,400/month, $28,800/year. The VP of Engineering wants a renewal decision in 30 days and has asked you to prepare a data-driven case.

What you have:
- Sprint velocity data: up 18% over the past 3 months since adoption
- Defect rate data: inconclusive — some sprints show improvement, some show small regressions; no clear trend
- Informal team feedback: 9 of 12 engineers are positive to strongly positive; 2 are unsure; 1 is negative
- No data on how the tools affect code review time, incident rate, or time-to-debug

The VP has previously said they want "more than vibes." They're analytical and skeptical of purely qualitative cases. But they're also a former EM who understands that engineering productivity is hard to measure cleanly.

The two engineers who are unsure about the tools are two of your three most senior engineers. The one negative engineer is mid-level and was skeptical from the start.

You have 30 days. You need to decide what to measure, what to present, and how to frame mixed evidence honestly.`,
  prompts: [
    {
      id: "p1",
      question:
        "Is sprint velocity plus defect rate sufficient to make the renewal case? What's missing from that data set?",
      followUp:
        "The VP asks: 'If velocity is up 18% and the cost is $2,400/month, what's the ROI calculation?' How do you respond?",
    },
    {
      id: "p2",
      question:
        "What additional data would you collect in the next 30 days? Be specific about what's realistically measurable in that window.",
      followUp:
        "Your data collection turns up a finding you didn't expect: the 2 senior engineers who are unsure have lower velocity improvement than the rest of the team. What do you do with that?",
    },
    {
      id: "p3",
      question:
        "How do you frame the presentation to the VP if your data remains mixed at the end of 30 days?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Measurement Critique",
      description:
        "Identifies the gap between output metrics (velocity, story points) and value metrics (outcomes, quality, reliability); calls out what the current data set doesn't tell you",
    },
    {
      criterion: "Realistic Data Collection",
      description:
        "Proposes measurable data that can actually be gathered in 30 days — not a wish list of ideal metrics that require months of baseline; is specific about methodology",
    },
    {
      criterion: "Honest Framing",
      description:
        "Presents mixed evidence honestly rather than cherry-picking; makes a clear recommendation while acknowledging what's unknown",
    },
    {
      criterion: "Senior Engineer Signal",
      description:
        "Recognizes that the two uncertain engineers being senior is significant — not just a dissenting minority — and reasons about what that means for the renewal argument",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The strongest renewal cases go beyond velocity and make a connection to outcomes the VP cares about: fewer incidents, faster debugging, less time on toil. They also acknowledge what the data can't yet tell you rather than overfitting 30 days of mixed signals into a confident conclusion.",
    strengths: [
      "Recognizing that the VP's 'more than vibes' standard means you need outcome data, not just throughput data",
      "Treating the 30-day window as a scoping constraint rather than a mandate to collect everything",
    ],
    blindSpots: [
      "Sprint velocity measures throughput, not value — you can increase story points shipped while delivering less of what users actually need; the renewal case needs at least one metric that connects to user or business outcomes, not just team output",
      "The two senior engineers who are unsure are the most important signal in your dataset — if AI tools work for your less experienced engineers but not your most experienced ones, velocity averages hide a stratification problem that will matter more as complexity increases",
      "Inconclusive defect data in a 30-day window may mean the debt hasn't surfaced yet, not that there's no problem — AI-generated bugs often appear in production 4-8 weeks after the code ships, outside your measurement window",
    ],
    improvements: [
      "Add one outcome-connected metric: time-to-resolve production incidents, or customer-reported bug rate — something that links engineering throughput to external quality",
      "Segment the velocity data by engineer seniority and task complexity — a flat 18% average may obscure important variation that affects how you present the case",
      "Present the VP with a conditional recommendation: renew with a 90-day structured evaluation that includes the metrics you couldn't collect in 30 days, rather than treating this as a final verdict",
    ],
    followUpQuestion:
      "The VP renews for 6 months with a requirement that you present outcome metrics at the 6-month mark. Two months in, you discover that onboarding a new engineer has become harder because the existing code is harder to understand without the AI context that generated it. How do you factor that into your 6-month report?",
    score: 6,
  },
}
