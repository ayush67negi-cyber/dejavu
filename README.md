# DEJAVU

**Strangers at lunch. Friends by dessert.**

DEJAVU is a premium social dining membership. We compose tables of four to six
adults around real restaurants and let conversations do the rest. It is not a
dating app — it is infrastructure for friendship.

- **Live app:** https://dejavu-dining-ayush67negi-2189.vercel.app
- **Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel
- **Database region:** Mumbai (`ap-south-1`)

---

## 1. What is actually built

| Area | Status |
| --- | --- |
| Editorial marketing site (hero, idea, how it works, tables, experience, why, membership, CTA) | Live |
| Eight table categories, database-driven, admin-editable | Live |
| Supabase email/password auth, email verification, password reset | Live |
| Google OAuth | Architecture complete; needs provider credentials (see §7) |
| Persistent sessions, protected routes, middleware refresh | Live |
| Multi-step onboarding with saved progress and resume | Live |
| Member dashboard: overview, experiences, discover, profile, membership, notifications | Live |
| Matching engine (SQL scoring + admin-assisted composition) | Live |
| Admin studio: overview, members, experiences, matching, categories, reports | Live, server-authorized |
| Safety: reports, blocks, suspensions, moderation notes | Live |
| Membership plans, history, cancellation | Live |
| Razorpay checkout + signature verification + webhook | Architecture complete; needs keys (see §6) |

## 2. Design system

- **Type:** Instrument Serif (editorial display) + DM Sans (body), self-hosted via
  Fontsource so builds never depend on Google Fonts availability.
- **Palette:** warm ivory `#F7F1E8`, ink `#120D0B`, burgundy `#3D0A18`, cherry
  `#C4172F`, tangerine `#E2571E`, blush `#E8B4B8`, olive `#3F4A2E`, sand `#DCCBB0`.
- **Motion:** Framer Motion, scroll-linked parallax, word-by-word headline
  reveals, marquee. All motion respects `prefers-reduced-motion`.
- **Photography:** original generated editorial imagery in `public/images/`.

## 3. Architecture

```
src/
  app/
    page.tsx                  marketing home
    (marketing)/              tables, how-it-works, membership, about, safety,
                              privacy, terms, faq, contact, guidelines
    (auth)/                   login, signup, forgot/reset password
    auth/callback/            PKCE + OTP exchange for email links & OAuth
    onboarding/               8-step profile builder
    app/                      member dashboard (protected)
    admin/                    admin studio (server-authorized)
    api/
      membership/checkout     creates Razorpay order + local payment record
      membership/verify       HMAC signature check → activates membership
      membership/cancel       records cancellation intent
      webhooks/razorpay       server-to-server payment events
      admin/…                 authorised admin mutations
  components/                 landing, app, admin, auth, ui
  lib/                        supabase clients, queries, validation, types
supabase/migrations/          schema, RLS, seed data, matching engine
```

### Security model

- **RLS on every table.** A member can read only their own profile,
  questionnaire, memberships, payments, notifications and reports.
- **Admin role lives in `admin_roles`**, never on `profiles`. It is not
  insertable via the API; `is_admin()` is a `security definer` check.
- **Privilege-escalation guards.** A trigger prevents non-admins from changing
  their own `status`, `id`, and internal-experience fields; verified by test.
- **Venue privacy by construction.** Restaurant details live in
  `experience_venues`, whose RLS only reveals rows when the experience is
  `confirmed` AND `reveal_venue` is true AND the reader is at that table.
  Internal `admin_notes` are stripped on any non-admin update.
- **Questionnaire privacy.** Responses are readable only by the owner and admins.
- **Participant privacy.** `get_table_participants()` returns only name, photo,
  occupation, city and bio (bio suppressed when visibility is `private`).
- **Service role** is used exclusively in server routes, after an explicit
  authorisation check, and never reaches the browser bundle.
- **Payments** are marked paid only after HMAC signature verification or a
  signed webhook. There is no simulated-payment path.

## 4. Local development

```bash
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run dev
```

```bash
npm run typecheck   # tsc --noEmit
npm run build       # production build
```

## 5. Database

Migrations in `supabase/migrations/`, applied to the live project in order:

| File | Contents |
| --- | --- |
| `0001_core_schema.sql` | 15 tables, enums, indexes, `updated_at` triggers, signup profile bootstrap |
| `0002_rls.sql` | RLS policies, `is_admin()`, escalation guards, member-facing RPCs |
| `0003_seed.sql` | membership plans + eight table categories |
| `0004_matching.sql` | `match_score()`, `candidate_matches()` (admin-only) |
| `0005_venue_privacy.sql` | venue table isolation, internal-notes guard, RPC rewrite |
| `0006_admin_bootstrap.sql` | `admin_allowlist` + signup trigger that grants the first admin |

### Creating the first administrator

`admin_roles` is writable only by the service role, and members cannot escalate
themselves. That means the first admin is provisioned out-of-band:

```sql
-- run in the Supabase SQL editor (database owner), then sign up with that email
insert into public.admin_allowlist (email, note)
values ('you@example.com', 'founder')
on conflict (email) do nothing;
```

`admin_allowlist` has RLS enabled with **no policies** and its grants are revoked
from `anon`/`authenticated`, so no client can read or write it. The signup
trigger checks it server-side and inserts the `admin_roles` row. To promote an
existing account, add the email and re-run the backfill block at the end of
`0006_admin_bootstrap.sql`. Removing an entry does **not** revoke an existing
admin — delete the `admin_roles` row for that.

Core tables: `profiles`, `admin_roles`, `user_interests`,
`questionnaire_responses`, `table_categories`, `membership_plans`,
`memberships`, `membership_payments`, `experiences`, `experience_venues`,
`experience_participants`, `experience_requests`, `feedback`, `reports`,
`blocked_users`, `notifications`.

### Matching scoring

`match_score(a, b)` returns 0 for a hard mismatch (different city, blocked pair,
inactive account) and otherwise accumulates: city +10, shared interests
(≤8 × 2.5), shared categories (≤6 × 2), shared availability (≤4 × 1.5), dietary
compatibility ±2, questionnaire similarity × 1.6 and talkativity complement ×
0.8. `candidate_matches()` is callable only by admins and powers the admin
matching console, where a human makes the final call.

## 6. Payments (Razorpay)

The architecture is complete and intentionally inert until configured.

1. Create a Razorpay account and API keys.
2. Set in Vercel (Production + Preview):
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RAZORPAY_WEBHOOK_SECRET`
3. Add a webhook at `https://<your-domain>/api/webhooks/razorpay` for
   `payment.captured`, `payment.failed`, `refund.processed`.
4. Redeploy.

Until then, the membership page explicitly states that payments are not enabled
and no membership is activated. Admins can activate a membership manually for
payments settled outside the gateway; the record is flagged
`activated_by_admin = true` for audit.

## 7. Optional providers

**Google OAuth:** Supabase → Authentication → Providers → Google, add the client
ID/secret from Google Cloud Console, and add
`https://<project-ref>.supabase.co/auth/v1/callback` as an authorised redirect
URI. The login button already calls `signInWithOAuth` and surfaces a clear
message if the provider is not configured.

**SMTP:** confirmation and reset emails use Supabase's built-in mailer by default
(rate-limited, best-effort delivery). For production, configure custom SMTP in
Supabase → Authentication → Emails.

## 8. Environment variables

See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_*` are server-only.
Public keys (`NEXT_PUBLIC_*`) are safe for the browser; the anon key is subject
to RLS on every request.

## 9. Verification performed

- `tsc --noEmit` clean, `next build` clean (35 routes).
- Auth: five real accounts created through Supabase auth; session established
  and persisted through `@supabase/ssr` cookies; signup, login, logout,
  password-reset and email-verification flows implemented against the live API.
- RLS verified by impersonating a member JWT: profiles visible = 1, admin_roles
  = 0, questionnaire rows = 1, candidate_matches blocked.
- Escalation verified: self-suspend attempt rejected (status remained `active`),
  self-admin insert blocked.
- Venue privacy verified: an unconfirmed table's venue returned `null` to its
  participant and to non-participants; a confirmed + revealed table returned the
  venue to its seated member only.
- Matching verified: 10 scored candidate pairs produced for the QA city.
- Known limitation: this sandbox has no outbound network to the Supabase host,
  so browser-level interactive testing was done against the SQL/auth layer and
  the production build rather than via an automated browser.

---

© DEJAVU. 18+ only. Members pay for their own food and drinks.
