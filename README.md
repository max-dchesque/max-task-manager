# MAX Task Manager

Sistema de gerenciamento de tarefas para MAX e agentes (Ine, Satoshi, Dev).

## 🚀 Deploy

### Easypanel (Docker)

1. **Criar serviço Git Repository**
   - Repository: `https://github.com/max-dchesque/max-task-manager`
   - Branch: `master`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Port: `3000`

2. **Variáveis de Ambiente**
   ```bash
   DATABASE_URL=postgresql://user:password@postgres:5432/maxtaskmanager
   ```

### Local

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000`

---

## 🤖 Integração com Agents

### Opção 1: API REST

**POST** `/api/tasks`

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Atualizar estoque",
    "description": "Sincronizar com Mitryus",
    "priority": "alta",
    "agent": "Ine",
    "metric": "Estoque sincronizado"
  }'
```

### Opção 2: CLI Tool

```bash
node scripts/task-cli.js "Título da task" \
  --priority alta \
  --agent Ine \
  --metric "Estoque sincronizado"
```

### Opção 3: TypeScript/JavaScript

```typescript
import { createTask } from '@/lib/task-manager';

await createTask({
  title: 'Atualizar estoque',
  description: 'Sincronizar com Mitryus',
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

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma + PostgreSQL
- Docker

---

## 📦 Estrutura

```
├── src/
│   ├── app/
│   │   ├── api/tasks/     # API endpoints
│   │   ├── page.tsx       # Dashboard
│   │   └── layout.tsx
│   ├── components/ui/     # shadcn components
│   └── lib/
│       ├── utils.ts
│       └── task-manager.ts # API client
├── prisma/
│   └── schema.prisma      # Database schema
└── scripts/
    └── task-cli.js        # CLI tool para agents
```
