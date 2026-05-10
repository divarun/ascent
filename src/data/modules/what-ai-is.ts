export const whatAiIs = {
  slug: "what-ai-is",
  title: "What AI Is",
  summary:
    "The three types of AI, how machine learning differs from traditional software, and what training vs. inference means for product teams.",
  difficulty: "BEGINNER" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["foundations", "concepts", "basics"],
  order: 1,
  content: `## What AI Is

Before working with AI systems, you need two things: a clear mental model of what kind of AI exists today, and an understanding of how machine learning fundamentally differs from traditional software. Most AI product failures trace back to wrong assumptions in one of these two areas.

### The Three Types of AI

The term "AI" gets applied to a spectrum of things that don't exist at the same level of reality.

**Narrow AI** is what exists today. Every AI product you've used — ChatGPT, Claude, Gemini, GitHub Copilot, Midjourney — is Narrow AI. These systems perform specific tasks exceptionally well: generating text, recognizing images, transcribing speech, recommending content. They cannot transfer skills to domains outside their design. A model that excels at writing copy has no innate ability to play chess. A model trained to detect tumors in X-rays cannot read a contract.

**General AI (AGI)** refers to hypothetical systems that reason across arbitrary domains the way humans do — learning new skills, applying knowledge from one field to another, adapting to genuinely novel situations. No AGI exists. The field debates whether current approaches can ever produce it.

**Super AI** describes theoretical systems surpassing human intelligence across all domains. Entirely speculative. Not relevant to any decision you'll make this year or the next.

**Why this matters:** When vendors describe their AI as "understanding" your documents, "reasoning" about your problem, or "learning" from your feedback, these words are being used loosely. Current AI systems match statistical patterns at extraordinary scale. They produce outputs that look like understanding — often very convincingly — without the underlying comprehension that makes human cognition robust and generalizable.

This becomes a real problem at the edges of a system's training distribution. A chatbot that "seems to understand" customer intent works well on common queries and fails in surprising, hard-to-anticipate ways on rare ones — because there's no genuine understanding to fall back on.

### How Machine Learning Works

Most AI you'll encounter at work is built on machine learning. Understanding how ML differs from traditional software explains most of the failure modes teams run into.

**Traditional software** follows explicit rules. A developer writes code: if the input matches condition A, do X; if it matches condition B, do Y; otherwise return an error. The behavior is entirely determined by the code. If the input doesn't match any rule, the system fails explicitly — an exception, an error message, a clear signal that something went wrong.

**Machine learning** inverts this. Instead of writing rules, you provide examples: thousands or millions of (input, correct output) pairs. The ML system adjusts its internal parameters to get better at predicting the correct output. The result is a model that can handle inputs it's never seen before — because it learned the underlying pattern, not a lookup table.

The practical differences between these two approaches are large:

**Determinism:** Traditional software is deterministic — the same input always produces the same output. ML systems are probabilistic — the same input can produce different outputs, especially language models.

**Failure modes:** Traditional software fails loudly (errors, exceptions, crashes). ML systems fail silently — producing confident-looking wrong answers with no error signal.

**Debuggability:** Traditional software can be reasoned about by reading the code. ML behavior must be measured through evaluation on representative data.

**Adaptability:** Traditional software handles exactly what its rules cover. ML systems generalize to new inputs — but they also generalize incorrectly in ways you can't fully predict.

### Training vs. Inference

ML systems operate in two distinct phases. Confusing them causes real product engineering mistakes.

**Training** is when the model learns from data. The system is shown millions of examples and adjusts its internal parameters to minimize prediction error. Training is:

- Computationally expensive — frontier model training costs millions to tens of millions of dollars
- Slow — days to weeks on specialized hardware clusters
- Infrequent — happens once, then occasionally when new data warrants retraining

The output of training is a set of fixed model weights: numerical parameters encoding everything the model learned.

**Inference** is using the trained model to make predictions on new inputs — what happens every time a user sends a message to your AI feature. Inference is:

- Fast — milliseconds to seconds per request
- Cheap relative to training, but API costs accumulate significantly at scale
- Stateless — model weights don't change between requests

**The critical implication:** Model behavior is fixed at training time. When a user chats with Claude or ChatGPT, the model is not learning from that conversation in real-time. The weights are frozen. A user who corrects the model in one turn has not changed how it behaves for other users, or even for themselves in a future session. Changing the model requires retraining — a separate, expensive process.

This explains several things that confuse product teams:

- You cannot fix a model's bad behavior by complaining about it in the prompt. Prompting can guide behavior significantly, but it cannot override patterns baked in by training.
- Fine-tuning (retraining a model on new examples) is the right tool when the base model genuinely lacks the patterns you need — but it's expensive, requires expertise, and often underperforms good prompting.
- Retrieval-Augmented Generation (RAG) is often a better solution than fine-tuning for knowledge gaps, because it sidesteps retraining entirely by injecting relevant information at inference time.

Understanding the training/inference boundary gives you the right mental model for diagnosing failures: "Is this a model capability problem (requires training changes) or a prompting and retrieval problem (can be fixed in deployment)?"`,
  quiz: [
    {
      question: "A team is using a frontier LLM for customer support. They notice the model frequently gives wrong answers on a niche product category. Which approach is most appropriate to try first?",
      options: [
        "Retrain the model from scratch on internal product documentation",
        "Add a retrieval layer that pulls relevant product docs into the context before generating a response",
        "Switch to a larger model, since more parameters means better recall",
      ],
      correct: 1,
      explanation:
        "Knowledge gaps are almost always best addressed with retrieval (RAG) before resorting to fine-tuning or model changes. RAG injects relevant, up-to-date information at inference time — no retraining required, deployable quickly, and the source documents are inspectable. Fine-tuning is expensive, slow, and often underperforms good prompting plus retrieval.",
    },
    {
      question: "A user reports that after correcting the AI assistant in their chat session, it continued making the same mistake with other users. What best explains this?",
      options: [
        "The model's memory was not enabled for this session",
        "Model weights are fixed after training; a conversation doesn't change how the model behaves for other users",
        "The correction was not explicit enough to override the model's behavior",
      ],
      correct: 1,
      explanation:
        "ML models don't learn from individual inference requests. The weights are fixed after training. A correction in one conversation affects only that session's context — it has no effect on the underlying model or other users' sessions. Changing model behavior for everyone requires retraining or fine-tuning.",
    },
  ],
}
