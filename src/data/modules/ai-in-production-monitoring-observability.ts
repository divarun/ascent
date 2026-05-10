export const aiInProductionMonitoringObservability = {
  slug: "ai-in-production-monitoring-observability",
  title: "AI in Production: Monitoring & Observability",
  summary:
    "What to log, what to alert on, how to detect quality drift before users do, and the observability patterns that separate reliable AI features from ones you find out about through support tickets.",
  difficulty: "ADVANCED" as const,
  roles: ["EM", "IC"] as const,
  tags: ["engineering", "observability", "monitoring", "reliability", "production"],
  order: 17,
  content: `## AI in Production: Monitoring & Observability

Traditional software monitoring tells you whether your system is up and whether it's fast. That's necessary but not sufficient for AI features. An AI feature can be fully operational — no errors, normal latency — while producing wrong, degraded, or harmful outputs. You won't see that in your uptime dashboard.

AI observability requires a second layer: monitoring the quality and behavior of outputs, not just the health of the infrastructure. This module covers both layers and how to connect them.

### Why AI Observability Is Different

In traditional software, a function either returns the correct result or it doesn't. Errors are binary and usually detectable. In AI systems:

- **Quality degrades gradually.** A prompt regression or model update might reduce output quality by 15% — not enough to cause errors, enough to erode user trust. You won't see this in error rates.
- **Failures are semantic, not syntactic.** An AI feature that returns a well-formed, confidence-sounding response can still be wrong. The system reports success; the output is harmful.
- **The failure distribution is long-tailed.** Average quality can look fine while specific input types are consistently failing. Aggregate metrics hide subgroup failures.
- **External dependencies change underneath you.** Model providers update models, change rate limit structures, and modify behavior — sometimes without notice. Your system didn't change; its behavior did.

The goal of AI observability is to detect these failures before users report them.

### The Observability Stack: Three Layers

**Layer 1: Infrastructure metrics (standard monitoring)**
The same signals you monitor for any service: error rates, latency, throughput, availability. Necessary but not sufficient. These tell you the plumbing is working; they don't tell you the water is clean.

**Layer 2: LLM call metrics (AI-specific operational signals)**
Per-call signals that reveal how your model interactions are behaving: token counts, retry rates, cache hit rates, model versions in use, validation failure rates. These sit between infrastructure and quality — they catch operational problems before they become quality problems.

**Layer 3: Output quality signals**
Measurements of whether outputs are actually good: human sampling, automated scoring, user behavioral signals, and eval suite results. The hardest layer to build and the most important.

All three layers are necessary. Teams that only build layer 1 discover quality problems from user complaints. Teams that only build layer 3 miss infrastructure-level problems that cause quality to degrade. Build all three, in order.

### What to Log on Every LLM Call

Structured logging from the first production request. Retrofitting logging is expensive and leaves gaps in your debugging history.

**Required fields for every call:**
\`\`\`
{
  trace_id,          // Connects this call to the user request and any downstream calls
  request_id,        // Unique identifier for this specific LLM call
  feature,           // Which product feature made this call
  model,             // Exact model identifier including version (e.g., "claude-sonnet-4-6", not "claude")
  prompt_version,    // Version identifier of the prompt used
  input_tokens,      // Tokens in the prompt (for cost attribution)
  output_tokens,     // Tokens in the response (for cost attribution)
  latency_ms,        // Total wall clock time
  ttfb_ms,           // Time to first byte (for streaming features)
  outcome,           // success | retry | fallback | circuit_open | error
  retry_count,       // Number of retries before this outcome
  validation_result, // passed | failed (with failure path if failed)
  cache_hit,         // true/false (for prompt caching)
  provider,          // Which provider/endpoint was used
  user_segment,      // Anonymized segment for disaggregated analysis
  timestamp
}
\`\`\`

**On prompt and response content:**
Full prompt and response logging is ideal for debugging but expensive and privacy-sensitive at scale. Tiered approach: log content hashes always; log full content for a sample (1–5%) in normal operation; log full content for all failures and flagged outputs; have a kill switch to go to 100% logging during incidents without a code deploy.

**Trace IDs for multi-step features:**
For agentic features or any workflow with multiple LLM calls, every call must carry a trace ID connecting it to the originating user request. When debugging a failure in a 5-step agent, you need to reconstruct the full call chain. Without trace IDs, each call is an island.

### Dashboards: What to Build First

Build in priority order. Each dashboard should be operational before you build the next.

**Dashboard 1: Operational health (build before launch)**
- Error rate over time, broken down by error type (timeout, validation failure, rate limit, provider error)
- Retry rate over time — a rising retry rate is a leading indicator of prompt fragility or provider degradation
- Latency P50/P95/P99 over time — watch for P99 spikes that don't show in P50
- Circuit breaker state per provider — open circuit = users hitting fallback
- Fallback rate — what percentage of requests are being served by the fallback rather than the AI

**Dashboard 2: Cost and capacity (build before scaling)**
- Cost per request by feature — identifies which features are expensive and where optimization pays
- Total cost per hour/day — early warning for cost anomalies
- Token distribution (input and output) — are inputs growing over time? Is output verbosity increasing?
- Cache hit rate — for features using prompt caching; a drop in cache hit rate increases cost
- Rate limit proximity — how close are you to provider rate limits at peak traffic?

**Dashboard 3: Quality signals (build before trusting your feature)**
- Human sampling results over time — weekly quality scores from manual review
- Automated eval scores over time — run against your golden dataset on a schedule
- User behavioral signals — correction rate, regeneration rate, abandonment rate
- Output anomaly rate — outputs flagged by length, content, or format checks
- Subgroup performance — quality disaggregated by user segment, language, input type

**Dashboard 4: Change tracking (build before you have multiple versions)**
- Prompt version currently in production per feature
- Model version currently in production per feature
- Quality score before/after each prompt or model change — makes regressions visible
- Deployment history — when did what change?

### Alerts: What Warrants Waking Someone Up

Not every signal warrants a page. Distinguish paging alerts (something is broken now) from warning alerts (something is trending wrong).

**Paging alerts:**
- Error rate above threshold (e.g., >5% over 5 minutes)
- Circuit breaker opens on any provider
- P99 latency above threshold for user-facing features
- Fallback rate spike (e.g., >20% of requests hitting fallback)
- Cost per hour exceeds threshold (runaway cost anomaly)

**Warning alerts (notify, don't wake):**
- Retry rate increasing trend over 30 minutes
- Cache hit rate dropping — may indicate prompt structure change breaking cache
- P95 latency rising trend
- Daily cost above expected range
- Human sampling quality score below threshold
- Automated eval score regression beyond threshold

**Anti-pattern:** Too many alerts, all treated as equal urgency, trains the team to ignore them. Define clearly what each alert requires as a response. An alert with no defined response action is noise.

### Detecting Quality Drift

Quality drift — gradual degradation that no single change caused — is the hardest failure mode to detect because no individual data point looks alarming.

**Causes of quality drift:**
- Model provider updates that change base model behavior
- Prompt entropy: small edits accumulate over time and interact in unpredictable ways
- Data distribution shift: your users' inputs are slowly changing
- Feedback loop effects: AI outputs influence user behavior, which changes the input distribution

**Detection approaches:**

**Scheduled eval runs:** Run your golden dataset eval on a schedule (daily or weekly). Plot the score over time. A trend line that's gradually declining is drift; a step change is a regression. Without the time series, you see neither.

**Production sampling with consistent scoring:** Review a random sample of production outputs weekly using a consistent rubric. Trends in human quality scores over time reveal drift that automated metrics miss.

**Cohort comparison:** Compare quality metrics for this week's traffic against the same metrics from 4 weeks ago, on equivalent input types. Removes seasonal and volume effects; isolates quality change.

**Canary monitoring:** When providers update models (even patch versions), route a small percentage of traffic to the new version and compare quality metrics side-by-side before cutting over. Treat provider model updates as you would a dependency upgrade — test before adopting.

### Logging for Debugging Production Failures

When something goes wrong in production, your logs determine whether you can diagnose it in minutes or hours.

**The forensic questions your logs must answer:**
- What prompt was live at the time of the failure? (Requires prompt version logging on every call)
- What model version was in use? (Requires exact model identifier, not a floating alias)
- What was the input that triggered the failure? (Requires content logging or content hash + sampling)
- How many users were affected? (Requires user segment tagging)
- When did this start? (Requires consistent timestamps and historical baselines)
- Was this isolated or systematic? (Requires the ability to query across calls by feature/model/prompt)

**Structured logs over text logs.** "LLM call failed with timeout" is a text log. A JSON object with all required fields is a structured log. Structured logs are queryable; text logs require grep. At production scale, queryability is not optional.

**Sampling strategy at scale:**
Full logging of every prompt and response is expensive and privacy-sensitive at high volume. A practical tiered approach:
- Headers + metadata: 100% of calls
- Full content: 1–5% sample in normal operation
- Full content: 100% of failures, 100% of flagged outputs
- Escalation path: ability to increase sampling to 100% via config, without a code deploy

The 1–5% sample gives you enough data for quality monitoring and debugging most issues. The 100% failure logging ensures you always have the data for the cases that matter most.

### User Behavioral Signals as Quality Proxies

Explicit quality ratings ("Was this helpful? 👍👎") have low response rates and self-selection bias. Implicit behavioral signals are higher-volume and harder to game.

**Signals worth instrumenting:**

**Edit rate and edit distance:** Did users modify the AI output before using it? How substantially? High edit rates on specific output types indicate systematic quality problems on those types.

**Regeneration rate:** Did users request a new output? Correlates with dissatisfaction with the first response. Track by feature, input type, and user segment.

**Abandonment after AI output:** Did users leave the workflow after seeing the AI output? May indicate the output was unhelpful or confusing enough to cause task abandonment.

**Copy-without-edit rate:** Did users copy the output directly without modification? Correlates with satisfaction — but also with automation bias. Monitor alongside downstream error rates; high copy-without-edit plus high downstream errors indicates users are accepting wrong outputs.

**Time-to-action:** How long did users spend reading/editing before acting? Very short times on complex outputs may indicate users aren't engaging critically with the content.

**Correction feedback loops:** When users correct AI outputs (editing a generated document, modifying a suggested action, overriding a classification), these corrections are ground-truth evidence of failures in your production distribution. Build the pipeline to capture corrections and route them to your evaluation and improvement process. Correction data is your highest-value training and eval signal.

### Observability for Agentic Features

Agentic features — where a model takes multiple actions in a loop — require additional observability beyond single-call features.

**The agent trace:** Every action an agent takes (tool call, LLM call, retrieval query) should be linked via trace ID into a single agent trace. The trace is your reconstruction of exactly what the agent did and why. Without it, debugging a failed 10-step agent is essentially impossible.

**Per-step logging:** Don't just log the final outcome. Log each step's input, output, latency, and outcome. When an agent fails, you need to know at which step it failed, what it had in context, and what it decided to do — not just that the final result was wrong.

**Tool call monitoring:** Monitor tool call patterns separately from LLM call patterns. Which tools are being called most frequently? Which tool calls are failing? Are there tool calls that seem to be happening in loops (same tool called repeatedly with similar inputs)? These patterns indicate agent confusion that's hard to see from the output alone.

**Irreversible action auditing:** For any agent action that modifies state (writing to a database, sending an email, calling an external API), log the action with full detail and flag it separately. These are the actions where failures have real consequences. Review them as a distinct stream from read-only operations.

**Blast radius monitoring:** If your agent can take multiple actions before a human sees the result, monitor the number of state-modifying actions per agent run. A run that's taking 3x as many actions as usual is a signal worth investigating before assuming the output is correct.

### The Minimum Viable Observability Stack

If you have nothing today, build in this order:

1. **Structured logging** on every LLM call with required fields (trace ID, model, prompt version, tokens, latency, outcome)
2. **Operational health dashboard** (error rate, retry rate, latency percentiles, fallback rate) — before launch
3. **Cost dashboard** (cost per request by feature, total cost, token distribution) — before scaling
4. **Prompt and model version tracking** (what's in production right now, history of changes)
5. **Scheduled eval runs** against your golden dataset — weekly minimum, before any significant change
6. **Production sampling** — 5% of outputs reviewed by a human weekly
7. **User behavioral signal instrumentation** (edit rate, regeneration rate, abandonment)
8. **Alert definitions** with documented response actions for each

You cannot operate a production AI feature responsibly without layers 1–4. Layers 5–8 are required to catch quality problems before users do.

The teams that ship reliable AI features are the ones that instrument before they scale, not the ones that add monitoring after the first incident.`,
  quiz: [
    {
      question: "Your AI feature has zero errors and normal latency, but users start filing complaints about unhelpful responses two weeks after a provider model update. What monitoring gap does this reveal?",
      options: [
        "Infrastructure monitoring was misconfigured and missed a spike in token usage that indicates model confusion",
        "There was no output quality monitoring layer — infrastructure metrics can be healthy while semantic output quality silently degrades",
        "The circuit breaker threshold was set too high, allowing degraded provider responses through without triggering fallback",
      ],
      correct: 1,
      explanation: "AI observability requires a layer beyond infrastructure health. A feature can have zero errors and normal latency while producing wrong outputs — quality failures are semantic, not syntactic. A provider model update can shift behavior without any operational signals firing. The fix is quality monitoring: scheduled eval runs, production sampling with human review, and user behavioral signals.",
    },
    {
      question: "Why is it important to log the exact model version identifier (e.g., 'claude-sonnet-4-6') rather than a floating alias (e.g., 'claude-latest') on every LLM call?",
      options: [
        "Floating aliases cost more per token because providers apply a routing fee for version resolution",
        "When debugging a past failure, you need to know which exact model was in use — floating aliases change over time, making reproduction impossible",
        "Exact version identifiers enable prompt caching; floating aliases bypass the cache lookup",
      ],
      correct: 1,
      explanation: "Floating aliases resolve to different model versions over time as providers update. If a user reports a bad output from last Tuesday and you logged 'claude-latest', you cannot reproduce the failure because that alias may now point to a different model. Log the exact model identifier on every call for forensic debugging and regression analysis.",
    },
  ],
}