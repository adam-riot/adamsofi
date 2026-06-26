# AdamSofi — Project Notes

## Stack
- Next.js 15 (App Router) + TypeScript
- TailwindCSS + custom CSS variables in `app/globals.css`
- Neon Postgres via `@neondatabase/serverless` (`lib/db.ts`)
- Custom admin auth: HMAC-signed cookie (`lib/auth.ts`, edge-safe) — no external auth service
- Resend (transactional + newsletter email)
- Vercel (deployment; domain adamsofi.com)

## Design tokens
All colors in `app/globals.css :root` — do NOT hardcode colors in components.
Fonts: Clash Display (headings) + Satoshi (body) + JetBrains Mono (eyebrows/logo icon)
+ Space Grotesk (logo wordmark only). Loaded via @import in globals.css.

## Routes
- `app/(site)/` route group = public site (own layout: Navbar/Footer/WAFloat/CursorGlow).
- `app/admin/login` = login; `app/admin/(dash)/` = protected admin (sidebar chrome).
- `app/api/` = route handlers. `_legacy/` = old static HTML (reference only).
- `public/demos/<slug>.html` = 10 standalone demo sites, shown via iframe in `/demos/[slug]`.

## Database (Neon)
- Run `db/schema.sql` then optional `db/seed.sql` in the Neon SQL editor.
- `lib/db.ts` exports `sql` (neon tagged-template client) + `hasDb`.
- Data access: `lib/articles.ts` (public), `lib/admin.ts` (admin lists/stats), `lib/broadcast.ts`.
- All functions degrade gracefully (return []/0) when DATABASE_URL is unset.

## Auth
- `ADMIN_EMAIL` + `ADMIN_PASSWORD` env define the single admin.
- Login POST `/api/admin/login` → sets signed `as_admin` httpOnly cookie (7d).
- `middleware.ts` verifies the cookie (HMAC, no DB) to protect `/admin/*`.
- Server checks via `lib/session.ts` `isAdmin()`. Logout: POST `/api/admin/logout`.
- Set a strong `AUTH_SECRET` (e.g. `openssl rand -hex 32`).

## Newsletter
- Welcome email on subscribe. Broadcast on article publish (Resend batch API).
- Unsubscribe via tokenised link → `/api/unsubscribe?token=...`.
- Resend domain must be verified before email sends.

## Blog
- Articles in Neon, rendered as ISR pages (`revalidate = 300`).
- Publish/update from admin calls `revalidatePath`. Views tracked via `/api/view` beacon.

## Env
See `.env.local.example`. `.env.local` is gitignored.

## Deployment
Vercel (NOT static export). Old `.html` URLs 301-redirect to clean routes (next.config.ts).
