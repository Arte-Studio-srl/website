# Sanity Bulk Import (one-off migration tool)

This script is **not** part of the running site. It was written for the initial migration of legacy media + project metadata into Sanity and is preserved for reference / re-runs against a fresh dataset.

It is intentionally undocumented in the top-level scripts list because regular contributors should never need it. If you do not know why you're running it, you don't need to.

## What it does

`import.mjs` reads:

- a manifest at `<repo-root>/image-sort-manifest.json` (slug → image-file list), **not** committed to the repo,
- extracted media at `/tmp/as-media-extracted/` (also not committed),
- category metadata at `./categories.json`,

and creates `category` and `project` documents in Sanity as **drafts** (see [[feedback_schema_required_fields]]). Drafts let an editor review and publish without bypassing schema validation.

## Prerequisites

1. A Sanity write token in `.env.local`:
   ```
   SANITY_AUTH_TOKEN=sk_...
   ```
2. `image-sort-manifest.json` at the repo root.
3. Extracted media at `/tmp/as-media-extracted/`.

If any of these are missing, the script fails fast.

## Usage

```bash
# Preview without writing
node scripts/sanity-import/import.mjs --dry-run

# Import a single project by slug
node scripts/sanity-import/import.mjs --only=siemens

# Full run
node scripts/sanity-import/import.mjs
```

## Why it's not in `package.json`

It has external dependencies (a directory under `/tmp`, a manifest file outside source control) and writes to a third-party system. Exposing it via `npm run` would invite accidental invocation. Run it explicitly when you mean to.
