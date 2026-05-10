export const aiCodingAssistants = {
  slug: "ai-coding-assistants",
  title: "AI Coding Assistants: What You Need to Know",
  summary:
    "Copilot, Cursor, Claude Code — what these tools actually do, how to use them effectively, and what questions to ask before rolling them out to your team.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["EM", "IC"] as const,
  tags: ["engineering", "tooling", "productivity", "agents", "coding"],
  order: 8,
  content: `## AI Coding Assistants: What You Need to Know

AI coding assistants are the most widely adopted AI tool in software development. They're also widely misunderstood — both by the managers deploying them and the engineers using them every day.

This module covers two things: what the tools are and how to evaluate them (EM focus), and how to use them effectively in practice (IC focus).

### What They Actually Do

The category has fragmented into meaningfully different tools. Understanding how each works explains why they're good at different things — and why output quality is almost entirely determined by context quality.

**Inline completion (Copilot, Codeium)**

These tools take the current file, your cursor position, and a window of surrounding context, then call an LLM to predict what comes next. The suggestion appears inline as ghost text. Accept it with Tab, ignore it by continuing to type.

The model was trained on public code (primarily GitHub). It pattern-matches against what it's seen before. This is why it excels at common patterns in popular languages and struggles with proprietary APIs, internal frameworks, and novel architectures. It doesn't know your codebase unless you give it context.

**AI-first editors (Cursor, Windsurf)**

These are complete development environments built around an LLM. The key difference: they index your codebase and use retrieval to pull relevant files, symbols, and definitions into the model's context when you make a request. When you ask "refactor this function to use our new error handling pattern," the editor can find that pattern in your codebase and use it — a standalone completion tool cannot.

They also support multi-file edits in a single operation and natural language commands that modify code directly. The quality of output scales with the quality of context retrieval. A poorly indexed codebase produces worse results than a well-indexed one.

**Agentic coding tools (Claude Code, Codex CLI, Devin)**

These tools are given a task and work toward it autonomously: reading files, writing code, running tests, interpreting output, and iterating. They operate in a loop rather than responding to individual prompts.

Claude Code and Codex run in a terminal and are developer-supervised — you see what they're doing and can intervene. Devin and similar tools aim for more autonomous operation with less developer involvement.

The honest current state: agentic tools work well for isolated, well-specified tasks (add this endpoint, write tests for this module, fix this failing test). They degrade on tasks with vague scope, deep codebase dependencies, or requirements that need product judgment. They are not reliable for end-to-end feature development without significant human oversight.

### The Tool Categories (Decision Framework)

| Category | Examples | Best For | Watch Out For |
|---|---|---|---|
| Inline completion | Copilot, Codeium | Boilerplate, common patterns, low-friction adoption | Accepting suggestions without reading them |
| AI-first editors | Cursor, Windsurf | Refactoring, multi-file changes, codebase-aware tasks | Retrieval quality varies; test before committing |
| Agentic (supervised) | Claude Code, Codex CLI | Isolated tasks with clear specs, test writing, debugging | Scope creep; set explicit task boundaries |
| Agentic (autonomous) | Devin | Highly specified, isolated tasks | Not reliable for complex features; verify all output |

Don't standardize on a single tool for all use cases. Many teams use inline completion for day-to-day work and agentic tools for specific high-value tasks.

---

## Using These Tools Effectively

### Context Management: The Primary Leverage Point

The single highest-leverage skill for working with AI coding tools is managing what's in context. The model can only work with what it sees.

**For inline completion tools:**
The model sees the current file and a few related files. Open the files most relevant to what you're building — the interface you're implementing, the related utility functions, the types you're using. Keep the current file clean; noisy or stale code degrades suggestions.

**For AI editors:**
These tools use retrieval to pull relevant context from your codebase. Vague requests retrieve vague context; specific requests with type names, function names, and file references retrieve precise context.

**Explicit context inclusion patterns:**

*Include interfaces and type definitions.* If you're implementing a function that works with a type defined elsewhere, include that type definition. The model generates code that conforms to the actual interface rather than inventing one.

*Include usage examples of the APIs you're calling.* If you're using an internal API, include a file that already uses it correctly. The model pattern-matches against usage examples more reliably than against documentation alone.

*Include the test file alongside the implementation file.* When writing implementation code, having the test file visible produces code more likely to pass the tests.

*Exclude irrelevant files.* More context is not always better. Irrelevant files add noise. If you're working on the payment module, including the authentication module's internals may confuse more than help.

**Internal API reference files:**
For frequently-used internal APIs, create a brief reference file (e.g., \`ai-context/internal-apis.md\`) documenting common patterns and usage examples. Include it in context for relevant tasks. This is one of the highest-ROI investments for teams using AI coding tools on large codebases — it largely closes the gap between "API in training data" and "your internal API."

### Prompt Patterns for Coding Tasks

**Specification before implementation:**
Instead of "write a function that does X," write the function signature, docstring, and key assumptions first, then ask the model to implement it. The spec forces you to clarify your requirements and gives the model precise constraints.

\`\`\`
// Before asking for AI completion:
/**
 * Validates that a credit card expiry date string is valid and not expired.
 * @param expiry - Format "MM/YY"
 * @returns true if valid format and not expired, false otherwise
 * @throws never - returns false for all invalid inputs
 */
function validateCardExpiry(expiry: string): boolean {
  // [ask AI to implement this]
}
\`\`\`

**Ask for a plan before code:**
For complex tasks, ask the model to outline its approach first. "Before writing any code, describe how you would implement X" surfaces misunderstandings early. A plan that's wrong is cheaper to correct than code that's wrong.

**Iterative refinement over single-shot generation:**
Break complex features into steps and implement one at a time. Each step's output becomes context for the next. Better results than "implement the entire feature" and gives you checkpoints to verify correctness.

**Constrain the solution space:**
"Implement this without using a library," "implement this to handle concurrent access," "implement this to be easy to test" — constraints produce better-targeted code than open-ended requests.

**Ask for alternatives:**
"Show me two different approaches to this problem" is often more valuable than "write the code." Comparing approaches builds your understanding and may surface a better option.

### Agent Workflows: Higher Leverage, Higher Risk

Agent mode changes the risk profile significantly.

**Higher leverage:** More gets done per prompt. A well-scoped agent task can implement an entire feature in a single session.

**Higher blast radius:** Mistakes span multiple files and are harder to detect. An agent that gets confused halfway through a refactor may produce a codebase in an inconsistent state.

**Task scoping for agents:**
Agents work best on tasks that are isolated, well-specified, and verifiable:

- **Isolated:** Doesn't touch shared state or cross-cutting concerns. A new API endpoint, a new utility module, a self-contained bug fix.
- **Well-specified:** Expected behavior described precisely, including edge cases. Vague tasks produce vague implementations.
- **Verifiable:** There's a test or observable behavior confirming completion. "Make the tests pass" is a better termination condition than "implement the feature."

**The minimal footprint principle:** Request the minimum necessary changes. "Add an endpoint for X" not "refactor the entire API layer and add an endpoint for X."

**Operational discipline:**
- Run agents on isolated feature branches, never on main
- Review every file change — not just the agent's summary
- Run the full test suite after every agent session before pushing
- If an agent appears stuck in a loop, stop it and restart with a more specific task

### Hallucinated APIs: A Common and Costly Failure Mode

AI coding tools regularly generate code that calls APIs that don't exist, use function signatures that don't match, or reference deprecated methods. The code looks correct. It often compiles. It fails at runtime.

**Why this happens:** The model's confidence about an API correlates with how frequently it appeared in training data, not whether it's correct. Popular, stable APIs hallucinate less. Newer libraries, frequently changing APIs, and internal APIs hallucinate more.

**Verification workflow:**
1. For any method or API you don't recognize, check the documentation directly before running the code
2. Check the library version in your package file against the documentation version
3. For internal APIs, check the actual source — don't trust the model's representation of your internal code

**Run code early.** Don't complete an entire session and then run the code. Run each piece as you go. The sooner you find a hallucinated API, the less work needs to be rebuilt.

### Security: The Specific Failure Mode to Watch

AI coding tools reproduce patterns from training data. That training data includes code with security vulnerabilities. Models don't distinguish secure from insecure patterns — they reproduce what's statistically common.

**Patterns that AI code frequently gets wrong:**

**SQL and query injection:** Generated database queries often use string interpolation instead of parameterized queries. Audit every generated query before committing.

**Hardcoded credentials:** Models sometimes include placeholder credentials that look like real values. Check for any string that looks like a key, token, or password.

**Authentication and authorization gaps:** Generated auth code may omit authorization checks, mix up authentication and authorization, or implement insecure session handling.

**Overly permissive defaults:** Generated configurations, CORS settings, and permission models often default to permissive configurations that are insecure in production.

Apply more scrutiny to AI-generated code in security-sensitive paths than to handwritten code, not less. The model has no concept of security intent — it writes code that works, not code that's secure.

### Test Generation: What Works and What Doesn't

**Where it works well:**
- Unit tests for pure functions with clear input/output contracts
- Happy-path cases that are tedious to write
- Parameterized test cases with varied inputs
- Test stubs that you complete with domain-specific assertions

**Where it goes wrong:**

*Tests that test the implementation, not the requirement.* If you ask for tests after writing the implementation, the model often writes tests that match what the code does rather than what it should do. A function with a bug gets tests that pass with the bug. Generate tests before or during implementation, not after.

*Missing edge cases requiring domain knowledge.* The model doesn't know your business rules. It generates plausible edge cases based on the function signature — a starting point, not a complete test suite.

**The coverage trap:** High test coverage from AI-generated tests is misleading. A test that calls a function and checks it doesn't throw has 100% coverage and zero confidence in correctness. For each generated test, ask: "If this function had a bug here, would this test catch it?"

### Reviewing AI-Generated Code

The fastest way to accumulate technical debt is to approve AI-generated code because it looks plausible. An AI code review should be more thorough than a human code review, not less.

The AI optimized for "looks correct given the prompt." You need to verify "is correct given the actual requirements."

**Review checklist:**

**Correctness:** Does this actually solve the stated problem? Trace through a tricky case, not just the happy path. What happens at boundaries: empty inputs, null values, maximum sizes, concurrent access?

**Security:** Injection vulnerabilities in user-provided input. Auth checks in place. No hardcoded credentials or insecure defaults.

**Error handling:** Are all error paths handled explicitly? Are resources released on error paths?

**Performance:** N+1 query patterns in loops. Unbounded operations on user-provided input sizes.

**Maintainability:** Will someone understand this in six months without the prompt that generated it? Are the comments accurate?

**Integration:** Does this fit the patterns used elsewhere in the codebase? Will it interact correctly with the rest of the system, not just in isolation?

**AI-generated comments:** Read every generated comment against the code it describes. Comments that describe what the prompt requested rather than what the code does are a common failure. Write your own comments for non-obvious logic — you understand the intent; the model understands the implementation.

### Debugging AI-Assisted Implementations

When AI-generated code fails, the instinct is to feed the error back immediately. This usually produces a plausible-looking change that doesn't fix the root cause.

**Better approach:**
1. Understand the failure yourself first. Form a hypothesis before asking the AI.
2. Isolate the failing case to the smallest reproducible example.
3. Verify your mental model of what the code should do.
4. Then ask with precision: "This function returns null when input is an empty array, but it should return an empty array — here's the relevant code path."

**Know when to discard.** If AI-generated code fails in ways you don't understand after reasonable debugging, rewrite from scratch with explicit guidance. Accumulated patches on poorly-understood AI code compound into maintenance debt.

---

## Org-Level Considerations

### The Productivity Question

Published studies report 10–55% productivity gains. These numbers are real but require interpretation.

**What they measured:** Time-to-completion on isolated coding tasks. This captures what AI assistants are best at.

**What they missed:** Integration work, debugging, code review, architecture decisions — a significant portion of senior engineering time. Productivity gains on pure coding tasks don't transfer linearly to overall team output.

**Who benefits most:** Mid-level engineers in familiar domains see the largest gains. Senior engineers on complex problems see smaller gains. Junior engineers see high completion rates but also higher error rates without critical review.

**What can degrade:** Code review thoroughness. AI-generated code looks clean and confident even when subtly wrong. If review quality drops, bug rates increase despite higher velocity.

Measure ticket-to-PR time, PR review cycle time, and bug rate in AI-assisted code. Lines of code will increase; that metric tells you nothing useful.

### Security and Compliance

**What leaves your network?**
Inline completion tools send code snippets to vendor servers for every suggestion. AI editors may send larger context windows. If your codebase contains credentials, PII, regulated data, or trade secrets, that data leaves your network on every request. Audit your codebase for secrets before enabling any cloud-based AI tool.

**Training data opt-out:**
Most enterprise tiers explicitly exclude your code from model training. Verify this contractually, not just in marketing copy. GitHub Copilot Business, Cursor Business, and most enterprise offerings include this. Free tiers often do not.

**Self-hosted options:**
For high-sensitivity environments: locally-hosted completions, self-hosted Codeium, GitHub Copilot Enterprise with private network options. Output quality is typically lower than cloud models.

**Generated code and IP:**
There's unresolved legal uncertainty around AI-generated code that closely mirrors training data. Some tools offer a "code duplication detection" filter. If this matters to your legal team, enable it.

### Skill Development Risk

The most underappreciated management problem is skill atrophy, particularly for junior engineers.

An engineer who uses AI completions before understanding what correct code looks like develops a cargo-cult relationship with the tool: they produce code that looks right without building the mental model to know when it's wrong. The result is engineers who are fast at generating code and slow at debugging it.

**Mitigations:**
- Set an explicit policy for junior engineers: AI completions are review tools, not answers. Before accepting a suggestion, be able to explain what it does and why it's correct.
- Maintain code review standards. "The AI wrote it" doesn't lower the bar — if anything, AI-generated code warrants more scrutiny.
- Preserve unassisted practice: debugging sessions, architecture discussions, whiteboard problem-solving. These build the understanding that makes AI tools useful rather than load-bearing.
- Watch for the plateau signal: junior engineers who improve quickly then stop improving. Fast generation can mask the absence of deepening understanding.

**For your own development:** Use AI for acceleration, not for avoiding understanding. The engineers who get the most from AI coding tools are the ones with strong fundamentals — they evaluate AI output critically because they know what correct looks like.

### Evaluating Vendor Claims

Every vendor claims 40–55% productivity gains. Ask:
- **What tasks were measured?** Isolated tasks inflate the number; whole-workflow measurement deflates it.
- **What was the baseline?** Some studies compare against developers on unfamiliar tasks.
- **Was code quality controlled?** Faster velocity with higher bug rates is not a productivity gain.

Run a bounded internal pilot — two sprints, a subset of the team, defined metrics — before drawing conclusions.

### Cost at Scale

Token costs are non-trivial at team scale and frequently surprise EMs.

AI-first editors can consume significant API tokens per developer per day on large codebases. Agentic tools on long tasks can burn substantial costs in a single session. At 20 developers using an AI editor heavily, monthly costs can reach thousands of dollars on top of per-seat licensing.

Understand the cost model before committing: per-seat flat fee vs. consumption-based vs. hybrid. Flat-fee tools are more predictable. Consumption-based tools need usage monitoring.`,
  quiz: [
    {
      question: "An AI coding assistant generates a function that calls a method that doesn't exist in the current library version. The code compiles but fails at runtime. Why does this happen?",
      options: [
        "The model deliberately generates placeholder APIs that developers are expected to implement",
        "The model's confidence about an API correlates with its frequency in training data, not with its correctness in your specific library version",
        "The model applied a high temperature setting that introduced random variation into the function signature",
      ],
      correct: 1,
      explanation: "AI coding tools hallucinate APIs because they pattern-match on what appeared frequently in training data. Popular, stable APIs hallucinate less; newer or frequently changing APIs hallucinate more. The verification workflow: check documentation directly, verify the library version, and run code early.",
    },
    {
      question: "A junior engineer is using an AI coding assistant and producing high output volume, but their debugging skills don't seem to be improving. What is the primary risk?",
      options: [
        "The AI is generating code with security vulnerabilities that the junior engineer cannot detect",
        "Accepting AI completions before building a mental model of correct code creates a cargo-cult relationship where the engineer can generate but not debug",
        "The AI tool is creating vendor lock-in through proprietary coding patterns the engineer is internalizing",
      ],
      correct: 1,
      explanation: "Skill atrophy is the most underappreciated management risk with AI coding tools. Engineers who accept AI completions before understanding the code develop the ability to generate quickly but not to evaluate critically. The signal is fast code generation that plateaus — velocity is high, but depth of understanding isn't growing.",
    },
  ],
}