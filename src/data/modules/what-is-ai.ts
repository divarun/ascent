export const whatAiIs = {
  slug: "what-is-ai",
  title: "What Is AI",
  summary:
    "The three types of AI, how machine learning differs from traditional software, and what training vs. inference means for product teams — including the rise of reasoning models and inference-time scaling.",
  difficulty: "BEGINNER" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["foundations", "concepts", "basics"],
  order: 1,
  content: `## What Is AI

Before working with AI systems, you need two things: a clear mental model of what kind of AI exists today, and an understanding of how machine learning fundamentally differs from traditional software. Most AI product failures trace back to wrong assumptions in one of these two areas.

### The Three Types of AI

The term "AI" gets applied to systems that exist at very different levels of capability and reality.

**Narrow AI** is what exists today. Most of the AI products you've used — ChatGPT, Claude, Gemini, GitHub Copilot, Midjourney etc., are Narrow AI. Modern foundation models can perform many tasks: writing, coding, summarizing, translating, image generation, reasoning over documents, and more. The capabilities of these models have expanded dramatically — frontier reasoning models can now solve graduate-level math and science problems, and some have matched expert-level performance on programming competitions. But they remain narrow in an important sense: they do not possess robust, human-like general intelligence. They can fail unpredictably on problems that are genuinely outside their training distribution, and they lack the flexible, self-directed learning that characterizes human cognition.

**General AI (AGI)** refers to hypothetical systems that can reason across arbitrary domains the way humans do — learning entirely new skills, transferring knowledge flexibly between fields, adapting reliably to unfamiliar situations, and operating with broad autonomy. No AGI exists today. Whether current approaches can produce it, and when, remains an active and contested debate — though recent capability jumps have led some researchers to revise their timelines.

**Super AI** describes theoretical systems surpassing human intelligence across essentially all domains. Entirely speculative. Not relevant to practical product decisions today.

**Why this matters:** Vendors often describe AI systems as "understanding" documents, "reasoning" about problems, or "learning" from feedback. These terms are useful shorthand, but they can create misleading mental models. Current AI systems learn statistical patterns from massive datasets. Newer reasoning models produce more reliable, step-by-step outputs on complex problems — but they are still generating learned patterns, not reasoning from first principles the way humans do.

This matters most at the edges of a system's training distribution. A chatbot may appear highly competent on common customer requests while failing in surprising ways on rare or unusual cases. The system is generating outputs based on learned patterns, not grounded comprehension.

### How Machine Learning Works

Most AI systems you'll encounter at work are built using machine learning. Understanding how ML differs from traditional software explains many of the operational and product challenges teams run into.

**Traditional software** follows explicit rules written by developers. A programmer defines behavior directly: if the input matches condition A, do X; if it matches condition B, do Y; otherwise return an error. The system behaves according to logic humans explicitly specified.

**Machine learning** works differently. Instead of manually writing rules, developers provide examples: thousands or millions of (input, correct output) pairs. The model adjusts internal numerical parameters to improve its predictions over time. Rather than memorizing examples directly, it learns statistical patterns that allow it to generalize to new inputs it has never seen before.

The practical differences between these approaches are significant:

**Determinism:** Traditional software is usually deterministic — the same input reliably produces the same output. ML systems are probabilistic — outputs can vary even for the same input, especially with generative models.

**Failure modes:** Traditional software often fails explicitly through errors, exceptions, or crashes. ML systems frequently fail silently by producing plausible but incorrect outputs with high confidence.

**Debuggability:** Traditional software can often be debugged by inspecting the code and tracing logic paths. ML systems must be evaluated empirically using representative datasets and observed behavior.

**Adaptability:** Traditional software handles exactly the scenarios developers anticipated. ML systems generalize to new inputs — but they can also generalize incorrectly in ways that are difficult to predict ahead of time.

### Training vs. Inference

ML systems operate in two distinct phases. Confusing them causes real engineering and product mistakes.

**Training** is when the model learns from data. The system processes massive numbers of examples and adjusts internal parameters to minimize prediction error. Training is:

- Computationally expensive — frontier model training can cost millions to hundreds of millions of dollars in compute and infrastructure
- Slow — often requiring days or weeks on specialized hardware clusters
- Infrequent — performed occasionally when new data, architectures, or capabilities justify retraining

The output of training is a set of model weights: numerical parameters encoding what the model learned.

**Inference** is using the trained model to generate outputs for new inputs — what happens every time a user sends a message to your AI feature. Standard inference is fast (typically milliseconds to seconds per request) and much cheaper than training, though costs accumulate significantly at scale.

**The critical implication:** During normal inference, the model's weights do not change in response to the conversation. When a user chats with ChatGPT or Claude, the model is not learning from that interaction in real time. Correcting the model inside one conversation may influence subsequent responses in that session's context window, but it does not permanently change the model's behavior for future sessions or other users.

Persistent behavior changes require retraining, fine-tuning, or external systems layered around the model.

### Reasoning Models and Inference-Time Scaling

A significant development since 2024 has changed how inference works for a class of models: **reasoning models**.

Models like OpenAI's o-series and similar offerings from other labs use a technique called **inference-time scaling** (also called test-time compute). Instead of generating a single response immediately, these models spend extra compute at inference time — working through extended internal reasoning chains before producing a final answer. This allows them to catch errors, reconsider approaches, and arrive at more reliable outputs on difficult problems like math, coding, and multi-step logic.

This has two implications for product teams:

**On capability:** Reasoning models have meaningfully stronger performance on complex, structured tasks compared to standard models. The tradeoff is latency (responses take longer) and cost (more compute per request). For simple tasks — summarization, drafting, classification — standard models remain more cost-efficient. Reasoning mode is best reserved for high-stakes, logic-intensive tasks where quality matters more than speed.

**On the training/inference boundary:** Inference-time scaling doesn't change the fundamental rule — model weights are still fixed after training. Reasoning models apply more compute to each query, but they are still working from static learned parameters. The improvement comes from how that compute is allocated at query time, not from the model learning anything new.

This explains several things that commonly confuse product teams:

- You cannot fully fix a model's bad behavior simply by arguing with it in the prompt. Prompting can guide behavior significantly, but it cannot completely override patterns learned during training.
- Fine-tuning is useful when the base model consistently lacks behaviors or patterns your use case requires — but it is expensive, operationally complex, and often less effective than teams initially expect.
- Retrieval-Augmented Generation (RAG) is frequently a better solution for knowledge gaps because it injects relevant information at inference time without retraining the model.
- Many modern AI products are not "just the model." They often combine prompts, retrieval systems, memory layers, tool use, orchestration logic, and application code into a larger system.

Understanding the training/inference boundary gives you a useful framework for diagnosing failures:

"Is this a core model capability problem that requires training changes, or is it a retrieval, prompting, orchestration, or product design problem that can be fixed at deployment time?"`,
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
    {
      question: "Your team needs an AI feature to reliably solve complex, multi-step logic problems for users. Response time of 30+ seconds is acceptable, but errors are costly. Which model type is most appropriate?",
      options: [
        "A standard large language model with a detailed system prompt",
        "A reasoning model that uses inference-time scaling to work through problems step by step",
        "A fine-tuned model trained specifically on your problem domain",
      ],
      correct: 1,
      explanation:
        "Reasoning models are designed precisely for this tradeoff: they spend more compute at inference time to produce more reliable outputs on complex, structured problems. When latency is acceptable and accuracy is critical, they outperform standard models on multi-step logic tasks. Fine-tuning is useful for domain-specific style or knowledge, but doesn't inherently improve step-by-step reasoning reliability the way inference-time scaling does.",
    },
  ],
}