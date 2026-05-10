export const fineTuningModelCustomization = {
  slug: "fine-tuning-model-customization",
  title: "Fine-tuning & Model Customization",
  summary:
    "When prompting and RAG aren't enough — what fine-tuning actually does, the full customization spectrum, data requirements, and the decision framework for choosing your approach.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["EM", "IC"] as const,
  tags: ["fine-tuning", "customization", "models", "architecture"],
  order: 12,
  content: `## Fine-tuning & Model Customization

Three primary levers exist for making a model behave the way your product needs: better prompting, retrieval-augmented generation, and fine-tuning. Teams often jump to fine-tuning before exhausting the first two. This is almost always a mistake — fine-tuning is expensive, slow to iterate, and introduces failure modes that don't exist in prompting-based approaches.

### The Customization Spectrum

**Prompting**
Change what you say to the model. Includes system prompts, few-shot examples, chain-of-thought instructions, output format specifications, and role assignments.

- Cost: near zero
- Latency: no added latency
- Iteration speed: instant
- Persistent: no — applied per request
- Best for: behavior shaping, style, format, task framing, most behavioral requirements

**Retrieval-Augmented Generation (RAG)**
Keep knowledge external. Retrieve relevant documents at query time and inject them into context.

- Cost: retrieval infrastructure + embedding storage
- Latency: adds retrieval step (~50–200ms)
- Iteration speed: update knowledge without retraining
- Persistent: knowledge updates persist; model doesn't change
- Best for: grounding responses in specific documents, current information, reducing hallucination on factual queries, large proprietary knowledge bases

**Instruction Fine-tuning**
Update model weights by training on (instruction, response) pairs. Teaches the model to behave in specific ways without relying on in-context examples.

- Cost: compute for training runs + evaluation + ongoing maintenance
- Latency: same as base model at inference
- Iteration speed: slow — training runs take hours to days; evaluation takes additional time
- Persistent: behavior baked into weights
- Best for: consistent format and style at scale, reducing prompt length, specialized domains, smaller model capability elevation

**Continued Pretraining**
Train on large volumes of domain text (not instruction pairs) to extend the model's base knowledge before instruction tuning.

- Cost: high — requires significant compute and large data volumes
- Best for: highly specialized domains with extensive text corpora (legal, medical, scientific, financial) where base model knowledge is genuinely sparse
- Not appropriate for: most product teams; requires dedicated ML infrastructure and domain expertise to execute correctly

**Preference Tuning (RLHF / DPO)**
Train the model to prefer certain responses over others using human preference labels (RLHF) or directly from preference pairs (DPO — Direct Preference Optimization). DPO has become the practical standard as it's more stable and cheaper than full RLHF.

- Cost: requires preference-labeled data; DPO training similar cost to instruction tuning
- Best for: aligning model behavior with nuanced human preferences that are hard to specify as instructions; reducing specific undesirable behaviors; improving output quality when "better" is easier to label than to specify
- Prerequisite: a well-instruction-tuned model first; preference tuning refines, it doesn't replace

**Parameter-Efficient Fine-tuning: LoRA and QLoRA**
Rather than updating all model weights, LoRA (Low-Rank Adaptation) trains a small set of additional parameters while keeping the base model frozen. QLoRA adds quantization to reduce memory requirements further.

- Cost: significantly lower compute and memory than full fine-tuning — a 7B model fine-tune that requires 4 A100s with full fine-tuning may run on a single consumer GPU with QLoRA
- Quality: competitive with full fine-tuning on most tasks; marginal difference on highly specialized tasks
- Practical default: LoRA/QLoRA is the right starting point for almost all fine-tuning work. Full fine-tuning is rarely justified for product teams.
- Multiple LoRA adapters can be trained for different tasks and swapped at inference time on the same base model — a useful architecture for multi-task systems

### When Fine-tuning Is Actually Warranted

**Prompt length is a real cost problem.** If you're injecting 2,000+ tokens of few-shot examples into every call because the model needs that much context to behave correctly, fine-tuning those behaviors into weights reduces prompt length and inference cost significantly. Calculate the break-even point: fine-tuning cost ÷ (cost savings per request × requests per month).

**You need extremely consistent output format at scale.** Prompting and structured output enforcement get you 90–95% reliability. For the last 5%, fine-tuning closes the gap. Only pursue this if format failures have real downstream consequences and you've already tried native JSON mode and schema enforcement.

**A smaller model needs to match a larger one on a specific task.** Fine-tuning a 7B or 13B model to match a frontier model on a narrow, well-defined task is a legitimate cost and latency optimization. This requires rigorous evaluation to confirm the fine-tuned small model actually matches the frontier model's quality on your task.

**Highly specialized domain with genuinely sparse base model knowledge.** Legal subfields, niche technical domains, proprietary terminology and reasoning patterns. Validate this assumption first — base models often know more about specialized domains than teams expect. Test before training.

**Consistent style or voice that prompt engineering cannot reliably produce.** If your product has a specific output style that few-shot examples inconsistently achieve and the inconsistency creates product problems, fine-tuning can stabilize it.

### When Fine-tuning Is Not the Answer

**You haven't tried prompting seriously.** A well-structured system prompt with 5–10 high-quality few-shot examples solves the majority of behavior problems that teams assume require fine-tuning. The examples must be representative of the full input distribution, not just the easy cases.

**Your knowledge changes frequently.** Fine-tuning bakes knowledge into weights at a point in time. Updating that knowledge requires a new training run. RAG lets you update knowledge without retraining. If your product needs current information, RAG is almost always better — and often faster to build.

**You have insufficient high-quality training data.** Fewer than 200–500 well-labeled examples for behavioral fine-tuning typically produces marginal improvement. Domain knowledge fine-tuning requires thousands of examples. If you don't have the data, you don't have the inputs for fine-tuning — and fabricating or scraping low-quality data produces a worse model.

**You're trying to fix hallucination.** Fine-tuning does not reliably reduce hallucination on factual queries. It can make the model more confidently wrong. RAG with grounded retrieval is the correct approach for hallucination reduction on factual content.

**Your team lacks ML infrastructure expertise.** Fine-tuning requires GPU provisioning, training pipeline construction, evaluation infrastructure, and model serving — not just engineering competence generally. Underestimating this adds months to timelines. Be honest about what your team can actually execute.

**You're trying to add safety constraints.** Fine-tuning on safety examples can degrade safety in unpredictable ways. Use prompt-based guardrails and output classifiers for safety enforcement — not fine-tuning.

### What Fine-tuning Can Make Worse

Teams focus on what fine-tuning improves. The failure modes deserve equal attention.

**Catastrophic forgetting.** Training on a narrow task can degrade performance on tasks the base model previously handled well. A model fine-tuned on customer service transcripts may become worse at general reasoning, code generation, or other tasks it needs to handle. Always eval on your full task distribution after fine-tuning — not just the fine-tuned task.

**Reduced capability generalization.** A fine-tuned model may become brittle — performing well on inputs similar to training data and poorly on inputs that differ. The base model's generalization is one of its most valuable properties; fine-tuning can degrade it.

**Safety degradation.** Fine-tuning can inadvertently reduce a model's adherence to safety guidelines, even when the training data is benign. This is documented and not fully understood. Evaluate safety-relevant behaviors explicitly after fine-tuning.

**Negative transfer.** If your training data is noisy, biased, or doesn't represent your actual production distribution, fine-tuning can make the model worse on production inputs while appearing better on training inputs. Data quality directly determines fine-tuning outcome.

**Overconfidence.** Fine-tuned models can become more confident in their outputs without becoming more accurate — particularly on domain-specific claims. Monitor confidence calibration after fine-tuning.

### Data Requirements

Fine-tuning quality is bounded by training data quality, not quantity. Quantity matters only after quality is established.

**Data types by fine-tuning goal:**

- **Behavioral / style fine-tuning:** 200–1,000 high-quality (instruction, response) pairs. Each response must represent the exact behavior you want.
- **Format fine-tuning:** 500–2,000 examples covering the full range of input variation your production system will see. Format fine-tuning is sensitive to gaps in training distribution.
- **Domain knowledge (instruction tuning on domain content):** 1,000–10,000+ examples. More is better; quality requirements remain high.
- **Continued pretraining:** Tens of thousands to millions of tokens of domain text.

**Data collection strategies:**

- **Human-written examples:** Highest quality; expensive to produce at scale. Use for seed data and quality calibration.
- **Curated production outputs:** Take real production inputs, generate outputs with your best current model or human experts, review and filter. Efficient and representative.
- **Synthetic generation with review:** Use a frontier model to generate (instruction, response) pairs, then human-review a significant sample. Scalable; requires careful quality control to avoid propagating model errors.

**Annotation quality control:**
Use multiple annotators for the same examples and measure inter-annotator agreement. Low agreement indicates ambiguous instructions or subjective quality criteria — resolve this before training. A training set where annotators disagree 30% of the time produces a model that behaves inconsistently 30% of the time.

**Train/validation/test splits:**
Hold out a test set that never influences training decisions — not just a validation set. The validation set is used for hyperparameter tuning and early stopping; the test set is reserved for final evaluation only. Contaminating your test set with training examples produces inflated scores that don't predict production performance.

**Production distribution matching:**
Your training data must represent the full distribution of inputs your production system will receive — including edge cases, off-topic requests, short inputs, long inputs, and multilingual inputs if applicable. A model trained on polished, well-formed examples underperforms on real user inputs, which are messier.

### Evaluating Fine-tuned Models

Training a fine-tuned model without a rigorous evaluation plan is building blind. Define your evaluation before training.

**Targeted evaluation:** Does the fine-tune improve performance on the specific task you trained for? Run your golden dataset eval comparing the fine-tuned model to the base model and the prompted base model on the target task.

**Regression evaluation:** Does the fine-tune degrade performance on tasks you need to preserve? Run your full eval suite — not just the fine-tuned task. Pay specific attention to general capability tasks (reasoning, instruction following, format adherence on other tasks).

**Safety evaluation:** Does the fine-tune affect safety-relevant behaviors? Test with adversarial inputs designed to elicit policy violations. Compare refusal rates and content policy adherence between base and fine-tuned model.

**Production distribution evaluation:** Test on a sample of real production inputs, including inputs that don't look like your training examples. Fine-tunes that perform well on training-like inputs and poorly on distribution shift are common.

**A/B evaluation against baseline:** Before routing production traffic to a fine-tuned model, run it in shadow mode against your current production model. Compare quality metrics on real traffic rather than only on your curated eval set.

### Infrastructure and Cost

**Managed fine-tuning APIs:**
OpenAI, Google (Vertex AI), and Anthropic offer fine-tuning APIs for their models. You provide the data; they run the training. Advantages: no GPU management, simple integration, models served on their infrastructure. Disadvantages: limited control over training process, fine-tunes are tied to that provider's base model, costs can be significant at scale.

Current provider fine-tuning support (verify current state — this changes):
- **OpenAI:** GPT-4o mini and GPT-3.5-Turbo fine-tuning available. Per-token training cost + higher inference cost for fine-tuned models.
- **Google Vertex AI:** Gemini fine-tuning available. Regional deployment options.
- **Anthropic:** Fine-tuning not currently available via standard API; available through enterprise agreements for specific use cases.

**Self-managed fine-tuning:**
Use open-weight models (Llama, Mistral, Qwen) with tools like Hugging Face TRL, Axolotl, or LLaMA-Factory. Full control over training process, data, and deployment. Requires GPU access and ML infrastructure expertise.

**Compute requirements (approximate):**
- **7B model, QLoRA, single GPU:** A100 40GB or similar; 4–12 hours for 1,000–5,000 examples
- **13B model, QLoRA:** 2× A100s or single A100 80GB; 8–24 hours
- **70B model, QLoRA:** 4–8× A100s; 24–72 hours
- **Full fine-tuning (any size):** 2–4× compute of equivalent QLoRA; rarely justified

Cloud GPU costs: A100 40GB ~$2–3/hour on spot instances. Run the numbers before committing: training cost + evaluation time + iteration cycles.

**The iteration tax:** Fine-tuning is slow to iterate. A typical improvement cycle — collect data, train, evaluate, identify gaps, collect more data, retrain — takes days to weeks. Budget for multiple cycles before you have a production-ready model. Teams that plan for one training run are consistently surprised.

### The Operational Cost

Fine-tuning is not a one-time event. The ongoing costs are frequently underestimated.

**Training runs recur.** Every time you add examples, update behavior, or fix a regression, you run another training cycle. Budget for this ongoing compute and engineering time — not just the initial run.

**Evaluation before every deployment.** Every new model version requires running your full eval suite before routing production traffic. Without this, you're deploying blind.

**Model versioning and traffic management.** You'll have multiple fine-tuned model versions in existence simultaneously: current production, previous production (for rollback), and candidates in evaluation. Routing between them requires infrastructure.

**Base model updates create retraining requirements.** When your provider updates the base model you fine-tuned on, your fine-tune may need to be redone — the new base model may behave differently enough that your fine-tune produces unexpected results. Check provider policies on fine-tune portability before committing to a base model.

**Capability regression monitoring.** The fine-tuned model's production performance needs ongoing monitoring, not just pre-deployment evaluation. Distribution shift and model drift can emerge over time.

### The Decision Framework

Work through these in order. Move to the next step only when the previous is genuinely exhausted.

1. **Can better prompting achieve this?** A system prompt with 5–10 high-quality few-shot examples, chain-of-thought instructions, and explicit format requirements. Most teams stop here.

2. **Is this a knowledge gap?** Does the model lack information, or does it behave incorrectly on information it has? Knowledge gaps → RAG. Behavior gaps → continue.

3. **Have you tried structured outputs and function calling?** For format consistency problems, native JSON mode and schema enforcement solve most cases without fine-tuning.

4. **Do you have the data?** 500+ high-quality, representative, reviewed examples for behavioral fine-tuning. If not, build the data pipeline first — fine-tuning without adequate data wastes compute.

5. **Does your team have the capability?** Honest assessment: GPU infrastructure, training pipeline, evaluation framework, model serving, ongoing maintenance. If no, managed fine-tuning API or a vendor partner.

6. **Is the economics justified?** Model the break-even: fine-tuning cost + ongoing maintenance ÷ cost savings or quality improvement value per month. Fine-tuning that costs $50K/year to maintain to save $5K/year in API costs is not justified.

7. **Have you evaluated the risks?** Catastrophic forgetting on adjacent tasks, safety degradation, reduced generalization. Define your regression eval plan before training.

If you reach step 7 and the answer to all previous questions supports proceeding: fine-tune using LoRA/QLoRA as the default method, with full fine-tuning only if you have clear evidence LoRA is insufficient for your use case.`,
  quiz: [
    {
      question: "A team wants to reduce hallucinations in their AI feature's answers about their product catalog. They are debating fine-tuning vs. RAG. Which should they try first, and why?",
      options: [
        "Fine-tuning, because it bakes product knowledge into weights, making retrieval unnecessary",
        "RAG, because fine-tuning does not reliably reduce hallucination on factual queries and can make the model more confidently wrong",
        "Fine-tuning with LoRA, because it is parameter-efficient and does not risk catastrophic forgetting",
      ],
      correct: 1,
      explanation: "Fine-tuning is unreliable for injecting factual knowledge and can actually make models more confidently wrong about facts. RAG grounds the model's responses in retrieved documents at query time, directly addressing the hallucination problem. If the problem is a knowledge gap, use RAG — fine-tuning is for behavior gaps, not knowledge gaps.",
    },
    {
      question: "After fine-tuning their customer service model, a team notices it now refuses to perform multi-step reasoning tasks it previously handled well. What happened?",
      options: [
        "The fine-tuned model was deployed without prompt caching, causing context truncation on complex queries",
        "Catastrophic forgetting — training on a narrow task degraded performance on general capabilities the base model previously handled well",
        "The LoRA adapter weights are incompatible with the reasoning task's attention pattern requirements",
      ],
      correct: 1,
      explanation: "Catastrophic forgetting occurs when fine-tuning on a narrow task degrades performance on other tasks the base model previously handled well. A model fine-tuned on customer service transcripts may lose general reasoning capability. Always run regression tests on the full task distribution — not just the fine-tuned task — after fine-tuning.",
    },
  ],
}