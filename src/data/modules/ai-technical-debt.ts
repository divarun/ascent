export const aiTechnicalDebt = {
  slug: "ai-technical-debt",
  title: "Technical Debt in AI Systems",
  summary:
    "Why AI-generated code accumulates debt faster than human-written code, the four debt patterns to watch for, and how to own code you didn't write.",
  difficulty: "ADVANCED" as const,
  roles: ["IC"] as const,
  tags: ["engineering", "maintainability", "craft", "quality"],
  order: 33,
  content: `## Technical Debt in AI Systems

AI-generated code accumulates technical debt faster than human-written code. Not because AI writes worse code moment to moment — often it doesn't — but because of structural properties of how it's produced: no author who understood the decisions, no context that persists after the session ends, no stake in the downstream consequences.

Understanding the debt patterns specific to AI-generated code is one of the more practically useful things an IC can know right now. Most teams are accumulating this debt without realizing it, and the interest payments will come due.

### Why the Debt Accumulates Faster

The traditional framing of technical debt treats it as a deliberate tradeoff: take a shortcut now, pay it back later. The debt from AI-generated code is different — it's often invisible and unintentional.

**It looks clean.** AI-generated code is well-formatted, uses reasonable variable names, follows language conventions, and passes linters. Human-written shortcuts often look like shortcuts: the comment that says "TODO: fix this later," the variable named \`temp2\`, the 200-line function with no explanation. AI debt looks like production code. It passes review because it appears correct, not because it has been understood.

**It has no attributed author.** When you can't tell who wrote something, you can't ask why. The decision to use a specific approach, the assumption embedded in a data structure, the choice to handle errors one way rather than another — normally these have an author who can explain them. AI-generated code has no such person. "The AI wrote it" is not an explanation; it's an admission that no one understood the decision well enough to own it.

**It's easier to rationalize.** Debt from human-written shortcuts often triggers guilt — the engineer who wrote it knows they cut a corner. AI-generated debt triggers neither guilt nor awareness. The PR looked good. It had tests. It passed review. The engineer who merged it may genuinely believe they did thorough work. The debt that accumulates without anyone knowing it's happening is the hardest to address.

### The Four Debt Patterns

#### 1. Hallucinated Patterns

AI generates code using APIs, patterns, or approaches that don't exist, are deprecated, or are subtly misused. The code compiles. Tests pass. It fails at runtime, or at edge cases that weren't tested, or in production under conditions the test suite didn't cover.

This failure mode is insidious because it's invisible until it isn't. A function that calls a deprecated method with the right signature and expected behavior in most cases will work fine in testing and development. In production, under the edge case the deprecated method didn't handle before it was deprecated, it breaks.

The hallucination pattern appears most often with:
- **Third-party libraries that change frequently.** The model's training data may include older versions. The code it generates uses the older API. Your \`package.json\` has the newer one.
- **Internal APIs the model has never seen.** The model generates plausible-sounding calls to your internal services based on naming patterns and context. The actual API is different.
- **Configuration and infrastructure patterns.** Cloud provider APIs, framework configuration files, and deployment patterns evolve quickly and unevenly in training data.

The detection strategy: any method or API call you don't immediately recognize should be verified against primary documentation — not documentation the AI summarizes, but the actual documentation. Run the code early in development, not after building a large system on top of it.

#### 2. Undocumented Assumptions

AI-generated code frequently encodes assumptions about the environment, data shape, or system behavior that the author didn't notice and therefore didn't document. The code works correctly given those assumptions. Future maintainers don't know what the code assumes, and neither does the engineer who merged the PR.

Common categories of undocumented assumptions:

**Data shape assumptions.** A function that processes a list assumes the list is non-empty, or sorted, or contains unique values, or that each element has a specific field. None of this is in the function signature or the documentation. When the assumption breaks, the function fails in unexpected ways.

**Environment assumptions.** Code that assumes a specific environment variable is present, a specific service is reachable, a specific file path exists. Works in development. Fails in production, or in a new environment, or after a configuration change.

**Ordering and concurrency assumptions.** Code that assumes operations happen in a specific order, or that it's the only consumer of a shared resource, or that a specific lock will always be held before this function is called. These assumptions produce race conditions that are nearly impossible to reproduce in testing and very hard to diagnose in production.

**Behavioral assumptions about dependencies.** A function assumes a downstream service returns data in a specific format, with specific error codes, within a specific latency. The documentation doesn't say this. The model inferred it from patterns and encoded it in the implementation.

The mitigation isn't complicated: require that AI-generated code come with documented assumptions. Not documentation of what the code does — the code says that. Documentation of what the code needs to be true in order to work correctly. "This function assumes the input array is sorted in ascending order" is the comment that prevents the 2am incident two years later.

#### 3. Test Coverage Gaps

AI-generated tests test the implementation, not the requirement. This is the coverage trap: tests written against a specific implementation pass when the implementation is wrong, because they were written to describe what the implementation does rather than what it should do.

The mechanics: you ask an AI to write tests for a function. The AI reads the function, infers its behavior from the code, and writes tests that verify that behavior. If the function has a bug, the tests encode the bug. Coverage numbers are high. The test suite is green. The function is wrong.

This isn't a hypothetical failure mode — it's a structural property of generating tests from implementations. A test written to verify a function's behavior must be written independently of the function's implementation to catch implementation errors. When you ask an AI to write tests for code that exists, you're asking it to do the one thing that makes tests structurally unable to catch bugs.

**The correct workflow:** Write or specify tests before or alongside the implementation, not after it. The test suite should document the requirement — what the system should do — independently of any implementation choice.

**What this means in practice:**

Before accepting AI-generated code, write integration tests that test the requirement as a user would experience it: given this input, the system produces this output, independent of how the code works. These tests can live alongside the unit tests. They can be written before any implementation exists. They should not be generated by asking the AI to test its own code.

**The coverage number warning:** High test coverage in AI-generated code is not a signal of correctness. A test that calls a function and checks it doesn't throw has 100% coverage and zero power to detect bugs. For each generated test, ask: "If this function had a bug on this input, would this test catch it?" If the answer is no, the test isn't providing coverage in any meaningful sense.

#### 4. Abstraction Drift

AI tends to generate concrete, working solutions rather than well-abstracted, reusable ones. Given a specific problem, it solves that problem directly. It doesn't extrapolate to a pattern that would also solve the three related problems you'll encounter in the next six months.

The short-term result is correct, readable, working code. The long-term result is a codebase with:

- **Duplication across similar-but-not-identical problems.** Each was solved directly. None were abstracted into a shared pattern. Changing the behavior requires finding all the instances and updating them consistently — a task that's tedious, error-prone, and eventually fails.
- **Inconsistency within the same domain.** Error handling looks different in each module because each was generated independently. Authentication is done slightly differently in three places. The inconsistency isn't wrong exactly, but it means the codebase has no single source of truth for "how we do this."
- **Components that are hard to change together.** When two pieces of code implement the same underlying pattern independently, changing the pattern requires updating both. Finding them requires knowing they're related — which requires understanding that doesn't exist in the code.

The mitigation is active refactoring after the fact, or the discipline to abstract before generating. The latter requires prompting the model with context about existing patterns: "We handle errors this way in our codebase. Write this using the same pattern." This produces more consistent output, but requires the engineer to know the patterns and explicitly provide them.

### How to Think About Maintainability When You Didn't Write the Code

The traditional accountability structure of code ownership assumes an author who made decisions and can explain them. AI-generated code breaks this structure. No one made the decisions; the model generated them. Understanding how to be accountable for code you didn't design is now a core IC skill.

**The 2am test.** Read the code as if you are the on-call engineer at 2am, something is broken in production, and you've never seen this code before. What do you need to understand to diagnose the problem? What's opaque? Where would you have to start guessing? The things that fail the 2am test are exactly the things that will hurt you when they matter most. This is the practical test for whether AI-generated code is maintainable — not whether it looks clean, not whether it's well-formatted, but whether someone under pressure who didn't write it can understand it quickly.

**Document decisions, not code.** The code documents what it does. The documentation that's actually missing from AI-generated code is: why is it structured this way, what alternatives were considered and rejected, what invariants does it depend on. A comment that says "// increments the counter" describes code the reader can already read. A comment that says "// must use atomic increment here — this method is called from multiple goroutines and non-atomic operations produce data races in the 10k+ RPS case" documents a decision with context that a reader cannot derive from the code itself. That's the documentation AI-generated code is missing.

**The ownership question.** Ownership and authorship are different. You can own code you didn't author. But owning code means understanding it well enough to defend it: to explain why it's structured the way it is, to describe its failure modes, to predict what will happen when requirements change. If you can't do those things, you haven't owned the code — you've accepted it.

The test: if something breaks in production and your manager asks "what happened?", can you give an answer that goes beyond "the AI wrote it and it broke"? If not, you haven't taken ownership. The code is in your repo, under your name on the PR, but the accountability structure has a gap — and gaps in accountability produce the incidents that are hardest to recover from.

### Practical Strategies for Keeping AI-Generated Code Maintainable

**Require intent documentation before accepting AI-generated PRs.** The PR description should answer: what problem does this solve, what approaches were considered and rejected, and what does this code assume? This documentation comes from the engineer, not from the AI. Writing it forces the engineer to understand the code well enough to explain it. PRs that can't be explained should not be merged.

**Run AI-generated code through your senior engineers' mental model, not just the test suite.** A senior engineer looking at a non-trivial piece of AI-generated code should be able to say: "this approach assumes X, which will break when Y happens" or "this is solving the problem at the wrong level — the real problem is Z." If the only review is "tests pass, linter is happy," the review isn't providing the value it should.

**Add integration tests before any AI-generated implementation goes in.** The integration tests document the requirement independently of the implementation. They can be written before the implementation exists — often, they should be. Once the implementation exists, it's harder to write tests that aren't influenced by the implementation's behavior.

**Create a debt review practice.** Periodically read AI-generated code from three to six months ago as a fresh reader. Not to assess whether it works — you know it works, it's in production — but to assess whether it's understandable. Is the 2am test passing? Are the assumptions documented? Is the structure still comprehensible to someone who didn't write it? Debt that's caught six months in is much cheaper to address than debt caught at two years.

### When Debt Has Already Accumulated

The strategies above prevent new debt. Most teams reading this already have AI-generated code in production that accumulated debt before anyone had a framework for preventing it.

**Triage, don't panic.** Not all technical debt is equally costly. Debt in high-churn code that's touched frequently is expensive — every change brushes against the accumulated confusion. Debt in stable code that's rarely modified is cheap — it sits there, ugly, but not hurting anyone actively. Start the debt reduction work where the churn is high.

**Refactor vs. rewrite.** The rule of thumb: refactor when you understand what the code is doing well enough to make targeted changes safely. Rewrite when the code is so opaque that understanding it takes longer than reimplementing it. AI-generated code that's been modified multiple times without being understood can reach the rewrite threshold faster than typical human-written code, because each modification was made without full comprehension of the structure.

**The strangler fig for high-debt AI components.** If a component has significant debt and is actively changing, consider the strangler fig pattern: build the new, better-understood version alongside the old one, gradually move traffic to the new version, and deprecate the old one when traffic is fully migrated. This avoids the risk of a big-bang rewrite while allowing the accumulated debt to be addressed systematically.

### Your Relationship With Code You Didn't Write

This is the meta-level shift that AI-augmented engineering requires.

Historically, ownership roughly correlated with authorship. You understood the code you wrote because you wrote it. You were accountable for it because your decisions were in it. AI breaks this correlation. You can be the merge button for code that neither of you fully understands — fast, high-volume, and structurally unable to own.

The engineers who navigate this well are the ones who treat authorship as irrelevant and ownership as mandatory. The question is never "did I write this?" The question is "do I understand this well enough to be responsible for it?" If the answer is no, the work isn't done yet.

That standard is harder to meet in a world where AI can generate large volumes of plausible code quickly. The answer isn't to slow down indefinitely, but to be honest about the difference between "this code is in our repo" and "this code is owned." The second requires understanding. The understanding requires effort. The effort is what makes the code maintainable — and what makes you the kind of engineer who can be trusted with it.`,
  quiz: [
    {
      question: "An AI-generated module has 95% test coverage and all tests pass. A senior engineer reads the code and is concerned it may have bugs. What is the most important reason test coverage alone is insufficient evidence that the code is correct?",
      options: [
        "AI-generated tests typically use mocking incorrectly, which causes false positives regardless of coverage percentage",
        "AI-generated tests are written against the implementation, not the requirement — a function with a bug gets tests that pass with the bug, producing high coverage and misplaced confidence",
        "95% coverage leaves a 5% gap that is statistically likely to contain the most critical edge cases",
      ],
      correct: 1,
      explanation: "When AI writes tests for existing code, it reads the implementation and writes tests that verify what the code does — including any bugs. A function that returns the wrong value in a specific case gets a test that expects the wrong value, passes, and contributes to the 95% coverage. The fix is writing integration tests that document the requirement independently of the implementation, ideally before the implementation exists. Coverage numbers from AI-generated test suites are structurally unreliable as indicators of correctness.",
    },
    {
      question: "Six months after an AI-assisted sprint, your team hits a production bug in code none of the current engineers wrote or remember writing. The PR was merged by a team member who has since left. What is the most significant structural failure this situation represents?",
      options: [
        "The team didn't run sufficient red-team testing before shipping the feature",
        "The code was merged without anyone taking ownership — understanding it well enough to explain its decisions, describe its failure modes, and be accountable for its behavior",
        "The original engineer left the team without documenting the codebase adequately, creating a knowledge gap",
      ],
      correct: 1,
      explanation: "The bug is a symptom; the structural failure is the absence of ownership. Ownership means understanding the code well enough to defend it: explaining why it's structured the way it is, predicting its failure modes, describing what it assumes. Code that was merged because 'the AI wrote it and tests passed' was never owned in this sense — there was an author (the AI) and an approver (the engineer), but no owner. Documentation gaps and insufficient testing are contributing factors, but they're downstream of the ownership failure.",
    },
  ],
}
