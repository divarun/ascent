export const icJudgmentAndTaste = {
  slug: "ic-judgment-and-taste",
  title: "From \"How to Build\" to \"What to Build\"",
  summary:
    "The shift in IC engineering work when AI handles more implementation — what judgment looks like, why it's the scarce resource now, and how to keep developing it.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["IC"] as const,
  tags: ["career", "judgment", "strategy", "craft"],
  order: 31,
  content: `## From "How to Build" to "What to Build"

When implementation velocity is the bottleneck, the highest-value engineering skill is implementation. When AI handles a growing portion of implementation, that's no longer the bottleneck — and the highest-value skill shifts accordingly.

This is the structural change happening in engineering work right now. It's not that implementation work disappears. It's that the scarce resource is increasingly the judgment work that sits above implementation: knowing what to build, whether to build it at all, and what the second-order consequences are.

### The Identity Crisis Nobody Talks About

Many ICs describe feeling like code janitors. They're reviewing AI-generated PRs they didn't write. They're cleaning up AI output that's mostly correct. They're approving changes they understand but didn't design. The work that historically felt like their identity — writing code, solving hard problems from scratch, crafting something that's distinctly theirs — happens less often.

This discomfort is real. It's also based on a misread of where the role is going.

The "code janitor" framing treats reviewing AI output as the final state. It's not. It's the transition state — what happens when AI implementation capability arrives faster than the organizational and professional structures for working with it. The final state is something different: engineers who own the judgment that AI can't provide, with AI handling the implementation under their direction.

The engineers most at risk of genuinely becoming code janitors are the ones who treat review as the highest-value work available to them, rather than as one part of a role that includes the decisions that precede review: what gets built, how it's architected, which tradeoffs to accept, and what the downstream consequences will be.

### What Judgment Looks Like in Engineering Work

Judgment isn't a soft skill or a career-level abstraction. It's a specific set of concrete things an experienced engineer does that a junior engineer doesn't, and that an LLM currently cannot.

**Recognizing when a technically correct solution is wrong for the context.** A solution that's optimal in isolation can be the wrong choice for your team, your codebase, or your constraints. The AI generates something elegant and efficient. A senior engineer looks at it and thinks: "This is clever, and no one on our team will be able to maintain it, and in six months when something breaks at 2am the on-call engineer will spend four hours understanding this before they can fix it." That recognition is judgment.

**Knowing when "simple and slightly worse" beats "clever and optimal."** This is a specific version of the above that comes up constantly in AI-augmented engineering. AI tends to generate sophisticated solutions to problems where a naive solution would do fine. The model doesn't have the information to know that your team's cognitive load is high right now, that you're in a hiring freeze and new engineers won't have context on this code, or that this feature may be deprecated in Q3 anyway. Knowing when to reach for simple instead of optimal requires context the model doesn't have.

**Understanding when adding AI adds risk rather than value.** "Can we use AI for this?" is increasingly easy to answer yes to. The harder question is whether using AI for a specific task adds sufficient value to justify the latency, cost, complexity, and failure modes it introduces. A rule-based approach that handles 99% of cases perfectly may be better than an AI approach that handles 99.5% of cases approximately. Knowing which is which requires understanding the failure modes of both — not just the AI.

**Seeing the maintenance burden of a choice before it becomes a problem.** Code has to be read, debugged, extended, and eventually changed. The initial implementation is a small fraction of total cost. A choice that costs 10% more to implement but 50% less to maintain is usually correct, but nothing surfaces that tradeoff in a diff or a code review unless someone explicitly thinks through it. That calculation is judgment.

**Reading the requirements and noticing what isn't said.** Product specs describe the intended case. Experienced engineers notice the edge cases the spec didn't mention, the implicit assumptions that will break under real-world conditions, and the success criteria that are absent. "This spec says 'users can upload a file' but doesn't say what happens when the file is 10GB, or malformed, or contains a virus." Noticing that gap before implementation — rather than after a production incident — is judgment.

### The "AI for Everything" Trap

There's a professional hazard in AI-adjacent work that looks like enthusiasm and produces worse systems: using AI for tasks where it adds more problems than it solves.

AI tools are broadly applicable. You can plausibly apply LLMs to almost any text-in, text-out task. The question isn't whether you can — it's whether you should.

**Where AI genuinely works well:**
- Tasks with clear quality signals (you can tell whether the output is good quickly and reliably)
- Tasks with high variance in acceptable approaches (many valid paths to the same destination)
- Tasks that appear frequently in training data (standard patterns, well-documented domains)
- Tasks where approximate correctness is valuable even when exact correctness isn't achievable

**Where AI genuinely works poorly:**
- Novel problems without precedent in training data
- Problems requiring specific real-time context the model can't access (your internal data, your specific codebase, the current state of your production system)
- Problems where "approximately right" isn't useful — where the answer needs to be exactly correct or the feature fails
- Problems where failure is invisible and cumulative — where the model can be wrong in ways that compound over time without triggering any obvious signal

The practical questions to ask when someone proposes adding AI to a feature:

- **What happens when this is wrong?** If the answer is "the user gets slightly suboptimal output," the stakes are low. If the answer is "we send the wrong data to the wrong person," the stakes are high and the bar for using AI should be correspondingly high.
- **Can a user tell when it's wrong?** If users can't detect errors, they'll trust incorrect output — which is sometimes worse than no output.
- **What's the fallback?** If the AI is unavailable or produces garbage, what happens? A feature with no fallback is fragile in ways that compound.
- **Is this actually a hard problem, or does it just look like one?** Many tasks that feel like they need AI can be solved with a lookup table, a regex, or a simple rule. AI solutions are harder to test, harder to debug, and more expensive to operate than deterministic ones.

The new engineering skill isn't knowing how to apply AI. It's knowing when not to.

### The Value Your Judgment Brings to Your Organization

In an org where AI handles more implementation, the things that remain distinctly valuable are the things AI can't do well. Understanding what those are isn't defensive positioning — it's understanding what to invest in.

**Architecture decisions that will outlast the sprint.** The choice of data model, service boundary, or communication pattern shapes everything that gets built on top of it. Getting it wrong is cheap to change in week one and expensive to change in year two. AI can propose architectures, but it can't know your organization's trajectory, your team's capabilities, your legacy constraints, or your strategic direction. Someone has to own that call.

**Code review that understands intent, not just syntax.** A review that checks whether code is syntactically correct and tests pass is table stakes. A review that understands what the code is trying to accomplish, whether the approach is right for the context, and what will happen when requirements change is harder. AI can do the former. The latter requires understanding the product, the codebase, and the team — which is what you have.

**Estimating work that involves genuine uncertainty.** Estimation is a judgment call about what you don't know — unknown unknowns, integration complexity, the difference between "this looks easy" and "this is easy." AI can generate estimates based on analogous work, but the accuracy of those estimates depends entirely on how similar the analogy is. Knowing whether the analogy holds requires context and experience.

**Knowing what to escalate vs. solve independently.** The engineer who escalates everything wastes everyone's time. The engineer who never escalates builds personal solutions to organizational problems. The calibration between them — knowing which problems are genuinely yours to solve and which are above your pay grade — is judgment that develops over years and isn't replicable from training data.

**Pushing back on requirements with understanding of the user.** Saying "I don't think users will actually want this" and being right requires knowing the users well enough to have an informed opinion. That knowledge comes from close attention over time. AI can generate user personas and simulate user needs — but the engineer who's been working on a product for two years has qualitative knowledge of actual users that's genuinely hard to replicate.

### How to Keep Developing Judgment When AI Handles More Implementation

If AI does more of the implementation, less of your daily work directly exercises the skills that develop judgment. This is the skill atrophy risk. It doesn't happen automatically, but it happens if you're not deliberate about it.

**Deliberately practice the parts AI doesn't do.** System design discussions, incident postmortems, architecture reviews, debugging complex production failures — these are the exercises that build judgment. If your normal workflow has fewer of these because AI is handling more, you have to seek them out. Volunteer for the architecture review. Ask to be involved in the postmortem. Offer to own the hard debugging problem instead of feeding it to an AI.

**Build mental models, not just implementations.** For every piece of code you write or review, spend a few minutes on the "why" rather than just the "what." Why is this data model structured this way rather than another way? What would happen if we changed this boundary? What assumption does this implementation encode, and is that assumption actually true? These questions build the kind of understanding that transfers to new problems. Implementation experience without this reasoning builds pattern recognition for familiar problems; it doesn't build judgment for novel ones.

**Read code critically.** Read AI-generated code not to merge it but to understand it: what did it optimize for, what did it assume, what would make this wrong? Read code written by strong engineers you respect: what choices did they make, and why were those the right choices? Critical reading builds taste. Accepting code because it compiles and tests pass builds nothing.

**Own your decisions.** The easiest version of engineering in an AI-augmented org is to generate, accept, and ship — to be the human in the loop without the judgment that should accompany that role. The version that builds your career is to take genuine ownership: understanding the code well enough to defend it, understanding the tradeoffs well enough to explain them, and being accountable for the outcome rather than deflecting to "the AI generated it." Ownership requires understanding. Understanding requires effort. The effort is the practice.

### The Career Signal

The engineers advancing fastest in AI-augmented organizations aren't the ones who use AI most aggressively or who are most enthusiastic about it. They're the ones who use AI as a force multiplier on judgment rather than a substitute for it.

The observable pattern: engineers who can articulate what problems are worth solving and why, who catch the things AI misses in review, who ask the questions that expose the hidden assumption in a design, who take ownership of decisions rather than delegating them to tools — these engineers are increasingly valuable as AI handles more implementation. The implementation ceiling rises; the judgment ceiling stays where it always was.

The engineers who stagnate are the ones who measure their contribution in volume of code shipped or PRs merged — metrics that AI makes easy to optimize and that reflect less and less of the actual value being created.

The shift isn't comfortable. It requires investing in the harder, less immediately legible parts of the job. But those parts are exactly what becomes more valuable as implementation becomes more automated.`,
  quiz: [
    {
      question: "An AI tool generates a highly optimized sorting algorithm for a use case where a simple sort would perform adequately. A junior engineer wants to use the optimized version because it benchmarks better. What is the right IC judgment call here?",
      options: [
        "Accept the optimized version — benchmark improvements are always worth taking when they come for free",
        "Evaluate whether the optimization's complexity adds meaningful user value, or whether it adds maintenance burden and cognitive load without proportionate benefit",
        "Reject the optimized version by default — AI-generated complexity should always be simplified to ensure understandability",
      ],
      correct: 1,
      explanation: "The judgment question is whether the performance gain is worth the complexity cost in this specific context. A sorting optimization that saves 2ms in a path that runs once per user session is not worth the cognitive overhead of a non-obvious algorithm. The same optimization in a hot path processing millions of records per second might be. Accepting AI output because it benchmarks better, without evaluating context, is the 'clever over simple' trap. Rejecting it by default ignores cases where the optimization genuinely matters. The evaluation is the work.",
    },
    {
      question: "Your team proposes using an LLM to classify customer support tickets into categories. The existing rule-based classifier has 94% accuracy. The LLM prototype has 97% accuracy. What questions should drive the build-vs-keep decision?",
      options: [
        "Whether the 3% accuracy gain translates to meaningful cost savings on support operations, and whether the LLM's failure modes (latency, cost, non-determinism, hallucination) are acceptable given the use case",
        "Whether the LLM can be fine-tuned to achieve higher accuracy, since 97% is a starting point not an endpoint",
        "Whether the engineering team is comfortable maintaining an LLM-based system, since team comfort is the primary factor in long-term maintainability",
      ],
      correct: 0,
      explanation: "A 3% accuracy improvement is only valuable if it translates to meaningful outcomes, and only worth the switch cost if the new system's failure modes are acceptable. LLMs add latency, operational cost, non-determinism, and new failure modes (hallucination, prompt sensitivity) that rule-based systems don't have. The right question is whether the improvement justifies the added complexity and new risks — not whether higher accuracy is theoretically achievable, or whether team comfort is optimized. This is exactly the kind of 'AI for everything' trap where judgment matters more than enthusiasm.",
    },
  ],
}
