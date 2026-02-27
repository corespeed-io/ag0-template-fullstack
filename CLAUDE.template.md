# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a monorepo with two separate applications:

- **`frontend/`** — Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
- **`backend/`** — Deno + Hono.js + Drizzle ORM + PostgreSQL + S3 (AWS SDK v3)

The frontend proxies `/api/*` and `/auth/*` requests to the backend via Next.js rewrites.

## Tech Stack

### Frontend (`frontend/`)
- Runtime/Package Manager: Bun
- Framework: Next.js 15 (App Router)
- Language: TypeScript
- UI: React 19 + shadcn/ui + Lucide icons
- Styling: Tailwind CSS v4

### Backend (`backend/`)
- Runtime: Deno
- Framework: Hono.js
- Language: TypeScript
- Database: PostgreSQL via Drizzle ORM + postgres.js
- Storage: S3-compatible via AWS SDK v3
- Auth: OIDC via `arctic` + `jose` (Keycloak)

## Commands

### Root (convenience)
```bash
bun run dev          # Start both frontend and backend concurrently
bun run build        # Build the frontend
bun run typecheck    # TypeScript check the frontend
```

### Frontend (`cd frontend/`)
```bash
bun run dev          # Dev server at http://localhost:3000
bun run build        # Production build
bun run start        # Start production server
bun run lint         # ESLint
bun run typecheck    # TypeScript type checking
bunx --bun shadcn@latest add <component>  # Add shadcn/ui component (uses bun)
```

### Backend (`cd backend/`)
```bash
deno task dev        # Dev server at http://localhost:8000 (watch mode)
deno task start      # Start production server
deno task fmt        # Format with deno fmt
deno task lint       # Lint with deno lint
deno task check      # Type check
deno task db:generate  # Generate migrations from schema changes
deno task db:migrate   # Run pending migrations
deno task db:push      # Push schema directly (dev only)
deno task db:studio    # Open Drizzle Studio GUI
```

## Directory Structure

### Frontend (`frontend/`)
- `src/app/` — Next.js App Router pages and layouts
- `src/app/about/` — About page
- `src/components/` — React components (`counter`, `footer`, `greeting-form`, `header`)
- `src/components/ui/` — shadcn/ui components (`alert-dialog`, `badge`, `button`, `card`, `combobox`, `dropdown-menu`, `field`, `input-group`, `input`, `label`, `select`, `separator`, `textarea`)
- `src/lib/` — Shared utilities (`api.ts` for backend calls, `utils.ts` for cn())
- `public/` — Static assets

### Backend (`backend/`)
- `src/main.ts` — Hono app entry point
- `src/routes/` — Route handlers (`auth.ts`, `greeting.ts`, `user.ts`)
- `src/middleware/` — Hono middleware (`auth.ts`)
- `src/lib/auth/` — OIDC (`oidc.ts`), session JWT (`session.ts`), types (`types.ts`)
- `src/lib/db/` — Drizzle ORM client (`index.ts`) and schema (`schema.ts`)
- `src/lib/s3/` — S3-compatible storage (`index.ts`)
- `drizzle/` — Database migrations (auto-generated)

### Skills (`.claude/skills/`)
- `drizzle/` — Drizzle ORM schema style guide, query patterns, migration best practices
- `postgres-best-practices/` — PostgreSQL performance optimization (indexing, connections, schema design, locking, monitoring)
- `shadcn-ui/` — shadcn/ui component discovery, installation, customization, and best practices
- `interface-design/` — UI/UX design conventions

## Conventions

- Frontend uses `bun` for package management (not npm/yarn/pnpm)
- Backend uses Deno with `deno.json` import maps (no package.json)
- Backend files use `.ts` extension in imports (Deno convention)
- All API calls from frontend go through `/api/*` and are proxied to the backend
- Auth flow: frontend redirects to `/auth/login` → backend handles OIDC → redirects back to frontend
- Database schema follows Drizzle conventions (see `.claude/skills/drizzle/SKILL.md`)
- PostgreSQL queries follow best practices (see `.claude/skills/postgres-best-practices/SKILL.md`)

## Authentication

- OIDC flow using Keycloak via `arctic` library (on backend).
- Session stored as a JWT cookie signed with `OIDC_AUTH_SECRET`.
- Auth middleware on backend populates `c.var.user` for every request.
- Frontend fetches user via `GET /api/me`.
- Required environment variables (in `backend/.env`):
  - `OIDC_ISSUER_URL`
  - `OIDC_CLIENT_ID`
  - `OIDC_CLIENT_SECRET`
  - `OIDC_REDIRECT_URI`
  - `OIDC_AUTH_SECRET` (at least 32 characters)
  - `FRONTEND_URL` (default: `http://localhost:3000`)

## Database (PostgreSQL + Drizzle)

- Schema defined in `backend/src/lib/db/schema.ts`.
- Client exported from `backend/src/lib/db/index.ts`.
- Required environment variable (in `backend/.env`):
  - `DATABASE_URL` — PostgreSQL connection string

### Schema Changes Workflow
1. Edit `backend/src/lib/db/schema.ts`
2. Run `deno task db:generate` to create migration
3. Run `deno task db:migrate` to apply migration

For detailed Drizzle conventions, see `.claude/skills/drizzle/SKILL.md`.

## Storage (S3)

- Uses AWS SDK v3 for S3-compatible storage (AWS S3, MinIO, Cloudflare R2).
- Import from `backend/src/lib/s3/index.ts`.
- Required environment variables (in `backend/.env`):
  - `S3_BUCKET`
  - `S3_ACCESS_KEY_ID`
  - `S3_SECRET_ACCESS_KEY`
- Optional: `S3_ENDPOINT`, `S3_REGION`

## Verification

- After editing frontend code, run:
  - `cd frontend && bun run typecheck`
  - `cd frontend && bun run lint`
- After editing backend code, run:
  - `cd backend && deno task check`
  - `cd backend && deno task lint`
- Run `cd frontend && bun run build` before final hand-off.

## Type Safety Rules

- Use precise types and keep type safety strict.
- Avoid `any`.
- Avoid unsafe casts like `as unknown as`.
- Do not silence lint/type errors with ignore comments unless there is no better solution.
