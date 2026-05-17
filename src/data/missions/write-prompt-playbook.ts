export const writePromptPlaybook = {
  slug: "write-prompt-playbook",
  title: "Write Your Team's Prompt Playbook",
  isUnlocked: false,
  description:
    "Document the system prompts behind one AI feature as organizational knowledge — so the next engineer who touches it doesn't have to reverse-engineer what it does and why.",
  roles: ["EM", "IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Write Your Team's Prompt Playbook

System prompts are the most underdocumented piece of AI infrastructure. They encode dozens of decisions — what behavior to encourage, what to prohibit, what edge cases to handle — with none of the documentation that would accompany equivalent decisions in code.

Your task: pick one AI feature your team owns and write a complete prompt playbook for it.

If your team doesn't have an AI feature in production yet, use a feature you've designed or a hypothetical one you understand well enough to document credibly.

---

### What to include:

**1. Feature identity**
- Feature name and brief description (1–2 sentences on what it does)
- Which model(s) it uses
- Where the prompt lives in the codebase or configuration
- Who currently owns it

**2. Prompt purpose**
- What behavior is the prompt trying to produce? What does success look like?
- What are the top 2–3 quality criteria? (Not generic like "accurate" — specific: "always attributes claims to source documents," "never reveals internal pricing," "responds in the same language as the user")
- What's the most important thing this prompt must never do?

**3. Current prompt (or sanitized version)**
Include the actual system prompt text, or a sanitized version that removes any sensitive content while preserving structure. If you can't include the actual prompt, describe its major sections and what each does.

**4. Constraint history**
- What has been tried and failed? What phrasings produced bad behavior?
- What incidents or customer feedback shaped the current prompt?
- Are there any instructions that seem odd but are there for a specific reason?

**5. Test coverage**
- List 5–10 inputs that should produce good outputs — with a brief description of what "good" means for each
- List 2–3 inputs that should be handled with special care (edge cases, adversarial inputs, common failure modes)
- How do you currently verify the prompt is working? (Manual spot-check? Automated evals? Specific user metrics?)

**6. Change process**
- What level of change is safe to make without a full review? (e.g., fixing a typo, adding a formatting instruction)
- What requires running the eval suite before deploying?
- What requires broader team review or sign-off?
- Who approves changes?

---

### What makes a strong playbook:

The test is: could a new engineer who's never seen this feature make a confident, safe change to this prompt using only this document? If not, what's missing?

Good playbooks name the constraints that aren't obvious. Not "the prompt tells the model to be helpful" — that's obvious. Instead: "the prompt explicitly prohibits discussing competitor products because in March we had an incident where the model recommended a competitor's tool unprompted, which surfaced in a sales call."

Good playbooks distinguish between "we documented this" and "we tested this." Stating that the prompt handles multilingual queries is not the same as having test cases that verify it does.`,
  staticGuidance: `Strong playbooks capture the *reasons* behind constraints, not just the constraints themselves. "Never mention competitor pricing" is a rule; "Never mention competitor pricing — in Q2 we had two separate customer conversations where the model cited outdated competitor price data, which undermined an enterprise deal" is knowledge that survives context.

The change process section is the most commonly skipped and the most important. A playbook without a change process is documentation without governance — it describes the current state but doesn't prevent unauthorized or untested changes from breaking it.

If the team doesn't have a formal eval suite, document the informal one: which test inputs does someone manually check before shipping a prompt change? Making the implicit explicit is still valuable.`,
  checklist: [
    "Feature is specifically identified with model, prompt location, and current owner",
    "Purpose section names specific quality criteria — not generic descriptions of being 'helpful' or 'accurate'",
    "Current prompt (or sanitized structural description) is included",
    "Constraint history documents at least one non-obvious rule and explains why it's there",
    "Test coverage includes 5+ specific inputs with descriptions of expected behavior",
    "At least 2 edge cases or adversarial inputs are included in test coverage",
    "Change process defines who approves changes and what level of testing is required",
  ],
  staticFeedback: {
    assessment:
      "A prompt playbook is organizational infrastructure — its value compounds over time. The first time someone modifies the prompt using this document instead of guessing, it pays for itself. The second time a new team member onboards to this feature without a 2-hour knowledge transfer session, it pays for itself again.",
    highlights: [
      "Naming the reasons behind non-obvious constraints — this is the knowledge that's lost when team members leave, and it's what distinguishes a document from a dump",
      "Including edge cases and adversarial inputs in the test coverage section — these are the inputs that reveal brittleness and are most valuable to have explicitly documented",
    ],
    suggestions: [
      "Review the change process section: if it would allow a new engineer to make a significant prompt edit without running any tests, add a minimum testing requirement",
      "Check whether every major instruction in the prompt has a corresponding test case — instructions without test coverage are promises without verification",
    ],
    nextSteps: [
      "Share the playbook with one engineer who doesn't currently own this feature and ask them to identify anything confusing or missing — they'll find the gaps your proximity to the feature hides",
      "Add the playbook to the feature's onboarding documentation so the next person who joins the team gets it automatically",
    ],
  },
}
