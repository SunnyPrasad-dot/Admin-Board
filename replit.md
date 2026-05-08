# TK Admin Panel

A professional photography booking and photographer management admin dashboard built with React + Express.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/admin-dashboard run dev` — run the frontend (auto-assigned port)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, .jsx/.js file extensions, Tailwind CSS, shadcn/ui, wouter routing
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — API contract (source of truth)
- `lib/db/src/schema/` — DB schema (admins, photographers, bookings, booking_days, inquiries, packages, addons)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/admin-dashboard/src/pages/` — Frontend pages (.jsx)
- `artifacts/admin-dashboard/src/components/` — Shared components (.jsx)
- `artifacts/admin-dashboard/src/lib/auth.jsx` — Auth context (mock JWT)

## Architecture decisions

- Frontend uses `.jsx`/`.js` extensions throughout (not `.tsx`/`.ts`); auth.js is a thin re-export to auth.jsx since Vite resolves .js before .jsx
- Vite config uses `resolve.extensions` with `.jsx` before `.js` to handle JSX-in-.js scenarios
- Auth is mock/localStorage-based for the first build (no JWT verification server-side)
- Multi-day booking workflow: each day has its own `booking_days` row with optional photographer assignment
- Photographer availability is computed at query time by checking `booking_days` for the requested date

## Product

- **Login / Forgot Password / Reset Password** — Admin authentication screens
- **Dashboard** — Summary stats + tabbed Confirm Requests & Inquiry Requests views
- **Bookings** — Full booking management table with filters (status, event type, date, search)
- **Booking Detail** — Core workflow: per-day event breakdown, available/unavailable photographer cards, assignment confirmation popup, send email notification
- **Inquiries** — Softer-priority inquiry list with contact actions
- **Photographers** — Grid/list of all photographers with status badges and filters
- **Photographer Detail** — Full profile with completed shoots and upcoming bookings
- **Price Management** — Package and add-on pricing tables with inline editing
- **Admin Profile & Settings** — Admin account management

## User preferences

- Use .jsx and .js file extensions (no .tsx/.ts in frontend source)
- No TypeScript annotations in frontend files

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `openapi.yaml`
- `auth.js` is intentionally a thin re-export — the real content is in `auth.jsx`
- Login credentials for demo: `admin@tkstudio.com` / `admin123`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
