---
title: Refactor Website Architecture (PostgreSQL + S3)
type: refactor
status: completed
date: 2026-02-25
---

# Refactor Website Architecture (PostgreSQL + S3)

## Overview

A complete backend and data storage rewrite of the existing website. This migration moves the application away from a brittle "Git-as-a-Database" pattern—which relied on parsing TypeScript files (`data/projects.ts`) and committing them via GitHub APIs—to a robust, simplified PostgreSQL and AWS S3 architecture. The goal is to eliminate TypeScript parsing fragility, decouple content from code, and standardize the architecture while keeping dependencies to a strict minimum (using raw SQL).

## Problem Statement / Motivation

The current architecture uses GitHub APIs to read and write directly to `data/projects.ts` to manage site content (projects, categories, configuration). This causes several critical issues:
1. **Fragility:** The application has to parse TypeScript code at runtime using Regex. Any slight formatting change (like a trailing comma or unexpected comment) breaks the site's data fetching.
2. **Coupling:** Content updates require Git commits, blurring the line between code deployments and content management.
3. **Image Storage:** Images are either committed directly to the repository or saved to the local filesystem, which is not scalable or ideal for Serverless deployments like Vercel.
4. **Developer Experience:** The current setup makes the TypeScript configuration feel "messed up" and complicates local development.

## Proposed Solution

1. **Database (PostgreSQL):** Migrate all structured data (Projects, Categories, Site Config) to a PostgreSQL database. We will use raw SQL via the standard `pg` driver to maintain extreme simplicity and avoid heavy ORM dependencies.
2. **Image Storage (AWS S3):** Migrate all image assets to an AWS S3 bucket. We will update the image upload mechanism to use `@aws-sdk/client-s3`.
3. **Admin API Rewrite:** Keep the existing custom Next.js admin dashboard UI (`app/admin/`) but rewrite the underlying API routes (`app/api/admin/*`) to interface with Postgres and S3 instead of the GitHub API.

## Technical Approach

### Architecture

- **Database Driver:** `pg` (with connection pooling configured for Serverless).
- **Storage SDK:** `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` (for secure, direct-to-S3 uploads).
- **Data Access Layer:** Create a new `lib/db.ts` to manage the Postgres connection pool and provide strongly-typed raw SQL helper functions.
- **Storage Layer:** Create a new `lib/s3.ts` to handle generating presigned URLs and deleting objects from S3.

### Implementation Phases

#### Phase 1: Infrastructure & Database Setup

- **Tasks:**
  - Provision a PostgreSQL database (e.g., via Vercel Postgres, Supabase, or AWS RDS).
  - Provision an AWS S3 Bucket and configure IAM user credentials.
  - Create a database initialization script (`scripts/init-db.js`) to define tables: `projects`, `categories`, and `site_config`.
  - Create `lib/db.ts` with a Serverless-safe Postgres connection pool.
- **Success Criteria:** Database tables exist, and the Next.js app can successfully connect and execute a basic `SELECT NOW()`.

#### Phase 2: S3 Integration & Uploads

- **Tasks:**
  - Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`.
  - Create `lib/s3.ts` with an initialized `S3Client`.
  - Rewrite `app/api/admin/upload/route.ts` to generate and return S3 Presigned URLs instead of handling the file directly or pushing to GitHub.
  - Update the admin frontend upload component to use the Presigned URL to upload directly to S3.
- **Success Criteria:** Images can be successfully uploaded to the S3 bucket via the admin panel, and the public S3 URL is returned.

#### Phase 3: Data Access & API Rewrite

- **Tasks:**
  - Write strongly-typed raw SQL queries for CRUD operations in `lib/data-utils.ts` (or a new `lib/repository.ts`), replacing the regex-based file parsing.
  - Rewrite all `app/api/admin/*` routes (`/projects`, `/categories`, `/config`) to use the new database queries.
  - Implement a data migration script (`scripts/migrate-data.ts`) to read the current `data/projects.ts` file and `INSERT` the records into the new Postgres database.
- **Success Criteria:** The admin panel can fully manage projects and categories, saving changes to Postgres instead of GitHub.

#### Phase 4: Frontend Integration & Cleanup

- **Tasks:**
  - Update the public-facing frontend pages (`app/page.tsx`, `app/projects/[slug]/page.tsx`, etc.) to fetch data directly from Postgres.
  - Remove all GitHub CMS related code (`lib/github-content.ts`, GitHub API environment variables).
  - Delete `data/projects.ts` and `data/site-config.ts` once data is fully migrated.
- **Success Criteria:** The public site renders correctly using data from Postgres and images from S3. The old Git-as-CMS code is completely removed.

## System-Wide Impact

### Interaction Graph
1. Admin uploads image -> UI requests Presigned URL from `/api/admin/upload` -> API calls AWS STS/S3 -> UI uploads directly to S3 Bucket -> UI receives public S3 URL.
2. Admin saves project -> UI calls `/api/admin/projects` -> API executes `INSERT/UPDATE` via `lib/db.ts` to Postgres.
3. Public user visits site -> Next.js Server Component executes `SELECT` via `lib/db.ts` -> Renders page.

### Error & Failure Propagation
- **Database Connection Errors:** Handled in `lib/db.ts` and propagated as `500 Internal Server Error` API responses. Next.js Error Boundaries (`error.tsx`) must handle rendering failures gracefully on the public site.
- **S3 Upload Failures:** If the client fails to upload to the Presigned URL, the UI must display a clear error message and prevent saving the project with a broken image URL.

### State Lifecycle Risks
- **Orphaned Images:** If an admin uploads an image to S3 but fails to save the project, the image becomes orphaned in the bucket.
  - *Mitigation:* We can implement a background cleanup job or simply ignore them, as storage is cheap. For deletions, when a project is deleted in Postgres, we must explicitly delete the associated images from S3.

## Acceptance Criteria

### Functional Requirements
- [x] Admin can create, read, update, and delete projects.
- [x] Admin can create, read, update, and delete categories.
- [x] Admin can update site configuration.
- [x] Images are uploaded securely directly to AWS S3.
- [x] The public website accurately displays content fetched from PostgreSQL.

### Non-Functional Requirements
- [x] Zero usage of Prisma, Drizzle, or other heavy ORMs (Raw SQL only).
- [x] Next.js Serverless connection pool limits are respected to prevent DB connection exhaustion.
- [x] No regular expressions are used to parse or modify TypeScript/JSON files for data storage.

## Dependencies & Prerequisites

- PostgreSQL database instance.
- AWS S3 Bucket with appropriate CORS configuration for direct browser uploads.
- `pg` or `@vercel/postgres` npm package.
- `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` npm packages.

## References & Research

### Internal References
- Architecture brainstorm: `docs/brainstorms/2026-02-25-website-architecture-brainstorm.md`
- Current Data Layer: `lib/data-utils.ts`, `lib/github-content.ts`

### External References
- [AWS SDK for JavaScript v3 - S3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- Connection Pooling in Serverless: Vercel documentation recommends using `attachDatabasePool` if using the raw `pg` library.