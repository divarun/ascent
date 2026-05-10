export const communicateAiDecision = {
  slug: "communicate-ai-decision",
  title: "Communicate an AI Decision to Stakeholders",
  isUnlocked: false,
  description:
    "Write the upward communication for a hard AI decision — a failure, a tradeoff, or a case for investment.",
  roles: ["PM", "EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Communicate an AI Decision to Stakeholders

Technical decisions about AI are only as good as your ability to communicate them to people who weren't in the room. This mission is about that translation layer — making a real, hard decision legible to leadership, customers, or both.

Pick one of the three scenarios below that most closely matches something real in your work. Write the actual communication — the document, the email, the memo — plus a brief annotation explaining the decisions you made.

---

### Scenario A: Something went wrong

An AI feature your team owns had a failure: wrong outputs, bias found, a hallucination that reached users, a cost overrun, a production incident. Leadership wants to know what happened and what you're doing about it.

Write the upward communication: the message to your VP, CPO, or CEO that explains the situation clearly and honestly without being defensive.

---

### Scenario B: A hard tradeoff

You've made a decision about an AI feature that someone important will push back on: you're pausing the feature to run a bias review, you're recommending against a vendor that sales is excited about, you're delaying a launch to build eval infrastructure, or you're recommending a rollback that will cost a key account.

Write the communication to the person most likely to push back: explain your reasoning, acknowledge what you're asking them to give up, and make the case.

---

### Scenario C: Making the case for investment

You want to build something — an eval framework, AI infrastructure, a new feature — and you need to convince someone who controls the budget or roadmap. The ask is real and the tradeoffs are honest.

Write the investment memo or ask: the short document that makes the case clearly enough that a non-technical leader can evaluate it.

---

### For whichever scenario you pick:

**The communication itself** (the actual message, memo, or email — write it as if you're sending it)

**An annotation** covering:
- Who the audience is and what they care about most
- What you chose to include and what you left out, and why
- Where you made a judgment call about how much detail or honesty to include
- What response you're hoping for and what you'd do if you got pushback instead

### What a strong submission looks like:
- The communication is written as if it will actually be sent — specific, not hypothetical
- It doesn't hide bad news or bury the lead
- The annotation shows genuine reasoning about the audience, not just "I kept it brief"
- The judgment calls are real ones, not obvious choices`,
  staticGuidance: `Good stakeholder communication about AI follows a few principles that are consistently violated:

**Lead with the decision, not the backstory.** Leaders have limited time and high context-switching costs. The first sentence should tell them what happened or what you're recommending, not set up a narrative that arrives at the point in paragraph three. "Our AI screening feature has been paused pending a bias review" lands better than three paragraphs of technical background before the news.

**Acknowledge what you don't know.** "We're still investigating" is a complete and honest answer to many questions. Pretending to certainty you don't have will surface later and damage your credibility more than the uncertainty does now.

**Name the tradeoff, don't hide it.** If you're recommending something that costs something — a delay, a feature pause, a budget ask — state the cost directly and make the case for why it's worth it. Leaders who discover the cost later (after they've agreed to something) trust you less.

**Write to the concern, not to your defense.** Before sending anything, ask: what is the reader most worried about? Write to that concern first. Your own framing of why the decision was reasonable comes after.

**Annotation is real work.** The annotation in this mission is not a formality — it surfaces the judgment calls that are invisible in the final communication. In real work, those judgment calls happen implicitly. Making them explicit here is the practice.`,
  checklist: [
    "Scenario is specific and real (or realistic) — not a generic hypothetical",
    "Communication leads with the decision or situation, not background",
    "Bad news or hard tradeoffs are stated directly, not buried",
    "Annotation explains who the audience is and what they care about",
    "Annotation identifies at least one genuine judgment call about what to include or how honest to be",
    "Communication is written as if it will actually be sent",
  ],
  staticFeedback: {
    assessment: "Strong stakeholder communications lead with the decision, not the backstory. They name the tradeoff directly rather than hoping the reader won't notice the cost. The annotation is where the real thinking lives — it should surface judgment calls that are invisible in the final document.",
    highlights: [
      "Leading with the decision or situation rather than building up to it",
      "Acknowledging uncertainty directly rather than overstating confidence",
    ],
    suggestions: [
      "Read the first sentence of your communication: does it tell the reader what happened or what you're recommending? If not, restructure — the lead is the most important sentence",
      "In the annotation, make sure at least one judgment call is genuinely hard — if all your choices were obvious, you may not have pushed into the real tension",
    ],
    nextSteps: [
      "Send a version of this communication — or adapt it for a real situation you're facing — within the next two weeks while the thinking is fresh",
      "Share the communication (not the annotation) with someone who would be a realistic recipient and ask: 'What questions does this leave you with?' — those gaps are your revision list",
    ],
  },
}