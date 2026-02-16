#!/bin/bash

# MAX Task Manager - Deployment Script
# Este script roda as migrations do Prisma antes de iniciar o app

echo "🔄 Running Prisma migrations..."

# Gerar Prisma Client
npx prisma generate

# Push schema para o banco (cria tabelas se não existirem)
npx prisma db push

echo "✅ Migrations completed successfully!"

# Iniciar o app
echo "🚀 Starting MAX Task Manager..."
npm start
