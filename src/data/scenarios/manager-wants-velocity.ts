export const managerWantsVelocity = {
  slug: "manager-wants-velocity",
  title: "Your Manager Wants You to Double Your Velocity",
  isUnlocked: false,
  summary:
    "Your EM set a goal of doubling your output by end of quarter based on AI productivity benchmarks. Two months in, your actual gain is 15%. The expectation doesn't match how your work is actually structured.",
  roles: ["IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "SaaS",
  context: `You're a senior IC at a 200-person SaaS company. Two months ago, your engineering manager, Derek, read the productivity research showing 40-55% gains from AI coding tools and set an explicit team goal: engineers should be doubling their output by end of quarter. He framed it as an opportunity, not a threat.

You've been using Claude Code and GitHub Copilot seriously since then. Your honest assessment of your productivity change:
- Net velocity increase: approximately 15%
- On boilerplate and new feature scaffolding: closer to 25-30% faster
- On your most complex tasks — architectural decisions, production debugging, code review, cross-team coordination: closer to 10%, and sometimes the AI suggestions add review overhead

You tracked your time for the past 3 weeks. Your work breaks down roughly as:
- 25% new feature implementation (high AI benefit)
- 20% code review (moderate AI benefit, sometimes negative)
- 20% production debugging and incident response (low AI benefit)
- 20% architecture decisions and design work (low AI benefit)
- 15% cross-team coordination and planning (no AI benefit)

Derek pulls you into a 1:1 and says: "I'm doing mid-quarter check-ins. The team goal is 2x productivity by end of quarter. How are you tracking?"`,
  prompts: [
    {
      id: "p1",
      question: "How do you respond to Derek? What's your approach to this conversation?",
      followUp:
        "Derek says: 'I hear you, but the benchmark is what the board is going to ask me about. I need something to show.' How do you respond?",
    },
    {
      id: "p2",
      question:
        "Derek says: 'Other engineers on the team are hitting the 40% target. Why aren't you?' How do you evaluate and respond to this claim?",
      followUp:
        "Derek names two engineers specifically. You know both of them: one is primarily working on a greenfield microservice with minimal coordination overhead; the other is measuring velocity by story points closed. Does this change your response?",
    },
    {
      id: "p3",
      question:
        "What would a realistic AI-assisted productivity improvement look like for your specific role? What's actually achievable, and what would you need to get there?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Benchmark Critique",
      description:
        "Challenges the '40-55% productivity gain' benchmark on methodological grounds: the studies measured isolated coding tasks, not the full IC job description that includes debugging, review, coordination, and architecture work. Doesn't simply dispute the number — explains why the comparison is invalid.",
    },
    {
      criterion: "Work Decomposition",
      description:
        "Uses the actual breakdown of their time to make a concrete argument rather than a vague 'my work is more complex' defense. Identifies which categories of work can be accelerated and which cannot.",
    },
    {
      criterion: "Peer Comparison Evaluation",
      description:
        "Doesn't accept 'other engineers are hitting 40%' without examining what's being measured. Identifies that different work types, different measurement methods, and different baselines make the comparison invalid without more information.",
    },
    {
      criterion: "Forward Proposal",
      description:
        "Moves from defending the current number to proposing what would be needed to improve it — tooling, workflow changes, types of work to prioritize. This is more productive than a defensive conversation about why the goal is wrong.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses do two things: they challenge the benchmark on methodology (not just on personal disagreement), and they redirect the conversation toward what improvement would actually look like for this role. Defending a number is a losing position; proposing a path forward is a productive one.",
    strengths: [
      "Using actual time tracking data to make a concrete argument — 'here's where I spend my time, here's where AI helps, here's the math' is much stronger than 'my work is complex'",
      "Distinguishing between defending the current number and proposing what would be needed to improve it — the second conversation is the one worth having",
    ],
    blindSpots: [
      "'Other engineers are hitting 40%' almost certainly means other engineers are measuring different things — story points closed, PRs merged, lines of code generated. If those engineers are working on greenfield services with minimal coordination overhead, the comparison is invalid. Accepting it without examining the methodology means agreeing to be evaluated on criteria designed for a different type of work, and that framing will follow you into your performance review.",
      "The benchmark studies measured productivity on isolated coding tasks in a lab-like setting — a developer assigned a specific feature to build, with no context switching, no review burden, no debugging of systems they didn't write, and no cross-team coordination. The studies didn't measure your job. Accepting the benchmark as a target for your role means agreeing to be measured on a job description that doesn't match what you actually do.",
      "A defensive conversation about why 40% is wrong for you is unlikely to change Derek's mind, and it positions you as resistant to improvement. A more effective response is proposing what you'd need to get to a higher number: which types of work could be restructured to have more AI-accelerable tasks, what tooling investments would help, what the realistic ceiling looks like. This is more actionable and makes you look like you're solving the problem, not avoiding it.",
    ],
    improvements: [
      "Come to the conversation with your time breakdown already documented — 3 weeks of tracking is enough to make a specific argument. 'Here's how my time is distributed and here's the AI impact by category' is more persuasive than a qualitative claim about work complexity.",
      "Propose a counter-metric: instead of overall velocity, measure AI-accelerated task velocity specifically. If your new feature implementation time improved 28%, that's a real number worth tracking — and it's more honest than an aggregate that averages across work types where AI doesn't apply.",
      "End the conversation with a concrete proposal: 'I think I can get to 25% by end of quarter if we can reduce my review load for the next 6 weeks and I can focus on the feature work where AI is highest leverage.' This gives Derek something to evaluate and shows you're engaging with the goal, not just explaining why it's wrong.",
    ],
    followUpQuestion:
      "End of quarter. You hit 22% productivity improvement. Derek rates you 'meets expectations' — not 'exceeds.' A teammate who shipped more story points but took on less complex work gets 'exceeds expectations.' How do you handle the performance review conversation?",
    score: 6,
  },
}
