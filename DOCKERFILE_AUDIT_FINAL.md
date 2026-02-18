# Dockerfile - Auditoria Completa e Correções

## Histórico de Erros e Soluções

### Erro 1: EACCES - Permissão Negada
**Erro:** `EACCES: permission denied, unlink '/app/node_modules/.prisma/client/index.js'`

**Causa:** `prisma generate` no stage `deps` rodava como root, criando arquivos que depois não podiam ser modificados.

**Solução:**
- Moveu `prisma generate` para stage `builder`
- Garante que `npx --yes prisma@6` usa versão correta
- Removeu tentativa de usar `./node_modules/.bin/prisma`

### Erro 2: Conflito de Versão Prisma
**Erro:** `url is no longer supported in schema files` (Prisma 7.x vs 6.x)

**Causa:** Easypanel instalava Prisma 7.x globalmente, mas projeto usa 6.x

**Solução:**
- `npx --yes prisma@6` força versão 6.x em TODOS os comandos
- Removeu instalação global de Prisma
- Usa Prisma do node_modules local

### Erro 3: Permissão em Diretório Global
**Erro:** `Can't write to /usr/local/lib/node_modules/prisma`

**Causa:** Tentou instalar Prisma globalmente e rodar como usuário `nextjs`

**Solução:**
- Removeu instalação global (`npm install -g`)
- Usa `npx prisma@6` do node_modules local
- Usuário `nextjs` tem permissão em `/app`

### Erro 4: Path do server.js
**Erro:** `Cannot find module './max-task-manager/server.js'`

**Causa:** Next.js 16 standalone tem estrutura diferente

**Solução:**
- Next.js 16 standalone: `.next/standalone/server.js` (na raiz do standalone)
- Copia para `./server.js` no container
- Require simples: `require('./server.js')`

## Arquitetura Final

```
Stage 1 (deps): npm ci
  ↓
Stage 2 (builder):
  - Copia node_modules
  - Copia código fonte
  - prisma generate (como root)
  - npm run build
  ↓
Stage 3 (runner):
  - Copia server.js (raiz)
  - Copia node_modules
  - Copia public, prisma, .next/static
  - Chown para nextjs
  - USER nextjs
  - CMD: node docker-entrypoint.js
```

## Decisões Técnicas

### 1. Versão Prisma
- **Projeto:** Prisma 6.x (package.json)
- **Forçado em TODOS os comandos:** `npx --yes prisma@6`
- **Motivo:** Evita conflito com Prisma 7.x global do Easypanel

### 2. Estrutura Standalone Next.js 16
- **Diferença:** server.js na raiz do standalone, não em subdiretório
- **Copy direto:** `COPY --from=builder /app/.next/standalone/server.js ./server.js`
- **Resultado:** server.js em `/app/server.js`

### 3. Usuário Non-Root
- **Criado:** `nextjs` (uid 1001, gid nodejs)
- **Permissões:** `chown -R nextjs:nodejs /app` antes de `USER nextjs`
- **Segurança:** App roda sem privilégios de root

### 4. Prisma no Runtime
- **Generate:** No entrypoint (`npx --yes prisma@6 generate`)
- **Push:** No entrypoint (`npx --yes prisma@6 db push --skip-generate`)
- **Motivo:** Garante schema atualizado no startup

### 5. Build Optimization
- **Cache:** `npm ci` em stage separado (deps)
- **Layers:** Separação limpa entre stages
- **Tamanho:** Só copia o necessário para runner

## Comandos Críticos

### No Build (Stage Builder)
```dockerfile
RUN npx --yes prisma@6 generate  # ← Força versão 6.x
RUN npm run build                 # ← Next.js standalone
```

### No Runtime (Entrypoint)
```javascript
execSync('npx --yes prisma@6 generate')           // ← Garante client
execSync('npx --yes prisma@6 db push --skip-generate')  // ← Atualiza schema
require('./server.js')                             // ← Next.js
```

## Verificação de Deploy

Após deploy no Easypanel:
- [ ] Container inicia sem erros de permissão
- [ ] Prisma Client é gerado com sucesso
- [ ] Tabelas são criadas no PostgreSQL
- [ ] Next.js serve páginas corretamente
- [ ] Sidebar v2.0 aparece na UI
- [ ] App rodando como usuário nextjs (não root)

## Variáveis de Ambiente

### Build Args
- `DATABASE_URL` - Passada durante build para prisma generate

### Runtime
- `DATABASE_URL` - Conexão PostgreSQL (configurada no Easypanel)
- `NODE_ENV=production` - Automático no runner
- `PORT=3000` - Porta do app
- `HOSTNAME="0.0.0.0"` - Listen em todas as interfaces

## Referências

- Next.js Standalone: https://nextjs.org/docs/app/building-your-application/deploying#minimal-docker-image
- Prisma 6.x Docs: https://www.prisma.io/docs/orm/overview/prisma-version
- Docker Multi-Stage: https://docs.docker.com/build/building/multi-stage/
- Alpine Linux: https://www.alpinelinux.org/
