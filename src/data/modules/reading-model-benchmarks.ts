export const readingModelBenchmarks = {
  slug: "reading-model-benchmarks",
  title: "Reading Model Benchmarks Critically",
  summary:
    "Vendor benchmarks measure what vendors chose to measure. How to read benchmark claims skeptically, understand what common benchmarks actually test, and design evaluations that predict performance on your specific task.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["model-selection", "evals", "vendors", "benchmarks"],
  order: 35,
  content: `## Reading Model Benchmarks Critically

When a model provider publishes a new model, the announcement includes benchmarks. MMLU: 92%. HumanEval: 87%. GPQA: 78%. These numbers are real. They measure something. The question is whether what they measure predicts what you need.

Most of the time, the answer is: partially, and less than it appears. Understanding why is the difference between choosing the right model for your use case and choosing the model that performed best on tests it was designed to pass.

### Why Benchmark Scores Are Unreliable as Selection Criteria

**Benchmark overfitting**

Models are trained on text from the internet. Benchmark questions from widely-published datasets are on the internet. When training data contains a benchmark's questions — or documents that describe how to answer them — the model's benchmark score reflects pattern matching against memorized content, not underlying capability. This is called "data contamination" and it's endemic.

Model providers who publish high benchmark scores don't always publish contamination analyses. Third-party contamination audits have found meaningful contamination in several widely-cited results. A score of 92% on a contaminated benchmark might correspond to 75% on a genuinely novel test of the same capability.

**Benchmark saturation**

Many popular benchmarks now have leading models scoring above 90%. At that point, differences between models are within the noise margin of the test methodology. Claiming a 0.3-point MMLU advantage is meaningless — the test can't discriminate at that resolution.

**Capability gap vs. task gap**

Benchmarks test general capabilities. Your task is specific. A model that scores highest on mathematical reasoning benchmarks may not be the best model for generating summaries of your financial reports. The tested capability and your required capability overlap but are not identical.

**Distribution mismatch**

Benchmark test sets have specific distributions — question types, difficulty levels, topic areas. Your production inputs have a different distribution. Even if the benchmark is contamination-free and well-constructed, your users will send inputs that look nothing like benchmark test questions.

### What Common Benchmarks Actually Measure

Understanding what benchmarks test tells you when to trust them.

**MMLU (Massive Multitask Language Understanding)**
Tests knowledge across 57 subjects — history, law, medicine, economics, computer science, and more. Multiple-choice format. A reasonable signal for breadth of factual knowledge and basic reasoning. Not a good signal for: instruction following, code generation, creative writing, multi-turn conversation, or any task requiring output in a specific format. Highly vulnerable to contamination because the dataset is widely published.

**HumanEval / MBPP**
Tests code generation — generate code that passes a set of unit tests. A reasonable signal for basic coding capability in popular languages. Not a signal for: code quality, maintainability, ability to work in your codebase, understanding of domain-specific frameworks, or debugging capability. Measures whether the model can write code that passes tests, not whether the code is good.

**GPQA (Graduate-Level Google-Proof Q&A)**
Tests expert-level knowledge in biology, chemistry, and physics on questions designed to be hard to answer via web search. A signal for deep domain reasoning. Useful if your task involves expert scientific domains. Less useful for most product engineering tasks.

**MT-Bench / Arena ELO (LMSYS Chatbot Arena)**
Arena ELO is based on human preference ratings from open-ended chatbot comparisons — users chat with two anonymous models and vote for the one they prefer. This is significantly more relevant to conversational AI tasks than academic benchmarks because it captures real user preference. Still has biases: preference for verbose, confident-sounding responses; preference for familiar conversational styles; limited coverage of professional or technical tasks.

**SWE-Bench**
Tests whether a model can resolve real GitHub issues — given an issue and a codebase, generate a patch that fixes the issue. More realistic than HumanEval. A good signal for code task capability in realistic software engineering contexts. Still limited to the specific codebases in the benchmark.

### The Vendor Benchmark Theater Problem

Model providers control which benchmarks they report. They run their own evaluations. This creates selection effects even without malicious intent: a provider will emphasize benchmarks where their model performs well and under-emphasize benchmarks where it doesn't.

**Curated demos:** Product demos show the model handling the cases it handles well. Every model looks good in a 30-minute demo — the demo is designed to. Demo performance predicts production performance only for the specific inputs shown in the demo.

**Selective benchmark reporting:** A model may report MMLU and HumanEval but not the coding or reasoning benchmarks where it trails competitors. Absence of a benchmark result is information.

**Internal vs. third-party evaluations:** Provider-run evaluations using provider-curated test sets are less reliable than third-party evaluations using independent test sets. When a provider reports a benchmark they ran themselves on a test set they constructed, treat the result with additional skepticism.

**What "state of the art" means:** A claim that a model achieves state-of-the-art performance on a benchmark is time-stamped — at the time of publication, on the benchmarks they chose to report. Models improve rapidly. Last quarter's state-of-the-art is this quarter's baseline.

### How to Design Your Own Evaluation

The only reliable way to select a model for your use case is to test it on your use case. This doesn't require a sophisticated ML evaluation framework — it requires discipline and honesty.

**Step 1: Collect representative inputs**

Get 30–50 examples of the inputs your system will actually process. Not hypothetical examples. Not the nicely-formatted ones. Real inputs from real usage, or realistic approximations if you don't have production data yet. Include:
- The most common case (high volume, representative)
- Edge cases you're specifically worried about (unusual inputs, tricky formats)
- Failure cases from similar systems you've seen break

**Step 2: Define what "good" means**

For each input, write down what a good output looks like. Not just "accurate" — specific criteria. Does it answer the question? Does it cite sources? Is it the right length? Does it avoid specific failure modes (hallucinating company details, misinterpreting the format)?

If you can't define what good looks like, you're not ready to evaluate a model. This step often reveals that the task is less well-specified than you thought.

**Step 3: Evaluate candidate models blind**

Run each candidate model on all inputs. If possible, have evaluators rate outputs without knowing which model produced them. Blind evaluation removes provider bias — you're less likely to give a preferred vendor's outputs favorable treatment when you don't know which outputs are theirs.

**Step 4: Measure the thing that matters**

Run your quality criteria as scoring rubrics. For each output: does it meet criterion A? Criterion B? Score models on your criteria, not on generic quality.

Also measure: latency, cost per request, failure rate (empty outputs, refusals, format errors), and behavior on your specific edge cases.

**Step 5: Compare on the dimensions that matter for your decision**

Model A may win on quality but lose on latency. Model B may win on cost but fail on your most important edge cases. The right choice depends on your specific tradeoffs — there's no universal answer.

Document this comparison. Six months from now, when someone proposes switching models for cost savings, you want to be able to show: here's what we tested, here's what we found, here's why we made the call we made.

### The Benchmark Trap in Practice

The typical failure mode: a vendor benchmark shows model B is 40% better on a task type that sounds relevant to your use case. You switch without running your own evaluation. In production, quality is flat or worse.

Why this happens:
- The benchmark task type overlaps with your task category but differs in important ways
- Your input distribution looks nothing like the benchmark distribution
- The benchmark score reflects contamination — the model saw the test data during training
- Your quality criteria aren't captured by the benchmark metric

The diagnosis is usually embarrassing to reconstruct: you made a significant infrastructure change based on a number whose methodology you didn't examine. The mitigation is always the same: run your own test on your own inputs before changing models.

### Latency and Cost Don't Have Benchmarks

The dimensions that most directly affect your system's behavior in production — latency and cost — are rarely compared in the same benchmarks that measure quality.

**Latency varies by:**
- Input length (tokens processed at inference time)
- Output length (tokens generated)
- Provider infrastructure load (time of day, current demand)
- Streaming vs. non-streaming (time-to-first-token vs. time-to-last-token)
- Request priority tier

A model that's 15% better on quality benchmarks but 3x slower at your p99 latency is not the right choice for a user-facing interactive feature, regardless of its benchmark position.

**Cost varies by:**
- Input token price vs. output token price (often different rates)
- Context caching availability and pricing
- Volume discounts and tier pricing
- Hidden costs: embedding calls, reranking calls, eval calls on top of generation calls

Always calculate cost per request at your expected volume, not per-token rates in isolation. A slightly more expensive per-token model may be significantly cheaper if it produces shorter outputs or caches more efficiently.

### What to Ask a Vendor

When a vendor presents benchmark results, these questions reveal whether the numbers are meaningful:

- Which benchmarks did you run that you chose not to include in this slide?
- Have you done a contamination analysis? Can I see it?
- Is the test set publicly available, or is it proprietary?
- Can I run your model on a test set I design, before signing anything?
- What's your latency at my expected request volume, not on your test infrastructure?
- How do these benchmark scores translate to the specific task I've described?

A vendor with genuinely good results on your task type will answer these questions directly. A vendor whose claims rely on selective reporting will struggle.`,
  quiz: [
    {
      question: "A vendor's model scores 15% higher than competitors on MMLU. You're building a customer support chatbot that handles product questions and troubleshooting. How much weight should MMLU give this decision?",
      options: [
        "Significant weight — MMLU measures broad knowledge, which is directly relevant to answering product and troubleshooting questions",
        "Minimal weight — MMLU measures memorized factual knowledge across academic subjects, not instruction-following, conversational quality, or domain-specific accuracy on your product",
        "Moderate weight — use MMLU as a tiebreaker when cost and latency are comparable between candidates",
      ],
      correct: 1,
      explanation: "MMLU tests breadth of factual recall across academic subjects in multiple-choice format. Customer support requires instruction following, conversational coherence, domain-specific accuracy about your product (which the model doesn't know from training), and appropriate tone. These capabilities are not what MMLU measures. A model that scores lower on MMLU may substantially outperform a higher scorer on your actual task. Run your own evaluation on representative customer support inputs.",
    },
    {
      question: "You switch to a new embedding model because its MTEB benchmark score is 40% better on retrieval tasks. Three months later, your search quality metrics haven't improved. What's the most likely explanation?",
      options: [
        "The MTEB benchmark uses a retrieval task distribution that differs from your documents and query patterns — the benchmark improvement didn't generalize to your specific data",
        "The new embedding model has higher dimensionality, which requires more storage and causes slower retrieval that offsets quality gains",
        "Your reranking model is the bottleneck, not the embedding model, and a better embedding didn't improve the quality ceiling",
      ],
      correct: 0,
      explanation: "Benchmark-to-production gaps are almost always distribution mismatch. MTEB's retrieval benchmarks use specific document types and query patterns. Your documents and user queries may have different characteristics — language, length, domain terminology, query style — that the better-scoring embedding model doesn't actually handle better. The fix is to evaluate embedding models on samples from your actual document corpus before switching.",
    },
  ],
}
