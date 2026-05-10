export const designingTheEval = {
  slug: "designing-the-eval",
  title: "Designing the Eval From Scratch",
  isUnlocked: false,
  summary:
    "You're building a new AI code review assistant for your team. There's no evaluation infrastructure. You need to design the whole thing before writing a line of prompt.",
  roles: ["IC"] as const,
  difficulty: "ADVANCED" as const,
  industry: "Engineering",
  context: `You're a senior IC at a 60-person startup. Your engineering manager has asked you to own the implementation of an AI code review assistant that will run on every pull request.

The feature should:
- Identify likely bugs, logic errors, and security issues
- Flag code that doesn't follow your team's established patterns
- Suggest improvements without being noisy (low false-positive rate is critical)
- Leave inline comments on the PR, similar to a human reviewer

Your team reviews 40–60 PRs per week. Engineers have explicitly said they'll turn the feature off if it's too noisy. "Useful" means actionable comments, not volume.

You've been given a week to design the eval and prompt system before implementation begins. There is no existing eval infrastructure. Your manager has said: "Don't start building until you know how you'll know if it's working."

Your stack: GitHub PRs, Python/TypeScript codebase, access to GPT-4o and Claude APIs, a Postgres database of 18 months of PR history including review comments from human reviewers.`,
  prompts: [
    {
      id: "p1",
      question:
        "How do you build your golden dataset? What goes in it, where does the data come from, and how do you decide what 'correct' looks like for this task?",
      followUp:
        "Your 18 months of PR history includes human review comments. How do you use that data, and what are the risks of using it as ground truth?",
    },
    {
      id: "p2",
      question:
        "What does your rubric look like? Define the specific criteria you'll score against, and explain how you'd measure each one — especially the 'not too noisy' requirement.",
      followUp:
        "An engineer on your team says: 'Just ship it and see if people use it.' Why is that approach insufficient for this feature specifically?",
    },
    {
      id: "p3",
      question:
        "How do you set up production monitoring once the feature ships? What signals tell you it's working, degrading, or broken — and how do you distinguish between them?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Golden Dataset Design",
      description:
        "Proposes a realistic sourcing strategy using PR history; identifies the label bias risk in using historical human comments as ground truth; accounts for diversity of PR types",
    },
    {
      criterion: "Rubric Specificity",
      description:
        "Defines measurable criteria (precision, recall, false-positive rate) rather than vague quality descriptors; addresses the noise problem with a specific threshold",
    },
    {
      criterion: "Eval Before Build",
      description:
        "Understands why eval-first matters for this feature — because engineers will disable a noisy tool, and you need to know the noise rate before it reaches them",
    },
    {
      criterion: "Production Monitoring",
      description:
        "Proposes concrete production signals: comment dismissal rate, resolution rate, PR author feedback, and volume over time — not just 'watch for errors'",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The hardest part of this eval is defining 'not too noisy' as a measurable threshold before you have production data. Strong responses commit to a specific false-positive rate threshold — even if it's provisional — rather than deferring it to after launch. The PR history is valuable but imperfect: human reviewers also made noisy comments.",
    strengths: [
      "Using PR history as a source for golden dataset examples rather than starting from scratch",
      "Recognizing that engineer adoption (or rejection) is the ultimate success signal",
    ],
    blindSpots: [
      "Historical human review comments are not automatically 'correct' — they reflect reviewer quality variation, mood, and context you won't have in the eval",
      "A bug the model catches that no human reviewer caught is still a true positive — your eval dataset needs examples of real bugs, not just examples of comments that were left",
      "The 'not noisy' requirement needs a number: 2 false positives per PR is probably too many; 0.5 is probably fine. You need to pick a threshold before measuring against it",
    ],
    improvements: [
      "Supplement PR history with deliberately injected known bugs to create a test set where ground truth is unambiguous",
      "Add a 'comment dismissed without action' metric as your primary noise proxy — engineers who dismiss comments are giving you real signal",
      "Run the eval on your team's last 20 PRs before launch and manually review every comment the model makes — this gives you a human-calibrated baseline",
    ],
    followUpQuestion:
      "After two weeks in production, your false-positive rate is within threshold but engineer adoption is lower than expected — only 30% of teams have kept it enabled. How do you diagnose why, and what do you change?",
    score: 6,
  },
}