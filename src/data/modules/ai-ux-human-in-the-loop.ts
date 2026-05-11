export const aiUxHumanInTheLoop = {
  slug: "ai-ux-human-in-the-loop",
  title: "AI UX & Human-in-the-Loop Design",
  summary:
    "Trust calibration, approval workflows, editable outputs, feedback loops, and when not to automate — the design decisions that determine whether an AI feature helps or harms users.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["PM", "EM", "IC"] as const,
  tags: ["product", "ux", "design", "human-in-the-loop"],
  order: 9,
  content: `## AI UX & Human-in-the-Loop Design

Most AI product failures are not model failures. They're design failures. How you expose AI output to users determines whether it helps or harms them — and whether they develop an accurate mental model of what the system can and can't do.

### Trust Calibration: The Central Design Problem

Users miscalibrate trust in AI by default, in both directions:

**Over-trust (automation bias):** Users accept AI outputs without scrutiny because they look authoritative, are produced quickly, and are formatted with apparent confidence. This is well-documented in psychology — people defer to automated systems even when they have reason to doubt them. In AI products, it manifests as users copying AI output verbatim, approving AI recommendations without reading them, and blaming themselves when AI outputs are wrong.

**Under-trust (algorithm aversion):** After a single salient failure, users reject the AI entirely — even for tasks it handles well. This often happens when the failure feels surprising or when the user had no mental model of the AI's limitations. Unlike human experts, AI systems don't get the benefit of the doubt after an error.

Both failure modes have the same root cause: the user doesn't have an accurate model of when to trust the system. Your design job is to help users build that model — and then maintain it as the system's capabilities change.

**Core principle:** Make AI involvement visible. Make the basis for outputs accessible. Make correction easy and expected. Make errors feel like a normal part of the system, not a betrayal.

### Mental Model Formation and Onboarding

The mental model users form in the first few interactions determines their trust calibration for months. This makes onboarding more consequential for AI features than for traditional software.

**Specific risks:**
- Showing only best-case outputs during onboarding sets an expectation the median experience won't meet
- Not explaining limitations upfront leads to trust collapse when users hit them unexpectedly
- Framing the AI as "smart" or "intelligent" without qualification leads to over-trust on tasks outside its competence

**Design patterns that work:**
- During onboarding, show the AI handling a realistic task from the user's domain — not a curated showcase
- Explicitly surface one or two known limitations early: "This feature works best for X. For Y, you should verify the output."
- Give users a low-stakes way to test the system before relying on it for real work
- After early errors, frame them as expected: "AI suggestions aren't always right — that's why we make them easy to edit"

The goal is calibrated trust, not maximized confidence. A user who understands the AI's limitations and uses it accordingly is a better long-term user than one who's impressed in week one and disillusioned by week three.

### Communicating AI Uncertainty

Users can handle "I'm not sure" better than they can handle a confident wrong answer. The problem is that most AI UX hides uncertainty rather than surfacing it.

**Patterns for surfacing uncertainty:**

**Confidence indicators:** Show when the model expresses lower confidence. This doesn't require a precise probability — a simple "I'm less certain about this" label changes user behavior. Don't show confidence on everything; reserve it for cases where it meaningfully affects how users should treat the output.

**Source citations:** For factual claims, show the sources. This lets users verify claims that matter and builds trust in claims they don't verify. Even partial citations ("based on your Q3 report") are more trustworthy than unsourced assertions.

**Uncertainty language in the output:** Prompt the model to use hedging language for uncertain claims. "According to available information..." and "You may want to verify..." are both signals users read. Don't strip this language out in post-processing for the sake of sounding clean.

**Progressive disclosure:** Don't frontload all caveats. Show the output first, with a lightweight uncertainty signal (an icon, a muted confidence label). Surface more detail on demand — "Why did the AI say this?" as an expandable panel rather than prepended to every response.

**What not to do:**
- Present AI output in the same visual treatment as verified facts or official data
- Use phrases like "the data shows" or "research indicates" when the source is the model's training data
- Hide the AI's role in producing an output — this is also increasingly a legal issue (see Disclosure section below)
- Strip hedging language to make outputs sound more authoritative

### Approval Workflows: When to Insert a Human

Not all AI outputs should flow directly to users or downstream systems. Design approval workflows based on the consequence of errors, not just the probability of errors.

**Require human approval when:**
- Actions are irreversible: sending emails, publishing content, modifying database records, making payments
- Errors carry reputational, legal, or financial risk
- Output confidence is measurably low
- You're in early deployment and still establishing baseline reliability
- The output will be attributed to a specific person (their reputation is on the line, not just yours)

**Approval workflow design:**

Show reviewers what the AI did and why, not just the output. A reviewer who can see the AI's reasoning catches errors that a reviewer who only sees the output misses. This is the difference between "approve this email" and "the AI drafted this email based on these facts — does this accurately represent the situation?"

Make approval fast or it won't happen honestly. If reviewing takes more than 30–60 seconds, reviewers will rubber-stamp without reading. Either reduce the volume requiring review, reduce the complexity of what needs review, or accept that the "approval" is theater.

**Track your approval metrics:**
- **Approval rate without edits:** If >95% of outputs are approved unchanged, either your AI is very good, or reviewers aren't really reviewing. Distinguish by sampling approved outputs for quality.
- **Edit rate and edit distance:** What percentage of outputs are edited? How substantially? High edit rates signal AI quality problems. Zero edit rates may signal rubber-stamping.
- **Time-to-review:** Tracks reviewer engagement. Consistently short review times on complex outputs suggest reviewers aren't reading.

**Synchronous vs. asynchronous review:**
Synchronous review (user waits for approval before proceeding) is highest-fidelity but creates latency. Asynchronous review (AI acts, human reviews after) works for lower-stakes actions and higher-volume workflows. Match the review pattern to the stakes and volume, not to engineering convenience.

### Editable AI Outputs

Presenting AI output in an editable field is the single most underused pattern in AI product design. It changes the user's relationship with the output from passive recipient to active editor.

**Why this works:**
- Lowers the quality bar required: the AI needs to be useful as a starting point, not perfect as a final product
- Gives users agency and reduces automation bias — they're editing a draft, not approving a decision
- Generates implicit feedback signal: what users change is where the AI is wrong
- Matches the actual user benefit: faster than starting from scratch, even if imperfect

**Editing patterns to consider:**

**Inline editing:** Present output in a text field the user can edit directly. The simplest and most effective pattern for generated text.

**Chunk-level accept/reject:** For structured outputs or multi-part responses, let users accept or reject sections independently. More friction than inline editing, but useful when users want to keep some parts and replace others.

**Diff view for modifications:** When the AI is modifying existing content rather than generating new content, show a diff — what was changed and what was kept. This makes the AI's contribution visible and makes errors easy to spot.

**Regenerate with feedback:** Give users a way to request a new version with specific guidance: "Make it shorter," "Use a more formal tone," "This fact is wrong — fix it." This is more efficient than editing from scratch and generates valuable prompt data.

**Mental model framing:** The UI copy matters. "AI gave you a draft, you own the final product" produces better behavior than "Here is your AI-generated content." The first frames the AI as a tool in a workflow; the second frames it as an output to be consumed.

### The Co-Pilot to Autopilot Spectrum

Co-pilot and autopilot are endpoints on a spectrum, not a binary choice. The transitions between modes are where most teams make mistakes.

**Co-pilot:** AI assists, human decides and acts. User reviews suggestions and accepts, rejects, or modifies. Every output has a human checkpoint. High error tolerance; high labor cost.

**Supervised autopilot:** AI acts, human reviews outcomes. AI takes actions; humans review batches after the fact rather than individually. Requires statistical quality monitoring. Errors propagate until the next review cycle.

**Full autopilot:** AI acts, system monitors. Human involvement is exception-based — triggered by alerts, anomalies, or user reports. Only appropriate when reliability is very high and error stakes are low.

**How to move along the spectrum safely:**
1. Start co-pilot, always
2. Measure co-pilot approval rates and edit patterns — this establishes your quality baseline
3. Move to supervised autopilot only when co-pilot approval-without-edit rate is consistently high (>90%+) and you have production monitoring in place
4. Move to full autopilot only when supervised autopilot incident rate is demonstrably low over an extended period

**The common trap:** Shipping autopilot because co-pilot feels like "too much friction." Friction exists because it catches errors. Removing it requires replacing it with something of equivalent value — stronger evals, better monitoring, lower stakes, or faster error recovery. If you're removing friction without replacing it, you're increasing risk, not reducing it.

### Error Recovery UX

How you design error recovery determines whether users lose trust permanently after an AI failure or update their mental model and continue.

**Principles for error recovery:**

Make errors feel expected, not exceptional. If users are surprised every time the AI is wrong, they'll lose trust globally. If the UX frames errors as a normal part of working with AI — easily corrected, not something to be ashamed of — users develop resilience.

Make correction the path of least resistance. The correction affordance should be at least as prominent as the acceptance affordance. A tiny "suggest edit" link next to a large "Accept" button is not a correction mechanism — it's theater.

Explain what happened when possible. "The AI couldn't find relevant information for this query" is more trust-preserving than a generic error message. It lets users understand the system's limitations rather than concluding the system is unreliable.

Close the feedback loop. When a user corrects an output, acknowledge it: "Thanks — we'll use this to improve." Even if the feedback doesn't immediately change anything, closing the loop signals that corrections matter and reduces the feeling of futility.

**Log correction data as your most valuable quality signal.** User corrections in production are ground-truth evidence of AI failures in your actual distribution. Build the pipeline to capture them. This data is more valuable for improving your system than any synthetic eval dataset.

### Implicit Feedback Loops

Explicit ratings ("Was this helpful? 👍👎") have low response rates and self-selection bias. Implicit behavioral signals are more reliable and require no user action.

**Behavioral signals worth tracking:**
- **Edit rate and edit distance:** Did users edit the AI output before using it? How much? High edit rates on specific output types indicate systematic AI quality problems.
- **Regeneration rate:** Did users ask for a new version? Correlates with dissatisfaction with the first output.
- **Copy-without-edit rate:** Did users copy the output directly? Correlates with satisfaction — but also with automation bias. Distinguish by downstream outcome if possible.
- **Abandonment after AI output:** Did users leave the flow after seeing AI output? May indicate the output was unhelpful or confusing.
- **Time-to-action:** How long did users spend reading/editing before acting? Very short times on complex outputs may indicate rubber-stamping.
- **Downstream correction rate:** For AI outputs that feed into subsequent steps (a draft that gets sent, a classification that drives a workflow), do users correct the downstream result? This measures the quality of AI output as judged by real-world use, not just user perception.

Build dashboards that track these metrics by feature, output type, and user segment. They are your ongoing quality signal.

### Disclosure: When and How to Label AI

Users have a right to know when AI is involved in producing content or decisions that affect them. This is both an ethical position and, increasingly, a legal requirement.

**EU AI Act requirements:** The Act entered into force August 2024 on a phased schedule. Prohibited AI practices took effect February 2025. Transparency requirements (Article 50) — including disclosure that a system is AI when interacting with humans, and labeling of AI-generated content — apply from August 2026. High-risk AI systems in employment, education, credit, healthcare, and law enforcement face conformity assessments and mandatory transparency obligations, also from August 2026. Organizations should be building toward these requirements now.

**US regulatory landscape:** The FTC has issued guidance on AI disclosure. Several states have passed or are considering disclosure requirements for AI-generated content, particularly in political advertising and consumer-facing automated decisions.

**Practical disclosure principles:**

Disclose at the point of output, not just in terms of service. A disclosure buried in documentation doesn't constitute meaningful transparency. Users should know AI was involved when they're interacting with the output.

Distinguish between AI-assisted and AI-generated. "AI helped draft this" is different from "this was entirely generated by AI." Users interpret these differently and both are accurate descriptions in different situations.

Don't use disclosure as a liability shield while designing the UX to minimize its visibility. A tiny gray "AI-generated" label below large confident-looking output is not honest disclosure — it's a checkbox exercise. If the disclosure matters, make it visible.

For consequential decisions, provide a mechanism for users to request human review. This is required in some jurisdictions (EU GDPR Article 22 for fully automated decisions) and good practice everywhere.

### When Not to Automate

Some tasks should not be automated with AI, even when technically feasible.

**Don't automate when:**

The human judgment is part of the value. A doctor's diagnosis has meaning that an AI recommendation doesn't, even if the accuracy rates are similar. A hiring manager's decision carries accountability that an AI ranking doesn't. Users, regulators, and courts recognize this distinction.

Errors compound over time. If each AI decision feeds the next step, errors amplify. Automated content moderation that feeds algorithmic distribution amplifies early errors across the user population. Automated credit decisions that feed loan portfolios can concentrate risk invisibly.

Users need to feel ownership of the decision. Compliance sign-offs, editorial choices, strategic commitments, and personnel decisions have social and legal weight that requires a human to stand behind them. Automating the decision while keeping a human rubber-stamp signature is worse than either full automation or genuine human decision-making — it has the accountability gap of automation and the labor cost of human review.

Skill atrophy is a real harm. Some tasks are worth doing partly because doing them builds capability. If your AI feature replaces a cognitive process that users need to develop — junior engineers debugging, doctors interpreting test results, analysts building intuition — you may be trading short-term efficiency for long-term capability degradation. Ask: "If this feature works exactly as designed, what capabilities does it atrophy in the people who use it? Are those capabilities we need them to retain?"

### Anti-Patterns to Avoid

Common AI UX mistakes that teams repeatedly make:

**The confident void:** Displaying AI output in the same visual treatment as verified facts — same font, same formatting, no qualification. Creates false equivalence between AI inference and authoritative information.

**The buried correction:** Making the "this is wrong" affordance hard to find, slow to use, or visually subordinate to the acceptance affordance. Signals that corrections are unwelcome and reduces the implicit feedback signal you need.

**The permanent skeleton:** Showing a loading state for so long that users start to form expectations about what they'll see — then delivering something that doesn't match. Manage temporal expectations explicitly.

**The one-shot generator:** Presenting AI output as a finished product with no affordance to iterate, regenerate, or refine. Forces users to either accept imperfect output or manually rewrite from scratch.

**The confidence kabuki:** Showing a confidence score or uncertainty indicator that doesn't actually change based on the model's real uncertainty — a static "85% confident" that appears on every output. Users eventually realize it's decorative and stop using it as a signal.

**The apologetic disclaimer:** Prepending every AI output with a lengthy disclaimer about AI limitations. This creates disclaimer blindness — users learn to skip the text — and doesn't actually help users calibrate. Front-loaded disclaimers are a substitute for good uncertainty design, not a complement to it.

**The hidden AI:** Presenting AI-generated content with no disclosure because it "looks cleaner." This erodes trust more severely when users discover the AI involvement than upfront disclosure would have.

### Practical Design Checklist

Before shipping an AI-assisted feature:

**Transparency**
- Is it unambiguously clear to users when AI produced an output?
- Does your disclosure comply with applicable regulations for your jurisdiction and use case?
- Can users see the basis for AI outputs (sources, reasoning) when it matters?

**Trust calibration**
- Does your onboarding set accurate expectations about the AI's limitations?
- Do you communicate uncertainty explicitly, not just through hedging language?
- Have you designed the failure state — what users see when the AI fails or is unavailable?

**Human control**
- Is correction accessible within two interactions?
- Are high-stakes or irreversible actions gated behind human confirmation?
- Do users have a path to request human review for consequential decisions?

**Quality monitoring**
- Are you tracking edit rate, regeneration rate, and correction rate as quality proxies?
- Do you have alerts for degraded AI performance in production?
- Are user corrections being captured and fed back into your eval pipeline?

**Automation scope**
- Have you asked: "What capabilities does this atrophy in users who rely on it?"
- Is there a path to reduce human involvement over time — and have you defined the evidence required before taking it?`,
  quiz: [
    {
      question: "Your team notices that 97% of AI outputs are approved in your review workflow without edits, and reviewers average only 8 seconds per review. What does this most likely indicate?",
      options: [
        "Your AI model has reached production-ready quality and the review layer can be safely removed",
        "Reviewers are rubber-stamping rather than genuinely reviewing — the approval rate and time suggest automation bias, not actual quality",
        "Your eval set is too easy; you should add more adversarial cases to lower the apparent approval rate",
      ],
      correct: 1,
      explanation: "A near-100% approval rate with very short review times is a signal that reviewers aren't genuinely engaging with the content — they're rubber-stamping. The fix is to sample approved outputs for quality independently, or reduce the volume requiring review so reviewers can engage meaningfully.",
    },
    {
      question: "What is the core reason to present AI-generated text in an editable field rather than as a finalized output?",
      options: [
        "Editable fields signal lower quality, appropriately calibrating user trust downward",
        "Editable outputs lower the quality bar required, reduce automation bias, and generate implicit feedback signal from what users change",
        "Editable fields are required by EU AI Act for all AI-generated content displayed to users",
      ],
      correct: 1,
      explanation: "Presenting output as editable changes the user's relationship with it — from passive consumer to active editor. This reduces automation bias, lowers the quality bar required (the AI needs to be a useful starting point, not a perfect final product), and what users edit is ground-truth evidence of where the AI is wrong.",
    },
  ],
}