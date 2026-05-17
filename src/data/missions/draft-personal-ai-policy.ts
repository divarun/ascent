export const draftPersonalAiPolicy = {
  slug: "draft-personal-ai-policy",
  title: "Draft Your Personal AI Use Policy",
  isUnlocked: false,
  description: "Write your personal rules for when you use AI tools and when you deliberately don't — and make them specific enough to actually constrain your behavior.",
  roles: ["IC"] as const,
  difficulty: "BEGINNER" as const,
  instructions: `## Mission: Draft Your Personal AI Use Policy

Your team may have an AI policy. This mission is about YOURS — the personal rules you follow about when you reach for AI tools and when you don't.

Most engineers haven't written this down. The ones who have are clearer about what they're optimizing for and what they're not willing to trade away.

### Your policy should address:

**1. When you use AI by default**
Be specific: what types of tasks do you automatically reach for AI assistance on? Name at least 3. For each: what's the task, and what specifically do you use AI for (generation, explanation, review, exploration)?

**2. When you deliberately don't use AI**
What tasks do you keep AI-free? This might include: learning something new for the first time, debugging production incidents, core algorithm design, writing code review comments, or anything where the thinking IS the skill. For each: why? What are you protecting — your understanding, your judgment, your ability to do it without AI next time?

**3. Your review standard**
When you accept AI-generated code, what's your minimum bar? This is not "I read it carefully." It's a specific test: "I can explain every non-trivial decision in this code to a junior engineer without re-reading it" or "I could rewrite this from scratch if the AI output disappeared."

**4. Your learning practice**
AI tools can accelerate output while slowing skill development. How are you making sure your fundamentals don't atrophy? Name a specific, recurring practice: a problem type you always solve without AI first, a debugging rule, a writing habit.

**5. Your red lines**
What would you never do with AI assistance, regardless of time pressure? These are non-negotiable. At least one.

### Format:
One page, written directly. This is a personal commitment, not a team document. Be honest about the tradeoffs you're actually making — not the ones that sound good.`,
  staticGuidance: `The most common failure mode is writing principles that sound good but don't constrain anything. "I review all AI code carefully" is not a policy. "I will not submit a PR with AI-generated code unless I can explain every decision in it to a junior engineer without looking at the code again" is.

The test for a real policy: would following it ever cause you to do something different than you'd do without it? Would it ever cause you to throw away AI output and do it yourself? If the answer is no, rewrite it until it would.

The "when you don't use AI" section is the hardest to write honestly. It's easy to say "complex algorithm design" as a no-AI zone when the real answer is "I always try AI first and only fall back when it doesn't work." Write the honest version, not the flattering version.`,
  checklist: [
    "At least 3 specific types of tasks where you use AI by default (with what you use AI for, not just the task)",
    "At least 2 specific types of tasks you keep AI-free, with explicit reasoning for each",
    "A concrete review standard with a specific test (not 'I review it carefully')",
    "A specific learning practice named (recurring, observable, not aspirational)",
    "At least one red line",
  ],
  staticFeedback: {
    assessment: "A personal policy that doesn't constrain anything is just a description of what you already do. The strong version includes at least one rule that would cause you to slow down, push back, or redo work — something that has a real cost when you follow it. If there's no cost, it's not a policy.",
    highlights: [
      "Writing a review standard specific enough to be a real test — this is the single most important personal practice for engineers using AI tools",
      "Being honest in the 'when I don't use AI' section about what you're actually protecting, not what sounds responsible",
    ],
    suggestions: [
      "Test each rule in your policy: name a situation from the past month where following this rule would have changed what you did. If you can't, make the rule more specific",
      "The learning practice section often ends up vague ('I'll practice algorithms'). Make it concrete: 'Every Friday I spend 30 minutes debugging without AI help on a real problem from the week'",
    ],
    nextSteps: [
      "Share your policy with one other engineer and ask them to hold you to it for 30 days — accountability is what turns intentions into habits",
      "Review in 90 days: which rules did you actually follow? Which did you find yourself rationalizing around? Rewrite based on reality, not aspiration",
    ],
  },
}
