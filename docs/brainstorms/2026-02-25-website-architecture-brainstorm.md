---
date: 2026-02-25
topic: website-architecture
---

# Website Architecture Overhaul

## What We're Building
A complete backend and data storage rewrite of the existing website. We are moving away from the brittle "Git-as-a-Database" pattern (which relied on parsing TypeScript files to update content) to a robust, simplified Postgres and AWS S3 setup. This eliminates the TypeScript parsing fragility and standardizes the architecture while keeping dependencies to a minimum.

## Why This Approach
The previous architecture used external APIs to read/write `data/projects.ts` directly, which led to a fragile developer experience ("fucked up TypeScript"). By migrating the data to PostgreSQL and images to AWS S3, we decouple content from code. We chose to use raw SQL over an ORM to honor the principle of "total simplification and dependency reduction", relying on the standard `@vercel/postgres` or `pg` driver. We are also keeping the existing custom Next.js admin dashboard (`app/admin/`) and simply rewriting its underlying API routes.

## Key Decisions
- **Database:** PostgreSQL. Provides a robust relational data store for projects, categories, and site configuration.
- **Image Storage:** AWS S3. Separates large binary assets from the codebase and the database, serving them efficiently.
- **Data Access:** Raw SQL (via standard Postgres drivers). Maximizes simplicity and minimizes third-party dependencies by avoiding heavy ORMs like Prisma or Drizzle.
- **Admin Interface:** Keep existing Next.js custom dashboard. The UI works well; only the `app/api/admin/` routes need to be rewritten to interface with Postgres and S3 instead of the legacy API.

## Resolved Questions
- The user expressed a strong preference for total simplification and reducing dependencies, leading to the choice of raw SQL over an ORM.

## Open Questions

## Next Steps
→ `/workflows:plan` for implementation details