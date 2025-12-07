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

export async function fetchGithubFile(path: string): Promise<{ content: string; sha: string }> {
  const env = getGithubEnv();
  if (!env) {
    throw new Error('Github env not configured');
  }

  const res = await fetch(
    `${GH_API_BASE}/repos/${env.owner}/${env.repo}/contents/${encodeURIComponent(path)}?ref=${env.branch}`,
    {
      headers: {
        Authorization: `Bearer ${env.token}`,
        Accept: 'application/vnd.github+json',
      },
      next: { revalidate: 0 },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch GitHub content: ${res.status} ${text}`);
  }

  const data = await res.json();
  const decoded = Buffer.from(data.content, data.encoding || 'base64').toString('utf-8');
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

  const body = {
    message: params.message,
    content: Buffer.from(params.content, 'utf-8').toString('base64'),
    sha: params.sha,
    branch: env.branch,
  };

  const res = await fetch(
    `${GH_API_BASE}/repos/${env.owner}/${env.repo}/contents/${encodeURIComponent(params.path)}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${env.token}`,
        Accept: 'application/vnd.github+json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to write GitHub content: ${res.status} ${text}`);
  }
}

