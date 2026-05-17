export const governingAiGeneratedCode = {
  slug: "governing-ai-generated-code",
  title: "Governing AI-Generated Code",
  summary:
    "When 40-55% of PRs are substantially AI-generated, standard code review doesn't scale — here's how to build tiered governance that maintains quality and security without creating a culture of suspicion or killing velocity.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["EM"] as const,
  tags: ["engineering", "policy", "code-review", "security"],
  order: 29,
  content: `## Governing AI-Generated Code

Across software teams that have adopted AI coding tools, estimates suggest that 40–55% of PRs now contain substantial AI-generated content. Some teams are higher. The number is still growing.

The problem is that code review processes were designed for a different world — one where code had an author whose reasoning you could interrogate, whose style you recognized, and whose judgment you had calibrated over months of working together. AI-generated code breaks almost all of those assumptions. Managing the transition requires new governance, not just more careful application of existing review processes.

This module is about building that governance in a way that's practical, proportionate, and doesn't create an adversarial relationship between the policy and the people it governs.

### Why AI-Generated Code Needs Different Governance

The case for different governance is not that AI-generated code is necessarily lower quality than human code. It's that it fails in systematically different ways — and the failure modes that matter most are invisible under standard review.

**AI code is confident-looking even when wrong.**

Human code that's uncertain or incorrect often looks uncertain. A junior developer who isn't sure what they're doing writes code that signals its own incompleteness — through verbose comments, unusual structure, visible workarounds. Reviewers pick up on these signals and look more carefully.

AI-generated code doesn't do this. It produces polished, syntactically correct, well-structured code regardless of whether it's solving the right problem. The confidence of the output doesn't correlate with correctness. This causes reviewers calibrated to human code to under-scrutinize AI output.

**Security patterns are statistically common in training data, not necessarily secure.**

Large language models reproduce patterns that were common in their training data. A significant fraction of publicly-available code uses insecure patterns — SQL string interpolation instead of parameterized queries, missing input validation, overly permissive configurations, authentication checks in the wrong layer. These patterns appear frequently enough in training data that they are reproduced confidently, without any signal that they're insecure.

The model doesn't know that string interpolation in a SQL query is a vulnerability. It knows that it's a common pattern — and confidence tracks frequency, not correctness.

**AI code lacks the author's mental model.**

When a human engineer writes code, the author understands why the code exists, what edge cases they considered, what tradeoffs they made. A reviewer can ask: "Why did you handle the empty case this way?" and get an answer that reveals whether the author thought through the scenario.

AI-generated code doesn't come with that mental model. The author may have accepted a generated solution without fully understanding it. If the reviewer can't ask the author "why," they can't surface the edge cases that weren't considered. The author becomes the reviewer's only source of truth — and the author may be less informed about the code's behavior than they appear to be.

**Test coverage from AI often tests the implementation rather than the requirement.**

When asked to generate tests after the implementation exists, AI tools write tests that pass against the current implementation. A function with a bug gets tests calibrated to the buggy behavior. This produces test coverage numbers that look healthy while providing minimal protection against regressions.

This is a subtle but critical failure mode. A test suite that was written to verify the requirements would catch an implementation change that breaks the requirement. A test suite written to document the implementation will not.

### PR Review Standards for AI-Assisted Code

The baseline change required for AI code review is a shift from "does this look right?" to "can I verify that this is right?"

**The "can you explain this?" standard.**

Require authors to be able to explain any generated code they submit. Not a line-by-line walk-through — a conceptual explanation that demonstrates they understand what the code does and why it's correct. This is a minimum bar, not a high one.

In practice, this reveals two things: whether the author understood the code before submitting it, and whether they reviewed it at the right level of depth. An author who can't explain a section they generated has effectively submitted code with an unknown author — neither the human nor the AI is accountable for understanding it.

The right place for this standard is in your contribution guidelines, not in post-merge policy enforcement. "You are responsible for understanding all code you submit, regardless of how it was generated" is a clear, auditable expectation.

**Security-critical paths require deeper review regardless of origin.**

Auth logic, payment processing, data access layers, input handling, session management — these code paths require deep human review. This is not negotiable based on who or what generated the code. Automated scanning is supplemental here, not sufficient.

The practical implementation: identify your security-critical paths and apply a mandatory two-reviewer rule to any PR that touches them. The reviewers should be senior engineers with security context, not just available engineers. Document this in your review policy explicitly so it's applied consistently and not subject to judgment about whether a PR "seems security-relevant."

**Test review: verify that tests fail when the code is wrong.**

Standard test review checks that tests pass. For AI-generated code, add a verification step for critical tests: does this test fail if the code has a bug? You can do this by introducing a deliberate failure in the implementation and confirming the test catches it, or by reviewing the test assertions carefully enough to reason about what would cause them to fail.

A test that calls a function and checks it doesn't throw is not a meaningful test. It has 100% coverage and zero information content about correctness. Code reviewers should specifically identify whether AI-generated tests would catch a plausible failure — not just whether they pass.

**Dependency audit.**

AI-generated code adds dependencies readily, often without explicit author decision. An engineer who prompts for a feature implementation may receive code that includes a new npm package, a new Python library, or a new SDK, without the author consciously choosing to add that dependency.

Require explicit justification for any dependency added in a PR. "The AI included this" is not sufficient justification. The author should be able to articulate: what this dependency does, whether an existing dependency already provides this capability, and whether the dependency is maintained, licensed appropriately, and not introducing known vulnerabilities.

### When to Require Human Authorship

Some code categories are high enough risk that AI assistance should be permitted but AI authorship should not. The distinction is between using AI as a thinking tool and a drafting accelerant (permitted) versus accepting AI output as the authoritative solution without deep human understanding (not permitted).

**Security-critical modules.** Auth systems, session management, permission enforcement, and cryptographic implementations should be written by engineers who deeply understand what they're writing. AI can assist with research, syntax, and boilerplate — but the logic should come from a human who can defend the design under review.

**Core data models and schema changes.** Database schemas and core domain models are difficult to change after the fact. AI-generated schemas tend toward the obvious, often missing domain-specific constraints, normalization decisions, and extensibility that require product and architecture context. An engineer making schema changes should own those decisions, not accept them from a generator.

**Public APIs that downstream systems depend on.** API contracts that external systems or other internal teams rely on require deliberate design. Once an API is published and consumed, breaking changes are expensive. The engineer who designs the API should be making conscious decisions about the contract, not accepting an AI-generated interface and shipping it.

**Anything touching PII handling.** GDPR, CCPA, and sector-specific regulations (HIPAA, PCI) require demonstrably intentional design around personal data. Compliance in this area requires a human who understands the regulatory requirements and can document the design rationale — not code whose origin is hard to audit.

### Setting Policy Without Killing Velocity

The governance failure mode on the other side of inadequate review is policy so burdensome that engineers route around it. An AI governance policy that requires five-person review for every AI-touched PR will either block legitimate work or train engineers to not tag their PRs as AI-assisted. Neither outcome serves anyone.

The right frame is risk-proportionate governance, not origin-based governance.

**Tiered review by risk level, not by AI origin.**

Classify code by the risk profile of what it does, not by whether AI generated it. A routine data transformation that processes internal records presents a different risk profile than an authentication middleware change. Structure your review requirements around that distinction.

A simple two-tier system is workable for most teams:

- **Standard PRs**: Any reviewer, standard review depth, normal merge queue. Applies to most feature work, internal tooling, non-sensitive data handling.
- **Elevated review PRs**: Two reviewers required, at least one senior. Explicit security checklist. No auto-merge. Applies to auth, payments, PII handling, public APIs, schema changes, infrastructure code.

The elevated-review category should be defined by scope (what path does this code touch?) not by subjective judgment (does this "seem" sensitive?). That keeps the policy consistent and not dependent on the reviewer's state of attention.

**The pragmatic principle: AI-assisted is fine, AI-unreviewed is not.**

The distinction that matters is not whether AI generated the code — it's whether a human who understood the code reviewed it before it was merged. An engineer who uses AI to draft code and then reads and validates it carefully has done more work than an engineer who wrote code from scratch but submitted it without running it.

Communicate this explicitly. The policy is not about penalizing AI use. It is about maintaining the principle that every merged line of code has been understood and endorsed by a human engineer who is accountable for it.

**Fast lane and slow lane.**

Define explicitly which PRs can use a streamlined review path and which require deep review. This is more useful than a blanket policy because it lets engineers plan their work and set review expectations accordingly. It also makes the burden explicit — engineers know when they're in the slow lane and why, which makes the policy legible rather than arbitrary.

### Security Review Requirements

In addition to code review standards, AI-generated code warrants automated security tooling that may not have been required at the same level before AI adoption.

**Static application security testing (SAST).**

SAST tools analyze code for known vulnerability patterns without running it. For AI-generated code, SAST is a second-pass check that catches the security failure modes AI code produces most commonly: injection vulnerabilities, insecure function usage, known weak cryptography.

Run SAST on every PR in your CI pipeline. Block merge on high-severity findings that aren't explicitly waived. Make the waiver process require justification — "false positive because X" is acceptable; "it's fine" is not.

**Injection vulnerability checks.**

SQL injection, command injection, and cross-site scripting vulnerabilities appear in AI-generated code at significant rates because the training data contains significant rates of insecure patterns. Any PR touching database queries, API calls, or user input handling should get an explicit injection review pass — automated where tooling supports it, manual where it doesn't.

This is not novel security hygiene. What changes with AI-generated code is the frequency at which these issues are introduced without the author noticing — and the confidence with which the insecure code presents itself as correct.

**Credential scanning.**

AI-generated code includes placeholder secrets at a rate that would surprise most EMs. A model generating an example integration will often produce something like \`const apiKey = "sk-1234567890abcdef"\` — a value that looks real enough that it might be committed, and real enough that it might be misused if pushed to a public repository.

Run credential scanning on all PRs. Tools like GitGuardian, TruffleHog, or GitHub's built-in secret scanning flag values that match known secret patterns. Most are low-friction to add to CI. This is close to a free win: the cost is low and the failure mode (real credentials in version control) is very high.

### Writing the Policy

A governance policy for AI-generated code should fit on one page. If it's longer, it won't be read consistently. Here is the structure that works:

**Scope**: What this policy applies to (all code, or specific code paths?). What AI tools are covered.

**Core principle**: One sentence. Something like: "All merged code must be understood and endorsed by the author, regardless of how it was generated."

**Review standards**: The tiered review definitions. Who applies to what. How to determine which tier a PR falls into.

**Mandatory checks**: Security requirements. What scanning runs automatically. What requires manual verification.

**Human-authorship requirements**: The list of code categories that require human-originated logic (not just AI assistance). Keep this short — three to five items — or it becomes unenforceable.

**How to flag AI use**: How engineers are expected to indicate when a PR contains substantial AI-generated content. A PR label is the lowest-friction approach. This is for measurement and audit purposes, not for differential treatment.

One thing the policy should explicitly not include: language that implies AI use is problematic or that engineers will be penalized for using AI tools appropriately. Governance is about accountability and quality, not about restricting the tools that make engineers more productive.

### Enforcement Without Surveillance

The governance policy works if engineers follow it because they believe in it, not because they fear being caught not following it. A surveillance approach — checking metadata to detect AI use without disclosure, requiring line-by-line justification of AI contributions — creates an adversarial culture that produces hiding behavior rather than good outcomes.

The enforcement mechanisms that work:

**Review culture, not review policing.** Senior engineers who take code review seriously and apply the "can you explain this?" standard consistently create a team norm that's more effective than any policy. The policy provides the language; the culture provides the enforcement.

**Postmortem attribution.** When a production incident traces to merged code, look at the review process for that PR as part of the postmortem. Was it reviewed at the right depth? Were the automated checks run? This connects policy adherence to outcomes — which is much more motivating than connecting it to process compliance.

**Make compliance low-friction.** If following the policy takes significantly longer than not following it, engineers under deadline pressure will not follow it. Invest in tooling that makes the security scans fast, the review checklists accessible from the PR interface, and the elevated-review routing automatic based on the files changed. Friction is the enemy of consistent adoption.

**Regular policy review.** The AI tooling landscape is changing fast enough that a policy written today will be outdated in a year. Schedule a quarterly review of whether the policy is calibrated correctly — too strict where it's killing velocity without reducing risk, too loose where incidents are occurring. Involve engineers in that review; they know where the policy creates friction and where it's actually valuable.

The goal is not a policy that covers you from blame — it's a policy that produces engineering teams making good decisions about code quality and security as AI tools become more central to how they work.`,
  quiz: [
    {
      question: "An AI coding tool generates a comprehensive test suite for a new module. The tests all pass. What is the primary risk of accepting this test suite as sufficient coverage?",
      options: [
        "AI-generated tests use non-standard assertion libraries that may not integrate correctly with the CI pipeline",
        "Tests generated after the implementation is written tend to verify what the code does rather than what it should do — a bug in the implementation gets tests that pass with the bug",
        "AI-generated tests typically have poor performance characteristics, slowing down the CI pipeline at scale",
      ],
      correct: 1,
      explanation: "AI generates tests that match the existing implementation, not the underlying requirement. If the implementation has a bug, the tests will be calibrated to the buggy behavior and will pass. This is why the review standard for AI-generated tests should include verifying that tests would fail if the implementation had a plausible defect — not just that tests pass when the code is correct.",
    },
    {
      question: "You're writing a one-page AI code governance policy. A team member suggests requiring engineers to flag every file touched by AI with a detailed comment explaining what was generated. What is the main problem with this approach?",
      options: [
        "It creates a legal liability by documenting AI involvement that could be used against the company in IP disputes",
        "High-friction compliance requirements lead to routing-around behavior — engineers stop tagging AI use rather than following burdensome process, giving you the appearance of governance without the substance",
        "Detailed per-file tagging is too granular to be useful for aggregate measurement of AI adoption across the codebase",
      ],
      correct: 1,
      explanation: "Governance policies that create significant friction relative to not following them get routed around, especially under deadline pressure. Engineers will stop tagging AI use rather than comply with burdensome requirements. Effective enforcement requires making compliance low-friction — a PR label is workable; per-file inline annotations are not. The policy works through culture and low-friction tooling, not through surveillance.",
    },
  ],
}
