#!/usr/bin/env node

// MAX Task Manager - Docker Entrypoint (Node.js)
// Roda migrations do Prisma antes de iniciar o app

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Running Prisma migrations...');

try {
  // Gerar Prisma Client
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema para o banco
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Migrations completed!');
  console.log('🚀 Starting MAX Task Manager...');
  
  // Importar e iniciar o servidor Next.js standalone
  require('./max-task-manager/server.js');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}
