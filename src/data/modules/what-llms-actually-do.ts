export const whatLlmsActuallyDo = {
  slug: "what-llms-actually-do",
  title: "What LLMs Actually Do",
  summary:
    "How large language models generate text, learn from data, follow instructions, and why they behave more like probabilistic generators than reasoning engines — including what reasoning models change and what they don't.",
  difficulty: "BEGINNER" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["foundations", "llm", "concepts"],
  order: 3,
  content: `## What LLMs Actually Do

Large language models generate text by predicting the next token in a sequence. That's the core mechanic. Everything impressive about modern AI — chatbots, coding assistants, summarizers, autonomous agents — emerges from scaling this simple idea with massive datasets and transformer architecture.

Understanding how this actually works changes how you design, build, and debug AI features. The mental models most people bring to LLMs — that they're sophisticated databases, or search engines, or reasoning systems — are wrong in ways that cause real product failures.

### Tokens: The Basic Unit

Models don't process words — they process tokens. A token is roughly a word fragment: common words like "the" are a single token, while longer or rarer words may be split into multiple tokens. "unhappiness" might be tokenized as "un", "happ", "iness" — three tokens.

This matters for several practical reasons:

**Cost:** API pricing is per token. A 750-word document is approximately 1,000 tokens. Your system prompt is paid for on every single request. Reasoning models add an additional cost dimension: they generate internal "thinking" tokens before producing a final response — tokens that never appear in the output but are billed as compute.

**Counting and arithmetic:** Because models process token sequences rather than words or characters, they're unreliable at tasks that require character-level counting. "How many letters are in 'strawberry'?" fails more often than you'd expect because the model reasons over tokens, not characters.

**Non-English languages:** Languages with less training data are often tokenized less efficiently — a Chinese or Arabic sentence may require more tokens than the equivalent English sentence, affecting both cost and effective context utilization.

**Whitespace and formatting:** Unusual whitespace, special characters, and some code patterns produce unexpected tokenizations that can affect model behavior.

**The context window is measured in tokens.** Flagship models as of 2026 typically support context windows between 128,000 and 2 million tokens. However, advertised context size and effective context size are not the same thing — more on this below.

### The Core Generation Mechanic

At inference time, an LLM:

1. Takes a sequence of tokens (everything in the context window)
2. Processes them through many transformer layers, where attention mechanisms allow each token to "look at" every other token
3. Produces a probability distribution over all possible next tokens
4. Samples from that distribution to select the next token
5. Appends the selected token and repeats until generation is complete

The model does not retrieve a stored answer. It generates the response token-by-token, where each token choice is conditioned on everything that came before it in the context. This is why LLMs are called "autoregressive" — each step is conditioned on prior outputs.

**Why this mechanic produces impressive results:** The probability distribution at each step is informed by patterns learned from training across an enormous corpus of text. The model has, in a compressed form, learned what kinds of text follow what other kinds of text — including patterns that look like reasoning, explanation, code, and factual recall.

**Why this mechanic has inherent limits:** "Most likely continuation" is not the same as "true" or "correct." A model generating a plausible-sounding continuation has no internal mechanism that verifies factual accuracy. It produces what looks right, not what is right.

### How Models Learn: The Training Pipeline

Understanding the three-stage training pipeline explains why models behave the way they do — why they're helpful, why they're sometimes sycophantic, and why they refuse certain requests.

**Stage 1: Pretraining**
A base model is trained on an enormous corpus of text — web pages, books, code, scientific papers — covering trillions of tokens. The training objective is simple: predict the next token. Over billions of training steps, the model learns statistical regularities in language: grammar, syntax, semantic relationships, writing styles, and patterns that simulate reasoning.

A pretrained base model can generate coherent text but doesn't reliably follow instructions. Ask it a question and it might continue your question rather than answer it, because continuing text is what it learned to do.

**Stage 2: Instruction tuning (SFT)**
The base model is fine-tuned on examples of (instruction, response) pairs — human-written demonstrations of following instructions helpfully. This is called supervised fine-tuning (SFT). After this stage, the model is much better at understanding what users want and responding accordingly.

**Stage 3: Reinforcement learning from human feedback (RLHF)**
The instruction-tuned model generates many responses to prompts. Humans rank those responses by quality. A reward model learns to predict human preferences, and the LLM is trained to generate responses that score highly on this reward model. This stage is why models are helpful, polite, and avoid harmful outputs — and also why they can be sycophantic (the training rewarded responses that humans rated positively, and humans sometimes rate agreeable responses positively regardless of accuracy).

**What this means for product teams:** When you use a model from Anthropic, OpenAI, or Google, you're using a model that has been through all three stages. The base model's knowledge comes from pretraining. The instruction-following and helpfulness come from SFT and RLHF. The refusals, safety behaviors, and sometimes-excessive agreeableness come from RLHF. Understanding which stage produces which behavior helps you diagnose unexpected model behavior.

### Context: What the Model Sees

Every response a model generates is conditioned on everything in its context window — the "working memory" of the current interaction. The context contains:

**System prompt:** Instructions that define the model's role, constraints, and behavior for the session. Written by the developer, not the user. Processed at the start of every request.

**Conversation history:** All prior turns in the conversation — both user messages and assistant responses. The model has no memory outside the context window; "remembering" something from a prior session requires explicitly including it in the context.

**User message:** The current input from the user.

**Tool outputs:** For agentic applications, the results of function calls, search results, and other tool outputs are injected into the context and become part of what the model reasons over.

The model processes all of this simultaneously, with transformer attention allowing every part of the context to influence the generated response. Crucially, the model weights all of this in a single forward pass — it doesn't sequentially "read" the context the way a human would.

**Practical implications:**
- Everything in the context affects the response, including parts you didn't intend to influence it
- Longer contexts cost more and have higher latency
- **Advertised context size ≠ effective context size.** Benchmarks consistently show that even models with multi-million token windows often maintain reliable recall and reasoning across only a portion of that range. Information in the middle of very long contexts tends to receive less reliable attention than information at the beginning or end. When building on long-context features, test at your actual context lengths — don't assume the spec sheet translates to production performance.
- Users cannot directly observe what's in the context; they only see the output

### What Emerges from Scale

The surprising property of large language models is that capabilities appear at scale that aren't present in smaller models — researchers call these "emergent capabilities."

A model trained on 100 billion tokens can follow instructions. A model trained on the same data at one-tenth the scale often cannot, even though the training objective was identical. The capability isn't directly programmed — it emerges from the interaction of scale, data, and the training objective.

Emergent capabilities that have appeared at scale include: multi-step reasoning, arithmetic, code generation, translation to languages underrepresented in training data, analogy, and the ability to follow complex multi-part instructions.

**What this means practically:** You cannot predict model capabilities by reasoning from first principles. You have to test. A task you think is too hard for a model may work; a task you think is trivial may fail. The reliable approach is evaluation on your specific task, not extrapolation from intuition.

**The limitation of emergence:** Emergent capabilities are real but not well-understood. They can disappear when models are updated, behave inconsistently across phrasings of the same task, and often have sharp capability cliffs — the model handles inputs up to a certain complexity and fails unexpectedly above it.

### Temperature and Sampling

LLM outputs are probabilistic. Temperature controls how that probability distribution is sampled.

At temperature 0, the model always selects the most probable token — outputs are as deterministic as they get. At higher temperatures, lower-probability tokens are sampled more often, producing more varied but less predictable outputs.

**In practice:**
- **Temperature 0:** Use for structured outputs, classification, extraction, and any task where consistency matters more than creativity. Outputs are more deterministic but not perfectly deterministic — other sampling parameters still introduce some variance.
- **Temperature 0.3–0.7:** Balanced. Use for most conversational and instructional tasks.
- **Temperature 0.7–1.0:** More variation. Use for creative writing, brainstorming, and cases where diversity across multiple outputs is valuable.

**What temperature doesn't control:** Whether the output is correct or grounded. A temperature-0 model confidently producing wrong answers is still producing wrong answers. Temperature affects variety, not accuracy.

### Reasoning Models: A Different Generation Strategy

Since 2024, a class of models — often called reasoning models or large reasoning models (LRMs) — has introduced a meaningfully different generation approach. Rather than producing a final response immediately, these models generate extended internal reasoning chains before arriving at an answer. This uses more compute at inference time (test-time compute scaling) but produces more reliable outputs on complex, multi-step tasks.

For product teams, reasoning models change a few things:

**On quality:** Reasoning models substantially outperform standard models on structured, logic-intensive tasks — math, code, multi-step planning. On simpler tasks like summarization or drafting, the quality difference is smaller and the cost is higher.

**On sycophancy:** Research has found a nuanced tradeoff. The extended reasoning process can act as a "logical constraint" that forces models to work through implications before agreeing with a user — which reduces some sycophantic responses. However, reasoning models can also use their reasoning capability for post-hoc rationalization, constructing plausible-sounding justifications that accommodate a user's mistaken beliefs rather than correcting them. Reasoning doesn't eliminate sycophancy; it changes the form it takes.

**On cost and latency:** Reasoning models generate thinking tokens in addition to output tokens. These hidden tokens are billed as compute and add latency. For time-sensitive or high-volume use cases, this tradeoff needs to be evaluated explicitly.

**What reasoning models don't change:** The core mechanic is still statistical token prediction, and the weights are still fixed after training. The improvement comes from how inference-time compute is allocated, not from the model acquiring new knowledge or reasoning capabilities it didn't have at training time.

### What LLMs Are and Aren't

These distinctions are worth internalizing because violations of them are where product failures come from.

**LLMs are not databases.** They don't store and retrieve facts. They compress statistical patterns from training data into parameters. A "fact" the model was trained on is represented as a distributed statistical pattern across billions of parameters — not as a stored record. This is why factual recall is unreliable: the model generates what statistically follows, not what's stored.

**LLMs are not search engines.** They don't look up current information. Their knowledge is fixed at training time. For current information, you need retrieval (RAG) or tool use.

**LLMs are not rule engines.** They don't follow instructions the way code follows logic. They pattern-match against training examples that include instruction-following. This is why instructions can be inconsistently followed and why novel instruction phrasings can produce different results.

**LLMs are not reasoning systems in the formal sense.** They produce outputs that look like reasoning and that pass many tests of reasoning quality. Reasoning models extend this significantly — they can now solve competition-level math and science problems reliably. But the underlying process is still statistical pattern matching extended through learned reasoning strategies, not formal inference from first principles. This is why even reasoning models can produce chains that are plausible at each step but wrong overall, and why formal logical and mathematical tasks still benefit from external tool use (code execution, calculators) for guaranteed correctness.

**What LLMs are:** General-purpose probabilistic text generation systems that have internalized statistical patterns from an enormous sample of human-generated text. This gives them flexible, surprisingly generalizable capability across a huge range of tasks — while also giving them the failure modes of statistical pattern matching rather than formal computation or factual recall.

### The Product Mental Model

For building reliable AI features, the most useful mental model is:

An LLM is a general-purpose probabilistic generation engine. It produces plausible text given context. "Plausible" means statistically likely given training data — it doesn't mean true, consistent, or verifiable.

This model predicts the failure modes:
- **Hallucination:** When the model doesn't know something, it generates plausible-sounding continuation anyway. RLHF can amplify this by rewarding confident, coherent-sounding responses over hedged accurate ones.
- **Inconsistency:** Probabilistic selection means identical inputs can produce different outputs
- **Brittleness:** Inputs outside the training distribution break the statistical patterns the model relies on
- **Sycophancy:** RLHF training rewarded responses humans rated positively; humans sometimes rate agreeable responses positively. Reasoning models reduce some sycophancy but can introduce rationalized sycophancy — plausible-sounding justifications for agreeing with incorrect user beliefs.
- **Reasoning errors:** Statistical pattern matching produces reasoning-shaped outputs without formal reasoning guarantees, even in reasoning models

And it predicts where the model works well:
- Tasks where the training data contained many similar examples
- Tasks where approximate outputs are valuable
- Tasks where humans verify, edit, or provide feedback on outputs
- Tasks where external grounding (retrieved documents, tool outputs) supplements statistical generation
- Complex, logic-intensive tasks where reasoning models can be deployed with appropriate latency and cost tolerance

The engineering implication: LLMs work best when combined with constraints — structured outputs, retrieval systems, validation layers, and human review — that compensate for the limits of probabilistic generation. They work worst when treated as authoritative, when asked to guarantee consistency, or when deployed without evaluation infrastructure.`,
  quiz: [
    {
      question: "Why does lowering temperature to 0 make LLM outputs more consistent but not fully deterministic?",
      options: [
        "Temperature 0 still allows the model to retrieve from different memory stores on each run",
        "Temperature 0 selects the most probable token at each step, but other sampling parameters can still introduce some variance",
        "Temperature 0 disables the attention mechanism, causing slight randomness in token ordering",
      ],
      correct: 1,
      explanation: "Temperature controls how the probability distribution is sampled. At 0, the model picks the most probable next token. However, other sampling parameters can still produce some variance, so outputs are more deterministic — not perfectly so.",
    },
    {
      question: "A model returns a confident summary with specific figures — but those figures never appeared in the source document. What best explains this?",
      options: [
        "The model searched the internet and found related information to fill in the gaps",
        "The model generated the most statistically plausible continuation, even though plausible does not mean true",
        "The model confused the document with another document stored in its context window",
      ],
      correct: 1,
      explanation: "LLMs generate outputs token-by-token based on statistical likelihood, not factual recall. When information is absent, the model produces what sounds plausible — a hallucination. 'Most likely continuation' is not the same as 'correct'. RLHF can amplify this by rewarding confident-sounding responses.",
    },
    {
      question: "A team switches to a reasoning model for a customer-facing assistant and notices it now constructs detailed logical arguments that agree with users even when those users are factually wrong. What explains this?",
      options: [
        "Reasoning models have higher temperature by default, causing more variable outputs",
        "Reasoning models can use their extended reasoning capability for post-hoc rationalization — building plausible-sounding justifications for sycophantic conclusions rather than correcting them",
        "The reasoning model has access to more training data and is more likely to agree with common beliefs",
      ],
      correct: 1,
      explanation: "Reasoning models don't eliminate sycophancy — they change the form it takes. While extended reasoning can act as a check on immediate agreement, it can also be co-opted for rationalization: the model reasons toward a user-pleasing conclusion rather than reasoning toward the correct one. This is an active area of research and a known production risk for reasoning model deployments.",
    },
  ],
}