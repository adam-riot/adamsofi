# AdamSofi — Project Notes

## Stack
- Next.js 15 (App Router) + TypeScript
- TailwindCSS + custom CSS variables in `app/globals.css`
- Supabase (DB + Auth) via `@supabase/ssr`
- Resend (transactional + newsletter email)
- Vercel (deployment; domain adamsofi.com)

## Design tokens
All colors live in `app/globals.css :root` — do NOT hardcode colors in components.
Fonts: Clash Display (headings) + Satoshi (body) + JetBrains Mono (eyebrows/logo icon)
+ Space Grotesk (logo wordmark only). All loaded via @import in globals.css.

## Brand mark
`components/Logo.tsx` — `<A>` code icon (gold dot) + `adamsofi.` gradient wordmark.

## Structure
- `app/` routes (App Router). `_legacy/` = old static HTML (reference only, not served).
- `public/demos/<slug>.html` = the 10 standalone demo sites, shown via iframe in `/demos/[slug]`.
- `lib/` = supabase clients (server/admin/browser), resend + email templates, data access.
- `components/` = layout, home, blog, ui (ScrollReveal, CursorGlow), admin.

## Supabase
- Run `supabase/migrations/001_init.sql` then optional `supabase/seed.sql`.
- Public reads use anon client (RLS: published articles only).
- Server routes (subscribe/unsubscribe/inquiry/views/broadcast) use the SERVICE ROLE
  client (`lib/supabase-admin.ts`) — server only, never import to client.
- Admin = single Supabase Auth user (create in dashboard). Protected by middleware.

## Newsletter
- Welcome email on subscribe. Broadcast on article publish (Resend batch API).
- Unsubscribe via tokenised link → `/api/unsubscribe?token=...`.
- Resend domain must be verified before email sends.

## Blog
- Articles in Supabase, rendered as ISR pages (`revalidate`).
- On publish/update from admin, call revalidatePath for `/blog` and the article.

## Env
See `.env.local.example`. `.env.local` is gitignored.

## Deployment
Vercel. NOT static export (admin/blog/newsletter/forms need a server).
Old `.html` URLs 301-redirect to clean routes (see next.config.ts).
