# Security Overview

## Current Surface

The custom admin/auth/database/S3 backend has been removed. The remaining server-side surface is intentionally small:

- Public Sanity reads for site content.
- Sanity Studio at `/studio`, authenticated by Sanity.
- Sanity Asset CDN image delivery.
- `POST /api/contact` for SMTP contact email.
- Read-only compatibility endpoints: `GET /api/projects`, `GET /api/projects/[id]`, `GET /api/categories`.

## Implemented Controls

- No custom local admin panel or privileged mutation endpoints.
- No local session cookies, JWTs, verification codes, or password handling.
- No database credentials in the app.
- No direct S3 credentials or upload routes in the app.
- Contact endpoint validates required fields.
- Contact endpoint has a lightweight in-memory rate limiter.
- Security headers in `next.config.ts`: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.

## Operational Notes

- Sanity project permissions should be managed in Sanity, not this repository.
- Public content should live in a public Sanity dataset, or reads should use a read token only on the server.
- Keep SMTP credentials server-only and never expose them with `NEXT_PUBLIC_`.
- The in-memory rate limiter is intentionally lightweight. For production abuse protection, use host-level rate limiting, WAF rules, or a form provider.
- `npm audit` currently reports moderate advisories through `next@16.2.6` bundling `postcss@8.4.31` and Sanity CLI dependencies pulling `@vercel/frameworks`/`js-yaml`. `npm audit fix --force` proposes breaking downgrades, so do not apply it blindly. Upgrade Next/Sanity normally when patched releases are available.

## Production Checklist

1. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_VERSION`.
2. Configure SMTP and `CONTACT_TO`.
3. Set `NEXT_PUBLIC_SITE_URL`.
4. Review Sanity dataset visibility and editor permissions.
5. Run `npm audit`, `npm run lint`, `npm run typecheck`, and `npm run build` before deployment.
