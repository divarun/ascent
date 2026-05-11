export const aiEthicsBias = {
  slug: "ai-ethics-bias",
  title: "AI Ethics & Bias",
  summary:
    "How bias enters AI systems, what fairness actually means, how to audit before you ship, and how to make responsible deployment decisions before they become legal or reputational problems.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["ethics", "bias", "fairness", "risk"],
  order: 13,
  content: `## AI Ethics & Bias

AI bias isn't a bug you fix before shipping. It's a structural property of how models are built — and managing it is an ongoing product responsibility, not a one-time review.

### Where Bias Comes From

**Training data bias**
Models learn patterns from historical data. If that data reflects historical inequities — in hiring, lending, healthcare, policing — the model will reproduce and often amplify those patterns.

A hiring model trained on past successful hires learns who got hired in the past. If that population skewed toward a demographic, the model will favor that demographic. Not through any explicit rule, but through statistical correlation.

**Label bias**
Many models are trained on human-labeled data. Labelers bring their own assumptions and cultural contexts. If "professional appearance" is labeled differently for different demographic groups, the model inherits that inconsistency at scale.

**Sampling bias**
If your training data overrepresents certain users — because certain users opt in more, generate more data, or are more legible to the collection mechanism — the model performs better for those users and worse for underrepresented ones. Medical AI trained primarily on data from large academic hospitals performs worse on rural or underserved populations. Voice recognition trained on certain accents performs worse on others.

**Representation bias**
Distinct from sampling bias: even when a group is present in the data, it may be represented primarily in narrow roles or contexts. A model trained on internet text will have seen Black individuals discussed primarily in certain contexts, women in others. The model's associations reflect those patterns.

**Aggregation bias**
Using a single model for a heterogeneous population when subgroups have meaningfully different underlying patterns. A model trained to predict health risk across an entire population may perform poorly for subgroups whose risk factors differ from the majority pattern — not because of missing data, but because the model averaged across groups that shouldn't be averaged.

**Measurement bias**
You can only optimize for what you measure. If your evaluation metric doesn't capture harm to a subgroup, you won't see the harm until someone looks for it. Overall accuracy of 95% is compatible with 60% accuracy on a minority subgroup.

**Feedback loops**
When a model's outputs influence future training data, bias compounds. A content recommendation model that shows certain content to certain groups generates engagement data that looks like "preference" — which then trains the next model to show even more of that content. A hiring tool that deprioritizes certain candidates reduces their representation in future "successful hire" training sets. Feedback loops are how small initial biases become large systematic ones.

### LLM-Specific Bias

Foundation models and LLMs introduce bias patterns distinct from classical ML:

**Stereotype perpetuation:** LLMs trained on internet text absorb and reproduce cultural stereotypes. Ask a model to write a story about a nurse and it may default to female pronouns. Ask about a CEO and it may default to male. This is measurable and documented across all major models.

**Differential toxicity and refusal:** Models may refuse requests or apply safety filters unevenly across groups. A model that refuses to write a story about violence involving one demographic but complies for another is exhibiting bias in its safety behavior. This is harder to detect because it's framed as a safety feature.

**Hallucination bias:** Models hallucinate at different rates for different topics and groups. They may be more confidently wrong about underrepresented groups, historical events involving marginalized communities, or topics that appear less frequently in training data.

**Language and dialect bias:** Models trained primarily on standard written English perform worse on African American Vernacular English, non-native English, and other dialects. This affects both comprehension and generation quality.

When using foundation models via API, you don't control training data or initial alignment. You can probe for these biases through systematic testing, but you cannot eliminate them at the source.

### What Fairness Actually Means

There is no single definition of fairness. The major definitions are mathematically incompatible with each other — a result formalized in the impossibility theorems (Chouldechova 2017, Kleinberg et al. 2016). You cannot simultaneously satisfy all of them except in degenerate cases.

**Demographic parity:** Equal outcome rates across groups (e.g., equal loan approval rates regardless of race). Intuitive, but can require approving less-qualified applicants from some groups to maintain parity.

**Equal opportunity:** Equal true positive rates across groups (e.g., qualified applicants from all groups are approved at the same rate). Focuses on whether the system correctly identifies genuinely positive cases for everyone.

**Calibration:** Predicted probabilities are equally accurate across groups (e.g., a 70% confidence score is right 70% of the time for all groups). Important for risk models but compatible with different base rates producing different outcomes.

**Individual fairness:** Similar individuals should be treated similarly. Requires defining "similar" — which is often where the hard normative questions are hidden.

**Counterfactual fairness:** A decision is fair if it would be the same in a counterfactual world where the individual belongs to a different demographic group. Theoretically rigorous; practically difficult to implement.

The important thing to know: choosing a fairness definition is a values and legal decision, not a technical one. It should involve legal, product, and leadership — not just engineering. Different applications warrant different definitions. A criminal risk assessment tool has different fairness obligations than a movie recommendation system.

### Disparate Impact and Legal Exposure

Disparate impact happens when a system produces different outcomes across demographic groups, even when those groups aren't explicitly encoded in the input.

Classic example: using zip code as a feature in a credit model. Zip code correlates strongly with race due to historical housing segregation. A model that never sees race still produces racially disparate outcomes through the proxy variable.

**US law:** Disparate impact can trigger liability under anti-discrimination statutes (Fair Housing Act, Equal Credit Opportunity Act, Title VII) even without discriminatory intent. This applies to lending, hiring, housing, and healthcare. The CFPB and EEOC have both issued guidance specifically addressing algorithmic decision-making.

**EU AI Act (entered into force August 2024):** Categorizes AI systems by risk level and applies on a phased schedule. Prohibited AI practices took effect February 2025. High-risk categories — employment, education, credit, law enforcement, healthcare, critical infrastructure — face mandatory conformity assessments, bias audits, human oversight requirements, and transparency obligations; these rules apply from August 2026 (Annex III systems) and August 2027 (AI embedded in regulated products). This applies to any company deploying into the EU market regardless of where the company is based.

**NIST AI Risk Management Framework:** A voluntary US framework that has become a de facto standard for enterprise AI risk management. Organizes risk management around four functions: Govern, Map, Measure, Manage. Increasingly referenced in procurement requirements and regulatory guidance.

Before deploying any model affecting consequential decisions: run a disparate impact analysis, measure outcomes by protected class, look for statistically significant gaps, and document your analysis and methodology.

### How to Actually Find Bias Before You Ship

Knowing bias exists and finding it in your specific system are different problems. Concrete approaches:

**Disaggregated evaluation:** Don't report only aggregate metrics. Break down accuracy, false positive rate, false negative rate, and any task-specific metrics by relevant subgroups (age, gender, race, geography, language). If you don't have demographic labels in your eval set, get them — or acknowledge that gap explicitly.

**Slice-based testing:** Use tools like Slicefinder or manual slice analysis to identify subpopulations where model performance is unexpectedly low. You don't always know in advance which subgroups to test; systematic slice discovery helps find blind spots.

**Counterfactual probing:** For LLMs and classification models, systematically swap demographic attributes in inputs and measure output change. Does the model's sentiment score for "The [demographic group] candidate was assertive" differ across groups? Does the loan model score change when only the name changes?

**Red-teaming for bias:** Structured adversarial testing specifically focused on eliciting biased or harmful outputs. Bring in diverse testers — both in terms of demographics and domain expertise. Document findings systematically, not just as impressions.

**Benchmark datasets:** Use established bias benchmarks where applicable: WinoBias and WinoGender for gender coreference, StereoSet and CrowS-Pairs for stereotypes in LLMs, Fairface for vision models. These don't replace task-specific evaluation but provide baseline comparisons.

### When Not to Deploy

Some use cases should not use AI in their current form:

**High-stakes decisions without human review.** Parole recommendations, child welfare determinations, medical diagnoses, and similar decisions should have humans meaningfully in the loop — not rubber-stamping model outputs, but genuinely reviewing cases and able to override. The error rate acceptable for a search ranking is not acceptable when someone's liberty or health is at stake.

**Models with documented bias on your target population.** If the model underperforms for a subgroup that your product serves heavily, that's a deployment problem. "It's accurate overall" is not sufficient if accuracy is concentrated in demographics that don't match your users.

**Cases where you cannot explain the output.** If a user asks "why was I rejected?" and you cannot produce a coherent, specific answer, you have an accountability gap. Explainability is both an ethical requirement and, in some jurisdictions (EU GDPR Article 22, EU AI Act), a legal one.

**EU AI Act prohibited uses (effective February 2025):** Certain uses are categorically prohibited: real-time biometric surveillance in public spaces (with narrow exceptions), social scoring systems, subliminal manipulation, AI that exploits vulnerabilities of specific groups, predictive policing based solely on profiling, and emotion recognition at workplaces and educational institutions. These are not deployment decisions — they're legal prohibitions already in effect.

### Vendor Model Bias

Most teams don't train models — they call APIs. This creates a different responsibility structure that's often underappreciated.

When you deploy a product built on a foundation model, you are responsible for the downstream effects of that model's biases even if you didn't create them. Vendors like Anthropic, OpenAI, and Google publish model cards and safety evaluations, but these are general assessments — they don't cover your specific use case, your user population, or your deployment context.

Your obligations:
- Probe the model for biases relevant to your specific use case and population before deploying
- Monitor for differential error rates in production by user segment
- Don't rely on vendor safety claims as a substitute for your own evaluation
- Understand what the vendor's terms say about bias-related liability

### What Each Role Should Do

**PMs:** Before any AI feature touches a consequential decision, ask: Who could be harmed by errors? Are errors distributed equally across groups? What's the mechanism for a user to appeal or correct a wrong decision? What are the legal obligations given the decision domain? If you can't answer these, the feature isn't ready to ship.

**EMs:** Run disaggregated performance metrics by subgroup — not just overall accuracy. Build monitoring that detects performance drift across demographic categories over time. Require bias evaluation as part of the definition of done for models affecting consequential decisions. Treat a model with unknown subgroup performance the same as a model with unknown overall performance: not ready.

**ICs:** Be skeptical of training data provenance. Question what's in the labels and who created them. Flag when evaluation metrics don't include subgroup breakdowns — make it a code review issue, not just a personal concern. When using foundation models, run counterfactual probes as part of integration testing.

### The Practical Floor

You don't need a full ethics team to do this responsibly. The minimum viable process:

1. **Document known limitations before shipping.** Not "we believe this model is fair" — but specific: "This model has not been evaluated on users over 65. It performs 12% worse on non-English queries. We have no demographic breakdown of our eval set." Known gaps documented are manageable. Unknown gaps are liabilities.

2. **Measure performance disaggregated by relevant subgroups during eval.** Define "relevant" based on your use case and user population. At minimum: age, gender, language. For regulated decisions: all legally protected classes.

3. **Design a correction path.** What happens when the model is wrong in a consequential way? Who can a user contact? How long does correction take? Is there a human who can override? A model without a correction path is not production-ready for consequential decisions.

4. **Set a mandatory review threshold** for models affecting regulated decisions (hiring, lending, healthcare, housing). This review should include legal, not just technical assessment.

5. **Schedule re-evaluation.** Bias audits at deployment go stale as data distributions shift and feedback loops accumulate. Build calendar-driven re-evaluation into your roadmap, not just incident-driven review.

Ethics is not about blocking AI deployment. It's about deploying with enough visibility to catch problems before they scale — and building the operational infrastructure to respond when you find them.`,
  quiz: [
    {
      question: "A credit scoring model doesn't use race as a feature but produces approval rates that differ significantly by race. A reviewer says this is fine because 'race isn't in the model'. Why is this reasoning wrong?",
      options: [
        "It is correct — if protected attributes are excluded, disparate outcomes cannot create legal liability",
        "Proxy variables like zip code or income can correlate strongly with protected attributes, producing racially disparate outcomes even without explicit encoding",
        "The model has likely learned race implicitly from language patterns, which constitutes illegal reverse discrimination",
      ],
      correct: 1,
      explanation: "This is disparate impact via proxy variables. Zip code correlates strongly with race due to historical housing segregation. Income, name, and other features can similarly correlate. A model that never sees race can still produce racially disparate outcomes. Before deployment, run disaggregated analysis measuring outcomes by protected class.",
    },
    {
      question: "Why is it impossible to simultaneously satisfy all major fairness definitions (demographic parity, equal opportunity, calibration) except in special cases?",
      options: [
        "It is possible with sufficient training data — the impossibility theorems apply only to small datasets",
        "These definitions are mathematically incompatible — satisfying one often requires violating another, as formalized in the impossibility theorems",
        "They can be satisfied simultaneously only when the AI model achieves 100% accuracy, which is technically infeasible",
      ],
      correct: 1,
      explanation: "The incompatibility of fairness definitions is mathematically proven. For example, if different groups have different base rates of the outcome being predicted, you cannot simultaneously achieve equal false positive rates, equal false negative rates, and well-calibrated predictions. Choosing a fairness definition is a values and legal decision, not a technical one.",
    },
  ],
}