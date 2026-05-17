export const writingAiFeatureBriefs = {
  slug: "writing-ai-feature-briefs",
  title: "Writing a Feature Brief for an AI Feature",
  summary: "How to write a feature brief that actually accounts for probabilistic outputs, undefined 'done' criteria, and the failure modes that kill AI features after launch.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["PM"] as const,
  tags: ["product", "specs", "strategy"],
  order: 23,
  content: `## Writing a Feature Brief for an AI Feature

Most PM feature briefs fail for AI features before the first line of code is written. The standard CRUD-feature template — user story, acceptance criteria, success metrics, done — breaks down because AI outputs are probabilistic, "done" is fundamentally different, and the most important decisions are ones you haven't been asked to make yet.

This module covers the practical mechanics of writing a brief that your engineering and ML teams can actually build against.

### The Core Challenge: Specifying Something Probabilistic

A traditional acceptance criterion looks like this: "When a user submits a form with a valid email address, the system saves the record and shows a confirmation message." This is binary — either it happens or it doesn't. You can write a test. You can ship when the test passes.

AI features don't work this way. "The AI suggests a relevant response" is not an acceptance criterion. It's a hope. The model will sometimes suggest relevant responses, sometimes mediocre ones, sometimes wrong ones — and the distribution of those outcomes is what you're actually shipping.

The correct mental shift: you are not specifying an output, you are specifying a distribution of acceptable outputs and an explicit tolerance for the unacceptable tail.

This means every AI feature brief must answer three questions before anything else:

1. What does a good output look like, specifically enough that two people would independently agree it's good?
2. What does an acceptable-but-not-great output look like? (The "wrong but not terrible" range — you'll want to define this explicitly.)
3. What does an unacceptable output look like, in a way that would trigger stopping or rolling back the feature?

Until you can answer all three, you don't have a brief — you have an idea.

### What "Done" Means for an AI Feature

For a CRUD feature, "done" means: the behavior matches the spec, the tests pass, and the edge cases are handled. You can ship and move on.

For an AI feature, "done" is a continuous condition, not a terminal state. The model degrades as the world changes. Distributions shift. What was acceptable at launch may not be acceptable six months later. "Done" for an AI feature means:

- The launch criteria are met and verified
- Monitoring is in place to detect degradation
- There are defined thresholds that trigger a review
- Someone owns the ongoing evaluation, not just the launch

If your brief doesn't include ownership of post-launch monitoring, you haven't finished the brief.

### Success Metrics That Aren't Just Accuracy

The reflexive PM instinct is to write "the model achieves X% accuracy." This is almost always the wrong primary metric. Here's why: accuracy is an aggregate. It tells you the average behavior across your evaluation set. What it doesn't tell you is:

- Whether errors cluster on edge cases or on your most important use cases
- Whether users actually benefit from the feature despite high accuracy
- Whether the feature is used at all, or avoided because it's not trustworthy
- Whether the errors that do occur are expensive or cheap to recover from

Better metrics for AI features:

**User correction rate.** When the AI makes a suggestion, how often does the user edit it before accepting? A correction rate under 10% on meaningful suggestions means users trust the output. A correction rate of 60% means users are treating the AI as a first draft they have to fix — which may or may not be valuable depending on the task.

**Task completion rate.** Do users who engage with the AI feature actually complete the underlying task, compared to users who don't? This is the real north star: does the feature create value, or does it just look impressive in demos?

**Time-to-completion.** Does the AI feature reduce the time it takes users to complete the task? For many AI assist features, a 20% reduction in time-to-completion at acceptable quality is the right goal, not some accuracy percentage.

**Escalation rate.** When the AI presents an output, how often do users reject it entirely and go to the fallback (human support, manual process, alternative route)? A high escalation rate on a supposedly confident output is a signal that the model's confidence is miscalibrated relative to user expectations.

**Coverage vs. precision tradeoff.** At what confidence threshold does the model surface outputs, and what percentage of inputs get a response versus fall back? If your model is precise but refuses to answer 40% of queries, coverage is a real problem even if accuracy is high.

### Accuracy vs. Usefulness: The 5% Problem

A 95% accurate model sounds impressive. It is often useless if the 5% of errors are concentrated on the most important cases.

Consider a document classification feature that routes customer support tickets to the right team. 95% accuracy overall sounds great — but if the 5% misclassified tickets are disproportionately urgent account-cancellation requests being routed to the billing team, the feature is causing your highest-stakes interactions to land in the wrong place.

This is error asymmetry, and it must be in your brief before you write a single success metric.

Error asymmetry means false positives and false negatives have different costs. For a medical flagging system, a false negative (missing a real flag) is far more expensive than a false positive (flagging something benign). For a spam filter, a false positive (blocking a legitimate message) may be more expensive than a false negative (letting through some spam). The cost structure of your specific errors needs to be explicit in the brief, because it will change:

- What threshold the model should use before surfacing an output
- What the rollback criteria are
- What your success metric should actually measure
- How the model handles uncertainty (show vs. escalate vs. reject)

### Define Failure Modes Before Writing Success Metrics

This is the order most PMs get wrong. They write the success metric first ("90% accuracy") and then define failure as "falls below 90%." This is backwards.

Failure modes come first because they constrain what success means. Start with: what are the ways this feature could cause real harm or significant user damage?

For an AI-powered contract review feature:
- **Unacceptable failure:** Misses a legally significant clause and the user relies on the output as reviewed
- **Acceptable failure:** Surfaces a clause as potentially problematic that a lawyer would dismiss as standard language (false positive — annoying but not harmful)
- **Wrong but not terrible:** Doesn't catch an unusual clause but presents the output as uncertain ("review recommended")

Once you've mapped those three tiers, your success metric writes itself: maximize precision on unacceptable failures (near-zero false negative rate on legally significant clauses), tolerate some noise on false positives, and calibrate the uncertainty signaling to catch the middle tier rather than hide it.

This also gives you your rollback criteria before launch, which is the next thing to specify.

### The Eval Plan as Part of the Brief

The evaluation plan is not a post-launch afterthought. It is part of the feature definition. If you cannot evaluate whether the feature is working, you cannot know whether to ship it.

Your brief should specify:

**What evaluation set you'll use.** Who created it, how many examples, what it covers. A model evaluated on 50 examples drawn from last month's easy cases is not an evaluation — it's confirmation bias. The evaluation set should be representative of production inputs, include edge cases and hard cases, and ideally include adversarial examples.

**Who owns the evaluation set.** This matters because if the ML team controls the evaluation set, they will unconsciously optimize for it. The ideal is evaluation data owned by someone independent of the model development — often the PM, a data analyst, or an external labeler.

**What labeling rubric you'll use.** For anything with subjective quality (summarization, response generation, recommendations), you need an explicit rubric that two independent labelers would apply consistently. Without this, your accuracy numbers are measuring whatever the labeler happened to think, which is not a stable signal.

**How often you'll re-evaluate.** Once at launch is not enough. Data distributions shift. Models change. User behavior changes. Build re-evaluation into your launch plan at a cadence that makes sense for the risk level of the feature.

### Rollback Criteria: Decide Before You Ship

The hardest conversation to have in week 1 post-launch is whether to roll back a feature that users are already using. It's much easier if the rollback decision was pre-committed.

Your brief should include explicit rollback criteria — observable, measurable thresholds that would trigger a rollback review. Examples:

- User correction rate exceeds 35% in the first 72 hours
- Escalation rate on high-confidence outputs exceeds 20% in week 1
- Any instance of the defined unacceptable failure mode in the first 14 days
- Task completion rate drops below the pre-AI baseline in a controlled cohort

These criteria should be agreed on by engineering, ML, and product before launch. Their purpose is not to make rollback automatic — it's to ensure the rollback decision is based on pre-committed logic rather than in-moment politics.

### The Confidence Threshold Decision

Every AI feature that surfaces outputs to users has an implicit confidence threshold: at what level of model confidence do you show the output versus escalate to a human, present it with uncertainty signaling, or refuse to respond?

This decision belongs in the feature brief, not in a machine learning config file. It is a product decision because it directly trades off:

- **Coverage** (percentage of inputs that get an AI response) against **precision** (quality of responses shown)
- **Speed** (AI response shown immediately) against **accuracy** (escalated to human who takes longer but is more reliable)
- **User experience** (clean confident output) against **honesty** (output shown with uncertainty indicators)

The right threshold depends on your error asymmetry. For a feature where false negatives are cheap and false positives are expensive, set a high confidence threshold — only show outputs you're very confident about. For a feature where partial answers are better than no answers and users can easily verify, a lower threshold may be appropriate.

Document the threshold you're shipping with and why. If your ML team picked the threshold, ask why that number. "It seemed right" is not an answer. "It maximizes F1 on our eval set, and we evaluated the tradeoff between coverage and precision and chose this point because [reason]" is an answer.

### Brief Anti-Patterns

**"The AI should be helpful."** Not a requirement. Helpful how, to whom, on what tasks, measured how? Every word of your acceptance criteria should be falsifiable.

**"90% accuracy."** Of what? Measured how? On whose evaluation set? At what point in the pipeline? "90% accuracy" in isolation is close to meaningless. "90% precision on our labeled evaluation set of 500 representative support tickets, measured by two independent labelers using the attached rubric, evaluated before launch and re-evaluated at 30 days" is a requirement.

**Missing error asymmetry.** Treating false positives and false negatives as equally costly when they're not. Always ask: which kind of error is more expensive? Design the model threshold and success metrics around the answer.

**Evaluation plan after the brief.** The brief should include the evaluation plan, not reference that one will be created later. If you don't know how you'll evaluate, you don't know what you're building.

**No rollback criteria.** Shipping without pre-committed rollback thresholds means the rollback decision will be made under pressure with incomplete data and competing incentives. It usually means you won't roll back when you should.

**Confidence without calibration.** Specifying that the model should only show outputs above a confidence threshold without verifying that the model's confidence scores are actually calibrated (i.e., that outputs at 90% confidence are right 90% of the time) is a hidden failure mode. Calibration testing belongs in the eval plan.

### Brief Template: AI Feature Structure

A complete AI feature brief should cover:

**1. Problem statement.** What user problem does this solve? What's the baseline behavior without the AI feature?

**2. Feature description.** What will the AI do, in plain language? What triggers it? What does it output? What's the fallback when the AI doesn't surface a result?

**3. Failure mode taxonomy.** Unacceptable failures (define precisely), wrong-but-tolerable failures, acceptable-but-imperfect outputs.

**4. Error asymmetry.** Which kind of error — false positive or false negative — is more expensive in this context, and why?

**5. Confidence threshold.** At what confidence level does the AI surface output vs. escalate or decline? Who owns this decision and why was this threshold chosen?

**6. Success metrics.** Task completion rate, user correction rate, time-to-completion, escalation rate, coverage. Not just accuracy.

**7. Eval plan.** Evaluation set description, who owns it, labeling rubric, sample size, re-evaluation cadence.

**8. Rollback criteria.** Observable, pre-committed thresholds that trigger a rollback review.

**9. Monitoring.** What signals will be tracked in production, who owns them, how often reviewed.

**10. Post-launch ownership.** Who owns the ongoing performance of this feature after launch?

The goal of this template is not to create bureaucracy — it's to force the decisions that will otherwise be made implicitly, under pressure, after launch, with worse information.`,
  quiz: [
    {
      question: "Your team ships an AI document classifier with 94% overall accuracy. Two weeks post-launch, customer success reports that urgent escalation tickets are frequently misrouted. What does this indicate about your feature brief?",
      options: [
        "The model needs retraining on more data — 94% accuracy is close but not sufficient for this use case",
        "The brief failed to define error asymmetry: false negatives on high-priority ticket types were not identified as more costly than false positives, so success metrics didn't weight them appropriately",
        "The brief should have specified a higher accuracy target — 97% or above would have caught the misrouting issue",
      ],
      correct: 1,
      explanation: "Overall accuracy is an aggregate that hides how errors are distributed. If your most expensive errors — misrouting urgent tickets — are concentrated in that 6% error rate, accuracy is the wrong metric. A good brief identifies error asymmetry before writing success metrics, which would have led to measuring precision on the high-urgency class specifically, not just overall accuracy.",
    },
    {
      question: "You're writing the brief for an AI writing assistant that suggests email responses. Your draft success metric is 'the model achieves 88% accuracy on the evaluation set.' Your engineering lead asks: 'Accuracy of what, measured how?' What's the most important thing missing?",
      options: [
        "The evaluation set size — you need at least 1,000 examples for accuracy to be statistically meaningful",
        "The definition of what counts as correct, who labels it, using what rubric, on what data — without these, the number is unverifiable and the metric is not falsifiable",
        "A comparison benchmark — you need to specify what the 88% is being compared to, such as a previous model version",
      ],
      correct: 1,
      explanation: "An accuracy number without a labeling methodology, rubric, and evaluation set ownership is nearly meaningless. Two labelers with different definitions of 'correct' will produce different accuracy numbers on the same model. The brief must specify what correct means precisely enough that two independent labelers would agree — otherwise you're measuring the labelers' intuition, not the model's performance.",
    },
  ],
}
