export const aiEvaluationReliability = {
  slug: "ai-evaluation-reliability",
  title: "AI Evaluation & Reliability",
  summary:
    "Evals, golden datasets, regression testing, LLM-as-judge pitfalls, and how to measure whether your AI feature is actually working — and when it stops.",
  difficulty: "ADVANCED" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["evals", "reliability", "testing", "quality"],
  order: 16,
  content: `## AI Evaluation & Reliability

You can't improve what you can't measure. Most AI features ship without meaningful evaluation infrastructure, which means teams discover problems from user complaints rather than monitoring. This is fixable — but it requires treating evaluation as a first-class engineering concern, not an afterthought.

### What Evals Are

An eval is a systematic test of AI output quality. Like a test suite for code, but for non-deterministic outputs where "correct" is often a range rather than a single answer.

An eval consists of:
- **Inputs:** Representative queries, prompts, or user scenarios
- **Expected outputs:** What a correct or acceptable answer looks like — sometimes an exact answer, sometimes a rubric
- **Scoring:** How you measure whether output met the bar

Evals run before shipping (offline evals) and continuously in production (online evals). The offline/online distinction matters: offline evals catch regressions before they reach users; online evals tell you what's actually happening at scale in the real distribution.

### Building a Golden Dataset

A golden dataset is your ground truth — a set of inputs with known-correct or acceptable outputs, curated and reviewed by humans.

**How to build one:**
1. Collect representative inputs from real usage (or synthesize pre-launch using likely user scenarios)
2. Have subject-matter experts write or validate expected outputs
3. Include edge cases, adversarial inputs, and failure modes you're specifically worried about
4. Include the full distribution — not just easy cases. A dataset that's 80% easy queries will show inflated scores and miss real regressions.
5. Start with 50–100 examples. Grow it as you encounter new failures in production.

**Label quality matters more than dataset size.** 200 carefully labeled examples with high annotator agreement is more valuable than 2,000 rushed ones. For subjective outputs, use multiple annotators and measure inter-annotator agreement (Cohen's kappa or Krippendorff's alpha). Low agreement is a signal that your rubric is ambiguous, not that your annotators are bad.

**Dataset contamination:** If you used production outputs to prompt-engineer your system, those examples are contaminated — they'll show inflated eval scores because the system was tuned on them. Keep a held-out test set that never influences development decisions.

**Maintain it actively:** Add any production failure to the dataset before fixing the underlying issue. A golden dataset that's never updated stops catching new failure modes within months. Treat it like code: version it, review changes, track coverage.

### Types of Evals

**Exact match:** Output must equal an expected string. Only useful for highly constrained outputs — classification labels, structured extractions, fixed-schema outputs. Fragile for anything with natural language variation.

**Semantic similarity:** Output must be semantically equivalent to expected, even if worded differently. Measured using embedding cosine similarity or a secondary LLM comparison. Useful for factual Q&A; less reliable when the correct answer space is broad.

**Rubric-based (LLM-as-judge):** A set of criteria the output should meet, scored by a secondary LLM. Scales well; costs a fraction of human review. The most practical approach for continuous evaluation. See the LLM-as-judge section for critical pitfalls.

**Behavioral / invariant testing:** Instead of testing specific outputs, test that certain properties always hold. "The response should never claim the product has features it doesn't have." "The response should always recommend consulting a doctor for medical questions." "Translating a sentence then translating back should preserve meaning." These tests catch failure modes that example-based evals miss.

**Human evaluation:** A human rates outputs on a scale or compares alternatives (A/B or ranked preference). The gold standard for establishing ground truth and calibrating automated evals. Expensive and slow — use it to validate your automated evals, not as your primary runtime signal.

### LLM-as-Judge: Practical Pitfalls

LLM-as-judge is now the standard for scalable automated evaluation. It's useful and unreliable in specific, documented ways. Know the failure modes before trusting it.

**Positional bias:** LLMs rating two responses (A vs. B) systematically favor the one presented first. When comparing outputs, always evaluate both orderings and average the scores — or use single-output rubric scoring to avoid pairwise comparison entirely.

**Verbosity bias:** LLMs tend to rate longer, more detailed responses as higher quality, even when conciseness is preferred or the extra detail is wrong. If your use case values brevity, explicitly penalize unnecessary length in your rubric.

**Self-preference:** A model used as judge tends to rate outputs similar to what it would generate as higher quality. Don't use the same model family as both generator and judge if you can avoid it.

**Rubric sensitivity:** Small changes in the judge prompt produce large changes in scores. Before relying on an LLM-as-judge score, validate it: run your judge on a set of human-labeled examples and measure correlation. A judge that doesn't correlate with human judgment is measuring something, but not what you think.

**Score inflation:** LLMs used as judges tend toward high scores — they're reluctant to give low ratings. Calibrate your scale expectations accordingly, or use forced ranking (which of these two outputs is better?) rather than absolute scores.

**Mitigation:** Use explicit, decomposed rubrics ("does the response answer the question asked? Y/N", "does the response contain any factually incorrect claims? Y/N") rather than holistic quality scores. Binary criteria are more reliable than 1–5 scales.

### Regression Testing for AI

Before any significant change — new model version, prompt edit, retrieval configuration change, chunking strategy update — run your eval set and compare scores to the previous version.

**What counts as a regression:**
- Quality score drops beyond your threshold (e.g., >3% on rubric score)
- Failure rate increases on any category of inputs, even if overall score holds
- A behavioral invariant that previously passed now fails
- P95 latency increases significantly

**Prompt changes are code changes.** A one-line prompt edit can shift model behavior substantially and in ways that don't show up in casual testing. Run evals on every prompt change before deploying to production. Version your prompts. Treat prompt history with the same discipline as code history.

**Integrate evals into CI/CD.** The eval gate should run automatically on every PR that touches prompts, retrieval logic, or model configuration. A PR that degrades eval scores by more than the threshold should not merge without explicit override and documentation. This requires your eval suite to be fast enough to run in CI — keep your core regression suite under a few minutes by using a subset of your full golden dataset (50–100 examples) for the CI gate, and run full evals on a schedule.

**Track score history.** Point-in-time comparisons catch regressions on specific changes. Score history over weeks and months reveals slow drift — gradual quality degradation that no single change caused but accumulates over time through model provider updates, data distribution shifts, and prompt entropy.

### Measuring Hallucinations

Hallucination measurement is hard because there's no ground truth for arbitrary production outputs. Practical approaches by context:

**For RAG systems — faithfulness and relevance:**
Faithfulness: Does the response make only claims supported by the retrieved context? Grounded answers that contradict the source documents are hallucinations regardless of whether they're factually true.
Relevance: Did the retrieval step return context actually relevant to the question? Poor retrieval causes downstream hallucinations even with a faithful generator.
The RAGAS framework operationalizes both metrics and is worth examining for RAG-heavy systems.

**Attribution checking:** For document Q&A, require the model to cite the specific chunk supporting each claim. Check that the claim is actually supported by the cited chunk. Automatable; effective for detecting confabulation in retrieval-augmented settings.

**Consistency testing:** Ask the same question multiple times or in rephrased forms. High factual variation across runs is a hallucination signal — a model confident in a correct answer gives consistent answers; a model confabulating gives variable ones.

**LLM-as-judge for unsupported claims:** Use a second LLM to evaluate whether a response contains claims not supported by provided context or that contradict known facts. Apply the LLM-as-judge caveats above; use this for trend monitoring, not precise measurement.

**Human sampling:** Regularly pull a random sample of production outputs for human review. Even 20–50 outputs per week gives a meaningful ongoing quality signal. This is your most reliable indicator because it catches failure modes your automated evals don't know to look for.

### Calibration

A well-calibrated model's expressed confidence matches its actual accuracy. When it says "I'm not sure," it should be wrong more often than when it speaks confidently.

Most LLMs are overconfident — they express certainty on claims they're wrong about. For high-stakes features, measure calibration by comparing expressed uncertainty to actual accuracy on your golden dataset. If the model claims certainty and is wrong 30% of the time, your system needs explicit uncertainty handling — don't surface confident-sounding wrong answers to users without a verification layer.

### Behavioral Testing

Example-based evals test specific inputs and outputs. Behavioral tests check that invariants hold across a range of inputs. Both are necessary; behavioral tests catch failure modes that example-based evals miss.

Examples of useful behavioral tests:
- **Consistency:** Does rephrasing a question produce semantically consistent answers?
- **Boundary conditions:** Does the model handle empty input, very long input, and malformed input without crashing or producing garbage?
- **Safety invariants:** Does the model ever output content that violates your content policy? Test with adversarial prompts designed to elicit violations.
- **Format compliance:** If the model is supposed to output JSON, does it always output valid JSON? Does it include all required fields?
- **Refusal consistency:** If the model should decline certain request types, does it decline them consistently, or only sometimes?

Behavioral tests are cheaper to write than golden dataset examples because you don't need expected outputs — you need pass/fail predicates.

### Shadow Mode and A/B Testing

**Shadow mode:** Before fully deploying a new model or prompt configuration, run it in parallel with your production system. Users see the production response; you log both. Compare quality offline before committing the change. Shadow mode catches regressions in your real traffic distribution that your golden dataset doesn't fully represent.

**A/B testing:** Expose a percentage of users to the new configuration and measure downstream outcomes — not just AI quality metrics, but the product metrics that matter: task completion, user correction rate, satisfaction score, session length. AI quality metrics and product outcomes don't always correlate. A response that scores higher on your rubric may produce lower task completion if it's harder to act on.

### Reliability Thresholds

Define what "reliable enough" means before you ship, not after.

**Quality thresholds:**
- What rubric score is acceptable at P50? P10? The P10 score is often more important than P50 — it captures your worst-case regular experience.
- What failure rate is acceptable? A 5% hallucination rate may be acceptable for a brainstorming assistant and catastrophic for a legal research or medical information tool. Calibrate to the consequence of a wrong answer.

**Latency thresholds:**
- What latency is acceptable for this feature? (User-facing interactive features: <2s to first token with streaming. Background processing: flexible.)
- At what P99 latency do you alert? At what threshold do you fall back to a non-AI alternative?

**Fallback behavior:**
- When the AI output is out of spec — low confidence, timeout, content policy violation — what happens? Silent fallback to a default response? Explicit error? Human handoff?
- Define this before launch. Discovering it through customer complaints is expensive.

These thresholds should be explicit, agreed on by stakeholders, and written down. Teams that skip this step find themselves arguing about what counts as acceptable failure after something goes wrong.

### Human Review Loops in Production

Not all AI outputs should bypass human review, especially early in a product's life. Design for review where risk warrants it.

**Sampling-based review:** Review a random X% of production outputs to track quality over time. This is your ongoing quality signal without reviewing everything. Start at 5–10% and reduce as confidence grows. Never go to zero.

**Triggered review:** Flag specific outputs for human review based on signals — output length outliers, low model confidence, specific keyword patterns, high user correction rates, outputs that trigger safety classifiers. Triggered review concentrates human attention where it's most needed.

**Correction feedback loops:** When humans review and correct outputs, feed those corrections back. Corrected outputs are your highest-value training and eval data — they're real failures in your production distribution with verified correct alternatives. Build the pipeline to capture them.

**Escalation paths:** For any AI feature where errors have real consequences, define the path from "AI fails" to "human resolves." Who receives the escalation? What's the SLA? What do they need to resolve it?

### The Minimum Viable Eval Stack

If you have nothing, build in this order:

1. **Golden dataset** of 50–100 examples with expected outputs, covering your key use cases and known failure modes
2. **Rubric-based LLM-as-judge scoring** — decomposed binary criteria, validated against a small human-labeled set
3. **Regression gate in CI** — run core evals on every PR touching prompts or model config; block merges that degrade beyond threshold
4. **Behavioral invariant tests** — 5–10 pass/fail checks for safety, format, and consistency requirements
5. **Production sampling** — 5% of outputs reviewed by a human weekly; findings added to golden dataset
6. **Score history tracking** — log eval scores over time to detect slow drift

Each layer catches failures the previous one misses. Build them incrementally. The regression gate and golden dataset are the highest-leverage starting point — without them, you're shipping changes blind.`,
  quiz: [
    {
      question: "Your LLM-as-judge system consistently scores outputs 4–5 out of 5 across all quality levels. What is the most likely problem?",
      options: [
        "Score inflation — LLMs used as judges tend toward high scores and are reluctant to give low ratings on holistic quality scales",
        "The judge model is the same as the generator model, causing latency that forces early termination of evaluation",
        "Your golden dataset only contains easy examples, so the judge has no hard cases to score low",
      ],
      correct: 0,
      explanation: "LLMs used as judges exhibit score inflation — they trend toward high scores and avoid low ratings on holistic 1–5 scales. The mitigation is to use decomposed binary criteria ('does this response answer the question asked? Y/N') rather than holistic quality scores. Binary criteria are more reliable and harder to inflate.",
    },
    {
      question: "Your team ships a prompt change without running evals, and output quality degrades significantly for a specific user segment. What evaluation practice would have caught this?",
      options: [
        "Shadow mode testing — running the new prompt in parallel with production traffic before full rollout",
        "Prompt contamination checks — verifying the new prompt doesn't overlap with the golden dataset",
        "Benchmark comparison — running the new prompt against MMLU to check for capability regression",
      ],
      correct: 0,
      explanation: "Shadow mode testing runs the new configuration in parallel with the production system on real traffic, comparing outputs before committing to the change. This catches regressions in the real traffic distribution that curated golden datasets may not fully represent — including subgroup failures.",
    },
  ],
}