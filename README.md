# ArteStudio Website

Public portfolio website for an events and scenography studio. The app is now intentionally small: Next.js renders the public site, Sanity owns content and media, and one lightweight SMTP route handles contact forms.

## Architecture

- **Frontend**: Next.js 16 App Router with localized public routes under `app/[locale]`.
- **CMS**: Sanity for projects, categories, site config, and images.
- **Studio**: Sanity Studio is mounted at `/studio`.
- **Images**: Sanity Asset CDN (`cdn.sanity.io`), configured in `next.config.ts`.
- **Contact**: `POST /api/contact` sends mail through SMTP via `nodemailer`.
- **No custom admin/backend**: there is no local admin panel, auth system, database, S3 upload flow, or migration layer.

## Requirements

- Node.js 20.9 or newer
- A Sanity project and dataset
- SMTP credentials for the contact form

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_VERSION=2025-02-25
SANITY_STUDIO_URL=http://localhost:3000/studio

SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
CONTACT_FROM=Website <no-reply@yourdomain.com>
CONTACT_TO=owner@yourdomain.com

NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

If Sanity variables are missing, the app still builds with fallback site config and empty project/category lists.

## Sanity Setup

You do not need a globally installed CLI. Use the local Sanity dependency:

```bash
npx sanity login
npx sanity projects create artestudio --dataset production
```

Then copy the project id into `.env.local`.

Run the site and embedded Studio together:

```bash
npm run dev
```

Open `/studio` to create `siteConfig`, `category`, and `project` documents. The Studio is protected by Sanity authentication, not by this app.

In Sanity project settings, add the local and production site origins to CORS, for example `http://localhost:3000` and your deployed domain.

## Expected Sanity Documents

The app currently expects three document types:

- `project`: `slug`, `title`, `category` reference or `categorySlug`, `year`, `client`, `description`, `thumbnail`, `stages`.
- `category`: `slug`, `name`, `description`, optional `icon`, optional `sortOrder`.
- `siteConfig`: singleton document with company/contact/SEO fields and optional `heroCarousel`.

The GROQ projections in `lib/data-utils.ts` and `lib/site-config-storage.ts` are deliberately permissive so the existing Sanity model can be adapted without a large frontend rewrite.

## Scripts

```bash
npm run dev              # Start local dev server
npm run build            # Build production app
npm run start            # Start production server
npm run lint             # Run ESLint CLI
npm run typecheck        # Run TypeScript without emitting files
npm run sanity:dev       # Run Sanity Studio directly with the Sanity dev server
npm run sanity:deploy    # Deploy Studio to Sanity hosting
npm run generate:favicon # Generate favicon asset
```

## Deployment

Deploy as a normal Next.js SSR/ISR app. The only server behavior now is the contact route and cached Sanity reads. If the contact form is later moved to a provider, this app can be pushed closer to a fully static deployment.
