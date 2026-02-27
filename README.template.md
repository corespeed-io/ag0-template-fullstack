# Template Speed

A modern full-stack template with separate frontend and backend.

## Stack

| Layer    | Technology                                           |
| -------- | ---------------------------------------------------- |
| Frontend | Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + shadcn/ui |
| Backend  | Deno + Hono.js                                       |
| Database | PostgreSQL + Drizzle ORM                             |
| Storage  | S3-compatible (AWS SDK v3)                           |
| Auth     | OIDC / Keycloak via `arctic` + `jose`                |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (frontend package manager)
- [Deno](https://deno.land) (backend runtime)
- PostgreSQL database

### Setup

```bash
# 1. Clone and enter the repo
git clone <repo-url> && cd template-speed

# 2. Install frontend dependencies
cd frontend && bun install

# 3. Configure environment variables
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env

# 4. Start both services (from root)
cd .. && bun run dev
```

This starts:
- **Frontend** at `http://localhost:3000`
- **Backend** at `http://localhost:8000`

The frontend proxies `/api/*` and `/auth/*` requests to the backend automatically.

### Database Setup

```bash
cd backend

# Push schema directly (dev)
deno task db:push

# Or generate + run migrations
deno task db:generate
deno task db:migrate
```

## Project Structure

```
template-speed/
├── frontend/              # Next.js app
│   ├── src/
│   │   ├── app/           # Pages & layouts (App Router)
│   │   ├── components/    # React components (+ ui/ for shadcn)
│   │   └── lib/           # Utilities & API client
│   └── package.json
├── backend/               # Deno + Hono API server
│   ├── src/
│   │   ├── main.ts        # Entry point
│   │   ├── routes/        # API route handlers
│   │   ├── middleware/     # Hono middleware
│   │   └── lib/           # Auth, DB, S3 modules
│   └── deno.json
└── package.json           # Root convenience scripts
```
