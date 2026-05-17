export const juniorAiDependence = {
  slug: "junior-ai-dependence",
  title: "The Junior Engineer Who Can't Debug Their Own Code",
  isUnlocked: false,
  summary:
    "A junior engineer is shipping high volume using AI tools and getting PRs approved. But they can't explain their own code, their reviews are getting worse, and they seemed lost in a live debugging session.",
  roles: ["EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "Consumer Tech",
  context: `A junior engineer on your team joined 8 months ago. They're energetic and eager, and since starting to use GitHub Copilot and Claude Code three months ago their output volume has jumped noticeably — they're submitting more PRs than most mid-level engineers and getting them approved.

But you've noticed a pattern developing that concerns you:

Their code reviews are degrading. Early on, they left thoughtful questions and caught a few issues. Now their review comments are surface-level or absent. When they do comment, it's often something like "looks good" or a stylistic note that doesn't engage with the logic.

In a debugging session two weeks ago, you paired with them on a production issue. When you took the AI assistant away and asked them to reason through the problem, they seemed genuinely lost — they weren't sure how to read a stack trace, and they couldn't explain why a particular function was being called at that point.

Most concerning: you asked them in a one-on-one to walk you through a 50-line function they had submitted in a PR two weeks earlier. They couldn't explain what three of the key operations were doing or why the data was structured the way it was.

Their PRs are getting approved. Their output numbers look good. But you're no longer sure they're actually learning.`,
  prompts: [
    {
      id: "p1",
      question:
        "How do you diagnose whether this is a serious problem or normal variation in junior development?",
      followUp:
        "What's the difference between a junior engineer who is learning through AI-assisted work versus one who is using AI as a replacement for understanding? How do you tell which this is?",
    },
    {
      id: "p2",
      question:
        "How do you intervene? Be specific — what do you say, and what do you change about their work structure?",
      followUp:
        "The engineer gets defensive: 'Are you saying I'm doing something wrong? I thought we were encouraged to use these tools.' How do you respond?",
    },
    {
      id: "p3",
      question:
        'The engineer says: "I\'m shipping more than I ever have and it\'s all getting approved. Why is this a problem?" How do you answer?',
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Diagnostic Rigor",
      description:
        "Distinguishes between 'junior learning with AI assistance' and 'junior output without understanding'; identifies specific evidence that suggests the latter — can't explain submitted code, degraded reviews, lost in live debugging",
    },
    {
      criterion: "Intervention Design",
      description:
        "Proposes a concrete, growth-oriented intervention — not punishment or restriction — that tests and builds actual understanding; avoids both dismissing the concern and over-reacting",
    },
    {
      criterion: "Framing to the Engineer",
      description:
        "Communicates the concern without accusation; frames it around the engineer's growth and future capability, not compliance with rules",
    },
    {
      criterion: "Review Process Accountability",
      description:
        "Acknowledges that PRs being approved is partly a review process failure — reviewers approved code without requiring demonstrated understanding from the author",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "High output with low comprehension is a visible pattern now with an invisible cost later — the problem surfaces when something breaks and no one can debug it, or when the engineer hits a problem AI can't solve. Strong responses design an intervention that makes understanding legible without making the engineer feel accused, and they also look at what in the review process allowed this to go undetected.",
    strengths: [
      "Identifying the debugging session as the most concrete evidence — it's a live capability test, not a speculation",
      "Recognizing this as a growth conversation rather than a performance management conversation at this stage",
    ],
    blindSpots: [
      "High output plus inability to explain code is the scaffolding-without-foundation pattern — the output looks fine until the system breaks at 2am, there's no AI available to help in the same way, and the engineer has no debugging foundation to fall back on",
      "PRs getting approved means the review process failed too — reviewers accepted code without asking the author to reason through the logic; the intervention needs to address reviewer behavior, not just the junior's workflow",
      "If the engineer feels accused of misconduct rather than supported toward growth, they'll become defensive or hide their AI usage — the conversation needs to open with what you want for them, not what you've observed going wrong",
    ],
    improvements: [
      "Design a structured 4-week growth plan: one pairing session per week where the engineer explains their code to you before it's merged, with AI off during the explanation",
      "Add a 'walk me through your reasoning' step to your PR review process for this engineer — make it normal, not punitive, by doing it for everyone on complex PRs",
      "Have a direct but non-accusatory conversation that starts from 'I want to make sure you're building skills, not just shipping output' and explains specifically what you observed and why it concerns you",
    ],
    followUpQuestion:
      "The intervention works — the engineer slows down, starts explaining their code in reviews, and demonstrably improves. But their output volume drops 40% during the 4-week period. Their previous metrics made them look like your most productive junior. How do you handle the optics of that change in your team's sprint data?",
    score: 6,
  },
}
