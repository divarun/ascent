export const boardAiRoadmap = {
  slug: "board-ai-roadmap",
  title: "The AI Roadmap Presentation to the Board",
  isUnlocked: false,
  summary:
    "You have 10 minutes at the board meeting to present your company's AI roadmap across three very different initiatives. The board wants momentum without overpromising. Two board members are tech-savvy; one is finance-focused; one is a skeptical former founder.",
  roles: ["PM"] as const,
  difficulty: "ADVANCED" as const,
  industry: "SaaS",
  context: `You're Head of Product at a B2B workflow automation platform with $28M ARR and 210 employees. The board meets quarterly. Three months ago, a board member asked "what's your AI strategy?" and the CEO said "we're developing it." That answer didn't land. This quarter, you have 10 minutes on the agenda to present the AI roadmap.

You have three initiatives:

**Initiative 1 — AI-Assisted Workflow Builder (Q3 this year):** An in-product AI feature that lets users describe a workflow in plain English and generates the automation for them. Currently in beta with 12 customers. Beta feedback is strong: median time-to-first-workflow dropped from 4.2 hours to 38 minutes in testing. Ships to all customers in Q3. Projected impact on activation rate and net expansion revenue is estimated, not measured.

**Initiative 2 — Internal AI Productivity (ongoing):** Engineering adopted GitHub Copilot 4 months ago. Anecdotally, engineers report faster boilerplate writing. You don't have a rigorous measurement of impact. Estimated cost: $42,000/year for the team. The CFO noted this on the last budget review.

**Initiative 3 — AI-Native Adjacent Product (12–18 month horizon):** A separate product your team is exploring — an AI agent that could autonomously run repetitive compliance workflows on behalf of the customer's ops team, requiring no human configuration. It's in early research phase. No engineering committed. Market size is large; your team's capability to build it is unproven.

The four board members: Yemi (tech-savvy, former CTO of a public company), Kavita (finance-focused, skeptical of AI hype, asks about ROI on every slide), Sergei (former founder who has seen many hype cycles, asks hard "so what" questions), and Priscilla (tech-savvy, excited about AI, tends to push for more ambition).`,
  prompts: [
    {
      id: "p1",
      question:
        "How do you structure the 10-minute presentation? What's your frame, what order do you present the three initiatives in, and why?",
      followUp:
        "Priscilla interrupts after your first minute: 'I want to hear about the AI-native product first — that's the big bet.' How do you respond without losing control of the narrative?",
    },
    {
      id: "p2",
      question:
        "Kavita asks: 'What's the ROI on initiative 1?' You have activation rate improvement in beta but no revenue impact data yet. How do you answer?",
      followUp:
        "Kavita follows up: 'And initiative 2 — $42,000 a year for Copilot. What are we getting for that?' How do you answer honestly without undermining your own team?",
    },
    {
      id: "p3",
      question:
        "Sergei asks: 'Every company is doing AI right now. I've seen this movie before. What makes your AI initiative different — and why should we believe you'll execute?' How do you respond?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Presentation Structure",
      description:
        "Uses a structure that separates the three initiatives clearly — shipping, ongoing, exploring — rather than collapsing them into a single 'AI strategy' narrative. Leads with what's shipping, because it's the most credible. Addresses the different board member concerns without overloading each initiative.",
    },
    {
      criterion: "ROI Communication Under Uncertainty",
      description:
        "Answers Kavita's question honestly: what's measured (beta activation data), what's estimated (revenue impact), and what the measurement plan is. Does not invent a number; does not deflect. Offers a specific point in time when the ROI data will be available.",
    },
    {
      criterion: "Differentiation Answer",
      description:
        "Responds to Sergei's question with specifics about users — not technology. The 'what makes it different' answer is about knowing your customers' specific problems better than the market does, backed by real data (like the 4.2-hour-to-38-minute activation stat).",
    },
    {
      criterion: "Narrative Discipline",
      description:
        "Maintains the distinction between the three initiatives throughout — resists the temptation to make initiative 3 sound more certain than it is, or to make initiative 2 sound more measured than it is. Does not overstate evidence.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Board presentations on AI roadmaps fail most often by collapsing three different types of initiative — shipping, operating, exploring — into a single confident narrative. That makes the core product feature look less credible (by association with unproven exploration) and makes the exploration look more certain than it is. Strong responses keep the three initiatives structurally separate and use different claim standards for each.",
    strengths: [
      "Using the beta activation data (4.2 hours to 38 minutes) as the anchor for the differentiation answer — specific user data is more credible than technology claims",
      "Answering Kavita honestly: stating what's measured, what's estimated, and when the revenue data will exist — rather than inflating the beta results into projected ARR",
    ],
    blindSpots: [
      "Board members remember what you said 6 months ago. If you present initiative 3 as a near-term bet — because Priscilla is excited and it makes the narrative feel ambitious — you will be asked about it next quarter, and the quarter after that. Point estimates become accountability items in board decks. Framing initiative 3 as 'early research with a 12–18 month horizon and no committed engineering' is harder to say but protects your credibility for the next three quarters more than a confident-sounding roadmap that you can't deliver on.",
      "Presenting all three initiatives in a single 'AI strategy' narrative causes them to contaminate each other. Initiative 1, which is shipping in Q3 with real beta data, gets grouped with initiative 3, which is speculative. Board members who are skeptical of initiative 3 will apply that skepticism to initiative 1. Keeping them visually and verbally separate — 'these are three distinct initiatives with different timelines and evidence bases' — prevents the halo effect from running in the wrong direction.",
      "Sergei's question — 'what makes it different?' — is not really a technology question. It's asking: do you understand your users' specific problems better than your competitors do? The answer that works is not 'our AI is better' or 'we have a unique architecture.' The answer is: 'We know that our users spend 4.2 hours building their first workflow, and we've confirmed in beta that the AI drops that to 38 minutes for the specific workflows our users actually build.' That's a user insight, not a tech claim.",
    ],
    improvements: [
      "Open with a single framing sentence that sets different expectations for each initiative: 'We have one initiative shipping in Q3 with real user data, one operational investment with anecdotal but not yet measured impact, and one early-stage exploration that's pre-engineering.' This inoculates against the board mixing them up.",
      "For Kavita's ROI question, come prepared with a measurement plan: 'We will have Q3 revenue impact data by the October board meeting, specifically net expansion revenue in accounts that adopted the feature vs. those that didn't.' Giving her a date to expect the data is more useful than a projection.",
      "For initiative 2 (Copilot), do not defend it with 'engineers say they're faster.' Either measure it before the board meeting — a simple before/after on PR cycle time for a sample of engineers takes one afternoon to run — or acknowledge it's an investment you're currently tracking anecdotally and commit to a measurement approach",
    ],
    followUpQuestion:
      "At the next board meeting, initiative 1 has been live for 6 weeks. Activation rate is up, but net expansion revenue hasn't moved yet. Kavita asks: 'You said Q3 would show revenue impact. It hasn't. Why not?' How do you answer?",
    score: 6,
  },
}
