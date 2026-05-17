export const aiMediatedDiscovery = {
  slug: "ai-mediated-discovery",
  title: "Product Explainability for AI-Mediated Discovery",
  summary: "How AI systems evaluate, rank, and recommend products before humans ever see them — and what this means for PMs building products that need to be discovered in an AI-mediated world.",
  difficulty: "ADVANCED" as const,
  roles: ["PM"] as const,
  tags: ["product", "discoverability", "search", "strategy"],
  order: 25,
  content: `## Product Explainability for AI-Mediated Discovery

The first place many users encounter your product is no longer your website, your app store listing, or an ad. Increasingly, it's a response from an AI system — a chatbot that was asked "what tools handle X," a buying agent that compared options before presenting a shortlist, a search engine that synthesized the first three results into a paragraph and linked one or two sources.

These AI systems are making evaluation decisions about your product before the user ever sees it. Understanding how they work — and designing your product and its information surface to be legible to them — is becoming a core PM competency.

### The Core Shift: Evaluation Before Discovery

Traditional product discovery follows a human attention model: a user sees your product in a list, browses your landing page, reads some copy, maybe checks a review, and decides whether to explore further. The evaluation is sequential and human-paced.

AI-mediated discovery works differently. An AI system is asked to recommend, compare, or evaluate products. It retrieves information about your product from structured and unstructured sources, synthesizes that information, and presents a conclusion — often with a recommendation baked in. The user may never visit your site before forming an opinion based on the AI's synthesis.

This means:

- The AI's evaluation criteria are different from a human's browsing behavior
- The quality of your structured data matters more than the quality of your emotional copywriting
- Consistency of your product information across authoritative sources matters — inconsistencies are a trust signal the AI penalizes
- Factual claims can be cross-referenced; marketing language that isn't backed by specific claims scores poorly
- The user may never read your full landing page; the AI already summarized it

For most product teams, this shift is invisible until it's a problem. The PM who understands it early has a significant advantage in ensuring their product is findable and recommended in an AI-mediated world.

### How AI Systems Evaluate Products Differently from Humans

Human attention is drawn to narrative, design, social proof, and emotional resonance. An AI system retrieving and synthesizing product information is optimized for different signals.

**Structured data trumps unstructured copy.** An AI retrieval system extracts structured facts efficiently: integrations, pricing tiers, compliance certifications, API availability, language support, character limits. Unstructured marketing language like "the most intuitive platform" is not a claim the system can verify or use. "SOC 2 Type II certified" is. "Integrates with Salesforce, HubSpot, and Zapier" is. "Native mobile apps for iOS 15+ and Android 11+" is.

**Factual consistency is a trust signal.** AI systems often aggregate from multiple sources: your website, G2, Capterra, press releases, documentation, product changelog, and third-party review sites. If your pricing page says one thing, your G2 listing says something different, and your Crunchbase entry has outdated information, the inconsistency degrades the AI's confidence in synthesizing your product. Accurate, consistent information across sources is more legible to AI retrieval systems than well-designed but inconsistent single-source information.

**Claims are checked against corroborating evidence.** A generic claim ("enterprise-grade security") is weak because it's ubiquitous and unverifiable. A specific claim ("AES-256 encryption at rest, SOC 2 Type II audit report available") is strong because it is specific, checkable, and corroborated by the compliance certification if that certification appears in other sources. AI systems weight specific, corroborated claims more heavily than broad uncorroborated marketing language.

**Recency matters.** AI systems that retrieve real-time or near-real-time information weight recent signals. A product changelog updated six months ago, a G2 review profile with no reviews in the past year, or a documentation site with dead links are recency signals that work against you.

### Structured Data and Knowledge Bases

The technical infrastructure that makes products AI-legible is structured data: schema.org annotations, product knowledge graphs, API documentation in standard formats, and machine-readable metadata.

**Schema.org.** Schema.org markup allows you to embed structured, machine-readable descriptions of your product directly in your web pages. Product schema, organization schema, review schema, FAQ schema, and software application schema all create structured facts that AI crawlers can extract reliably. A PM who has pushed for schema.org implementation has made their product surface more legible to every AI retrieval system that crawls the web.

**Product catalogs and data feeds.** For e-commerce and marketplace products, structured product feeds (Google Merchant Center, Meta Catalog, Amazon product listings) are the canonical structured data layer that AI shopping systems use. The quality, completeness, and accuracy of your product data in these catalogs directly affects how AI shopping agents evaluate and present your product.

**Knowledge graph presence.** Wikipedia entries, Wikidata records, and LinkedIn company pages are sources that AI systems treat as authoritative. A company with a well-maintained Wikipedia article that accurately describes its products gets cited more often than a company without one. This is not gaming Wikipedia — it's ensuring that accurate, structured information about your product exists in authoritative sources.

**API documentation.** For developer tools and B2B SaaS, the quality and structure of your API documentation is an AI legibility signal. OpenAPI/Swagger specifications, well-structured README files, and developer documentation with concrete code examples are all more retrievable and synthesizable by AI systems than unstructured prose product descriptions.

### The New Form of SEO: Being Cited in LLM Responses

Traditional SEO optimizes for ranking on search engine results pages. AI-mediated discovery requires optimizing for a different outcome: being cited in AI-synthesized responses.

The factors that drive LLM citation are different from the factors that drove traditional search ranking:

**Authoritative sources over PageRank.** LLMs trained on web data weight sources that appeared frequently in training data and in contexts where they were cited authoritatively. For B2B SaaS, this means Gartner reports, G2 category pages, TechCrunch coverage, and analyst citations. For consumer products, this means major review publications, Reddit threads in relevant communities, and expert review sites.

**Specificity and factual density.** Content that is cited by AI systems tends to be specific, factually dense, and clearly structured. A blog post with specific benchmarks, named integrations, concrete pricing ranges, and clear capability claims is more likely to be cited than a post with generic statements.

**Accuracy and recency.** LLMs are increasingly augmented with real-time retrieval. Outdated information that contradicts current product reality is a liability — the AI may retrieve old pricing, deprecated features, or past company information and present it as current.

**Consistent entity presence.** Your company name, product name, and key claims should appear consistently across authoritative sources. Inconsistency in how your product is named or described makes it harder for AI systems to build a coherent entity model of your product.

### AI Buying Agents: How They Evaluate Products

AI buying agents — Perplexity Shopping, Claude with web browsing enabled, GPT-4o with search, and dedicated procurement AI tools — make purchase comparisons before presenting a shortlist to a human buyer.

These systems are not browsing your website the way a human does. They are:

1. Extracting structured facts about your product (pricing, features, integrations, certifications)
2. Cross-referencing those facts against third-party sources (review sites, analyst reports, news coverage)
3. Comparing your product against competitors on specific dimensions the buyer requested
4. Synthesizing a recommendation with specific reasons

What this means for your product information surface:

**Pricing clarity is disproportionately important.** "Contact us for pricing" is an AI-evaluation dead end. The agent cannot compare you to competitors on price. If your product is enterprise-only and custom pricing is legitimate, make that explicit and explain the value drivers. If you have transparent pricing, make sure it's structured and current.

**Comparison dimensions must be explicitly covered.** If buyers commonly compare your product on security certifications, language support, uptime SLA, mobile app availability, or API rate limits, those facts need to be explicitly stated in structured, retrievable form. If the AI cannot find the fact, it defaults to "information not available" — which reads as a gap relative to a competitor who stated the same fact clearly.

**Third-party reviews are the trust layer.** G2, Capterra, Trustpilot, and App Store ratings are source data for AI buying agents. Not just the aggregate score — the text of the reviews. If 30 G2 reviews mention that your onboarding is slow, that pattern will appear in AI syntheses of your product. The review ecosystem is part of your AI-legible product surface.

### What "Explainability" Means for PM Decisions

For PMs building products that use AI internally (recommendations, rankings, personalization), explainability has a different but related meaning: can you explain to a user, a regulator, or an internal stakeholder why the AI made a specific decision?

**Why did the AI recommend Product A over Product B?** If your product uses an AI ranking system — for search results, recommendations, pricing, or content distribution — and you cannot answer this question about a specific case, you have an explainability problem. Users who receive outcomes they don't understand trust the system less and escalate more. Internal stakeholders who cannot audit AI decisions cannot identify when the system is working poorly.

**How do you audit your AI's recommendations?** A production AI system that cannot be audited is a liability. Auditing means: given a set of inputs, you can trace why a specific output was produced, verify that the reasoning is consistent with your intended policy, and identify cases where the system is producing outputs you didn't intend.

**How do you let users understand AI-mediated rankings?** The practical PM decision is: what level of explanation does the user need? For high-stakes decisions (job candidate ranking, medical risk stratification, credit scoring), users need meaningful explanations. For low-stakes decisions (playlist ordering, ad placement), "you might like this" is often sufficient. The answer depends on stakes, user expectations, and regulation.

**The regulatory angle: EU AI Act.** The EU AI Act (applicable to products operating in EU markets) creates transparency obligations for certain high-impact AI uses. High-risk AI systems — including those used in hiring, credit, education, and healthcare — must provide meaningful explanations of automated decisions to affected individuals. "The AI decided" is not compliant. PMs building in regulated domains need to design explainability into the system architecture, not retrofit it later.

### For B2B SaaS: How Enterprise AI Tools Evaluate Vendors

Enterprise procurement increasingly involves AI tools that aggregate vendor intelligence: Gartner Peer Insights, G2 Grid Reports, Forrester Wave evaluations, and internal procurement tools that synthesize analyst coverage, customer reviews, and pricing intelligence.

For your product to be well-positioned in this layer:

**G2 and Gartner presence matters.** These platforms are explicitly cited by enterprise AI procurement tools. A strong G2 profile — high review volume, recent reviews, specific feature ratings, badges — is a structured data asset. A Gartner Magic Quadrant or Peer Insights presence creates authoritative third-party coverage that AI tools treat as credible.

**Analyst citations.** When Forrester or IDC mentions your product in a report — even in a secondary context — that citation becomes part of the authoritative record that enterprise AI tools index. A PR strategy that generates analyst coverage is not just for brand awareness; it's structured data infrastructure for AI-mediated enterprise discovery.

**Case studies with specific metrics.** "Company X improved efficiency" is not AI-legible. "Company X reduced ticket resolution time by 34% and decreased escalation rate from 18% to 7% in the first 90 days" is AI-legible — it's specific, verifiable-in-principle, and directly comparable to similar claims by competitors.

**API documentation quality.** For technical buyers, well-structured OpenAPI documentation, SDK examples in multiple languages, and a public status page are signals that enterprise AI evaluation tools index. Technical legibility to AI is also technical legibility to the engineers who will champion your product in procurement.

### For Consumer Products: Making Your Product Legible to Recommendation Systems

For consumer products recommended by platforms (app stores, streaming services, social platforms, shopping sites), the AI mediation layer is the platform's recommendation algorithm.

**Metadata completeness.** App store metadata — categories, keywords, description text, screenshots with readable text — is the structured data layer the App Store and Google Play recommendation systems use. Incomplete or low-quality metadata makes your product invisible to algorithmic recommendation regardless of how good the product is.

**Rating signals.** Review volume, recency, and sentiment are first-order signals for consumer AI recommendation systems. A product with 200 reviews averaging 4.2 stars is recommended more than a product with 12 reviews averaging 4.8 stars. Volume creates confidence. Recency indicates the product is still active.

**Behavioral signals.** Consumer recommendation systems increasingly weight behavioral signals: install rate, retention, session length, return rate. A product that users install and then don't use is ranked lower than a product with strong retention — regardless of rating. These are not signals you control through information architecture, but they constrain what product quality level is required to benefit from recommendation exposure.

### PM Decision Framework: Where Explainability Matters

Explainability has a real cost — it requires additional engineering, may constrain model architecture choices, and adds complexity to the product surface. The right level of explainability investment depends on:

**Stakes of the decision.** A recommendation that affects someone's job, health, financial status, or legal standing requires meaningful explanation. A recommendation of what TV show to watch tonight does not.

**User trust requirements.** In domains where AI is new to users or where errors are particularly salient (medical, legal, financial), users require more transparency to trust AI-assisted decisions. In mature consumer recommendation contexts, users accept algorithmic recommendations without explanation.

**Regulatory environment.** Certain domains have legal explainability obligations (EU AI Act, GDPR right to explanation, FCRA for credit, EEOC for hiring). These create a floor you cannot go below regardless of product decisions.

**Ability to audit.** Even when you don't expose explanations to users, internal auditability is valuable. A system that your team can interrogate when something goes wrong is more maintainable and more fixable than a black box.

**Competitive context.** If your competitors offer transparent AI reasoning and you don't, you may lose users who require that transparency — particularly in regulated industries.

### What Changes When AI Mediates Discovery

When a human browses your product, they bring patience, aesthetic judgment, emotional resonance, and the ability to read between the lines of your positioning. When an AI mediates the discovery, you lose:

- **The ability to persuade.** Marketing language works on humans. AI systems evaluate facts. Eloquent copy that doesn't contain specific, verifiable claims scores poorly.
- **The benefit of the doubt.** Humans extend goodwill based on design quality, brand recognition, and narrative. AI retrieval systems score what they can extract.
- **Sequential attention.** A human may spend five minutes reading and update their assessment as they learn more. An AI synthesis is built from a batch retrieval and synthesis operation — it's not a reading process.
- **Tolerance for inconsistency.** Humans tolerate minor inconsistencies across your communication surfaces. AI systems aggregate across sources and penalize inconsistency as a reliability signal.

What you gain:

- **Scale.** An AI recommendation reaches a user who would never have found you through traditional channels.
- **Intent alignment.** An AI buying agent recommending you has already done the pre-qualification — the user asking has a specific need and the AI determined you're relevant to it.
- **Reduced attention threshold.** The AI has already filtered and synthesized. The user who sees your product in an AI recommendation is a warmer lead than someone who stumbled across an ad.

The product and information architecture work required to be AI-discoverable is largely the same work required for technical SEO, good customer review hygiene, and structured product documentation. The difference is that AI-mediated discovery makes these things higher-leverage than they were before — and makes the cost of neglecting them higher too.`,
  quiz: [
    {
      question: "Your B2B SaaS product has a well-designed website with strong copywriting but 'contact us for pricing,' an incomplete G2 profile with 8 reviews, and API documentation that is narrative prose without structured format. An enterprise buyer uses an AI procurement tool to compare your product against three competitors. What is the most likely outcome?",
      options: [
        "The AI procurement tool will rank your product lower because the website design signals a less mature company than competitors with more utilitarian but data-complete profiles",
        "The AI procurement tool will have incomplete data on your product in several high-weight dimensions — pricing, third-party review volume, and technical structure — and will likely present competitors with better-structured information more favorably",
        "The strong copywriting and design will help the AI system understand your product's positioning better than competitors with more technical but less readable descriptions",
      ],
      correct: 1,
      explanation: "AI procurement tools extract structured facts, not emotional resonance. 'Contact us for pricing' is an evaluation dead end. Sparse G2 review volume is a trust signal gap. Unstructured API documentation is not machine-readable in the way that OpenAPI specs are. Competitors who have covered these surfaces — transparent pricing, review volume, structured documentation — will be more completely represented in the AI synthesis, which translates to more favorable comparison presentation.",
    },
    {
      question: "Your product team is building an AI-powered job candidate ranking system that scores applicants and surfaces the top candidates to a recruiter. A legal review flags potential EU AI Act compliance requirements. What does this most concretely mean for your PM responsibilities on this feature?",
      options: [
        "You need to ensure the model achieves at least 90% accuracy on a representative evaluation set before deployment, as this is the EU AI Act's minimum performance threshold for high-risk AI systems",
        "You need to design explainability into the system architecture before launch — affected candidates may have a right to meaningful explanation of the automated decision, and 'the AI scored you lower' does not satisfy that requirement",
        "You need to add a human review step that approves every AI recommendation before it is shown to a recruiter, which satisfies the human-in-the-loop requirement and resolves the compliance obligation",
      ],
      correct: 1,
      explanation: "The EU AI Act classifies AI systems used in hiring as high-risk, creating transparency and explainability obligations. This means affected individuals must be able to receive meaningful explanations of automated decisions — not just that a score was generated, but what factors drove it. A human review step (option C) is valuable but doesn't satisfy the explainability requirement if the human reviewer also can't explain the AI's reasoning. Explainability must be built into the architecture, not bolted on, which is why it's a PM decision that must be made before the system is designed.",
    },
  ],
}
