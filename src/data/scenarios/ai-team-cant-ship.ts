export const aiTeamCantShip = {
  slug: "ai-team-cant-ship",
  title: "The AI Team That Can't Ship",
  isUnlocked: false,
  summary:
    "You inherited an AI team that's been building for 11 months, missed three deadlines, and has never shipped to a real user. The CEO wants an honest answer.",
  roles: ["EM"] as const,
  difficulty: "ADVANCED" as const,
  industry: "Legal Tech",
  context: `You're a Senior EM who inherited a 5-person AI team 3 months ago. The team has been building an AI document review system for a legal tech company for 11 months. The original timeline was 6 months.

Three demo days have come and gone. At each, the team showed a polished prototype, received positive stakeholder feedback, and returned to building. Stakeholders have largely stopped attending. The team is talented but increasingly demoralized.

Current state:
- The core model achieves 89% accuracy on internal test cases
- The system has never processed a real customer document
- Production deployment is "80% complete" — and has been for 6 weeks
- Test coverage is thin: mostly manually verified demo runs, no automated evals
- One senior engineer has rewritten the document parsing pipeline twice because she "wasn't happy with the architecture"
- The team has not shown the system to a single customer or legal professional outside the company

Your CEO pulls you into a 1:1: "Tell me honestly — will this ship, and when? Because if not, I need to make decisions about this investment."`,
  prompts: [
    {
      id: "p1",
      question:
        "Diagnose what's wrong with this team's delivery pattern. What specific failure modes do you see, and which is the most critical to address first?",
      followUp:
        "The senior engineer who rewrote the pipeline says the first two architectures were genuinely flawed and she was right to redo them. How do you evaluate that claim?",
    },
    {
      id: "p2",
      question:
        "What do you tell the CEO? Give a specific timeline and defend it.",
      followUp:
        "The CEO asks: 'What's your confidence level in that date?' How do you answer honestly?",
    },
    {
      id: "p3",
      question:
        "What changes in this team's process over the next 4 weeks? Be specific about what you implement.",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Diagnosis",
      description:
        "Identifies the compound failure modes: no production deployment discipline, perfectionism as a proxy for progress, lack of external validation with real users, demo as milestone instead of production as milestone, thin eval infrastructure masking unknown failure modes.",
    },
    {
      criterion: "CEO Communication",
      description:
        "Gives a specific date with a clear and honest confidence level. Does not give vague reassurance. Acknowledges the history without blame-shifting. Understands the CEO needs to make an investment decision, not hear optimism.",
    },
    {
      criterion: "Process Changes",
      description:
        "Implements concrete, verifiable changes: production deployment milestones, real user/customer document testing within weeks (not months), eval automation, scope lock. Not vague commitments to 'do better.'",
    },
    {
      criterion: "Technical Judgment",
      description:
        "Evaluates the architectural rework claim with evidence: asks what problem the new architecture solves, whether it's measurably better, and whether the pattern of rewriting is a one-time correction or a behavioral risk.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The core failure is AI-specific: demo performance masking production absence. A team that has never put the system in front of a real user doesn't know what it doesn't know. The urgent intervention is not more internal testing — it's getting something in front of real customer documents within two weeks, even in a limited, supervised way.",
    strengths: [
      "Recognizing that stakeholder disengagement is a lagging indicator of a broken delivery pattern, not just a communication problem",
      "Understanding that '89% accuracy on internal test cases' is not a reliable quality signal without external validation",
    ],
    blindSpots: [
      "The internal test cases may not represent real customer documents at all — legal documents vary wildly, and the 89% figure may be meaningless until tested on real inputs",
      "A deployment that has been '80% complete' for 6 weeks is a deadlock, not progress — something specific is blocking it that needs to be named and resolved",
      "The CEO question is existential: 11 months without production creates a credibility deficit that honest answers and concrete milestones can address, but optimism cannot",
    ],
    improvements: [
      "Establish production deployment as the only milestone that counts: internal demos stop being milestones immediately",
      "Get real customer documents within 2 weeks — even if the system processes them manually or with supervision — to validate whether the 89% translates",
      "Time-box scope: identify the minimum viable version that ships to production and lock it; all other improvements become Phase 2",
    ],
    followUpQuestion:
      "The team ships in 5 weeks to a pilot customer. Accuracy on their real documents drops to 71%. What do you do?",
    score: 6,
  },
}
