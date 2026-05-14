# Security Overview

## Current Surface

The custom admin/auth/database/S3 backend has been removed. The site is a static export plus one Cloudflare Pages Function:

- Public Sanity reads at build time for site content.
- Sanity Asset CDN image delivery (no proxy).
- `POST /api/contact` — Cloudflare Pages Function (`functions/api/contact.ts`) that calls the Resend HTTP API.
- Standalone Sanity Studio, authenticated by Sanity, not exposed on this domain.

There is no `/studio` route, no `/api/projects` / `/api/categories` compatibility endpoint, and no SSR route in the deployed app.

## Implemented Controls

- No custom local admin panel or privileged mutation endpoints.
- No local session cookies, JWTs, verification codes, or password handling.
- No database credentials in the app.
- No direct S3 credentials or upload routes in the app.
- Contact function validates required fields and enforces per-field length limits.
- Contact function requires `Content-Type: application/json`.
- Contact function uses a Cloudflare Rate Limiting binding (`RATE_LIMITER`) keyed by sender email.
- `RESEND_API_KEY`, `CONTACT_FROM`, and `CONTACT_TO` live as Cloudflare Pages environment variables; they never reach the client bundle.
- Security headers in `public/_headers`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

## Operational Notes

- Sanity project permissions are managed in Sanity, not in this repository.
- Public content lives in a public Sanity dataset; if that changes, reads must use a server-side read token.
- Keep `RESEND_API_KEY` server-only. Never prefix it with `NEXT_PUBLIC_`.
- The `RATE_LIMITER` binding is configured in the Cloudflare Pages dashboard (Settings → Functions → Bindings). Adjust thresholds there.
- `npm audit` periodically reports advisories through `next` and `sanity` transitive dependencies. `npm audit fix --force` proposes breaking downgrades, so do not apply it blindly. Upgrade Next/Sanity normally when patched releases are available.

## Production Checklist

1. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_VERSION` in Cloudflare Pages env.
2. Set `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` in Cloudflare Pages env.
3. Bind a Cloudflare Rate Limiting rule to `RATE_LIMITER` in the Pages dashboard.
4. Set `NEXT_PUBLIC_SITE_URL`.
5. Review Sanity dataset visibility and editor permissions.
6. Run `npm audit`, `npm run lint`, `npm run typecheck`, and `npm run build` before deployment.
