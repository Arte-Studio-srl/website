# GitHub Integration Guide

This guide explains how to set up GitHub integration so that admin dashboard changes are automatically committed to your GitHub repository.

## Overview

The admin dashboard can write changes directly to your GitHub repository, allowing you to:
- ✅ Edit projects and categories from the admin panel
- ✅ Automatically commit changes to GitHub
- ✅ Keep your code in version control
- ✅ Deploy automatically via CI/CD (e.g., Vercel, Netlify)

## Prerequisites

1. A GitHub account
2. A GitHub repository containing your project
3. A GitHub Personal Access Token with `repo` scope

## Step 1: Create a GitHub Personal Access Token

1. Go to [GitHub Settings → Tokens → Personal access tokens (classic)](https://github.com/settings/tokens/new)
2. Click "Generate new token (classic)"
3. Give it a descriptive name: `ArteStudio Admin Panel`
4. Select the following scope:
   - ✅ **repo** (Full control of private repositories)
     - This includes `repo:status`, `repo_deployment`, `public_repo`, etc.
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately! You won't be able to see it again.
   - It should look like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Configure Environment Variables

Add the following variables to your `.env` or `.env.local` file:

```env
# GitHub Content Storage
GITHUB_CONTENT_OWNER=your-github-username-or-org
GITHUB_CONTENT_REPO=your-repo-name
GITHUB_CONTENT_BRANCH=main
GITHUB_CONTENT_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Example

If your repository URL is: `https://github.com/ArteStudio/website`

```env
GITHUB_CONTENT_OWNER=ArteStudio
GITHUB_CONTENT_REPO=website
GITHUB_CONTENT_BRANCH=main
GITHUB_CONTENT_TOKEN=ghp_1234567890abcdefghijklmnopqrstuv
```

## Step 3: Test the Integration

Run the test script to verify your configuration:

```bash
node scripts/test-github-integration.js
```

The script will:
- ✅ Check if all environment variables are set
- ✅ Test GitHub API connectivity
- ✅ Verify authentication
- ✅ Confirm the file exists and is accessible
- ✅ Show rate limit information

### Expected Output

```
🔍 Testing GitHub Integration

Configuration:
  Owner:  ArteStudio
  Repo:   website
  Branch: main
  Token:  ✅ SET (ghp_123...)
  File:   data/projects.ts

📡 Testing API connectivity...

Status: 200 OK
Headers: { x-ratelimit-limit: '5000', x-ratelimit-remaining: '4999', ... }

✅ SUCCESS! File found on GitHub
  SHA: abc1234...
  Size: 12345 bytes
  Encoding: base64
  Content preview: import { Project, Category } from '@/types';...

✅ GitHub integration is working correctly!
```

## Step 4: Restart Your Development Server

After configuring the environment variables, restart your Next.js server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Step 5: Test in Admin Dashboard

1. Navigate to `/admin` and log in
2. Make a change to a project or category
3. Check your server console for `[GitHub]` log messages:
   ```
   [GitHub] Fetching file: data/projects.ts from ArteStudio/website@main
   [GitHub] Successfully fetched file (12345 chars, sha: abc1234)
   [GitHub] Writing file: data/projects.ts to ArteStudio/website@main
   [GitHub] Successfully wrote file. New SHA: def5678
   ```
4. Check your GitHub repository for the new commit:
   - Go to `https://github.com/YOUR-OWNER/YOUR-REPO/commits/main`
   - You should see a commit with message: `chore: update projects via admin dashboard`

## How It Works

When you make changes in the admin dashboard:

1. The API endpoint calls `updateProjects()` or `updateCategories()`
2. The function checks if GitHub integration is enabled (`canUseGithubContent()`)
3. If enabled:
   - Fetches the current file from GitHub (gets current SHA)
   - Updates the content with your changes
   - Commits the new content back to GitHub with the SHA
4. If GitHub fails or isn't configured:
   - Falls back to updating the local file system
   - Shows error in console: `GitHub content update failed, falling back to local file.`

## Troubleshooting

### ❌ "GitHub env not configured"

**Cause**: Environment variables are missing or incorrect.

**Solution**:
1. Check that all 4 variables are set in `.env` or `.env.local`
2. Restart your development server
3. Run the test script: `node scripts/test-github-integration.js`

### ❌ "Failed to fetch GitHub content: 401"

**Cause**: Authentication failed - invalid or expired token.

**Solution**:
1. Verify your token hasn't expired
2. Check the token has `repo` scope
3. Generate a new token: https://github.com/settings/tokens/new
4. Update `GITHUB_CONTENT_TOKEN` in `.env`
5. Restart your server

### ❌ "Failed to fetch GitHub content: 404"

**Cause**: Repository, file, or branch not found.

**Solution**:
1. Verify the repository exists and you have access
2. Check the file `data/projects.ts` exists in your repo
3. Verify the branch name is correct (usually `main` or `master`)
4. Check URL manually: `https://github.com/OWNER/REPO/blob/BRANCH/data/projects.ts`

### ❌ "GitHub content update failed, falling back to local file"

**Cause**: GitHub API call failed but the local fallback succeeded.

**Solution**:
1. Check the console for detailed error messages
2. Run the test script to diagnose: `node scripts/test-github-integration.js`
3. Verify rate limits haven't been exceeded
4. Check GitHub status: https://www.githubstatus.com/

### ❌ Changes committed to GitHub but not reflected in deployed site

**Cause**: Your deployment platform hasn't rebuilt/redeployed.

**Solution**:
1. If using Vercel/Netlify, check if auto-deploy is enabled
2. Manually trigger a deployment
3. Check deployment logs for errors
4. Verify the branch being deployed matches `GITHUB_CONTENT_BRANCH`

### ❌ "Invalid GitHub response: missing content or sha"

**Cause**: GitHub API returned unexpected data.

**Solution**:
1. Verify you're accessing a file, not a directory
2. Check if the file is too large (>1MB might have issues)
3. Try manually accessing the GitHub API with curl:
   ```bash
   curl -H "Authorization: token YOUR_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "https://api.github.com/repos/OWNER/REPO/contents/data/projects.ts"
   ```

## Rate Limits

GitHub API has rate limits:
- **Authenticated requests**: 5,000 per hour
- **Unauthenticated**: 60 per hour

The admin dashboard uses authenticated requests. Each update performs 2 API calls:
1. GET (fetch current file)
2. PUT (write updated file)

**Daily limit**: ~2,500 updates per hour = plenty for normal use

Check your rate limit status:
```bash
curl -H "Authorization: token YOUR_TOKEN" \
     https://api.github.com/rate_limit
```

## Security Best Practices

1. **Never commit your token**: Keep it in `.env` or `.env.local` (these are gitignored)
2. **Use Classic tokens**: Fine-grained tokens may have issues with some API features
3. **Minimal scope**: Only grant `repo` scope, nothing more
4. **Token rotation**: Regenerate tokens periodically (every 6-12 months)
5. **Revoke if compromised**: Immediately revoke at https://github.com/settings/tokens
6. **Environment-specific tokens**: Use different tokens for dev/staging/production

## Production Deployment

### Vercel

Add environment variables in Project Settings:

1. Go to Project Settings → Environment Variables
2. Add all four `GITHUB_CONTENT_*` variables
3. Select which environments (Production, Preview, Development)
4. Redeploy your project

### Other Platforms

Add the environment variables in your platform's configuration:
- Netlify: Site Settings → Environment Variables
- Railway: Project → Variables
- AWS Amplify: App Settings → Environment Variables

## Alternative: Local-Only Mode

If you don't want to use GitHub integration, simply don't set the environment variables. The system will:
- ✅ Still work in development (edits local files)
- ❌ Won't work in production (filesystem is read-only on most platforms)

For production without GitHub, consider:
- Using a database (PostgreSQL, MongoDB)
- Using a CMS (Sanity, Contentful, Strapi)
- Manual deployments (edit files, commit, push, deploy)

## Monitoring

### Console Logs

All GitHub operations log to the console with `[GitHub]` prefix:

```
[GitHub] Fetching file: data/projects.ts from ArteStudio/website@main
[GitHub] Successfully fetched file (15234 chars, sha: abc1234)
[GitHub] Writing file: data/projects.ts to ArteStudio/website@main
[GitHub] Content size: 15456 chars, SHA: abc1234
[GitHub] Successfully wrote file. New SHA: def5678
```

### GitHub Audit

Check recent commits:
```
https://github.com/YOUR-OWNER/YOUR-REPO/commits/main
```

Look for commits with message: `chore: update projects via admin dashboard` or `chore: update categories via admin dashboard`

## FAQ

### Q: Can I use a different branch?
**A**: Yes! Set `GITHUB_CONTENT_BRANCH` to your branch name. Make sure it exists in your repo.

### Q: Will this work with private repositories?
**A**: Yes! The `repo` scope grants access to both public and private repos.

### Q: Can multiple admins use the same token?
**A**: Yes, but consider creating separate tokens per person for better audit trails and easier revocation.

### Q: What happens if two admins edit simultaneously?
**A**: The second save will fail with a SHA mismatch error. The admin will need to refresh and try again. This is a safety feature to prevent overwriting changes.

### Q: Can I edit other files besides projects.ts?
**A**: Currently only `data/projects.ts` is supported. To add more files, modify `lib/github-content.ts` and `lib/data-utils.ts`.

### Q: Does this work with GitHub Enterprise?
**A**: Yes, but you'll need to modify `GH_API_BASE` in `lib/github-content.ts` to point to your enterprise instance.

## Support

If you encounter issues:

1. Run the test script: `node scripts/test-github-integration.js`
2. Check console logs for `[GitHub]` messages
3. Verify environment variables are set correctly
4. Check GitHub status: https://www.githubstatus.com/
5. Review this guide's troubleshooting section

## Related Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment strategies
- [AUTHENTICATION.md](./AUTHENTICATION.md) - Admin authentication setup
- [SECURITY.md](./SECURITY.md) - Security best practices

