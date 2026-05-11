export const dataPrivacyAiGovernance = {
  slug: "data-privacy-ai-governance",
  title: "Data Privacy & AI Governance",
  summary:
    "PII in prompts, vendor data handling, GDPR/CCPA/EU AI Act implications, right to erasure, and how to build AI governance before legal forces you to.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["PM", "EM"] as const,
  tags: ["privacy", "governance", "compliance", "data"],
  order: 14,
  content: `## Data Privacy & AI Governance

Every time a user interacts with your AI feature, data moves. Understanding where it goes, who sees it, what your legal obligations are, and how to build systems that meet those obligations is no longer optional — it's a product requirement that compounds in complexity as you scale.

### The Core Problem: PII in Prompts

When users interact with AI features, they routinely include personal information without realizing it:

- "Summarize this email from my doctor about my diabetes diagnosis"
- "Draft a response to HR about my salary negotiation"
- "Review this contract for my home purchase at 42 Maple Street"
- "Help me write a message to my employee about their performance issues"

Each of these sends sensitive personal data — health information, financial details, location data, third-party personal information — to your AI provider's infrastructure. The user didn't explicitly consent to sharing this data with your vendor. In many cases, the third parties mentioned (the doctor, the employee) have no idea their information was transmitted.

This is the default state of most AI features. If you haven't designed around it, you have a compliance gap.

### Data Minimization: The Engineering Practice

Data minimization — collecting and transmitting only the data necessary for the task — is a legal requirement under GDPR and a practical risk reduction strategy. It's also an engineering practice, not just a policy position.

**Prompt construction hygiene:**
Before building a prompt, ask: what data does the model actually need to complete this task? A summarization feature doesn't need the user's account ID in the prompt. A customer service bot doesn't need the user's full purchase history for every query — only the relevant orders. Include only what's necessary; strip the rest.

**PII detection and redaction:**
For features that process user-provided text, consider running PII detection before sending to the model. Tools like Microsoft Presidio, AWS Comprehend, and Google DLP can identify and redact PII categories (names, emails, phone numbers, SSNs, health terms) before they leave your infrastructure.

Redaction tradeoffs: full redaction may make the text meaningless to the model; pseudonymization (replacing "John Smith" with "[PERSON_1]") often preserves enough context for the task while reducing exposure. Design the redaction strategy for your specific use case.

**Minimize context window contents:**
In RAG systems, retrieve only the chunks relevant to the specific query — not the full document. In conversation features, don't include full conversation history when only the last few turns are relevant. Every unnecessary piece of data in the prompt is data you're transmitting unnecessarily.

**Synthetic data for testing:**
Never use real user data in development or testing environments. Generate synthetic data that has the statistical properties of real data without being real. This eliminates an entire category of privacy exposure that commonly occurs when developers copy production data to local environments.

### What Happens to Data You Send

AI vendors vary significantly in how they handle your data. The answers to these questions determine your compliance posture.

**Training data use:**
Most enterprise tiers explicitly exclude your data from model training. Free and consumer tiers often opt you in by default. This distinction matters legally: if your data is used to train a model, deletion requests become technically complex (see Right to Erasure below), and you may be engaging in a "sale" of personal data under CCPA.

Verify in writing — not marketing copy, not the FAQ — what your tier includes. The contract controls, not the sales deck.

**Data retention:**
Providers vary from zero retention (prompts and completions are not logged) to 30-day default retention for abuse monitoring, to indefinite retention in some configurations. Know the default and whether it can be changed. Minimum retention that meets your vendor's abuse monitoring requirements is generally the right target.

**Data residency:**
Where data is processed matters under GDPR and for enterprise customers with data residency requirements. A US-based API processing EU user data requires either an adequacy decision covering that transfer or appropriate safeguards — typically Standard Contractual Clauses (SCCs). Providers like Anthropic, OpenAI, and Google offer EU-region deployments for enterprise customers; verify this isn't just marketing and is contractually guaranteed.

**Staff access:**
API calls may be reviewable by vendor staff for safety, quality, or legal purposes. Enterprise agreements often restrict or audit this access. Understand what you've agreed to and whether it's compatible with your obligations to users.

**Security posture:**
Beyond data processing terms, evaluate vendor security: SOC 2 Type II certification, ISO 27001, penetration testing cadence, bug bounty programs, and breach notification SLA. A vendor with strong DPA terms but poor security controls is still a risk.

### Regulatory Landscape

You don't need to be a lawyer. You need to know enough to identify when to involve one.

**GDPR (EU/EEA):**
- Processing personal data requires a legal basis: consent, legitimate interest, contract performance, legal obligation, or vital interests. "We want to improve our product" is not a legal basis. Identify and document your legal basis for each AI feature that processes personal data.
- Users have rights: access (what data do you hold about me?), rectification (correct errors), erasure (delete my data — see below), portability (give me my data in a usable format), and objection (stop processing my data).
- You must have a Data Processing Agreement (DPA) with any vendor that processes personal data on your behalf. This is not optional.
- Cross-border transfers of personal data outside the EEA require an adequacy decision or appropriate safeguards (SCCs, Binding Corporate Rules).
- AI-generated outputs about specific individuals may themselves constitute personal data under GDPR. A model that generates a psychological profile or behavioral prediction about a user is processing personal data even if the input didn't explicitly contain it.

**CCPA/CPRA (California):**
- Users can opt out of the "sale or sharing" of their personal information. Sharing data with an AI vendor for model training may qualify as a "sale" even without payment.
- Users can request deletion of their personal information — including data you've shared with vendors.
- You must disclose what categories of personal data you collect, for what purposes, and with whom you share it. AI vendor disclosure belongs in this list.
- Sensitive personal information (health data, precise geolocation, financial account data, racial/ethnic origin) has additional restrictions.

**EU AI Act (entered into force August 2024, phased application):**
Categorizes AI systems by risk and applies on a staggered schedule. Relevant for governance:
- **Prohibited uses (in effect February 2025):** Real-time biometric surveillance in public spaces (with narrow exceptions), social scoring, subliminal manipulation, predictive policing based solely on profiling, emotion recognition at workplaces and schools. These are absolute prohibitions already in force.
- **High-risk systems (rules apply August 2026):** Employment, education, credit, healthcare, law enforcement, critical infrastructure. Mandatory conformity assessment, bias audits, human oversight, transparency obligations, and registration in an EU database. Applies to any company deploying into the EU market. Organizations should be building toward compliance now.
- **General purpose AI (GPAI) model obligations (in effect August 2025):** If you fine-tune or deploy foundation models, transparency and copyright compliance obligations now apply.
- **Limited-risk systems (transparency rules apply August 2026):** Chatbots and AI-generated content must be disclosed as AI to users.

**Sector-specific regulations:**
HIPAA (US health data), FERPA (US education data), GLBA (US financial data), and their international equivalents layer on top of general privacy law. If your AI feature touches any of these domains, involve legal before shipping.

### The Right to Erasure as an Engineering Problem

GDPR Article 17 gives users the right to deletion of their personal data. For traditional databases, this is a solved problem. For AI systems, it's technically hard in ways most teams underestimate.

**The problem:** Personal data appears in multiple places in an AI system:
- Prompt logs and completion logs
- Vector database embeddings (if you've embedded user data for RAG)
- Fine-tuned model weights (if you trained on user data)
- Evaluation datasets (if you used production data for evals)
- Cached responses
- Backup systems

**Prompt and completion logs:** Deletable if you have a proper logging architecture with per-user data tagging. Build user-tagged logging from day one; retrofitting is expensive.

**Vector embeddings:** If you've embedded documents containing PII, deletion requires identifying all chunks that contain that user's data and deleting the corresponding vectors. This requires maintaining a mapping from user identity to vector IDs — design this before you build the index.

**Fine-tuned model weights:** If you trained on data that includes personal data and a user requests deletion, you may need to retrain or demonstrate that the specific data cannot be extracted. This is technically hard — models can memorize training examples, and there's no reliable way to "un-learn" a specific example short of retraining. The practical mitigation is not training on personal data without explicit consent and a clear legal basis.

**Practical architecture for erasure:**
- Tag all stored data with the user ID that generated it
- Maintain a deletion manifest — when data is deleted, record what was deleted and when
- Include AI logs and embeddings in your data deletion pipeline from day one
- Don't use personal data for fine-tuning without explicit consent and a deletion plan
- Include vendors in your deletion workflow: your DPA should require the vendor to delete data on your request

### RAG-Specific Privacy Risks

Retrieval-augmented generation introduces privacy risks distinct from simple prompt-and-response features.

**Cross-user data retrieval:** If your vector index contains documents from multiple users and your retrieval doesn't enforce access controls, a user's query may return chunks from another user's documents. A support bot that retrieves from all customer support tickets without per-user filtering is a data leakage risk.

**Embedding personal data:** When you embed documents containing PII and store those embeddings, you're creating a persistent representation of that personal data. Embeddings are not reversible in a meaningful sense, but they can be used to find similar content — which may reveal that a specific user's data is in your index. Treat embeddings of personal data with the same care as the underlying data.

**Retrieval of stale data after deletion:** If a user's data is deleted from your primary database but the corresponding vectors aren't deleted from your index, retrieval may still surface that data. Your deletion pipeline must include the vector store.

**Unintended context in generated responses:** A RAG system may retrieve and include PII from one user's documents in a response to another user's query — not through a bug, but through semantic similarity. A query about "lease agreements" may retrieve another user's lease if they're in the same index. Implement strict per-user and per-tenant retrieval filtering.

### Employee Data and Internal AI Tools

Internal AI tools — productivity assistants, HR tools, internal knowledge bases — are governed by a different but equally complex legal framework that teams often overlook.

**Employee data has different rules:** In the EU, processing employee data requires a legal basis (often legitimate interest or contractual necessity) and is subject to works council consultation requirements in many countries (Germany, Netherlands, France, others). An internal AI tool that processes employee communications or performance data may require works council approval before deployment.

**What employees send matters:** If your internal AI tool processes employee communications, it may capture sensitive HR discussions, confidential business strategy, personal health information shared with a manager, and more. Apply the same data minimization and vendor disclosure standards as consumer-facing features.

**Internal tools are not exempt from GDPR:** The regulation applies to employee data as much as customer data. "It's internal" is not a compliance justification.

### Vendor Evaluation Checklist

Before integrating any AI provider with user data:

**Legal and compliance:**
- [ ] Data Processing Agreement (DPA) available and signed
- [ ] Data retention period documented and configurable
- [ ] Training data opt-out confirmed in writing for your tier
- [ ] Data residency options match your requirements
- [ ] Cross-border transfer mechanism in place (SCCs or adequacy decision) for EU data
- [ ] Breach notification SLA specified in contract (GDPR requires 72-hour notification)
- [ ] Staff access to your data restricted or audited per contract

**Security:**
- [ ] SOC 2 Type II report available
- [ ] ISO 27001 certification (for enterprise requirements)
- [ ] Penetration testing cadence documented
- [ ] Vulnerability disclosure / bug bounty program in place
- [ ] Incident response process documented

**Operational:**
- [ ] Rate limits and capacity documented
- [ ] Model versioning and deprecation notice period specified
- [ ] Zero-retention mode available if required
- [ ] EU-region deployment available if required

If a vendor cannot answer these clearly, treat that as a risk signal — not just a compliance gap but a signal about organizational maturity.

### Building AI Governance

Governance doesn't require a dedicated team. It requires clear ownership, documented decisions, and processes that run without heroics.

**Designate an AI data owner.** One person (engineering lead, PM, or DPO) is responsible for knowing what data flows where across your AI features. Not a committee — a named individual with accountability.

**Maintain an AI data inventory.** A living document listing each AI feature, what data it sends to which provider, the legal basis for processing, the retention period, and the DPA status. Review it quarterly or when features change. This is also your starting point for a Subject Access Request (SAR) response.

**Define a sensitive data policy.** Which data categories require explicit review before being sent to any AI provider? At minimum: health data, financial account data, biometric data, data about minors. The policy should specify: who approves exceptions, what documentation is required, and what alternatives to consider (redaction, local processing, feature redesign).

**Document AI-specific risks in your privacy impact assessment (PIA/DPIA).** GDPR requires a Data Protection Impact Assessment for high-risk processing. AI features that process sensitive data, make automated decisions, or process data at scale likely qualify. The DPIA process forces the right questions before shipping.

**Review vendor agreements annually.** AI providers update their terms. Anthropic, OpenAI, and Google have each made significant changes to data handling terms in the past two years. What was true last year may not be true today. Put this on a calendar.

**Include AI in your incident response plan.** If an AI feature exposes user data — through a prompt injection attack, a logging misconfiguration, or a vendor breach — who is responsible for the breach notification? What's the timeline? What data was potentially exposed? These questions need answers before the incident, not during it.

**Model governance documentation.** For each significant AI feature, maintain a brief model card or feature data sheet: what the feature does, what data it uses, what vendor it relies on, known limitations and failure modes, and who owns it. This serves compliance, onboarding, and incident response.

### The Minimum Viable Governance Stack

If you have nothing today, build in this order:

1. **Audit:** List every AI vendor that receives user data. Include vendors used by features you've deprecated but not fully shut down.
2. **DPAs:** Get a signed DPA with every vendor on that list. This is non-negotiable for GDPR compliance.
3. **Privacy policy update:** Disclose AI data processing, vendor names, data categories shared, and retention periods. Users are entitled to this information.
4. **Retention minimization:** Set data retention to the minimum your vendor supports that still meets their abuse monitoring requirements.
5. **Data inventory:** Create the living document. Assign ownership.
6. **Incident response:** Add AI to your existing incident response runbook. Identify who gets called when an AI feature leaks data.
7. **Deletion pipeline:** Ensure user data deletion flows include AI logs, embeddings, and vendor deletion requests.

Governance built reactively — after a breach, a compliance audit, or an enterprise deal collapses — is always more expensive than governance built proactively. The cost of a DPA negotiation is trivial compared to the cost of a GDPR enforcement action or a lost enterprise contract.`,
  quiz: [
    {
      question: "A user requests deletion of their personal data. Your team has AI logs and a RAG vector index built from their documents. What makes this harder than a standard database deletion?",
      options: [
        "Vector embeddings are encrypted and cannot be deleted without the original encryption key stored at the provider",
        "Personal data exists in multiple locations — logs, vector embeddings, caches, backups — each requiring separate deletion, and vector stores must have user-to-vector-ID mappings to support this",
        "GDPR only requires deletion from primary databases, not from ML infrastructure like vector stores or inference logs",
      ],
      correct: 1,
      explanation: "The right to erasure is technically hard for AI systems because personal data propagates into multiple places: prompt logs, completion logs, vector embeddings, caches, and backups. For vector stores, you must maintain a mapping from user identity to all vector IDs representing their data. This mapping must be designed before building the index — retrofitting it is expensive.",
    },
    {
      question: "Your company is about to use a consumer-tier AI API to process customer support conversations. What must you verify before sending any data?",
      options: [
        "That the API supports streaming responses, since customer support requires low latency",
        "Whether your data will be used for model training and whether a Data Processing Agreement is available for your tier",
        "Whether the provider's model is listed on the EU AI Act conformity database for support automation systems",
      ],
      correct: 1,
      explanation: "Consumer tiers typically opt you in to training data use by default. GDPR requires a Data Processing Agreement with any vendor processing personal data on your behalf. Customer support conversations routinely contain PII, making these checks non-negotiable before launch. Verify both in writing from the contract, not from marketing materials.",
    },
  ],
}