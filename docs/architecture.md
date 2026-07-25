# Architecture

## Current Shape

A static-export Next.js public site with one narrowly routed Cloudflare Worker:

- `app/[locale]`: localized public pages.
- `app/layout.tsx`, `app/error.tsx`, `app/not-found.tsx`, `app/sitemap.ts`, `app/robots.ts`: app-level routes and metadata.
- `workers/contact/index.mjs`: Cloudflare Worker handling `POST /api/contact` through a restricted email binding.
- `components/`: public UI (header, footer, project card, hero carousel, lightbox, etc.).
- `lib/sanity.ts`: Sanity client setup (reads `NEXT_PUBLIC_SANITY_*` env vars).
- `lib/data-utils.ts`: Sanity project/category reads.
- `lib/site-config-storage.ts`: Sanity `siteConfig` read with a hardcoded fallback.
- `lib/site-config.ts`: pure helpers for opening hours, phone formatting, maps embed.
- `lib/seo.ts`: shared metadata helpers.
- `sanity.config.ts`, `sanity.cli.ts`: standalone Sanity Studio configuration (run separately, not mounted in Next).
- `sanity/schemaTypes/`: `categoryType`, `projectType`, `siteConfigType`.
- `types/index.ts`: shared content and site config types.

There is no custom CMS, auth system, database, server-render path, or upload layer. The only editing UI is the Sanity Studio, authenticated by Sanity.

## Build & Runtime

- `next.config.ts` sets `output: "export"`, so `npm run build` produces a fully static `out/` directory.
- Cloudflare Pages serves `out/`; an exact Worker route intercepts `/api/contact` on the apex hostname. The `www` frontend submits to that canonical endpoint.
- `public/_headers` carries security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- `public/_redirects` carries the root → `/it/` redirect.

## Data Flow

1. Server components in `app/[locale]/**` call `readSiteConfig()` and `getCurrentData()` at build time.
2. Those helpers issue GROQ queries against Sanity via `sanityFetch()`.
3. Layouts pass the resolved site config and content into client components as props.
4. Images are plain Sanity Asset CDN URLs (`next/image` is `unoptimized`).

## Contact Flow

1. The contact form `POST`s JSON to `/api/contact`; on `www`, the client uses the canonical apex endpoint with a CORS-safelisted content type.
2. A narrowly scoped Worker route sends the request to `workers/contact/index.mjs`.
3. The Worker checks origin, content type, request size, JSON shape, and the `RATE_LIMITER` binding.
4. It validates required fields and per-field length limits.
5. Its restricted `EMAIL` binding sends from `website@forms.artestudiosrl.it` only to the verified project mailbox, with `replyTo` set to the visitor.

There is no SMTP password, third-party mail API token, nodemailer dependency, or in-memory queue.

## Sanity Content Contract

The frontend expects:

- `category` documents with slug/name/description.
- `project` documents with slug/title/category/year/client/description/thumbnail/stages.
- A singleton `siteConfig` document for company info, SEO defaults, contact details, legal info, opening hours, socials, and hero carousel.

The GROQ projections accept alternate field names (`projectId`, `categoryId`, `categorySlug`, `thumbnailUrl`, `imageUrls`) so the original migration can evolve without a frontend rewrite.

## Studio

The Studio is a standalone Sanity Studio configured in `sanity.config.ts`. It is run with `npm run sanity:dev` and deployed with `npm run sanity:deploy`. It is **not** mounted inside the Next.js app and there is no `/studio` route in the deployed site.

## Internationalization

`next-intl` powers localized routes under `app/[locale]`. Strings live in `messages/{en,it}.json` and the request configuration lives in `i18n/`.
