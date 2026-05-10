export const evaluateVendorClaim = {
  slug: "evaluate-vendor-claim",
  title: "Evaluate an AI Vendor Claim",
  isUnlocked: false,
  description:
    "Find a real AI product making a specific performance claim. Analyze it rigorously.",
  roles: ["PM"] as const,
  difficulty: "ADVANCED" as const,
  instructions: `## Mission: Evaluate an AI Vendor Claim

AI vendors make a lot of claims. Most are technically true in a narrow sense and misleading in practice.

Your task: find one real AI product making a specific, measurable claim about performance, accuracy, or ROI. Analyze the claim rigorously.

### Step 1: Find the claim
Look at AI vendor websites, case studies, or press releases. Pick one claim that is:
- Specific (e.g., "95% accuracy" or "saves 3 hours per week")
- Verifiable in principle (even if you can't verify it yourself)
- From a real company

### Step 2: Analyze the claim using these questions:

**Definition precision:**
- What exactly is being measured? How is the key term defined?
- Are they measuring the same thing you would measure if you were the buyer?

**Methodology:**
- How was the claim established? Internal test, third-party audit, customer case study?
- Who was the study population? How similar are they to you?

**Selection bias:**
- Is this from a cherry-picked customer? Best-performing cohort?
- What happened to the customers who didn't succeed?

**Baseline:**
- What was the "before" state? Is the comparison to a realistic alternative?

**Replication:**
- Could you reproduce this result? What would it take?

### Step 3: Your verdict
Is this claim:
- Likely true as stated
- Technically true but misleading
- Unverifiable
- Likely false

Explain your reasoning. What would you need to see to trust this claim?

### What a strong submission looks like:
- Specific vendor and claim (name them)
- Rigorous analysis of each dimension above
- Clear verdict with well-reasoned justification
- One question you'd ask the vendor before buying`,
  staticGuidance: `Vendor claim analysis checklist:

**Red flags:**
- "Up to X%" — this is the ceiling, not the average
- No methodology disclosed
- Case study from a company 5-10x your size or in a different industry
- Accuracy measured on vendor's own test set
- No definition of key terms (what counts as "resolved"?)
- "In our testing" without details of the test

**Green flags:**
- Third-party verified
- Similar customer profiles to you
- Methodology documented
- Reference customers willing to talk
- Claim is falsifiable and they explain how

**The most underused question:**
"Can you connect me with a customer who tried this and it didn't work as expected?"

Their answer tells you more than any case study.`,
  checklist: [
    "Specific vendor and claim identified",
    "Definition precision analyzed",
    "Methodology evaluated",
    "Selection bias considered",
    "Baseline analyzed",
    "Clear verdict with reasoning",
    "One actionable follow-up question for the vendor",
  ],
  staticFeedback: {
    assessment: "Strong vendor claim analyses are specific about what was claimed, what the methodology gaps are, and what questions would force the vendor to defend their numbers. A verdict without a follow-up question is not actionable.",
    highlights: [
      "Identifying a specific, named vendor claim rather than critiquing a general category",
      "Applying multiple analytical lenses — methodology, selection bias, and baseline comparison",
    ],
    suggestions: [
      "Make the verdict concrete: 'Do not sign until X is independently verified' is more useful than 'the claim is questionable'",
      "The most underused question: 'Can you connect me with a customer who tried this and it underperformed?' — their answer reveals more than any case study",
    ],
    nextSteps: [
      "Send the vendor the one question you identified as most revealing — their response is data",
      "Search for third-party comparisons (G2, Gartner Peer Insights) to find independent data on the same claim",
    ],
  },
}
