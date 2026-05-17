export const aiPrSecurityBug = {
  slug: "ai-pr-security-bug",
  title: "The AI-Generated PR With a Security Bug",
  isUnlocked: false,
  summary:
    "You're reviewing a 420-line AI-generated PR adding a user data export endpoint. On page 3 of the diff, you spot what looks like a SQL injection vulnerability. Deployment is in 2 hours.",
  roles: ["IC"] as const,
  difficulty: "ADVANCED" as const,
  industry: "FinTech",
  context: `You're a senior IC at a FinTech company doing a code review. The PR you're reviewing is 420 lines, split across a new API endpoint, a service layer, and tests. The author is a mid-level engineer who used Claude Code for the implementation.

The PR adds a new endpoint: POST /api/v1/users/{id}/export. It allows account holders to download their full transaction history as a CSV. The code is clean. Naming is clear. The tests cover happy-path and a handful of edge cases. CI is green.

On page 3 of the diff, you notice a query in the data access layer. At first glance, it looks like the query is built using string formatting: a variable from the request handler appears to be interpolated directly into the SQL string rather than passed as a parameterized argument.

The author left a comment on the PR: "Claude Code generated this; reviewed and looks correct to me."

The PR is tagged for the 4pm release. It is now 1:45pm. The release train includes three other PRs from other teams, and the release manager has already pinged the channel confirming the train is on schedule.`,
  prompts: [
    {
      id: "p1",
      question: "What do you do in the next 30 minutes? Walk through your decision sequence.",
      followUp:
        "The release manager pings you directly: 'Are you going to approve this? We go in 90 minutes.' How do you respond?",
    },
    {
      id: "p2",
      question:
        "The author responds: 'The AI wouldn't generate insecure code. I asked it to follow security best practices.' How do you evaluate this claim?",
      followUp:
        "The author escalates to your EM, saying you're blocking the release over a concern that isn't confirmed. How do you handle this?",
    },
    {
      id: "p3",
      question:
        "The SQL pattern turns out to be a false alarm — it's parameterized at the ORM layer, not the string level. But during your review you found two other issues: a missing rate limit on the export endpoint and a response that leaks internal user IDs in the CSV headers. What's your post-review feedback to the author about their PR process?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Security Assessment",
      description:
        "Treats an unconfirmed SQL injection in a data export endpoint as a blocking concern until disproven, not a 'maybe' to note in review comments. Traces the variable from request handler to query to determine whether parameterization is actually happening.",
    },
    {
      criterion: "Release Decision",
      description:
        "Understands the asymmetry: delaying one release is recoverable; a data breach on a FinTech export endpoint is not. Doesn't let schedule pressure compress the security review window.",
    },
    {
      criterion: "AI Skepticism",
      description:
        "Evaluates the 'AI checked it' claim on its merits: AI code generators reproduce patterns from training data, insecure SQL patterns are common in training data, and the model's safety training doesn't replace security review. Doesn't accept the claim at face value.",
    },
    {
      criterion: "Process Feedback",
      description:
        "After the false alarm resolves, delivers feedback that addresses the review methodology — not just the specific issues found. Distinguishes between 'this PR is fine' and 'the process that produced this PR is fine.'",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses treat the uncertainty as the problem: you can't confirm or rule out the vulnerability in 5 minutes, and a data export endpoint at a FinTech company is exactly the target an attacker would go after. The right move is to block the release until you can confirm parameterization end-to-end, then address the process after the technical question is resolved.",
    strengths: [
      "Tracing the variable from the request handler through to the actual database call before concluding it's safe, rather than accepting surface-level appearances",
      "Separating the security question from the release pressure — treating them as two distinct decisions that need to be made in the right sequence",
    ],
    blindSpots: [
      "Accepting the false alarm as the end of the story means you've validated 'AI reviewed it' as a sufficient methodology. The author found two non-security issues only because you looked — without your review, a missing rate limit and a leaking user ID field would have shipped. That's the process failure, and it survives the false alarm.",
      "Blocking a release in 2 hours causes friction with the release manager, the author, and your EM. But a confirmed SQL injection in a data export endpoint triggers breach notification requirements, regulatory scrutiny, and customer trust damage that are orders of magnitude more costly. The friction comparison is so lopsided that blocking is clearly correct — but many engineers avoid it because friction is immediate and breach risk feels abstract.",
      "Your post-review feedback shapes what happens on the next AI-generated PR. If you say 'good catch on the ORM' and move on, the author concludes their process was sound. If you don't explicitly name what was missing — a security-focused review, not just a read-through — you haven't actually prevented the next incident.",
    ],
    improvements: [
      "When reviewing AI-generated code in a security-sensitive area, treat the security check as a separate pass from the functional review — don't let 'the code looks clean' substitute for tracing data flows explicitly",
      "Build a team norm that 'AI-generated' on a PR is a flag for closer review, not a shortcut through it — the author's confidence in the tool is not transferable to the reviewer",
      "After resolving the technical question, give specific process feedback: what a security review of this endpoint would have caught, and what 'reviewed and looks correct' needs to mean for a PR in this risk category",
    ],
    followUpQuestion:
      "Your team wants to formalize a lightweight security checklist for PRs that touch data export or payment endpoints. What's on that checklist, and how do you make it fast enough that engineers actually use it?",
    score: 6,
  },
}
