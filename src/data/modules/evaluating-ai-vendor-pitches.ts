export const evaluatingAiVendorPitches = {
  slug: "evaluating-ai-vendor-pitches",
  title: "Evaluating an AI Vendor Pitch",
  summary: "Why vendor accuracy claims are almost always misleading, how benchmark manipulation works, and the specific questions that separate credible AI vendors from well-funded demo machines.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["PM"] as const,
  tags: ["strategy", "vendors", "evaluation"],
  order: 24,
  content: `## Evaluating an AI Vendor Pitch

Every AI vendor pitch includes a number. "92% accuracy." "3x improvement over baseline." "Industry-leading performance." These numbers are nearly always misleading — not because vendors are lying, but because accuracy claims without methodology are meaningless, and most vendor pitches are structured to obscure the methodology.

This module explains how to read AI vendor claims critically and structure an evaluation that tells you what you actually need to know before you buy.

### What "92% Accuracy" Actually Means

Accuracy is a ratio: correct predictions divided by total predictions. To know whether 92% accuracy means anything, you need to know:

**Accuracy on what task?** The task the vendor measured may not be the task you need. A document extraction vendor who reports 92% accuracy on a benchmark of clean, well-formatted PDFs may perform at 60% on the scanned invoices with handwritten annotations that make up 40% of your actual document volume.

**On what dataset?** Accuracy varies dramatically by dataset characteristics — language complexity, domain vocabulary, formatting, class distribution. A vendor's internal test dataset is almost certainly cleaner, more representative, and more favorable than your production data.

**Measured by whom?** Vendor-owned test sets are nearly meaningless as evidence. The vendor controlled what went in, how it was labeled, and what constituted a correct answer. This isn't necessarily deliberate manipulation — it's selection bias. Their internal definition of "correct" will match their model's strengths.

**With what error distribution?** 92% accuracy means 8% errors. But are those errors uniformly distributed, or concentrated in specific input types? If the 8% error rate on your use case turns out to be 40% on the cases that matter most (see: error asymmetry), the 92% headline is irrelevant.

**At what confidence threshold?** A model that only responds when it is highly confident may achieve 92% accuracy — by declining to answer 30% of inputs. If you need 100% coverage, the actual accuracy on forced responses may be far lower. Vendors rarely mention coverage alongside accuracy numbers.

### Benchmark Manipulation: Why Demo Performance Doesn't Predict Production Performance

The gap between benchmark performance and real-world performance is one of the most well-documented problems in applied ML. It exists for structural reasons, not just because vendors cherry-pick.

**Benchmark overfitting.** Models improve at benchmarks because teams optimize for benchmarks. When a benchmark becomes well-known, the research community — including commercial teams — runs their models against it repeatedly, adjusts, and reports the best result. This is not fraud; it's how the incentive works. The result is that benchmark scores reflect how well a model performs on that specific dataset under those specific conditions, not how it generalizes.

**Task mismatch.** Standard benchmarks test specific capabilities under specific conditions. If the benchmark tests reading comprehension on news articles and you need contract clause extraction from legal documents, the benchmark result tells you almost nothing about your use case. The vendor will still cite the benchmark number.

**Metric selection.** Vendors choose which metrics to report. F1 score, precision, recall, BLEU score, accuracy — each tells you something different about the same model. A vendor who reports precision but not recall may have a model that is highly precise on cases where it is confident but misses half of the relevant cases entirely. You wouldn't know unless you asked.

**Ensemble and cherry-picking at evaluation time.** "In our testing, we achieved..." often means the best run of multiple attempts, or a result achieved with specific prompting strategies, specific input preprocessing, or a model configuration that isn't the one you'd get in production. Ask precisely: what configuration produced this number, and is that configuration what I would receive?

### Dataset Contamination

Dataset contamination is one of the subtler ways benchmark numbers become unreliable. It occurs when the benchmark test set appears — in part or in whole — in the model's training data. The model appears to "know" the answers because it has, in some sense, seen the questions.

This can happen accidentally. The model is trained on a large scrape of the internet. The benchmark test set, having been published, appeared somewhere on the internet. The model's strong performance on the benchmark is partially a function of having been trained on the answers.

It can also happen less accidentally. Some vendors construct private benchmarks from data domains where they know their model performs well — domains that overlap with training data. The benchmark looks rigorous because it has a methodology. But the dataset construction process selected for favorable conditions.

You cannot reliably detect contamination from the outside. What you can do is be appropriately skeptical of vendor-owned benchmark results and weight third-party evaluations and your own pilot data far more heavily.

### Cherry-Picking in Case Studies

Every vendor case study shows a success. This is expected — companies publish their wins. But selection bias in case studies is severe in AI, for a few reasons:

**Deployment attrition.** Many AI deployments fail quietly. The vendor doesn't hear about them or doesn't publish them. The case studies you see are the ones that worked well enough for the customer to agree to be named. This survivorship bias is structural.

**Best-case deployment.** Customers featured in case studies tend to be the ones with clean data, strong internal champions, and technical teams capable of integrating the product well. These are not your average deployment conditions.

**Outcome selection.** A case study can report whichever metric improved most. If accuracy didn't improve but speed did, the case study leads with speed. If the customer improved their process alongside the AI deployment, the combined outcome gets attributed to the AI.

When evaluating a case study, ask: what would have happened without the AI? This counterfactual is almost never in the case study. The claimed improvement may be partly or entirely attributable to process changes, team attention, or selection of favorable use cases.

### How to Evaluate Vendor Claims Rigorously

Here is the evaluation framework that separates vendors worth piloting from vendors worth declining.

**Ask for the methodology, not just the number.** "92% accuracy" is a headline. Ask: what is the task definition, what data was used, who labeled it, what is the labeling rubric, what is the confidence threshold, what is the coverage, and what is the error distribution across input types? A vendor who cannot answer these questions in detail does not have a credible number.

**Ask who owns the test set.** If the vendor owns the test set, treat the result as directionally interesting but not as evidence. Ask whether there is a third-party evaluation — academic paper, independent audit, public leaderboard performance — that can corroborate the claim. Third-party evaluation is not perfect but is substantially more credible.

**Ask for reference customers who had mediocre results.** Every vendor will offer you their best customer references. Ask explicitly: "Can you connect me with a customer who had a mediocre deployment, or who struggled with integration?" The willingness to offer these references is a green flag. The inability to name any is a red flag.

**Ask what the model does when it's uncertain.** This tells you a great deal about how the vendor thinks about production reliability. A mature vendor will have a clear answer: at confidence below X, the model returns a flag for human review; here is how that threshold is calibrated; here is the observed false negative rate in that regime. A vendor who doesn't have a clear answer to this question has not thought seriously about production reliability.

**Ask for latency percentiles, not averages.** Average latency is nearly useless for production planning. Ask for P95 and P99 latency — the latency at the 95th and 99th percentile of requests. An API that averages 200ms but has a P99 of 8 seconds will cause UX failures in your tail traffic. Vendors who only report averages are hiding the distribution.

**Ask about model versioning and change notification.** AI vendors update their models. Sometimes performance improves; sometimes it regresses on specific inputs. Ask: how will I be notified of model changes? What is your backward compatibility policy? Do you maintain previous model versions for testing? A vendor without clear answers to these questions will introduce production regressions that are difficult to diagnose.

### Red Flags

These patterns should increase your skepticism substantially:

- **No third-party evaluation.** Only vendor-owned benchmarks and internal case studies.
- **Inability to run a pilot on your data.** Any vendor who won't let you test on your own data before buying is protecting their numbers from your data.
- **Accuracy reported without coverage.** High accuracy at low coverage is trivial to achieve. A model that only answers when very confident can achieve very high accuracy — while refusing to help on a large fraction of your inputs.
- **Benchmark methodology that doesn't match your use case.** The vendor's benchmark measures the wrong task, the wrong domain, or the wrong input distribution.
- **Accuracy on a different task than you need.** A vendor who solved a related problem and is pitching you on the strength of that result.
- **Inability to explain what the model does on uncertain inputs.** No production reliability story means no one has thought seriously about production.
- **Latency numbers that are averages only.** This hides tail behavior.
- **No model change notification policy.** You will find out about regressions from your users, not from the vendor.

### Green Flags

These patterns indicate a vendor worth taking seriously:

- **Third-party verified numbers.** Academic papers, public leaderboard results, independent audits.
- **Methodology transparency.** Willingness to share the evaluation dataset construction methodology, labeling rubric, and confidence threshold used.
- **Willingness to pilot on your data.** The vendor is confident enough in their product to let you evaluate on representative production inputs.
- **Documented failure rates.** A vendor who proactively tells you what their model struggles with is telling you they've done serious evaluation. "Our model struggles with handwritten input and non-standard document layouts" is a green flag because it's specific and honest.
- **A clear production reliability story.** What happens at low confidence? How is uncertainty surfaced? What is the human escalation path?
- **Model versioning and change notification policy.** You'll be told before your production behavior changes.

### The Pilot Design

If a vendor clears basic scrutiny, the right next step is a structured 60-day pilot with pre-agreed success criteria — not a purchase.

The pilot should be structured as follows:

**Pre-agree the success criteria.** Before the pilot starts, document: what metrics will determine success, what thresholds constitute pass/fail, and who will evaluate. This is non-negotiable. If you can't get the vendor to agree to pre-specified success criteria, they are not confident in their product under your conditions.

**Use your own data.** The pilot must run on a representative sample of your production inputs — including the messy, edge-case-heavy examples that don't make it into vendor demos. Clean data pilots are nearly useless. You're testing what you'll actually deploy against.

**Measure what you'll actually measure in production.** Task completion rate, user correction rate, escalation rate — not just model accuracy on a held-out set. The production metrics are what matter.

**Include a control group.** If possible, run the AI-assisted experience alongside the current process for a subset of users. The goal is to measure the delta, not just the absolute performance of the AI.

**Define who evaluates.** The evaluation team should not be the vendor's account manager. Decide in advance how outputs will be labeled and by whom.

**Document the configuration.** The exact model version, prompt configuration, and threshold settings used in the pilot should be recorded. If you proceed to production, you need to know you're deploying what was evaluated.

### "The Vendor Won't Let Us Pilot" Response Framework

If a vendor resists piloting on your data with pre-agreed success criteria, you have a few options:

1. Walk away. A vendor confident in their product welcomes rigorous evaluation.
2. Negotiate a paid proof-of-concept with contractual success criteria. Make purchase contingent on hitting defined thresholds.
3. Run a reference customer analysis. Get three to five reference conversations with current customers, ask specifically about failure modes, ask about cases where the product didn't meet expectations.

A vendor's resistance to a structured pilot is itself information. It usually means either the product doesn't hold up on diverse real-world data, or the sales team doesn't trust the technical team's numbers.

### The Questions to Ask in the Vendor Meeting

If you take nothing else from this module, ask these questions in every AI vendor meeting:

1. What is the exact task definition for the accuracy number you're reporting?
2. Who owns and controls the test set? Is there a third-party evaluation?
3. What is the coverage — what percentage of inputs receive a response at that accuracy level?
4. What happens when the model is uncertain? What is the human escalation path?
5. What are your P95 and P99 latency numbers?
6. Can we run a pilot on our own data with pre-agreed success criteria before purchase?
7. Can you give us a reference customer who had a mediocre or difficult deployment?
8. What are the input types or conditions where your model underperforms?
9. How will we be notified when the model changes?

Vendors with good products will answer these questions. Vendors who cannot are telling you something important.`,
  quiz: [
    {
      question: "A vendor claims 94% accuracy on document extraction, validated on their internal benchmark. Their reference customers are all enterprise companies with clean, structured documents. Your use case involves processing scanned handwritten forms. What is the most serious problem with using this claim to inform your purchase decision?",
      options: [
        "The sample size of the internal benchmark is likely too small — you need at least 10,000 examples for a 94% claim to be statistically reliable",
        "The accuracy is measured on a dataset the vendor owns and controls, selected from conditions favorable to their model, and bears no verified relationship to performance on your actual inputs",
        "94% accuracy is below the 95% industry standard threshold for document extraction, making this vendor's product not competitive",
      ],
      correct: 1,
      explanation: "Vendor-owned benchmarks are nearly meaningless as evidence because the vendor controls the task definition, the data selection, the labeling rubric, and the conditions. Even if the methodology is honest, the dataset reflects the vendor's deployment conditions, not yours. A scanned handwritten form is a completely different input distribution than a clean structured PDF. The only evaluation that tells you about your use case is a pilot on your actual data.",
    },
    {
      question: "You're in a vendor meeting and ask for P95 and P99 latency. The vendor says their average response time is 180ms and shows a chart of average latency over time. They decline to provide percentile data, saying 'the average is representative.' What should you conclude?",
      options: [
        "Average latency of 180ms is fast enough for most use cases — percentile data would only matter for real-time video or gaming applications",
        "The vendor is likely hiding significant tail latency — P99 data that is not shared is almost always worse than the vendor wants to acknowledge, and tail latency will affect real users in production",
        "The vendor may not have the technical infrastructure to compute percentile latency, which is a tooling maturity concern but not a product quality signal",
      ],
      correct: 1,
      explanation: "Average latency is the weakest possible characterization of system performance. A system averaging 180ms can have a P99 of 5-10 seconds if even 1% of requests are slow — and your users will experience those slow requests. Vendors who won't share percentile data are almost always hiding a problematic tail. This is a red flag. A vendor confident in their performance numbers shares them fully.",
    },
  ],
}
