#!/usr/bin/env node

/**
 * MAX Task Manager - Docker Entrypoint
 *
 * This script runs before the Next.js server starts:
 * 1. Pushes schema to database (creates tables if needed)
 * 2. Starts the Next.js server
 *
 * Note: Prisma Client is already generated during build
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔧 MAX Task Manager - Docker Entrypoint');
console.log('==========================================\n');

// Helper function to run commands with error handling
function runCommand(command, description) {
  console.log(`⚙️  ${description}...`);
  try {
    const output = execSync(command, {
      stdio: 'inherit',
      env: { ...process.env }
    });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    console.error('Exit code:', error.status);
    return false;
  }
}

// Main startup sequence
async function main() {
  const startTime = Date.now();

  try {
    // Step 1: Push schema to database (Prisma Client already generated)
    console.log('💾 Database Schema Setup');
    console.log('-------------------------');
    if (!runCommand('npx --yes prisma@6 db push --skip-generate', 'Pushing schema to database')) {
      throw new Error('Prisma db push failed');
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\n✨ Setup completed in ${duration}s`);
    console.log('🚀 Starting MAX Task Manager...\n');

    // Step 2: Start Next.js server
    require('./server.js');

  } catch (error) {
    console.error('\n💀 FATAL ERROR during startup:');
    console.error('Message:', error.message);
    console.error('\n📋 Troubleshooting:');
    console.error('1. Check DATABASE_URL environment variable');
    console.error('2. Verify PostgreSQL server is running');
    console.error('3. Ensure database user has necessary permissions');
    console.error('4. Check container logs for detailed error messages\n');
    process.exit(1);
  }
}

// Run the startup sequence
main();
