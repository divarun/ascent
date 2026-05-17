export const mapAiSkillGaps = {
  slug: "map-ai-skill-gaps",
  title: "Map Your Team's AI Skill Gaps",
  isUnlocked: false,
  description: "Assess each engineer on the Builder/Coaster spectrum and build a specific development plan based on what you actually observe.",
  roles: ["EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Map Your Team's AI Skill Gaps

The Coasters vs. Builders problem is real, and most EMs can't name which engineers on their team are in each category. If you can't name them, you can't help them.

Your task: assess your team on the Builder/Coaster spectrum and build a development plan.

### The spectrum:

**Builder**
Uses AI as a thinking partner and accelerant. Strong fundamentals. Evaluates AI output critically. Gets better over time — AI is making them more capable, not substituting for capability.

**Shipper**
Uses AI for output, reviews it adequately, ships reasonable work. Velocity is good. Depth isn't actively growing, but it's not degrading either. This is a stable state, not necessarily a problem — but it has a ceiling.

**Coaster**
Generates code they can't explain. Review depth is declining — comments are getting more generic, not more specific. Fast in the short term; dangerous in the long term because they're accumulating debt in their own capabilities.

### Your submission should include:

**1. Assessment for each team member**
Where are they on this spectrum? One sentence with specific evidence — not vibes, not tenure, not general impressions. Evidence means something you observed: a PR, a debugging session, a code review comment, a conversation.

**2. What Builders are doing right**
What specifically are they doing that others should learn from? Don't just say "they review AI code carefully" — describe the behavior: "they write the test first, then let AI fill in the implementation, and reject anything that passes tests they didn't write."

**3. Concrete intervention for any Coasters**
Not "more code review." Something specific: "pair with [person] on two debugging sessions per week for 4 weeks, focused on reading unfamiliar code without AI help." If you're not comfortable writing a specific intervention, you probably haven't diagnosed the problem precisely enough.

**4. What would move Shippers toward Builder**
One specific practice change per Shipper that could shift the growth trajectory.

**5. What you're going to do differently as a manager**
This is not optional. If nothing about your management behavior changes based on this assessment, the assessment didn't do its job.`,
  staticGuidance: `The most common failure is rating everyone in the middle. If your whole team is "Shipper," you probably haven't looked closely enough. The signals are there — you have to look for them specifically.

Look for: can they debug their own code without AI? Can they explain a recent PR 2 weeks later without re-reading it? Do their review comments get more substantive over time or more generic? Do they reach for AI when they're stuck, or before they've tried to think?

The intervention for Coasters is the hardest part to write well. A good intervention changes a specific behavior, has a defined duration, and has an observable outcome. "Be more careful" changes nothing. "Before submitting any PR this sprint, write a 2-sentence explanation of the core logic decision for every non-trivial function — I'll ask about one in the next 1:1" changes something specific.`,
  checklist: [
    "Every team member assessed with specific evidence (not just an opinion)",
    "At least one Builder identified with a specific behavior others could adopt",
    "At least one concrete intervention for any Coasters (specific, time-bound, observable)",
    "At least one action the EM takes differently as a result of this assessment",
  ],
  staticFeedback: {
    assessment: "The value of this mission is in the specificity. Vague assessments ('Alice is pretty solid, Bob could improve') produce no change. The strong version names a specific behavior you observed, names the specific intervention you're making, and names what you're going to do differently — all of which are observable and verifiable.",
    highlights: [
      "Using specific observed behavior as evidence rather than general impressions — this is the hardest part of assessment and the most important",
      "Writing an EM action that actually changes your behavior, not just a note to 'watch more carefully'",
    ],
    suggestions: [
      "Review each assessment: if it could apply to anyone on any team, it's not specific enough — rewrite until it could only describe this person on this team",
      "For Coasters: if the intervention doesn't name a specific activity with a specific frequency and a specific duration, it won't happen — make it concrete",
    ],
    nextSteps: [
      "Have the development conversation with each person within two weeks — the assessment only helps if it informs a real conversation",
      "Revisit in 6 weeks: pick one Coaster and one Shipper and look specifically for the behaviors you tried to change",
    ],
  },
}
