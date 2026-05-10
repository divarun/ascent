export const writeAiPostmortem = {
  slug: "write-ai-postmortem",
  title: "Write an AI Incident Post-mortem",
  isUnlocked: false,
  description:
    "Document a real or realistic AI failure with root cause analysis, customer impact assessment, and a prevention plan that would actually hold.",
  roles: ["EM", "IC"] as const,
  difficulty: "ADVANCED" as const,
  instructions: `## Mission: Write an AI Incident Post-mortem

Write a complete post-mortem for an AI incident — either one that actually happened in your work, or a realistic one you reconstruct based on a scenario you can imagine occurring.

The purpose of a post-mortem is not to assign blame. It's to build a shared understanding of how the failure happened and create specific changes that prevent recurrence.

### What you'll deliver:

**1. Incident summary**
In 2–3 sentences: what happened, when, and who was affected. This is the version you'd send to leadership in the first hour.

**2. Timeline**
A chronological sequence of events, from the first signal that something was wrong to full resolution. Include: when the issue started, when it was detected, when it was diagnosed, when it was mitigated, and when it was resolved. Flag where the detection lag was longest and why.

**3. Root cause**
The actual cause — not "the AI made a mistake" or "the prompt was wrong." Go one level deeper: why was the prompt wrong, and why wasn't that caught before it shipped? Use the "five whys" if helpful.

**4. Customer impact**
What did users actually experience? Be specific: how many users, what behavior they saw, and what they lost (time, trust, data, money). If this is a realistic scenario, estimate these numbers rather than leaving them vague.

**5. What worked and what didn't**
What parts of your monitoring, alerting, or response process worked? What failed or was missing? Be honest — "we had no alerting on this signal" is a valid answer.

**6. Action items**
Three to five specific, ownable action items that would prevent this class of failure from recurring. Each item should have: a clear description, an owner role (not a person), and a target completion window (not just "soon").

### What makes a strong submission:
- Root cause goes beyond the surface symptom to the systemic gap
- Customer impact is quantified, not vague ("some users were affected")
- Action items are specific enough that someone could implement them without asking clarifying questions
- The "what didn't work" section is honest, not defensive`,
  staticGuidance: `AI incidents often have two root causes: a technical cause (the prompt, the model, the data) and a process cause (why the technical issue wasn't caught before it affected users).

Strong post-mortems address both. A post-mortem that only fixes the technical issue without addressing the process gap will produce a different incident with the same root cause six months later.

The action items section is where most post-mortems fail. Watch for these anti-patterns:
- "Be more careful" — not actionable, no owner, no way to verify
- "Add monitoring" — too vague; monitoring for what, at what threshold, alerting whom?
- "Retrain the model" — often not the fix; why did the model fail on this input, and what process would catch that before production?

If you're writing a realistic scenario rather than a real incident, choose one that's plausible for your actual context. A scenario that could never happen at your company produces a post-mortem full of mitigations that would never be implemented.`,
  checklist: [
    "Incident summary is clear in 2–3 sentences",
    "Timeline identifies where the detection lag was longest",
    "Root cause goes beyond the surface symptom to the systemic gap",
    "Customer impact is quantified",
    "At least one 'what didn't work' item is specific and honest",
    "Action items are specific, ownable, and time-bound",
  ],
  staticFeedback: {
    assessment: "Strong post-mortems identify two root causes: the technical cause (what broke) and the process cause (why it wasn't caught before users saw it). A post-mortem that only fixes the technical issue will produce a different incident with the same underlying process failure.",
    highlights: [
      "Quantifying customer impact rather than describing it vaguely",
      "Identifying where the detection lag was longest in the timeline — that gap is usually where the most valuable alert or monitoring belongs",
    ],
    suggestions: [
      "Review the action items: any item without an owner role and a deadline is a wish, not a commitment — rewrite until you could hand it to someone and know it would get done",
      "If your post-mortem only has technical action items, add at least one process item — the process gap is usually what allowed the technical failure to reach users",
    ],
    nextSteps: [
      "Send the action items to their owners within 24 hours while the incident is still fresh",
      "Schedule a 30-day follow-up to verify action items were completed and would have prevented this specific incident",
    ],
  },
}