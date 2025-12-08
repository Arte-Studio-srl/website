import { Buffer } from 'buffer';

const GH_API_BASE = 'https://api.github.com';

type GithubEnv = {
  owner: string;
  repo: string;
  token: string;
  branch: string;
};

function getGithubEnv(): GithubEnv | null {
  const owner = process.env.GITHUB_CONTENT_OWNER;
  const repo = process.env.GITHUB_CONTENT_REPO;
  const token = process.env.GITHUB_CONTENT_TOKEN;
  const branch = process.env.GITHUB_CONTENT_BRANCH || 'main';

  if (!owner || !repo || !token) return null;
  return { owner, repo, token, branch };
}

export function canUseGithubContent(): boolean {
  return Boolean(getGithubEnv());
}

/**
 * Get the GitHub raw content URL for a file
 * This URL serves the file directly without API authentication
 */
export function getGithubRawUrl(path: string): string | null {
  const env = getGithubEnv();
  if (!env) return null;
  
  return `https://raw.githubusercontent.com/${env.owner}/${env.repo}/${env.branch}/${path}`;
}

export async function fetchGithubFile(path: string): Promise<{ content: string; sha: string }> {
  const env = getGithubEnv();
  if (!env) {
    throw new Error('Github env not configured');
  }

  console.log(`[GitHub] Fetching file: ${path} from ${env.owner}/${env.repo}@${env.branch}`);
  
  const url = `${GH_API_BASE}/repos/${env.owner}/${env.repo}/contents/${path}?ref=${env.branch}`;
  
  const res = await fetch(url, {
    headers: {
      Authorization: `token ${env.token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ArteStudio-Admin-Panel',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[GitHub] Fetch failed: ${res.status} ${res.statusText}`, text);
    throw new Error(`Failed to fetch GitHub content: ${res.status} ${res.statusText} - ${text}`);
  }

  const data = await res.json();
  
  if (!data.content || !data.sha) {
    throw new Error(`Invalid GitHub response: missing content or sha`);
  }
  
  const decoded = Buffer.from(data.content, data.encoding || 'base64').toString('utf-8');
  console.log(`[GitHub] Successfully fetched file (${decoded.length} chars, sha: ${data.sha.substring(0, 7)})`);
  
  return { content: decoded, sha: data.sha };
}

export async function writeGithubFile(params: {
  path: string;
  content: string;
  sha: string;
  message: string;
}): Promise<void> {
  const env = getGithubEnv();
  if (!env) {
    throw new Error('Github env not configured');
  }

  console.log(`[GitHub] Writing file: ${params.path} to ${env.owner}/${env.repo}@${env.branch}`);
  console.log(`[GitHub] Content size: ${params.content.length} chars, SHA: ${params.sha.substring(0, 7)}`);

  const body = {
    message: params.message,
    content: Buffer.from(params.content, 'utf-8').toString('base64'),
    sha: params.sha,
    branch: env.branch,
  };

  const url = `${GH_API_BASE}/repos/${env.owner}/${env.repo}/contents/${params.path}`;
  
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${env.token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ArteStudio-Admin-Panel',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[GitHub] Write failed: ${res.status} ${res.statusText}`, text);
    throw new Error(`Failed to write GitHub content: ${res.status} ${res.statusText} - ${text}`);
  }

  const responseData = await res.json();
  console.log(`[GitHub] Successfully wrote file. New SHA: ${responseData.content?.sha?.substring(0, 7) || 'unknown'}`);
}

/**
 * Upload a binary file (like an image) to GitHub
 */
export async function uploadGithubBinaryFile(params: {
  path: string;
  content: Buffer;
  message: string;
}): Promise<{ url: string; sha: string }> {
  const env = getGithubEnv();
  if (!env) {
    throw new Error('Github env not configured');
  }

  console.log(`[GitHub] Uploading binary file: ${params.path} (${params.content.length} bytes)`);

  // Check if file already exists (to get SHA for update)
  let existingSha: string | null = null;
  try {
    const existing = await fetchGithubFile(params.path);
    existingSha = existing.sha;
    console.log(`[GitHub] File exists, will update (SHA: ${existingSha.substring(0, 7)})`);
  } catch {
    console.log(`[GitHub] File doesn't exist, will create new`);
  }

  const body: { message: string; content: string; branch: string; sha?: string } = {
    message: params.message,
    content: params.content.toString('base64'),
    branch: env.branch,
  };

  if (existingSha) {
    body.sha = existingSha;
  }

  const url = `${GH_API_BASE}/repos/${env.owner}/${env.repo}/contents/${params.path}`;
  
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${env.token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ArteStudio-Admin-Panel',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[GitHub] Binary upload failed: ${res.status} ${res.statusText}`, text);
    throw new Error(`Failed to upload to GitHub: ${res.status} ${res.statusText} - ${text}`);
  }

  const responseData = await res.json();
  const sha = responseData.content?.sha || '';
  
  // Return the raw GitHub URL for immediate access
  const rawUrl = `https://raw.githubusercontent.com/${env.owner}/${env.repo}/${env.branch}/${params.path}`;
  
  console.log(`[GitHub] Binary file uploaded successfully. SHA: ${sha.substring(0, 7)}`);
  console.log(`[GitHub] Raw URL: ${rawUrl}`);

  return { url: rawUrl, sha };
}

/**
 * Delete a file from GitHub
 */
export async function deleteGithubFile(params: {
  path: string;
  message: string;
}): Promise<void> {
  const env = getGithubEnv();
  if (!env) {
    throw new Error('Github env not configured');
  }

  console.log(`[GitHub] Deleting file: ${params.path}`);

  // Get the file's SHA (required for deletion)
  let sha: string;
  try {
    const existing = await fetchGithubFile(params.path);
    sha = existing.sha;
  } catch {
    console.log(`[GitHub] File doesn't exist, nothing to delete`);
    return; // File doesn't exist, consider it deleted
  }

  const body = {
    message: params.message,
    sha,
    branch: env.branch,
  };

  const url = `${GH_API_BASE}/repos/${env.owner}/${env.repo}/contents/${params.path}`;
  
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `token ${env.token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ArteStudio-Admin-Panel',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[GitHub] Delete failed: ${res.status} ${res.statusText}`, text);
    throw new Error(`Failed to delete from GitHub: ${res.status} ${res.statusText} - ${text}`);
  }

  console.log(`[GitHub] File deleted successfully`);
}



