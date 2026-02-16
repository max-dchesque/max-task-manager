#!/bin/bash

# Setup MAX Task Manager Local

echo "🔧 Setting up MAX Task Manager..."

# Instalar dependências
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Configurar Prisma
echo "🗄️  Setting up Prisma..."
npx prisma generate
npx prisma db push

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the app:"
echo "   npm run dev"
echo ""
echo "📝 Database URL configured:"
echo "   $DATABASE_URL"
