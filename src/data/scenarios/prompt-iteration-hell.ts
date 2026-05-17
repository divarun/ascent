export const promptIterationHell = {
  slug: "prompt-iteration-hell",
  title: "Prompt Iteration Hell",
  isUnlocked: false,
  summary:
    "You've made 14 major prompt iterations on a summarization feature over 3 weeks. It works on 85% of inputs. Your EM is asking whether this is a prompt problem or an architecture problem.",
  roles: ["IC"] as const,
  difficulty: "ADVANCED" as const,
  industry: "Consumer App",
  context: `You're a senior IC at a consumer app company building a summarization feature. Users paste in long documents — meeting transcripts, research papers, legal agreements — and the feature returns a structured summary with key points, action items, and open questions.

You've been working on this for 3 weeks. The current state:
- The prompt works on 85% of your test inputs
- The remaining 15% fail in varied ways: some summaries are too long (3x the target length), some miss key information (action items aren't extracted), some hallucinate details not present in the source document
- You've made 14 major prompt iterations: changed the instruction framing, added output format constraints, tried chain-of-thought, tried few-shot examples, experimented with system vs. user message placement

The failures don't feel random. You've noticed that documents with embedded tables, documents in legal language, and documents longer than 6,000 tokens all seem to fail more often — but you haven't formally measured this.

Your PM, James, wants an update. Your EM, Soo-Jin, pulled you aside: "Before I tell James anything, I need to know: is this a prompt problem or an architecture problem? Because those have different timelines and different solutions."`,
  prompts: [
    {
      id: "p1",
      question:
        "How do you distinguish between 'keep iterating on the prompt' and 'rethink the architecture'? What diagnostic would you run?",
      followUp:
        "Soo-Jin asks: 'How long would the diagnostic take, and what would it tell us?' Give her a specific answer.",
    },
    {
      id: "p2",
      question:
        "You run the diagnostic and confirm the failures are systematic, not random — specific categories of input always fail. What does that tell you about whether this is a prompt or architecture problem?",
      followUp:
        "Soo-Jin asks: 'Could a better prompt handle these categories, or is this definitely architectural?' How do you answer that honestly?",
    },
    {
      id: "p3",
      question:
        "You recommend a 1-week architectural change: switching from single-call summarization to a two-step extract-then-summarize approach. James says the feature was supposed to ship 2 weeks ago. How do you make the case?",
      followUp: null,
    },
  ],
  rubric: [
    {
      criterion: "Diagnostic Thinking",
      description:
        "Proposes categorizing the 15% failures before drawing any conclusions — specifically to determine whether failures cluster on input type (architectural signal) or are randomly distributed (prompt signal). Doesn't guess; designs a test.",
    },
    {
      criterion: "Systematic vs. Random Failure",
      description:
        "Understands what failure clustering means: if specific input categories reliably fail across 14 prompt iterations, the current architecture has a structural limitation for those inputs that prompt engineering cannot overcome.",
    },
    {
      criterion: "Architecture Decision Framing",
      description:
        "Can explain to a non-technical PM why an architectural change is different from 'more iteration' — it's not a time trade-off, it's a different problem being solved. Frames the week as buying confidence in the right solution, not delaying the wrong one.",
    },
    {
      criterion: "Proof of Concept",
      description:
        "Proposes spiking the two-step approach on the failing inputs before committing to the full week — a 2-hour experiment that can validate the architectural hypothesis before the team commits to the work.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "After 14 iterations, you have a dataset — what the current architecture can and can't do. Strong responses use that data as the basis for the architectural decision rather than proposing more iteration as the default path. The diagnostic question isn't 'should we try more prompts,' it's 'does the failure pattern tell us something the prompt can't fix.'",
    strengths: [
      "Recognizing that 14 iterations of data is information, not just frustration — and that the failure pattern in that data is the actual diagnostic",
      "Separating the question 'is this fixable with a prompt?' from the question 'how long will that take?' — answering the first one determines whether the second question is even worth asking",
    ],
    blindSpots: [
      "If you haven't formally categorized the 85/15 split, you've been iterating on intuition for 3 weeks, and Soo-Jin's question cannot be answered. The first step is turning the 15% failures into a labeled dataset — not to build an eval pipeline, but to answer a single question: do failures cluster on input type or not? That takes a few hours, not a week, and it changes everything about the architectural decision.",
      "Systematic failures after 14 iterations mean the current architecture has a ceiling for those input types. That's important: it means iteration 15 is not more likely to work than iteration 8 was. The 2-week delay isn't the sunk cost — committing to iteration 15 without a structural diagnosis is.",
      "Recommending an architectural change without a proof of concept is a theoretical argument. A 2-hour spike on the two-step approach using just the failing inputs — just enough to show whether it handles tables and long documents — gives you concrete evidence. With that evidence, the week investment is easy to approve. Without it, it's a hypothesis competing with 'try one more prompt.'",
    ],
    improvements: [
      "Before any architectural discussion, spend 2-3 hours labeling the failure cases and building a simple breakdown: failure rate by input category, length range, and language type. Present this to Soo-Jin as your diagnostic output — it answers her question directly.",
      "Spike the two-step architecture on the 10 hardest failing inputs before proposing the full week. If it handles 8 of them cleanly, you have a proof of concept. If it doesn't, you've saved a week and you're back to the prompt question with better data.",
      "When making the case to James, frame the week not as 'more delay' but as 'the remaining 15% will keep failing without this change, and here's the evidence.' The evidence is what makes this a decision, not a negotiation.",
    ],
    followUpQuestion:
      "You shipped the two-step approach. Failure rate dropped from 15% to 4%. The remaining 4% all involve non-English documents with mixed-language content, a case you didn't anticipate. Shipping is in 3 days. What do you do?",
    score: 6,
  },
}
