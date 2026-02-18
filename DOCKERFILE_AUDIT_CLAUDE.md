# Auditoria Dockerfile - Claude Code CLI

## Data: 2025-02-18
## Ferramenta: Claude Code CLI (OAuth Token)
## Status: ✅ Completo

---

## Problemas Identificados

### 1. Segurança: OpenSSL ausente no runner
**Problema:** `openssl` só estava no stage `deps`, não no `runner`
**Impacto:** Prisma Client não funciona em runtime (erro de SSL)
**Correção:** Adicionado `openssl` em todos os três stages

### 2. Segurança: DATABASE_URL vaza na imagem
**Problema:** `DATABASE_URL` passada como ARG/ENV no build
**Impacto:** Segredo exposto na camada do Docker
**Correção:** Removido completamente do build; só existe em runtime

### 3. Performance: npx baixa pacotes toda vez
**Problema:** `npx prisma@6 generate` download não determinístico
**Impacto:** Quebra cache de layers, build mais lento
**Correção:** Substituído por `node_modules/.bin/prisma generate`

### 4. Correção: Cópia standalone fragmentada
**Problema:** Copiar arquivos individualmente (server.js, .next, node_modules)
**Impacto:** Paths incorretos, erros de "build not found"
**Correção:** `COPY /app/.next/standalone ./` copia tudo de uma vez

### 5. Permissões: chmod desnecessário
**Problema:** `chmod +x` em arquivos .js
**Impacto:** Commando desnecessário
**Correção:** Usar `--chown=nextjs:nodejs` no COPY

### 6. Performance: prisma generate no runtime
**Problema:** `npx prisma@6 generate` no entrypoint
**Impacto:** Startup mais lento, download em runtime
**Correção:** Geração é feita só no build; runtime só roda migrate

### 7. Segurança: db push em produção
**Problema:** `prisma db push` no entrypoint
**Impacto:** Perigoso, pode perder dados (sem migrations rastreadas)
**Correção:** Substituir por `migrate deploy` (aplica migrations)

### 8. Reprodutibilidade: Node sem versão fixa
**Problema:** `node:20-alpine` usa latest da tag
**Impacto:** Builds não reproduzíveis
**Correção:** Fixado em `20.18-alpine3.21` via ARG

### 9. Correção: Prisma Client não copiado
**Problema:** Prisma Client gerado mas não copiado para runner
**Impacto:** Erro "Cannot find module @prisma/client"
**Correção:** Copiar `node_modules/.prisma` e `@prisma` explicitamente

---

## Dockerfile Novo vs Antigo

### Estrutura
- **Antes:** 3 stages mas com fragmentação na cópia
- **Depois:** 3 stages com cópia atômica do standalone

### Build Args
- **Antes:** `ARG DATABASE_URL` (vaza segredo)
- **Depois:** Sem build args sensíveis

### Prisma
- **Antes:** `npx prisma@6 generate` (download, cache quebrado)
- **Depois:** `node_modules/.bin/prisma generate` (local, cache ok)

### Runtime
- **Antes:** `npx prisma@6 generate` + `db push` (lento + perigoso)
- **Depois:** `migrate deploy` (seguro, versionado)

### Permissões
- **Antes:** `chmod +x` + `chown -R`
- **Depois:** `--chown` no COPY (mais eficiente)

---

## Teste de Deploy

1. Commitar mudanças
2. Push para GitHub
3. Rebuild no Easypanel
4. Verificar logs para confirmar:
   - [ ] Build completo sem erros
   - [ ] `migrate deploy` aplica schema
   - [ ] Server inicia na porta 3000
   - [ ] App responde HTTP

---

## Referências

- Next.js Standalone: https://nextjs.org/docs/app/building-your-application/deploying#minimal-docker-image
- Prisma Migrate Deploy: https://www.prisma.io/docs/reference/api-reference/command-reference#migrate-deploy
- Docker Multi-Stage: https://docs.docker.com/build/building/multi-stage/
- Alpine OpenSSL: https://wiki.alpinelinux.org/wiki/OpenSSL
