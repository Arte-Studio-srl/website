# Bulk import — next steps

State right now (2026-05-12):

- Schema deployed: `category`, `project`, `siteConfig` (year is now optional)
- CORS allowlisted for `http://localhost:3000`
- Write token in `.env.local` works (robot `poDGHLx6x` = "load content")
- 1/34 projects uploaded as draft: **Siemens** (`drafts.import-siemens`) + thumbnail + 2 finals
- Working manifest: `image-sort-manifest.json` (233 images, 34 projects)
- Sorted images on disk: `/tmp/as-media-extracted/<slug>/`
- Import script: `scripts/sanity-import/import.mjs`
- Default category created: `category-uncategorized`

---

## 1. Improve descriptions + categories

The 34 imported drafts will have auto-generated single-line English descriptions and all belong to the `Uncategorized` category. Two ways forward:

### Categories — recommended split

Looking at the project list, a reasonable taxonomy is:

| Category | Projects |
|---|---|
| Fashion Shows | marras-letti, marras-origami, marras-porte, marras-sassi, marras-scale, marras-tulle, etro-bosco, etro-nave, dsl-55, agata-ruiz-della-prada |
| Corporate Events | siemens, telecom, unicredit, vodafone-stoccolma, fastweb, gazzetta, asus |
| Retail / Window Displays | chanel-fasce, chanel-texas, bendotti-forno, gas |
| Exhibitions / Installations | chanel-n5, caesarstone, biosan, diamante, dracula, geronimo |
| Theater / Stage Productions | aldo-gg, albanese, tutti-insieme, io-non-sono, louis |
| Trade Booths | bendotti |

Steps:
1. Create the 6 category docs in Studio (or extend the import script with `categories.json` + reassign drafts).
2. Re-link each draft to the right category before publishing.

### Descriptions

The current one-line descriptions are visual summaries from spot-checks — accurate but generic. They read like image captions, not portfolio copy. Options:

- **Option A (fast)**: ship them as-is, edit in Studio when polishing each project.
- **Option B (better)**: ask Claude to expand each into a 2-3 sentence portfolio paragraph (mentions client, year, concept). I'd need the manifest + one extra pass with the hero image to write each. Cost: ~34 vision calls + writing time.
- **Option C (best)**: write them yourself. The auto-generated ones serve as starter drafts.

---

## 2. Languages (it + en)

**Site setup:** `next-intl` with locales `["it", "en"]`, default `it`. UI strings live in `messages/it.json` and `messages/en.json`. So far the Sanity schema has only a single-language `description: text` field — all 34 imported drafts are in English.

Two architectural choices:

### Choice A — One field per language (simple)

Change the schema:

```ts
// in projectType.ts
defineField({ name: 'title_it', title: 'Title (IT)', type: 'string', validation: r => r.required() }),
defineField({ name: 'title_en', title: 'Title (EN)', type: 'string' }),
defineField({ name: 'description_it', title: 'Description (IT)', type: 'text', validation: r => r.required() }),
defineField({ name: 'description_en', title: 'Description (EN)', type: 'text' }),
```

Then read with `description_${locale}` in the frontend. Same approach for category `name`.

- ✅ Trivial to implement
- ✅ Works with the current import script (one extra field on the doc)
- ❌ Doubles the schema fields; clutters the Studio form

### Choice B — Plugin `@sanity/document-internationalization` (idiomatic)

Adds a language picker in Studio. Each translation is its own document, linked via `language` and `translations` references. The frontend queries by locale.

- ✅ Clean Studio UX, scales to more languages
- ❌ More setup, queries change

**Recommendation: Choice A** for now (you have only 2 locales, the bulk-import use case is simpler).

### Plan
1. Add `_it` and `_en` variants to `title`, `description` in `projectType.ts` and to `name`, `description` in `categoryType.ts`.
2. Migrate the imported drafts: copy the current English values into `_en`, leave `_it` empty for now.
3. Update the import script: write to `_en` on creation; leave `_it` for the user.
4. Update frontend queries in `lib/data-utils.ts` to pick `_${locale}`.
5. Translate Italian fields manually in Studio (or ask Claude to draft Italian translations).

---

## 3. Finish uploading

Siemens validated the script. Run the rest:

```bash
node scripts/sanity-import/import.mjs
```

That uploads the remaining 33 projects (~230 more images) as drafts. Expected runtime: 5–15 minutes depending on bandwidth.

If something fails midway:
- The script is **idempotent for documents** (uses `createOrReplace` with a stable id `drafts.import-<slug>`), so re-running won't create duplicates.
- But it **re-uploads assets** every run because asset IDs are content-hashed by Sanity but the script doesn't dedupe. Worst case: orphaned duplicate assets in the dataset. Cleanup: `*[_type=="sanity.imageAsset" && !defined(*[references(^._id)][0])]` to find unreferenced assets, then delete in Studio.
- To resume from a specific project: edit the script's main loop to `slice` the slug list, or pass `--only=<slug>` repeatedly.

**Before running the full upload, decide on language strategy (section 2).** If you pick Choice A, modify the script to write `_it`/`_en` fields, and re-run on all 34 projects (the script is idempotent so siemens is fine to re-run too).

---

## Suggested order

1. Decide language strategy (Choice A or B from section 2)
2. Adjust schema + import script accordingly
3. Re-run siemens to verify the new shape
4. Run the full import: `node scripts/sanity-import/import.mjs`
5. In Studio, create the 6 real categories from section 1 and reassign each draft
6. Polish descriptions (per-project, in Studio)
7. Add Italian translations for titles + descriptions
8. Publish drafts one by one as they're reviewed

---

## Cleanup (low priority)

- The slug `aldo-gg_` has a stray underscore — rename to `aldo-gg` before publishing
- Year is missing for 6 projects (agata-ruiz-della-prada, biosan, gas, siemens, telecom, vodafone-stoccolma) — fill in Studio when known
- Years are low-confidence for 5 projects (dsl-55, gazzetta, louis, dracula, asus) where inference came from screenshot capture dates — verify in Studio
- `image-sort-manifest.json` and `image-duplicates.json` are working artifacts — delete or move to `docs/` once import is published
- `/tmp/as-media-extracted/` can be removed once the import is verified in production
