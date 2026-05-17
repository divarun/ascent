export const dependencyAuditAiCode = {
  slug: "dependency-audit-ai-code",
  title: "Dependency Audit on AI-Generated Code",
  isUnlocked: false,
  description: "Read a real AI-generated PR as the on-call engineer at 2am and document every hidden assumption, failure mode, and coverage gap.",
  roles: ["IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  instructions: `## Mission: Dependency Audit on AI-Generated Code

AI-generated code encodes assumptions that the author didn't notice and therefore didn't document. Your task is to find them.

Pick a PR in your codebase that was substantially AI-generated — either one you submitted or one you reviewed. Read it as if you're the on-call engineer at 2am when it breaks in production.

### What to document:

**1. The dependencies**
Every assumption the code makes about its environment:
- What shape does the input need to be? What happens if it's null, empty, or malformed?
- What external services does it call? What happens if they're slow, throttled, or down?
- What does it assume about database state? What invariant does it rely on being true?
- What does it assume about the model's behavior? What if the model returns an unexpected format, or a format that was correct 3 months ago but changed?

**2. The failure modes**
For each dependency: what does failure look like in production?
- Is it a crash with a stack trace, or silent corruption?
- Is it wrong output that looks right, or obviously wrong output?
- Is it a latency spike that causes timeouts upstream, or a P99 degradation that takes weeks to notice?

**3. The coverage gaps**
What scenarios are NOT covered by the existing tests? Don't just list them — for each gap, say whether it's acceptable or whether it needs a test.

**4. The documentation gap**
What would a future engineer need to know to maintain this code that isn't in the code or comments? What context does the original author have that isn't written down anywhere?

**5. Your assessment**
If this broke at 2am, how quickly could you diagnose it? What would your first 3 debugging steps be? What would you change before this goes to production?

### What to look for:
The obvious assumptions are usually in the tests. The dangerous ones aren't. Look for: what happens when external services return valid-but-unexpected data, what happens at the edges of the data distribution the model was trained on, what happens if the AI model is updated and its output format shifts slightly.`,
  staticGuidance: `Strong audits find the assumptions that are hidden, not the ones that are obvious. The obvious ones are usually in the tests or the error handling. Look for: what the code does when external services return unexpected-but-valid data, what happens at the boundaries of the data the model was trained on, what happens if the AI model is updated and changes its output format slightly.

The 2am framing is intentional. In a 2am incident, you don't have the author, you don't have context, you have the code and the logs. Read the code that way: what would you need to know that isn't written down?

The most common finding in AI-generated code is confident error handling that catches the errors the author thought about, and fails silently on the ones they didn't. Find those.`,
  checklist: [
    "At least 4 distinct dependencies documented (input shape, external services, state assumptions, model behavior)",
    "Each dependency has a documented failure mode with a description of how it manifests",
    "Coverage gaps identified and each marked as acceptable or needing a test",
    "Documentation gap is specific (not 'more comments' — what specifically is missing?)",
    "Assessment includes concrete debugging steps, not just 'I'd look at the logs'",
  ],
  staticFeedback: {
    assessment: "The strongest audits find at least one assumption that the original author genuinely didn't think about — not because they were careless, but because AI-generated code often handles the common case confidently and the edge case silently. If your audit only found things that were already documented or obviously handled, look harder at the boundaries.",
    highlights: [
      "Finding a failure mode that manifests as wrong output rather than a crash — these are the most dangerous because they go undetected longest",
      "Identifying what's missing from the documentation that only the author currently knows — this is the knowledge that disappears when someone moves teams",
    ],
    suggestions: [
      "For each dependency you found: add a one-line comment to the actual code explaining the assumption — don't just document it in your submission",
      "If the 2am debugging steps require tribal knowledge (knowing which service to check, which log to read), that's a documentation gap — add it",
    ],
    nextSteps: [
      "Turn the coverage gaps that need tests into actual test cases — this is the mission's most direct output",
      "Share the documentation gap findings with the PR author so they can add context while it's still fresh",
    ],
  },
}
