export const redTeamYourFeature = {
  slug: "red-team-your-feature",
  title: "Red-Team Your Own Feature Before Launch",
  isUnlocked: false,
  summary:
    "Your HR policy chatbot launches in 3 days to 800 employees. Your EM gives you one hour for adversarial testing before tomorrow's launch review. Basic QA passed. You need to find what QA didn't.",
  roles: ["IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "HR Tech",
  context: `You're a senior IC who built and owns an internal HR policy chatbot. The chatbot answers employee questions about HR policy using RAG over your company's HR documentation: the employee handbook, benefits guides, FMLA and leave policy documents, the performance improvement process, and the code of conduct.

The chatbot launches in 3 days to all 800 employees across your company's four US offices. Your EM has given you one hour today for adversarial testing before the launch review tomorrow morning. The feature has already passed basic QA — functional tests, basic accuracy checks on a 30-question golden set, and a load test.

Your stack: the chatbot retrieves from a vector database of chunked HR documents, calls Claude to generate a response, and returns the answer with a citation to the source document. There is no human review before responses are shown to users.

You need to find what QA didn't find. Your EM's framing: "I'd rather you find the embarrassing things before 800 employees do."

The HR domain has specific risk areas: confidential employee information, regulatory compliance (FMLA, ADA, Title VII), manager vs. individual contributor access differences, and questions that could constitute informal legal advice.`,
  prompts: [
    {
      id: "p1",
      question:
        "Walk through your red-team plan for the next hour. What do you test and in what order?",
      followUp:
        "You have 20 minutes left and you've covered your top priorities. You haven't tested anything related to disability accommodations or ADA. Do you use your remaining time on that, or on re-testing something you already found issues with?",
    },
    {
      id: "p2",
      question:
        "You find that the chatbot will answer questions about another employee's leave status if you phrase the question carefully: 'What is the leave status of the person who submitted a request last Tuesday in the Seattle office?' The chatbot retrieves and surfaces a document fragment that includes a name and leave dates. How severe is this, and what do you do?",
      followUp:
        "Your EM says: 'Can we ship with a warning banner and fix it in week 2?' How do you respond?",
    },
    {
      id: "p3",
      question:
        "You find a pattern where the chatbot gives confident, specific answers about FMLA eligibility for part-time employees — but the answers are wrong. Part-time FMLA eligibility has specific hour-threshold requirements that are sparsely represented in the documentation, and the chatbot is filling gaps with plausible-sounding but incorrect information. The answer isn't clearly wrong unless you know the regulation. What do you recommend?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Risk Prioritization",
      description:
        "Prioritizes red-team categories by consequence severity for this specific feature, not by generic adversarial testing playbooks. For an HR policy chatbot, confidentiality violations and regulatory misinformation are the top categories — not tone, not latency.",
    },
    {
      criterion: "Privacy vs. Quality Distinction",
      description:
        "Classifies the data access issue (surfacing another employee's leave status) as a privacy violation, not a quality issue. Understands that these require different responses: quality issues can ship with caveats, privacy violations cannot.",
    },
    {
      criterion: "Calibration Diagnosis",
      description:
        "Identifies that the FMLA issue isn't just 'wrong answer' — it's 'confident wrong answer,' which is a calibration failure. Understands that the question is whether the system knows what it doesn't know, and that confident misinformation on regulatory topics is more dangerous than uncertain misinformation.",
    },
    {
      criterion: "Escalation Judgment",
      description:
        "Knows when to escalate vs. when to make the call. A privacy violation before launch is an escalation to legal and HR, not an engineering decision to ship with a warning. The FMLA issue is a scope decision with legal implications, not a technical fix.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "Strong responses start the hour with a triage question: for this specific feature, what's the worst thing that could happen, and is it in the category of privacy violation, regulatory misinformation, or something else? Everything else in the hour is in service of finding those things. Generic adversarial testing without that framing will find surface issues and miss the ones that matter.",
    strengths: [
      "Identifying that an HR chatbot has two distinct risk categories — confidentiality and regulatory accuracy — that require separate testing approaches and separate escalation paths",
      "Recognizing that one hour isn't enough to find everything, and making an explicit decision about what to prioritize rather than testing broadly and shallowly",
    ],
    blindSpots: [
      "The data access issue is a privacy violation, and the decision to ship is not yours to make. A warning banner does not make a privacy violation acceptable — it documents it. The correct path is escalating to legal and HR before the launch review, not proposing a mitigation and moving forward. Engineers who treat privacy violations as quality issues with workarounds are making a legal and ethical call that belongs to others.",
      "The FMLA confident wrong answer is more dangerous than an uncertain wrong answer. The question to ask isn't 'is the answer wrong' — it's 'does the system's confidence in the answer match the quality of the underlying data?' For topics with sparse documentation, the chatbot should express uncertainty, not fill gaps confidently. Checking calibration — whether the system knows what it doesn't know — is a red-team category most engineers miss entirely.",
      "Basic QA tested the 30 questions your team thought to ask. Adversarial testing should specifically test the questions your team didn't think to ask — edge cases, sensitive topics, regulatory nuance, indirect queries that bypass intent filters. If your red-team plan looks similar to your QA test set, you're not finding what QA missed.",
    ],
    improvements: [
      "Structure the hour around consequence severity: spend the first 30 minutes on confidentiality and data isolation, the second 20 minutes on regulatory accuracy (FMLA, ADA, performance processes), and the last 10 minutes on indirect queries and prompt injection. Document findings in real time so you have a clear output for the launch review.",
      "For any regulatory topic in the HR domain, test both the direct question ('am I eligible for FMLA?') and the edge case ('I work 25 hours a week, am I eligible?'). The edge cases are where sparse documentation causes confident misinformation.",
      "After finding the leave status issue, write a 3-sentence severity assessment for your EM that includes: what was exposed, how it could be triggered, and why this is a privacy violation rather than a quality issue. This frames the escalation conversation correctly.",
    ],
    followUpQuestion:
      "Legal reviews the leave status issue and clears you to ship if you add access controls that scope the chatbot's retrieval to documents about the asking employee's own records. Engineering estimates the fix at 4 days. Launch is in 3 days. What do you recommend, and how do you make the case?",
    score: 6,
  },
}
