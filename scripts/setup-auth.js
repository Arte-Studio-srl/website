const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('\n🔐 ArteStudio Admin Authentication Setup\n');
console.log('========================================\n');

// Generate JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('✅ Generated JWT Secret');

// Get email from command line or use default
const email = process.argv[2] || 'admin@example.com';
console.log(`📧 Admin Email: ${email}\n`);

// Create .env.local content
const envContent = `# Admin Authentication
# Comma-separated list of allowed admin emails
ADMIN_EMAILS=${email}

# Secret key for JWT token signing
JWT_SECRET=${jwtSecret}
`;

// Path to .env.local
const envPath = path.join(process.cwd(), '.env.local');

// Check if file exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('\nYour generated configuration:\n');
  console.log(envContent);
  console.log('\n💡 To use this configuration:');
  console.log('1. Back up your existing .env.local');
  console.log('2. Delete or rename it');
  console.log('3. Run this script again\n');
} else {
  // Write .env.local
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file\n');
  console.log('📝 Configuration:');
  console.log(`   Admin Email: ${email}`);
  console.log(`   JWT Secret: ${jwtSecret.substring(0, 16)}...\n`);
  console.log('🎉 Setup complete!\n');
  console.log('Next steps:');
  console.log('1. Restart your dev server (npm run dev)');
  console.log('2. Visit http://localhost:3000/admin/login');
  console.log('3. Check your terminal for verification codes\n');
}

console.log('========================================\n');

