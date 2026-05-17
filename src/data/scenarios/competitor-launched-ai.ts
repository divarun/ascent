export const competitorLaunchedAi = {
  slug: "competitor-launched-ai",
  title: "The Competitor Launched an AI Feature",
  isUnlocked: false,
  summary:
    "A competitor just announced an AI feature getting significant press coverage. Your CEO forwarded the TechCrunch article with 'we need this.' Engineering says 3 months minimum. You're not convinced it solves a real user problem.",
  roles: ["PM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "SaaS",
  context: `You're PM for a B2B project management tool used primarily by marketing teams at mid-market companies (50–500 employees). Your product has 18,000 active users across 340 accounts. Annual contract value averages $12,000.

Yesterday afternoon, a competitor — a well-funded startup that's been growing fast — announced an AI-powered "smart brief" feature that automatically generates project briefs from a one-paragraph description. The feature got coverage in TechCrunch and a Product Hunt launch that hit #2 of the day. The demo video shows polished output in about 8 seconds.

Your CEO forwarded the TechCrunch article at 6:43pm with: "We need this. What's our timeline?"

You ran a user research survey 6 weeks ago across 80 of your active accounts. The top 5 user needs, by frequency: (1) better task dependency visualization, (2) calendar sync reliability, (3) Slack notification overload, (4) bulk editing, (5) mobile experience. "AI brief generation" did not surface — it wasn't even mentioned in open-ended responses.

Your engineering team's estimate: 3 months minimum to ship something at feature parity. That's 3 months pulled from a roadmap that currently has the top 3 user needs queued.

You've watched the competitor's demo video twice. The output looks impressive — well-structured, specific, with realistic placeholder names and timelines. But it's a 90-second demo video produced by the competitor's marketing team. You have no data on how it performs with real user input at scale.`,
  prompts: [
    {
      id: "p1",
      question:
        "How do you evaluate whether to build this feature? What information do you need before making a recommendation, and where would you get it?",
      followUp:
        "Your head of sales says three prospects mentioned the competitor's AI feature in demos this week. Does that change your calculus?",
    },
    {
      id: "p2",
      question:
        "How do you respond to your CEO? What's your recommendation and how do you frame it?",
      followUp:
        "Your CEO pushes back: 'I understand the research, but we can't look like we're behind on AI. This is a credibility issue.' How do you respond?",
    },
    {
      id: "p3",
      question:
        "If you decide not to build it now — or not to build it at all — how do you make that case to leadership in a way that sticks?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Evidence Evaluation",
      description:
        "Distinguishes between what the demo shows and what the product actually does in production with real users. Recognizes that a competitor announcement + press coverage is market signal, not user demand signal, and that these require different responses.",
    },
    {
      criterion: "Opportunity Cost Framing",
      description:
        "Frames the build decision in terms of what it displaces — specifically, the 3 months pulled from features that user research confirms users want. Makes the tradeoff explicit rather than treating the competitor feature as additive.",
    },
    {
      criterion: "CEO Communication",
      description:
        "Gives the CEO a clear recommendation with reasoning, not just a list of considerations. Engages with the 'credibility' concern directly rather than dismissing it — there may be a real perception problem worth addressing even if the feature isn't the right answer.",
    },
    {
      criterion: "Alternative Path",
      description:
        "Proposes a concrete alternative that addresses the legitimate concern (appearing behind on AI) without committing 3 months to something unvalidated — e.g., a time-boxed spike, a waitlist to gauge demand, or a lighter integration.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses distinguish between the user problem and the market pressure problem — they're real, but they're different, and they require different responses. The user research gap is the most important data point: there's no evidence your users want this. That doesn't mean they don't, but it means you need to find out before committing 3 months.",
    strengths: [
      "Treating user research as evidence that competes with the CEO's reaction, rather than deferring immediately",
      "Recognizing that opportunity cost — the top user needs getting deprioritized — is the core argument against building reactively",
    ],
    blindSpots: [
      "Demo videos are not product reviews. Competitor AI features that look polished in a 90-second marketing video routinely underperform in production with varied, messy real-user input. Before treating the demo as evidence of what you need to build, ask: does anyone have real-user data on how this performs at scale? If not, you don't know what you'd actually be competing with.",
      "The competitor having a feature is not a user problem. Your users haven't asked for this. Three prospects mentioning it in sales calls is noise at the level of 340 accounts — and prospects mentioning a competitor feature in a sales demo is often driven by the sales rep who introduced the topic. The relevant question is whether your existing users would use it, and whether it fits your product's job-to-be-done.",
      "A rushed 3-month build of an AI feature, done reactively rather than deliberately, is likely to ship something worse than the competitor's version — and shipping a worse version draws more negative attention than not having the feature at all. The reputational risk runs both directions.",
    ],
    improvements: [
      "Before committing 3 months, run a 2-week spike: can you build a prototype good enough to test with 10 users? That answers the demand question with evidence rather than assumption.",
      "Separate the short-term perception problem from the long-term product decision: if credibility is the real concern, consider whether a blog post, a product roadmap entry, or a public beta waitlist addresses it without committing engineering time",
      "When bringing the recommendation to the CEO, lead with what you're doing about the real user needs — not just what you're not doing. The framing matters: 'here's our plan for the features users are asking for' lands differently than 'I don't think we should build this'",
    ],
    followUpQuestion:
      "Six months later, the competitor's AI brief feature has mixed reviews — users say it works for simple projects but produces generic output for complex briefs. Your top user needs are shipped. How do you now think about the original decision?",
    score: 6,
  },
}
