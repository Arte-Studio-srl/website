# ArteStudio Website

Public portfolio website for an events and scenography studio. The app is intentionally small: Next.js renders a fully static export of the public site, Sanity owns content and media, and a single Cloudflare Pages Function handles the contact form via Resend.

## Architecture

- **Frontend**: Next.js 16 App Router (`output: "export"`) with localized public routes under `app/[locale]`.
- **CMS**: Sanity for projects, categories, site config, and images.
- **Studio**: standalone Sanity Studio (`npm run sanity:dev` / `npm run sanity:deploy`). It is **not** mounted inside this Next.js app.
- **Images**: Sanity Asset CDN (`cdn.sanity.io`) served as plain URLs (`next/image` is unoptimized — see `next.config.ts`).
- **Contact form**: `POST /api/contact` is implemented as a Cloudflare Pages Function in `functions/api/contact.ts` and sends mail via the Resend HTTP API.
- **Rate limiting**: Cloudflare Rate Limiting binding (`RATE_LIMITER`) keyed by sender email.
- **No custom admin/backend**: there is no local admin panel, auth system, database, or upload pipeline.

## Requirements

- Node.js 20.9 or newer
- A Sanity project and dataset
- A Resend API key for the contact form (production only)
- Cloudflare Pages for deployment (or any static host, plus an external function host for the contact route)

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run dev` runs the Next.js public site only. The contact Pages Function does not run under `next dev`; to test the contact flow end-to-end, run a Cloudflare-compatible local server (for example `npx wrangler pages dev out` after `npm run build`).

## Environment

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2025-02-25

# Cloudflare Pages Function — set these in the Cloudflare dashboard, not here.
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_FROM=Website <no-reply@yourdomain.com>
CONTACT_TO=owner@yourdomain.com

NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

The `RATE_LIMITER` binding is configured in the Cloudflare Pages dashboard (Settings → Functions → Bindings → Rate limiting), not via env vars.

If Sanity variables are missing, the app still builds with fallback site config and empty project/category lists.

## Sanity Setup

You do not need a globally installed CLI. Use the local dependency:

```bash
npx sanity login
npx sanity projects create artestudio --dataset production
```

Copy the project id into `.env.local` as `NEXT_PUBLIC_SANITY_PROJECT_ID`. Both `sanity.config.ts` and `sanity.cli.ts` read this from the environment.

Run the public site and the Studio in separate terminals:

```bash
npm run dev          # public Next.js site on :3000
npm run sanity:dev   # standalone Sanity Studio
```

In Sanity project settings, add the local and production site origins to CORS (for example `http://localhost:3000` and the deployed domain). Studio access is controlled by Sanity authentication.

## Expected Sanity Documents

- `project`: `slug`, `title`, `category` reference or `categorySlug`, `year`, `client`, `description`, `thumbnail`, `stages`.
- `category`: `slug`, `name`, `description`, optional `icon`, optional `sortOrder`.
- `siteConfig`: singleton with company/contact/SEO fields and optional `heroCarousel`.

The GROQ projections in `lib/data-utils.ts` and `lib/site-config-storage.ts` are deliberately permissive so the existing Sanity model can be adapted without a frontend rewrite.

## Scripts

```bash
npm run dev              # Local dev server (public site only)
npm run build            # Static export to out/
npm run start            # Next start (not used in production — see Deployment)
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm run sanity:dev       # Standalone Sanity Studio dev server
npm run sanity:deploy    # Deploy Studio to Sanity hosting
npm run generate:favicon # Regenerate favicon asset
```

`scripts/sanity-import/` contains a one-off migration tool. See its README before running it.

## Deployment

The site is built as a fully static export and deployed to Cloudflare Pages.

1. `npm run build` produces `out/`.
2. Cloudflare Pages serves `out/` and runs `functions/` as Pages Functions.
3. `public/_headers` and `public/_redirects` carry security headers and routing.
4. Set `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`, and the `RATE_LIMITER` binding in the Cloudflare dashboard.

The Studio is deployed separately with `npm run sanity:deploy`.
