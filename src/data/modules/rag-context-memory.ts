export const ragContextMemory = {
  slug: "rag-context-memory",
  title: "RAG, Context, and Memory",
  summary:
    "How retrieval-augmented generation works, why chunking and retrieval quality matter more than the model, hybrid search, reranking, evaluation, and the difference between memory and retrieval.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["EM", "IC"] as const,
  tags: ["architecture", "rag", "embeddings", "retrieval"],
  order: 10,
  content: `## RAG, Context, and Memory

LLMs have a fixed training cutoff and no persistent memory. RAG (Retrieval-Augmented Generation) is the primary pattern for connecting them to proprietary or recent data. Understanding it well — not just the basic loop, but where it breaks and how to fix it — is essential for building reliable AI features.

### The Problem RAG Solves

An LLM knows what it was trained on — nothing more. If you need it to work with your internal documentation, events after its training cutoff, customer records, or any proprietary data you haven't fine-tuned into the model, you need to retrieve the relevant information and inject it into the prompt.

RAG does this systematically. The model answers questions by reasoning over retrieved context rather than relying on what it memorized during training. This also makes answers verifiable — you can show users the source documents the answer came from.

### Before You Build: Three Questions Worth Answering

Teams reach for RAG early because it sounds like the right pattern. Before committing to a retrieval pipeline, three questions are worth answering explicitly — because each has a cheaper answer than RAG.

**Does your data actually fit in the context window?** A 50-page document is roughly 25,000 tokens. Most current model context windows can hold it directly. If your data is small enough to include wholesale, do that first — no retrieval complexity, no retrieval failures, no freshness lag. Test whether direct inclusion outperforms retrieval before building a pipeline.

**Is retrieval actually the bottleneck?** RAG gives the model more information. If the problem is that the model reasons poorly about information it already has, more information won't fix that — a better prompt, a more capable model, or structured output constraints will. Diagnose before building.

**Do you have what it takes to maintain freshness?** A RAG system whose index is stale answers confidently from outdated information. Maintaining freshness requires an ingestion pipeline that keeps up with source changes — update detection, re-chunking, re-embedding, deletion when source documents are removed. Factor in ongoing operational cost, not just initial build cost.

If you can answer all three questions and RAG is still the right call, build it. The section below covers how to build it well.

### How RAG Works: The Full Pipeline

\`\`\`
INGESTION (offline)
Documents → Preprocessing → Chunking → Embedding → Vector Store

RETRIEVAL (online, per query)
User query → Query transformation → Embedding → Vector search
           + Optional metadata filtering
           + Optional hybrid search (keyword + vector)
           → Candidate chunks → Reranking → Top-N chunks

GENERATION
System prompt + Retrieved chunks + User query → LLM → Response + Citations
\`\`\`

Most explanations cover only the middle path. The ingestion quality and the retrieval quality — chunking strategy, hybrid search, reranking — determine 60–70% of overall RAG system quality. The generation step matters less than teams assume.

### Embeddings and Embedding Model Selection

An embedding is a vector (list of numbers) encoding the semantic meaning of text. Texts with similar meanings have similar vectors. This enables semantic search — "How do I reset my password?" and "I forgot my login credentials" retrieve the same document even without shared keywords.

**Embedding model selection matters.** Different embedding models produce vectors of different quality and dimensionality. The MTEB (Massive Text Embedding Benchmark) leaderboard is the standard reference for comparing embedding models across retrieval tasks.

Key selection criteria:
- **Retrieval performance on your domain:** General-purpose benchmarks don't predict domain-specific performance. Test on samples from your actual document corpus.
- **Dimensionality:** Higher-dimensional embeddings capture more nuance but cost more to store and search. 1536-d (OpenAI) and 768-d (many open models) are common. Matryoshka embedding models (like text-embedding-3-large) support truncating to smaller dimensions with minimal quality loss.
- **Max token length:** Embedding models have their own context limits, typically 512–8192 tokens. Chunks longer than the limit are truncated — embedding model context limits are a separate constraint from generation model context limits.
- **Multilingual support:** If your documents or queries span languages, verify the embedding model handles all relevant languages well.
- **Cost:** Embedding is typically 10–100x cheaper than generation. It still costs real money at scale if you're reindexing frequently.

**Embedding models are separate from generation models.** Choosing a "better" generation model doesn't improve retrieval quality. These are independent optimization levers.

### Chunking: More Important Than It Looks

How you split documents into chunks is the most underappreciated quality lever in RAG systems. Retrieval quality is bounded by chunk quality.

**The tradeoffs:**
- **Too large:** Embeddings dilute — a 2,000-token chunk embedding captures the average meaning, not the specific meaning. Retrieved chunks fill context faster and may include irrelevant content.
- **Too small:** Relevant information is split across multiple chunks. Retrieval finds a fragment but misses the context needed to answer correctly.

**Chunking strategies:**

**Fixed-size with overlap:** Split every N tokens with M tokens of overlap. Simple, predictable. Overlap prevents information loss at boundaries. Good starting point; not optimal for structured documents.

**Sentence/paragraph-level:** Split on natural language boundaries. Respects semantic units better than fixed-size. Can produce very short chunks that lack context.

**Hierarchical (parent-child):** Embed small chunks (sentences, paragraphs) for precise retrieval, but return the surrounding larger chunk (section, page) to the model for context. Retrieval precision comes from the small chunk; generation quality comes from the larger context. Commonly called "small-to-big" retrieval.

**Document-structure-aware:** Split on headings, sections, and document boundaries. Keeps logically related content together. Requires document structure to be parseable — works well for Markdown, HTML, and structured PDFs; less well for scanned documents or unstructured text.

**Semantic chunking:** Use an embedding model to detect where topic changes occur and split there, rather than at fixed boundaries. Better semantic coherence; higher preprocessing cost.

There is no universally correct strategy. Test multiple approaches on your actual documents and queries. Measure retrieval quality — not just end-to-end answer quality — to isolate the effect of chunking changes.

### Retrieval: Dense, Sparse, and Hybrid

**Dense retrieval (vector/semantic search):** The standard embedding-based approach. Best for semantic similarity — finding documents that mean the same thing as the query even with different wording. Struggles with exact term matching, numeric identifiers, and rare terminology.

**Sparse retrieval (BM25/keyword):** Classic term-frequency-based search. Best for exact matches — product codes, proper nouns, specific technical terms, ID numbers. Misses semantic similarity.

**Hybrid search:** Combine dense and sparse retrieval scores. Each retrieves a candidate set; a fusion step (typically Reciprocal Rank Fusion — RRF) combines the ranked lists. Consistently outperforms either approach alone on most real-world retrieval tasks. The overhead is modest; the quality improvement is reliable.

Most production RAG systems should use hybrid search. Starting with dense-only retrieval is reasonable for getting started; switching to hybrid when you identify retrieval gaps is the expected path.

### Reranking: The Highest-ROI RAG Improvement

Vector similarity search retrieves candidates based on embedding similarity, which is a fast but approximate signal. A reranker re-scores retrieved candidates using a more computationally expensive but higher-quality model, then returns only the top results.

**How it works:**
1. Vector search retrieves top-50 or top-100 candidate chunks (fast)
2. A cross-encoder reranker scores each candidate against the query more carefully (slower, but only on 50–100 chunks)
3. Top 3–5 reranked chunks go to the generation model

Cross-encoder rerankers (like Cohere Rerank, BGE Reranker, or cross-encoder models from Sentence Transformers) directly compare the query and document together, capturing relevance signals that embedding similarity misses.

**Why this works:** Embedding models encode query and document independently — the similarity is computed between two separate vectors. Cross-encoders encode them together, capturing interaction effects. This is more accurate but too slow to run on an entire corpus; hence the two-stage pipeline.

**Expected improvement:** Reranking consistently improves answer quality on RAG systems, often substantially. If you're not using a reranker, it's likely the highest-ROI improvement you can make to an existing RAG pipeline.

### Query Transformation

The user's query is often not the best retrieval query. Users write conversational questions; documents contain answers written differently. Query transformation bridges this gap.

**Query expansion:** Generate multiple reformulations of the query and retrieve with each. Union the results. Improves recall for queries that can be expressed multiple ways.

**HyDE (Hypothetical Document Embeddings):** Ask the LLM to generate a hypothetical document that would answer the query, then embed and retrieve based on that hypothetical document rather than the query directly. Documents are more similar to documents than questions are to documents — this often improves retrieval for question-answering systems.

**Step-back prompting:** For complex queries, first retrieve context on the broader concept, then retrieve context on the specific question. Helps when the specific question requires background context to answer correctly.

**Conversation-aware query rewriting:** In multi-turn conversations, the user's message often omits context from earlier turns ("What about the return policy?" without specifying which product). Rewrite the query incorporating conversation history before retrieval.

These techniques add latency and cost (extra LLM calls). Apply them selectively when retrieval quality on baseline queries is insufficient.

### Metadata Filtering

Vector similarity alone is insufficient for many production RAG systems. Metadata filtering — combining vector search with structured attribute filters — is essential for:

**Multi-tenancy:** Ensuring user A's query only retrieves from user A's documents. Without this, your RAG system is a data leakage risk. Never allow vector search to cross tenant boundaries without explicit filtering.

**Access control:** Restricting retrieval to documents the current user is authorized to see.

**Recency and freshness:** Filtering to documents created or updated within a time window. Useful when recent documents should be prioritized.

**Document type and source:** Restricting retrieval to specific document types, departments, or source systems.

**Implementation:** All major vector databases support metadata filtering alongside vector search. Store document metadata at ingestion time as structured attributes alongside the embedding. Design your metadata schema before ingesting documents — retrofitting metadata is expensive.

### Ingestion Pipeline Design

The ingestion pipeline determines the quality of everything downstream. A well-designed pipeline:

**Preprocessing:**
- Extract clean text from source formats (PDF, HTML, DOCX). Quality varies significantly by extraction tool — test on your actual document types. PDFs especially vary widely in extraction quality.
- Normalize formatting: remove excessive whitespace, header/footer artifacts, and boilerplate that appears in every document and adds noise to embeddings.
- Preserve document structure metadata: source URL, document title, section, creation date, author, access controls.

**Update and deletion handling:**
When source documents are updated, you need to update the corresponding chunks in your vector store. This is more complex than ingestion: a document update may add, remove, or modify chunks whose boundaries have shifted. Strategies: delete all chunks for a document and re-ingest, or use document hashing to detect changes.

Deletion is equally important. If a document is deleted or access is revoked, the corresponding chunks must be removed from the index. Stale chunks produce incorrect answers and potential data exposure. Design your deletion pipeline before you need it.

**Freshness monitoring:** Track ingestion lag — how long between a source document update and the vector store reflecting that update. Stale indexes produce confidently wrong answers about recently changed information.

### RAG Evaluation

The most important architectural insight for RAG: retrieval quality and generation quality are separate problems that require separate measurement.

**Retrieval metrics:**
- **Recall@K:** Of all relevant chunks for a query, what percentage are in the top-K retrieved results? Tests whether the right content is reachable.
- **Precision@K:** Of the top-K retrieved chunks, what percentage are actually relevant? Tests whether retrieved content is signal or noise.
- **MRR (Mean Reciprocal Rank):** How highly is the first relevant result ranked? Matters when you only pass top-1 or top-3 to the model.

**Generation metrics (with retrieved context):**
- **Faithfulness:** Does the generated answer contain only claims supported by the retrieved chunks? An answer that's factually correct but not grounded in retrieved context is a faithfulness failure — the model is using memorized knowledge, which may be wrong in your domain.
- **Answer relevance:** Does the answer actually address the question asked?
- **Context relevance:** Were the retrieved chunks actually relevant to the question? This is a retrieval quality metric measured at generation time.

**The RAGAS framework** operationalizes these metrics and is worth examining for systematic RAG evaluation. It provides automated scoring for faithfulness, answer relevance, context recall, and context precision.

**Why separate evaluation matters:** A RAG system failing to answer correctly could be failing because: the right chunk wasn't retrieved (recall problem), the wrong chunks were retrieved and confused the model (precision problem), the right chunks were retrieved but the model reasoned incorrectly (generation problem), or the information isn't in the document set at all. You can't fix the right thing without measuring the right thing.

### Hallucination and Grounding

RAG reduces hallucination by giving the model correct information to reason from. It doesn't eliminate it.

**What RAG doesn't prevent:**
- Reasoning errors on retrieved content — the model can misread or misinterpret what it retrieved
- Queries where the answer isn't in the document set — the model may fabricate rather than say it doesn't know
- Contradictions between retrieved documents — the model has to resolve these, and may do so incorrectly
- Faithfulness failures — the model generating claims that go beyond the retrieved context

**Grounding prompts:** Explicitly instruct the model to base its answer only on the provided context: "Answer using only information from the provided documents. If the documents don't contain the answer, say so explicitly. Do not use knowledge from outside the provided context." This reduces but doesn't eliminate hallucination.

**Citation design:** Surface source chunks alongside answers. This is both a trust feature and a safety mechanism — users can verify claims, and incorrect answers are catchable before they propagate. Design citation UI from the start; retrofitting it is harder than building it in.

**Confidence calibration:** For queries where retrieved context is sparse or low-relevance, signal this to the user. "I found limited information about this" is more honest than a confident answer assembled from tangentially relevant chunks.

### Memory vs. Retrieval

These are different architectures that solve different problems and are frequently confused.

**Retrieval (RAG):** Fetching from a document corpus at query time. Scales to millions of documents. Quality depends on retrieval pipeline quality. Stateless — each query is independent.

**Conversation memory (in-context):** Including prior conversation turns in the context window. Technically simple — prepend prior messages. Hits context limits for long conversations; older turns get truncated or summarized. The model has perfect recall of what's in context but no recall of what's been truncated.

**Long-term / episodic memory:** Persisting information across sessions. User preferences, past decisions, prior conversation summaries. Typically implemented as structured storage (key-value or relational) for explicit facts, or retrieval-based for fuzzy recall of past conversations. Requires explicit decisions about what to store, when to retrieve, and when to forget.

**Semantic memory:** A retrievable knowledge base about the user or domain that accumulates over time. Different from episodic (what happened) — this is conceptual (what is known). Implemented as RAG over user-specific or domain-specific accumulated knowledge.

**Why the distinction matters when debugging:** "It forgot what I told it earlier" could mean: the information was truncated from the context window (in-context memory limit), the retrieval step didn't surface the relevant prior memory (retrieval quality problem), or the memory was never stored in the first place (storage pipeline gap). Each has a different fix.

### Agentic and Multi-Hop RAG

Standard RAG retrieves once and generates once. More complex use cases require multiple retrieval steps.

**Multi-hop retrieval:** Some questions require synthesizing information from multiple documents that aren't directly connected. "What is the relationship between policy X and the outcomes described in report Y?" may require retrieving from both, then synthesizing. Single-step retrieval finds one or the other but not both in context simultaneously.

**Agentic RAG:** The model decides what to retrieve, retrieves it, reasons about whether the retrieved content is sufficient, and retrieves again if needed. Implemented as a tool-use loop where the model calls a retrieval function as a tool. Substantially more powerful than fixed retrieval — the model can pursue the information it needs rather than relying on a single retrieval step to anticipate its needs.

**When to use multi-hop or agentic RAG:** When single-hop retrieval consistently fails to provide sufficient context for complex questions. The overhead (latency, cost, complexity) is real. Start with single-hop, measure failure modes, and add complexity only where the failure data justifies it.

### Vector Database Selection

The vector database is the retrieval infrastructure. Selection criteria:

**Hosted/managed options (Pinecone, Weaviate Cloud, Zilliz):** No infrastructure management; higher per-query cost at scale; faster to start. Appropriate for early-stage products and teams without infrastructure expertise.

**Self-hosted options (Qdrant, Weaviate, Milvus, Chroma):** Full control; lower per-query cost at scale; operational overhead. Appropriate for high-volume workloads or data residency requirements.

**Postgres-based (pgvector, Supabase):** Vector search in your existing Postgres database. Sufficient for most use cases up to a few million vectors. Simplest operational model if you're already on Postgres. Performance degrades at very high scale compared to dedicated vector databases.

**Selection criteria beyond infrastructure:**
- **Metadata filtering support:** All production RAG systems need this; verify it works at your scale
- **Hybrid search support:** Built-in BM25 or sparse vector support simplifies the hybrid search implementation
- **Index update latency:** How quickly do newly ingested documents become searchable?
- **Consistency guarantees:** Does the database guarantee that a newly inserted vector is immediately queryable?

For most teams starting out: pgvector if you're on Postgres, Chroma or Qdrant for a dedicated vector store. Migrate to a higher-scale option when you have the volume to justify it.

### When RAG Isn't the Answer

**If your data fits in the context window:** Include it directly. No retrieval complexity, no retrieval failures. A 50-page document at ~25,000 tokens fits comfortably in most modern context windows. Test whether direct inclusion produces better results than RAG before building a retrieval pipeline.

**If your queries are highly structured:** Traditional database queries or keyword search may outperform embedding search for exact lookups, numeric filters, and structured data. RAG adds complexity that a SQL query doesn't need.

**If your data changes constantly:** Ingestion pipelines must keep up with source changes. High-frequency updates (real-time data feeds, live databases) require near-real-time ingestion architectures. Factor in freshness requirements before designing the system.

**If the bottleneck is reasoning, not knowledge:** RAG provides context; it doesn't improve the model's reasoning ability. If your use case requires complex multi-step inference on data the model already has, better prompting or a more capable model addresses the problem more directly than better retrieval.

### Who Owns This in Six Months?

RAG systems degrade silently. This is one of the most important facts about them in production.

When the ingestion pipeline falls behind, documents become stale and answers become confidently wrong about recent changes. When chunk quality drifts — because source document formatting changed and nobody updated the chunking logic — retrieval recall drops. When the model provider updates their embedding model, your existing embeddings are now from a different model than your query embeddings, and similarity scores become unreliable.

None of these failures produce obvious errors. They produce slightly worse answers that users either attribute to AI limitations and accept, or gradually stop trusting and don't report.

**What ownership requires:**

Freshness monitoring — a dashboard or alert that tracks ingestion lag between source document updates and vector store updates. Anything beyond a few hours of lag for a knowledge-critical system should trigger investigation.

Retrieval quality monitoring — periodic evaluation of retrieval recall on a golden query set. Not just end-to-end answer quality, but whether the right chunks are actually being retrieved. This is the metric most commonly absent from production RAG systems.

An owned ingestion runbook — documented process for what happens when a source system changes format, when a document type is added, when access permissions change. Without this, the team discovers these failures when customers report wrong answers.

Before shipping a RAG system, define: who owns freshness? Who owns retrieval quality? Who gets paged when the ingestion pipeline stalls? If the answer to any of these is "whoever's on call" or "we'll figure it out," you have undifferentiated ownership, which means no one owns it.`,
  quiz: [
    {
      question: "A RAG system consistently retrieves the correct documents but the generated answers are still frequently wrong. What should you investigate first?",
      options: [
        "Chunk size — documents are likely too large, causing embedding dilution and poor semantic matching",
        "Generation faithfulness — the model may be reasoning incorrectly on retrieved content or using memorized knowledge instead",
        "Embedding model — the retrieval model may not support the document's language",
      ],
      correct: 1,
      explanation: "RAG evaluation requires separating retrieval quality from generation quality. If retrieval recall is high but answers are still wrong, the problem is in generation: the model may be misreading retrieved content, contradicting it with memorized knowledge, or hallucinating beyond what the documents support. Faithfulness is the key metric to measure here.",
    },
    {
      question: "Why does hybrid search (combining dense vector search and BM25 keyword search) consistently outperform either approach alone?",
      options: [
        "Hybrid search uses larger context windows, allowing more documents to be evaluated per query",
        "Dense search handles semantic similarity while sparse search handles exact term matching; each covers the other's blind spots",
        "Hybrid search applies a reranker automatically, which is the primary source of quality improvement",
      ],
      correct: 1,
      explanation: "Dense (vector) retrieval excels at semantic similarity — finding documents that mean the same thing with different wording. Sparse (BM25/keyword) retrieval excels at exact term matching — product codes, proper nouns, specific identifiers. Real queries contain both types. Hybrid search with Reciprocal Rank Fusion combines both ranked lists and consistently outperforms either alone.",
    },
  ],
}