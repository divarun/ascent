export const runBiasCheck = {
  slug: "run-bias-check",
  title: "Run a Bias Check",
  isUnlocked: false,
  description:
    "Analyze a real AI feature or workflow in your org for potential disparate impact across user groups.",
  roles: ["PM", "EM"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Run a Bias Check

Pick one AI feature or AI-assisted workflow that exists in your organization — or one you're planning to build. Your task is to run a structured bias risk assessment on it.

This is not an academic exercise. The output should be something you could hand to your legal team or share with a product review.

### What you'll deliver:

**1. The feature**
Describe the AI feature or workflow: what it does, what data it uses as input, what decision or output it produces, and who is affected by it.

**2. Who could be affected differently**
Identify the relevant groups across which outcomes might differ. These might be demographic groups (gender, age, race, geography), behavioral groups (heavy users vs. light users, enterprise vs. SMB), or situational groups (users with sparse data vs. rich data).

**3. The risk assessment**
For each group you identified, answer:
- What outcome does the model produce for this group?
- What data or evidence tells you the outcome is (or isn't) equitable?
- If you don't have the data to answer this, what would you need to collect?

**4. The highest-risk finding**
Identify the single highest-risk disparity — the one you'd prioritize investigating or fixing first. Explain: what could go wrong if this disparity exists and goes unaddressed? What's the harm to users, and what's the risk to the business?

**5. The next step**
What is the one concrete action you'd take in the next two weeks based on this assessment? It can be a measurement you'd run, a design change, a conversation with legal, or a launch criteria you'd add.

### What makes a strong submission:
- Specific feature, not a hypothetical
- Groups are relevant to the feature's actual use — not just a list of protected classes by rote
- Risk assessment engages with real data or identifies specific data gaps honestly
- The "next step" is actionable within your actual role and authority`,
  staticGuidance: `Bias risk is not always obvious, and it's not always about protected classes. Useful questions to ask:

**Where does the model underperform?**
- For which users does the feature produce incorrect or unhelpful outputs most often?
- Do errors cluster around specific input types, user profiles, or use cases?

**Where does the training data fail to represent?**
- If the model was trained on historical data, whose historical behavior is well-represented?
- Whose is sparse or absent?

**Who bears the cost of errors?**
- If the model is wrong, who is affected and how severely?
- Is the harm symmetric, or does it fall disproportionately on some users?

You don't need to run a full statistical analysis for this mission. What you need is a structured assessment that shows you've asked the right questions — and know which ones you can't yet answer.`,
  checklist: [
    "Specific AI feature or workflow identified",
    "Relevant affected groups named (not just generic protected classes)",
    "Risk assessment addresses each group with evidence or named data gap",
    "Highest-risk finding clearly identified and harm explained",
    "One concrete next step defined and actionable",
  ],
  staticFeedback: {
    assessment: "Strong bias checks name specific affected groups relevant to this feature — not a generic list of protected classes. They identify where data or evidence is missing rather than assuming equity, and produce a concrete next step that can be completed within two weeks.",
    highlights: [
      "Identifying affected groups specific to the feature rather than listing generic protected categories",
      "Naming data gaps honestly rather than assuming the feature treats all groups equitably",
    ],
    suggestions: [
      "Add the highest-risk finding to your next sprint or planning cycle as a concrete measurement task — a bias check that produces no action items doesn't improve anything",
      "Check whether errors cluster differently across groups — uneven error distribution often reveals bias that average accuracy metrics hide",
    ],
    nextSteps: [
      "Run the one measurement you identified as most important — even a manual sample of 30–50 outputs segmented by group gives you a real signal",
      "Share findings with your legal or compliance team before the next launch in this domain",
    ],
  },
}
