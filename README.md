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
PUBLIC_BUSINESS_PHONE=919-633-3720
PUBLIC_BUSINESS_PHONE_E164=+19196333720
PUBLIC_BUSINESS_PHONE_SCHEMA=+1-919-633-3720
PUBLIC_BUSINESS_EMAIL=chamostireco@gmail.com
PUBLIC_TURNSTILE_SITE_KEY=
PUBLIC_GA_MEASUREMENT_ID=G-7K1HVRH35V

TURNSTILE_SECRET_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_NOTIFICATION_EMAIL=chamostireco@gmail.com
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

## Google Analytics 4

GA4 is installed once in the global Astro layout using this public Measurement ID:

```text
G-7K1HVRH35V
```

Set this value in Cloudflare Pages as:

```env
PUBLIC_GA_MEASUREMENT_ID=G-7K1HVRH35V
```

Implemented events:

- `click_call`: triggered when a user clicks a `tel:` link.
- `click_text`: triggered when a user clicks an `sms:` link.
- `form_start`: triggered once per page load when the user first interacts with the main tire request form.
- `generate_lead`: triggered only after `/api/leads` returns a successful lead creation response.
- `click_directions`: triggered when the user opens Google Maps or Waze directions.

The `generate_lead` event only sends general parameters:

```json
{
  "form_name": "tire_request",
  "service": "used_tire_request"
}
```

Do not send customer names, phone numbers, emails, addresses, full vehicle details, tire sizes, or notes to Google Analytics.

Validation options:

- Open GA4 Realtime and interact with the site after deployment.
- Use GA4 DebugView with a browser debug extension or preview environment.
- In browser DevTools, verify that `gtag/js?id=G-7K1HVRH35V` loads once and that event requests are sent after clicking call/text/directions or submitting a successful form.

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

## Local SEO

The homepage targets the primary local topic:

```text
Used Tires in Apex, NC
```

The homepage uses:

- A single H1.
- Canonical URL metadata.
- Open Graph and Twitter/X metadata.
- `TireShop` JSON-LD with configurable business data.
- NAP component for consistent name, address, and phone rendering.
- `@astrojs/sitemap` for canonical sitemap generation.
- `robots.txt` pointing to the public sitemap index.

Future local landing pages are planned in `src/content/local-pages.ts`, but they should not be generated until each page has unique, useful local content.

Planned future URLs:

- `/used-tires-apex-nc/`
- `/used-tires-holly-springs-nc/`
- `/used-tires-fuquay-varina-nc/`
- `/used-tires-cary-nc/`
- `/used-tires-raleigh-nc/`

Do not create duplicate city pages by only swapping city names.

## Google Business Profile SEO Checklist

External tasks pending:

- Verify the Business Profile.
- Use the real-world business name: Chamos Tire Co.
- Select the most accurate primary category available.
- Add correct address or service area.
- Add phone number.
- Add business hours.
- Link the website.
- Upload real business and inventory photos.
- Request authentic customer reviews.
- Respond to reviews.
- Keep all information consistent with the website.

Do not add artificial keywords or city names to the business name.

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
