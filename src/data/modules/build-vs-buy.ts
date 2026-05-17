export const buildVsBuy = {
  slug: "build-vs-buy",
  title: "Build vs. Buy: AI Edition",
  summary:
    "When to use an API, when to self-host, when to fine-tune, and how to avoid lock-in — a practical decision framework for the full AI solution spectrum.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["strategy", "architecture", "decision-making"],
  order: 7,
  content: `## Build vs. Buy: AI Edition

The AI vendor landscape is noisy and the decisions compound. A choice that's cheap to make today — calling a specific API directly, fine-tuning a specific model — can be expensive to reverse at scale. This framework is designed to slow you down enough to make the right call the first time.

### The Solution Spectrum

Before evaluating vendors, understand the full range of options. Teams often jump to fine-tuning when prompt engineering would suffice, or to self-hosting when an API would be faster and cheaper. The spectrum from lowest to highest build investment:

1. **Prompt engineering on a third-party API** — instruct the model to behave differently through the prompt
2. **RAG (retrieval-augmented generation)** — give the model access to your data at inference time
3. **Third-party API with model selection** — choose which model fits your quality/cost/latency requirements
4. **Orchestration layer** — add a framework to manage multi-step flows, routing, and tool use
5. **Fine-tuning a base model** — modify model weights for your specific task
6. **Self-hosting open-weight models** — run inference on your own infrastructure
7. **Training from scratch** — only relevant for organizations with massive data advantages and specialized requirements

Most product teams should start at level 1 or 2 and move right only when there's clear evidence the current level is insufficient. The common mistake is starting at level 5 because it feels more "serious."

### The Four Decision Axes

Before evaluating any option, answer these questions honestly:

**1. Data sensitivity**
What data will flow through this system? PII, financial data, health data, trade secrets, privileged communications — each has different regulatory and contractual implications. The question isn't just "is this sensitive?" but "what are the consequences if this data is exposed or used in model training?"

Hard constraints: HIPAA, SOC 2, FedRAMP, GDPR, and industry-specific regulations may mandate self-hosting or specific contractual arrangements regardless of preference. Identify hard constraints before evaluating options.

**2. Differentiation**
Is this capability core to what your product does better than alternatives, or is it a commodity feature? A general-purpose chatbot embedded in your product is not differentiated — use the best commodity API. A model that understands your proprietary domain, your users' specific workflows, or your unique data is potentially differentiated — worth investing in building.

Be honest about this. Most features that feel differentiating aren't. The test: if a competitor used the same API you're using, would they have an equivalent capability? If yes, the API is fine.

**3. Volume and cost trajectory**
Model the cost at current volume, at 10x, and at 100x. Some architectures are cheap at low volume and prohibitive at scale; others have high fixed costs that amortize well at scale. Run the numbers before committing.

For APIs: (tokens per request × price per token × requests per day × 30). Don't forget input tokens from system prompts and context — they multiply across every request.

For self-hosting: GPU cost per hour × utilization + engineering time for operations + ongoing maintenance. At low volume, self-hosting almost never wins on cost. The crossover point varies but is typically in the millions of requests per month range.

**4. Team capability**
Self-hosting and fine-tuning require ML infrastructure expertise. Not just "we have engineers" — specifically: experience with GPU provisioning, model serving frameworks, distributed inference, and model evaluation. Underestimating this leads to self-hosting projects that take 3x as long and produce worse results than the API they replaced.

### Option 1: Third-Party API

The right default for most teams. You get immediate access to frontier model capability, zero infrastructure overhead, and fast iteration.

**Best for:** Prototyping and validation, non-core features, teams without ML infrastructure expertise, use cases where frontier model quality matters more than cost optimization.

**Model selection within the API tier:**
Choosing between providers and models is its own decision. Relevant criteria:

- **Quality on your task:** General benchmarks don't predict task-specific performance. Evaluate on your actual inputs before committing.
- **Latency requirements:** Frontier models vary significantly in response time. If you need <1s to first token for a user-facing feature, test this explicitly.
- **Context window:** Relevant if you're passing long documents or extended conversation history.
- **Cost:** Frontier models vary 10–50x in price. Mid-tier models are often sufficient for many tasks at a fraction of the cost.
- **Rate limits:** Most providers impose tokens-per-minute and requests-per-minute limits. Model these into your capacity planning.
- **Stability and deprecation history:** How much notice does the provider give for model deprecations? GPT-3.5, Claude 2, and other models have been deprecated with varying lead times.

**What to watch:**
- Prompts and completions sent to vendor servers — understand the data processing terms before sending sensitive data
- Vendor lock-in through proprietary features (function calling schemas, specific system prompt behaviors, tool use APIs that differ between providers)
- Model updates that silently change behavior — pin to specific model versions in production

**Data processing:** Before sending any data to a third-party API, obtain and sign a Data Processing Agreement (DPA). Verify explicitly whether your prompts and completions are used for model training — most enterprise tiers exclude this, most free tiers don't. Don't assume.

### Option 2: RAG Before Fine-Tuning

Retrieval-augmented generation is frequently the right answer to problems teams assume require fine-tuning. If your problem is "the model doesn't know about our products/policies/data," RAG solves this without modifying model weights.

**RAG solves:**
- Knowledge that wasn't in training data (your internal documents, proprietary data, recent information)
- Need to cite sources for answers
- Keeping knowledge up to date without retraining

**RAG doesn't solve:**
- Output format requirements (the model needs to respond in a specific structure)
- Tone and style that differs significantly from base model behavior
- Tasks requiring specialized reasoning the base model can't perform

**Before pursuing fine-tuning, ask:** Can I solve this by retrieving the right information and including it in the prompt? If yes, RAG is faster, cheaper, and more maintainable.

### Option 3: Fine-Tuning

Fine-tuning modifies model weights to change behavior. It's frequently overreached for and frequently misunderstood.

**Fine-tuning is appropriate when:**
- You have specific output format requirements that prompt engineering reliably fails to produce
- You have domain-specific terminology or reasoning patterns that the base model handles poorly and RAG doesn't address
- You've run rigorous evals proving that prompting + RAG is insufficient
- You have 1,000+ high-quality labeled examples (more is better; quality matters more than quantity)

**Fine-tuning is not appropriate when:**
- You haven't exhausted prompt engineering and RAG
- You're trying to add new factual knowledge (use RAG instead — fine-tuning is unreliable for injecting facts)
- You have fewer than a few hundred high-quality examples
- You need the result quickly — fine-tuning pipelines take weeks to build and maintain

**Fine-tuning approaches:**

**Prompt-based fine-tuning (instruction tuning):** Train on (instruction, output) pairs to change how the model responds to prompts. Most common approach for format and style adaptation.

**LoRA / QLoRA:** Low-rank adaptation techniques that train a small number of additional parameters rather than updating all weights. Dramatically reduces compute and memory requirements. QLoRA adds quantization for further reduction. The practical default for most fine-tuning use cases — full fine-tuning is rarely worth the additional cost.

**Continued pretraining:** Train on large amounts of domain text to improve the model's domain knowledge before instruction tuning. Relevant for highly specialized domains with large text corpora (legal, medical, scientific). High cost and complexity; only warranted for extreme domain specialization.

**Critical risk — catastrophic forgetting:** Fine-tuning on a narrow task can degrade performance on general tasks the base model handled well. Always eval on your general use cases after fine-tuning, not just the target task.

**The fine-tuning pipeline cost:** Building and maintaining a fine-tuning pipeline — data collection, cleaning, training runs, evaluation, deployment, version management — is significant ongoing engineering investment. Budget for this before committing.

### Option 4: Self-Hosting Open-Weight Models

Running inference on your own infrastructure gives you data control and, at high volume, potential cost savings. It also gives you operational responsibility for uptime, scaling, and model management.

**Best for:** Applications with hard data residency or compliance requirements, high-volume stable workloads where economics justify infrastructure investment, teams with dedicated ML infrastructure capability.

**Model options by use case:**
- **Llama 3 (Meta):** Strong general-purpose capability, well-documented, large community
- **Mistral / Mixtral:** Strong performance-per-parameter, good for resource-constrained deployments
- **Qwen / DeepSeek:** Strong multilingual performance and coding capability
- **Gemma (Google):** Lightweight, well-documented, good for constrained environments

**Serving infrastructure:**
- **Local inference servers:** Simplest local deployment; not production-grade for high throughput
- **vLLM:** Production-grade, PagedAttention for efficient memory management, good throughput
- **TGI (Hugging Face):** Flexible, well-maintained, broad model support
- **TensorRT-LLM (NVIDIA):** Highest throughput on NVIDIA hardware; higher operational complexity

**Total cost of ownership calculation:**
GPU cost alone understates the real cost. Include: GPU instance cost, engineering time for deployment and maintenance, monitoring infrastructure, model update management, redundancy for uptime requirements, and the opportunity cost of engineering time not spent on product. Self-hosting rarely wins on total cost below a few million requests per month — run the numbers honestly.

**Quantization tradeoffs:** Running models at lower precision (int8, int4) reduces memory requirements and improves throughput at a small quality cost. For many tasks, 4-bit quantization is acceptable. For tasks requiring high accuracy, test quantized vs. full-precision on your eval set before committing.

**The capability gap is real but closing:** Open-weight models consistently trail frontier models on complex reasoning tasks. This gap matters for some use cases and doesn't for others. Run evals on your specific task before assuming capability is sufficient.

### Option 5: Orchestration Frameworks

Whether to use an orchestration framework (LangChain, LlamaIndex, LiteLLM) or call APIs directly is a separate build/buy question that teams often don't treat explicitly.

**Use a framework when:**
- You're building multi-step agent workflows
- You need routing across multiple models or providers
- You want prebuilt RAG pipeline components
- You want provider abstraction to enable model switching

**Call APIs directly when:**
- Your use case is simple (single-call, no routing, one provider)
- You need full control over request construction and response handling
- Framework abstractions add complexity without value
- You've found framework-specific bugs or limitations that affect your use case

**LiteLLM specifically:** If you call multiple providers or want to enable model switching without code changes, LiteLLM provides a unified interface across providers. It's a narrow, well-scoped tool — prefer it over heavier frameworks for simple multi-provider routing.

**The framework lock-in risk:** Heavy use of framework-specific abstractions creates its own lock-in. LangChain's chain abstractions, LlamaIndex's specific index types — these can be harder to move away from than the model API itself. Prefer thin wrappers and framework components that have clean interfaces.

### Avoiding Vendor Lock-In

Lock-in is real but often overweighted as a concern relative to the practical cost of switching. Understand what actually creates lock-in:

**What creates hard lock-in:**
- Proprietary function calling schemas that differ between providers
- Fine-tuned models trained on one provider's base model
- Provider-specific prompt formats (system/user/assistant structures vary)
- Data stored in provider-specific formats

**What creates soft lock-in (easier to reverse):**
- Prompt engineering tuned to a specific model's behavior
- Reliance on a specific model's context window size
- Cost structures built around current pricing

**Practical mitigation:**
Build against an abstraction layer — a thin internal wrapper or LiteLLM — so switching providers requires a config change, not a refactor. Keep prompts in version-controlled files separate from application code. Don't over-invest in provider-specific features for core functionality.

Avoid treating lock-in avoidance as the primary architectural goal. The cost of over-engineering for flexibility often exceeds the cost of switching. Optimize for moving fast now; design the abstraction layer that makes switching feasible later.

### Running a Vendor or Model Evaluation

Don't select a model based on public benchmarks alone. Run your own evaluation:

1. **Collect 50–100 representative inputs** from your actual use case, including edge cases and known hard examples
2. **Define scoring criteria** — what does a good output look like? Write a rubric or use LLM-as-judge
3. **Run all candidate models** on the same inputs with equivalent prompts
4. **Score outputs** against your rubric, either manually or with LLM-as-judge validated against manual scoring
5. **Measure latency and cost** per request for each candidate on your actual input distribution
6. **Run adversarial inputs** — inputs designed to surface failures, edge cases, and safety issues
7. **Evaluate on subgroups** if your user population is heterogeneous — a model that scores well overall may perform poorly for specific user types

Document the evaluation, including methodology and dataset, so you can repeat it when models update or new options become available.

### The Hidden Costs

Every AI integration has costs that don't appear in the API invoice or GPU bill:

- **Eval infrastructure:** You need to know when model output quality degrades. Building and maintaining evals is ongoing engineering work.
- **Prompt versioning and management:** Prompt changes change behavior everywhere. You need version control, review, and regression testing for prompts.
- **Latency management:** P99 latency for LLM calls is high and variable. How do you handle timeouts? What's the fallback?
- **Model update management:** Providers update models. Behavior changes. You need a process for testing new model versions before they reach production users.
- **Compliance and legal:** DPAs, data residency requirements, audit logging, and regulatory compliance have real engineering and legal costs.
- **Error handling:** LLMs fail in ways that are hard to catch deterministically — truncated outputs, format violations, refusals, hallucinations. Each requires explicit handling.
- **Monitoring:** Cost monitoring, quality monitoring, latency monitoring — none of this comes for free.

Budget for these before committing to an architecture. The teams that get surprised are the ones who scoped "add AI" without scoping "operate AI."

### Red Flags in Vendor Evaluation

- No published eval benchmarks on tasks relevant to your use case, or benchmark methodology that doesn't match your use case
- Inability or unwillingness to provide a DPA before commercial discussion
- No clear answer to "what happens to prompts and completions?"
- No rate limit documentation or capacity planning guidance
- Pricing that lacks volume tiers or has no committed volume discounts above a threshold
- Inability to pin to a specific model version in production
- No notice period for model deprecations in the contract
- "Our model is best" claims without reproducible evidence or the ability to run your own evaluation

### A Decision Framework

Use this as a starting point, not a complete answer:

\`\`\`
Step 1: Are there hard compliance/data residency requirements?
  YES → Self-host. Evaluate open-weight models for task capability.
  NO → Continue to Step 2.

Step 2: Is this feature core to your product differentiation?
  NO → Use third-party API. Pick the best model for your quality/cost/latency requirements.
  YES → Continue to Step 3.

Step 3: Can RAG + prompt engineering solve the problem?
  YES → Use third-party API with RAG. Revisit if performance is insufficient.
  NO → Continue to Step 4.

Step 4: Do you have the data and capability for fine-tuning?
  NO → Use third-party API; invest in better prompting and RAG.
  YES → Fine-tune on top of a base model (via API or self-hosted).

Step 5: At what volume does self-hosting become cost-competitive?
  → Model TCO at current and projected volume. Plan the migration before you need it.
\`\`\`

The framework is a starting point. The real answer requires running the numbers, running evals, and being honest about your team's actual capabilities — not the capabilities you hope to have.`,
  quiz: [
    {
      question: "A team wants to improve their AI feature's knowledge of internal company policies. Which approach should they try first?",
      options: [
        "Fine-tune the base model on internal policy documents",
        "Use RAG to retrieve relevant policy chunks at query time",
        "Train a model from scratch on company data",
      ],
      correct: 1,
      explanation: "RAG solves the exact problem of giving a model access to knowledge it wasn't trained on. Fine-tuning is slower, more expensive, and unreliable for injecting factual knowledge. The build-vs-buy framework recommends exhausting lower-investment options (prompt engineering, then RAG) before moving to fine-tuning.",
    },
    {
      question: "What is the primary risk of vendor lock-in from using proprietary function calling schemas?",
      options: [
        "Proprietary schemas are slower than open standards, increasing latency",
        "Switching providers requires reworking integration code tied to the specific schema format, not just a config change",
        "Proprietary schemas violate GDPR data minimization requirements",
      ],
      correct: 1,
      explanation: "Hard lock-in comes from proprietary function calling schemas, prompt formats, and provider-specific APIs that differ between vendors. If your code is tightly coupled to one provider's schema, switching requires a refactor — not just a configuration change.",
    },
  ],
}