# Ascent

**AI decision training for Product Managers, Engineering Managers, and ICs.**

Ascent is a simulation platform, not a course platform. People learn AI through decisions — not passive content.

---

## What it is

| Feature | Description |
|---|---|
| **Foundation** | Text-first learning modules, 15–25 min each, no fluff |
| **Scenarios** | Structured decision simulations — write your reasoning, get direct feedback |
| **Missions** | Real-world exercises applied to your actual job |
| **Onboarding diagnostic** | Builds a Decision Readiness Profile based on role, context, and AI familiarity |
| **Progress tracking** | Four levels: Aware → Informed → Practitioner → Leader |

---

## Guest vs. account

No account needed. Everything is accessible immediately.

| | Guest            | Account |
|---|------------------|---|
| Read modules | ✓                | ✓ |
| Do scenarios + get feedback | selected         | ✓ |
| Submit missions + get feedback | selected         | ✓ |
| Progress tracked across sessions | —                | ✓ |
| Points + leveling | —                | ✓ |
| Personalized recommendations | —                | ✓ |

Role selection for guests persists in the browser. Clearing browser storage resets it.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth v4 (credentials + JWT) |
| Container | Docker + Docker Compose |

---

## Content

### Modules (20)

**All roles**
1. What AI Is — Beginner
2. AI Building Blocks — Beginner
3. What LLMs Actually Do — Beginner
4. Prompting Is Not Programming — Beginner
5. What AI Is Bad At — Beginner
6. Model Selection Basics — Intermediate
7. AI UX & Human-in-the-Loop Design — Intermediate
8. AI Ethics & Bias — Intermediate
9. AI Evaluation & Reliability — Advanced

**PM + EM**
10. Build vs. Buy: AI Edition — Intermediate
11. AI Product Failure Modes — Intermediate
12. Data Privacy & AI Governance — Intermediate
13. Measuring AI ROI — Advanced
14. Leading AI at Org Level — Advanced

**EM + IC**
15. RAG, Context, and Memory — Intermediate
16. Agentic AI — Intermediate
17. Fine-tuning & Model Customization — Intermediate
18. AI Security & Prompt Injection — Intermediate
19. AI in Production: Monitoring & Observability — Advanced

**IC**
20. Building Reliable AI Features — Advanced

### Scenarios (15)

1. The AI Vendor Pitch — Intermediate, PM
2. The AI Feature Scope Creep — Intermediate, EM
3. The Hallucinating Executive Demo — Intermediate, PM / EM
4. The Legal / Compliance Escalation — Intermediate, PM / EM
5. The Broken Prompt — Intermediate, IC
6. The Prompt That Leaked — Intermediate, IC
7. The AI Team That Can't Ship — Advanced, EM
8. Build or Buy: The Vector Search Problem — Advanced, EM / IC
9. The Expensive AI Endpoint — Advanced, EM / IC
10. The Biased Model — Advanced, PM / EM
11. The Agent Went Rogue — Advanced, EM / IC
12. The Enterprise Data Blocker — Advanced, PM
13. The Silent Rollback — Advanced, EM
14. The AI Org Question — Advanced, EM
15. Designing the Eval From Scratch — Advanced, IC

### Missions (12)

1. Find the AI Opportunity — Beginner, all roles
2. Improve an Existing Workflow with AI — Beginner, all roles
3. Audit an AI Feature You Own — Beginner, EM
4. Draft an AI Usage Policy — Intermediate, all roles
5. Create an AI Evaluation Plan — Intermediate, all roles
6. Design a Prompt System — Intermediate, IC
7. Run a Bias Check — Intermediate, PM / EM
8. Write an AI Feature Brief — Intermediate, PM
9. Communicate an AI Decision to Stakeholders — Intermediate, PM / EM
10. Evaluate an AI Vendor Claim — Advanced, PM
11. Red-Team an AI Workflow — Advanced, all roles
12. Write an AI Incident Post-mortem — Advanced, EM / IC

---

For setup, environment variables, local development, and how to add content, see [detailed.md](detailed.md).
