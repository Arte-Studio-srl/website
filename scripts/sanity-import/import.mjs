#!/usr/bin/env node
// Bulk import projects + images into Sanity as DRAFTS.
//
// Usage:
//   node scripts/sanity-import/import.mjs --dry-run                # nothing is written
//   node scripts/sanity-import/import.mjs --only=siemens           # one project (any slug from manifest)
//   node scripts/sanity-import/import.mjs                          # full run
//
// Env:
//   NEXT_PUBLIC_SANITY_PROJECT_ID  — from .env.local
//   NEXT_PUBLIC_SANITY_DATASET     — from .env.local
//   SANITY_API_VERSION             — from .env.local
//   SANITY_AUTH_TOKEN              — write token, from .env.local

import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ----- env loading (no extra dep; we read .env.local ourselves) -----
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const ENV_PATH = path.join(REPO_ROOT, '.env.local');
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const [, k, vRaw] = m;
    if (process.env[k]) continue;
    const v = vRaw.replace(/^['"]|['"]$/g, '');
    process.env[k] = v;
  }
}

// ----- CLI args -----
const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
let onlySlug = null;
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--only=(.+)$/);
  if (m) onlySlug = m[1];
}

// ----- config & inputs -----
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2025-02-25';
const token = process.env.SANITY_AUTH_TOKEN;

if (!projectId) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID missing');
if (!dryRun && !token) throw new Error('SANITY_AUTH_TOKEN missing (or pass --dry-run)');

const MEDIA_ROOT = '/tmp/as-media-extracted';
const MANIFEST_PATH = path.join(REPO_ROOT, 'image-sort-manifest.json');
const CATEGORIES_PATH = path.join(__dirname, 'categories.json');
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const categoriesData = JSON.parse(fs.readFileSync(CATEGORIES_PATH, 'utf8'));

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

// ----- helpers -----
const log = (...a) => console.log(...a);
const draftId = (id) => (id.startsWith('drafts.') ? id : `drafts.${id}`);

function categoryDocId(slug) {
  return `category-${slug}`;
}

async function ensureCategory({ slug, name_it, name_en, description_it, description_en, sortOrder }) {
  const docId = categoryDocId(slug);
  if (dryRun) {
    log(`  [dry-run] would ensure category: ${docId} (${name_en})`);
    return { _type: 'reference', _ref: docId };
  }
  const doc = {
    _id: docId,
    _type: 'category',
    name_it,
    name_en,
    slug: { _type: 'slug', current: slug },
    ...(description_it ? { description_it } : {}),
    ...(description_en ? { description_en } : {}),
    sortOrder,
  };
  await client.createOrReplace(doc);
  log(`  ensured category: ${docId} (${name_en})`);
  return { _type: 'reference', _ref: docId };
}

async function ensureAllCategories() {
  const refs = {};
  for (const cat of categoriesData.categories) {
    refs[cat.slug] = await ensureCategory({
      slug: cat.slug,
      name_it: cat.name_it,
      name_en: cat.name_en,
      description_it: cat.description_it,
      description_en: cat.description_en,
      sortOrder: cat.sortOrder,
    });
  }
  refs['uncategorized'] = await ensureCategory({
    slug: 'uncategorized',
    name_it: 'Senza categoria',
    name_en: 'Uncategorized',
    description_en: 'Default bucket for imported projects pending re-classification.',
    sortOrder: 999,
  });
  return refs;
}

function categoryRefFor(slug, refs) {
  const target = categoriesData.projectCategoryMap[slug];
  if (target && refs[target]) return refs[target];
  log(`  WARN: no category mapping for "${slug}" — using Uncategorized`);
  return refs['uncategorized'];
}

async function uploadImageAsset(absPath, label) {
  if (dryRun) {
    log(`    [dry-run] would upload ${label}`);
    return { _type: 'image', _ref: 'dry-run-asset-id' };
  }
  const stream = fs.createReadStream(absPath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(absPath),
  });
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  };
}

function stageObject(title, icon, images) {
  return {
    _type: 'projectStage',
    _key: `stage-${title.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    icon,
    images: images.map((img) => ({ ...img, _key: Math.random().toString(36).slice(2, 10) })),
  };
}

async function importProject(slug, info, categoryRef) {
  log(`\n=== ${slug} (${info.title}) ===`);
  const projDir = path.join(MEDIA_ROOT, slug);

  // Telecom edge: merge leftover "thumb" bucket into final.
  const stagesIn = info.stages || {};
  if (stagesIn.thumb && stagesIn.thumb.length) {
    stagesIn.final = [...(stagesIn.final || []), ...stagesIn.thumb];
    delete stagesIn.thumb;
  }

  // Upload thumbnail
  log(`  thumbnail: ${info.thumbnail}`);
  const thumbAsset = await uploadImageAsset(path.join(projDir, info.thumbnail), info.thumbnail);

  // Build projectStage[] from final + stage buckets
  const stages = [];
  if (stagesIn.stage && stagesIn.stage.length) {
    log(`  stage (BTS): ${stagesIn.stage.length} images`);
    const imgs = [];
    for (const fn of stagesIn.stage) {
      imgs.push(await uploadImageAsset(path.join(projDir, fn), fn));
    }
    stages.push(stageObject('Construction', 'layers', imgs));
  }
  if (stagesIn.final && stagesIn.final.length) {
    log(`  final: ${stagesIn.final.length} images`);
    const imgs = [];
    for (const fn of stagesIn.final) {
      imgs.push(await uploadImageAsset(path.join(projDir, fn), fn));
    }
    stages.push(stageObject('Final', 'camera', imgs));
  }

  const docId = `import-${slug}`;
  const descriptionIt = categoriesData.descriptionsIt[slug] || info.description;
  const doc = {
    _id: draftId(docId),
    _type: 'project',
    title_it: info.title,
    title_en: info.title,
    slug: { _type: 'slug', current: slug },
    category: categoryRef,
    ...(info.year ? { year: info.year } : {}),
    description_it: descriptionIt,
    description_en: info.description,
    thumbnail: thumbAsset,
    stages,
  };

  if (dryRun) {
    log('  [dry-run] would create draft:', doc._id);
    log('  doc preview:', JSON.stringify({ ...doc, thumbnail: '...', stages: stages.map((s) => ({ ...s, images: `[${s.images.length}]` })) }, null, 2));
    return;
  }

  log(`  creating draft: ${doc._id}`);
  await client.createOrReplace(doc);
  log(`  done`);
}

// ----- main -----
(async () => {
  log(`Target: project=${projectId} dataset=${dataset} draft=true dryRun=${dryRun}${onlySlug ? ` only=${onlySlug}` : ''}`);
  const categoryRefs = await ensureAllCategories();

  const slugs = onlySlug ? [onlySlug] : Object.keys(manifest);
  for (const slug of slugs) {
    if (!manifest[slug]) {
      console.error(`Unknown slug: ${slug}`);
      process.exit(1);
    }
    try {
      await importProject(slug, manifest[slug], categoryRefFor(slug, categoryRefs));
    } catch (e) {
      console.error(`FAILED for ${slug}:`, e.message);
      process.exit(1);
    }
  }
  log(`\nDone. ${slugs.length} project(s) processed.`);
})();
