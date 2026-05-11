export const promptingIsNotProgramming = {
  slug: "prompting-is-not-programming",
  title: "Prompting Is Not Programming",
  summary:
    "Prompts live in your codebase but behave nothing like code. Understanding why — and how to write, test, and maintain prompts systematically — changes how you build AI features.",
  difficulty: "BEGINNER" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["foundations", "prompting", "reliability"],
  order: 5,
  content: `## Prompting Is Not Programming

Prompts look like code. They live in your codebase. They get version-controlled. But they behave nothing like code, and treating them like code causes repeated problems.

### What Makes Prompts Different

Code is deterministic. Given the same input, the same function produces the same output. Every time.

Prompts are probabilistic. The same prompt, with the same input, can produce different outputs on different runs — and will produce different outputs as the underlying model changes.

This isn't a bug. It's the fundamental nature of how language models work: they predict the most likely next token given everything that came before. "Most likely" is a probability distribution, not a fixed answer.

The practical consequence: you cannot test a prompt once and assume it works. You have to test it across a range of inputs, with multiple samples, and continuously — because the model can change underneath you.

### How Models Process Prompts

Understanding why prompts behave as they do makes it easier to write them well.

**Models don't "read" prompts the way humans read instructions.** They process the entire prompt as a sequence of tokens and predict what comes next based on patterns learned during training. They don't have a concept of "this is a rule I must follow" separate from "this is text that influences my prediction."

This explains several common failure modes:

**Instruction conflict:** If a system prompt says "always respond in formal English" and the user message is in French, the model has to resolve a conflict. It will do something — but not necessarily what you'd want. Explicit instructions beat implicit ones; later instructions often outweigh earlier ones (recency bias). Specify what to do in edge cases you care about.

**Instruction drowning:** Very long prompts with many instructions can cause earlier instructions to receive less attention than later ones. The model doesn't ignore earlier instructions — but they carry less weight. Put your most important instructions near the beginning or near the end. The middle of a long prompt is the weakest position.

**Sycophancy:** Models are trained to be helpful and agreeable, which makes them prone to telling users what they seem to want to hear. A user who pushes back on a correct answer may get the model to change its answer — not because it was wrong, but because the training incentivized agreement. For high-stakes use cases, explicitly instruct the model to maintain its position when challenged if the evidence supports it.

**Hallucination as gap-filling:** When a model doesn't know something, it doesn't say "I don't know" by default — it generates the most plausible-sounding continuation. This looks like confident wrong answers. Explicitly instructing the model to say when it doesn't know, and to cite sources when making factual claims, partially mitigates this but doesn't eliminate it.

### Anatomy of an Effective Prompt

Most production prompts have three components:

**System prompt:** Sets the context, role, constraints, and output format. Processed once per session (or once per request in stateless APIs). This is where you put stable instructions that apply to all interactions.

**Few-shot examples:** Demonstrations of the behavior you want. "Here's an input. Here's the ideal output." The model pattern-matches against these examples heavily. Three to five well-chosen examples often outperform detailed written instructions for complex behavior.

**User message:** The specific input for this request. What the user actually said, or what you're asking the model to do on this specific call.

\`\`\`
[SYSTEM]
You are a customer support agent for Acme Corp.

Respond to customer messages with:
- A direct answer to their question
- One relevant next step they can take
- A tone that is professional but warm

If you don't know the answer, say so explicitly and offer to escalate.
Do not speculate about issues you can't verify.

Example input: "My order hasn't arrived and it's been 2 weeks"
Example output: "I'm sorry to hear your order is delayed. Based on your order date,
this is longer than our standard shipping window. The best next step is to
check your tracking link [link] for current status. If it shows no movement
in 48 hours, reply here and I'll escalate to our shipping team."

[USER MESSAGE]
{customer_message}
\`\`\`

This structure — context, constraints, format, examples, then input — is a reliable starting point for most prompts.

### Core Prompting Techniques

**Few-shot examples: show, don't just tell**
Describing the behavior you want is less reliable than demonstrating it. Include 3–5 examples that represent the full range of inputs you expect, including edge cases. Make sure examples cover cases where the model should decline, hedge, or ask for clarification — not just the happy path.

Bad: "Classify customer messages as positive, negative, or neutral."
Better: The same instruction plus 6 examples spanning ambiguous cases, mixed sentiment, sarcasm, and multilingual input.

**Chain-of-thought: force reasoning before answers**
For tasks requiring analysis or multi-step reasoning, instruct the model to reason through the problem before stating a conclusion: "Think through this step by step before giving your final answer." This improves accuracy on complex tasks because the model's own reasoning becomes part of the context it's predicting from — it's less likely to contradict a chain of reasoning it just produced.

For very high-stakes reasoning tasks, ask for the reasoning explicitly and verify it separately from the conclusion.

**Role assignment: context shapes behavior**
"You are a senior software engineer reviewing a pull request" produces different output than "Review this code." The role primes the model to draw on different patterns from training. Use roles that are specific and that match the actual expertise level and perspective you want.

**Explicit format requirements: don't leave format implicit**
If you need a specific output structure, specify it exactly. "Respond with a JSON object" is not enough. Specify the schema: key names, value types, which fields are required, what to do when a field doesn't apply. Models deviate from implicit format expectations far more than from explicit ones.

**Negative instructions: say what not to do**
"Do not include caveats about AI limitations" or "Do not ask clarifying questions — make your best judgment with the information provided" prevents common model defaults. Positive instructions tell the model what to do; negative instructions exclude default behaviors you don't want.

**Constraint escalation: less is more, then add**
Start with a minimal prompt that does the core task. Add constraints one at a time. Each addition is a change — test it before adding the next. Prompts that accumulate constraints without testing can have interactions between constraints that produce unexpected behavior.

### The Problem of Prompt Fragility

Small changes to a prompt can produce dramatically different results. Adding a sentence, changing punctuation, or reordering instructions can shift outputs in unpredictable ways.

**Why:** The model is predicting based on the entire token sequence. A single word changes the statistical context for everything that follows.

**Common fragility patterns:**

Underspecified instructions: "Be helpful and professional" gives the model wide latitude to interpret what helpful and professional mean. It will interpret them — just not necessarily the way you intended. The more specific the instruction, the less interpretation variance.

Implicit format expectations: "Answer the question" doesn't specify length, structure, hedging language, or citation behavior. The model will make all of these choices. Make them explicit.

Ordering effects: The most important instructions should appear at the beginning of the system prompt and/or immediately before the user message. Instructions buried in the middle of long system prompts receive less reliable attention.

Missing edge cases: If you haven't specified what to do when the input is ambiguous, off-topic, in an unexpected language, or adversarial, the model will make a judgment. Specify the behavior you want for the edge cases you care about.

**Practical rule:** If a prompt change is important enough to make, it's important enough to test against your eval set before deploying.

### Controlling Output Variance

**Temperature:** The primary lever for controlling randomness. Temperature 0 makes the model consistently pick the most likely token; higher temperatures increase randomness. For production features requiring consistency (extraction, classification, structured generation), use temperature 0 or close to it. For creative tasks where variety is valuable, use higher temperatures. Start at 0 and increase only if you have a specific reason.

**Structured outputs / JSON mode:** Forces output into a specified schema. Eliminates formatting variance. You still get semantic variance (the values can still be wrong), but the structure is reliable. Use for any output you'll parse programmatically.

**Max tokens:** Setting a maximum output length prevents runaway generation and controls cost. Also a reliability mechanism — if a model is producing unexpectedly long outputs, max_tokens caps the damage. Set this to the maximum acceptable length for your use case, not to an arbitrary large number.

**When you want non-determinism:** For brainstorming, creative generation, and A/B testing prompt variants, variance is useful. For reliability-sensitive production features, it's a problem to manage. Design explicitly for which you need.

### Context Window: The Hard Constraint

Every model has a context window — the maximum tokens it can process in a single call. Beyond this limit, content is truncated or the call fails. Within this limit, quality degrades in non-obvious ways.

**The attention degradation problem:** Model attention quality on specific content varies by position in the context. Information at the very beginning and very end of a long context is recalled more reliably than information in the middle. If you have a 50-page document and a question about a fact on page 25, stuffing the full document into context may produce worse results than retrieving the relevant pages and including only those.

**Practical content placement:**
- System instructions: beginning
- Most critical reference information: beginning or end
- Background context that's less critical: middle
- User message: end (immediately before the model's response)

**Cost scales with length:** Every token in the context window costs money on every request. A 2,000-token system prompt costs 2,000 tokens of input on every single call. A retrieved context of 4,000 tokens per request at 100K requests/day is significant. Measure your average and P95 context sizes in production.

**Don't build features that require unbounded context.** If your feature needs to process a whole document, a full conversation history, or a large dataset, use chunking and retrieval (RAG) to select the relevant pieces — not a larger context window.

### Systematic Prompt Iteration

Random prompt edits produce random improvements. Systematic iteration produces consistent ones.

**The iteration workflow:**

1. **Define success criteria before editing.** What does a good output look like? Write 3–5 examples of ideal outputs for your hardest cases. This forces clarity about what you're optimizing for.

2. **Build a small eval set first.** 20–30 representative inputs with expected outputs. Run every prompt version against this set. Without it, you're evaluating on vibes.

3. **Change one thing at a time.** When you modify a prompt, change one element — add an example, clarify an instruction, reorder a section. Multiple simultaneous changes make it impossible to know what helped.

4. **Score before and after.** Run your eval set before and after every change. Record the scores. A prompt change that feels like an improvement but doesn't show up in evals is probably a placebo — or it helps on the cases you're thinking about and hurts on others.

5. **Test on adversarial inputs.** Inputs you're worried about, edge cases, short inputs, long inputs, ambiguous inputs. The happy path isn't where prompts fail.

6. **Document why each element is there.** When you add an instruction, note what failure mode it addresses. This prevents future edits from accidentally removing something that was solving a real problem.

### Multi-Turn vs. Single-Turn Prompting

Single-turn prompts (one message, one response) and multi-turn conversations (a back-and-forth dialogue) require different design thinking.

**Single-turn:** The entire context is the prompt. You control all of it. Consistency and format can be tightly specified.

**Multi-turn:** The conversation history becomes part of the context. User messages accumulate. The model's own prior responses influence future responses. Several implications:

- Context window fills over time. Long conversations need a truncation or summarization strategy.
- Earlier instructions in the system prompt can get "buried" as conversation history grows. Repeat critical constraints in the system prompt rather than relying on the model to remember them from turn 1.
- User messages can contain prompt injection — instructions that attempt to override system prompt behavior. Design multi-turn prompts with this in mind.
- The model's prior responses are part of the context it conditions on. If it made an error in turn 3, it may propagate that error through turns 4, 5, and 6 unless you catch and correct it.

### Prompts Are Not Safe to Update Casually

Models update. The same prompt against a new model version can produce different outputs — sometimes better, sometimes worse, sometimes different in ways that matter for your users.

**Version-lock your models in production.** Use specific dated model version identifiers, not floating aliases ("gpt-4" vs. "gpt-4-0125-preview"). When you decide to update the model version, treat it as a migration: run your eval suite against the new version before switching, identify regressions, update the prompt if needed, then deploy deliberately.

**Treat prompt changes like code changes:** version control, code review, eval before deploy, ability to roll back. A prompt that's a string literal buried in a function with no tests and no history is a liability. A prompt that's a versioned file with documented intent, a test suite, and a deployment history is an asset.

**The forensic question:** When a user reports a bad output from last Tuesday at 2pm, can you tell what prompt was live at that moment? If not, you can't reproduce the failure, can't confirm the fix, and can't prevent it from recurring. Logging prompt versions alongside every production request costs almost nothing and is essential for debugging.

### The Practical Mental Model

Think of a prompt as a specification for a probabilistic system — not a program for a deterministic one.

The model will do something with your prompt. Your job is to write a specification clear enough, with examples specific enough, and with constraints explicit enough, that what the model does matches what you want — reliably, across the full distribution of inputs you'll encounter in production.

The skills that make good technical writers make good prompt engineers: specificity over vagueness, examples over abstract descriptions, explicit edge case handling, measurable success criteria. The difference is that your specification runs against a probabilistic pattern-matcher — so you measure success statistically, not by proof.`,
  quiz: [
    {
      question: "A prompt says 'always respond in formal English'. A user writes in French. The model responds in informal French. What is the best explanation?",
      options: [
        "The model ignored the system prompt because the user message appeared later and recency bias caused it to override earlier instructions",
        "The model encountered an underspecified instruction conflict and resolved it in an unintended way — the prompt didn't specify what to do when language and formality are in tension",
        "The model's safety training deprioritized language restrictions to ensure inclusivity for non-English speakers",
      ],
      correct: 1,
      explanation: "Models don't 'read' prompts like humans — they predict based on the full token sequence. When instructions conflict or are underspecified, the model resolves the ambiguity in its own way. Explicit instructions for edge cases — like 'if the user writes in another language, respond formally in that language' — produce more predictable behavior.",
    },
    {
      question: "Why should prompts be stored in version-controlled files with documented intent, rather than as string literals scattered across the codebase?",
      options: [
        "Prompts change behavior everywhere they're used; without versioning, you can't reproduce failures, confirm fixes, or prevent regressions from prompt edits",
        "String literals are evaluated at runtime rather than compile time, causing inconsistent behavior across environments",
        "Version-controlled prompts are processed faster by LLM APIs because they can be cached at the infrastructure level",
      ],
      correct: 0,
      explanation: "Prompts are behavior specifications for probabilistic systems. A prompt change is a behavior change across every call that uses it. Without version control, you can't answer: 'What prompt was live when that user got a bad output?' Treat prompts like code: review, version, test, and document them.",
    },
  ],
}