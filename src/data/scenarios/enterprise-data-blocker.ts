export const enterpriseDataBlocker = {
  slug: "enterprise-data-blocker",
  title: "The Enterprise Data Blocker",
  isUnlocked: false,
  summary:
    "A $400K ARR deal is stalled. The prospect's legal team says your AI feature sends EU customer data to US servers, violating their data residency policy.",
  roles: ["PM"] as const,
  difficulty: "ADVANCED" as const,
  industry: "B2B SaaS",
  context: `You're the PM for a B2B SaaS platform that added an AI-powered contract analysis feature six months ago. The feature sends contract text to a third-party LLM API (US-based) for analysis and returns structured summaries.

Your sales team has been closing deals with it as a key differentiator.

Three weeks ago, a large European financial services company entered late-stage evaluation — a $400,000 ARR deal. Last week, their legal team sent a 14-point questionnaire about data handling. Their key concerns:

1. **Data residency**: EU customer contracts (which contain personal data of their customers) must not leave the EU under their internal policy and GDPR Article 46 requirements
2. **Data processor status**: They require a signed Data Processing Agreement (DPA) with any subprocessors — including your LLM vendor
3. **Training data**: They want written confirmation that their data will not be used to train the underlying model
4. **Retention**: They want zero-retention on prompts and completions at the LLM provider level

Your engineering lead tells you:
- Your LLM vendor does not have an EU region for API calls
- Your vendor does offer zero-retention and will sign a DPA, but only on their enterprise tier ($8,000/month vs your current $600/month plan)
- Building your own EU-hosted inference would take 3–4 months minimum
- An alternative: you could implement client-side redaction that strips PII before sending to the API

Your VP of Sales wants the deal closed this quarter. The prospect's procurement deadline is in 11 days.`,
  prompts: [
    {
      id: "p1",
      question:
        "Which of the prospect's four requirements can you meet today, which can you meet with investment, and which represent fundamental blockers? Be specific about what 'meeting' each requirement actually requires.",
      followUp:
        "The VP of Sales suggests telling the prospect you'll 'work on becoming compliant' without specifying a timeline. Do you go along with this? Why or why not?",
    },
    {
      id: "p2",
      question:
        "What options do you bring to the prospect, and how do you frame them? Walk through the tradeoffs of each path from both your company's and the prospect's perspective.",
      followUp:
        "The prospect asks: 'Is any other EU customer using this feature today?' You have four EU customers currently using it without a DPA. How do you answer?",
    },
    {
      id: "p3",
      question:
        "What changes do you recommend making to how your company handles AI data governance going forward — independent of whether this deal closes?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Requirements Analysis",
      description:
        "Correctly categorizes which requirements are addressable now (zero-retention, DPA), addressable with investment (EU region), and genuinely complex (existing EU customers without DPA)",
    },
    {
      criterion: "Commercial Honesty",
      description:
        "Does not recommend misleading the prospect on timeline or capability; recognizes that misrepresentation creates worse downstream risk than losing the deal",
    },
    {
      criterion: "Option Framing",
      description:
        "Presents concrete options (redaction approach, LLM vendor upgrade, EU deployment roadmap) with honest tradeoffs rather than vague commitments",
    },
    {
      criterion: "Governance Recommendation",
      description:
        "Identifies the systemic issue: four EU customers already using the feature without proper DPAs represent existing exposure that needs remediation",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The four existing EU customers without DPAs are the more urgent problem than the prospect. A strong response addresses both in parallel. On the deal: the redaction approach is the fastest path to a compliant offering, but it needs to be evaluated for whether it actually meets the prospect's legal standard — not just whether it's technically implementable.",
    strengths: [
      "Distinguishing between what can be delivered now versus what requires investment",
      "Recognizing that the VP of Sales' suggestion to vaguely commit to compliance is a credibility and legal risk",
    ],
    blindSpots: [
      "Client-side PII redaction may not satisfy GDPR Article 46 requirements even if no PII leaves the EU — the contract text itself may qualify as personal data",
      "The existing EU customers represent active compliance exposure that needs proactive outreach, not just a note in the backlog",
      "Data residency requirements often apply to logs and telemetry as well, not just the primary data flow",
    ],
    improvements: [
      "Add a data residency question to your sales qualification checklist — discover this in discovery, not legal review",
      "Get a DPA template signed with your LLM vendor regardless of tier — it should be a baseline, not an enterprise upgrade",
      "Implement a data flow map for each AI feature that documents exactly what data moves where",
    ],
    followUpQuestion:
      "If you build the EU-region inference capability in 4 months, what does the proper rollout look like for existing EU customers — and what do you tell the prospect in the meantime?",
    score: 6,
  },
}