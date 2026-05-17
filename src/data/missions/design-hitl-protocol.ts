export const designHitlProtocol = {
  slug: "design-hitl-protocol",
  title: "Design a Human-in-the-Loop Protocol",
  isUnlocked: false,
  description:
    "For a specific AI feature, define exactly where human review sits — what triggers it, who reviews, what the SLA is, and how you know if the protocol is being followed.",
  roles: ["PM", "EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Design a Human-in-the-Loop Protocol

"Human-in-the-loop" is invoked frequently and defined almost never. Teams add it as a safeguard without specifying who the human is, what they're reviewing, how fast they need to do it, what they're empowered to do, and how you'll know if it's working.

An HITL protocol without these specifics is not a safeguard — it's a label.

Your task: pick one AI feature (existing or planned) and design a complete human-in-the-loop protocol for it.

---

### The feature

Start by describing:
- What the AI feature does (1–2 sentences)
- What action it takes or output it produces
- What the consequence of a wrong output is — to whom, and how bad

The consequence assessment drives everything else. A wrong output that causes a user to read an inaccurate summary requires a very different protocol than a wrong output that sends an email to a customer on behalf of your company.

---

### Section 1: What triggers human review?

Be specific about the trigger conditions. Vague triggers ("review if the AI isn't confident") are unworkable. Concrete triggers are implementable.

Types of triggers to consider:

**Volume-based:** A random X% of all outputs get reviewed regardless of quality signals. This is your baseline quality monitoring — it catches problems your other triggers don't know to look for. Define the percentage and how it changes as you build confidence.

**Signal-based:** Specific characteristics of the output or input trigger review. Examples: output length outside a normal range, low confidence score, model refusal, specific keyword patterns, outputs that differ significantly from historical baseline.

**Consequence-based:** Any output that would trigger a specific high-stakes action goes through review, regardless of other signals. Examples: any outbound email to an external customer, any database write over a certain size, any action on an account flagged as high-risk.

**User-triggered:** Users can flag outputs for review. How does this work? What happens next?

For each trigger: what specifically causes it, what review queue does it go to, and what percentage of total outputs does it capture?

---

### Section 2: Who reviews?

Name the role, not just "a human." A customer support rep, a senior engineer, a domain expert, a QA analyst — these have different expertise, different context, and different capacity.

For each review type:
- What role does the reviewer hold?
- What do they need to know to review this output effectively?
- How many reviews can they realistically complete per hour?
- What's their incentive to review carefully vs. approve quickly?

---

### Section 3: What is the reviewer empowered to do?

A reviewer who can only "approve" or "flag" is less useful than a reviewer who can approve, reject, edit, or escalate with different downstream consequences. Define the action space:

- Approve: output proceeds as-is
- Edit and approve: reviewer modifies output before it proceeds
- Reject: output is blocked, what happens next?
- Escalate: who receives the escalation, and on what timeline?

What happens to a reviewed output that is edited? Does the edited version feed back to improve the model or eval suite?

---

### Section 4: What is the SLA?

The SLA depends on the consequence of delay. Define:
- How long can a triggered output wait in the review queue?
- What happens if the SLA is missed? (Output is blocked? Auto-approved? Escalated?)
- How do you measure SLA compliance?

An HITL protocol with no SLA creates a review queue that silently backs up until it's effectively non-functional.

---

### Section 5: How do you know if the protocol is working?

Name the metrics that tell you the protocol is functioning:

**Queue health:** How many items are in the review queue? What's the current SLA compliance rate?

**Review quality:** Are reviewers actually reviewing, or rubber-stamping? One proxy: what percentage of reviews result in edits or rejections? If it's consistently 0%, either the AI is perfect or the reviewers aren't engaging.

**Protocol drift:** Over time, do review thresholds change without explicit decision? Does the random sampling rate get reduced under workload pressure and never restored?

Define who looks at these metrics, how often, and who owns escalation if something looks wrong.

---

### What a complete protocol achieves

A complete HITL protocol is a system, not a feature. It defines: what gets reviewed, by whom, with what authority, within what time, and with what accountability. A team that can answer all five questions has a real safeguard. A team that can answer one or two has a label.`,
  staticGuidance: `The most commonly skipped section is "how do you know if the protocol is working." Teams design the trigger conditions and reviewer roles with care and then have no mechanism to detect when the protocol quietly stops functioning — reviewers start rubber-stamping, the queue backlog grows until items time out and auto-approve, or the sampling rate gets reduced under pressure and never restored.

The reviewer incentive question is consistently underthought. A reviewer who processes 200 items per day with no feedback on whether their reviews were correct has no signal to calibrate against. What feedback loop tells a reviewer whether they're doing this well?

Strong protocols name the failure modes explicitly: "If the review queue backs up beyond 4 hours, items auto-approve and are flagged for retrospective review" is a real decision. "We'll handle it if it happens" is not.`,
  checklist: [
    "Feature and consequence assessment is specific about who is harmed and how severely",
    "At least two trigger types are defined (volume-based, signal-based, or consequence-based)",
    "Each trigger specifies a concrete condition, not a vague quality signal",
    "Reviewer role is named specifically, not just 'a human' or 'the team'",
    "Reviewer action space is defined — what exactly can they do?",
    "SLA is defined with explicit handling for missed SLA",
    "At least two metrics for monitoring protocol health are named",
    "At least one failure mode (queue backup, rubber-stamping, protocol drift) is addressed",
  ],
  staticFeedback: {
    assessment:
      "A well-designed HITL protocol is the difference between meaningful human oversight and the appearance of it. The teams that design it carefully are the ones who can confidently claim their AI feature has guardrails — because they can show the metrics that prove the guardrails are functioning.",
    highlights: [
      "Defining consequence-based triggers that fire regardless of confidence scores — these protect against the cases where a model is confidently wrong, which automated quality signals often miss",
      "Naming the reviewer role specifically with capacity and expertise requirements — this makes the protocol implementable rather than aspirational",
    ],
    suggestions: [
      "Review the SLA section: if you haven't defined what happens when the SLA is missed, the protocol has a failure mode that will eventually be triggered",
      "Add at least one metric for reviewer quality — queue size tells you about capacity; it doesn't tell you about whether the reviews are actually catching problems",
    ],
    nextSteps: [
      "Share this protocol with whoever would own the review queue operationally — their feedback on what's workable will reveal assumptions you've embedded without realizing",
      "Identify the earliest date you'd run the first retrospective on whether the protocol is functioning as designed — put it on the calendar before launch",
    ],
  },
}
