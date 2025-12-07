#!/usr/bin/env node

/**
 * Admin Panel Test Script
 * 
 * This script helps verify that the admin panel is working correctly
 * by testing the API endpoints and checking the setup.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const TESTS = [];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function checkFileExists(filepath, description) {
  const fullPath = path.join(__dirname, '..', filepath);
  const exists = fs.existsSync(fullPath);
  TESTS.push({
    name: description,
    passed: exists,
    message: exists ? `✓ ${filepath}` : `✗ Missing: ${filepath}`
  });
}

function testEndpoint(endpoint, method = 'GET') {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
      method,
      timeout: 5000
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const passed = res.statusCode === 200;
        TESTS.push({
          name: `${method} ${endpoint}`,
          passed,
          message: passed 
            ? `✓ Status ${res.statusCode}` 
            : `✗ Status ${res.statusCode}`
        });
        resolve();
      });
    });

    req.on('error', (error) => {
      TESTS.push({
        name: `${method} ${endpoint}`,
        passed: false,
        message: `✗ Error: ${error.message}`
      });
      resolve();
    });

    req.on('timeout', () => {
      req.destroy();
      TESTS.push({
        name: `${method} ${endpoint}`,
        passed: false,
        message: '✗ Timeout'
      });
      resolve();
    });

    req.end();
  });
}

async function runTests() {
  log('\n🔍 ArteStudio Admin Panel Test Suite\n', 'cyan');

  // File structure tests
  log('📁 Checking File Structure...', 'blue');
  checkFileExists('app/admin/page.tsx', 'Admin Dashboard Page');
  checkFileExists('app/admin/projects/page.tsx', 'Projects List Page');
  checkFileExists('app/admin/projects/new/page.tsx', 'New Project Page');
  checkFileExists('app/admin/categories/page.tsx', 'Categories Page');
  checkFileExists('app/admin/images/page.tsx', 'Images Page');
  checkFileExists('app/api/projects/route.ts', 'Projects API Route');
  checkFileExists('app/api/categories/route.ts', 'Categories API Route');
  checkFileExists('app/api/upload/route.ts', 'Upload API Route');
  checkFileExists('data/projects.ts', 'Projects Data File');
  checkFileExists('public/images/projects', 'Images Directory');

  log('\n🌐 Testing Server Connectivity...', 'blue');
  log('Make sure your dev server is running (npm run dev)\n', 'yellow');

  // API endpoint tests
  await testEndpoint('/admin');
  await testEndpoint('/admin/projects');
  await testEndpoint('/admin/categories');
  await testEndpoint('/api/projects');
  await testEndpoint('/api/categories');

  // Print results
  log('\n📊 Test Results:\n', 'cyan');
  
  let passed = 0;
  let failed = 0;

  TESTS.forEach(test => {
    if (test.passed) {
      log(`  ${test.message}`, 'green');
      passed++;
    } else {
      log(`  ${test.message}`, 'red');
      failed++;
    }
  });

  log(`\n${'='.repeat(50)}`, 'cyan');
  log(`Total: ${TESTS.length} | Passed: ${passed} | Failed: ${failed}`, 
      failed === 0 ? 'green' : 'yellow');
  log('='.repeat(50) + '\n', 'cyan');

  if (failed === 0) {
    log('✨ All tests passed! Your admin panel is ready to use.', 'green');
    log(`\nAccess it at: ${BASE_URL}/admin/\n`, 'cyan');
  } else {
    log('⚠️  Some tests failed. Please check the errors above.', 'yellow');
    if (failed > 5) {
      log('\nℹ️  If API tests failed, make sure the dev server is running:', 'blue');
      log('   npm run dev\n', 'cyan');
    }
  }
}

// Check if server is running first
log('Checking if development server is running...', 'yellow');

const checkServer = http.request(`${BASE_URL}/`, { method: 'HEAD', timeout: 2000 }, (res) => {
  log('✓ Server is running\n', 'green');
  runTests();
});

checkServer.on('error', () => {
  log('✗ Server is not running', 'red');
  log('\nPlease start the development server first:', 'yellow');
  log('  npm run dev\n', 'cyan');
  log('Then run this test script again.\n', 'yellow');
  process.exit(1);
});

checkServer.on('timeout', () => {
  checkServer.destroy();
  log('✗ Server timeout', 'red');
  log('\nPlease make sure the development server is running:', 'yellow');
  log('  npm run dev\n', 'cyan');
  process.exit(1);
});

checkServer.end();

