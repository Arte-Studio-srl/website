# Security Overview

## Current Surface

The custom admin/auth/database/S3 backend has been removed. The site is a static export plus one narrowly routed Cloudflare Worker:

- Public Sanity reads at build time for site content.
- Sanity Asset CDN image delivery (no proxy).
- `POST /api/contact` — Cloudflare Worker (`workers/contact/index.mjs`) with a restricted email binding.
- Standalone Sanity Studio, authenticated by Sanity, not exposed on this domain.

There is no `/studio` route, no `/api/projects` / `/api/categories` compatibility endpoint, and no SSR route in the deployed app.

## Implemented Controls

- No custom local admin panel or privileged mutation endpoints.
- No local session cookies, JWTs, verification codes, or password handling.
- No database credentials in the app.
- No direct S3 credentials or upload routes in the app.
- Contact function validates required fields and enforces per-field length limits.
- Contact Worker accepts JSON payloads as `application/json`, plus `text/plain` for the CORS-safelisted `www` → apex request.
- Contact Worker uses a Cloudflare Rate Limiting binding (`RATE_LIMITER`) keyed by the connecting client.
- The `EMAIL` binding is restricted to `progetto@progettoartestudio.it` and the sender `website@forms.artestudiosrl.it`.
- No third-party mail API key or SMTP password is stored in the Worker or client bundle.
- Security headers in `public/_headers`: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

## Operational Notes

- Sanity project permissions are managed in Sanity, not in this repository.
- Public content lives in a public Sanity dataset; if that changes, reads must use a server-side read token.
- Keep the destination and sender restrictions on the `EMAIL` binding when changing the Worker configuration.
- Keep the Worker route limited to the exact `/api/contact` path on the apex hostname; the `www` frontend submits to that canonical endpoint.
- `npm audit` periodically reports advisories through `next` and `sanity` transitive dependencies. `npm audit fix --force` proposes breaking downgrades, so do not apply it blindly. Upgrade Next/Sanity normally when patched releases are available.

## Production Checklist

1. Set `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and `SANITY_API_VERSION` in Cloudflare Pages env.
2. Verify the Cloudflare Email Routing destination address.
3. Confirm the contact Worker's restricted `EMAIL` and `RATE_LIMITER` bindings.
4. Set `NEXT_PUBLIC_SITE_URL`.
5. Review Sanity dataset visibility and editor permissions.
6. Run `npm audit`, `npm run lint`, `npm run typecheck`, and `npm run build` before deployment.
