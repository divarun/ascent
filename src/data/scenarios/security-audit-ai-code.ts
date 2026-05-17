export const securityAuditAiCode = {
  slug: "security-audit-ai-code",
  title: "The Security Audit Found Vulnerabilities in AI-Generated Code",
  isUnlocked: false,
  summary:
    "A quarterly security audit found 5 medium-severity vulnerabilities. Three came from AI-generated code that passed review without scrutiny. None have been exploited. Leadership wants answers tomorrow.",
  roles: ["EM"] as const,
  difficulty: "ADVANCED" as const,
  industry: "FinTech",
  context: `Your team builds backend services for a payments platform. You have 6 engineers and have been using AI coding tools for 4 months. The team adopted them without formal review policy changes — code was reviewed the same way it always had been, and AI-generated code was treated like any other PR.

A quarterly third-party security audit completed this week. It found 5 medium-severity vulnerabilities across your services:

- Vulnerability 1: Insecure direct object reference in an account lookup endpoint (AI-generated)
- Vulnerability 2: Missing input validation on a transaction amount field allowing negative values (AI-generated)
- Vulnerability 3: An API endpoint exposing internal user IDs in error responses (AI-generated)
- Vulnerability 4: A hardcoded timeout value that could be exploited for timing attacks (human-written)
- Vulnerability 5: Overly permissive CORS configuration (human-written)

None of the 5 vulnerabilities has been exploited. The three AI-generated vulnerabilities share a pattern: reviewers approved them because the code looked clean and tests passed. No one questioned whether the patterns themselves were secure.

Your CTO meeting is tomorrow. They want to know: what failed, who's accountable, and what changes.`,
  prompts: [
    {
      id: "p1",
      question:
        "What's your assessment of what failed? Not defensively — what actually broke down in your process?",
      followUp:
        "Two of the three AI-generated vulnerabilities were approved by the same senior engineer. How do you think about their accountability versus systemic process failure?",
    },
    {
      id: "p2",
      question:
        "What changes to process and standards do you bring to the CTO meeting? Be specific about what you're proposing and what you expect each change to catch.",
      followUp:
        "The CTO asks: 'How confident are you that the 5 vulnerabilities found are all of them?' What's your honest answer?",
    },
    {
      id: "p3",
      question:
        "One of your high performers authored 2 of the 5 vulnerable PRs and feels embarrassed. How do you handle this conversation?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Root Cause Accuracy",
      description:
        "Identifies the systemic failure — review culture with implicit standards that weren't updated for AI-generated code — rather than attributing the failure solely to individual engineers",
    },
    {
      criterion: "Process Proposal Quality",
      description:
        "Proposes concrete, targeted changes: security-focused review criteria for AI-generated code, specific vulnerability pattern checklists for FinTech context, and how those would catch these classes of issues",
    },
    {
      criterion: "Scope Honesty",
      description:
        "Answers the 'are these all of them' question honestly — an audit finds what it scopes for; the rest of the codebase has unknown exposure",
    },
    {
      criterion: "People Handling",
      description:
        "Separates the systemic conversation from the individual conversation; treats the high performer's embarrassment as a growth moment without minimizing the seriousness of the findings",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses go to the CTO with a clear-eyed process failure analysis and concrete changes — not with reassurances that it won't happen again. The core failure is that review standards were implicit and weren't revisited when the source of code changed. The fix is explicit criteria, not more careful individuals.",
    strengths: [
      "Distinguishing between the 2 of 5 human-written vulnerabilities and the 3 AI-generated ones — the problem isn't unique to AI code, but there's a pattern worth naming",
      "Treating the CTO meeting as an opportunity to propose structural change rather than just explain what went wrong",
    ],
    blindSpots: [
      "The review failure isn't about the engineer who approved — it's a review culture that has implicit security standards that weren't updated when the origin of code changed; AI-generated code tends toward plausible-looking but subtly wrong security patterns, and your team had no criteria for that",
      "The 5 found vulnerabilities are not necessarily all of them — the audit covered what it was scoped to cover; the rest of the codebase has the same review gaps and may have similar issues that weren't examined",
      "Making the senior engineer who approved two PRs the accountable party for a systemic process gap creates the wrong incentive: engineers learn to be defensive about AI tool usage and stop disclosing it, which makes future audits harder",
    ],
    improvements: [
      "Build a security review checklist specific to AI-generated code in a FinTech context — input validation, access control patterns, error response content — and make it part of the PR template",
      "Propose a targeted security review of the 20 highest-risk AI-generated PRs from the past 4 months — that's your fastest path to understanding actual exposure",
      "Have the individual conversation with the high performer separately from the CTO debrief; the message is 'this is a process gap we're fixing together,' not 'you made two mistakes'",
    ],
    followUpQuestion:
      "After implementing the new review checklist, your PR cycle time increases by 15% for AI-generated code. Two engineers say the checklist is too burdensome and they're using AI tools less. How do you calibrate the trade-off between security rigor and the productivity gains you adopted AI tools for?",
    score: 6,
  },
}
