export const aiProductFailureModes = {
  slug: "ai-product-failure-modes",
  title: "AI Product Failure Modes",
  summary:
    "Most AI features fail in predictable ways. Learn to recognize the patterns before you ship.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["PM", "EM"] as const,
  tags: ["product", "risk", "strategy"],
  order: 8,
  content: `## AI Product Failure Modes

Certain failure patterns repeat across AI product launches. Most failures are not technical — they're conceptual. Recognizing them early is cheaper than discovering them in production.

### Failure Mode 1: The Demo Gap

**What happens:** The product looks impressive in demos. It fails in production.

**Why:** Demos use curated inputs. Production has the full distribution of real user behavior — including everything you didn't anticipate, didn't design for, and didn't test. The gap between your best-case output and your median output is often enormous.

A secondary version: the demo impresses stakeholders who then set user expectations accordingly. Users arrive expecting the demo experience. When they encounter the median experience, the gap feels like betrayal even if the product is objectively useful.

**Signs you're here:**
- You're choosing what to show stakeholders carefully
- Edge cases are documented as "known issues" that never get prioritized
- Internal users report a different experience than what was demoed
- You haven't measured what percentage of real inputs produce good outputs

**Fix:** Eval on the full input distribution, not best-case examples. Run an internal beta with real users before external launch. When demoing to stakeholders, show a random sample of outputs, not a curated one. Set stakeholder expectations to the median experience, not the ceiling.

### Failure Mode 2: Accuracy That's Almost Good Enough

**What happens:** The AI is right 80–90% of the time. Users encounter enough errors that they stop trusting it entirely — even for cases where it would be correct.

**Why:** Trust in AI systems is calibrated differently than trust in traditional tools. A calculator wrong 10% of the time is unusable. An AI assistant wrong 10% of the time might still be net-positive — if users can tell when to trust it.

The failure isn't the error rate. It's the unpredictability of errors. Users can tolerate known limitations. They can't tolerate unknown ones. When errors feel random, users lose trust globally, not just in the cases where the AI is actually wrong.

**Signs you're here:**
- Users describe the feature as "hit or miss"
- Power users have developed workarounds to verify outputs
- Support tickets mention errors but can't characterize when they happen
- Adoption is high initially, then drops as users hit errors

**Fix:** Design for verifiability — let users see the reasoning or sources behind outputs so they can spot errors. Build easy correction mechanisms. Surface the AI's uncertainty explicitly rather than hiding it behind confident-sounding prose. Characterize your error distribution: are errors random or clustered in specific input types? Clustered errors are fixable; random errors require UX design around uncertainty.

### Failure Mode 3: Solving the Wrong Problem

**What happens:** You automate a task users were fine doing manually, or mildly annoyed by. They don't adopt the feature — or adopt it once and stop.

**Why:** AI is best applied to tasks that are high-frequency and tedious, or low-frequency and cognitively demanding. Most tasks are neither. Automating a task that takes users 90 seconds twice a week doesn't change their lives.

A related variant: you solve the right problem but in the wrong place in the workflow. The user's actual pain is in step 4 of a 7-step process. You automate step 6. They're grateful for 2 days and then forget the feature exists.

**Signs you're here:**
- Adoption metrics look fine; re-engagement metrics don't
- User interviews reveal they use the feature "sometimes" without enthusiasm
- The problem solved was identified by internal stakeholders, not user research
- The feature doesn't appear in users' descriptions of how they do their work

**Fix:** Interview users about their most painful repetitive tasks before building. Map the full workflow, not just the step you want to automate. Look for frequency × difficulty × consequence: high-frequency tedious tasks, or low-frequency high-stakes tasks where mistakes are costly. Validate that the problem is real and the proposed location in the workflow is where the pain actually lives.

### Failure Mode 4: Novelty Without Retention

**What happens:** Strong initial adoption, sharp drop-off after 2–4 weeks. Users describe the feature positively but stop using it.

**Why:** LLMs produce impressive-looking outputs that feel transformative on first contact. Some use cases don't survive contact with real recurring usage — the AI generates something interesting once, but the user has no recurring need that the feature serves better than existing alternatives.

This is distinct from the wrong-problem failure mode. The problem may be real; the AI solution may be technically good. But the job-to-be-done is occasional, not habitual, and the product was designed and measured as if it were habitual.

**Signs you're here:**
- Day-1 and Day-7 retention look fine; Day-30 drops significantly
- Users can demo the feature enthusiastically but rarely use it unprompted
- Usage spikes when the feature is surfaced prominently, drops when it isn't
- Users describe it as "cool" rather than "essential"

**Fix:** Distinguish between features that should be habitual versus features that should be available on demand. Measure success accordingly — a feature used 3 times per year at exactly the right moment may be extremely valuable; measuring it against daily active usage will make it look like a failure. Identify whether the target behavior is a new habit or a replacement for an existing behavior, and design accordingly.

### Failure Mode 5: Data Feedback Loops Gone Wrong

**What happens:** The model learns from its own outputs and drifts. Quality degrades gradually and the team doesn't notice until it's severe.

**Why:** When model outputs influence the data that gets collected — user behavior shaped by AI recommendations, training data augmented with AI-generated content, fine-tuning on AI-assisted outputs — the feedback loop amplifies whatever the model does, including its errors. This is sometimes called model collapse: the model progressively loses the diversity of the original training distribution and converges on a narrower, more confident, less accurate output space.

A subtler version: the model doesn't collapse but drifts toward a distribution that looks good on your evaluation metrics while degrading on dimensions you're not measuring.

**Signs you're here:**
- Model quality in production diverges from eval scores over time
- User behavior data has changed since you started collecting it (because the model is shaping it)
- The diversity of outputs has decreased
- You cannot distinguish AI-generated content from human-generated content in your training pipeline

**Fix:** Keep training data and model output data strictly separated — architecturally, not just by policy. Audit your data pipeline for feedback loops before they're built. Track output diversity metrics over time. Have explicit ownership of the data architecture, not just the model architecture. If you fine-tune on production data, require human review of a significant sample before it enters the training set.

### Failure Mode 6: Wrong Tool for the Job

**What happens:** Every problem becomes "send this to an LLM." Response times are slow, costs are high, quality is inconsistent, and the team accumulates prompting technical debt that becomes unmaintainable.

**Why:** LLMs are powerful and general, which makes them the default tool for anyone who's learned they can solve things. But classification, structured extraction, search, routing, and many other common ML tasks are solved better — faster, cheaper, more reliably — by purpose-built approaches. Using a generative model where a classifier works is like using a staff meeting to answer a yes/no question.

**Signs you're here:**
- Multiple features have nearly identical prompts doing roughly the same thing
- Simple tasks (is this spam? what category is this?) go through the same model as complex ones
- Latency for simple operations is high because they're waiting on LLM response time
- Prompt engineering is a recurring engineering task with diminishing returns

**Fix:** Before building an LLM-based solution, ask: What is the simplest model that reliably solves this? Deterministic logic, a regex, a classifier, an embedding-based similarity search, or a structured query may be better. Use LLMs for tasks requiring language understanding, generation, or reasoning across ambiguous inputs. Use simpler tools for tasks with clear structure and known output spaces.

### Failure Mode 7: Prompt Engineering Technical Debt

**What happens:** Prompts are scattered across the codebase. No one knows exactly what's running in production. Changing one prompt to fix a bug breaks behavior in an unrelated feature. The system becomes fragile and opaque.

**Why:** Prompts are code. They have the same failure modes as undocumented, untested, unversioned code — but teams rarely treat them that way. A prompt buried in a string literal in a service file, last edited 6 months ago by someone who's left the company, with no tests and no documentation, is a liability.

**Signs you're here:**
- You're not certain what prompt is running in production right now
- Prompt changes get reviewed less carefully than code changes
- There are no evals that run before prompt changes ship
- Multiple people have edited the same prompts without coordination

**Fix:** Version control your prompts with the same discipline as code. Treat prompt changes like code changes: review, test, and document them. Run evals before and after every change. Centralize prompts in a discoverable location rather than scattering them across the codebase. For any prompt in a critical path, document its intent, its known failure modes, and the eval cases that validate it.

### Failure Mode 8: Automation Bias and Over-Reliance

**What happens:** Users treat AI outputs as correct without verification. Errors propagate into downstream decisions, documents, and systems. In high-stakes contexts, this causes real damage.

**Why:** AI outputs look authoritative. They're well-structured, confidently worded, and arrive quickly. Human cognitive bias toward deferring to confident-seeming sources — automation bias — means users verify less than they should, especially as familiarity with the tool increases. The first few interactions are often carefully verified; after that, verification drops.

This is a UX problem as much as a model problem. A feature designed to minimize friction around accepting AI output will train users to accept outputs without scrutiny.

**Signs you're here:**
- Users describe using outputs "directly" without editing
- Errors in AI outputs have appeared in external-facing deliverables
- The interface makes it easier to accept than to question
- No mechanism exists for users to flag incorrect outputs

**Fix:** Design friction into acceptance for high-stakes outputs. Require users to read, not just click through. Surface uncertainty and confidence explicitly. Make it easy to correct and flag errors — and use those corrections as training signal. For professional contexts, consider requiring users to affirm they've reviewed AI-generated content before it can be used in consequential ways.

### Failure Mode 9: The Privacy and Data Leakage Trap

**What happens:** Users input sensitive data into AI features — PII, confidential business information, privileged communications. That data goes to vendor servers, appears in logs, potentially influences training. Legal and compliance issues follow.

**Why:** AI features feel like internal tools. Users treat the chat box or AI assistant like they'd treat a private document — they put everything in it. They don't think about where the input goes. In many cases, they're right not to worry. In some cases — health data, legal communications, financial information, trade secrets — the exposure is a real compliance issue that the product team didn't design for.

**Signs you're here:**
- No data classification review was done before launching the AI feature
- Users have been explicitly told not to put certain data types in the feature but do anyway
- You don't know whether your vendor uses inputs for model training
- The feature logs inputs and outputs with no retention policy

**Fix:** Before shipping any AI feature that processes user-provided text, answer: What data will users put in here? Where does it go? Who can see it? Does it influence model training? Apply your organization's data classification policies to AI inputs as strictly as you apply them to databases. If the vendor's data usage terms are unclear, get written clarification. If the feature will see sensitive data, use enterprise tiers with explicit data isolation.

### Failure Mode 10: The Organizational Gap

**What happens:** The AI feature is technically sound but fails in deployment because ownership, accountability, and operational processes weren't established.

**Why:** AI features require ongoing operation in ways traditional software doesn't. Model quality drifts. The data distribution shifts. A new model version changes behavior. Hallucinations increase in a specific category. These problems require someone to notice, diagnose, and respond — on an ongoing basis. When no one owns this, problems accumulate undetected until they're severe.

A common manifestation: a feature is built by an innovation team or external consultants, handed to a product team to operate, and no one establishes who monitors quality, responds to incidents, or owns the model update process.

**Signs you're here:**
- No one is explicitly responsible for monitoring AI feature quality in production
- Model updates from vendors are applied without testing
- Quality degradation is discovered from user complaints, not monitoring
- The team that built the feature is no longer involved and left no documentation

**Fix:** Before launch, explicitly assign ownership of: production quality monitoring, incident response for AI failures, evaluation and regression testing, and vendor model update management. Document the operational runbook. Treat AI feature operations as a first-class concern, not an afterthought to development.

### The Common Thread

These failure modes share two root causes.

The first is **shipping based on vibes rather than evidence** — optimizing for impressive demos and internal enthusiasm rather than measuring real-user, real-distribution performance. The fix is evaluation infrastructure: test inputs with expected outputs, run before every significant change, measure what actually matters.

The second is **treating AI as a technology problem rather than a product problem**. The demo gap, wrong-problem failure, novelty-without-retention, and organizational gap failures are not technical failures. They require product thinking: genuine user research, workflow analysis, retention measurement, and operational ownership. The teams that avoid these failures are the ones that apply the same rigor to AI features that they apply to any other product decision.`,
  quiz: [
    {
      question: "Users describe an AI feature as 'hit or miss' and support tickets mention errors but can't characterize when they happen. Which failure mode does this most likely indicate?",
      options: [
        "The Demo Gap — outputs were curated for stakeholders but not tested on production inputs",
        "Accuracy That's Almost Good Enough — errors feel random and unpredictable, eroding trust globally",
        "Novelty Without Retention — initial enthusiasm fades as users encounter the real usage pattern",
      ],
      correct: 1,
      explanation: "When errors feel random and uncharacterized, users can't learn when to trust the system — leading to global trust loss. The fix is to characterize the error distribution: clustered errors are fixable through targeted improvement; random errors require UX design around uncertainty.",
    },
    {
      question: "An AI feature gets rave reviews in week one but usage drops sharply by week four. Users call it 'cool' but don't use it unprompted. What is the most likely root cause?",
      options: [
        "The feature has a data feedback loop amplifying early errors into model drift",
        "The feature solves a real but occasional need, not a habitual one, and was measured against daily usage",
        "Prompt engineering technical debt made the feature brittle over time",
      ],
      correct: 1,
      explanation: "Novelty Without Retention occurs when a feature is genuinely useful but serves an occasional rather than habitual need. Measuring an occasional-use feature against daily active usage will always look like a failure. Identify whether the target behavior should be habitual or on-demand, and measure accordingly.",
    },
  ],
}