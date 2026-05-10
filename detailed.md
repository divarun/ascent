# Ascent — Detailed Reference

Setup, configuration, project structure, and content authoring.

---

## Quick start (Docker)

**Prerequisites:** Docker, Docker Compose

```bash
# 1. Clone the repo and enter the directory
cd ascent

# 2. Copy the env file
cp .env.example .env

# 3. Start the database and app
docker compose up

# 4. In a separate terminal, run migrations and seed content
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed

# 5. Open http://localhost:3000
```

All feedback is predefined static content. No external calls needed.

---

## Local development (no Docker)

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure env
cp .env.example .env
# Edit DATABASE_URL to point to your local PostgreSQL instance

# 3. Run database migrations
npx prisma migrate dev

# 4. Seed content
npm run db:seed

# 5. Start dev server
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✓ | — | PostgreSQL connection string |
| `NEXTAUTH_URL` | ✓ | `http://localhost:3000` | Base URL, used by NextAuth for callbacks |
| `NEXTAUTH_SECRET` | ✓ | — | JWT signing secret — any random string, keep it secret in production |
Generate a secret with: `openssl rand -base64 32`

---

## Project structure

```
Ascent/
├── prisma/
│   ├── schema.prisma          # Full data model
│   ├── seed.ts                # Seeds from src/data/
│   └── migrations/            # SQL migration history
│
├── src/
│   ├── app/                   # Next.js App Router pages + API routes
│   │   ├── page.tsx           # Landing page
│   │   ├── login/
│   │   ├── signup/
│   │   ├── onboarding/        # 4-step persona + readiness wizard
│   │   ├── dashboard/         # Authenticated user hub
│   │   ├── learn/             # Module list and individual module reader
│   │   ├── scenarios/         # Scenario list and simulation player
│   │   ├── missions/          # Mission list and submission form
│   │   ├── basics/            # Client-side AI quiz (no auth needed)
│   │   └── api/
│   │       ├── auth/          # NextAuth handler + /signup
│   │       ├── modules/       # List + complete
│   │       ├── scenarios/     # List + fetch + attempt submit
│   │       ├── missions/      # List + fetch + submission
│   │       ├── onboarding/    # Profile creation + readiness scoring
│   │       └── progress/      # User progress read
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx   # Page wrapper
│   │   │   ├── Sidebar.tsx    # Navigation + auth/guest footer
│   │   │   └── Providers.tsx  # SessionProvider
│   │   ├── ModuleList.tsx     # Client list component with role filter
│   │   ├── ScenariosList.tsx  # Client list component with role filter
│   │   └── MissionsList.tsx   # Client list component with role filter
│   │
│   ├── data/                  # Static content (used as seed source + DB fallback)
│   │   ├── modules.ts         # 20 learning modules (re-exports from modules/)
│   │   ├── modules/           # One file per module
│   │   ├── scenarios.ts       # 15 scenarios (re-exports from scenarios/)
│   │   ├── scenarios/         # One file per scenario
│   │   ├── missions.ts        # 12 missions (re-exports from missions/)
│   │   └── missions/          # One file per mission
│   │
│   └── lib/
│       ├── db.ts              # Prisma client singleton
│       ├── auth.ts            # NextAuth config (Credentials provider, JWT)
│       ├── onboarding.ts      # Rules-based readiness profile scoring
│       └── utils.ts           # cn(), level labels, color helpers
│
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

### Static data as DB fallback

If the database has no published content (e.g. migrations ran but seed didn't), pages and API routes fall back to the static arrays in `src/data/`. This means the app is usable immediately after `docker compose up` even before seeding. Seeding moves content into the DB so user completions and attempts can be persisted against it.

---

## Points and levels

| Action | Points |
|---|---|
| Complete a module | +25 |
| Complete a crucible | +50 |
| Submit a mission | +40 |

| Level | Threshold |
|---|---|
| 1 — Aware | 0 pts |
| 2 — Informed | 100 pts |
| 3 — Practitioner | 300 pts |
| 4 — Leader | 600 pts |

Points are only tracked for authenticated users. Guests get full feedback but no persistence.

---

## Adding content

### New module

Create a new file in `src/data/modules/` and export it from `src/data/modules.ts`:

```typescript
{
  slug: "unique-slug",
  title: "Module Title",
  summary: "One sentence description shown in the list",
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  roles: ["PM", "EM", "IC"],  // which roles see this as relevant
  tags: ["foundations"],
  order: 7,                    // display order in the list
  content: `## Markdown content here...`,
}
```

Re-run `npm run db:seed` to push it to the database.

### New crucible

Create a new file in `src/data/scenarios/` and export it from `src/data/scenarios.ts`. Required fields:

```typescript
{
  slug: "unique-slug",
  title: "...",
  summary: "One line shown in the list",
  role: "PM" | "EM" | "IC",   // single role this crucible targets
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  industry: "SaaS",            // optional, shown as a tag
  context: `Long scenario text...`,
  prompts: [
    {
      id: "p1",
      question: "The decision question",
      followUp: "A follow-up shown after they've written something, or null",
    },
  ],
  rubric: [
    {
      criterion: "Criterion Name",
      description: "What a good answer addresses here",
    },
  ],
  staticFeedback: {
    overallAssessment: "...",
    strengths: ["..."],
    blindSpots: ["..."],
    improvements: ["..."],
    followUpQuestion: "...",
    score: 6,
  },
}
```

`staticFeedback` is what users receive. Write it to be genuinely useful — not a placeholder.

### New mission

Create a new file in `src/data/missions/` and export it from `src/data/missions.ts`:

```typescript
{
  slug: "unique-slug",
  title: "...",
  description: "One line shown in the list",
  roles: ["PM", "EM", "IC"],
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED",
  instructions: `## Markdown instructions...`,
  checklist: [
    "Your submission should address X",
    "Include a section on Y",
  ],
  staticGuidance: "Paragraph of feedback shown on submission. Should explain what a strong submission covers and what common mistakes look like.",
}
```

---

## Auth notes

- Auth uses **credentials only** (email + password with bcrypt). No OAuth.
- Sessions are **JWT-based** (stateless) — no session table in the DB.
- Passwords are hashed with bcrypt (10 rounds) on signup.
- `NEXTAUTH_SECRET` must be set or NextAuth will refuse to start in production.
- All API routes check session via `getServerSession(authOptions)`. Guest requests proceed without a session; only DB writes are gated.
