export const aiFeatureScope = {
  slug: "ai-feature-scope",
  title: "The AI Feature Scope Creep",
  isUnlocked: false,
  summary:
    "Your engineering team has been building an AI writing assistant for 6 weeks. Scope has doubled. Leadership wants to ship in 2 weeks.",
  roles: ["EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "Product",
  context: `You're the Engineering Manager for a 6-person team. Six weeks ago, you scoped an AI writing assistant: a feature to help sales reps draft outbound emails using context from the CRM.

Original scope (Week 1):
- Email drafting from deal context
- Tone selection (formal/casual)
- One-click insert to email client

What got built (Week 6):
- All of the above, plus...
- Multi-language support (added by a senior engineer "since we're already integrating")
- Brand voice customization (requested by Marketing)
- Email performance analytics (Product Manager added to the backlog and it "just made sense")
- A/B testing framework (engineer thought it would be useful)

Current state: The core feature works. The additions are 60–70% complete and untested. Leadership has announced to sales the feature ships in 2 weeks.

One of your senior engineers thinks shipping anything less than the full vision would "embarrass the team."`,
  prompts: [
    {
      id: "p1",
      question:
        "How did this happen, and what would you do differently in the future? Be specific about what process failures led to this situation.",
      followUp:
        "Your senior engineer argues that the additions are 'almost done.' How do you respond?",
    },
    {
      id: "p2",
      question:
        "What do you ship in 2 weeks? Walk through your scoping decision and the criteria you used.",
      followUp:
        "The PM wants to include brand voice customization because Marketing has been asking for it for months. How do you handle this?",
    },
    {
      id: "p3",
      question:
        "How do you communicate the situation to leadership, and what do you need from them?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Root Cause Analysis",
      description:
        "Identifies multiple failure points: no clear scope gates, insufficient PM involvement, individual engineers making scope decisions, no mid-project check-in",
    },
    {
      criterion: "Scoping Decision",
      description:
        "Ships the core feature. Articulates clear criteria for what's in/out based on: completeness, test coverage, user value, reversibility",
    },
    {
      criterion: "Team Management",
      description:
        "Handles the senior engineer's perspective respectfully but firmly, tying the decision to user trust and product quality, not embarrassment",
    },
    {
      criterion: "Upward Communication",
      description:
        "Communicates clearly to leadership: what's shipping, what's not, why, and what's the plan for the rest — without blame or excessive detail",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Scope creep in AI features is especially common because the surface area is large — once you have an LLM, 'adding' things feels cheap. The discipline of saying no is what separates good AI PMs and EMs from mediocre ones.",
    strengths: [
      "Recognizing that 60-70% complete features are a liability, not an asset",
      "Understanding that leadership announcements create external constraints",
    ],
    blindSpots: [
      "The senior engineer's concern about embarrassment is about identity, not product — this needs to be addressed directly, not worked around",
      "Every unfinished feature in a release has a maintenance cost and a bug surface",
      "'Almost done' in engineering almost never means what it sounds like",
    ],
    improvements: [
      "Implement scope gates: any addition requires explicit PM+EM sign-off, not just engineering discretion",
      "Run weekly check-ins against original scope, not just status updates",
      "Create a 'Phase 2 backlog' that captures good ideas without letting them expand the current sprint",
    ],
    followUpQuestion:
      "Three months after shipping the core feature, analytics show only 20% of sales reps are using it. What do you investigate first?",
    score: 6,
  },
}
