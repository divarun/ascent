# CLAUDE.md

## Purpose

This document defines engineering standards, architecture, conventions, and development workflows for **Ascent** — an AI curriculum platform for product managers, engineering managers, and individual contributors.

It guides both human developers and AI coding assistants toward building maintainable, secure, and simple systems. Follow these instructions exactly; they override default behavior.

---

# What is Ascent?

Ascent is a structured AI curriculum with three content types:

| Pillar | Route | Purpose |
|---|---|---|
| **Foundation** (Modules) | `/learn` | Text-first modules with quizzes. Teaches AI concepts. |
| **Scenarios** | `/scenarios` | Decision simulations. Users write reasoning, get feedback. |
| **Missions** | `/missions` | Real-work exercises with checklists and structured feedback. |

Target audience: PMs, EMs, and ICs. Each content item is tagged with `roles` and `difficulty`.

Progress is tracked per authenticated user. Guests can access unlocked content without signing in but cannot save progress.

---

# Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth v4 — JWT sessions, credentials provider (email + bcrypt) |
| UI | Tailwind CSS + Radix UI primitives |
| Styling | Inline styles for brand colors (`T` theme object) + Tailwind for layout/responsive |
| Email | Nodemailer |
| Validation | Zod |
| Deployment | Vercel |

---

# Directory Structure

```
src/
  app/                      — Next.js App Router pages and API routes
    api/                    — API routes (one folder per domain)
      admin/                — Admin API routes (Basic Auth protected)
      auth/                 — NextAuth + signup/forgot-password/reset-password
      modules/[slug]/       — Module read + completion tracking
      scenarios/[slug]/     — Scenario attempt submission
      missions/[slug]/      — Mission submission
    admin/                  — Admin panel pages (Basic Auth via middleware)
    dashboard/              — Authenticated user dashboard
    learn/[slug]/           — Module reader
    scenarios/[slug]/       — Scenario interface
    missions/[slug]/        — Mission interface
    login/ signup/          — Auth pages
    onboarding/             — New user onboarding flow

  components/               — Shared React components
    admin/                  — Admin-only components
    layout/                 — Nav, shell, layout wrappers

  config/
    access.ts               — Guest access rules (which content is free)
    app.ts                  — App-wide config (version, etc.)

  data/                     — Static content (source of truth for curriculum)
    modules.ts              — Module registry (import + enabled flag)
    missions.ts             — Mission registry (import + enabled flag)
    scenarios.ts            — Scenario registry (import + enabled flag)
    modules/                — One file per module
    missions/               — One file per mission
    scenarios/              — One file per scenario

  hooks/
    useContentFilters.ts    — Shared filter/sort logic for content lists

  lib/
    auth.ts                 — NextAuth config (authOptions)
    db.ts                   — Prisma client singleton — always import from here
    utils.ts                — cn(), getLevelLabel(), calculateLevel()
    colors.ts               — Brand color constants
    email.ts                — Email sending via Nodemailer
    rate-limit.ts           — In-memory rate limiter (admin brute-force protection)
    onboarding.ts           — Onboarding completion logic

  types/
    next-auth.d.ts          — Session type augmentation (adds user.id to Session)

prisma/
  schema.prisma             — Database schema
  seed.ts                   — Seed script
  migrations/               — Migration history (committed, never hand-edited)
```

---

# Content Model

## Module

```ts
{
  slug: string                                      // URL-safe, kebab-case, matches filename
  title: string
  summary: string                                   // One paragraph, shown in listings
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  roles: ("PM" | "EM" | "IC")[]                    // At least one role required
  tags: string[]
  order: number                                     // Display order within the registry
  content: string                                   // Markdown, rendered in the reader
  quiz: Array<{
    question: string
    options: string[]                               // Always 3 options
    correct: number                                 // 0-indexed
    explanation: string
  }>
}
```

## Mission

```ts
{
  slug: string
  title: string
  isUnlocked: boolean                               // true = guest-accessible, false = login required
  description: string                               // Short teaser shown in listings
  roles: ("PM" | "EM" | "IC")[]
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  instructions: string                              // Markdown, the task brief shown to the user
  staticGuidance: string                            // Hints shown while the user is working
  checklist: string[]                               // Completion criteria shown to the user
  staticFeedback: {
    assessment: string
    highlights: string[]
    suggestions: string[]
    nextSteps: string[]
  }
}
```

## Scenario

Same registration pattern as missions. See any existing file in `src/data/scenarios/` for the full shape.

---

# Adding Content

## New module

1. Create `src/data/modules/my-slug.ts` — export a named const matching the Module shape
2. Import it in `src/data/modules.ts` and add `{ ...myModule, enabled: true }` to `sampleModules`
3. Use `enabled: false` if it should be queued for a future wave

## New mission

1. Create `src/data/missions/my-slug.ts` — export a named const matching the Mission shape
2. Set `isUnlocked: true` for guest access, `false` for login-required
3. Import in `src/data/missions.ts` and add to `sampleMissions` with `enabled: true/false`
4. Add a comment noting the target roles and difficulty: `// PM INTERMEDIATE`

## New scenario

Same pattern as missions. See `src/data/scenarios.ts` and any existing scenario file.

## Content rules

- `slug` must be unique across all content of that type and must match the filename exactly
- `difficulty` is uppercase: `"BEGINNER"`, `"INTERMEDIATE"`, or `"ADVANCED"`
- `roles` must be a non-empty array of valid role strings with `as const`
- `enabled: false` items are invisible in the UI — do not delete them; they are queued for later
- `isUnlocked: true` means guest-accessible without login; drives `src/config/access.ts` at startup

---

# Development Commands

```bash
npm run dev                  # Start dev server (localhost:3000)
npm run build                # Production build — run before deploying
npm run lint                 # ESLint

# Database
npm run db:migrate           # Create and apply a new migration (dev)
npm run db:migrate:deploy    # Apply pending migrations to production
npm run db:push              # Push schema without a migration file (dev only, never production)
npm run db:seed              # Seed the database
npm run db:setup             # migrate + seed (fresh environment setup)
npm run db:reset             # DESTRUCTIVE: reset DB and re-seed — never run against production
npm run db:studio            # Open Prisma Studio (visual DB browser)
```

---

# Environment Variables

Required in `.env.local` for local development:

```
DATABASE_URL=               # PostgreSQL connection string
NEXTAUTH_URL=               # App URL (e.g. http://localhost:3000)
NEXTAUTH_SECRET=            # Random secret — generate with: openssl rand -base64 32
ADMIN_USERNAME=             # Admin panel username
ADMIN_PASSWORD=             # Admin panel password
DISABLE_ADMIN_RATE_LIMIT=   # Set to "true" for local Docker runs only — never set in production
```

Never commit `.env.local`. Never log env var values.

---

# Architecture

## Layered structure

```
Pages / API Routes     (src/app/)
         ↓
    Components         (src/components/)
         ↓
   Hooks / Lib         (src/hooks/, src/lib/)
         ↓
  Data / Config        (src/data/, src/config/)
         ↓
   Prisma / DB         (prisma/)
```

- Pages and API routes orchestrate: call lib, read data, return responses
- Components are pure UI: they receive props and render — no direct DB calls
- `src/lib/` holds shared logic (auth, db, email, rate limiting, utils)
- `src/data/` is static curriculum content loaded at module import time — no runtime I/O

## Dual-source content

Modules can exist in both static data files and the database. API routes check the DB first; if not found, they fall back to static data. This lets admin-created content override static content without breaking existing slugs.

## Auth flow

- NextAuth JWT strategy — no server-side session storage
- Credentials provider: email + bcrypt password comparison
- `session.user.id` is populated via the JWT callback and `src/types/next-auth.d.ts`
- Use `getServerSession(authOptions)` in API routes for authorization
- Never use client-side `useSession()` for server-side authorization decisions

## Admin auth

- Separate from user auth — HTTP Basic Auth, not NextAuth
- Gated in `src/middleware.ts` for `/admin/*` and `/api/admin/*` routes only
- Uses `ADMIN_USERNAME` + `ADMIN_PASSWORD` env vars
- Rate-limited to 10 requests/60s per IP; uses `constantTimeEqual` (timing-attack safe)
- Sets an `httpOnly`, `sameSite: strict` session cookie on success

---

# Coding Conventions

## TypeScript

- Use `as const` on string literal arrays in content files (roles, difficulty)
- Avoid `any` — use `unknown` and narrow explicitly
- Extend types in `src/types/` rather than casting with `as` at call sites
- Keep type imports separate from value imports

## Styling

- Tailwind for layout, spacing, responsive breakpoints, display utilities
- Inline styles using the `T` theme object for brand colors — do not hardcode hex values outside of `T`
- Use `cn()` from `src/lib/utils.ts` for conditional Tailwind class names
- Do not mix Tailwind color utilities with the inline `T` color system on the same element

## Components

- Small, single-purpose — if a component is doing two unrelated things, split it
- No database or fetch calls inside components — all data flows in via props
- Radix UI for accessible interactive elements (dialogs, dropdowns, accordions, tabs)
- Use `"use client"` only when genuinely required (event handlers, hooks, browser APIs)
- Server Components are the default in the App Router — prefer them

## API Routes

- Use `NextRequest` / `NextResponse` — do not use the legacy `req`/`res` pattern
- Always call `getServerSession(authOptions)` when the route requires authentication
- Return `NextResponse.json({ error: "..." }, { status: 4xx })` for errors — never throw unhandled
- Use `Promise.all()` for independent async operations — avoid waterfall awaits
- Import `db` from `src/lib/db.ts` — never instantiate `PrismaClient` directly

## Database

- Always import `db` from `src/lib/db.ts` — never create a new `PrismaClient`
- Use `select` to limit returned fields — do not fetch full rows when only a subset is needed
- `completedModules` on the `Progress` model is a string array of IDs
- Static module IDs use their slug as the DB ID (not a UUID)
- Never hand-edit migration files in `prisma/migrations/`

---

# Security

## Mandatory rules

- Validate all request bodies with Zod at the API boundary before touching any data
- Never return `passwordHash` or internal DB fields in API responses
- Never log request bodies that may contain passwords or tokens
- Use `constantTimeEqual` (from `src/middleware.ts`) for all credential comparisons
- Admin routes are protected solely by middleware — do not add secondary checks that could diverge
- Keep `NEXTAUTH_SECRET` and database credentials out of client-side bundles and logs

## High-risk files — require `/security-review` before committing

- `src/middleware.ts` — admin auth gating
- `src/lib/auth.ts` — NextAuth config
- `src/app/api/auth/**` — signup, login, password reset
- `src/config/access.ts` — guest access rules

## Content access rules

- `isModuleFree()` always returns `true` — all modules are readable without login
- `isMissionFree(slug)` / `isScenarioFree(slug)` check the `GUEST_MISSIONS` / `GUEST_SCENARIOS` sets
- Those sets are built from `isUnlocked: true` on each content file at startup
- Changing `isUnlocked` changes guest access immediately — verify both API and frontend gating after changes

## Cookies

- Admin session cookie must be `httpOnly: true`, `sameSite: "strict"`, `secure: true` in production
- Never store sensitive values in non-httpOnly cookies

---

# Core Engineering Principles

## 1. Simplicity first

Prefer simple over clever. Prefer explicit over magic. If a junior engineer cannot understand the code in under 5 minutes, simplify it.

Avoid premature optimization, over-engineering, unnecessary abstractions, and hidden side effects.

## 2. Build for maintainability

Clear naming. Small modules with a single responsibility. Strong boundaries, minimal coupling. Consistent patterns across similar files — all content files look the same, all API routes follow the same structure.

## 3. Security by default

Security is mandatory. Validate inputs, sanitize outputs, use least privilege, fail securely. See the Security section above for project-specific requirements.

## 4. Reliability over complexity

Fail gracefully with a clear error response — never silently. Use `Promise.all()` for parallel fetches; await sequentially only when there is a true dependency. Do not add error handling for scenarios that cannot happen.

## 5. Performance through good design

Order: correct → simple → measure → optimize. Use `select` in Prisma queries. Parallelize independent DB calls. Static content data is loaded once at import time — no runtime re-reading.

---

# System Design Priorities

When making trade-off decisions, prioritize in this order:

1. Correctness
2. Security
3. Simplicity
4. Maintainability
5. Reliability
6. Scalability
7. Performance

---

# Points and Levels

All scoring is configured in `src/config/scoring.ts`. Nothing is hardcoded elsewhere.

## Points per completion (difficulty-weighted)

| Content type | BEGINNER | INTERMEDIATE | ADVANCED |
|---|---|---|---|
| Module | 10 | 25 | 40 |
| Mission | 25 | 40 | 60 |
| Scenario | 30 | 50 | 75 |

Use `getPoints(type, difficulty)` from `@/config/scoring` — do not read `SCORING.points.*` directly in routes.

## Level thresholds

| Level | Name | Points required |
|---|---|---|
| 1 | Aware | 0 |
| 2 | Informed | 100 |
| 3 | Practitioner | 300 |
| 4 | Leader | 600 |

`calculateLevel()` and `getLevelLabel()` in `src/lib/utils.ts` derive from `SCORING.levels` — they have no hardcoded values.

## Notes

- Points are awarded only for authenticated users completing DB-backed content; static-only content (no DB row) does not award points to missions/scenarios.
- Module completions award points for both DB and static modules (static uses slug as ID).
- Changing point values or thresholds in `scoring.ts` is forward-only — existing `totalPoints` stored in the DB are not recalculated.

---

# What NOT to do

- Do not instantiate `PrismaClient` outside of `src/lib/db.ts`
- Do not call `getServerSession()` on the client — use `useSession()` from `next-auth/react` for UI only
- Do not add a content file without registering it in the registry (`modules.ts`, `missions.ts`, `scenarios.ts`)
- Do not hardcode brand colors — use the `T` theme object or Tailwind utilities
- Do not commit `.env.local` or any file containing secrets
- Do not run `npm run db:reset` against a production database
- Do not hand-edit files in `prisma/migrations/`
- Do not add comments explaining what the code does — only add a comment when the WHY is non-obvious
- Do not add error handling or validation for scenarios that cannot happen in practice
- Do not introduce `"use client"` without a concrete reason — Server Components are the default
