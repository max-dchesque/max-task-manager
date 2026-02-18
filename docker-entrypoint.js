#!/usr/bin/env node

/**
 * MAX Task Manager - Production Docker Entrypoint
 * Runs migrations then starts Next.js server
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 MAX Task Manager v2.0 - Starting...\n');

function runCommand(command, description) {
  console.log(`⚙️  ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', env: { ...process.env } });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

async function main() {
  const startTime = Date.now();

  try {
    // Step 1: Generate Prisma Client
    console.log('📦 Step 1/3: Prisma Client Generation');
    console.log('========================================');
    runCommand('npx --yes prisma@6 generate', 'Generating Prisma Client');

    // Step 2: Push schema to database
    console.log('💾 Step 2/3: Database Setup');
    console.log('=============================');
    runCommand('npx --yes prisma@6 db push --skip-generate', 'Pushing schema to database');

    // Step 3: Start server
    console.log('🚀 Step 3/3: Starting Server');
    console.log('=============================');

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✨ Setup completed in ${duration}s\n`);

    // Import and start server
    require('./server.js');

  } catch (error) {
    console.error('\n💀 FATAL ERROR:');
    console.error('Message:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('1. Verify DATABASE_URL environment variable');
    console.error('2. Check PostgreSQL server is running');
    console.error('3. Ensure database exists and user has permissions');
    console.error('4. Review container logs for detailed errors\n');
    process.exit(1);
  }
}

main();
