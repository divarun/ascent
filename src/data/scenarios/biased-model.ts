export const biasedModel = {
  slug: "biased-model",
  title: "The Biased Model",
  isUnlocked: false,
  summary:
    "Six weeks after launch, an internal analysis reveals your AI screening feature approves male applicants at significantly higher rates than female applicants with equivalent qualifications.",
  roles: ["PM", "EM"] as const,
  difficulty: "ADVANCED" as const,
  industry: "HR Tech",
  context: `You're the PM (or EM) for an HR tech platform that launched an AI-assisted resume screening feature six weeks ago. The feature scores applicants on a 0–100 scale and recommends which candidates advance to a phone screen.

Fourteen enterprise customers are using it. Combined, the feature has processed 9,200 applications.

A data scientist on your team ran a routine quality analysis yesterday. The results:
- Male applicants: 34% advance rate
- Female applicants: 21% advance rate
- Controlling for years of experience, education level, and job title: the gap holds at ~11 percentage points
- The disparity is statistically significant (p < 0.001)

Your head of engineering suspects the training data — historical hiring decisions from customer companies — encoded existing bias in those companies' past hiring. The model learned "who gets hired" from data that already reflected unequal patterns.

Legal has been notified. They're meeting with you in two hours. No customers know yet.

You did not run a disparate impact analysis before launch. The feature has a "removes human bias" claim on the marketing page.`,
  prompts: [
    {
      id: "p1",
      question:
        "What are the immediate actions you take in the next 24 hours? Walk through your reasoning for each decision, including what you do and don't do right now.",
      followUp:
        "Legal says you can continue operating the feature while they assess liability. Is that the right call? What factors determine your answer?",
    },
    {
      id: "p2",
      question:
        "How do you communicate this to your fourteen enterprise customers? What do you tell them, when, and what do you offer?",
      followUp:
        "One customer asks: 'How many of our hiring decisions were affected?' How do you answer?",
    },
    {
      id: "p3",
      question:
        "What needs to change before this feature can relaunch — if it relaunches at all? What's your framework for deciding whether to fix and relaunch versus discontinue?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Severity Assessment",
      description:
        "Recognizes this is not a minor quality issue — it's a potential employment discrimination violation with legal exposure under Title VII (US) and similar statutes elsewhere",
    },
    {
      criterion: "Immediate Decision-Making",
      description:
        "Makes a defensible call about whether to pause the feature immediately, with clear reasoning — not 'wait for legal' as the only answer",
    },
    {
      criterion: "Customer Communication",
      description:
        "Proposes honest, specific communication rather than vague reassurance; addresses what customers should do with decisions already made using the feature",
    },
    {
      criterion: "Root Cause and Remediation",
      description:
        "Identifies training data as the likely root cause; proposes concrete technical and process changes — not just 'retrain the model'",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "This is a legal and ethical emergency before it's a product problem. The marketing claim 'removes human bias' compounds the exposure significantly. Strong responses move fast on customer communication and don't hide behind 'we're still investigating.'",
    strengths: [
      "Recognizing the legal exposure beyond just a product quality issue",
      "Proposing concrete customer communication rather than waiting",
    ],
    blindSpots: [
      "The 'removes human bias' marketing claim creates its own liability — customers relied on it",
      "Customers who used the feature have already made hiring decisions. The remediation question includes those past decisions, not just future ones.",
      "A disparate impact analysis should have been part of launch criteria, not a post-launch discovery",
    ],
    improvements: [
      "Define a minimum pre-launch fairness check as a release gate going forward",
      "Audit whether any other features were trained on historical human decisions without a bias review",
      "Consult an employment law specialist before crafting customer communications — the language matters legally",
    ],
    followUpQuestion:
      "If you relaunch the feature with bias mitigations in place, how do you verify the fix actually worked — and how do you communicate that credibly to customers who've already lost trust?",
    score: 6,
  },
}
