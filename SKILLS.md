# SKILLS.md — Claude Code Skills for Ascent

This file documents the Claude Code skills available in this project, when to use them, and any project-specific guidance for each.

Skills are invoked by typing `/skill-name` in the Claude Code prompt.

---

## `/simplify`

**What it does:** Reviews recently changed code for reuse, quality, and efficiency — then fixes issues found.

**When to use in this project:**
- After adding a new content type (module/mission/scenario data file)
- After wiring up a new API route under `src/app/api/`
- After touching shared hooks like `src/hooks/useContentFilters.ts`
- After a refactor pass on components in `src/components/`

**Notes:**
- Run this after bulk content additions — data files in `src/data/modules/` and `src/data/missions/` tend to accumulate duplication
- Especially useful before committing changes to `src/lib/utils.ts` or `src/config/access.ts` — these are shared and regressions spread far

---

## `/security-review`

**What it does:** Runs a full security review of all pending changes on the current branch.

**When to use in this project:**
- Before any commit touching `src/app/api/auth/` (signup, forgot-password, reset-password)
- Before any commit touching `src/middleware.ts` — this controls route access and guest gating
- Before any commit touching `src/config/access.ts` — controls which content is gated
- Before any commit touching Prisma schema or seed scripts
- Before deploying a new auth flow or onboarding change

**Notes:**
- This project handles user accounts, passwords (bcrypt), and email-based reset flows — auth changes are high risk
- The admin routes (`src/app/admin/`, `src/app/api/admin/`) must remain protected; verify middleware gating after changes
- Guest access is configured separately from auth — changes to `access.ts` can silently expose paid content

---

## `/review`

**What it does:** Reviews a pull request, or the current branch diff if no PR number is given.

**When to use in this project:**
- Before merging any non-trivial feature branch
- When reviewing changes to content data files for structural consistency
- Useful for catching drift from established patterns (e.g., new modules that don't follow the existing `ModuleData` shape)

---

## `/fewer-permission-prompts`

**What it does:** Scans recent transcripts for common read-only tool calls and adds an allowlist to `.claude/settings.json` to reduce permission prompts.

**When to use in this project:**
- Run once after setting up this project locally — the database commands (`prisma studio`, `prisma migrate`) and `npm run dev` prompts can be pre-approved
- Re-run if you add new recurring tool calls (e.g., new MCP tools or frequent Bash patterns)

---

## `/update-config`

**What it does:** Configures the Claude Code harness via `settings.json` — hooks, permissions, env vars, automated behaviors.

**When to use in this project:**
- To set up a pre-commit hook that runs `/security-review` before pushing auth changes
- To configure environment variables like `DATABASE_URL` or `NEXTAUTH_SECRET` for the session
- To allow specific npm scripts (`npm run db:migrate`, `npm run db:seed`) without repeated prompts
- To automate running `/simplify` after large content additions

**Common configs for this project:**
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npm run lint)",
      "Bash(npm run db:studio)",
      "Bash(npx prisma *)"
    ]
  }
}
```

---

## `/init`

**What it does:** Initializes or regenerates the `CLAUDE.md` file with codebase documentation.

**When to use in this project:**
- Run when onboarding a new contributor who will pair with Claude Code
- Run after significant architectural changes (new content type, new auth flow, new admin section)
- The current `CLAUDE.md` is incomplete (architecture section is cut off) — `/init` can help regenerate it with project-specific context

---

## `/schedule`

**What it does:** Creates scheduled remote agents that run on a cron schedule.

**When to use in this project:**
- To schedule a nightly content audit that checks for broken module/mission/scenario data files
- To schedule a weekly `/security-review` run against the main branch
- To set a one-time reminder to run database migrations after a deploy

---

## `/loop`

**What it does:** Runs a prompt or skill on a recurring interval within the current session.

**When to use in this project:**
- During active development of a new content module — loop `/simplify` every N iterations to keep data files clean
- When watching a long `npm run build` or migration for completion

---

## Skill priority for common tasks

| Task | Recommended skill |
|---|---|
| Adding a new module/mission/scenario | `/simplify` after |
| Changing auth or middleware | `/security-review` before commit |
| Reviewing a PR | `/review` |
| Setting up local dev | `/fewer-permission-prompts` + `/update-config` |
| CLAUDE.md is stale | `/init` |
| Automating repetitive checks | `/schedule` or `/loop` |
