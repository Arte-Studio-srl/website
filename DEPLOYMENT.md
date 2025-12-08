# Deployment Guide

## ⚠️ Important: Data Persistence Issue

**Current Implementation:** The admin panel modifies `data/projects.ts` directly in the deployed build. This works in development but **has critical limitations in production**.

### The Problem

When you deploy with Vercel, Netlify, or similar platforms:
1. Files are read-only after deployment
2. Changes made via admin panel are **lost on next deployment**
3. Each server instance has its own file system (can't sync)
4. Rollbacks will lose all admin changes

### Solutions (Choose One)

---

## Solution 1: Database (Recommended for Production)

Migrate from file-based storage to a database. Best for sites with frequent updates.

### Quick Setup with Vercel Postgres

```bash
# 1. Install Vercel Postgres
npm install @vercel/postgres

# 2. Create database tables
# See scripts/migrate-to-database.js
```

**Pros:**
- ✅ Persistent across deployments
- ✅ Scalable
- ✅ Real-time updates
- ✅ No data loss

**Cons:**
- ❌ More complex setup
- ❌ Monthly costs (free tier available)

### Other Database Options:
- **Supabase** (PostgreSQL) - Free tier, easy setup
- **PlanetScale** (MySQL) - Serverless, generous free tier
- **MongoDB Atlas** - NoSQL, free tier available
- **Firebase Firestore** - Real-time, Google backed

---

## Solution 2: Git-Based CMS (Recommended for This Project)

Keep file-based storage but commit changes back to repository. Perfect for infrequent updates.

### Implementation Steps:

1. **Add Git operations to API routes**
```typescript
// lib/git-operations.ts
import { execSync } from 'child_process';

export async function commitAndPush(message: string) {
  execSync('git config user.name "Admin Bot"');
  execSync('git config user.email "admin@artestudio.it"');
  execSync('git add data/projects.ts');
  execSync(`git commit -m "${message}"`);
  execSync('git push origin main');
}
```

2. **Update API routes to commit changes**
```typescript
await updateProjects(currentProjects);
await commitAndPush('Update project: ' + project.title);
```

3. **Set up GitHub token** in Vercel
- Create Personal Access Token in GitHub
- Add as `GITHUB_TOKEN` in Vercel environment variables
- Configure git remote with token

**Pros:**
- ✅ Version controlled
- ✅ No database costs
- ✅ Simple architecture
- ✅ Audit trail (git history)

**Cons:**
- ❌ Slower (commits take time)
- ❌ Triggers redeployment
- ❌ Not suitable for high-frequency updates

---

## Solution 3: Hybrid Approach (Balanced)

Use a simple key-value store for data, keep git for images.

### Quick Setup with Vercel KV (Redis)

```bash
npm install @vercel/kv
```

```typescript
// lib/data-store.ts
import { kv } from '@vercel/kv';

export async function getProjects() {
  return await kv.get('projects') || [];
}

export async function setProjects(projects) {
  await kv.set('projects', projects);
}
```

**Pros:**
- ✅ Fast and simple
- ✅ Persistent
- ✅ No complex setup
- ✅ Vercel free tier includes KV

**Cons:**
- ❌ Locked to Vercel
- ❌ No version history
- ❌ Size limits on free tier

---

## Solution 4: Static Site with Manual Rebuild (Current - Development Only)

Keep current implementation but manually rebuild after changes.

### Workflow:
1. Make changes via admin panel locally
2. Commit changes to git
3. Push to trigger deployment
4. **Do not use admin panel in production**

**Pros:**
- ✅ No code changes needed
- ✅ Simple architecture
- ✅ No external dependencies

**Cons:**
- ❌ Admin panel unusable in production
- ❌ Manual workflow required
- ❌ Not scalable

---

## Recommended Setup

### For ArteStudio (This Project):

Given that this is a portfolio site with **infrequent updates**, I recommend:

**Option: Git-Based CMS (Solution 2)**

**Reasoning:**
- Projects don't change daily
- Version control is valuable for a portfolio
- No ongoing database costs
- Simple to maintain
- Admin can work from anywhere

### Implementation Plan:

#### Phase 1: Current Deployment (Now)
```bash
# Deploy static version
npm run build
vercel --prod

# Use admin panel in local development only
# Push changes to git manually
```

#### Phase 2: Add Git Operations (Later)
When you need production admin access:
1. Implement git operations utility
2. Add GitHub token to environment
3. Update API routes to auto-commit
4. Test thoroughly in staging

---

## Environment Variables for Production

```env
# Required
JWT_SECRET=your-very-secure-secret-here
ADMIN_EMAILS=your@email.com
NODE_ENV=production

# For Git-Based CMS (Phase 2)
GITHUB_TOKEN=your_personal_access_token
GITHUB_REPO=yourusername/your-repo-name

# For Database Option
# DATABASE_URL=your_database_connection_string

# For Vercel KV Option  
# KV_REST_API_URL=...
# KV_REST_API_TOKEN=...
```

---

## Deployment Checklist

### Before First Deploy:

- [ ] Choose persistence strategy above
- [ ] Set environment variables in hosting platform
- [ ] Test admin authentication locally
- [ ] Backup `data/projects.ts` file
- [ ] Review `SECURITY.md` checklist
- [ ] Test with production build locally (`npm run build && npm start`)

### Vercel Deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add JWT_SECRET
vercel env add ADMIN_EMAILS
```

### Environment Variables in Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add: `JWT_SECRET`, `ADMIN_EMAILS`, `NODE_ENV=production`
4. Redeploy

---

## Post-Deployment

### If Using Current File-Based System:
1. ⚠️ **Do not use admin panel in production**
2. Make changes locally in development
3. Commit and push to trigger redeploy
4. Changes persist through git

### If Upgrading to Database:
1. ✅ Admin panel fully functional in production
2. ✅ Changes persist immediately
3. ✅ Multiple editors can work simultaneously
4. ⚠️ Remember to backup database regularly

---

## Migration Scripts (Future)

When ready to migrate to database, scripts are available in `/scripts`:

```bash
# Migrate from file to database
npm run migrate:to-database

# Backup database to file
npm run backup:from-database

# Restore from backup
npm run restore:from-backup
```

*Note: These scripts need to be created based on your chosen database.*

---

## Rollback Strategy

### Current System (File-Based):
```bash
# Revert to previous version
git revert HEAD
git push origin main
# Vercel auto-deploys previous version
```

### Future System (Database):
```bash
# Backup before major changes
npm run backup:create

# Restore if needed
npm run backup:restore [backup-id]
```

---

## Performance Considerations

### Current Setup:
- Fast reads (static files)
- Slow writes (git operations, if implemented)
- Perfect for portfolio sites
- Not suitable for high-frequency updates

### Recommended Caching:
```typescript
// Add to API routes
export const revalidate = 60; // Cache for 60 seconds
```

---

## Security Notes

1. **Never commit `.env` files**
2. **Rotate JWT_SECRET regularly**
3. **Review admin email list quarterly**
4. **Monitor failed login attempts**
5. **Keep dependencies updated**

See `SECURITY.md` for comprehensive security guide.

---

## Support

For deployment issues:
- Check Vercel/Netlify logs
- Verify environment variables are set
- Test locally with production build
- Review `SECURITY.md` for auth issues

---

## Quick Start Commands

```bash
# Local development
npm run dev

# Production build (test locally)
npm run build
npm start

# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls
```

---

*Last updated: December 2024*



