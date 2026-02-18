#!/bin/bash
# PRE-COMMIT HOOK - MAX Task Manager
# Uso: ./scripts/pre-commit.sh "mensagem do commit"

set -e  # Para se algum comando falhar

echo "🔍 PRE-COMMIT CHECKLIST"
echo "================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para printar erro
error() {
    echo -e "${RED}❌ ERRO: $1${NC}"
    exit 1
}

# Função para printar sucesso
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Função para printar warning
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar se há mensagem de commit
if [ -z "$1" ]; then
    error "Por favor, forneça uma mensagem de commit: ./scripts/pre-commit.sh 'sua mensagem'"
fi

# 1. Verificar se package.json mudou
if git diff --name-only --cached | grep -q "package.json"; then
    echo "📦 package.json mudou, verificando package-lock.json..."

    if git diff --name-only --cached | grep -q "package-lock.json"; then
        success "package-lock.json também está no commit"
    else
        error "package.json mudou mas package-lock.json não! Rode: npm install --legacy-peer-deps"
    fi

    # Verificar se estão sincronizados
    echo "🔄 Verificando sincronia..."
    if grep -q "tailwindcss-animate" package.json && ! grep -q "tailwindcss-animate" package-lock.json; then
        error "package.json e package-lock.json DESINCIALIZADOS! Rode: npm install --legacy-peer-deps"
    fi

    success "package.json e package-lock.json sincronizados"
fi

# 2. Verificar se schema.prisma mudou
if git diff --name-only --cached | grep -q "prisma/schema.prisma"; then
    echo "🗄️  Schema Prisma mudou, rodando prisma generate..."
    npx prisma generate || error "prisma generate falhou!"
    success "Prisma Client regenerado"
fi

# 3. Rodar build para verificar
echo "🔨 Rodando build para verificar..."
npm run build || error "BUILD FALHOU! Corrija os erros antes de commitar."
success "Build passou"

# 4. Mostrar arquivos que vão ser commitados
echo ""
echo "📋 Arquivos que serão commitados:"
echo "================================"
git diff --cached --stat
echo ""

# 5. Pedir confirmação
read -p "✅ Tudo parece correto. Deseja continuar com o commit? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    warning "Commit cancelado pelo usuário"
    exit 1
fi

# 6. Adicionar todos os arquivos
git add -A

# 7. Fazer commit
echo ""
echo "📝 Fazendo commit..."
git commit -m "$1"

# 8. Push
echo "🚀 Fazendo push..."
git push origin master

echo ""
success "✨ COMMIT E PUSH REALIZADOS COM SUCESSO!"
echo ""
echo "📋 PRÓXIMO PASSO:"
echo "   → Vá ao Easypanel e clique em Rebuild"
echo ""
