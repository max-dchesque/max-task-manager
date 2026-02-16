# MAX Task Manager

Sistema de gerenciamento de tarefas para MAX e agentes (Ine, Satoshi, Dev).

## 🚀 Deploy no Easypanel

### Passo 1: Criar Banco de Dados PostgreSQL

1. No Easypanel, crie um serviço **PostgreSQL**
2. Anote a string de conexão:
   ```
   postgresql://usuario:senha@host:porta/database
   ```

### Passo 2: Criar Aplicação

1. Crie um serviço **Git Repository**
2. Configure:
   - **Repository:** `https://github.com/max-dchesque/max-task-manager`
   - **Branch:** `master`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Port:** `3000`

3. **Environment Variables:**
   ```bash
   DATABASE_URL=postgresql://usuario:senha@host:porta/database?sslmode=disable
   ```

4. Clique em **Deploy**

O app vai automaticamente:
- Gerar o Prisma Client
- Criar as tabelas no banco
- Iniciar na porta 3000

---

## 🤖 Integração com Agents

### Opção 1: CLI Tool (Recomendado)

```bash
node scripts/task-cli.js "Título da task" \
  --priority alta \
  --agent Ine \
  --metric "Estoque sincronizado"
```

### Opção 2: API REST

```bash
curl -X POST https://seu-dominio.com/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Atualizar estoque",
    "priority": "alta",
    "agent": "Ine",
    "metric": "Estoque sincronizado"
  }'
```

### Opção 3: TypeScript/JavaScript

```typescript
import { createTask } from '@/lib/task-manager';

await createTask({
  title: 'Atualizar estoque',
  priority: 'alta',
  agent: 'Ine',
  metric: 'Estoque sincronizado'
});
```

---

## 📋 Status das Tasks

- `pending` - Pendente
- `in_progress` - Em progresso
- `done` - Concluída
- `blocked` - Bloqueada

## ⚡ Prioridades

- `alta` - Urgente
- `media` - Normal
- `baixa` - Baixa prioridade

---

## 🔧 Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Prisma** + PostgreSQL
- **Docker**

---

## 📦 Estrutura

```
├── src/
│   ├── app/
│   │   ├── api/tasks/       # API REST endpoints
│   │   ├── page.tsx         # Dashboard UI
│   │   └── layout.tsx
│   ├── components/ui/       # shadcn components
│   └── lib/
│       ├── prisma.ts        # Prisma client singleton
│       ├── task-manager.ts  # API client helper
│       └── utils.ts
├── prisma/
│   └── schema.prisma        # Database schema
├── scripts/
│   └── task-cli.js          # CLI tool para agents
└── docker-entrypoint.sh     # Migration script
```

---

## 🗄️ Database Schema

### Agent
- id, name, botHandle, role
- Auto-criado quando um agent envia sua primeira task

### Task
- id, title, description, status, priority
- deadline, metric
- agentId (foreign key)
- createdAt, updatedAt

---

## 🚀 Local Development

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Configurar banco
export DATABASE_URL="sua_string_de_conexao"

# Setup (gera Prisma Client + cria tabelas)
chmod +x setup.sh
./setup.sh

# Start dev server
npm run dev
```

Acesse: `http://localhost:3000`

---

## 📝 Notas

- **Migrations automáticas:** O Docker container roda `prisma db push` no startup
- **Agents:** São criados automaticamente na primeira task
- **API:** `/api/tasks` suporta GET (listar) e POST (criar)
- **Logs:** Verifique os logs do container para debug
