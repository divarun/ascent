export const estimateAiFeature = {
  slug: "estimate-ai-feature",
  title: "Estimating a Feature That Involves an LLM",
  isUnlocked: false,
  summary:
    "Your PM needs a timeline estimate tomorrow for a RAG-based assistant feature — a customer commitment is on the line. You've never shipped a RAG feature before and the unknowns are real.",
  roles: ["IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "B2B SaaS",
  context: `You're a senior IC at a B2B SaaS company that sells project management software to mid-market companies. Your PM, Priya, has asked for a timeline estimate by tomorrow morning. The feature: an AI assistant that answers customer questions about their own data using retrieval-augmented generation (RAG) over their uploaded documents.

The user story: a customer uploads their project specs, contracts, and SOWs into the platform. They can then ask the assistant questions like "Which projects are at risk this quarter?" or "What did we agree to deliver in phase 2?" The assistant retrieves relevant chunks from their documents and generates an answer with citations.

You've built traditional features many times. You've used LLM APIs. But you've never built a RAG pipeline end to end, and specifically you haven't dealt with:
- How long prompt iteration will take to get answer quality to an acceptable level
- What an eval pipeline looks like for this kind of feature — and how long it takes to build one
- What "good enough" means for answer accuracy before you can ship to paying customers
- Latency variability: your retrieval layer, embedding step, and generation call each add latency in ways you haven't profiled yet

Priya says the estimate is needed because a large enterprise prospect has asked whether this capability will exist before their renewal conversation in 10 weeks. The sales team is hoping to commit to it.`,
  prompts: [
    {
      id: "p1",
      question:
        "What do you tell Priya tomorrow? Give an estimate and explain how you arrived at it.",
      followUp:
        "Priya asks you to commit to a specific date, not a range. How do you respond, and what's your reasoning?",
    },
    {
      id: "p2",
      question:
        "Priya says: 'Other teams have built RAG features in 3 weeks. Why would it take longer?' How do you respond?",
      followUp:
        "She follows up: 'If we can't commit, we might lose this customer. What would it take to get you to a 6-week estimate?' How do you handle this?",
    },
    {
      id: "p3",
      question: "What would you need to reduce your uncertainty before committing to a date?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Estimation Methodology",
      description:
        "Breaks the work into phases that include the eval loop and prompt iteration, not just the implementation. Acknowledges what they don't know and distinguishes between reducible uncertainty (a spike would help) and irreducible uncertainty (prompt iteration time is inherently variable).",
    },
    {
      criterion: "Prototype vs. Production Distinction",
      description:
        "Challenges the '3 weeks' benchmark by distinguishing prototype completeness from production readiness. Identifies what's missing from a 3-week RAG build: evals, latency budgets, fallback behavior, and customer-acceptable accuracy thresholds.",
    },
    {
      criterion: "Customer Commitment Handling",
      description:
        "Understands the difference between 'I can estimate this' and 'you should commit this to a customer.' Doesn't let sales pressure compress an honest estimate — instead proposes what would reduce uncertainty enough to support a commitment.",
    },
    {
      criterion: "Spike Proposal",
      description:
        "Offers a concrete path to a better estimate: a time-boxed technical spike on the core unknowns (retrieval quality, latency, eval design) before committing to a delivery date. Frames this as reducing risk for the business, not avoiding accountability.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses identify the eval loop as the phase that breaks standard estimation for AI features — it doesn't exist in traditional feature work, its duration depends on how quickly you can find out the prompt isn't working, and it can be as long as the initial build. The right move is often to propose a spike before giving a number, not to give a padded number and hope.",
    strengths: [
      "Naming the specific unknowns — eval pipeline design, prompt iteration cycles, latency profiling — rather than adding generic padding to a standard estimate",
      "Distinguishing between a prototype timeline and a production timeline when responding to the '3 weeks' comparison",
    ],
    blindSpots: [
      "The eval loop is the part of an AI feature timeline that doesn't exist in traditional features — prompt iteration plus evaluation plus re-iteration can take as long as the initial build. Engineers who estimate only the implementation phase consistently underestimate by 40-60%, and when the eval loop runs long, the entire customer commitment is at risk with no early warning.",
      "'Other teams built it in 3 weeks' almost always refers to a working demo or internal prototype, not a production feature with customer-acceptable accuracy, latency SLAs, fallback behavior, and a monitoring pipeline. Accepting that comparison means agreeing to be held to a prototype timeline for production work.",
      "Committing to a customer date before running even a 2-day spike on the core technology is the highest-risk path in the scenario. If the retrieval quality on real customer documents is worse than expected, you'll discover it after the commitment is made — not before. A spike is not a delay, it's the information the estimate requires.",
    ],
    improvements: [
      "Propose a 2-day technical spike before giving a final estimate: load real customer document samples, build a minimal retrieval pipeline, and measure answer quality on 20 representative questions. This spike produces the data the estimate needs.",
      "When presenting your estimate, break it into phases with explicit uncertainty labels: implementation (low uncertainty), eval pipeline build (medium), prompt iteration cycles (high). This gives your PM a clear picture of where the schedule risk lives.",
      "Offer Priya two numbers: the earliest plausible date if everything goes well, and the most likely date given realistic iteration cycles — and explain what would have to be true for the earlier date to hold. This is more useful than a single number.",
    ],
    followUpQuestion:
      "You ran the spike. Retrieval quality on real customer documents is lower than expected — 60% of answers are missing key information. This suggests the chunking strategy needs rethinking before you can rely on prompt iteration to close the gap. How does this change your estimate and your conversation with Priya?",
    score: 6,
  },
}
