#!/usr/bin/env node

/**
 * MongoDB Connection Helper
 * Run this script after creating your MongoDB Atlas cluster to easily configure your app
 * 
 * Usage: node mongodb-helper.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function question(prompt) {
  return new Promise(resolve => {
    rl.question(colors.cyan + prompt + colors.reset, answer => {
      resolve(answer);
    });
  });
}

async function main() {
  log('\n🚀 MongoDB Atlas Connection Setup', 'bright');
  log('==================================\n', 'bright');

  // Welcome
  log('This helper will guide you through configuring MongoDB Atlas', 'cyan');
  log('Make sure you have already created a cluster at: https://www.mongodb.com/cloud/atlas\n', 'yellow');

  const ready = await question('Ready to continue? (y/n): ');
  if (ready.toLowerCase() !== 'y') {
    log('Cancelled setup.', 'yellow');
    rl.close();
    return;
  }

  // Collect information
  log('\n📋 Enter your MongoDB Atlas Details:\n', 'bright');

  const username = await question('Database Username (e.g., travel_admin): ');
  const password = await question('Database Password: ');
  const clusterName = await question('Cluster Name (e.g., my-cluster): ');
  const region = await question('Cluster Region (e.g., us-east-1): ');
  const dbName = await question('Database Name (default: travel-app): ') || 'travel-app';

  // Build connection string
  const connectionString = `mongodb+srv://${username}:${password}@${clusterName}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  // Verify
  log('\n✓ Generated Connection String:', 'green');
  log(connectionString.substring(0, 50) + '...', 'cyan');

  // Ask for update
  const confirm = await question('\nUpdate .env.local with this connection string? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    log('Skipped .env.local update. You can add it manually.', 'yellow');
    rl.close();
    return;
  }

  // Update .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local not found!', 'red');
    rl.close();
    return;
  }

  let envContent = fs.readFileSync(envPath, 'utf8');

  // Replace the MongoDB URL
  if (envContent.includes('DATABASE_URL=')) {
    envContent = envContent.replace(
      /DATABASE_URL="[^"]*"/,
      `DATABASE_URL="${connectionString}"`
    );
  } else {
    envContent = `DATABASE_URL="${connectionString}"\n\n${envContent}`;
  }

  fs.writeFileSync(envPath, envContent);
  log('✅ .env.local updated successfully!', 'green');

  // Next steps
  log('\n📋 Next Steps:\n', 'bright');
  log('1. Verify network access in MongoDB Atlas:', 'cyan');
  log('   - Go to Network Access\n   - Click "Add IP Address"', 'cyan');
  log('   - Select "Allow Access from Anywhere"\n', 'cyan');

  log('2. Initialize database collections:', 'cyan');
  log('   npx prisma db push\n', 'yellow');

  log('3. Start your development server:', 'cyan');
  log('   npm run dev\n', 'yellow');

  log('4. Test the connection:', 'cyan');
  log('   Visit: http://localhost:3001/api/health\n', 'yellow');

  log('5. Create a test account and verify data persists!', 'cyan');

  log('\n✨ You\'re all set! MongoDB is ready.', 'green');
  log('📚 For more details, check: MONGODB-DEPLOYMENT.md\n', 'cyan');

  rl.close();
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  rl.close();
  process.exit(1);
});
