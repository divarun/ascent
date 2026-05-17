export const pmScopeFight = {
  slug: "pm-scope-fight",
  title: "The Scope Fight",
  isUnlocked: false,
  summary:
    "Engineering says 6 months for the AI contract analysis feature. Sales promised it in 6 weeks to enterprise customers. You found out yesterday. The largest affected customer has a call next Tuesday.",
  roles: ["PM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "Enterprise SaaS",
  context: `You're PM for an AI-powered contract analysis feature at a legal workflow platform. The feature, called ContractIQ, is designed for in-house legal teams at enterprise companies. It will analyze uploaded contracts, flag non-standard clauses, identify missing standard protections, and generate a redline summary comparing the contract against the customer's own playbook.

Engineering's 6-month scope includes: playbook upload and configuration, clause detection across 14 clause types, redline generation, integration with the company's existing document management module, and audit logging for legal review requirements. Engineering lead Marcus estimates the full build requires 4 engineers for 26 weeks.

A 6-week version could include: clause detection for the 6 highest-priority clause types (limitation of liability, indemnification, IP ownership, payment terms, termination, governing law), basic flagging without redline generation, no playbook configuration (uses default templates), no document management integration.

Yesterday, you discovered that your VP of Sales, Dana, has been demoing ContractIQ in enterprise sales cycles for the past 6 weeks and promising Q2 delivery — that's 6 weeks away. Dana's pitch included playbook configuration and redline generation. Three deals totaling $840,000 in ACV are contingent on the feature. Your CTO is furious. Your VP of Product wants your recommendation by tomorrow.

Your largest affected customer, Helios Pharmaceuticals ($280,000 ACV), has a check-in call next Tuesday with their procurement team and your account executive. They have already announced internally that ContractIQ is part of their Q2 legal operations rollout.`,
  prompts: [
    {
      id: "p1",
      question:
        "What's your scoping decision? Walk through what ships in 6 weeks and what doesn't — and how you arrived at that line.",
      followUp:
        "Marcus tells you he could hit 6 weeks if you drop audit logging and document management integration. The legal team at Helios may require audit logging for compliance. Do you take that trade?",
    },
    {
      id: "p2",
      question:
        "How do you handle the Tuesday call with Helios Pharmaceuticals? What do you say, to whom, and what outcome are you managing for?",
      followUp:
        "The Helios procurement lead says: 'Our legal team already presented this to our CFO as part of the Q2 rollout. We need the full feature or we can't proceed.' How do you respond?",
    },
    {
      id: "p3",
      question:
        "How do you prevent this from happening again? What specifically needs to change in the relationship between Sales, Product, and Engineering?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Scoping Decision Quality",
      description:
        "Makes a defensible cut at a specific scope for the 6-week version, with clear reasoning for what's in and what's out. Recognizes that the 6-week version must be genuinely useful — not a token gesture — or it damages the relationship more than a delay would.",
    },
    {
      criterion: "Customer Communication Strategy",
      description:
        "Understands that the Tuesday call is with a customer champion who has already made commitments upward to their own CFO. Focuses on giving the champion what they need to manage their own internal situation — not just reassuring the champion directly.",
    },
    {
      criterion: "Internal Accountability",
      description:
        "Addresses Sales accountability directly without letting it become a blame fight. Recognizes that PM roadmap communication may have created the gap that Sales filled — and that the fix is structural, not just interpersonal.",
    },
    {
      criterion: "Process Remediation",
      description:
        "Proposes a concrete process change — not just 'communicate better' — that creates a mechanism for Sales to know what can and can't be promised before they're in a sales call.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The hardest part of this scenario is the Tuesday call — not because of what you say to Helios, but because Helios's champion has already made commitments that are now wrong. Your conversation is with someone who needs to walk back a public statement to their CFO. The help they need from you is not a new promise — it's a way to explain what happened that preserves their credibility.",
    strengths: [
      "Recognizing that the 6-week version needs to provide real legal value — clause detection for the 6 core clause types is defensible if you frame it as 'phase 1 with a firm Q3 date for the full feature'",
      "Treating the Tuesday call as a customer champion management problem, not just a feature delivery negotiation",
    ],
    blindSpots: [
      "The 6-week version will create workflow expectations that the 6-month version will disrupt. If Helios builds their legal team's Q2 process around the limited version — using the default templates because playbook configuration isn't available — the Q3 update that adds playbook configuration requires them to redo that work. Customers who adopt the limited version early don't get a free upgrade; they get a migration. That's a second-order cost the original scoping decision creates.",
      "Sales overpromising is often a symptom of PM roadmap opacity, not just Sales recklessness. If Dana didn't know what was in the 6-week version versus the 6-month version, she filled that gap with what the customer wanted to hear. The accountability here isn't only on Dana — the PM's job includes making roadmap boundaries clear before Sales is in the room with a customer.",
      "The Helios champion has already told their CFO this is coming in Q2. In the Tuesday call, you are not talking to the decision-maker — you are talking to someone whose internal credibility now depends on what you tell them. What they need from you is not a new promise; it's language they can use to explain the change upward without looking like they were sold something false. If you don't give them that, they'll feel burned by you personally, regardless of what the contract says.",
    ],
    improvements: [
      "Before the Tuesday call, prepare two things: a written summary of the 6-week scope with specific capability descriptions (so the champion has a document to share with their CFO), and a firm contractual commitment on the Q3 date for the full feature with a penalty or credit if it slips again",
      "For the internal process fix, create a 'what Sales can promise' document — a living artifact that lists exactly what's shippable in each quarter, updated weekly, accessible to Sales in a shared space — so Dana can quote it in demos without guessing",
      "Have the CTO and VP of Sales have a direct conversation about the gap before it becomes a pattern. The PM should facilitate, not absorb, the accountability for this one",
    ],
    followUpQuestion:
      "The 6-week version ships on time. Helios adopts it and builds their Q2 workflow around the default templates. Three months later, the full version is ready — including playbook configuration. When you reach out to Helios about upgrading, their legal ops lead says: 'We just spent 6 weeks configuring our process around the defaults. Can we do this over the summer?' What do you do?",
    score: 6,
  },
}
