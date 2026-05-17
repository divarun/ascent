export const chatbotNobodyWanted = {
  slug: "chatbot-nobody-wanted",
  title: "The Chatbot Nobody Asked For",
  isUnlocked: false,
  summary:
    "Three competitors added AI chatbots to their products last quarter. Your PM has committed to one in the next roadmap. Product analytics suggest it won't be used. You're the EM.",
  roles: ["EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "B2B SaaS",
  context: `Your company makes project management software for mid-market professional services firms. Last quarter, two direct competitors added AI chatbots — a "ask anything about your projects" interface. A third added an AI assistant sidebar.

Your PM mentioned this in the last roadmap review: "Customers are asking why we don't have AI like Competitor X. We're committing to a conversational AI interface in Q3." It's now in the roadmap deck that went to your VP. The PM has already fielded questions from two enterprise accounts asking about the timeline.

Your product analytics tell a different story. Your current "AI Insights" feature — which generates automated project health summaries — has a 12% monthly active usage rate among accounts that have it enabled, despite being front-and-center in the dashboard. Users who try it once rarely return. In your last NPS survey, the verbatim feedback about AI features was mostly neutral-to-negative: "the summaries aren't useful for how we actually work."

You've built enough chatbot features at previous companies to know the pattern: they get hyped in demos, they get low adoption, they cost significant maintenance effort, and they're hard to kill once they're in the product. You also know this one would take two engineers for a quarter — capacity that would otherwise go to a highly-requested export functionality that your enterprise customers have asked for explicitly.

Your PM is not wrong that competitors have chatbots. You're not sure they're wrong about customer demand either. But you're not confident a chatbot is the right response to either problem.`,
  prompts: [
    {
      id: "p1",
      question:
        "Before escalating or pushing back, what do you need to know — and how do you find out? What's missing from the information you currently have?",
      followUp:
        "You pull the competitor's own usage data through a mutual customer: they report their chatbot has 8% monthly active usage among enabled accounts. The PM's response: 'That's their implementation. Ours will be better.' How do you evaluate that response?",
    },
    {
      id: "p2",
      question:
        "How do you have the conversation with your PM? They've already committed this publicly. The goal isn't to win an argument — it's to make the right product decision.",
      followUp:
        "The PM says: 'I hear you on the data, but if we don't ship something AI-visible this quarter, we're going to lose deals to competitors who do. That's a real cost too.' How do you respond to that?",
    },
    {
      id: "p3",
      question:
        "Assume you can't kill the chatbot commitment. It's going to ship. What do you do now to maximize the chance it's worth building, and minimize the chance it becomes a maintenance burden nobody uses?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Evidence-Based Position",
      description:
        "Uses existing analytics (12% AI Insights adoption, negative qualitative feedback) as the starting point for the conversation — not intuition or personal preference about chatbots",
    },
    {
      criterion: "Information Gap Identification",
      description:
        "Recognizes what's missing before taking a firm position: why do customers ask about chatbots? What specifically would they use it for? What have competitors actually observed in adoption?",
    },
    {
      criterion: "PM Partnership vs. Obstruction",
      description:
        "Frames the conversation around shared goals (ship things that get used, win enterprise deals) rather than as an EM objecting to a PM's idea",
    },
    {
      criterion: "Irreversibility Awareness",
      description:
        "Recognizes that shipping a chatbot creates a commitment — support, maintenance, customer expectations — that's harder to undo than not shipping it",
    },
    {
      criterion: "Constrained Problem Solving",
      description:
        "When the decision can't be reversed, proposes concrete constraints that improve the outcome: limited rollout, specific success metrics before full launch, defined sunset criteria",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The right move here is neither \"ship it because the PM committed\" nor \"block it because the data is bad.\" It's to diagnose whether the problem being solved is real (customers are churning or not buying because they lack AI chat?) and whether the proposed solution (a chatbot) is the right response. Strong responses treat the PM's competitive concern as legitimate while questioning whether a chatbot is the right way to address it. The underlying risk is real: two engineers for a quarter on a feature nobody uses is a concrete cost, and it crowds out features that would actually move retention.",
    strengths: [
      "Treating the PM's competitive concern as a real signal rather than dismissing it — they may be right that there's a problem, even if wrong about the solution",
      "Using the 12% AI Insights adoption as evidence to interrogate the chatbot assumption rather than assuming a new implementation would be different",
      "Asking what specifically customers want when they ask about chatbots — often the answer is not 'a chat interface' but 'I want the product to do X for me automatically'",
    ],
    blindSpots: [
      "The PM has already committed this publicly — walking it back has a political cost that ignoring it doesn't. The EM who treats this as just an evidence problem is missing the organizational dynamic. The question is how to adjust a commitment that's already made, not whether to make it.",
      "The opportunity cost framing matters more than the absolute case against chatbots. 'This will probably get 12% adoption' is a weak argument. 'This crowds out the export feature that 40% of enterprise accounts have explicitly requested and that three of your five biggest accounts have told you is a barrier to expansion' is a concrete business case.",
      "If the chatbot is going to ship anyway, not engaging with how to make it good is abdication. The EM who only says 'I don't think we should build this' and then ships whatever gets spec'd hasn't done their job.",
    ],
    improvements: [
      "Before any conversation with the PM, talk to three customers who asked about chatbots. Find out what specifically they'd do with one. Often the underlying need is not 'chat' but something more specific that could be addressed differently.",
      "Quantify the opportunity cost explicitly: the export functionality has been requested by X% of accounts, is on Y competitive evaluations, and would take Z engineer-weeks. Put the chatbot in the same frame.",
      "If the chatbot is committed, propose: ship to a controlled cohort of 10 power users for 60 days, define what usage metrics would justify full rollout, and agree that if those metrics aren't hit, we revisit scope. This converts an open-ended commitment into a decision gate.",
    ],
    followUpQuestion:
      "Six months after launch, the chatbot has 9% monthly active usage. The PM considers this a success relative to competitors. You consider it a failure relative to the opportunity cost. How do you make sure this tension surfaces in the next planning cycle rather than repeating the same decision?",
    score: 6,
  },
}
