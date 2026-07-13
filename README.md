# Chamos Tires

Independent Astro project for **Chamos Tire Co**, a lead-generation landing page for used tire availability requests in Apex, North Carolina.

## Stack

- Astro
- TypeScript
- Cloudflare Pages
- Cloudflare Pages Functions
- Cloudflare Workers KV
- Cloudflare Turnstile preparation
- Resend preparation
- Wrangler

## Resource Isolation

This repository is independent from Birarda Rides and every other existing project. It must not share code, deployments, variables, KV namespaces, Workers, Pages projects, R2 buckets, or secrets with Birarda Rides.

Official resource names:

- GitHub repository: `Chamos-tires`
- Technical slug: `chamos-tires`
- Cloudflare Pages: `chamos-tires`
- Worker/API reserved name: `chamos-tires-api`
- KV namespace: `chamos-tires-kv`
- KV binding: `CHAMOS_TIRES_KV`
- Future R2 bucket: `chamos-tires-uploads`
- Future R2 binding: `CHAMOS_TIRES_UPLOADS`

## Prerequisites

- Node.js `>=22.12.0`
- npm
- Wrangler authenticated with the correct Cloudflare account
- GitHub access to create/push the independent repository

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` for local development.

```bash
cp .env.example .env
```

Variables:

```env
PUBLIC_SITE_URL=
PUBLIC_BUSINESS_NAME=Chamos Tire Co
PUBLIC_BUSINESS_PHONE=
PUBLIC_BUSINESS_EMAIL=
PUBLIC_TURNSTILE_SITE_KEY=

TURNSTILE_SECRET_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_NOTIFICATION_EMAIL=
```

Do not commit real secrets.

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Type Checking

```bash
npm run check
```

## Lint

```bash
npm run lint
```

## Cloudflare Configuration

`wrangler.toml` is prepared for Cloudflare Pages Functions and the independent KV binding:

```toml
[[kv_namespaces]]
binding = "CHAMOS_TIRES_KV"
id = "REPLACE_WITH_PRODUCTION_KV_NAMESPACE_ID"
preview_id = "REPLACE_WITH_PREVIEW_KV_NAMESPACE_ID"
```

Create the KV namespaces only after verifying the active Cloudflare account:

```bash
npx wrangler whoami
npx wrangler pages project list
npx wrangler kv namespace list
npx wrangler kv namespace create chamos-tires-kv
npx wrangler kv namespace create chamos-tires-kv --preview
```

Then update `wrangler.toml` with the generated IDs.

## Deployment

Production deployment requires explicit approval.

```bash
npm run build
npm run deploy
```

Cloudflare Pages project name: `chamos-tires`.

## API

Lead endpoint:

```text
POST /api/leads
```

The endpoint:

- Parses JSON or form submissions.
- Validates and sanitizes server-side.
- Checks required fields.
- Prepares Cloudflare Turnstile verification.
- Applies basic KV-backed rate limiting.
- Creates lead and FBOS action IDs.
- Stores lead/action/customer records in `CHAMOS_TIRES_KV`.
- Attempts Resend notifications without blocking lead creation.
- Returns consistent JSON responses.

## FBOS Architecture

Statuses:

1. New Lead
2. Availability Review
3. Quote Sent
4. Appointment Scheduled
5. Completed
6. Follow-Up

KV key strategy:

- `lead:{leadId}`
- `action:{actionId}`
- `customer:{customerId}`
- `index:leads:{leadId}`
- `config:business`

KV is acceptable for this initial low-volume version. If the system later needs querying, reporting, deduplication, or multi-user operations, migrate the persistence layer to D1 or another database behind the same persistence abstraction.

## Resend

Email sending is prepared in `src/lib/email`. It remains inactive until all Resend environment variables are provided.

Email failure does not block lead creation. The result is recorded on the FBOS action.

## Turnstile

Turnstile verification is prepared in `src/lib/cloudflare/turnstile.ts`. If `TURNSTILE_SECRET_KEY` is missing, verification is skipped for local setup. Production should provide both:

- `PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

## Security Notes

- Server-side validation is required.
- Inputs are sanitized and length-limited.
- Basic KV-backed rate limiting is included.
- Secrets are not exposed to the frontend.
- No payment information is collected.
- Privacy page is included as a first draft and must be reviewed before launch.

## Pending Business Details

Do not publish final claims until confirmed:

- Address
- Phone
- Email
- Hours
- Pricing
- Payment methods
- Installation services
- Reviews
- Certifications
