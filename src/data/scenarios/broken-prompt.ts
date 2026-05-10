export const brokenPrompt = {
  slug: "broken-prompt",
  title: "The Broken Prompt",
  isUnlocked: true,
  summary:
    "Your AI feature was working fine. Now it's generating wrong outputs for 30% of users. Nothing in the codebase changed. Debug it.",
  roles: ["IC"] as const,
  difficulty: "INTERMEDIATE" as const,
  industry: "Consumer App",
  context: `You're an IC engineer at a fitness app. Two weeks ago you shipped an AI feature that generates personalized workout plans. The feature takes a user profile (age, fitness level, goals, available equipment) and returns a structured workout plan via a single LLM call. It launched cleanly — positive user feedback, low error rate.

Since Monday (3 days ago), your on-call monitoring shows a spike. User complaints:
- Workout plans are prescribing barbell exercises for users who listed "no barbell" in their equipment
- Beginner users are receiving advanced movements
- Some plans are missing entire days

You check the deployment history: no code changes since the original launch 2 weeks ago. Your prompt is stored in the codebase unchanged. Your model is accessed through the provider's API using a floating alias ("gpt-4-latest" style, not a dated version).

Your logs capture the full prompt and response for every request. You pull them.

Your manager says: "Root cause by EOD. And tell me how we prevent it next time."`,
  prompts: [
    {
      id: "p1",
      question:
        "Walk through your debugging approach. What do you check first, and why? What are you trying to rule out at each step?",
      followUp:
        "Your logs show the prompt is identical to what was working before, and the user input looks normal. Responses are clearly degraded. What's your leading hypothesis now, and how do you confirm it?",
      modelAnswer:
        "First thing I check is the logs — a side-by-side of a working request from last week and a failing one from this week. I want to see if the prompt actually being sent is identical, if the user inputs look normal, and if the response structure has changed. I'm not touching anything until I know which layer is failing. If prompt and input are identical but outputs are degraded, the change is in the model. Given the floating alias, my leading hypothesis is that the provider silently updated the model behind it. I'd confirm by checking whether the API response metadata reports a different model ID, or by replaying the same prompt against the previous pinned version if I can identify it from provider release notes.",
    },
    {
      id: "p2",
      question:
        "You've confirmed it: the API provider silently updated the model behind the floating alias. The new version interprets constraint instructions differently. What do you do right now, and what do you do this week?",
      followUp: null,
      modelAnswer:
        "Right now: pin the model to the specific dated version that was running before Monday — most providers expose these alongside the floating aliases. One-line change, deploy it, verify a sample of outputs manually, incident resolved. This week: add output validation in the serving path — parse each generated plan and verify every equipment reference appears in the user's stated equipment list before returning it. That catches this entire class of error before users see it. I'd also audit every other endpoint in the codebase using a floating alias — this isn't isolated to one prompt, and each one is a latent version of the same risk.",
    },
    {
      id: "p3",
      question:
        "This bug was live for 3 days before you caught it via user complaints. What monitoring or automated checks would have caught it sooner? What do you put in place now?",
      followUp:
        "A teammate argues the real fix is improving the prompt to be more explicit about constraints. Another says just pin the model version. Which do you prioritize first and why?",
      modelAnswer:
        "Two things would have caught this before a single user saw a bad plan. First, a regression test suite: 20–30 representative user profiles with fixed inputs and defined assertions — beginner profile never gets advanced movements, 'no barbell' profile never gets barbell exercises — run in CI on every deploy and on a nightly schedule against production. Second, output validation in the serving path: parse each response and block any plan that violates the user's stated constraints before returning it. Either would have caught Monday's regression immediately. Going forward I'd also log the actual model ID returned by the API on every request — floating aliases should be treated as a liability, not a convenience.",
    },
  ],
  rubric: [
    {
      criterion: "Debug Methodology",
      description:
        "Systematic approach: checks logs first, isolates whether the issue is prompt, model, or input data before changing anything. Doesn't immediately start rewriting the prompt. Forms a hypothesis and tests it.",
    },
    {
      criterion: "Root Cause Identification",
      description:
        "Arrives at model version drift (floating alias) as the likely cause. Understands why this causes degradation: the new model version interprets the same prompt differently, which is a known risk of floating aliases.",
    },
    {
      criterion: "Immediate Response",
      description:
        "Pins the model to the previously working version (or rolls back to it) as the fast fix. Does not try to prompt-engineer around a moving target before stabilizing the environment first.",
    },
    {
      criterion: "Prevention",
      description:
        "Identifies structural fixes: model version pinning policy, output validation that checks generated plans against the user's stated constraints, regression test suite with representative profiles and expected output criteria.",
    },
  ],
  staticFeedback: {
    overallAssessment:
      "The root cause is almost certainly model drift via a floating version alias — a predictable failure mode for any prompt relying on a non-pinned model. The fix is pinning the version. The lesson is that prompts are not portable across model versions, and floating aliases make version changes silent and undebugable.",
    strengths: [
      "Checking logs before changing anything — understanding the problem before acting on it",
      "Recognizing that 'nothing changed in the codebase' doesn't mean nothing changed in the system",
    ],
    blindSpots: [
      "Output validation could have caught this immediately: parsing the generated plan and verifying it doesn't reference equipment the user doesn't own is straightforward and would have surfaced errors before users saw them",
      "A regression test suite running against 20–30 representative user profiles would have caught degradation in CI before it reached production",
      "Every other prompt in the codebase using a floating alias is now a latent version of this same risk — this deserves a team-wide audit, not just a fix for this endpoint",
    ],
    improvements: [
      "Pin model versions in production. Update deliberately on a schedule with evals before deploying — not implicitly via the provider.",
      "Add output validation: parse each plan and check that referenced equipment appears in the user's profile before serving",
      "Build a regression test suite: 20–30 user profiles with known constraints and expected output properties (difficulty level, equipment used)",
    ],
    followUpQuestion:
      "You've pinned the model version. Three months later, the provider announces the pinned version is being deprecated in 60 days. How do you manage that transition?",
    score: 6,
  },
}