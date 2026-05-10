export const aiVendorEvaluation = {
  slug: "ai-vendor-evaluation",
  title: "The AI Vendor Pitch",
  isUnlocked: true,
  summary:
    "A vendor claims their AI will reduce your support ticket volume by 60%. They want a 12-month contract.",
  roles: ["PM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "SaaS",
  context: `You're the PM for a B2B SaaS product with ~50,000 customers. Your support team handles 8,000 tickets/month. Response time averages 18 hours. Customer satisfaction (CSAT) for support is 3.2/5.

A well-funded AI startup is pitching you their support automation product. The vendor's claims:
- "Our AI resolves 60% of tickets automatically with 94% accuracy"
- "Implementation takes 2 weeks"
- "ROI in 90 days"
- They show you a case study from a company in a different industry with 5,000 customers

The contract is $180,000/year. Your current support team costs $720,000/year in salaries.

Your VP of Engineering is skeptical. Your Head of Support is excited. You have a meeting with your CEO in 3 days.`,
  prompts: [
    {
      id: "p1",
      question:
        "Before the next meeting, what are the three most important things you need to verify about this vendor's claims? Explain why each matters.",
      followUp:
        "The vendor says their accuracy is measured on their internal test set. How does that change your analysis?",
      modelAnswer:
        "Three things I'd verify before any internal meeting: First, how they define 'automatically resolved' — this metric is trivially inflatable (a bot that closes a ticket counts, even if the customer re-opens it). Get a precise definition and ask what the re-open rate is on AI-closed tickets. Second, their accuracy measurement methodology — 94% on their internal test set is close to meaningless; I need to know what it looks like on live data at a company with similar ticket complexity, not their cherry-picked case study. Third, the actual cost of errors — at 94% accuracy on 4,800 AI-handled tickets, you're looking at ~288 wrong answers per month reaching paying customers. What's the recovery path and who absorbs the cost?",
    },
    {
      id: "p2",
      question:
        "How would you structure a pilot to evaluate this vendor? What would success look like, and what's your decision criteria?",
      followUp:
        "The vendor says a pilot isn't possible — they only do full deployments. How do you respond?",
      modelAnswer:
        "I'd propose a 60-day pilot on one ticket category — billing questions or password resets, something with clear right/wrong answers — representing 10–15% of total volume. Success criteria defined upfront and in writing before the pilot starts: automation rate ≥ 50% on that category, CSAT for AI-handled tickets within 0.3 points of our human-handled baseline, and re-open rate under 8%. I'd track those numbers weekly. If the vendor won't do a pilot, that's a real data point. Any vendor unwilling to validate their claims at limited scale before a $180k annual commitment is telling you something about their confidence in their own numbers.",
    },
    {
      id: "p3",
      question:
        "What's your recommendation to the CEO? Walk through your reasoning.",
      followUp: null,
      modelAnswer:
        "My recommendation: don't sign yet. The vendor's evidence doesn't transfer to our context — one case study at a different scale in a different industry isn't predictive of what happens with 50,000 B2B customers. I'd propose a bounded pilot: 60 days, one ticket category, pre-agreed success criteria. If they decline a pilot, I'd walk. If the pilot validates, we revisit the full contract with real data. The $720k/year support cost is real, but so is the reputational cost of 300 customers a month getting wrong answers from an AI. This decision needs to be made on our numbers, not their deck.",
    },
  ],
  rubric: [
    {
      criterion: "Claim Verification",
      description:
        "Identifies the right questions: methodology of accuracy measurement, definition of 'resolved,' data used for case study, reference customer contacts",
    },
    {
      criterion: "Pilot Design",
      description:
        "Proposes a time-boxed pilot with clear success metrics that align to business outcomes (CSAT, ticket volume, cost), not just technical claims",
    },
    {
      criterion: "Risk Assessment",
      description:
        "Identifies risks: vendor lock-in, what happens at 94% accuracy (6% error rate on 4,800 AI-handled tickets = 288 errors/month), data privacy, employee impact",
    },
    {
      criterion: "Stakeholder Management",
      description:
        "Manages the divergent views between Engineering (skeptical) and Support (excited) with evidence, not opinion",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "A solid analysis would center on the gap between vendor claims and verifiable evidence. The 60% resolution rate and 94% accuracy need to be validated on your data, not theirs.",
    strengths: [
      "Recognizing that case studies from different industries may not transfer",
      "Wanting to structure a pilot before committing",
    ],
    blindSpots: [
      "94% accuracy sounds high, but on 4,800 AI-handled tickets, that's ~288 errors/month — more than 10 wrong answers per day reaching customers",
      "Implementation time claims from vendors are almost always optimistic",
      "The contract structure matters: what happens if the vendor is acquired or shuts down?",
    ],
    improvements: [
      "Ask for direct references at similar-scale B2B companies",
      "Request a data processing agreement before discussing pricing",
      "Define 'automatically resolved' precisely — does it mean closed, or closed without re-open?",
    ],
    followUpQuestion:
      "If you ran a pilot and achieved 55% automation with 91% accuracy, would you still sign? What's the minimum bar you'd accept?",
    score: 6,
  },
}