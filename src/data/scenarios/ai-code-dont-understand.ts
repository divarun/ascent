export const aiCodeDontUnderstand = {
  slug: "ai-code-dont-understand",
  title: "The AI Wrote Code You Don't Fully Understand",
  isUnlocked: false,
  summary:
    "Claude Code generated a working 380-line caching implementation that passes all your tests. You understand the concept but couldn't reproduce it. Your EM wants you to present it at tomorrow's architecture review.",
  roles: ["IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "Engineering",
  context: `You're a senior IC working on a high-traffic service that processes real-time event streams. Your task: implement a caching and invalidation system that handles high write throughput without serving stale data to downstream consumers.

You used Claude Code to implement the solution. After a few iterations, the agent produced a working implementation: 380 lines across 4 files. It uses a write-through cache with event-sourced invalidation — the cache is updated on every write, and invalidation events are published to a message bus so other instances can update their local caches without polling.

The implementation passes all your tests. When you run it locally against simulated load, it behaves correctly. The agent explained its approach at a high level during generation.

The problem: you've seen write-through caches before, but you've never built one with event-sourced invalidation. You understand the concept — writes propagate to cache, invalidation events propagate to subscribers — but if someone asked you to reproduce this implementation from scratch right now, you couldn't. You know what it does; you're less certain about every decision it made in doing it.

Your EM, Marcus, asks you to present the implementation at tomorrow's architecture review. The team reviews all significant infrastructure changes before they go to production. Marcus's framing: "Walk us through what you built and why it works."`,
  prompts: [
    {
      id: "p1",
      question: "Do you ship it? How do you think through this decision?",
      followUp:
        "A teammate says: 'If the tests pass and it works under load, that's the bar. We don't need to understand every line.' How do you respond?",
    },
    {
      id: "p2",
      question:
        "How do you prepare for the architecture review given you can't fully explain the implementation?",
      followUp:
        "During the review, a senior engineer asks: 'What happens if the message bus goes down mid-invalidation? Walk me through the failure mode.' How do you handle this?",
    },
    {
      id: "p3",
      question:
        "Six months later, there's a production incident in the caching layer. A new engineer comes to you for help debugging. Walk through what happens.",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Code Ownership Standard",
      description:
        "Articulates that submitting a PR means claiming ownership and maintainability, not just that tests pass. Understands the difference between 'it works' and 'I understand it well enough to debug it at 2am.'",
    },
    {
      criterion: "Architecture Review Preparation",
      description:
        "Uses the architecture review as a forcing function to understand the code — reads it line by line, traces failure modes, asks the agent to explain specific decisions — rather than treating it as a presentation to get through.",
    },
    {
      criterion: "Test Coverage Skepticism",
      description:
        "Recognizes that passing tests validate the cases you thought to test. Implementation edge cases you don't understand are exactly the cases you didn't think to test. 'Tests pass' and 'correct' are not equivalent for code you can't fully reason about.",
    },
    {
      criterion: "Production Incident Realism",
      description:
        "Is honest about what happens when a new engineer asks for help debugging code you don't fully understand — you become a blocker instead of a resource, and the incident timeline extends.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses treat the architecture review as the right moment to close the understanding gap, not as a presentation to survive. The question isn't whether to ship the implementation — it's whether you can honestly stand behind it. That requires understanding it, and the review is the deadline that forces you to do that work.",
    strengths: [
      "Recognizing that the architecture review is an opportunity to develop understanding, not a hurdle before shipping — the review's value is proportional to what you learn preparing for it",
      "Being honest about the gap between 'I understand the concept' and 'I understand this implementation' — they're not the same thing for infrastructure code",
    ],
    blindSpots: [
      "The tests you wrote for code you don't fully understand test the cases you thought of. The implementation has edge cases you didn't think to test precisely because you didn't understand all the decisions it made. 'Tests pass' is weak evidence for correctness when your test suite was designed by someone who didn't fully understand the implementation — which is you.",
      "The architecture review is your moment to understand the code before it's in production. If you walk into it planning to present rather than learn, and it gets approved, you've just made this code yours — with all the on-call responsibility that implies — without closing the understanding gap. What happens at 2am is that you're the owner of code you can't debug.",
      "Six months later, when a new engineer asks you to help debug the caching layer, your inability to explain the implementation doesn't just affect you — it becomes their blocker. Incidents that depend on tribal knowledge of undocumented design decisions take longer to resolve, and the cost of that is paid by users during the incident and by your team's trust in the system afterward.",
    ],
    improvements: [
      "Before the architecture review, read the implementation line by line and write a brief design doc that explains each decision in your own words. If you can't write that doc, you're not ready to present. If you can, you're ready to ship.",
      "For infrastructure code you didn't write yourself, add a comment block at the top of each file that explains the design invariants — what must always be true for the code to behave correctly. Writing this forces understanding; it also makes future debugging tractable.",
      "Use the architecture review explicitly: tell the team 'I built this with AI assistance, and here are the two decision points I want to reason through with the group.' This is more useful than a confident walkthrough of code you don't fully understand.",
    ],
    followUpQuestion:
      "You've understood the implementation thoroughly and shipped it. Three months later, a requirement changes: the cache needs to support partial invalidation at the field level, not just record-level invalidation. You need to modify the event-sourced invalidation logic. How does your approach differ now compared to if you had used AI to generate the modification?",
    score: 6,
  },
}
