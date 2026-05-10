export const modelSelectionBasics = {
  slug: "model-selection-basics",
  title: "Model Selection Basics",
  summary:
    "GPT-4o, Claude, Gemini, Llama — how to think about choosing between AI models, what benchmarks actually measure, and how to run evaluations that predict production performance.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["models", "evaluation", "decision-making"],
  order: 6,
  content: `## Model Selection Basics

The model landscape changes every few months. Specific model comparisons are outdated by the time you read them. What matters is developing a framework for evaluating models for your use case — one that works regardless of which models exist when you're reading this.

### The Model Landscape: Understanding the Tiers

Before selecting a model, understand the tier structure. Each tier involves real tradeoffs, not just a quality gradient.

**Frontier models (GPT-4o, Claude Sonnet/Opus, Gemini Pro/Ultra):**
The highest-capability models available via API. Best general reasoning, instruction following, and multi-step task performance. Most expensive, typically highest latency. Data goes to vendor servers. The default starting point for new use cases before optimization.

**Reasoning models (o3, o1, Claude with extended thinking):**
A distinct tier optimized for problems requiring multi-step logical reasoning, math, and code. These models "think" before responding — generating an internal chain of reasoning that isn't shown to the user. Higher latency (seconds to minutes for hard problems), higher cost, but substantially better on tasks requiring deep reasoning. Use for complex analysis, difficult coding problems, and multi-step logical tasks. Don't use for simple generation tasks where the reasoning overhead adds cost without benefit.

**Mid-tier models (GPT-4o mini, Claude Haiku, Gemini Flash):**
5–15x cheaper than frontier models with 70–85% of the capability on most tasks. The correct default for high-volume production workloads once you've validated that quality is sufficient. Many teams run on frontier models in production because they started there and never re-evaluated.

**Open-weight models (Llama 3, Mistral, Qwen, Gemma, DeepSeek):**
Weights are public; you run inference yourself or via hosting services (Together AI, Replicate, Fireworks). Data stays on your infrastructure. No per-token API cost after infrastructure. Operationally complex. The gap with frontier models has narrowed significantly on many tasks. Strong options for: data-sensitive applications, high-volume workloads where economics justify infrastructure, and specific tasks where fine-tuning a smaller model outperforms prompting a larger one.

**Specialized models:**
Separate selection decisions entirely — not substitutes for general models:
- **Embedding models** (text-embedding-3-large, Cohere Embed): Convert text to vectors for semantic search and RAG. Evaluated on retrieval benchmarks (MTEB), not generation quality.
- **Rerankers** (Cohere Rerank, cross-encoders): Reorder retrieved results by relevance. Separate from the generation model.
- **Vision models**: Image understanding capability varies significantly even among frontier models. Test on your specific image types.
- **Code models**: Some models are specifically optimized for code generation and understanding.

Don't conflate these. Choosing a "better" generation model doesn't improve your embedding quality.

### The Variables That Actually Matter

**Capability on your task (not benchmarks)**
Public benchmarks measure specific, narrow capabilities. MMLU measures multiple-choice knowledge. HumanEval measures introductory coding problems. MATH measures mathematical reasoning. MT-Bench measures instruction following on curated examples.

What they don't measure: your task. A model that tops HumanEval may underperform on your specific codebase style. A model with high MMLU may hallucinate on your domain's terminology. A model that dominates MT-Bench may produce inconsistent output formats for your structured extraction task.

Use benchmarks for initial filtering — to eliminate clearly weak models — then evaluate on your actual task. Never make a production model decision from benchmarks alone.

**Latency (at the right percentiles)**
P50 latency tells you what half of users experience. P95 and P99 tell you what your worst-case users experience. LLM latency has heavy tails — a feature with a P50 of 800ms may have a P99 of 10s.

Distinguish between time-to-first-token (TTFT) and total generation time. For streaming features, TTFT determines perceived responsiveness even if total generation time is long. For non-streaming features, total time is what matters.

Test latency under load conditions similar to your production patterns, not just isolated single requests. Provider latency degrades under peak load, and the degradation varies by provider and model.

**Cost (fully modeled)**
Don't compare only API prices. Model the cost per feature given your actual token distribution:

\`\`\`
Monthly cost = (avg input tokens × input price + avg output tokens × output price)
               × daily request volume × 30 days

Include:
- System prompt tokens (paid every request)
- RAG context tokens (paid every request)
- Conversation history tokens (grow with conversation length)
- Tool definitions (paid every request for agentic features)
\`\`\`

Compare this to mid-tier and open-weight alternatives. Many teams discover they're paying frontier prices for tasks that mid-tier models handle equally well.

**Context window: length vs. quality**
Large context windows are marketed heavily. The quality of long-context processing is less marketed.

The "lost in the middle" problem: models perform worse on information placed in the middle of long contexts than on information at the beginning or end. For a 128K context model processing a 100K token document, retrieval of facts from the middle of the document may be substantially less reliable than retrieval of facts from the first or last 10K tokens.

Test long-context quality on your actual use case before assuming a large context window solves your problem. RAG may produce better results than stuffing a full document into context, even when the document fits.

**Reliability and uptime**
SLA agreements, historical uptime, incident communication quality, and rate limit structures vary by provider and tier. Enterprise tiers typically offer higher rate limits and better SLAs. Evaluate:
- Published uptime SLA and historical actual uptime (providers often publish status pages with history)
- Incident communication: how quickly does the provider acknowledge and update on outages?
- Rate limit structure: requests per minute and tokens per minute limits at your intended tier
- Rate limit increase process: how quickly can you get limits increased if you need to?

**Model versioning and stability**
Models are updated. Behavior changes. A model version you've tuned prompts for may behave differently after a provider update.

Key questions: Does the provider allow pinning to specific model versions? What's the notice period before a version is deprecated? How do you find out that a model has been updated?

Best practice: pin to specific model versions in production. Test new versions against your eval suite before updating the production pin. Treat model updates as you'd treat a dependency upgrade — not as something that happens automatically without review.

**Data handling**
Where is data processed? Is it used for model training? What's the retention period? (Covered in depth in the Data Privacy module — address these before committing to a provider for any data-sensitive use case.)

### Reading Benchmarks Without Being Misled

Understanding what benchmarks do and don't measure helps you use them appropriately.

**Common benchmarks and what they actually measure:**
- **MMLU:** Multiple-choice knowledge across 57 subjects. Measures breadth of factual knowledge. Does not measure generation quality, instruction following, or real-world task performance.
- **HumanEval / MBPP:** Code completion on relatively simple, self-contained problems. Doesn't measure performance on real codebases with dependencies, style requirements, and complex context.
- **MATH / GSM8K:** Mathematical reasoning. Relevant if your use case involves math; less relevant otherwise.
- **MT-Bench / Arena:** Instruction following and conversational quality, rated by humans or LLM judges. More relevant to general-purpose use but still curated and not your specific task.
- **MMLU-Pro, GPQA:** Harder knowledge benchmarks designed to resist benchmark saturation. Better signal than MMLU for frontier models that have effectively maxed it out.

**Benchmark saturation:** Top frontier models score near the ceiling on many benchmarks. Differences in the 85–92% range on MMLU are often noise, not signal. When benchmarks saturate, they stop differentiating. Newer, harder benchmarks (GPQA, FrontierMath) are designed to restore differentiation.

**Training data contamination:** Models may have seen benchmark test sets during training, inflating scores. This is documented for some benchmarks and models. Treat benchmark scores as noisy estimates, not ground truth.

**The only benchmark that matters for your decision:** How the model performs on your actual task, measured on your actual data. Everything else is a filter to narrow the candidate list.

### Running Your Own Evaluation

The evaluation you run is worth more than any public benchmark. This is how to do it correctly.

**Build your test set:**
- 50–100 representative inputs from your actual use case
- Cover the full distribution: easy cases, hard cases, edge cases, the inputs you're worried about
- Include examples that caused problems in development
- If you have production data, sample from it — real user inputs are messier and more varied than synthetic examples
- Hold out a test set that never influences prompt development decisions

**Define your scoring criteria before you run:**
Write your rubric or LLM-as-judge prompt before seeing any model outputs. Defining criteria after you've seen results biases toward whichever model produced outputs you found appealing.

**Handle multi-dimensional tradeoffs:**
Models often trade off on different dimensions — Model A has better factual accuracy, Model B produces better-formatted outputs. Build your rubric to reflect your actual priority ordering. If format matters more than accuracy for your use case, weight accordingly.

When models are close on your primary metric, factor in cost and latency. A 2% quality difference rarely justifies a 5x cost difference.

**LLM-as-judge caveats:**
Using a second LLM to score outputs is scalable and often well-correlated with human judgment — but only if validated. Before relying on LLM-as-judge scores, run it on a sample with human labels and verify correlation. Watch for positional bias (the judge favors whichever response it sees first) and verbosity bias (the judge favors longer responses). Use decomposed binary criteria rather than holistic quality scores.

**Measure latency and cost alongside quality:**
Run latency measurements under realistic conditions — not just single isolated calls. For cost, use your actual input distribution, not an average. Include system prompt tokens, which are often larger than the user message.

**Run adversarial inputs:**
Include inputs designed to surface failures: very long inputs, very short inputs, inputs with unusual formatting, inputs that are ambiguous, inputs that might trigger refusals. You want to find these failures before production does.

### Common Selection Patterns

**High-stakes, low-volume decisions (legal review, financial analysis, medical information):**
Use the best applicable model. At low volume, cost differences are small. Capability and accuracy differences are large. Consider reasoning models if the task involves multi-step analysis.

**High-volume, structured tasks (classification, extraction, templated generation):**
Start with frontier models to establish quality baseline. Re-evaluate with mid-tier models — they often match quality at 5–15x lower cost. Consider fine-tuning a small model if mid-tier quality is insufficient and volume justifies it.

**Real-time user-facing features:**
Latency is a user experience constraint. P95 matters. Use streaming. If your P95 latency exceeds 3–4 seconds without streaming, reconsider the model or the feature design. Mid-tier models are often appropriate here — they're faster as well as cheaper.

**Background processing (batch jobs, async pipelines):**
Latency doesn't matter. Use cheaper models or batch APIs (typically 50% discount for async processing with ~24-hour turnaround). Frontier quality on batch workloads often isn't necessary.

**Multi-step agent workflows:**
Each tool call and reasoning step adds latency and cost. A 5-step agent at frontier prices may cost 10x a single frontier call. Consider routing: use a capable but cheaper model for most agent steps, with the option to escalate to a more capable model for specific steps that require it.

### Model Routing: Using Multiple Models

A single model for all requests is simple but often suboptimal. Model routing — directing different request types to different models — is a first-class architecture pattern worth understanding.

**Simple routing patterns:**

**Quality-tiered routing:** Classify requests by complexity before sending to a model. Simple requests (single-fact lookup, classification, short generation) go to a fast, cheap model. Complex requests (multi-step reasoning, long-form generation, nuanced analysis) go to a more capable model. Requires a classifier or heuristics to determine complexity — itself a design decision.

**Cascade routing:** Send all requests to a cheap model first. If the output meets your quality threshold, return it. If not, escalate to a more capable model. Catches most requests cheaply; escalates the genuinely hard ones. Requires a quality evaluator — not trivial to build reliably.

**Failure fallback:** Your primary model provider has an outage. Your secondary model handles traffic. Less about cost optimization, more about reliability. Always have a fallback provider for production features.

**When routing complexity is worth it:** Routing adds engineering complexity and a latency overhead on every request. It's worth it at high volume (millions of requests per month) where the cost savings are substantial, or when you have clear bimodal request complexity and the models differ significantly in quality on each type.

### Frontier vs. Open-Weight: The Real Tradeoffs

The gap between frontier and open-weight models has narrowed substantially and will continue to narrow. The decision is less about capability than about operations, data, and economics.

**Where open-weight models are now competitive:**
- Instruction following on well-defined tasks
- Code generation on common languages and frameworks
- Structured data extraction
- Classification and routing
- Many RAG-based Q&A applications

**Where frontier models still lead:**
- Complex multi-step reasoning
- Tasks requiring broad, current world knowledge
- Nuanced instruction following with ambiguous requirements
- Tasks requiring strong performance across many diverse subtypes
- Novel or unusual tasks outside common training distributions

**The operational cost of self-hosting:**
Running open-weight models yourself means owning: GPU provisioning, model loading and serving, scaling, uptime, security, model updates, and performance optimization. This is a real engineering investment. Managed hosting services (Together AI, Fireworks, Replicate) reduce this burden at a cost premium over raw compute — but still require evaluating hosting provider reliability and data handling.

**Quantization:** Running models at reduced precision (int8, int4) via quantization reduces memory requirements and cost. A 70B model in 4-bit quantization can run on infrastructure that would otherwise require a 7B model. Quality tradeoff is task-dependent; test your specific task before assuming quantization is acceptable.

### The Model Is Not the Product

The most important reframe: model selection is one variable in a system where prompt engineering, retrieval design, evaluation rigor, and product design matter more than which model you choose. Teams that obsess over model selection while underinvesting in evaluation, prompting, and observability consistently underperform teams that have average model selection and strong engineering discipline.

The ranking: evaluation infrastructure > prompt quality > product design > model selection.

Run the evaluation. Use the model that wins on your task at your cost and latency constraints. Revisit when models improve or when your requirements change. Don't make model selection a recurring debate — make it a recurring measurement.`,
  quiz: [
    {
      question: "A model scores at the top of MMLU benchmarks. Your team is deciding whether to use it for a specialized legal document classification task. What should you do?",
      options: [
        "Select it — top benchmark performance is the strongest available signal for production quality",
        "Use benchmarks only to eliminate clearly weak candidates, then evaluate on your actual task inputs",
        "Avoid it — high benchmark scores indicate training data contamination that makes models unreliable in practice",
      ],
      correct: 1,
      explanation: "Benchmarks like MMLU measure specific, narrow capabilities and are frequently saturated at the frontier. They don't predict task-specific performance. Use public benchmarks to narrow the candidate list, then run your own evaluation on representative inputs.",
    },
    {
      question: "Your team's real-time user-facing chat feature has a P50 latency of 800ms, but users frequently report the feature seems 'broken'. What should you investigate?",
      options: [
        "P99 latency — LLM latency has heavy tails, and the rare worst-case experience is what users describe as 'broken'",
        "Token count per request — higher token counts cause the model to produce less accurate responses",
        "Temperature settings — higher temperatures cause variable response times that users perceive as unreliability",
      ],
      correct: 0,
      explanation: "LLM latency has heavy tails. A feature with a P50 of 800ms may have a P99 of 8–12 seconds. Users who hit the tail experience describe the feature as broken. For user-facing features, optimize for P95/P99, not just P50.",
    },
  ],
}