export const aiBuildingBlocks = {
  slug: "ai-building-blocks",
  title: "AI Building Blocks",
  summary:
    "The vocabulary every practitioner needs — tokens, hallucination, embeddings, RAG, fine-tuning, agents, and the misconceptions that lead to bad AI decisions.",
  difficulty: "BEGINNER" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["foundations", "concepts", "basics", "vocabulary"],
  order: 2,
  content: `## AI Building Blocks

You'll encounter the same set of terms repeatedly when working with AI systems. Understanding them precisely — not just vaguely — changes how you design systems, diagnose failures, and evaluate vendor claims. This module covers the vocabulary and the misconceptions that most consistently lead teams astray.

### Core Vocabulary

**Tokens**

Tokens are the basic unit LLMs process — roughly 4 characters or ¾ of a word. "Hello world" is approximately 2 tokens. 1,000 tokens is approximately 750 words.

Why this matters:

- API pricing is per token. Every word in your system prompt is paid for on every request.
- Context window limits are measured in tokens. A 128K-token context window is roughly 96,000 words — about two novels.
- Non-English languages are often tokenized less efficiently, meaning the same content costs more tokens in some languages than in English.

**Hallucination**

Hallucination is when an LLM generates confident-sounding but factually incorrect information. It's not a bug in the traditional sense — it's a structural property of how these systems work. Models predict the most statistically likely next token; "most likely" is not the same as "true." When a model doesn't know something, it doesn't say so — it generates what sounds plausible.

Types of hallucination:
- Factual fabrication: inventing events, citations, statistics, names, or dates that don't exist
- Logical hallucination: reasoning that proceeds plausibly but reaches a wrong conclusion
- Subtle instruction failure: technically answering the question while missing a key constraint

Design principle: never deploy LLMs where a wrong answer is worse than no answer without a grounding mechanism (retrieval, citation, validation layer) or human review.

**Embeddings**

Embeddings convert text (or images, audio) into numerical vectors that capture semantic meaning. Concepts with similar meanings produce similar vectors. "Automobile" and "car" will have vectors close together in embedding space; "automobile" and "sandwich" will not.

Used in:
- Semantic search (finding relevant documents by meaning, not keyword match)
- Recommendation systems
- The retrieval layer in RAG systems

**RAG (Retrieval-Augmented Generation)**

RAG is a pattern where you retrieve relevant documents from a knowledge base and inject them into the prompt before asking the LLM to generate a response. Instead of relying on the model's training data alone, you give it specific, current, verifiable context.

Why RAG is usually the right answer to knowledge gaps:
- No retraining required — deploy in days, not months
- The source documents are inspectable and auditable
- Knowledge can be updated without touching the model
- Reduces hallucination on the specific domain covered by the retrieval set

RAG is not magic — retrieval quality determines output quality. If the retrieval system surfaces irrelevant chunks, the model generates irrelevant or wrong responses.

**Fine-tuning**

Fine-tuning means further training a pre-trained model on your specific data to specialize its behavior. It's expensive, requires ML expertise, and the results are hard to interpret. More importantly, it often underperforms well-crafted prompts plus retrieval.

When fine-tuning is actually warranted:
- You need a specific tone or format that prompting alone can't reliably produce
- You have thousands of high-quality (input, output) examples
- You've exhausted prompting and RAG approaches and measured their insufficiency
- You have the infrastructure to retrain when the base model updates

Fine-tune only with strong evidence it's necessary. Most teams reach for fine-tuning before exhausting simpler options.

**Prompt Engineering**

Prompt engineering is designing the instructions, context, and examples you provide to an LLM to get consistent, high-quality outputs. It's more impactful than most people expect — a carefully constructed prompt often outperforms fine-tuning on the same task, at a fraction of the cost.

Effective prompt engineering includes: clear task specification, relevant examples (few-shot prompting), explicit output format requirements, and handling of edge cases in the instructions.

Before building complex ML infrastructure, invest in prompting. The ceiling is higher than intuition suggests.

**Agents**

Agents are AI systems that take actions — browsing the web, running code, calling APIs, reading and writing files — in pursuit of a goal. They can chain multiple steps together autonomously.

Agents introduce failure modes that stateless chat doesn't have: wrong actions (deleting a file instead of reading it), loops (retrying the same failing action repeatedly), compounding errors (a wrong step early cascades into worsening downstream decisions), and irreversible side effects.

Design principle: match agent autonomy to your tolerance for unrecoverable errors. High-stakes, irreversible actions need human checkpoints.

**Multimodal**

Multimodal AI models accept input beyond text — images, audio, video, documents, and combinations of these. Most frontier models (GPT-4o, Claude 3.5, Gemini) are multimodal. This enables use cases like analyzing screenshots, processing recorded meetings, reading handwritten forms, and interpreting charts and diagrams.

### Common Misconceptions

These are the mental models that consistently lead to bad AI product decisions. Each one is worth internalizing before you're in a design review.

**"AI understands what you're saying"**

LLMs produce outputs that look like understanding — they can explain concepts, answer follow-up questions, and adapt to context. But the underlying process is statistical pattern matching across training data. There is no comprehension in the way humans experience it. This is why AI systems fail in surprising ways at the edges of their training distribution: there's no real understanding to fall back on.

The practical implication: don't assume the model understood your instruction just because it produced a plausible-looking response. Test edge cases. Verify outputs. Design for failures that shouldn't happen to a system that "understood."

**"More AI is always better"**

AI adds latency, cost, unpredictability, and operational complexity. For many tasks — classification, extraction, routing, formatting — a regex, a lookup table, or a deterministic rule is faster, cheaper, and more reliable. Use AI where the task genuinely requires handling language ambiguity or generating novel content. Don't use AI where a simpler system works.

**"Fine-tuning always improves results"**

Fine-tuning is expensive, requires expertise, and often underperforms well-crafted prompts. RAG usually solves domain knowledge gaps better. Fine-tune only when you have clear, measured evidence that prompting and retrieval won't work.

**"AI demos represent real-world performance"**

Demos are cherry-picked for the best-case scenario on clean, well-formatted inputs. Real performance depends on your specific data distribution, edge cases, failure tolerance, and operational context. Always evaluate on representative production examples — not the vendor's curated demos. Build your own evaluation set before making a purchase decision.

**"A higher accuracy score means good enough"**

99% accuracy sounds excellent. But 1% error on 100,000 daily transactions is 1,000 errors per day. Evaluate accuracy in the context of your volume, the cost of a wrong answer, and whether errors cluster on the most important cases or distribute randomly. An AI system that's 99% accurate on easy cases and 60% accurate on hard cases may perform worse than the number suggests on the inputs that matter most.`,
  quiz: [
    {
      question: "A team wants their AI assistant to answer questions about internal company policies. The policies are stored in a document system and updated regularly. Which approach is most appropriate?",
      options: [
        "Fine-tune the model on all current policy documents",
        "Build a RAG system that retrieves relevant policy documents and injects them into the prompt",
        "Include all policy documents in the system prompt for every request",
      ],
      correct: 1,
      explanation:
        "RAG is the right tool here: policies change regularly (no retraining needed), the source documents are inspectable and auditable, and retrieval can surface just the relevant sections rather than flooding the context. Fine-tuning bakes knowledge in at a point in time and requires retraining when policies change. Including all documents in every prompt is expensive and likely exceeds context limits.",
    },
    {
      question: "A vendor demo shows their AI answering every support question correctly with high confidence. What's the most important next step before purchasing?",
      options: [
        "Request a larger demo with more example questions from the vendor",
        "Evaluate the AI on your own representative support tickets, including edge cases and failure scenarios",
        "Ask for the model's accuracy score on the vendor's internal benchmark",
      ],
      correct: 1,
      explanation:
        "Vendor demos are curated for the best-case scenario. The only way to know if an AI will work for your specific use case is to test it on data that looks like your real workload — including the messy, ambiguous, or unusual inputs your users actually send. Vendor benchmarks measure vendor-selected tasks; your evaluation set measures your tasks.",
    },
  ],
}
