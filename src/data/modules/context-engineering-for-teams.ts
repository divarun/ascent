export const contextEngineeringForTeams = {
  slug: "context-engineering-for-teams",
  title: "Context Engineering for Teams",
  summary:
    "System prompts are organizational infrastructure, not individual artifacts. How to version, own, test, and hand off the prompts your AI features depend on — before the person who wrote them leaves.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["EM", "IC"] as const,
  tags: ["prompting", "engineering", "governance", "team"],
  order: 34,
  content: `## Context Engineering for Teams

Individual prompt engineering is a well-understood skill. Team prompt engineering — where multiple people share, modify, and depend on prompts over time — is not. Most teams treat prompts as configuration: strings that live in .env files or hardcoded constants, owned by whoever wrote them, with no testing process and no documentation. This works until it doesn't.

When the original author leaves, when a prompt needs to change to fix a regression, when a new team member tries to understand what a 300-line system prompt does and why — that's when the absence of process becomes expensive.

This module is about treating prompts as what they actually are: organizational infrastructure.

### What Makes Prompt Engineering Fundamentally Different

Code has compilers, type systems, and test suites that give immediate feedback on whether a change is valid. Prompts have none of this. A prompt change can:

- Silently degrade quality on a subset of inputs while appearing to work fine on others
- Introduce edge case failures that don't manifest until specific user behaviors trigger them
- Interact with model updates in unexpected ways months after the prompt was written
- Produce different behavior across model providers even with identical text

This is the context in which "someone edited the system prompt" is a legitimate incident cause — not a hypothetical one.

### System Prompts as Organizational Knowledge

A system prompt encodes decisions. Every sentence reflects a choice: what behavior to encourage, what to prohibit, what format to produce, what edge cases to handle explicitly. These decisions have reasons. The reasons are almost never documented.

When the original author is present, this is fine. They remember why the prompt says what it says. When they leave, the prompt becomes a black box with undocumented constraints that the team is afraid to touch — because touching it might break things in ways that aren't immediately obvious.

The fix is not to document every sentence of the prompt. It's to document three things:

**1. Intent** — What is this prompt trying to accomplish? What behavior is it optimizing for? What would "good output" look like?

**2. Constraints** — What has been tried and failed? What phrasings produced bad behavior? What edge cases required explicit handling?

**3. Test coverage** — Which inputs test whether this prompt is working? What counts as a passing response?

These three things should live alongside the prompt, updated whenever the prompt changes.

### Version Control for Prompts

Prompts should be in version control. Not in a database with a "current version" field. Not in a .env file that gets overwritten. In git, with history, with commit messages that explain why the change was made.

**What this enables:**
- You can see what changed between two production incidents
- You can revert a bad change in the same way you revert bad code
- You can diff prompt changes in code review before they ship
- You can see who made a change and ask them why

**What this requires:**
- Prompts are stored as files or as tracked configuration, not runtime strings
- The deployment process for prompt changes is the same as the deployment process for code changes — not a manual update to a production database
- Prompt changes go through the same review process as code changes

Teams that skip this often have a period where everything is fine, followed by an incident where someone says "I edited the prompt last week to fix something" and nobody can reconstruct what was changed or why.

### The Prompt Review Process

Because prompt changes behave like code changes, they should go through a review process that tests actual behavior — not just reads the text and looks reasonable.

**Minimum viable prompt review:**
1. Run the full eval suite against the new prompt and compare scores to the previous version
2. Test the specific use cases the change is intended to address — verify they now pass
3. Test adjacent behaviors that might have been affected — verify they still pass
4. Document what you tested and what you found

"It looks fine to me" is not a review. Prompts produce non-deterministic outputs; behavior you didn't test may have changed in ways that aren't visible from reading the text.

**What counts as a safe change?**

There is no such thing as a provably safe prompt change — only changes where you've measured the expected scope of impact. Changes that are narrow (adding one example to a few-shot list), tested (against the eval suite), and reversible (deployed with a rollback path) are reasonably safe. Changes that are broad (restructuring the system prompt), untested (made under time pressure without running evals), and irreversible (pushed to a database that doesn't track history) are not.

### Prompt Entropy

Prompts degrade over time. Not because anyone made a bad decision, but because they accumulate edits without a coherent editorial view.

A prompt that started as 200 words becomes 400 words over 8 months through a series of reasonable additions: a fix for edge case A, a clarification after incident B, an example added for quality improvement C. Each change made sense. The resulting prompt may be internally contradictory, overloaded with specific exceptions, or simply too long for the model to reliably follow all of it.

**Signs of prompt entropy:**
- The prompt has sections that reference scenarios no longer relevant to the product
- There are instructions that contradict each other or create ambiguous priority
- No one can explain what a specific paragraph is doing without reading the git history
- The prompt handles edge cases that the underlying product no longer supports

**The remedy is periodic prompt audits** — treating the prompt like you'd treat an overdue code refactor: read it end-to-end, remove obsolete instructions, resolve contradictions, simplify language that has grown complex. Run your eval suite after the audit to verify quality is maintained.

### The Handoff Problem

The highest-risk moment in a prompt's lifecycle is when the person who wrote it leaves the team. What they knew and didn't document leaves with them.

A well-managed prompt handoff includes:

**A working session** where the departing engineer walks through the prompt with their successor: what each section does, what they tried before landing on the current phrasing, what edge cases required explicit handling, what they're still not satisfied with.

**A test session** where the successor runs the eval suite, adds any cases they feel are missing, and verifies they can explain passing and failing results — not just observe them.

**A documented ownership transfer** — who is now responsible for this prompt? Who approves changes? Who is the escalation path when behavior is wrong?

Without this, the successor inherits a black box. The typical result: the prompt doesn't change for months even when it should, because no one wants to be responsible for breaking something they don't understand.

### Multi-Model and Multi-Environment Complexity

The same prompt often needs to work across multiple models (different providers, different model versions) and multiple environments (dev, staging, production). This multiplies the testing surface significantly.

**Model-specific behavior:** A prompt tuned for one model may behave differently on another, even if the intent is identical. Instruction following, output formatting, and refusal behavior all vary across providers. If your architecture may switch models — for cost, latency, or availability reasons — test the prompt on all candidate models before assuming it's portable.

**Environment-specific configuration:** System prompts often reference environment-specific context (base URLs, product names, feature availability). These should be parameterized, not hardcoded — a system prompt with "our new feature" that differs between dev and production creates a maintenance problem.

**Staged rollouts for prompt changes:** The same rollout discipline that applies to code changes applies to prompts. Promote through environments, canary before full rollout, monitor quality metrics during rollout. A prompt change that looks fine in staging can behave differently in production due to real traffic distribution differences.

### What a Prompt Playbook Looks Like

For each AI feature in production, maintain a document that covers:

**Identity:** What feature this is, what model it uses, where the prompt lives in the codebase.

**Purpose:** What the prompt is trying to accomplish; what "success" looks like; what the most important quality criteria are.

**Constraints and history:** What the prompt explicitly prohibits; what phrasings were tried and abandoned; what incidents shaped the current version.

**Test coverage:** Where the eval suite is; how to run it; what score thresholds indicate a problem; which test cases are most important to pass.

**Ownership:** Who currently owns this prompt; who approves changes; who to escalate to when behavior is wrong.

**Change log:** Last three significant changes, what they addressed, and who made them.

This is not a large document — for most prompts, it fits on two or three pages. It's the minimum knowledge needed for a new team member to work confidently with the prompt rather than treat it as a black box.`,
  quiz: [
    {
      question: "A team member edits the system prompt to fix a customer complaint and deploys directly to production without running evals. Quality on a different user segment degrades significantly. What practice would have caught this?",
      options: [
        "Storing the prompt in a database with version tracking instead of a flat file",
        "Running the eval suite against the changed prompt and comparing scores before deployment, with a rollback path if scores degrade",
        "Having a senior engineer review the prompt text for language quality before deployment",
      ],
      correct: 1,
      explanation: "Prompt changes produce non-deterministic output changes that aren't visible from reading the text. The only way to catch unintended behavior changes before deployment is to run the eval suite and measure what actually changed. Storing prompts in version control and code review helps with traceability but doesn't test behavior. A senior review of the text misses the same things a junior review misses — you need data, not opinions.",
    },
    {
      question: "Six months after launch, no one on the team can explain what a specific section of the system prompt does or why it's there. What is this a symptom of?",
      options: [
        "Prompt entropy — incremental edits accumulated without documentation or a coherent editorial view, leaving no one who understands the full prompt",
        "Context window overload — the prompt has grown beyond what the model reliably processes, causing the model to ignore sections",
        "Model drift — the model provider updated the underlying model, making old prompt sections irrelevant",
      ],
      correct: 0,
      explanation: "Prompt entropy describes the gradual degradation of a prompt through reasonable-seeming incremental edits that accumulate without a coherent editorial view. Each change made sense in isolation; the result is a prompt that no one fully understands. The remedy is a prompt audit — reading end-to-end, removing obsolete instructions, resolving contradictions — with eval runs to verify quality after cleanup.",
    },
  ],
}
