#!/usr/bin/env node

/**
 * Test script for GitHub integration
 * Tests if GitHub API credentials are working correctly
 */

const https = require('https');

// Get environment variables
const owner = process.env.GITHUB_CONTENT_OWNER;
const repo = process.env.GITHUB_CONTENT_REPO;
const token = process.env.GITHUB_CONTENT_TOKEN;
const branch = process.env.GITHUB_CONTENT_BRANCH || 'main';
const filePath = 'data/projects.ts';

console.log('\n🔍 Testing GitHub Integration\n');
console.log('Configuration:');
console.log(`  Owner:  ${owner || '❌ NOT SET'}`);
console.log(`  Repo:   ${repo || '❌ NOT SET'}`);
console.log(`  Branch: ${branch}`);
console.log(`  Token:  ${token ? '✅ SET (' + token.substring(0, 7) + '...)' : '❌ NOT SET'}`);
console.log(`  File:   ${filePath}`);

if (!owner || !repo || !token) {
  console.error('\n❌ ERROR: Missing required environment variables');
  console.error('\nPlease set the following in your .env or .env.local file:');
  console.error('  GITHUB_CONTENT_OWNER=your-github-username-or-org');
  console.error('  GITHUB_CONTENT_REPO=your-repo-name');
  console.error('  GITHUB_CONTENT_BRANCH=main (or your branch name)');
  console.error('  GITHUB_CONTENT_TOKEN=ghp_xxxxx (token with repo scope)');
  console.error('\nToken creation: https://github.com/settings/tokens/new');
  console.error('Required scope: repo (Full control of private repositories)');
  process.exit(1);
}

console.log('\n📡 Testing API connectivity...\n');

// Test 1: Check if we can reach GitHub API
const testUrl = `/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

const options = {
  hostname: 'api.github.com',
  path: testUrl,
  method: 'GET',
  headers: {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'ArteStudio-Test-Script',
  }
};

const req = https.request(options, (res) => {
  let data = '';

  console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
  console.log(`Headers:`, {
    'x-ratelimit-limit': res.headers['x-ratelimit-limit'],
    'x-ratelimit-remaining': res.headers['x-ratelimit-remaining'],
    'x-ratelimit-reset': res.headers['x-ratelimit-reset'],
  });

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('');
    
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(data);
        console.log('✅ SUCCESS! File found on GitHub');
        console.log(`  SHA: ${json.sha?.substring(0, 7)}...`);
        console.log(`  Size: ${json.size} bytes`);
        console.log(`  Encoding: ${json.encoding}`);
        
        // Decode and show preview
        const content = Buffer.from(json.content, json.encoding || 'base64').toString('utf-8');
        console.log(`  Content preview (first 200 chars):\n    ${content.substring(0, 200).replace(/\n/g, '\n    ')}...\n`);
        
        console.log('✅ GitHub integration is working correctly!');
        console.log('\nNext steps:');
        console.log('  1. Make changes in the admin dashboard');
        console.log('  2. Check the console logs for [GitHub] messages');
        console.log('  3. Verify commits in your GitHub repository');
        console.log(`  4. View commits: https://github.com/${owner}/${repo}/commits/${branch}`);
        
      } catch (error) {
        console.error('❌ ERROR: Failed to parse JSON response');
        console.error(data);
      }
    } else if (res.statusCode === 401) {
      console.error('❌ AUTHENTICATION FAILED');
      console.error('\nPossible issues:');
      console.error('  1. Invalid or expired token');
      console.error('  2. Token doesn\'t have "repo" scope');
      console.error('  3. Token revoked');
      console.error('\nCreate a new token at: https://github.com/settings/tokens/new');
      console.error('Required scope: repo (Full control of private repositories)');
      if (data) {
        try {
          const json = JSON.parse(data);
          console.error(`\nGitHub says: ${json.message}`);
        } catch (e) {
          console.error('\nResponse:', data);
        }
      }
    } else if (res.statusCode === 404) {
      console.error('❌ FILE OR REPOSITORY NOT FOUND');
      console.error('\nPossible issues:');
      console.error(`  1. Repository ${owner}/${repo} doesn't exist or you don't have access`);
      console.error(`  2. File ${filePath} doesn't exist in the repository`);
      console.error(`  3. Branch "${branch}" doesn't exist`);
      console.error(`  4. Token doesn't have access to this repository`);
      console.error(`\nCheck: https://github.com/${owner}/${repo}/blob/${branch}/${filePath}`);
      if (data) {
        try {
          const json = JSON.parse(data);
          console.error(`\nGitHub says: ${json.message}`);
        } catch (e) {
          console.error('\nResponse:', data);
        }
      }
    } else {
      console.error(`❌ UNEXPECTED STATUS CODE: ${res.statusCode}`);
      console.error('\nResponse:', data);
      try {
        const json = JSON.parse(data);
        if (json.message) {
          console.error(`\nGitHub says: ${json.message}`);
        }
      } catch (e) {
        // Not JSON
      }
    }
  });
});

req.on('error', (error) => {
  console.error('❌ REQUEST FAILED');
  console.error(error);
  console.error('\nPossible issues:');
  console.error('  1. No internet connection');
  console.error('  2. GitHub API is down');
  console.error('  3. Network/firewall blocking HTTPS requests');
});

req.end();

