export const createAiEvaluationPlan = {
  slug: "create-ai-evaluation-plan",
  title: "Create an AI Evaluation Plan",
  isUnlocked: false,
  description:
    "Build a concrete evaluation plan for an AI feature — before or after it ships.",
  roles: ["EM", "PM", "IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Create an AI Evaluation Plan

Most AI features ship without a real evaluation framework. Teams measure what's easy — latency, error rate, uptime — and discover quality problems through user complaints. This mission fixes that.

Pick an AI feature you work on or know well (or describe a realistic one in enough detail that a stranger could understand it). Build a complete evaluation plan for it.

### Your plan must cover:

**1. Feature and goal**
What does the feature do? What's the intended user outcome? One paragraph — enough for someone unfamiliar to understand what success looks like.

**2. Success criteria**
Define what "working well" means in measurable terms. Not "the AI is helpful" — something specific: "90% of generated summaries pass a 4-criterion rubric," "P95 hallucination rate below 3% on our golden dataset," "user correction rate below 15%."

**3. Golden dataset**
How would you build your ground truth test set?
- How many examples, and how would you source them?
- Who curates the expected outputs (subject matter experts, users, your team)?
- What types of inputs would you deliberately include: typical, edge cases, adversarial?
- How would you keep it fresh as the feature evolves?

**4. Scoring methodology**
How do you score model outputs?
- Exact match, semantic similarity, rubric-based, human evaluation, LLM-as-judge, or a combination?
- What does your rubric look like? (List 3–5 specific yes/no criteria for your feature.)
- What's your threshold for "pass"?

**5. Regression testing**
What triggers a full eval run?
- Any prompt change? Any model version update? Weekly on a schedule?
- What delta in quality score counts as a regression? (Define this before you see results, not after.)

**6. Production monitoring**
What signals do you track in production to detect degradation between eval runs?
- User correction rate, complaint rate, output length distribution, something else?
- What threshold triggers investigation?

### What a strong plan looks like:
Specific, not aspirational. Reviewable by someone who hasn't seen the feature. Defines thresholds before you see results — not calibrated to whatever number you happen to get.`,
  staticGuidance: `Strong evaluation plans share two properties that weak ones lack: they define acceptable thresholds before seeing results, and they measure output quality on real user queries — not just curated examples.

The most common failure mode: teams measure what's easy (latency, API error rate) and call it "monitoring." These metrics tell you nothing about whether the AI is producing correct or useful output.

**What separates strong eval plans:**

Rubric specificity matters. "The response is accurate" is not a rubric criterion. "The response does not make claims not present in the retrieved source documents" is. You should be able to run your rubric on any output and get consistent scores across different reviewers.

Golden datasets decay. A dataset that never gets new examples stops catching new failure modes. Any production failure that made it to users should be added to the golden dataset before fixing the underlying issue.

Thresholds set post-hoc are worthless. If you define "acceptable" as "whatever our current system achieves," the eval is not a quality gate — it's a measurement exercise. Define the threshold first, then measure.

LLM-as-judge is scalable but biased. It works well for trend detection and coarse quality signals. It should be calibrated against human judgment before you rely on it.`,
  checklist: [
    "Feature and its user outcome are clearly described",
    "Success criteria are specific and measurable — no vague terms like 'accurate' or 'helpful'",
    "Golden dataset approach covers sourcing, curation, example types, and freshness",
    "Rubric has 3–5 specific yes/no criteria (not general quality descriptors)",
    "Regression trigger is defined — what change would require a full eval run",
    "At least one production monitoring signal is defined with a threshold for investigation",
  ],
  staticFeedback: {
    assessment: "Strong eval plans define acceptable thresholds before seeing results and measure output quality on real user queries — not just curated examples. The rubric should be specific enough that two evaluators score the same output identically without discussion.",
    highlights: [
      "Defining success criteria before running the eval, not after seeing results",
      "Including production monitoring alongside offline evals — catching degradation after launch is as important as the pre-launch bar",
    ],
    suggestions: [
      "Replace vague rubric criteria ('the response is accurate') with specific yes/no criteria ('the response only makes claims present in the retrieved source documents')",
      "Make sure your golden dataset includes examples from real failure modes, not just happy-path inputs — failure cases catch regressions that success cases miss",
    ],
    nextSteps: [
      "Run your rubric on 5 actual outputs and have a colleague score the same 5 independently — if scores differ, tighten the criteria until they agree",
      "Set a monthly reminder to add new failure modes to the golden dataset",
    ],
  },
}