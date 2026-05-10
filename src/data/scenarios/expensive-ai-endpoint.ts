export const expensiveAiEndpoint = {
  slug: "expensive-ai-endpoint",
  title: "The Expensive AI Endpoint",
  isUnlocked: false,
  summary:
    "Your AI feature is running at 8x the estimated cost. At current usage, it's unsustainable. You have one week to present a cost reduction plan.",
  roles: ["EM", "IC"] as const,
  difficulty: "ADVANCED" as const,
  industry: "SaaS",
  context: `You're an engineer (or EM) at a 40-person SaaS startup. Three weeks ago you launched an AI feature: users can highlight any text in your product and ask a question about it. The feature uses a frontier large language model.

Pre-launch cost estimate: $0.004/request (based on internal test scenarios).
Actual production cost: $0.031/request — nearly 8x over estimate.

With 6,000 daily active users averaging 12 requests each, you're spending $2,232/day against a budget of $288/day.

The CEO flagged this at the all-hands: "This feature costs more than our entire infrastructure budget. It either gets cheaper this week or we pull it."

You pull the production metrics:
- Average input tokens: 3,200 (your test scenarios averaged ~400)
- Average output tokens: 860
- P95 latency: 14 seconds
- Cache hit rate: 0% (caching was not implemented)
- Model: frontier model, full price tier
- No output length constraints set`,
  prompts: [
    {
      id: "p1",
      question:
        "Why is the actual cost 8x your pre-launch estimate? Walk through exactly what was missed and why.",
      followUp:
        "A teammate suggests switching to a cheaper model as the fastest fix. How do you respond?",
    },
    {
      id: "p2",
      question:
        "Design a cost reduction plan targeting 70% cost reduction without significantly degrading the feature. Walk through each lever you'd pull and the expected impact of each.",
      followUp:
        "The CEO asks: 'Could we just charge users for this feature instead of including it in the base plan?' How do you evaluate that option?",
    },
    {
      id: "p3",
      question:
        "What should the cost estimation and monitoring process look like going forward? What specifically was missing from your pre-launch process that led here?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Root Cause Analysis",
      description:
        "Identifies the core estimate failure: test inputs were short and clean; real users highlight large document sections or entire pages. The 8x token gap (400 vs 3,200 input tokens) is the primary driver. Secondary: no output length constraints, no caching.",
    },
    {
      criterion: "Cost Reduction Plan",
      description:
        "Addresses multiple levers with expected impact: input truncation (limit to highlighted selection + minimal context window), semantic caching, output length limits, model routing for simple queries. Does not rely on a single fix.",
    },
    {
      criterion: "Model Switch Trade-Off",
      description:
        "Evaluates model downgrade on capability, not just cost. Recommends testing a cheaper model against representative real-world queries before switching in production — not a blind swap.",
    },
    {
      criterion: "Process Improvement",
      description:
        "Identifies the root process failure: test scenarios did not represent real user behavior. Proposes production-representative load testing, cost monitoring dashboards, and per-request cost alerting as ongoing practice.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The 8x gap is a classic failure of test-versus-production input distribution. Test scenarios are polished and short; real users highlight entire documents. Cost estimation that doesn't model P95 input size will always underestimate at production scale.",
    strengths: [
      "Recognizing that real user behavior differs systematically from test behavior — users highlight paragraphs and documents, not sentences",
      "Understanding that a model switch requires capability validation on real queries before deployment, not just a cost calculation",
    ],
    blindSpots: [
      "The 0% cache hit rate is the most immediately actionable item — many 'highlight and ask' queries on the same popular content are identical or near-identical, and caching requires no model change",
      "3,200 average input tokens suggests users are sending far more than just the highlighted text — check whether the full document is being included unnecessarily in the context",
      "P95 latency of 14 seconds is already a UX problem independent of cost — fixing input token bloat reduces both cost and latency simultaneously",
    ],
    improvements: [
      "Truncate input: pass only the highlighted selection + a 200-token context window, not surrounding document content — this alone can cut input tokens 60–70%",
      "Implement semantic caching immediately: cache responses for identical or near-identical highlighted text + question pairs — expected 20–30% cost reduction with no quality impact",
      "Set output length limits: if responses don't need to be more than 300 tokens, cap them — output tokens are priced 3–5x higher than input tokens",
    ],
    followUpQuestion:
      "After your changes, cost drops to $0.009/request. The CEO asks: 'Can we now support 10x the current users without cost becoming a problem again?' What's your answer?",
    score: 6,
  },
}