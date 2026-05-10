export const legalComplianceEscalation = {
  slug: "legal-compliance-escalation",
  title: "The Legal/Compliance Escalation",
  isUnlocked: false,
  summary:
    "Legal just flagged your shipped AI screening feature for potential employment discrimination violations. VP Sales says pulling it means losing accounts. You have 48 hours.",
  roles: ["PM", "EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "HR Tech",
  context: `You're the PM for a B2B HR tech platform. Six weeks ago, you shipped an AI-powered candidate screening feature. The feature uses an LLM to score resumes against job descriptions and generates a ranked shortlist by "fit score." It's been well-received — 14 customers are actively using it, and it's a core part of your enterprise pitch.

Your Chief Compliance Officer just sent a calendar invite: "AI Screening — Urgent." In the meeting, she explains: Legal has been reviewing the feature and flagged multiple concerns under employment discrimination law (EEOC guidelines on AI hiring tools):
1. The model's scoring factors are not explainable — you can't say why a candidate received a particular score
2. No disparate impact analysis has been run on the output
3. Your marketing claims the feature "removes human bias from hiring" — Legal considers this both legally exposed and factually inaccurate

The CCO says Legal wants the feature paused within 48 hours pending a full review. She says "we're not certain about severity, but we need to be conservative."

Your VP of Sales pushes back immediately in the same thread: "We sold this to 14 customers as core functionality. Pulling it will cost us accounts and damage pipeline." The CEO is cc'd.`,
  prompts: [
    {
      id: "p1",
      question:
        "How do you assess the severity of the legal concern? What do you need to understand before deciding whether to pause the feature?",
      followUp:
        "Legal says they're not sure about severity but want to be conservative. Your VP Sales says conservative means losing customers. How do you break the tie?",
    },
    {
      id: "p2",
      question:
        "What's your recommendation — pause or continue? Walk through your reasoning, including the risks of both decisions.",
      followUp: null,
    },
    {
      id: "p3",
      question:
        "If you pause the feature, how do you communicate this to the 14 affected customers? What do you tell them and what do you offer?",
      followUp:
        "One customer responds: 'We chose your platform specifically for this feature. If it's gone for months we're switching vendors.' How do you respond?",
    },
  ],
  rubric: [
    {
      criterion: "Risk Assessment",
      description:
        "Recognizes that employment discrimination violations are a high-stakes category — EEOC investigations, class action exposure, and regulatory risk — not a minor compliance detail to weigh against commercial pressure at face value.",
    },
    {
      criterion: "Decision Framework",
      description:
        "Recommends pausing or significantly restricting the feature. Understands that commercial risk from pausing is recoverable; legal and reputational risk from continuing is not. Does not let VP Sales pressure override the legal risk category.",
    },
    {
      criterion: "Stakeholder Management",
      description:
        "Manages the VP Sales escalation without dismissing business risk — acknowledges it, quantifies it — but is clear that legal review is not optional in this category. Frames pausing as protecting the business, not capitulating to Legal.",
    },
    {
      criterion: "Customer Communication",
      description:
        "Direct, honest communication to customers: what's paused, why (at an appropriate level of detail), and what the review timeline looks like. Doesn't over-promise timelines or minimize the change.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "When Legal flags potential employment discrimination violations, the commercial cost of pausing is always smaller than the legal cost of continuing. The question isn't whether to take this seriously — it's how to pause cleanly, run the review fast, and return with a feature that's defensible.",
    strengths: [
      "Recognizing that 'not sure about severity' from Legal is still sufficient justification to pause in a high-stakes legal category",
      "Understanding that VP Sales pressure is real but doesn't override legal risk — especially in employment law",
    ],
    blindSpots: [
      "The 'removes bias' marketing claim is a separate problem from the feature itself — it must be corrected regardless of the review outcome, and it may be the most legally exposed element",
      "A disparate impact analysis should have been done before shipping a scoring feature, not after a legal flag — this is a pre-launch process failure",
      "The 14 customers who used the feature may have made hiring decisions based on the output — that retroactive risk needs to be scoped as part of the review",
    ],
    improvements: [
      "Establish legal/compliance review as a mandatory pre-launch gate for any AI feature in high-stakes domains: hiring, lending, housing, credit",
      "Replace 'removes human bias' with accurate language: 'applies consistent criteria at scale' — never claim bias removal, which is both overclaimed and legally problematic",
      "Commission a disparate impact analysis as part of the review and publish the results to customers proactively",
    ],
    followUpQuestion:
      "The legal review takes 8 weeks. When you relaunch, what's different about the feature and how do you prove it to the customers who stayed?",
    score: 6,
  },
}
