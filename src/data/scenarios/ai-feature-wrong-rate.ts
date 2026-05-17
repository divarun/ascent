export const aiFeatureWrongRate = {
  slug: "ai-feature-wrong-rate",
  title: "The AI Feature That's Wrong 8% of the Time",
  isUnlocked: false,
  summary:
    "Your AI recommendation engine launched 3 weeks ago and support tickets are up 12%. The model team says 8% error rate is within acceptable range. Your VP wants your recommendation today.",
  roles: ["PM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "Consumer Tech",
  context: `You're PM for a meal planning app with 500,000 daily active users. Three weeks ago, your team shipped an AI-powered recommendation engine that suggests recipes based on dietary restrictions, pantry inventory, and past cooking history. Users interact with it twice per day on average — once in the morning for a dinner suggestion and once at night for the next day's prep list.

At 500K DAUs with 2 recommendations per user per day, your recommendation volume is 1 million per day. With an 8% error rate, the engine is serving approximately 80,000 wrong recommendations every single day. "Wrong" in your context means: recommending recipes with ingredients the user explicitly flagged as allergens, suggesting dishes that require an appliance the user said they don't own, or producing a prep list that doesn't match the recipe shown.

Support tickets have climbed 12% since launch. Your support team has categorized the ticket types: 41% are allergen-related errors ("it recommended shellfish, I'm allergic"), 35% are appliance mismatches, 24% are prep list inconsistencies.

The model team's position: "8% error rate is within acceptable range for recommendation systems of this class. Our primary competitors are running at 9–11%. We expect it to improve with more interaction data over the next 60 days."

Your VP of Product wants your recommendation today — keep it running as-is, modify it, or pull it. Pulling the feature means reverting to the rule-based engine that shipped before it, which had a 0.4% error rate but was perceived as less personalized. Engineering estimates a targeted fix to the allergen recall issue specifically would take 3 weeks.`,
  prompts: [
    {
      id: "p1",
      question:
        "The model team says 8% is 'within acceptable range for this class of problem.' How do you evaluate that claim? What makes an error rate acceptable or unacceptable?",
      followUp:
        "The model team points out that the old rule-based engine also made errors — users just didn't attribute them to AI. Does that change your assessment?",
    },
    {
      id: "p2",
      question:
        "How do you frame your recommendation to your VP? What tradeoffs do you surface, and what do you recommend?",
      followUp:
        "Your VP asks: 'If we pull it and go back to the rule-based engine, what do we tell users?' How do you handle the communication?",
    },
    {
      id: "p3",
      question:
        "What does this feature need — technically and in terms of process — before it can run at scale without these error rates? What's your minimum bar for 'safe to keep on'?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Error Rate Contextualization",
      description:
        "Reframes the 8% figure in terms of consequence: 80,000 wrong recommendations per day, with a meaningful fraction involving allergen errors, is not equivalent to 8% wrong movie suggestions. Recognizes that 'acceptable range' depends on what category of harm the error produces.",
    },
    {
      criterion: "Competitor Comparison Critique",
      description:
        "Challenges the 'competitors have similar rates' argument: competitors' error profiles may differ (movie recs vs. allergen recommendations), competitor rates are unverified, and matching a bad industry average is not a standard for shipping.",
    },
    {
      criterion: "Recommendation Quality",
      description:
        "Makes a clear recommendation with reasoning rather than hedging. Recognizes that modifying the feature (e.g., patching allergen recall specifically while keeping the broader engine running) is a viable middle path between 'keep' and 'pull.'",
    },
    {
      criterion: "Feature Readiness Bar",
      description:
        "Articulates a specific minimum standard — such as near-zero tolerance for allergen errors regardless of overall error rate — and proposes a concrete path to get there before the feature stays live.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses separate error rate from error consequence and set a tiered standard: some categories of error have near-zero tolerance regardless of overall rate. The framing of '8% is industry standard' is a deflection that avoids engaging with the specific harm profile of this app's errors.",
    strengths: [
      "Recognizing that allergen errors require a different tolerance threshold than recommendation quality errors",
      "Proposing a targeted fix (allergen recall) rather than treating the feature as all-or-nothing",
    ],
    blindSpots: [
      "Users who receive wrong recommendations — especially allergen errors — are likely to disengage quietly rather than file tickets. The 12% support ticket increase understates the problem because most affected users don't report. Future engagement data will be collected from users who stayed, which skews toward users who weren't affected. The model will appear to improve while the actual user pool has already contracted.",
      "The model team's claim that '8% is within acceptable range for this class of problem' treats all recommendation errors as equivalent. That framing doesn't engage with what happens when the error type is an allergen exposure — a class of harm with real health consequences and real legal exposure. Matching a statistical benchmark does not satisfy a duty of care.",
      "Pulling the feature after 3 weeks of 'this is within acceptable range' messaging creates an internal credibility problem: the team defended the rate, then reversed. That damages the model team's future credibility and makes it harder to ship quickly next time, regardless of whether the pull decision was correct.",
    ],
    improvements: [
      "Set a tiered error tolerance: overall recommendation quality can accept some error rate, but allergen and dietary restriction errors must have a separate, near-zero threshold enforced before re-enabling full traffic",
      "Add a safety layer independent of the model: a rule-based filter that catches recommendations violating explicit user allergen flags, regardless of what the model outputs",
      "Before using 'competitors have similar rates' as a benchmark, verify the comparison is valid: are competitor products in the same error consequence category? If not, the comparison is irrelevant",
    ],
    followUpQuestion:
      "Three weeks from now, the allergen recall issue is patched. The overall error rate is down to 5.2%. Is the feature ready to stay on? What additional information do you want before you answer?",
    score: 6,
  },
}
