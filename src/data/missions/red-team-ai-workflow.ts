export const redTeamAiWorkflow = {
  slug: "red-team-ai-workflow",
  title: "Red-Team an AI Workflow",
  isUnlocked: false,
  description:
    "Adversarially probe an existing AI workflow to find its failure modes before users do.",
  roles: ["IC", "EM", "PM"] as const,
  difficulty: "ADVANCED" as const,
  instructions: `## Mission: Red-Team an AI Workflow

Most AI workflows are tested against happy paths. Real users find the edge cases immediately. Red-teaming is the practice of systematically attacking a system to find its failure modes before they reach production — or before they become a bigger problem if it's already shipped.

Pick an AI workflow you have access to, or describe one in enough detail to work with it concretely. This could be an internal tool, a product feature, or a system you've built or observed.

### Your submission must cover:

**1. Workflow description**
Describe the workflow clearly enough that someone unfamiliar with it can understand what it does, who uses it, and what "failure" means. Include: the input, what the AI does with it, and what happens to the output downstream.

**2. Attack surface map**
Before testing, map what could go wrong. Group your attack surface into at least four categories. Examples:
- Input manipulation (unusual formatting, extreme lengths, adversarial phrasing)
- Distribution shift (inputs the system wasn't designed for)
- Prompt injection (if users can influence the prompt directly or indirectly)
- Component boundary failures (where retrieval hands off to generation, where AI output feeds a downstream system)
- Goal misalignment (what users will actually try vs. what designers assumed)
- Edge case clusters (empty inputs, max-length inputs, multilingual inputs, special characters)

**3. Findings (minimum 5)**
For each finding, document:
- What you tried (specifically — "I submitted a blank input" not "I tested edge cases")
- What happened (exact behavior, not a summary)
- Why it's a problem (what user harm or system failure this represents)
- Severity: High / Medium / Low

**4. Prioritized risk list**
Rank your top 3–5 findings by severity × likelihood. Which failures would a real user encounter most often? Which would cause the most damage?

**5. Mitigations**
For your top 3 findings, propose a specific mitigation. Not "add guardrails" — something implementable: "validate that the output contains at least one item from the source document before serving," "add a length check that rejects inputs over 4,000 tokens with an explanatory message," "add output schema validation with a retry on failure."

### What makes a strong submission:
Findings are specific and reproducible. Mitigations are implementable, not aspirational. The submission covers multiple attack categories — not five variations of the same approach. Severity ratings are calibrated to actual user impact, not theoretical worst case.`,
  staticGuidance: `Effective red-teaming is systematic, not random. The most valuable findings come from probing the scenarios the system was explicitly not designed for.

**The five categories that catch the most failures:**

**Distribution shift** is the highest-yield category. Every AI system is tested on inputs similar to what the developers expected. Real users bring inputs from outside that distribution constantly — different phrasing, different languages, domain-specific terminology, unusual formatting. Test inputs that are technically valid but stylistically unexpected.

**Goal misalignment** reveals hidden assumptions. Developers design for one user intent; users often have others. A summarization feature will have users who want it to write their email for them. A search feature will have users who treat it as a Q&A system. Test what happens when users use the system for adjacent purposes it wasn't designed for.

**Component boundaries** are where systems fail silently. The handoff between retrieval and generation in RAG systems, between AI output and downstream processing, between AI and human review — these seams often have the least testing. A retrieved context that's slightly off can produce confident, wrong generation. An output that looks reasonable to a human reviewer but is malformed for the downstream parser causes silent failures.

**Prompt injection** is underestimated in internal tools. If any user-controlled input ends up in the prompt (even indirectly via a document that gets retrieved), injection is possible. Test whether instructions embedded in user content can override system instructions.

**Empty and boundary conditions** are almost never tested in AI systems. What happens with an empty input? A 10,000-token input? An input that's entirely punctuation? These surface missing validation that would be obvious in a non-AI feature.`,
  checklist: [
    "Workflow is described clearly enough for someone unfamiliar to understand what failure means",
    "Attack surface is mapped into at least 4 distinct categories before testing",
    "At least 5 findings with specific inputs tried, exact behaviors observed, and user harm explained",
    "Each finding has a severity rating (High/Medium/Low) with justification",
    "Findings are prioritized by severity × likelihood — not just severity",
    "Top 3 findings have specific, implementable mitigations (not 'add guardrails')",
  ],
  staticFeedback: {
    assessment: "Effective red-teaming is systematic, not random. The most valuable findings come from inputs the system was not designed for — distribution shift, goal misalignment, and component boundaries catch more failures than direct adversarial attacks.",
    highlights: [
      "Mapping the attack surface into categories before testing, rather than probing randomly",
      "Including specific inputs and observed behaviors for each finding, making them reproducible",
    ],
    suggestions: [
      "Prioritize by severity × likelihood, not severity alone — a high-severity finding requiring unusual circumstances may rank below a medium-severity finding affecting 20% of users",
      "Make mitigations specific: 'add guardrails' is not a mitigation — 'add input length validation to reject inputs over 10,000 tokens' is",
    ],
    nextSteps: [
      "Share the top three findings with engineering and get a timeline for mitigation",
      "Add the highest-priority finding to your next sprint as a concrete ticket with acceptance criteria",
    ],
  },
}
