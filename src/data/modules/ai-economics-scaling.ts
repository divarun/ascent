export const aiEconomicsScaling = {
  slug: "ai-economics-scaling",
  title: "AI Economics & Scaling",
  summary:
    "Token costs, inference latency, caching strategies, model routing, batch processing, and the scaling realities that prototype economics hide.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["EM", "IC"] as const,
  tags: ["economics", "scaling", "infrastructure", "cost"],
  order: 12,
  content: `## AI Economics & Scaling

Prototype economics are not production economics. An AI feature that costs $0.01/user/day at 1,000 users costs $10,000/day at 1,000,000 users. Understanding cost structure before you scale is not optional.

### Token Economics: The Basics

Most LLM APIs charge per token. A token is roughly ¾ of a word — 1,000 tokens ≈ 750 words. Pricing is typically quoted per million tokens (MTok).

**Input tokens:** Everything in the prompt — system instructions, few-shot examples, retrieved context, conversation history, user message. You pay for all of it, on every request.

**Output tokens:** The model's response. Typically priced 3–5x higher than input tokens for frontier and mid-tier models. Check the specific pricing sheet — don't assume, and check often, as prices change frequently.

**Hidden token sources that surprise teams at scale:**
- System prompts are paid for on every request
- Conversation history grows with each turn and is resent in full — a 10-turn conversation may have 5–10x the tokens of a single turn
- RAG adds retrieved chunks to every call, often 1,000–4,000 tokens per request
- Few-shot examples in the prompt multiply across all requests
- Structured output schemas (JSON mode) add tokens to both the prompt and the response
- Reasoning models (o-series, extended thinking) charge for hidden thinking tokens at the output rate — a single call can burn tens of thousands of tokens before producing a short answer

**Cost modeling before you scale:**

Start with a per-request estimate:

\`\`\`
Cost per request = (avg input tokens × input price) + (avg output tokens × output price)

Example at current mid-tier pricing (~$3/MTok input, ~$15/MTok output for Claude Sonnet):
- System prompt: 500 tokens
- Retrieved context: 2,000 tokens
- Conversation history: 800 tokens
- User message: 100 tokens
- Total input: 3,400 tokens → $0.0102

- Response: 400 tokens → $0.006

Cost per request: ~$0.016

At 100K requests/day: $1,600/day, $48,000/month
\`\`\`

Run this at your expected scale, then at 10x. Note that budget-tier models (Gemini Flash, GPT-4.1 Nano, DeepSeek V3) can cut this cost by 10–50x for tasks that don't require frontier capability. If the number at 10x is uncomfortable, fix the architecture or model selection before you get there.

**Output length is the easiest cost lever.** Output tokens are expensive and often inflated by default model verbosity. Instruction-tuned models tend toward long, explanatory responses unless told otherwise. Explicitly instruct the model to be concise. For structured tasks (extraction, classification, JSON output), constrain the output schema to exactly what you need. Cutting average output by 30% cuts a meaningful fraction of your token bill.

### Inference Cost and Latency

Larger and more capable models cost more and respond more slowly. Prices shift frequently — treat the tiers as approximate guidance and verify against current provider pricing sheets before making architectural commitments.

| Model tier | Relative cost | Time to first token | Throughput |
|---|---|---|---|
| Budget (Gemini Flash, GPT-4.1 Nano, DeepSeek V3) | 1x | Fastest | Highest |
| Mid-tier (Claude Sonnet, GPT-4.1, Gemini Pro) | ~10–30x | Fast | High |
| Frontier (Claude Opus, GPT-5) | ~50–100x | Moderate | Moderate |
| Frontier reasoning (o-series, extended thinking) | ~150–500x | Slow (thinking tokens) | Low |

**Latency and user experience:**
- <500ms to first token: Feels instant; achievable with streaming on small/mid models
- 500ms–2s: Acceptable for most interactive features
- 2s–5s: Feels slow; users notice; consider streaming to improve perceived performance
- >5s: Abandonment risk on user-facing features; fine for background processing

**Streaming changes the equation.** Streaming returns tokens as they're generated rather than waiting for the full response. Time-to-first-token drops from "full generation time" to "time to generate one token" — often 200–600ms instead of 3–8s. For any user-facing feature with responses longer than a sentence, streaming dramatically improves perceived performance without changing actual generation speed. Implement it by default for interactive use cases.

**P50 latency ≠ P99 latency.** LLM latency has heavy tails. A feature with a P50 of 800ms may have a P99 of 8–12s due to load spikes, long outputs, or provider slowdowns. Optimize for P95/P99 for user-facing features. Set timeouts and have fallback behavior — a slow response without a timeout becomes a hung request.

### Caching: The Underused Cost Lever

Many LLM requests are identical or structurally repetitive. Caching can dramatically reduce costs and latency.

**Exact caching:** Store the full response for a given input hash. Return it on identical requests. Effective for high-repetition tasks — FAQ answering, templated reports, classification on recurring inputs. Simple to implement, high-value where applicable.

**Native prompt caching (provider-side):** Anthropic, OpenAI, and Google all support this at the infrastructure level. When many requests share a long prefix (system prompt, static context, document), the provider caches the processed key-value state of that prefix and charges approximately 10% of the normal input token rate — roughly 90% off. The cache is maintained server-side; you don't manage it directly.

To maximize cache hits:
- Put stable content first: system prompt → static context → dynamic content → user message
- Keep the stable prefix identical across requests — even minor variations break the cache
- Long system prompts (1,000+ tokens) benefit most; short prompts see minimal savings

Prompt caching is the single highest-leverage cost optimization for most production workloads. If you have a system prompt longer than 500 tokens and you're not using prompt caching, you're overpaying.

**Semantic caching:** Cache responses for semantically similar queries using embedding lookup. More complex to implement, but captures more cache hits than exact matching. Best for user-facing search or Q&A where similar questions are asked repeatedly. Requires cache invalidation logic when underlying data changes.

**Measure your cache hit rate.** A well-tuned caching layer can cut costs 40–80% on appropriate workloads. If you're not tracking it, you're leaving money on the table.

### Batch Processing: The Overlooked 50% Discount

All major providers (Anthropic, OpenAI, Google) offer batch APIs that process requests asynchronously with a ~24-hour turnaround at roughly 50% of synchronous pricing. This is a significant discount that many teams don't use because they default to synchronous calls everywhere.

Use batch APIs for:
- Document processing pipelines
- Nightly evaluation runs
- Generating embeddings at scale
- Background summarization, classification, or extraction
- Any task where the user isn't waiting for the result

The operational pattern: submit a batch job, store the job ID, poll or webhook for completion, retrieve results. More complex than a synchronous call, but the cost reduction at scale is substantial. At 1M requests/month, 50% off is a real budget line.

### Model Routing

Not every task needs your best model. Different tasks have different quality requirements, and routing intelligently can cut costs 50–80% with minimal quality impact on the tasks that don't need frontier capability.

**Common routing patterns:**

**Task-based routing:** Classify the request type before calling a model, then route to the appropriate tier. Complex reasoning, multi-step tasks, and high-stakes outputs go to frontier models. Simple classification, extraction, and templated generation go to smaller, cheaper models. A typical distribution might route 70% of traffic to a budget model and reserve 10–20% for premium models on the hardest tasks. This requires maintaining a routing layer and prompt variants per model tier — real engineering cost.

**Confidence-based (cascade):** Start with a cheap model. If the output passes a quality threshold (confidence score, self-consistency check, or a lightweight evaluator), return it. If not, escalate to a better model. Most requests are caught cheaply; the difficult ones escalate. Requires defining what "good enough" means per task — non-trivial.

**Latency-based:** Use faster models for real-time user-facing features; use slower, more capable models for background processing where latency doesn't matter.

**Error fallback:** If a primary provider is slow or unavailable, fall back to a secondary. This is less about cost and more about reliability — but routing infrastructure handles both.

**Implementation note:** Routing adds complexity. Maintain two prompt variants per model tier. Monitor quality drift as models update. The engineering cost is real and must be justified by volume. Start routing only when you have production data showing which tasks are consistently over-served by expensive models. Premature routing optimization is a common mistake.

### Self-Hosted vs. API: The Build/Buy Calculus

At sufficient scale, self-hosting open-weight models (Llama, Mistral, Qwen, DeepSeek) can cost significantly less than API pricing. The math:

- H100 GPU rental costs roughly $2–4/hour on specialized cloud providers, $3.50–7/hour on hyperscalers
- A 70B model on 2 H100s can serve ~20–50 requests/minute
- At high utilization, this can be 5–10x cheaper per token than mid-tier API pricing

The competitive context has shifted: open-weight models have closed the quality gap substantially. DeepSeek V3 and similar models now approach frontier quality on many tasks at a fraction of the API cost — meaning "self-host or API" is no longer a pure quality-vs-cost trade-off but a genuine architectural choice for many use cases.

The catches:
- Quality ceiling: Open models can still trail frontier models on complex reasoning and instruction-following edge cases
- Operational burden: You own uptime, scaling, model updates, and security
- Capital commitment: Reserved instances and dedicated hardware require upfront commitment
- Hidden costs: Engineering time for deployment, monitoring, and maintenance; egress fees when moving data between regions

Self-hosting makes sense when: volume is high (millions of requests/day), tasks are well-defined and don't require frontier capability, and you have ML infrastructure expertise. It doesn't make sense for: early-stage products, tasks requiring frontier reasoning, or teams without dedicated ML infrastructure.

A common middle path: API for development and low-volume production, self-hosted for high-volume workloads where the task is proven and requirements are stable.

### Scaling Realities

**What breaks first:**

Rate limits arrive before you expect them. Most providers impose both requests-per-minute and tokens-per-minute limits. At scale, tokens-per-minute is usually the binding constraint — large context windows and high output verbosity exhaust it faster than request count. Model these into capacity planning and implement exponential backoff with jitter. A thundering herd of retries makes rate limit problems worse.

Monitoring infrastructure that works at 1,000 requests/day needs redesign at 1 million. Logging every prompt and response at scale is expensive. Define what you actually need to log for debugging and evaluation, versus what can be sampled. A 1% sample of production traffic is often sufficient for quality monitoring; full logging is usually only needed during incidents.

Context-heavy workloads hit memory limits on self-hosted infrastructure before throughput limits. 128K+ context windows with large batches require more GPU memory than many deployments plan for.

**Infrastructure patterns that matter at scale:**

- **Async over sync:** Move any LLM call that isn't user-blocking to a queue. This decouples user experience from LLM latency spikes, smooths load, and enables retries without affecting UX.
- **Provider redundancy:** Single-provider dependency is a reliability risk. The major providers have outages. Multi-provider fallback — even just "if provider A fails, route to provider B" — meaningfully improves uptime for critical features.
- **Cost attribution:** Tag every LLM call with the feature and user segment that generated it. Without this, cost growth is invisible until it's a crisis. You can't optimize what you can't attribute.

### What Changes as Models Improve

Model prices have dropped roughly 10x every two to three years since frontier models became available via API, and competition has accelerated. Prices fell approximately 80% across the industry between early 2025 and early 2026 alone. This has real implications for decisions you make today:

- Cost optimizations that feel essential now may be irrelevant in 12–18 months as prices fall
- Architecture decisions that lock you to a specific provider or model version carry risk
- A task that requires a frontier model today may be adequately served by a budget model in a year
- Models your team hasn't evaluated recently — particularly open-weight options — may now be viable where they weren't before

This doesn't mean ignoring costs — it means building cost measurement infrastructure that persists even as specific optimizations change. The infrastructure for measuring cost per feature, cache hit rate, and model utilization will remain useful indefinitely. The specific thresholds and routing rules will need revisiting as the landscape shifts.

Build against abstractions (LiteLLM, a thin provider wrapper, or an internal model gateway) rather than directly against provider APIs. Switching models or providers should be a config change, not a refactor.`,
  quiz: [
    {
      question: "Your AI feature uses a 500-token system prompt and handles 100,000 requests per day. Why is prompt caching the highest-leverage cost optimization available?",
      options: [
        "Prompt caching shifts system prompt processing to off-peak hours, reducing provider congestion fees",
        "The system prompt is paid for on every single request; caching it at the provider level reduces those tokens to roughly 10% of their normal cost",
        "Prompt caching compresses the token representation, reducing effective token count by 30–50% per request",
      ],
      correct: 1,
      explanation: "System prompt tokens are charged on every request — at 100,000 requests/day with a 500-token system prompt, that's 50 million tokens of prompt cost per day. Provider-side prompt caching charges approximately 10% of the normal rate for cache hits (roughly 90% off). The stable content must be positioned first and kept identical across requests to maintain cache hits.",
    },
    {
      question: "A team's AI feature has a P50 latency of 900ms but users frequently complain the feature 'hangs'. What metric are they failing to monitor?",
      options: [
        "Token throughput — the feature is hitting tokens-per-minute limits, causing silent queuing",
        "P99 latency — LLM latency has heavy tails, so a small fraction of users experience extreme wait times that median metrics hide",
        "Cache hit rate — uncached requests are taking significantly longer and need to be identified",
      ],
      correct: 1,
      explanation: "LLM latency distributions have heavy tails. A P50 of 900ms is compatible with a P99 of 10–15 seconds. Users who hit that tail describe the feature as broken or hung. For user-facing features, set explicit P95/P99 thresholds, add streaming to improve perceived responsiveness, and implement timeouts with fallback behavior.",
    },
  ],
}