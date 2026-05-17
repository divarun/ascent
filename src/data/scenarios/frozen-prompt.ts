export const frozenPrompt = {
  slug: "frozen-prompt",
  title: "The Prompt Nobody Will Touch",
  isUnlocked: false,
  summary:
    "The engineer who built your AI feature left three months ago. The system prompt is 380 lines long, lives in a .env file, and has never been tested systematically. A customer complaint suggests it's causing a real problem. You're the EM.",
  roles: ["EM", "IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "B2B SaaS",
  context: `Your team owns an AI-powered contract review assistant that helps legal and procurement teams flag risk clauses in vendor contracts. The feature launched eight months ago. Marcus, the engineer who built it, left the company three months ago.

The system prompt is 380 lines. It lives in a .env file on the production server. There's no version history — it's been edited in place. There are no automated evals. There's no documentation explaining what any section does.

The two engineers currently on your team both touched the feature briefly while Marcus was still here, but neither of them fully understands the prompt. When you asked one of them to look at a specific section, she said: "I'm honestly not sure what this instruction is doing. I'm afraid if I change it, something will break somewhere else."

This week, a customer flagged a concerning pattern: the assistant is consistently failing to flag indemnification clauses as "high risk" in contracts from a specific jurisdiction — clauses that their legal team considers serious. They've been relying on the assistant for their review workflow. They want to know what happened and what you're going to do about it.

You don't know whether this is a regression (it used to work, something changed), a gap that always existed, or a misalignment between what your assistant was designed to do and what the customer expected it to do. You don't have the data to tell.

You need to: figure out what's wrong, fix it, and prevent this from happening again. You also need to respond to the customer.`,
  prompts: [
    {
      id: "p1",
      question:
        "Before touching anything, what do you need to understand? Walk through how you'd diagnose whether this is a regression, a pre-existing gap, or an expectation mismatch.",
      followUp:
        "Your investigation reveals there's no way to know when this behavior started — there are no logs of prompt versions, no historical eval data, and no way to test Marcus's original implementation. You only have the current state. Does that change your approach?",
    },
    {
      id: "p2",
      question:
        "Your engineer is reluctant to touch the prompt because she's worried about breaking something. She says: 'If we edit a 380-line prompt and something goes wrong, we won't know what caused it.' How do you unblock her?",
      followUp:
        "She proposes: 'What if we just add a line at the end that explicitly says to flag indemnification clauses as high risk?' Does that fix the problem? What are the risks of that approach?",
    },
    {
      id: "p3",
      question:
        "What do you tell the customer? They've been relying on this tool and now they're questioning whether they can trust it. You don't fully know what went wrong yet.",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Diagnosis Before Action",
      description:
        "Distinguishes between regression, gap, and expectation mismatch before proposing a fix — recognizes these have different causes, different fixes, and different implications for what to tell the customer",
    },
    {
      criterion: "Engineering Unblocking",
      description:
        "Provides a concrete path for the engineer to work confidently on the prompt: build a minimal eval suite first, so changes can be tested; make incremental changes rather than wholesale rewrites; create a staging environment",
    },
    {
      criterion: "Patch Risk Awareness",
      description:
        "Recognizes that appending a single fix to a 380-line prompt may work for the specific case but doesn't address the underlying brittleness — it adds to the prompt entropy problem",
    },
    {
      criterion: "Customer Communication",
      description:
        "Tells the customer what is known and what isn't, owns the gap in quality assurance process, gives a timeline for investigation findings, does not make promises that can't be kept",
    },
    {
      criterion: "Systemic Fix",
      description:
        "Addresses the root cause alongside the immediate fix: build eval coverage, establish prompt version control, document the prompt, establish an ownership and change process",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The frozen prompt is an infrastructure debt problem disguised as a feature problem. The indemnification issue is the symptom; the real problem is that the team has inherited a critical piece of AI infrastructure with no observability, no test coverage, and no documented ownership. Strong responses address both the immediate customer issue and the systemic gap — and recognize that you can't fix the immediate issue confidently until you've built the minimum infrastructure to know whether your fix actually worked.",
    strengths: [
      "Building a minimal eval suite before touching the prompt — even 20 representative contracts with known expected outputs creates the observability needed to make changes safely",
      "Framing the customer conversation as honest uncertainty with a clear investigation plan, not as confident reassurance that everything is fine",
      "Recognizing that the 'just add a line' patch approach is a local fix that doesn't address the brittleness — and may interact poorly with existing instructions in the 380-line prompt",
    ],
    blindSpots: [
      "The absence of logging means you can't tell when the behavior started — which means you can't tell the customer when they should have been using the tool with extra caution. This is a significant gap and needs to be named explicitly in the customer conversation, not papered over.",
      "The engineer's fear of the prompt is itself a signal worth addressing directly. A 380-line undocumented prompt that nobody will touch is not just a technical problem — it's a morale and ownership problem. Unblocking her requires more than a technical process; it requires clarity on who is responsible for this feature and what success looks like.",
      "Many teams in this situation reach for 'let's rewrite the whole prompt' as the solution. This is often worse than targeted incremental changes tested against an eval suite — a rewrite is a big-bang change with maximum uncertainty.",
    ],
    improvements: [
      "The first action should be building a test harness, not editing the prompt. Take the customer's flagged examples plus 20 more representative contracts. Label the expected risk classifications. Run the current prompt against them. Now you have a baseline and can measure whether any change helps.",
      "For the customer: tell them what you know and what you don't — specifically that you can't identify when the behavior started because there are no logs, and give a concrete timeline for investigation findings. Avoid confident reassurance that everything will be fine until you actually know that.",
      "Once the immediate issue is fixed, schedule a prompt audit as an engineering task — not a side project. The 380-line prompt should be read end-to-end, understood, documented, and simplified. This is infrastructure maintenance, not optional cleanup.",
    ],
    followUpQuestion:
      "After fixing the immediate issue, you propose adding the contract review feature to the team's standard on-call rotation. Your engineer pushes back: 'We don't have the monitoring to know when something is wrong — we'd only get alerted by customer complaints.' How do you respond, and what's the minimum monitoring you'd build first?",
    score: 6,
  },
}
