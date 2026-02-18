# MAX Task Manager - Dockerfile Production
# Next.js 16 (standalone) + Prisma 6.x + PostgreSQL
# Multi-stage build: deps → builder → runner
# Auditado por Claude Code CLI

# =============================================================================
# Versão base fixada para builds reproduzíveis
# =============================================================================
ARG NODE_VERSION=20.18-alpine3.21

# =============================================================================
# Stage 1: deps — instala dependências com cache isolado
# =============================================================================
FROM node:${NODE_VERSION} AS deps

# openssl: necessário para Prisma gerar o client em Alpine
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package.json package-lock.json ./

# Instala todas as dependências (dev + prod) necessárias para o build
RUN npm ci --legacy-peer-deps

# =============================================================================
# Stage 2: builder — compila Next.js e gera Prisma Client
# =============================================================================
FROM node:${NODE_VERSION} AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Recebe node_modules já instalados
COPY --from=deps /app/node_modules ./node_modules

# Copia código fonte completo
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Gera Prisma Client usando o binário local (não npx, sem download)
# DATABASE_URL não é necessário para "generate" — só o schema.prisma é lido
RUN node_modules/.bin/prisma generate

# Build Next.js com output standalone
# DATABASE_URL não deve ser passado como ARG de build — é segredo de runtime
RUN npm run build

# =============================================================================
# Stage 3: runner — imagem de produção mínima
# =============================================================================
FROM node:${NODE_VERSION} AS runner

# openssl + libssl: necessários para o Prisma Client funcionar em runtime
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cria usuário non-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copia toda a estrutura standalone de uma vez (inclui server.js, .next/, node_modules/, package.json)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Adiciona arquivos estáticos públicos (não incluídos no standalone)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Adiciona os assets estáticos gerados (.next/static — CSS, JS, fontes)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copia schema do Prisma e o Prisma Client gerado para uso em runtime
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Copia o entrypoint (roda migrações e inicia o servidor)
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.js ./docker-entrypoint.js

USER nextjs

EXPOSE 3000

# DATABASE_URL e outros segredos são fornecidos em runtime via variáveis de ambiente
CMD ["node", "docker-entrypoint.js"]
