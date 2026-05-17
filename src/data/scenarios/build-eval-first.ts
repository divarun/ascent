export const buildEvalFirst = {
  slug: "build-eval-first",
  title: "Ship the AI Feature or Build the Eval First?",
  isUnlocked: false,
  summary:
    "You're 2 weeks from launching an AI document summarization feature for enterprise customers. There are no automated evals. The PM wants to ship on schedule. Your lead engineer says you don't actually know if the summaries are accurate.",
  roles: ["EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "B2B SaaS",
  context: `Your team is building an AI-powered document summarization feature for enterprise customers — the primary use case is summarizing contract amendments, financial reports, and compliance documents. The feature is two weeks from launch. Your PM has been driving hard toward the date; it was committed to in a customer QBR and two enterprise prospects have said it would influence their buying decision.

Your lead engineer raised a concern in this morning's standup: "We've eyeballed maybe a dozen examples and they look okay, but there's no systematic check. We don't actually know if the summaries are accurate across document types, and we definitely don't know how they handle numbers."

Building a minimal eval suite — a golden dataset of 50 representative documents with human-verified summaries, scored on factual accuracy and completeness — would take 3-4 engineering days.

The PM's position: "Ship first, measure later. We need the launch, we can build evals in sprint 2. We've looked at examples and they're good."

The launch is in 14 days. You have the authority to delay it. You also have a VP who will hear about a delay and will ask why.`,
  prompts: [
    {
      id: "p1",
      question:
        "What's your call: ship in 2 weeks as planned, or delay 4 days for minimal evals? Walk through your reasoning.",
      followUp:
        "The PM argues: 'We can add a disclaimer that the feature is in beta. That covers us.' Does that change your answer? Why or why not?",
    },
    {
      id: "p2",
      question:
        'The PM escalates to your VP: "The EM is blocking the launch for 4 days over engineering perfectionism." How do you respond when the VP calls you?',
      followUp:
        "The VP says: 'I hear you, but we made a commitment. Can you ship on time and add evals after?' What do you say?",
    },
    {
      id: "p3",
      question:
        "You ship on time without evals. Six weeks later, a customer finds that the feature systematically misrepresents numbers in financial documents — percentages are being rounded and sometimes inverted in the summaries. Walk through what happens next and what you would have done differently.",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Risk Calibration",
      description:
        "Accurately identifies that the risk profile of summarization errors in financial/legal documents for enterprise customers is qualitatively different from consumer features — contractual exposure, not just user experience",
    },
    {
      criterion: "Tradeoff Reasoning",
      description:
        "Engages with the actual tradeoff: 4-day delay vs. unknown quality risk in a high-stakes domain; doesn't treat either option as obviously correct without reasoning",
    },
    {
      criterion: "Escalation Handling",
      description:
        "Communicates the technical risk to the VP without sounding obstructionist; makes the PM's 'perfectionism' framing legible as a risk communication problem, not a character dispute",
    },
    {
      criterion: "Post-Incident Reasoning",
      description:
        "Connects the incident outcome to specific preventable decisions; distinguishes between what evals would have caught and what would have required monitoring post-launch",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses recognize that 'ship first, measure later' is a reasonable default for low-stakes features and an unacceptable approach for AI features touching financial data in enterprise contracts. The 4-day delay is not perfectionism — it's the minimum due diligence for a feature where errors create contractual liability. The PM's escalation framing is a risk communication failure that needs to be named clearly to the VP.",
    strengths: [
      "Distinguishing between a 'beta disclaimer' as liability reduction and as quality assurance — a disclaimer doesn't catch numeric inversion errors",
      "Recognizing that the lead engineer's concern is specific and concrete — 'we don't know how it handles numbers' — not generic caution",
    ],
    blindSpots: [
      "'Ship first, measure later' in practice means 'ship and never measure' — the sprint 2 eval task gets bumped by the next feature, and if no one owns it explicitly it doesn't happen; not building evaluation infrastructure before launch dramatically lowers the probability it gets built after",
      "For enterprise customers, the cost of a discovered quality problem is disproportionate to the cost of a 4-day delay — a summarization error in a financial document isn't a UX issue, it's a potential breach of contractual accuracy expectations, and enterprise legal teams treat those differently than consumer complaints",
      "Without an eval baseline at launch, you can't distinguish between the model getting better or worse as you iterate on the prompt over the following months — you've made yourself blind to regression and won't know if a prompt change you make in sprint 3 silently degrades accuracy",
    ],
    improvements: [
      "Frame the delay to the VP as risk management, not quality gatekeeping: 'We're 4 days from knowing whether this feature is safe to ship to enterprise customers who will use it on financial documents'",
      "Build the minimal eval suite with a deliberate focus on numeric accuracy and document types that enterprise customers will actually use — not a comprehensive coverage of every edge case",
      "Establish a production monitoring plan alongside the evals: a sampling process where a human spot-checks 5 summaries per week against source documents in the first 60 days post-launch",
    ],
    followUpQuestion:
      "After the incident, the customer demands a root cause analysis and asks what your quality assurance process was before launch. Your PM's 'ship first' recommendation is in Slack. How do you handle the internal accountability question, and what do you tell the customer?",
    score: 6,
  },
}
