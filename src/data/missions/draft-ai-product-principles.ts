export const draftAiProductPrinciples = {
  slug: "draft-ai-product-principles",
  title: "Draft Your Team's AI Product Principles",
  isUnlocked: false,
  description: "Write a one-page, opinionated set of AI product principles your team can actually use to make decisions.",
  roles: ["PM"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Draft Your Team's AI Product Principles

Every product team using AI needs a shared set of beliefs about how to make decisions. Without them, every AI feature decision becomes a debate from first principles — and you'll have the same argument about user trust, error handling, and transparency over and over again.

Your task: write a one-page document — your team's AI product principles.

### Cover these five areas:

**1. When to use AI**
What problems warrant AI vs. simpler solutions? Be opinionated. "When it adds value" is not a principle. "We use AI when the task requires pattern recognition across more inputs than a human can hold in working memory, and when a wrong answer is recoverable" is.

**2. What user trust requires**
What conditions must be met before you ship an AI feature to users? Think about: what the user is trusting the AI to do, what happens when it's wrong, and what you owe them before asking for that trust.

**3. How you handle errors**
What happens when the AI is wrong — in public, to a specific user, at scale? Write the principle that would tell a PM what to do when they discover the feature has been producing wrong output for 2 weeks.

**4. What transparency means for your product**
What do users need to know about how AI is involved in decisions affecting them? This will vary by product — but you need a position, not a shrug. When do you disclose AI involvement? When do you explain AI reasoning? When do you offer a non-AI alternative?

**5. How you balance speed and quality**
When is shipping imperfect acceptable, and when is it not? The answer should depend on reversibility, user impact, and trust — not just velocity targets.

### Format and tone:
One page, plain language, written as if you're sharing this with your team next week. Be opinionated — make decisions, don't just list considerations. A good principles doc tells someone what to do in a real situation, not what to think about.`,
  staticGuidance: `The failure mode for this doc is being too generic. "We will be transparent" is not a principle. "We will always show users when AI is involved in a decision that affects their account" is. Each principle should either answer a real decision you've faced or anticipate one you'll face. If you can't think of a situation where the principle would actually change a decision, it's not doing work.

Test each principle with a real scenario from your product. If the principle doesn't give you an answer — or gives you the same answer you'd reach without it — rewrite it until it does.

The most useful principles are the ones that make your team uncomfortable. A principle that everyone immediately agrees with probably doesn't constrain anything.`,
  checklist: [
    "All five areas are covered (when to use AI, trust requirements, error handling, transparency, speed vs. quality)",
    "Each principle is specific enough to resolve a real decision",
    "At least one principle would change a decision the team has already made or debated",
    "Document is one page or fewer",
    "Written in plain language (no jargon, no hedge words like 'generally' or 'where appropriate')",
  ],
  staticFeedback: {
    assessment: "Strong principles docs are short and uncomfortable. They make tradeoffs explicit and give people something to push back on. If your team reads this and everyone nods, the principles probably aren't doing any work. The goal is a document someone would cite in a design review to settle an argument.",
    highlights: [
      "Writing principles specific enough that someone could cite them in a meeting to resolve a real disagreement",
      "Covering error handling explicitly — this is the area most teams avoid because it requires taking a position on acceptable risk",
    ],
    suggestions: [
      "Review each principle: replace any instance of 'generally,' 'where appropriate,' or 'when needed' with a specific threshold or condition",
      "Test the transparency principle against your most AI-forward feature — does the principle tell you exactly what disclosure is required? If not, it needs work",
    ],
    nextSteps: [
      "Share the draft in your next team meeting and pick the principle most likely to cause disagreement — debate it until the wording reflects where the team actually lands",
      "Add the principles doc to your design review template so it gets referenced when new AI features are proposed",
    ],
  },
}
