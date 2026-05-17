# Ascent — Detailed Reference

Setup, configuration, project structure, and content authoring.

---

## Setup

### 1. Go to the project folder

```bash
cd ascent
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set `NEXTAUTH_SECRET` (generate one with `openssl rand -base64 32`).

---

### Path A: With Docker

**Prerequisites:** Docker and Docker Compose installed.

```bash
# Start postgres and the app
docker compose up
```

### Path B: Without Docker

**Prerequisites:** Node.js 20+ and a PostgreSQL instance running locally.

```bash
# Install dependencies
npm install
```

Edit `DATABASE_URL` in `.env` to point to your local PostgreSQL instance.

**Start the dev server**

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

### Database Setup

**Create database tables**

```bash
npm run db:migrate
```

**Seed content** 

```bash
npm run db:seed
```


---

## Environment variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | ✓ | — | PostgreSQL connection string (non-pooled) |
| `DIRECT_URL` | — | same as `DATABASE_URL` | Direct connection for Prisma migrations; set separately if using a connection pooler |
| `NEXTAUTH_URL` | ✓ | `http://localhost:3000` | Base URL used by NextAuth for callbacks |
| `NEXTAUTH_SECRET` | ✓ | — | JWT signing secret — keep secret in production. Generate: `openssl rand -base64 32` |
| `ADMIN_USERNAME` | — | `admin` | Username for the built-in admin account |
| `ADMIN_PASSWORD` | — | `admin` | Password for the built-in admin account — change in production |
| `NEXT_PUBLIC_BETA` | — | `true` | Show the beta banner; set to `false` once stable |

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
│   │   ├── profile/           # User profile page
│   │   ├── bug-report/        # Bug report submission
│   │   ├── feedback/          # Feedback submission
│   │   ├── forgot-password/   # Password reset request
│   │   ├── reset-password/    # Password reset form
│   │   ├── admin/             # Admin dashboard (bug reports, feedback, content, users)
│   │   └── api/
│   │       ├── auth/          # NextAuth handler, /signup, /forgot-password, /reset-password
│   │       ├── modules/       # List + fetch + complete
│   │       ├── scenarios/     # List + fetch + attempt submit
│   │       ├── missions/      # List + fetch + submission
│   │       ├── onboarding/    # Profile creation + readiness scoring
│   │       ├── progress/      # User progress read
│   │       ├── profile/       # Profile update
│   │       ├── bug-report/    # Bug report submission
│   │       ├── feedback/      # Feedback submission
│   │       └── admin/         # Admin CRUD for content, bug reports, feedback
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx   # Page wrapper
│   │   │   ├── Sidebar.tsx    # Navigation + auth/guest footer
│   │   │   └── Providers.tsx  # SessionProvider
│   │   ├── admin/             # Admin-specific UI components
│   │   ├── ModuleList.tsx     # Client list component with role filter
│   │   ├── ScenariosList.tsx  # Client list component with role filter
│   │   ├── MissionsList.tsx   # Client list component with role filter
│   │   ├── BetaBanner.tsx
│   │   ├── FilterBar.tsx
│   │   ├── LevelUpBanner.tsx
│   │   └── detail-layout.tsx
│   │
│   ├── config/                # App-wide config (access rules, app settings)
│   │
│   ├── data/                  # Static content (used as seed source + DB fallback)
│   │   ├── modules.ts         # 22 learning modules (re-exports from modules/)
│   │   ├── modules/           # One file per module
│   │   ├── scenarios.ts       # 15 scenarios (re-exports from scenarios/)
│   │   ├── scenarios/         # One file per scenario
│   │   ├── missions.ts        # 12 missions (re-exports from missions/)
│   │   └── missions/          # One file per mission
│   │
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type declarations
│   │
│   └── lib/
│       ├── db.ts              # Prisma client singleton
│       ├── auth.ts            # NextAuth config (Credentials provider, JWT)
│       ├── email.ts           # Email sending (password reset)
│       ├── onboarding.ts      # Rules-based readiness profile scoring
│       ├── colors.ts          # Color utilities
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
  quiz: [
    {
      question: "Question text",
      options: ["Option A", "Option B", "Option C"],
      correct: 0,              // index of the correct option
      explanation: "Why this answer is correct",
    },
  ],
}
```

Re-run the seed command after adding content:
- With Docker: `docker compose exec app npm run db:seed`
- Without Docker: `npm run db:seed`

### New crucible

Create a new file in `src/data/scenarios/` and export it from `src/data/scenarios.ts`. Required fields:

```typescript
{
  slug: "unique-slug",
  title: "...",
  summary: "One line shown in the list",
  roles: ["PM", "EM"],         // one or more roles this crucible targets
  isUnlocked: true,            // false = locked/coming soon
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
- Password reset is supported via `/forgot-password` → email link → `/reset-password`.
- `NEXTAUTH_SECRET` must be set or NextAuth will refuse to start in production.
- All API routes check session via `getServerSession(authOptions)`. Guest requests proceed without a session; only DB writes are gated.
