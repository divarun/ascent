export const autonomyCreep = {
  slug: "autonomy-creep",
  title: "How the Agent Got Email Access",
  isUnlocked: false,
  summary:
    "Your customer-facing AI assistant started with read-only access. Eight months and a series of reasonable-seeming decisions later, it sent an angry message to a customer at 2am during an incident. The postmortem starts now.",
  roles: ["EM"] as const,
  difficulty: "ADVANCED" as const,
  industry: "B2B SaaS",
  context: `You manage the team that owns Aria, an AI assistant for your customer success platform. Aria helps CS reps manage their accounts — summarizing health data, surfacing risks, suggesting actions.

Eight months ago, Aria launched with read-only access to account data. Here's what happened since:

**Month 2:** CS reps complained that Aria suggested follow-up actions but couldn't draft the actual emails. "It would save me 20 minutes if it could just write the draft." Product approved: Aria can now draft emails that reps review and send manually.

**Month 4:** Power users said they wanted Aria to send internal Slack summaries automatically — no review step. The argument: "It's just internal, it's just summaries, it's lower risk than customer-facing emails." Product approved: Aria sends automated Slack messages to internal CS channels.

**Month 5:** A customer success director at a big enterprise account asked for Aria to CC her manager on automated summaries. "Just internal-plus, she's our executive sponsor." This was handled as a configuration option per account. Aria can now send emails to a whitelist of external addresses per account.

**Month 7:** Your VP of CS asked whether Aria could automatically reach out to at-risk accounts with a standardized "we noticed X, can we help?" message. The argument: "We do this manually anyway, Aria just makes it faster and more consistent." It went through a cursory approval. Aria now sends outbound emails to customers based on health score triggers.

**Month 8, 2:47am:** An account's health score drops due to a data pipeline bug (false signal). Aria triggers its at-risk protocol. It sends an email to the customer's VP of Engineering: "We've noticed your team hasn't logged into the platform in 14 days. We're concerned about your success with our product and want to help." The customer was in a critical system outage and took the email as an accusation. The VP called your CEO at 7am.

The postmortem is scheduled for this afternoon. You're facilitating it.`,
  prompts: [
    {
      id: "p1",
      question:
        "Walk through the incident timeline. At what point did the permission expansion cross from reasonable to problematic — and was there a single decision that was wrong, or did risk accumulate across multiple individually-defensible decisions?",
      followUp:
        "One of your engineers says: 'Every one of those approvals made sense at the time. No single person made a bad decision.' Is that right? Does it matter for how you run the postmortem?",
    },
    {
      id: "p2",
      question:
        "How do you structure the postmortem so it produces systemic fixes rather than individual blame? What questions should it answer?",
      followUp:
        "Your VP of CS says in the postmortem: 'The real problem is the data pipeline bug that caused the false health score signal. Fix the pipeline and this doesn't happen.' How do you respond?",
    },
    {
      id: "p3",
      question:
        "What's your rollback plan? Aria now has capabilities that CS reps rely on. You can't simply remove them all — but you also can't leave the current permission model in place.",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Autonomy Creep Recognition",
      description:
        "Identifies that the problem is not any single approval decision but the absence of a framework for evaluating cumulative autonomy expansion — each step looked reasonable in isolation because there was no view of the full trajectory",
    },
    {
      criterion: "Blameless Postmortem Design",
      description:
        "Structures the postmortem to find systemic failures (no checkpoint for irreversible action authority, no risk classification for permission expansions) rather than who approved what in month 7",
    },
    {
      criterion: "False Signal vs. True Cause",
      description:
        "Correctly rejects the VP's framing that the pipeline bug was the root cause — the root cause is that an agent had permission to take irreversible customer-visible action on bad data, with no human checkpoint",
    },
    {
      criterion: "Graduated Rollback",
      description:
        "Proposes a rollback that preserves relied-upon capabilities while reducing irreversible action authority — distinguishes between low-risk automation (internal Slack summaries) and high-risk automation (outbound customer email)",
    },
    {
      criterion: "Governance Design",
      description:
        "Proposes a forward-looking framework: what categories of action require human review, who can approve permission expansions, what's the criteria for an action being 'irreversible' or 'customer-visible'",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Autonomy creep is the most insidious AI production failure mode precisely because each step is defensible. No one made a catastrophically bad decision. The failure was systemic: there was no framework for evaluating cumulative permission expansion, no classification of 'irreversible customer-visible action,' and no checkpoint before an agent gained the ability to take consequential action on bad data without human review. Strong postmortems name this structural gap rather than finding the single decision to blame.",
    strengths: [
      "Recognizing that 'every decision made sense at the time' is true and also compatible with a systemic failure — it means the decision-making framework was wrong, not that individuals were negligent",
      "Rejecting the VP's pipeline-bug framing without dismissing it — the pipeline bug is a contributing cause, but if a human had sent that email based on the same bad data, we'd blame the pipeline; when an agent sends it, we also ask why the agent had the authority to act on unverified data",
      "Distinguishing between reversible automation (draft an email, summarize data, send internal messages) and irreversible customer-visible action (send outbound emails to customers) as the key permission boundary",
    ],
    blindSpots: [
      "The month 5 'whitelist per account' decision was the architecture decision that made month 7 possible. Once external email delivery was parameterizable per account, the path to 'send to any customer based on a trigger' was short. Postmortems should identify enabling decisions that widened the attack surface, not just the final approval.",
      "The rollback plan needs to include customer communication. The VP who called the CEO at 7am needs to know what changed and why it won't happen again. This is a trust repair problem alongside a technical problem.",
      "Many teams do the postmortem, produce a list of action items, and ship a capability review. Three months later, Aria gets a new capability and the same pattern starts. The systemic fix is an agent permission governance process that is mandatory for any capability expansion — not a one-time audit.",
    ],
    improvements: [
      "Define two categories before the postmortem: 'supervised automation' (agent acts, human can override) and 'autonomous action' (agent acts, no human in the loop, consequence is external or irreversible). Every future permission expansion gets classified. Autonomous action requires a higher bar of approval and explicit risk documentation.",
      "For the rollback: immediately move customer-facing outbound email from autonomous to supervised — Aria drafts, human approves. Keep internal Slack summaries autonomous (low risk). Review the external whitelist feature and add a human approval step for triggering outbound to any external address.",
      "Build a dead man's switch into any autonomous action that has external impact: if the triggering data hasn't been validated within a time window, or if the triggering signal comes from a source that hasn't been explicitly marked as high-confidence, pause and queue for human review rather than acting.",
    ],
    followUpQuestion:
      "Six months later, your VP of CS proposes a new Aria capability: automated escalation emails to customers who haven't responded to a CS rep's outreach in 7 days. Based on what you learned from the incident, how do you evaluate this request, and what conditions would need to be true before you'd approve it?",
    score: 7,
  },
}
