# ArteStudio Website

Public portfolio website for an events and scenography studio. The app is intentionally small: Next.js renders a fully static export of the public site, Sanity owns content and media, and a dedicated Cloudflare Worker handles the contact form through Cloudflare Email Routing.

## Architecture

- **Frontend**: Next.js 16 App Router (`output: "export"`) with localized public routes under `app/[locale]`.
- **CMS**: Sanity for projects, categories, site config, and images.
- **Studio**: standalone Sanity Studio (`npm run sanity:dev` / `npm run sanity:deploy`). It is **not** mounted inside this Next.js app.
- **Images**: Sanity Asset CDN (`cdn.sanity.io`) served as plain URLs (`next/image` is unoptimized — see `next.config.ts`).
- **Contact form**: `POST /api/contact` is implemented by `workers/contact/index.mjs` and sends only to the verified project mailbox through a restricted Cloudflare email binding.
- **Rate limiting**: Cloudflare Workers Rate Limiting binding (`RATE_LIMITER`) keyed by the connecting client.
- **No custom admin/backend**: there is no local admin panel, auth system, database, or upload pipeline.

## Requirements

- Node.js 20.9 or newer
- A Sanity project and dataset
- Cloudflare Pages for the static site
- Cloudflare Email Routing on `forms.artestudiosrl.it`, a verified destination address, and Workers bindings for the contact route

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run dev` runs the Next.js public site only. Run the contact Worker separately with Wrangler when testing its request handling locally.

## Environment

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2025-02-25

NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

The contact Worker's restricted `EMAIL` and `RATE_LIMITER` bindings are declared in `workers/contact/wrangler.jsonc`. No mail API token is stored in the repository or exposed to the browser.

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
2. Cloudflare Pages serves `out/`.
3. `public/_headers` and `public/_redirects` carry security headers and routing.
4. Deploy `workers/contact` and route the exact `/api/contact` path on the apex hostname to it. The `www` frontend submits to that canonical endpoint.

The Studio is deployed separately with `npm run sanity:deploy`.
