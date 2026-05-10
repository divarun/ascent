export const hallucinatingExecutiveDemo = {
  slug: "hallucinating-executive-demo",
  title: "The Hallucinating Executive Demo",
  isUnlocked: true,
  summary:
    "Your CEO demoed your AI feature live to three enterprise customers. The model fabricated competitor facts. Customers noticed. You have until 9am to explain what happened.",
  roles: ["PM", "EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "Enterprise SaaS",
  context: `You're the PM for an AI-powered competitive intelligence feature your company launched two months ago. The feature summarizes competitive news, generates talking points, and surfaces "intelligence" for the sales team. It's positioned to customers as "AI-powered intelligence, always current."

Yesterday, your CEO used the feature live in an executive roundtable with your three largest enterprise customers. During the live demo:
- The AI confidently stated that a named competitor was "exiting the mid-market segment" (fabricated)
- It cited a "Q3 earnings call" from that competitor that does not exist
- It attributed a quote to the competitor's CTO that was never said

Two of the three customers had received a different story directly from the competitor. The room went quiet. The meeting ended early. Your CEO sent a Slack at 10:30pm: "We need to talk at 9am. What happened and what's our plan?"

The feature has been running for two months. No human review is in the loop. The model generates summaries from web searches and its own training data — there are no citations and no grounding against verified sources.`,
  prompts: [
    {
      id: "p1",
      question:
        "What happened here — technically and process-wise? Walk through the root cause of what the AI did and why.",
      followUp:
        "The CEO's first instinct is to pull the feature entirely. How do you advise them?",
    },
    {
      id: "p2",
      question:
        "What do you communicate to the three customers, and how quickly? Draft the key points of what you'd say.",
      followUp:
        "One customer asks directly: 'Can we trust anything your AI feature has told our sales team over the past two months?' How do you answer?",
    },
    {
      id: "p3",
      question:
        "What does the next version of this feature look like? What specifically has to change before it's re-enabled for customers?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Root Cause Analysis",
      description:
        "Identifies that hallucination on recent specific factual claims (named events, quotes, competitive movements) is a predictable LLM failure mode, not a random fluke. The missing structural piece: no grounding against verified sources, no citations, no human review layer.",
    },
    {
      criterion: "Triage Decision",
      description:
        "Advises pausing or significantly restricting the feature rather than defending it. Understands that continuing while unresolved compounds trust damage beyond the original incident.",
    },
    {
      criterion: "Customer Communication",
      description:
        "Recommends direct, fast, honest communication — acknowledges the specific error, doesn't minimize it, doesn't blame 'the AI.' Understands the 2-month retroactive trust question is serious and can't be hand-waved.",
    },
    {
      criterion: "Feature Redesign",
      description:
        "Proposes concrete structural changes: RAG from verified sources, mandatory citations on factual claims, human review for named-entity claims, or changed positioning that doesn't overclaim currency or accuracy.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "This is a product design failure, not a model failure. LLMs hallucinate on recent specific facts — named events, quotes, competitive movements — predictably. Shipping a feature positioned as 'always current intelligence' without grounding it in verified real-time sources was the decision that led here.",
    strengths: [
      "Recognizing that human review is necessary before AI-generated factual claims reach external audiences",
      "Understanding that customer trust recovery requires honesty and specificity, not deflection",
    ],
    blindSpots: [
      "Every output the feature produced in two months is now under suspicion — that's a significant retroactive liability that needs to be scoped before your next customer conversation",
      "The sales team may have used these talking points with other customers beyond those three; the blast radius may be larger than one room",
      "'The model hallucinated' is not a customer-facing explanation — you need plain language about what happened and what you're doing about it",
    ],
    improvements: [
      "Before re-enabling: RAG from verified, timestamped sources with mandatory citations on every claim",
      "Add provenance to every output: 'Generated from [source], [date]' — if you can't source it, don't show it",
      "Change positioning from 'intelligence' to 'AI-assisted drafts for human review' — the former overclaims what the system can reliably do",
    ],
    followUpQuestion:
      "Six months from now, the feature is rebuilt with citations and human review. You want to re-pitch it to the three customers who were in that room. What's your opening line?",
    score: 5,
  },
}