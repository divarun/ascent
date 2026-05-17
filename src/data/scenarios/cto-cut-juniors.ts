export const ctoCutJuniors = {
  slug: "cto-cut-juniors",
  title: "The CTO Wants to Cut 3 Junior Engineers",
  isUnlocked: false,
  summary:
    "The CTO believes AI tools make junior engineers redundant and wants to eliminate 3 junior positions at the next headcount review in 6 weeks. You disagree, but you need more than instinct.",
  roles: ["EM"] as const,
  difficulty: "ADVANCED" as const,
  industry: "Enterprise Software",
  context: `Your team has 8 engineers: 2 staff engineers, 3 seniors, and 3 juniors (all with 1-2 years of experience). The juniors are solid contributors — not stars, but progressing well and handling a meaningful share of the bug backlog and smaller feature work.

The CTO has been reading AI productivity research and internal velocity reports. At last week's leadership meeting, they proposed eliminating the 3 junior positions at the next headcount review in 6 weeks. The framing: "With modern AI tools, 5 senior engineers should be able to produce the same output as 8 engineers today, and we eliminate the overhead of onboarding and mentoring."

Your two most senior engineers are ambivalent when you ask them privately. One says: "Honestly, a lot of what the juniors do, I could probably get done with AI in less time." The other says: "I don't want to be the one doing all the 'junior work' on top of my current load, even if AI helps."

The juniors don't know this conversation is happening. The headcount review is in 6 weeks. You have a one-on-one with the CTO next Wednesday.`,
  prompts: [
    {
      id: "p1",
      question:
        "Do you agree with the CTO's assessment? What's your actual position, and how confident are you in it?",
      followUp:
        "The CTO says: 'I've seen the data — teams using AI tools have 30-40% higher velocity. Do the math.' How do you engage with that argument?",
    },
    {
      id: "p2",
      question:
        "If you oppose the cuts, how do you make the case? What evidence or argument would be most likely to change the CTO's mind?",
      followUp:
        "The CTO says they're open to a counter-proposal: 'Tell me what you'd cut instead to hit the same headcount savings.' What do you say?",
    },
    {
      id: "p3",
      question:
        "If the decision goes forward despite your objection, what do you do? What's your responsibility to the juniors, to your seniors, and to the team?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Position Clarity",
      description:
        "Takes a clear position rather than hedging indefinitely; identifies which parts of the CTO's reasoning are valid and which are flawed",
    },
    {
      criterion: "Argument Quality",
      description:
        "Builds the case on organizational risk, pipeline, and hidden contributions — not just sentiment; uses specific examples or analogies rather than vague appeals to 'culture'",
    },
    {
      criterion: "Handling Disagreement",
      description:
        "Distinguishes between exhausting legitimate channels and accepting a final decision; understands the EM's role is to advise clearly, not to block",
    },
    {
      criterion: "People Responsibility",
      description:
        "Addresses the obligation to the juniors directly — including what to tell them and when — without outsourcing it entirely to HR",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses engage directly with the CTO's logic rather than dismissing it, identify what the productivity data doesn't measure, and make a case grounded in pipeline risk and hidden contribution. The goal is to be heard, not to win — and if the decision still goes forward, to execute it with integrity toward the engineers affected.",
    strengths: [
      "Engaging with the productivity data rather than dismissing it as obviously wrong",
      "Recognizing the EM's job is to give clear input and then execute the decision — not to relitigate after it's made",
    ],
    blindSpots: [
      "Productivity data measures isolated coding tasks — it doesn't capture the questions juniors ask that surface hidden assumptions, the documentation gaps they expose by not knowing the undocumented path, or the sanity checks that catch things seniors stopped noticing",
      "Cutting the junior pipeline now means the senior bench dries up in 3-5 years — when you need to promote from within, the candidates won't exist because you stopped developing them",
      "If the cuts happen and one junior stays while two leave (a common outcome when some are retained), you may lose the one who would have become your best senior engineer — and you don't know which one that is yet",
    ],
    improvements: [
      "Before the CTO meeting, map what the three juniors actually own — bugs closed, review coverage, documentation, on-call tasks — to surface the work that would redistribute to seniors",
      "Propose a 90-day experiment: run AI tools with the current team composition and measure actual capacity change before making irreversible headcount cuts",
      "If the cuts go forward, have individual conversations with each junior before the formal notification — they deserve to hear it from their manager first, with honesty about what happened",
    ],
    followUpQuestion:
      "The cuts go through. Six months later, your two staff engineers are burning out and one is interviewing elsewhere. They tell you privately that the junior work redistribution is the reason. What do you do, and what do you tell the CTO?",
    score: 6,
  },
}
