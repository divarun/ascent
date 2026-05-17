export const evaluateVendorBenchmark = {
  slug: "evaluate-vendor-benchmark",
  title: "Evaluate a Vendor's Benchmark Claim",
  isUnlocked: false,
  description:
    "Take a vendor's published benchmark for a task relevant to your work. Determine what it actually measures, design a task-specific test, and produce a benchmark validity assessment you'd use before making a model decision.",
  roles: ["IC", "EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Evaluate a Vendor's Benchmark Claim

Model vendors publish benchmarks constantly. MMLU scores, HumanEval numbers, MTEB retrieval rankings, Arena ELO ratings. These are real numbers measuring real things. The question is whether they measure what you need.

Your task: pick one benchmark claim from a model vendor relevant to something your team works on. Produce a three-part benchmark validity assessment.

---

### Part 1: Understand What the Benchmark Actually Measures

Research the benchmark and answer:

**What task does it test?**
Describe in concrete terms what inputs the benchmark uses, what outputs are evaluated, and how they're scored. Not the marketing summary — the actual methodology.

**What's the test distribution?**
What kinds of inputs appear in the benchmark test set? Where do they come from? How does that distribution compare to the inputs your system will actually handle?

**What does a high score actually predict?**
Be specific about what a strong performance on this benchmark tells you about the model's capability — and what it doesn't tell you. A high MMLU score tells you the model has broad factual knowledge. It doesn't tell you the model can follow multi-step instructions or handle ambiguous user queries.

**Known validity issues with this benchmark:**
Has it been shown to be vulnerable to contamination? Is it saturated (most leading models scoring above 90%)? Has it been criticized for specific measurement issues? Cite sources where you can.

---

### Part 2: Design a Task-Specific Evaluation

Based on an actual task your team works on (or a realistic hypothetical), design a 20-example evaluation that would tell you whether the benchmarked capability actually translates.

**The task:**
What specific thing are you testing? Be concrete — not "code generation" but "generating Python functions to transform JSON API responses into our internal data format."

**The 20 examples:**
You don't need to actually run them, but describe them specifically enough that someone else could generate them:
- What are the input types? (List 4–5 categories of inputs you'd include)
- What does a good output look like for each category?
- Which of the 20 would be "easy" cases? Which would be "hard"?
- How would you score them — exact match, rubric, human review?

**Baseline comparison:**
How would you establish a baseline to compare against? (Current model, previous model version, human performance, etc.)

**Downstream metric:**
What product or workflow metric would tell you if the model improvement actually mattered in practice? (Task completion rate, user correction rate, time saved, etc.)

---

### Part 3: Benchmark Validity Assessment

Produce a one-page assessment you'd share with a stakeholder who wants to make a model decision based on the vendor's benchmark.

Cover:
- What the benchmark tells you and what it doesn't
- Whether the benchmark's test distribution matches your use case
- What you'd need to see from your own evaluation before making a decision
- Your recommendation: is this benchmark sufficient evidence to make a model selection decision, or does it require supplemental evaluation?

---

### Good assessments are specific about the gap between benchmark and task

"Our queries are developer documentation search questions; MTEB's technical retrieval benchmark uses academic CS papers and Wikipedia — different domain, different query length distribution, different terminology density" is a specific gap.

"This benchmark might not apply to our use case" is not.`,
  staticGuidance: `The goal is not to debunk vendor claims — it's to calibrate how much weight to give them. Some benchmarks are quite relevant to specific tasks (SWE-Bench for agentic software engineering tasks, for example). Others are nearly irrelevant (MMLU for conversational assistant quality). Most are partially relevant in ways that require explicit analysis.

Strong assessments name what they *can't* determine from the benchmark, not just what they can. "This benchmark doesn't tell us anything about latency, multilingual performance, or instruction-following consistency" is useful information for a decision-maker.

The 20-example evaluation design is the most valuable part of this exercise — it forces specificity about what you're actually measuring. Teams that skip this step and use benchmarks as their primary model selection signal are the ones that end up in benchmark traps.`,
  checklist: [
    "Benchmark methodology is described in concrete terms — not marketing summary language",
    "Test distribution is compared specifically to the team's actual input distribution",
    "At least two specific claims about what the benchmark does and doesn't predict",
    "Known validity issues (contamination, saturation, criticism) are addressed",
    "Task-specific evaluation uses a real or realistic task, not a generic one",
    "20-example design specifies input categories, expected outputs, and scoring method",
    "A baseline comparison method is defined",
    "Downstream product metric is identified (not just an AI quality metric)",
    "Final assessment makes a clear recommendation with explicit reasoning",
  ],
  staticFeedback: {
    assessment:
      "Benchmark literacy is a core skill for any team that makes model selection decisions. The goal is not to distrust vendors — it's to know exactly what their benchmarks tell you and exactly what additional evidence you need before making consequential decisions. Teams with this skill make better model choices and waste less time on migrations that don't deliver.",
    highlights: [
      "Identifying specific distribution mismatches between the benchmark and your actual inputs — this is the most common and most impactful source of benchmark-to-production gaps",
      "Designing an evaluation that measures downstream product metrics rather than only AI quality metrics — this is what connects model selection to business outcomes",
    ],
    suggestions: [
      "Review your 20-example design: if all 20 examples are 'easy' cases, add at least 5 that represent edge cases or failure modes you're specifically worried about",
      "Check whether your downstream metric is actually measurable — if it requires months of data collection to observe, identify a leading indicator you can use for faster feedback",
    ],
    nextSteps: [
      "If you have access to the models being benchmarked, run your 20-example evaluation and compare results — this converts the assessment from theoretical to empirical",
      "Share the assessment with the person on your team who is most likely to cite benchmark scores in model selection discussions — this creates a shared vocabulary for what benchmark evidence does and doesn't support",
    ],
  },
}
