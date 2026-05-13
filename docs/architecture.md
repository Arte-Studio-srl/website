# Architecture

## Current Shape

This is a simplified public Next.js site:

- `app/[locale]`: localized public pages.
- `app/api/contact`: lightweight SMTP contact route.
- `app/api/projects` and `app/api/categories`: read-only compatibility endpoints.
- `app/studio`: embedded Sanity Studio.
- `components`: public UI.
- `lib/sanity.ts`: Sanity client setup.
- `lib/data-utils.ts`: Sanity project/category reads.
- `lib/site-config-storage.ts`: Sanity site config read with local fallback.
- `lib/email.ts`: SMTP transport helper.
- `types/index.ts`: shared content and site config types.

There is no custom CMS, auth system, database, or object-storage upload layer. The only editing UI is Sanity Studio, authenticated by Sanity.

## Data Flow

1. Server components call `readSiteConfig()` and `getCurrentData()`.
2. Those functions read published Sanity content through GROQ.
3. `app/layout.tsx` injects site data into `SiteDataProvider`.
4. Client components render from that provider.
5. Images are normal Sanity asset CDN URLs.

## Contact Flow

1. Contact forms call `POST /api/contact`.
2. The route validates the payload and checks a small in-memory rate limit bucket.
3. `lib/email.ts` creates an SMTP transport.
4. The email is sent to `CONTACT_TO`.

## Sanity Content Contract

The frontend expects:

- `category` documents with slug/name/description.
- `project` documents with slug/title/category/year/client/description/thumbnail/stages.
- A singleton `siteConfig` document for company info, SEO defaults, contact details, legal info, opening hours, socials, and hero carousel.

The GROQ projections accept a few alternate field names, such as `projectId`, `categoryId`, `categorySlug`, `thumbnailUrl`, and `imageUrls`, to keep the first Sanity migration flexible.

## Studio

The Studio is mounted at `/studio` through `next-sanity/studio` and configured in `sanity.config.ts`.

Schemas live in `sanity/schemaTypes`:

- `categoryType.ts`
- `projectType.ts`
- `siteConfigType.ts`

## Complexity Removed

- PostgreSQL connection pool and table migrations.
- Admin pages and admin API routes.
- Email-code auth, JWT cookies, and verification-code storage.
- S3 presigned uploads and S3 deletion.
- DB-backed rate limits.
- Docker Compose Postgres service.

The remaining complexity is mostly presentation and content modeling, which is the right place for this project at this stage.
