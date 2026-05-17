export const growingJuniorEngineers = {
  slug: "growing-junior-engineers",
  title: "Growing Junior Engineers in the AI Era",
  summary:
    "How to keep junior engineers developing real skills when AI handles the work that used to build them — what the growth model looks like now, how to spot the difference between AI-as-accelerant and AI-as-crutch, and what the 1:1 conversation sounds like.",
  difficulty: "INTERMEDIATE" as const,
  roles: ["EM"] as const,
  tags: ["management", "team", "growth", "mentorship"],
  order: 28,
  content: `## Growing Junior Engineers in the AI Era

The standard model for junior engineer development was always a gradual complexity ramp: simple bug fixes, then small features, then features with dependencies, then owning a component, then technical leadership on a project. The learning happened through the work — writing code, having it reviewed, understanding why the review caught what it caught, and slowly building the mental models that would become senior-engineer judgment.

AI tools short-circuit parts of this loop in ways that produce the appearance of development without the substance. A junior engineer who generates code, gets it reviewed, and merges it has shipped. They may not have learned anything. Managing this is a new and real EM responsibility.

### What Used to Build Skills (and What AI Changed)

**Debugging.** In the traditional model, a junior engineer hit errors they couldn't immediately understand, were forced to read stack traces carefully, added print statements, formed hypotheses, and tested them. This was often the most frustrating part of their day — and the most formative. The debugging session builds the mental model of how systems actually behave.

When AI tools generate code that mostly works, juniors encounter fewer errors in the code they wrote. When they do encounter errors, the first instinct is to paste the error into the AI and get a fix. If the fix is accepted without understanding why it works, the debugging skill never develops. The engineer learns to operate AI tools; they don't learn to debug systems.

**Writing code from scratch.** The process of translating a specification into code — thinking through data structures, edge cases, error handling — is where design thinking develops. It forces the engineer to confront every decision: how should this be structured? What happens if this is null? When AI generates the structure, those decisions are made automatically, and the junior never practices making them.

**Getting reviewed on code they understood completely.** A code review is valuable only if the reviewer and reviewee share an understanding of what the code is doing. When a junior submits AI-generated code they don't fully understand, the review conversation is degraded — they can't explain their decisions because the decisions weren't theirs. The feedback loop that should build judgment produces silence instead.

**Owning something end-to-end.** Seeing a feature from requirements to production to monitoring to first production bug is what builds system-level thinking. AI doesn't change this — but it does mean that EMs who let AI handle implementation may accidentally let it handle the integration between implementation and ownership too.

### The Difference Between AI-as-Accelerant and AI-as-Crutch

These look the same from the outside — both produce code faster. The difference is internal to the engineer and shows up in specific observable behaviors.

**AI-as-accelerant:** The engineer uses AI to generate boilerplate and routine patterns they already understand, handles the novel and complex parts themselves, can explain any code they submit (including AI-generated sections), asks "should I generate this or write it myself?" and has a reasoned answer, and uses AI suggestions as a starting point to critique and improve.

**AI-as-crutch:** The engineer pastes requirements into AI and submits the output with minimal review, cannot explain sections of code they submitted, uses AI to avoid engaging with unfamiliar problems rather than to handle familiar ones faster, debugging skill is not developing, and code reviews are becoming shallower over time.

The tell-tale diagnostic: ask the engineer to walk you through code they submitted. Not "does it work?" — you can see that. "What does this section do, and why is it structured this way?" An engineer who used AI as an accelerant can answer this. An engineer using it as a crutch will stumble on the why.

A second diagnostic: pull the AI assistant away for a debugging session. Not punitively — frame it as "let's reason through this together." An engineer who is developing real skills can engage with the problem. An engineer who has become dependent will be genuinely lost, not in a "I'm nervous with my manager watching" way, but in a "I actually don't know how to approach this" way.

### What Growth Actually Requires

This is the harder problem. Telling juniors to use AI less is not the answer — they'll use it anyway, and using it less doesn't automatically produce better learning. The question is how to design work and feedback loops that build skills in an AI-augmented environment.

**Require understanding before acceptance.** The most important cultural norm you can set: engineers are responsible for understanding every line of code they submit, regardless of how it was generated. Not a rote requirement — a meaningful one. "I generated this with Claude and I understand why it works" is different from "I generated this with Claude and it passed the tests."

Make this real in code review. When a junior submits a PR, ask: "Walk me through the logic in this function." If they can, the requirement was met. If they can't, that's the review comment: you need to understand this before it merges. A few of these conversations, done without blame, shift the norm.

**Design assignments with deliberate skill targets.** Not every task should be AI-optimizable. Deliberately include work that requires:
- Reading and understanding an existing codebase section before modifying it
- Debugging a problem without AI assistance (start the debugging session with you, then let them continue)
- Writing a design doc before any code is generated
- Owning a production incident from alert to resolution

These aren't contrived busywork. They're the natural complement to AI-accelerated implementation — the judgment and system-comprehension work that AI doesn't do.

**Make the learning visible.** Senior engineers often learn implicitly — they debug, develop intuitions, don't articulate the process. Junior engineers benefit from making that process explicit. After a debugging session, ask: "What's the mental model you built about why this was happening?" After a code review, ask: "What would you do differently next time?" This forces the articulation that consolidates the learning.

**Calibrate the AI usage conversation, don't prohibit.** The right conversation with a junior is not "you're using AI too much" — it's "let's talk about when AI makes you faster vs. when it's making it harder to learn." Some juniors will have thought about this and will have good answers. Others won't have thought about it at all and will benefit from the framing. The goal is to make the choice conscious, not to make it for them.

### The 1:1 Conversation

When you see the signals — shallower reviews, inability to explain code, lost in debugging, PRs that look polished but have no evident author reasoning — here's how to have the conversation.

Open with observation, not accusation: "I've noticed your review comments have been lighter over the past few sprints. I want to understand what's happening — can you tell me what you're focusing on in reviews?"

This is likely to surface one of three things: they're overwhelmed and reviews are getting less attention, they're deferring to AI tools to do the review work, or they've genuinely shifted attention and have a reason. All three are useful to know.

For the AI-crutch situation specifically: "I want to make sure you're actually learning from the work you're shipping. When you submit AI-generated code, are you doing a full review before it goes in?" The answer will tell you whether they've thought about this.

The follow-up: work together on what learning targets make sense given where they are. A junior engineer in month 6 should be building debugging instincts, understanding the data layer, owning a piece of the codebase. Help them see how their current work does or doesn't build toward those targets — and where AI should be a tool vs. where it's replacing the practice they need.

### What Healthy AI Use Looks Like

For a junior engineer using AI well:
- They complete familiar-pattern work faster and use that time for deeper engagement with unfamiliar problems
- They submit code they can explain, and treat unclear AI output as a signal to understand better, not a sign to submit anyway
- Their debugging skill is developing over time — they're better at reading stack traces, forming hypotheses, and understanding system behavior than they were six months ago
- Code reviews are substantive — they leave comments that engage with the logic, not just surface-level observations
- They're developing a point of view about when to use AI and when not to — and that point of view is grounded in their actual experience

Your job as EM is to create the conditions for this trajectory and notice early when it's not happening. The signals are subtle at first and obvious at six months. Catching it at three months is much cheaper than catching it at nine.`,
  quiz: [
    {
      question: "A junior engineer submits 40% more PRs per sprint since adopting AI coding tools. Their code passes review and tests pass. Three months later, you notice their review comments have become surface-level and they struggled visibly in a debugging session. What is most likely happening?",
      options: [
        "The junior engineer is overwhelmed by their increased output volume and needs a reduced workload to focus on quality",
        "The junior engineer is using AI tools as a crutch rather than an accelerant — output is up but the skill-building feedback loops that debugging and deep code review provide are atrophying",
        "The junior engineer is experiencing normal performance variation; increased output and temporary debugging struggles don't indicate a pattern",
      ],
      correct: 1,
      explanation: "The combination of increased output, shallower reviews, and degraded debugging performance is the classic AI-as-crutch pattern. Output volume went up because AI handles the implementation. Review quality went down because the engineer doesn't deeply understand code they didn't write. Debugging suffers because the engineer never practices it — AI handles the error fixing. None of these signals alone is conclusive, but together they indicate that the productivity gain is not accompanied by skill development, and the gap will widen.",
    },
    {
      question: "What is the most important cultural norm an EM can establish to ensure junior engineers develop real skills in an AI-augmented environment?",
      options: [
        "Requiring engineers to disclose when they used AI assistance in generating code, so reviewers can apply appropriate scrutiny",
        "Holding engineers accountable for understanding every line of code they submit, regardless of how it was generated — and making this expectation real through code review conversations",
        "Limiting AI tool usage to a defined percentage of each engineer's weekly output to ensure manual implementation practice",
      ],
      correct: 1,
      explanation: "The norm that matters is ownership of understanding, not disclosure of generation method. An engineer who generated code with AI and understands it fully is in the right position. An engineer who wrote code manually but doesn't understand it is in the wrong position. 'You're responsible for understanding what you submit' is a principle that holds regardless of tools — and making it real in review conversations (asking engineers to explain their code) is the mechanism that gives it teeth. Usage limits don't address understanding; they just create friction.",
    },
  ],
}
