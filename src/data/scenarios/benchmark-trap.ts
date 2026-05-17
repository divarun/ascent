export const benchmarkTrap = {
  slug: "benchmark-trap",
  title: "The Benchmark That Didn't Travel",
  isUnlocked: false,
  summary:
    "You switched embedding models based on a vendor's MTEB benchmark showing 40% better retrieval. Three months later, search quality hasn't improved. The vendor wants to schedule a QBR. You need to figure out what happened first.",
  roles: ["EM", "IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "Developer Tools",
  context: `You run the search and discovery team at a developer documentation platform. Your core product is semantic search across technical documentation — developers query the platform to find API references, tutorials, and troubleshooting guides.

Four months ago, your vendor's sales team presented a compelling case: their new embedding model showed 40% improvement on retrieval recall in MTEB benchmarks, specifically on the "technical documentation retrieval" task category. The benchmark numbers were real and verified. You ran a quick test — sent 20 sample queries through both models and the new model's results looked plausible.

You made the switch. The migration was clean. Three months have passed.

Your search quality metrics haven't moved. Median click-through rate on search results: unchanged. User satisfaction scores: unchanged. "Search didn't find what I needed" support tickets: unchanged, possibly slightly higher. The product manager on your team is starting to ask questions.

Your vendor's customer success manager reached out to schedule a quarterly business review. They want to review the value delivered since the embedding migration.

Before that meeting, you need to understand what happened: why didn't the benchmark improvement translate, and what do you do next.`,
  prompts: [
    {
      id: "p1",
      question:
        "Walk through how you'd investigate why the benchmark improvement didn't translate to production. Where do you start, and what are you looking for?",
      followUp:
        "Your investigation reveals that the MTEB benchmark's 'technical documentation' test set consists primarily of Wikipedia technical articles and academic CS papers. Your platform primarily indexes proprietary vendor documentation and custom tutorials with unusual formatting and domain-specific terminology. Does this explain the gap? What else might be contributing?",
    },
    {
      id: "p2",
      question:
        "What should you have done differently before making the migration decision? Design the evaluation process you wish you had run.",
      followUp:
        "Your engineer says: 'We ran 20 sample queries before switching and the results looked fine.' What's wrong with that evaluation approach, and what would 'fine' have needed to mean to be meaningful evidence?",
    },
    {
      id: "p3",
      question:
        "How do you handle the vendor QBR? The vendor's CS team genuinely believes their product helped you. You have no evidence it harmed you — just that it didn't help in the way you expected.",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Distribution Mismatch Diagnosis",
      description:
        "Identifies that MTEB's test distribution (Wikipedia/academic) doesn't match the production distribution (proprietary vendor documentation) as the likely primary explanation for the gap",
    },
    {
      criterion: "Evaluation Design",
      description:
        "Designs a pre-migration evaluation that would have been meaningful: sample queries from real production traffic, documents from the actual corpus, metrics tied to the real downstream outcome (click-through, not just retrieval recall)",
    },
    {
      criterion: "\"Looked Fine\" Critique",
      description:
        "Correctly identifies that 20 sample queries with subjective assessment is not a valid evaluation — explains specifically what's wrong (sample size, lack of baseline comparison, subjective scoring, no measurement of the distribution that matters)",
    },
    {
      criterion: "Vendor Conversation",
      description:
        "Approaches the vendor conversation as collaborative problem-solving rather than adversarial blame, while being direct about the expectation gap and what evidence would establish whether the product is delivering value",
    },
    {
      criterion: "Forward-Looking Decision",
      description:
        "Identifies a concrete next step: either run a proper evaluation to determine whether to stay or switch back, or establish metrics that would tell you the answer within a defined time window",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The benchmark trap is a common and expensive mistake. The core failure was treating a benchmark result as a proxy for production performance without validating whether the benchmark's test distribution matched the production distribution. A 40% improvement on somebody else's test set is strong evidence that the model is better on somebody else's test set — not that it's better on yours. Strong responses identify this clearly, design the evaluation that should have been run, and approach the vendor conversation as a joint investigation rather than a blame assignment.",
    strengths: [
      "Recognizing that distribution mismatch — not model quality — is the most likely explanation: MTEB's technical documentation category was not representative of proprietary vendor documentation",
      "Designing a pre-migration evaluation using actual production queries and the actual corpus, with a baseline comparison using real downstream metrics",
      "Treating the vendor conversation as information-gathering rather than grievance — the vendor's benchmark result was accurate; the failure was the evaluation process, not fraud",
    ],
    blindSpots: [
      "The 'looked plausible' evaluation of 20 sample queries before migration is the proximate failure and deserves explicit critique. Plausibility is not measurement. 20 queries is not a sample size that captures distribution. No baseline comparison means you have no idea whether 'looks good' means better, worse, or the same.",
      "Other factors worth investigating before concluding the embedding model is the problem: did the chunking strategy interact differently with the new model? Did metadata filtering behavior change? Did the reranking step (if any) behave differently on the new embedding space? The embedding model is the most visible change but not necessarily the only relevant one.",
      "The support ticket data ('possibly slightly higher') is the most important signal in the problem statement and is mentioned almost in passing. A small increase in 'search didn't find what I needed' tickets is a real regression and should be quantified and investigated first.",
    ],
    improvements: [
      "Before the vendor QBR, run the evaluation you should have run before migration: 100 real production queries, judge relevance of top-5 results on both the old and new embedding model (you can still access both), measure the difference. Now you have actual data for the meeting.",
      "When presenting this internally, frame it as an evaluation process failure, not a vendor failure. The process for model migration decisions needed to include: evaluation on production corpus samples, metric definition before the switch, and a defined measurement window with success criteria.",
      "For the vendor meeting: 'We want to understand whether we're getting value. Here's the metric we care about: search click-through on developer documentation. Here's what we've observed since migration: no change. Here's the evaluation we'd like to run together to understand why.' This makes it a partnership, not a complaint.",
    ],
    followUpQuestion:
      "You want to establish a process so this doesn't happen again. Write the model migration policy you'd propose for your team — what steps are required before any model change ships to production, and who approves it?",
    score: 6,
  },
}
