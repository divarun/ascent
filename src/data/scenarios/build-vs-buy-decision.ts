export const buildVsBuyDecision = {
  slug: "build-vs-buy-decision",
  title: "Build or Buy: The Vector Search Problem",
  isUnlocked: false,
  summary:
    "Your product needs semantic search. Your team wants to build it. The CTO wants to evaluate vendors. You have 6 weeks.",
  roles: ["EM", "IC"] as const,
  difficulty: "ADVANCED" as const,
  industry: "Enterprise Software",
  context: `You're an EM at a 120-person enterprise software company. The product team has identified semantic search as a high-priority feature: customers want to search a database of 5 million documents by meaning, not just keywords.

The situation:
- You have 6 weeks to deliver a demo for the flagship enterprise customer
- Your team includes 2 senior engineers with NLP experience
- Your data pipeline already runs on AWS
- The customer has strict data residency requirements (EU data must stay in EU)

Three options are on the table:

**Option A: Build on Pinecone/Weaviate**
- Cloud vector database
- Fast to integrate (days, not weeks)
- $800/month at your scale
- Unclear EU data residency story

**Option B: Self-host Weaviate on your own AWS infrastructure**
- Full control, EU compliance possible
- Estimated 3–4 weeks of engineering
- Your team has never operated a vector database in production
- Ongoing operational overhead

**Option C: Build from scratch**
- Two senior engineers estimate 8–10 weeks
- Full control
- Your CTO thinks this is crazy

Your engineering team is split. The senior engineers want to build (Option C). Your staff engineer thinks Option B is the pragmatic middle ground.`,
  prompts: [
    {
      id: "p1",
      question:
        "Walk through how you'd evaluate these three options. What information do you need that you don't have yet?",
      followUp:
        "Your two senior engineers tell you they can build it faster than 8 weeks if they 'focus.' How do you assess this claim?",
    },
    {
      id: "p2",
      question:
        "What's your recommendation and why? Defend it against the strongest counterargument.",
      followUp:
        "The CTO asks: 'What's our path to owning this capability instead of renting it?' How do you respond?",
    },
    {
      id: "p3",
      question:
        "You've chosen Option B. Two weeks in, the self-hosted setup is working but the engineers report it will take another 4 weeks, not 2. What do you do?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Information Gathering",
      description:
        "Identifies what's missing: Pinecone/Weaviate EU data residency details, actual operational overhead estimates, whether the demo truly needs production-grade infrastructure",
    },
    {
      criterion: "Decision Framework",
      description:
        "Applies a coherent framework: given the 6-week constraint and EU requirements, Option B is likely right, but with clear exit criteria if it slips",
    },
    {
      criterion: "Engineer Management",
      description:
        "Handles senior engineer optimism with evidence: asks for detailed breakdown, reviews past estimates, doesn't simply override but doesn't simply defer",
    },
    {
      criterion: "Replanning",
      description:
        "When Option B slips, re-evaluates all options with updated information rather than doubling down or giving up",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Build vs. buy decisions in AI infrastructure are often decided by ego rather than evidence. Engineers want to build; the question is whether that preference serves the user or the engineer.",
    strengths: [
      "Recognizing that the 6-week deadline fundamentally changes the option space",
      "Taking EU data residency seriously as a hard constraint",
    ],
    blindSpots: [
      "A demo and production infrastructure have very different requirements — you might be able to use Option A for the demo and revisit for production",
      "'Focus' is rarely a reliable way to accelerate already-optimistic engineering estimates",
      "The operational overhead of self-hosting includes on-call, incident response, upgrades — not just initial setup",
    ],
    improvements: [
      "Separate the demo requirement from the production requirement — they may have different answers",
      "Ask for the Pinecone/Weaviate EU data residency documentation before concluding it's unavailable",
      "Create a time-box for Option B: if it's not working in 2 weeks, switch to the cloud option and accept the compliance debt",
    ],
    followUpQuestion:
      "Six months later, the customer is happy and vector search is in production. You're getting 3x the query volume expected. What do you revisit in your architecture decision?",
    score: 6,
  },
}