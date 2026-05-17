export const seniorRefusesAi = {
  slug: "senior-refuses-ai",
  title: "Your Senior Engineer Refuses to Use AI Tools",
  isUnlocked: false,
  summary:
    "Your strongest engineer tried AI tools seriously for 3 weeks and concluded they're slower with them. The rest of the team is going AI-first. You need to decide if this is a problem.",
  roles: ["EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "Engineering",
  context: `Your most experienced engineer has been at the company for 7 years. They own the core data pipeline, know the architecture better than anyone, and are consistently rated at the top of the team on every performance dimension. They mentor two juniors, conduct the most thorough code reviews, and have never missed a commitment.

Three months ago, your team adopted AI coding tools — Cursor and Claude Code — as part of a company-wide push. Everyone was encouraged to integrate these tools into their workflow. Most of the team has done so. The experienced engineer gave it a genuine try: three weeks of sustained daily use across real tasks.

Their conclusion, shared directly with you: "The code it generates doesn't fit our patterns, and reviewing what it produces is slower than writing it myself. I've tried both tools seriously and I'm slower with them on the work I actually do. I'm not going to keep using them."

They're not being obstructionist. Their output hasn't changed. Their reviews are still the best on the team. They just aren't using the tools, and they've been transparent about why.

You now have a decision to make about whether — and how — to respond.`,
  prompts: [
    {
      id: "p1",
      question: "Do you require them to use AI tools? What's your position and reasoning?",
      followUp:
        "The engineer says their specific work — complex systems debugging and architecture decisions — may genuinely not benefit from AI tools the way greenfield feature work does. How do you evaluate that claim?",
    },
    {
      id: "p2",
      question:
        'The engineer says: "If using AI is a performance requirement, I\'m open to finding somewhere that values what I actually do." How do you respond?',
      followUp:
        "Is this a bluff, a serious statement, or something else? How does your read of their intent affect your response?",
    },
    {
      id: "p3",
      question:
        "Three months later, the engineer's velocity is unchanged but the rest of the team has increased 25%. Leadership asks why your strongest engineer isn't using AI. What do you say?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Evidence Evaluation",
      description:
        "Engages with the engineer's actual claim — that AI tools make them slower — rather than dismissing it; recognizes this is a plausible outcome for expert engineers on complex tasks",
    },
    {
      criterion: "Retention Risk Assessment",
      description:
        "Accurately weighs the cost of losing a 7-year engineer who owns critical infrastructure against the cost of having one non-AI-tool user on the team",
    },
    {
      criterion: "Leadership Communication",
      description:
        "Prepares an honest answer for leadership that neither throws the engineer under the bus nor fabricates adoption metrics",
    },
    {
      criterion: "Policy Coherence",
      description:
        "Distinguishes between 'encouraged to try' and 'required to use' — and is clear about which category AI tool usage falls into and why",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The engineer's position is coherent, not resistant. Strong responses recognize that 'expert engineer is slower with AI tools on complex tasks' is a documented phenomenon, not an excuse — and that the risk calculus heavily favors not making tool usage a retention flashpoint for someone who knows where all the critical infrastructure bodies are buried.",
    strengths: [
      "Treating the engineer's three-week evaluation as legitimate data rather than dismissing it as unwillingness",
      "Recognizing that leadership's question about AI adoption is a narrative question that requires a thoughtful answer, not a defensive one",
    ],
    blindSpots: [
      "The engineer might genuinely be right — METR and other research has found expert developers are often slower with AI tools on complex, context-heavy tasks. 'Strong engineer doesn't benefit from AI' is a coherent outcome, not a failure to try hard enough",
      "Making AI tool usage a formal performance requirement ties retention of the engineer who knows the most about your most critical systems to a tooling preference — that trade should be made explicitly, not accidentally",
      "The 25% velocity gain from the rest of the team may not account for the fact that this engineer is likely reviewing more AI-generated code from others — their apparent unchanged velocity may actually be subsidizing the team's increased throughput",
    ],
    improvements: [
      "Have a direct conversation with the engineer about whether there are specific use cases — documentation, test generation, exploratory prototyping — where AI tools might fit their work without friction",
      "Prepare a one-paragraph answer for leadership that frames this accurately: one engineer evaluated the tools, found them net-negative for their specific work type, and is delivering at their usual high level",
      "Revisit the company's AI tool policy language: if the intent was 'try these,' then this engineer has done that; if the intent is 'use these,' that needs to be stated explicitly and the retention risk owned consciously",
    ],
    followUpQuestion:
      "You defend the engineer to leadership and they accept your reasoning. Six months later, a second strong engineer reaches the same conclusion about AI tools. Leadership asks if you have a culture problem. How do you distinguish between legitimate tool-fit variation and a broader adoption failure?",
    score: 6,
  },
}
