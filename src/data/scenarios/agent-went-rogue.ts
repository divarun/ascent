export const agentWentRogue = {
  slug: "agent-went-rogue",
  title: "The Agent Went Rogue",
  isUnlocked: true,
  summary:
    "Your AI outreach agent sent 1,200 customers emails quoting pricing 40% below your actual rates. Some have already replied to lock in the price. You have until morning.",
  roles: ["EM", "IC"] as const,
  difficulty: "ADVANCED" as const,
  industry: "SaaS",
  context: `You're the EM (or the IC who built it) responsible for an AI-powered outreach agent your company launched three weeks ago. The agent:
- Pulls customer usage data from your data warehouse
- Generates personalized renewal emails with tailored pricing based on usage tier
- Sends emails automatically after a human reviewer approves a daily batch

Yesterday, a junior team member approved the daily batch without reviewing individual emails. The batch contained 1,200 emails.

At 9:47 AM, your head of sales calls you. Customers are replying to emails with pricing that is significantly wrong:
- Customers on your $2,000/month plan received quotes of $1,200/month
- Customers on your $5,000/month plan received quotes of $3,100/month
- Some customers on enterprise tiers received quotes 40% below current contract rates

Root cause (which you discover over the next 90 minutes): a prompt change deployed yesterday was intended to add a "friendly tone" instruction. It accidentally overwrote the pricing lookup instruction, causing the agent to use hardcoded example prices from the prompt template instead of fetching real pricing from the database.

The emails have already landed in 1,200 inboxes. Some customers have already replied saying they'd like to proceed at the quoted price. Two customers have forwarded the emails to their legal teams asking to lock in the rate.`,
  prompts: [
    {
      id: "p1",
      question:
        "Walk through your immediate response in the first two hours. What do you do, in what order, and what's your reasoning for the sequence?",
      followUp:
        "Your CEO asks: 'Are we legally obligated to honor the prices we quoted?' How do you respond, and what information do you need to answer that question properly?",
    },
    {
      id: "p2",
      question:
        "How do you communicate with the 1,200 affected customers? Draft the key message and explain the decisions behind it — what you acknowledge, what you offer, and what you don't promise.",
      followUp:
        "Three customers say they'll escalate to their legal team if you don't honor the quoted price. How do you handle these cases differently, if at all?",
    },
    {
      id: "p3",
      question:
        "What needs to change architecturally and process-wise before this agent runs again? Be specific about the failure points and the fixes.",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Incident Triage",
      description:
        "Sequences immediate actions correctly: stop the agent, assess blast radius, notify leadership, begin customer communication — not in the reverse order",
    },
    {
      criterion: "Customer Communication",
      description:
        "Drafts honest communication that acknowledges the error without making commitments legal hasn't approved; calibrates tone to the customer relationship",
    },
    {
      criterion: "Legal/Commercial Reasoning",
      description:
        "Engages with the contract enforceability question rather than dismissing it; recognizes this is a judgment call requiring legal input, not a purely technical decision",
    },
    {
      criterion: "Architectural Remediation",
      description:
        "Identifies multiple failure points: no prompt change review gate, no output validation on pricing fields, human review process that didn't actually review, no rollback capability",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The root cause is a prompt deployment with no validation gate and a review process that became a rubber stamp. The fix is not 'be more careful' — it's structural: prompt changes need a test suite, pricing fields need schema validation, and human review needs a meaningful sample check, not batch approval.",
    strengths: [
      "Stopping the agent immediately rather than trying to send correction emails first",
      "Recognizing that some customer relationships may need individual handling beyond the mass communication",
    ],
    blindSpots: [
      "Prompt changes are code changes. They need the same review and test gate as code deploys.",
      "Output validation should have caught pricing values that deviate from known ranges before the email was queued",
      "The human review step was a false safeguard — approving 1,200 emails in a batch without sampling is not review",
    ],
    improvements: [
      "Add a schema validation step for any agent output that includes financial figures before it enters the send queue",
      "Implement canary sends: send 1% of the batch, pause for 30 minutes, then release the rest",
      "Treat prompt versioning like code versioning — with test suites that run before deployment",
    ],
    followUpQuestion:
      "If you had to design a human-in-the-loop checkpoint that would have caught this without adding significant friction to the 99% of batches that are correct, what would it look like?",
    score: 6,
  },
}