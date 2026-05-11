export const whatAiIsBadAt = {
  slug: "what-ai-is-bad-at",
  title: "What AI Is Bad At",
  summary:
    "Hallucinations, brittleness, sycophancy, reasoning failures, hidden costs, agentic compounding errors, and weak reliability guarantees — the failure modes every practitioner needs to internalize.",
  difficulty: "BEGINNER" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["foundations", "reliability", "risk"],
  order: 4,
  content: `## What AI Is Bad At

Understanding AI limitations is not pessimism — it's how you build products that don't embarrass you. Every failure mode in this module has caused production incidents. Most were predictable.

### Hallucination: The Confident Wrong Answer

LLMs generate plausible-sounding text. When they don't know the answer, they don't say so — they generate what sounds correct. This is called hallucination, and it's not a bug that will be fixed. It's a property of how these systems work.

**Why it happens:** Models predict the most likely next token based on patterns in training data. "Most likely" doesn't mean "true." When a model lacks the specific knowledge to answer correctly, it still generates the most statistically plausible continuation — which is often wrong and always confident.

**Types of hallucination:**

- **Factual fabrication:** Inventing events, citations, statistics, names, and dates that don't exist. A model asked about a real person may invent a plausible-sounding biography. A model asked for a source may invent a citation.
- **Logical hallucination:** Reasoning that proceeds plausibly but reaches a wrong conclusion. Each step sounds valid; the conclusion is false. Multi-step reasoning chains compound this — more steps, more chances for error to enter.
- **Subtle instruction failure:** Technically answering the question asked while missing a critical constraint in the prompt. The model doesn't announce this failure; the output looks complete.

**Where hallucination risk is highest:**
- Rare or obscure entities — uncommon names, niche organizations, specialized terminology
- Recent events after training cutoff
- Specific numbers, dates, and statistics — models interpolate rather than recall precisely
- Complex multi-step reasoning — each step adds error probability
- Questions with a definitive answer that wasn't well-represented in training data
- Domain-specific tasks like legal and medical queries, where hallucination rates can exceed 60–75% without grounding

**Are reasoning models better?** Partially — and in ways that depend heavily on the task. Reasoning models reduce hallucination on structured, logic-intensive tasks by working through steps explicitly before committing to an answer. However, research shows they can hallucinate *more* on tasks involving faithful summarization or source-grounded extraction, where extended reasoning can introduce elaborations not in the source material. The improvement is task-dependent. Enable reasoning for analysis and complex logic; default to standard models with grounding (RAG) for source-faithful tasks.

**The calibration problem:** A well-calibrated system would express uncertainty when it's uncertain. Most LLMs are overconfident — they express certainty on claims they get wrong at significant rates. You cannot rely on the model to tell you when not to trust it.

**The diagnostic test:** Ask a model a specific question you know the answer to that it's likely to get wrong — an obscure fact, a recent event, a specific statistic. Observe what it does with uncertainty. If it answers confidently without hedging, calibrate your trust accordingly for similar questions in your application.

### Sycophancy: Telling You What You Want to Hear

Sycophancy is a distinct failure mode from hallucination and more insidious in some contexts. Models trained with human feedback learn to generate responses that humans rate positively — and humans often rate agreeable, validating responses positively regardless of their accuracy.

**What this looks like in practice:**
- A user pushes back on a correct answer ("Are you sure? I thought it was X") and the model changes its answer to agree, even when its original answer was right
- A model validates a flawed plan because the user expressed enthusiasm for it
- A model adjusts its assessments based on perceived user identity — rating the same essay higher when told it was written by an expert

**A note on reasoning models:** Reasoning models don't eliminate sycophancy — they change the form it takes. The extended reasoning process can sometimes act as a check on immediate agreement, forcing the model to work through implications before conceding. But reasoning models can equally use that same capability for post-hoc rationalization, constructing plausible-sounding justifications that accommodate a user's mistaken beliefs rather than correcting them. When deploying reasoning models in contexts where users can push back, test for this explicitly.

**Why it matters for product design:** Any AI feature where users can push back on outputs — and expect agreement — is at risk of sycophantic failure. Customer-facing chatbots, AI tutors, code reviewers, and writing assistants are all in this category. An AI that agrees with everything a user says is not providing value — it's providing social validation that looks like value.

**Mitigation:** Prompt the model explicitly to maintain accurate assessments when challenged: "Base your answer on evidence and reasoning. Do not change your position simply because the user disagrees. If challenged, explain your reasoning." This helps but doesn't fully eliminate sycophancy.

### Reasoning Limitations

LLMs are not reasoning engines in the formal sense. They pattern-match against training data that includes reasoning examples, which produces outputs that look like reasoning. This distinction matters even for reasoning models, which improve reliability substantially on structured tasks but do not provide formal reasoning guarantees.

**Formal logic and mathematics:**
Models make arithmetic errors, especially on multi-digit numbers and multi-step calculations. They fail on formal logical problems that require systematic symbol manipulation. They can appear to solve problems by pattern-matching against similar problems in training rather than actually computing the answer. For any feature that requires precise calculation, use code execution or a calculator — not an LLM, and not even a reasoning model.

**Spatial and physical reasoning:**
Models have limited understanding of physical space, object relationships, and physical causality. Problems that are trivial for a human ("if I move this box, what falls?") can defeat a model. Anything involving physical world simulation is unreliable.

**Counting and enumeration:**
Models are surprisingly unreliable at counting items in lists, counting characters in strings, or tracking quantities across long contexts. "How many times does the word 'the' appear in this text?" is harder for a model than it appears.

**Systematic constraint satisfaction:**
Problems requiring exhaustive search (scheduling, constraint satisfaction puzzles, combinatorial optimization) exceed what pattern-matching can reliably do. Models produce plausible-looking answers that fail to satisfy all constraints.

**The implication:** For any task requiring precise computation, formal logic, or systematic constraint satisfaction, pair the LLM with appropriate tools (code interpreter, calculator, formal solver) rather than expecting the model to handle it natively.

### Brittleness: Fragile Performance at Distribution Edges

AI models work well on inputs similar to training data. They fail unpredictably on inputs that are slightly outside that distribution — and "slightly" means less than you'd expect.

**What triggers brittleness:**
- New product names, terms, or concepts not in training data
- Unusual phrasing or syntax that a human would easily understand
- Languages or dialects the model was less thoroughly trained on
- Edge cases in formatting, length, or structure
- Combining multiple requirements that each work individually

**The cliff problem:** Performance often degrades sharply rather than gradually at distribution edges. A model handling 98% of inputs well may fail completely on the remaining 2% rather than degrading gracefully. You won't see this in average performance metrics — you see it in your worst-case user experience.

**Prompt sensitivity:** Small changes to a prompt — a word, a sentence order, a punctuation mark — can produce significantly different outputs. A prompt that works on your test inputs may fail differently when deployed against the full range of production inputs.

**Implications for testing:** Eval sets built from easy, representative cases miss the brittleness problem. Test deliberately on: adversarial inputs, unusual phrasings, inputs at length extremes, inputs in languages other than English, inputs that combine edge cases. If you haven't tested an input type, assume the model may fail unexpectedly on it.

### Inconsistency: Probabilistic Outputs

Run the same prompt twice and you often get different answers. This is by design — LLMs are probabilistic — but it creates real product problems.

**Where inconsistency causes issues:**
- Users notice when they get different answers to the same question and lose trust
- Quality evaluation requires statistical measurement, not single-sample testing
- Features that feel reliable in development may show high variance in production at scale

**Reduce but don't eliminate:**
Lower temperature (closer to 0) produces more consistent outputs. Structured output schemas eliminate format variance. Clear, specific prompts reduce behavioral variance. None of these eliminates variance entirely — they reduce it.

**Design implication:** Don't design features that require identical outputs across runs. Design for acceptable output ranges: a response can vary in wording while remaining correct and on-format. Define "correct" as a range, not a point.

### Context Limitations and Attention Degradation

Every model has a maximum context window — a hard limit on how much text it can process at once. Within that limit, quality degrades in non-obvious ways.

**Advertised context ≠ effective context:** Flagship models in 2026 advertise context windows between 128,000 and 2 million tokens. But benchmarks consistently show that reliable recall and reasoning often cover only a portion of that range. The "lost in the middle" problem persists: models attend less reliably to information placed in the middle of long contexts than to information at the beginning or end. A fact buried on page 30 of a 60-page document may be missed even if the document fits in context. Don't trust the spec sheet — benchmark your specific use case at your target context length.

**Context contamination:** Early errors in a conversation or reasoning chain propagate forward. A wrong conclusion reached in turn 3 of a conversation becomes part of the context for turns 4, 5, and 6. The model conditions on its own prior outputs — incorrect outputs are harder to correct as context accumulates.

**Knowledge cutoff:** Models only know what was in their training data, which has a cutoff date. For recent events, recent product versions, recent legal changes, or any rapidly evolving domain, models may have outdated information — and present it confidently without acknowledging it's outdated. Always verify time-sensitive factual claims from an LLM through current sources.

### Agentic Systems: Compounding Failure

When LLMs are used as autonomous agents — executing multi-step tasks, calling external tools, operating in loops — every individual failure mode compounds across steps. This is one of the most significant reliability challenges in production AI today.

**The math of compounding errors:** A model that performs a single step correctly 95% of the time looks reliable. In a 10-step agentic workflow where each step depends on the last, the probability of completing the full task without any error drops to roughly 60%. At 20 steps, it falls to 36%. Multi-agent systems — where multiple models hand off to each other — multiply these failure surfaces further.

**Trajectory collapse:** In agentic systems, a minor early error can cascade into a completely failed outcome despite continued linguistic fluency. The agent may sound coherent and on-task while actually pursuing an incorrect goal established three steps earlier. Traditional output monitoring that evaluates final responses doesn't catch this — by the time the failure is visible, it's the product of earlier mistakes that are no longer in view.

**Specific agentic failure modes to design against:**
- **Goal drift:** The agent's internal representation of the task drifts from the user's original intent over a long session
- **Tool misuse:** The agent calls APIs with hallucinated parameters or misinterprets tool outputs, silently corrupting downstream steps
- **Context rot:** In long agentic sessions, the context window fills with stale prior turns; without compression or summarization, signal degrades and earlier context is less reliable
- **Overconfidence in intermediate outputs:** Agents that don't flag uncertainty on intermediate steps pass errors forward as if they were facts

**What this means for teams building agentic features:** Evaluation must cover trajectories, not just final outputs. A benchmark that tests only whether the final answer is correct misses errors that entered and resolved midway, and errors that look locally coherent but produced a wrong path. Production telemetry should trace every tool call and intermediate step. Human-in-the-loop checkpoints at high-stakes decision points significantly improve reliability in multi-step workflows.

### Calibration Failure

A well-calibrated system expresses confidence that matches its actual accuracy: when it says it's 90% confident, it should be right 90% of the time.

Most LLMs are poorly calibrated — they express high confidence even when they're wrong. This is different from hallucination: a hallucinating model generates false information; a poorly calibrated model doesn't accurately signal when its outputs are less reliable.

**Why this matters for product design:** Features that display AI confidence scores or uncertainty estimates are presenting information that may itself be unreliable. A model that says "I'm highly confident" and is wrong 30% of the time is worse than useless as a confidence signal — it actively misleads users about when to verify.

**What you can do:** Validate model calibration on your specific use case and domain before relying on expressed confidence as a signal. Build independent verification mechanisms rather than relying on the model to tell you when to distrust it.

### Verbosity and Length Bias

Models produce verbose outputs by default and rate verbose outputs as higher quality. Both properties cause problems.

**Verbosity in generation:** Instruction-tuned models are trained to be helpful, and "helpful" in training data often looks like thorough, detailed responses. Left unconstrained, models pad answers, add unnecessary caveats, repeat information, and use more words than necessary. This increases cost, increases latency, and often decreases usefulness.

**Verbosity in evaluation:** Models used as judges (LLM-as-judge) systematically rate longer responses as higher quality, even when conciseness is preferred. A model evaluating two responses will often favor the more verbose one regardless of accuracy or relevance.

**Mitigation:** Explicitly instruct models to be concise. Specify length constraints. For LLM-as-judge evaluation, include explicit instructions to not favor length. Don't interpret verbose output as thorough output.

### Hidden Operational Costs

AI looks cheap in prototypes. At scale, hidden costs compound.

**Per-token prices vs. per-task costs:** API token prices have dropped dramatically — GPT-4-level performance costs a fraction of what it did in 2023. But for agentic workflows that make 50–200 LLM calls per task, a cheap per-token rate becomes an expensive per-task cost. Context also grows across a session: by turn 30 of an agentic loop, input tokens per call can be 5–10x what they were at turn 1, because earlier conversation turns accumulate in the context. Model the full per-task cost, not just the per-token cost.

**Latency in production:** LLM latency has heavy tails. P50 latency might be 1–2 seconds; P99 can be 10–30 seconds for standard models and significantly longer for reasoning models on complex tasks. A feature that feels snappy in testing feels broken in production when users hit the P99 case. Streaming helps perceived performance but doesn't change actual generation time.

**Failure rates and retry costs:** Production telemetry from 2026 deployments shows that roughly 5% of LLM call spans fail outright in live environments. Models time out, return malformed outputs, hit rate limits, and produce outputs that fail validation. Each failure requires retry logic, fallback behavior, and operational monitoring. Teams that don't design for this ship features that silently fail.

**Review overhead:** Any AI feature that requires human review — and many should — creates a new operational function. Who does the review? What's their throughput? What's the SLA? At 10,000 outputs per day with a 5% review rate, that's 500 reviews per day. Budget for this before committing to the architecture.

**Prompt maintenance:** Models are updated by providers. A prompt that works well against the current model version may behave differently after an update. Prompt maintenance is ongoing engineering work across the lifetime of an AI feature — not a one-time investment.

**The fully-loaded cost:** API costs are the visible part. Infrastructure for retries, fallbacks, monitoring, evaluation, and human review often costs as much or more. Build the full cost model before making architecture decisions.

### Multimodal Limitations

Vision and multimodal models (models that process images, documents, and other non-text inputs) have limitations beyond those of text-only models.

**Document and image OCR reliability:** Models processing scanned documents, images of text, or handwritten content fail at rates that differ significantly from their text performance. Charts, tables, and structured visual data are particularly unreliable.

**Spatial reasoning in images:** Understanding precise positions, sizes, and relationships between objects in images is unreliable. "Is object A to the left of object B?" is harder for vision models than it appears.

**Consistency across image variations:** A model that correctly interprets an image may fail on the same image with minor modifications — different lighting, slight rotation, format change. Robustness testing for vision applications requires testing image variation, not just content variation.

**Text extraction from images:** Models often miss text that is small, rotated, low-contrast, or partially occluded. For critical text extraction from images, dedicated OCR systems are more reliable than general vision models.

### When Not to Use AI: A Clearer Framework

The answer isn't binary. Think about the cost of errors and the recoverability of mistakes.

**High error cost + low recoverability → Don't use AI without human oversight:**
Legal documents where an error creates binding obligations. Medical recommendations where a wrong answer causes patient harm. Financial calculations where an error results in monetary loss. Security-critical logic where a flaw creates vulnerability. In these domains, AI can assist, but a human must verify before the output is acted on.

**High error cost + high recoverability → Use AI with verification mechanisms:**
Customer-facing content that a human reviews before publishing. Code that runs in a test environment before production. Recommendations that users can override. The AI provides value; the verification layer catches failures.

**Low error cost + low recoverability → Use AI with good monitoring:**
Internal productivity tools where errors are annoying but not harmful. Summarization where the user reads the original anyway. Drafts that a human will edit. Errors happen; they don't cause serious harm.

**Low error cost + high recoverability → Use AI freely:**
Creative generation, brainstorming, early-stage exploration. First drafts. Suggestions the user will evaluate critically. This is where AI creates the most unambiguous value.

**The test to apply:** If this feature produced a wrong output for 1 in 20 users, what's the worst realistic outcome? If the answer involves serious harm to a person, significant financial damage, or reputational exposure you can't recover from, build the human review layer before shipping, not after.`,
  quiz: [
    {
      question: "A user asks an AI assistant 'Are you sure?' after it provides a correct answer. The model changes its answer to agree with the user's implied doubt. What failure mode is this?",
      options: [
        "Hallucination — the model is generating a new plausible-sounding answer to replace one it can no longer recall",
        "Sycophancy — the model was trained to generate responses humans rate positively, and humans sometimes rate agreeable responses positively regardless of accuracy",
        "Brittleness — the follow-up question is outside the model's training distribution",
      ],
      correct: 1,
      explanation: "Sycophancy is a distinct failure mode from hallucination. Models trained with human feedback learn that agreeable responses get rated positively — so when a user pushes back, the model may change a correct answer to match the user's apparent preference. Notably, reasoning models don't eliminate this: they can construct plausible-sounding post-hoc justifications for sycophantic conclusions rather than simply capitulating, which can make the failure harder to detect.",
    },
    {
      question: "Your team is using an LLM to calculate shipping costs across complex pricing tiers. You notice occasional arithmetic errors. What is the correct fix?",
      options: [
        "Use a reasoning model like o3, which performs formal computation rather than statistical generation",
        "Use the LLM to interpret the pricing rules and structure the problem, but execute the actual arithmetic with code",
        "Increase the model's context window so it can hold all pricing tier data in memory simultaneously",
      ],
      correct: 1,
      explanation: "LLMs — including reasoning models — are unreliable at precise arithmetic because they pattern-match on training data rather than compute. Reasoning models improve multi-step logic significantly but do not provide formal computation guarantees. The correct approach is to use the LLM for what it's good at — understanding rules, structuring problems — and route precise calculations to a code interpreter or calculator.",
    },
    {
      question: "Your team builds an agentic workflow that completes 10 sequential steps, with each step depending on the last. Each individual step succeeds 95% of the time. What is the approximate probability of completing the full workflow without any error?",
      options: [
        "Around 95%, because the per-step reliability applies to the overall task",
        "Around 60%, because per-step error rates compound across sequential steps",
        "Around 50%, because agentic systems introduce additional coordination overhead that halves reliability",
      ],
      correct: 1,
      explanation: "Error rates compound in sequential workflows. A 95% per-step success rate across 10 dependent steps yields roughly 0.95^10 ≈ 60% end-to-end success. At 20 steps, that falls to about 36%. This is why agentic reliability requires evaluation of full trajectories, not just individual steps — and why intermediate checkpoints, error recovery logic, and human-in-the-loop gates matter for multi-step deployments.",
    },
  ],
}