export const buildingReliableAiFeatures = {
  slug: "building-reliable-ai-features",
  title: "Building Reliable AI Features",
  summary:
    "Prompt testing, retries and fallbacks, circuit breakers, structured outputs, observability, and guardrails — the engineering discipline between a demo and a production AI feature.",
  difficulty: "ADVANCED" as const,
  roles: ["IC"] as const,
  tags: ["engineering", "reliability", "observability", "prompting"],
  order: 18,
  content: `## Building Reliable AI Features

Reliability in AI features is not an accident. The gap between "works in a demo" and "works reliably in production" is almost entirely explained by how much reliability engineering went into the feature. This module covers the specific practices that close that gap.

### Prompt Testing: Before You Ship

Prompts are the API contract of your AI feature. Test them like one.

**Minimum viable prompt test suite:**
- 20–30 representative inputs covering your core use cases
- Edge cases that caused failures during development
- Adversarial inputs designed to trigger known failure modes
- Boundary conditions: very short inputs, very long inputs, inputs with special characters, inputs in unexpected languages
- Inputs sampled from real users as soon as you have them — user inputs are messier, shorter, and more varied than any example you write yourself

Run this suite before every prompt change. If you don't have it, build it before your next change — not after.

**Testing non-deterministic outputs:**
LLMs are probabilistic. The same input can produce different outputs on different runs. This is the central challenge of prompt testing. Strategies:

- **Set temperature to 0 for tests** where you need deterministic output for regression purposes. This doesn't test production behavior (you may run at temperature > 0), but it does catch regressions where the prompt produces clearly wrong outputs consistently.
- **Run multiple samples at production temperature** and check that all samples pass your quality criteria. If the prompt passes 9/10 times, it will fail 10% of users. That's not passing.
- **Write property-based tests, not exact-match tests** where possible. "The output is valid JSON" is a better test than "the output is exactly this JSON string." "The output mentions the product name" is more robust than an exact string match. Reserve exact-match tests for highly constrained outputs like classification labels.
- **Test the distribution, not individual outputs.** For probabilistic features, run 20–50 samples and check that the pass rate meets your threshold — not that a single sample passes.

**Prompt unit tests vs. integration tests:**
Unit tests check a single prompt in isolation — given this input, does this prompt produce acceptable output? Integration tests check the full feature: does the end-to-end user workflow produce the right result? Both are necessary. Unit tests are fast and cheap; run them on every change. Integration tests are slower; run them before deployment.

**Regression testing after model updates:**
When your provider updates a model version, your prompts are being tested against a different model than the one they were written for. Treat provider model updates as you would a major dependency upgrade — run your full eval suite before pinning to the new version in production. If you're not pinning model versions, provider updates can silently change your behavior.

### Timeout Strategy

Timeouts are separate from retries and require their own design. LLM calls have high and variable latency — an undefended call can hang indefinitely.

**Set timeouts at multiple levels:**

- **Connection timeout:** How long to wait for the initial connection to the provider. Set to 5–10 seconds. A connection that takes longer than this is a provider infrastructure problem.
- **Request timeout:** How long to wait for the full response. Size this to your P99 latency from your observability data, with headroom — typically 30–60 seconds for non-streaming calls.
- **Streaming timeout:** For streaming responses, the initial response may arrive quickly but the stream may stall. Set a "time between tokens" timeout (typically 10–15 seconds) in addition to the overall request timeout.

**What to do on timeout:**
- Log the timeout with the prompt version, input hash, and elapsed time
- Retry once with exponential backoff if the operation is idempotent
- Fall back to the degraded mode if retries are exhausted (see Degraded Mode Design)
- Never silently hang — a timeout must produce a response to the user

**User-facing timeout UX:**
For synchronous user-facing calls, 10+ seconds without feedback is perceived as broken. If your P99 latency is over 5 seconds, either switch to streaming (which provides feedback faster) or add a progress indicator with a real timeout message if it takes longer than expected. "This is taking longer than usual" is better than silence.

### Retries and Fallbacks

LLMs fail. They time out, return malformed output, fail validation, and hit rate limits. Design for this from day one.

**Retry strategy by failure type:**

- **Transient network errors (timeouts, 5xx):** Retry with exponential backoff — not immediately. Start at 1 second, double each attempt, cap at 30 seconds. Add jitter (randomize ±20%) to prevent thundering herd when a provider recovers from an outage.
- **Rate limit errors (429):** Respect the Retry-After header if present. If not, exponential backoff starting at 5 seconds. Consider this a signal to implement request queuing.
- **Output validation failures:** Retry with a modified prompt that explicitly re-requests the required format. Add the failing output to the retry context: "Your previous response was not valid JSON. Please respond with valid JSON only." One retry; if the second attempt also fails, fall back.
- **Model refusals:** Don't retry the same input. Log it for review and fall back. Retrying a refusal won't produce a different result and wastes tokens.

Cap total retry attempts at three. Infinite retries on a stuck call are not a solution; they're a cost multiplier on a broken feature.

**Log every retry** with the failure type and retry count. A high retry rate on specific failure types is a signal: output validation failures → fragile prompt; rate limit errors → capacity planning problem; timeout errors → provider SLA issue or input size problem.

**Fallback strategy:**
What does the user see when the AI fails entirely? Design this explicitly before you ship — not as an afterthought when the first production outage happens.

- **Features that augment an existing workflow:** Fall back to the non-AI version. The user can still complete the task; it just takes longer. This is the most graceful fallback.
- **Features where AI is the primary path:** Fall back to a human-readable error with a specific path forward: "AI generation is temporarily unavailable. You can write this manually or try again in a few minutes." Not a generic error code.
- **Async features:** Queue the request and process it when the provider recovers. Notify the user when complete.

### Circuit Breakers

Retries without circuit breakers cause cascade failures. When a provider is degraded, retrying every request amplifies the load on both your system and the provider. A circuit breaker detects systemic failure and stops sending requests until the provider recovers.

**Circuit breaker states:**
- **Closed (normal):** Requests flow through. Track failure rate over a rolling window.
- **Open (tripped):** Failure rate exceeded the threshold. Stop sending requests immediately; return the fallback response without calling the provider.
- **Half-open (testing):** After a cooldown period (30–60 seconds), allow a small percentage of requests through. If they succeed, close the circuit. If they fail, reopen.

**Thresholds to configure:**
- Failure rate threshold to open: typically 50% over a 30-second window
- Minimum request count before tripping: don't trip on 2 failures out of 4 requests — require meaningful sample size
- Cooldown period before half-open: 30–60 seconds for transient failures

**Why this matters at scale:** A feature making 1,000 requests/minute to a degraded provider, each waiting 30 seconds for a timeout, creates a queue buildup that can cascade into your entire system. A circuit breaker limits this to at most a few seconds of failures before stopping the bleeding.

Implement circuit breakers per provider and per endpoint — a degraded completions API shouldn't trip the circuit for embeddings.

### Context Window Management

Exceeding the context window is a hard failure that's easy to prevent. Prompt inputs that grow unboundedly — conversation history, retrieved documents, tool call outputs — will eventually exceed any context limit.

**Count tokens before sending.** Use the provider's tokenizer (tiktoken for OpenAI models, provider-specific tokenizers for others) to count tokens before constructing the final prompt. If the count exceeds your limit, apply your truncation strategy before sending — not after receiving an error.

**Truncation strategies by input type:**

- **Conversation history:** Preserve the system prompt and the most recent N turns. Summarize or drop middle turns. Consider storing a running summary that replaces full history beyond a depth threshold.
- **Retrieved context (RAG):** Rank chunks by relevance score and include the top N that fit within your budget. Set a per-document token budget.
- **Tool outputs:** Truncate at a fixed limit. Add a note: "Output truncated at 2,000 tokens." Don't silently drop content without acknowledging it.
- **User inputs:** Reject inputs that exceed a limit with a user-visible message, rather than truncating silently. Users should know their input was cut off.

**Reserve a token budget for output.** If you're using the full context window for input, the model has no room to respond. Reserve at least 20–30% of the context window for output tokens, and set max_tokens explicitly.

### Structured Outputs

If your code consumes AI output programmatically, always use structured outputs.

**Why:** Eliminates parsing failures, makes testing and validation straightforward, narrows the surface area of prompt engineering, and makes output validation cheap.

**Implementation by provider support level:**

- **Native structured output (OpenAI JSON mode, Anthropic tool use, Gemini controlled generation):** The provider enforces the schema at generation time — the model cannot produce output that doesn't match. Use this when available; it's more reliable than prompt-based enforcement.
- **Tool/function calling for structured data:** Define your desired output as a tool schema. The model produces a structured tool call rather than free text. Reliable and widely supported.
- **Prompt-based JSON with validation:** Instruct the model to produce JSON, then parse and validate. Less reliable — the model can produce invalid JSON, especially in edge cases. Always have a validation and retry step.

**Schema design for reliability:**
- Prefer flat schemas over deeply nested ones — nested structures have more ways to fail
- Use enums for fields with a known value set — reduces model freedom and validation failures
- Make fields required explicitly — don't rely on the model to include optional fields when you need them
- Avoid fields whose presence is conditional on other fields — models handle conditionals poorly in schema adherence

**Never parse LLM output with regex as your primary strategy.** It works until the model changes punctuation or spacing, and it fails silently. Use a proper JSON parser and schema validator; handle the exception explicitly.

**Streaming structured outputs:** If you need to stream a structured response (to show partial results as they arrive), parse incrementally using a streaming JSON parser. Validate the final object after the stream completes. Don't attempt to validate partial JSON mid-stream — it will always fail.

### Multi-Provider Strategy

Single-provider dependency is a reliability risk. Major providers have outages; rate limits vary; some providers perform better on specific tasks.

**Failover strategy:** Maintain a primary and at least one secondary provider. Route to the secondary when the primary's circuit breaker is open. For critical features, consider active-active routing (split traffic between providers) rather than active-passive failover — active-active detects degradation faster.

**Provider selection by request:** Some tasks are better served by specific providers — a code generation task may route to one model, a classification task to another. This adds complexity but can improve quality and reduce cost simultaneously.

**Unified provider abstraction:** Use a thin wrapper or LiteLLM to normalize provider interfaces. Switching providers should be a config change, not a code change. Keep provider-specific prompt formatting (system/user/assistant structure varies) in the abstraction layer, not scattered across your codebase.

**Health checks:** Implement lightweight health check calls to each provider on a schedule (every 60 seconds). Track provider-specific error rates and latencies separately. This gives you independent circuit breaker state per provider and helps you detect degradation before it affects users.

### Observability

You cannot fix what you cannot see. AI features need observability from the first production request.

**Trace IDs for multi-step flows:** Every LLM call should carry a trace ID that connects it to the user request, the feature, and any upstream/downstream calls. For agentic features with multiple LLM calls per user request, trace IDs let you reconstruct the full call chain when debugging a failure.

**What to log for every LLM call:**
- Trace ID and request ID
- Input prompt (or a content-addressed hash if privacy constraints prevent logging full prompts)
- Output (or hash)
- Model name and version, and prompt version
- Latency: total wall time, time-to-first-token for streaming
- Token counts: input and output (for cost attribution)
- Outcome: success, retry (with retry count), fallback, circuit breaker open, failure
- Validation failures and schema path that failed
- Provider used (important for multi-provider setups)

**Sampling strategy at scale:** Logging every prompt and response at high volume is expensive. Define a tiered strategy: log everything at low volume; log headers + hashes + outcomes at high volume with full prompt/response sampled at 1–5%. Always log failures completely regardless of volume. Build the ability to increase sampling rate without code deployment — a config flag that bumps you to 100% logging during incidents.

**Dashboards (in priority order):**
1. Error rate and retry rate over time, broken down by failure type
2. Circuit breaker state per provider
3. Latency P50/P95/P99 over time
4. Cost per request by feature and total cost per hour
5. Fallback rate (proxy for reliability)
6. Token usage distribution (are inputs growing over time?)

**Alerts:**
- Error rate above threshold (paging alert)
- Circuit breaker opens (paging alert)
- P95 latency above threshold (warning alert)
- Cost per hour above threshold (warning alert)
- Spike in retry rate (warning — leading indicator of degradation)
- Prompt validation failure rate above threshold

If your AI feature goes dark and you find out from a user report, you don't have observability.

### Guardrails

Guardrails are constraints on inputs and outputs that prevent out-of-spec behavior. They're also latency costs and potential failure modes — add them where you have evidence of a specific risk, not defensively against everything hypothetical.

**Input guardrails:**
- **Length limits:** Reject or truncate inputs that will exceed your context budget. Return a clear error for rejected inputs — don't silently truncate in ways that change the user's meaning.
- **Content filters:** If your feature has specific input requirements, validate them early and fail fast with a user-legible error rather than passing invalid input to the model and failing later.
- **Per-user rate limiting:** Prevent single users from exhausting API quota. Implement at the application layer, not just relying on provider rate limits.
- **Input sanitization for injection:** For features that process external content (documents, web pages, emails), consider sanitizing or flagging content that looks like prompt injection before it reaches the model. This won't catch sophisticated injections but filters opportunistic ones.

**Output guardrails:**
- **Schema validation:** Always, for structured outputs. Fail fast and retry rather than passing invalid structured data to downstream systems.
- **Length checks:** Is the output pathologically short (truncated?) or pathologically long (runaway generation?)? Flag these for review.
- **Content classifiers:** If your feature must never produce certain output types — competitor mentions, specific sensitive categories — run a classifier on the output before returning it. Accept the latency cost consciously; it's real.
- **Confidence and quality thresholds:** If the model expresses low confidence or a quality signal is below threshold, route to human review rather than returning to the user directly.

**Guardrail ordering matters:** Run cheap guardrails (length checks, regex patterns) before expensive ones (LLM-based classifiers). Fail fast on the cheapest check first.

**Never let a guardrail failure produce an unhandled exception.** Guardrails fail — the classifier model may be down, the validation library may have a bug. Wrap guardrail calls in exception handling; define explicitly what happens when the guardrail itself fails.

### Degraded Mode Design

The reliability spectrum between "works perfectly" and "fails completely" is where most real production behavior lives. Design explicitly for degraded modes — don't let your system default to whatever happens when a dependency fails.

**Degraded mode options, from least to most degraded:**

1. **Quality degraded, feature available:** Route to a cheaper/faster model when the primary is unavailable. Output may be lower quality; the feature still works. Appropriate when speed matters more than quality in a pinch.
2. **AI unavailable, workflow continues:** Fall back to the manual version of the workflow. User can complete the task without AI assistance. Best for features that augment an existing workflow.
3. **AI unavailable, partial feature available:** Some parts of the feature work; others are disabled. Surface this clearly to the user — don't silently hide functionality.
4. **Feature unavailable, clear communication:** The feature is down. Tell the user specifically: what's unavailable, expected resolution time if known, and what they can do instead.

Map each failure scenario to a specific degraded mode before you ship. "What if the provider is down?" "What if the model is rate-limited?" "What if output validation fails repeatedly?" Each should have a defined answer.

### Feature Flags and Gradual Rollout

AI features should never go from 0% to 100% of users in a single deploy. The variance in user input distribution means your test coverage — however thorough — will miss edge cases that production traffic finds immediately.

**Rollout strategy:**
- Start at 1–5% of traffic. Monitor error rate, retry rate, and fallback rate. Look for spikes in any metric.
- If metrics are stable after 24–48 hours, expand to 10–25%.
- Continue expanding at 2x intervals with stability checks between each step.
- Maintain the ability to roll back to 0% without a code deploy — a feature flag, not a code change.

**Feature flag design for AI:**
- Flag at the feature level, not the model level — flag "AI summarization enabled" not "use GPT-4o"
- Log which variant each request used so you can compare metrics between flag states
- Enable percentage rollout with consistent user assignment (same user always gets the same variant)

**Canary deployments for prompt changes:** Treat significant prompt changes like new deployments. Route 5–10% of traffic to the new prompt while the old prompt handles the rest. Compare quality metrics and error rates between the two versions before full rollout.

### Prompt Versioning

Prompts in production must be versioned like code. A prompt change is a behavior change.

**Minimum viable prompt versioning:**
- Store prompts in version control alongside application code, not in environment variables or database fields that aren't tracked
- Every prompt has a version identifier logged with every production request
- Prompt changes go through code review with the same rigor as code changes — they change behavior in ways that are easy to miss without a reviewer
- Treat prompt deploys as code deploys: they require review, run evals before deploying, and can be rolled back

**Prompt management patterns:**
- Keep prompts in a central location (a prompts directory, a constants file) rather than scattered as string literals across the codebase
- Template prompts with explicit variable sections — make clear which parts are static and which are dynamic
- Include the intent and known failure modes as comments in the prompt file — not just the prompt text itself
- When deprecating a prompt, keep the old version in version control for forensic purposes

**Forensic use case:** When a user reports a bad output from last Tuesday, "which prompt version was live at 14:37?" is only answerable if you're versioning and logging prompt versions. Without this, you can't reproduce the failure, can't fix the specific issue, and can't confirm the fix worked.

### The Reliability Stack

A production-ready AI feature has all of these layers:

| Layer | Mechanism | Priority |
|---|---|---|
| Input | Validation + length limits + guardrails | High |
| Context | Token counting + truncation strategy | High |
| Prompt | Version-controlled, tested, regression-gated | High |
| Model call | Timeout + retry with backoff + circuit breaker | Critical |
| Output | Schema validation + guardrails | Critical |
| Failure | Explicit degraded modes — no unhandled states | Critical |
| Monitoring | Logging + dashboards + alerts | High |
| Evaluation | Offline evals before changes + production sampling | High |
| Rollout | Feature flags + gradual rollout + canary deploys | Medium |

**Build order for a new feature:** Start with model call reliability (timeout, retry, fallback) and output validation — these prevent the most visible failures. Add observability before expanding beyond a small user group. Add input guardrails and prompt versioning before scaling. Add circuit breakers and multi-provider failover when volume justifies the complexity.

If any Critical layer is missing, the feature is not production-ready. High-priority layers should be present at launch; Medium-priority layers should follow within the first iteration.`,
  quiz: [
    {
      question: "An agent sends an email with incorrect information. The agent was instructed to send emails without confirmation when it was confident. What reliability principle was violated?",
      options: [
        "The agent lacked a circuit breaker, so provider degradation caused it to act on incomplete information",
        "Irreversible actions require human checkpoints before execution — confidence alone is not sufficient justification to skip them",
        "The agent was missing output schema validation, which would have caught the incorrect information before sending",
      ],
      correct: 1,
      explanation: "Irreversible actions — sending emails, modifying databases, making payments — must be gated behind explicit human confirmation, regardless of the model's expressed confidence. Confidence scores from LLMs are poorly calibrated and cannot be used as a reliable safety gate.",
    },
    {
      question: "After a prompt change, a previously reliable AI feature starts producing outputs that fail JSON schema validation 15% of the time. What is the correct response order?",
      options: [
        "Roll back the prompt change, add schema validation with retry logic, and run evals on the new prompt before redeploying",
        "Add a try-catch around the JSON parser to suppress the validation errors and flag outputs for manual review",
        "Switch to a more capable model that produces higher-quality JSON, then reapply the prompt change",
      ],
      correct: 0,
      explanation: "A prompt change that degrades schema validation rates is a regression that should be rolled back immediately. The correct sequence: roll back to restore production reliability, diagnose why the new prompt produces invalid JSON, add explicit retry logic for validation failures as a defensive measure, run your eval suite on the new prompt before redeploying.",
    },
  ],
}