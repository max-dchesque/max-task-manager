# 🔄 KANBAN REAL-TIME - AGENT AUTO-UPDATE

## 🎯 SISTEMA COMPLETO

### **1. Supabase Realtime (WebSocket)**
- **Instant updates** via PostgreSQL WAL
- **Auto-sync** entre múltiplos clientes
- **Fallback** para polling (5s)

### **2. Agent Update API**
- **Endpoint:** `/api/agents/update`
- **Auth:** Secret key
- **Bulk updates:** Múltiplas tarefas de uma vez

### **3. Agent Script**
- **CLI:** `node scripts/agent-update.js`
- **Programático:** `const { agentUpdate } = require('./scripts/agent-update.js')`
- **Remote:** Funciona de qualquer lugar

---

## 🚀 COMO USAR

### **Opção 1: CLI (Command Line)**

```bash
# Atualizar tarefa remotamente
node scripts/agent-update.js "Neo" "task_abc123" "in_progress" "Working on it"

# Exemplos
node scripts/agent-update.js "Neo" "task_123" "in_progress" "Implementando frontend"
node scripts/agent-update.js "Ine" "task_456" "done" "Loja integrada"
node scripts/agent-update.js "Satoshi" "task_789" "blocked" "Aguardando sinal"
```

### **Opção 2: Programático (Node.js)**

```javascript
const { agentUpdate } = require('./scripts/agent-update.js');

async function updateKanban() {
  await agentUpdate("Neo", "task_123", "in_progress", "Coding feature");

  // Múltiplas tarefas
  await agentUpdate("Neo", "task_123", "done", "Completed");
}

updateKanban();
```

### **Opção 3: HTTP Request (cURL/Python/Go)**

```bash
curl -X POST https://workspace-pessoal-opentask-app.hshars.easypanel.host/api/agents/update \\
  -H "Content-Type: application/json" \\
  -d '{
    "agentName": "Neo",
    "agentSecret": "agent-secret-2026",
    "updates": [
      {
        "taskId": "task_abc123",
        "status": "in_progress",
        "note": "Working on frontend"
      }
    ]
  }'
```

---

## 📊 STATUS VÁLIDOS

| Status | Descrição | Uso |
|---|---|---|
| `pending` | Tarefa pendente | Atribuída mas não iniciada |
| `in_progress` | Em progresso | Agent está trabalhando |
| `done` | Concluída | Finalizada com sucesso |
| `blocked` | Bloqueada | Precisa de intervenção |

---

## 🔐 AUTENTICAÇÃO

```bash
# Variável de ambiente
export AGENT_UPDATE_SECRET="agent-secret-2026"

# Ou no .env
AGENT_UPDATE_SECRET=agent-secret-2026
```

---

## 🤖 AGENT AUTO-UPDATE

### **Neo Agent - Auto-update automático**

```javascript
// Neo Agent workflow
async function neoTaskWorkflow() {
  const taskId = "task_frontend_123";

  // 1. Pegar tarefa
  await agentUpdate("Neo", taskId, "in_progress", "Iniciando frontend");

  // 2. Trabalhar...
  await sleep(60000); // 1 minuto

  // 3. Atualizar progresso
  await agentUpdate("Neo", taskId, "in_progress", "Componentes criados");

  // 4. Finalizar
  await agentUpdate("Neo", taskId, "done", "Frontend concluído");
}

neoTaskWorkflow();
```

### **Ine Agent - E-commerce**

```javascript
// Ine Agent workflow
async function ineUpdateShopify() {
  await agentUpdate("Ine", "task_shopify", "in_progress", "Sincronizando produtos");
  
  // Sync com Shopify...
  const products = await shopify.getProducts();
  await updateDatabase(products);
  
  await agentUpdate("Ine", "task_shopify", "done", `${products.length} produtos sincronizados`);
}

ineUpdateShopify();
```

### **Satoshi Agent - Trading**

```javascript
// Satoshi Agent workflow
async function satoshiCheckSignal() {
  const signal = await tradingBot.getSignal();
  
  if (signal === "BUY") {
    await agentUpdate("Satoshi", "task_trade", "in_progress", "Sinal de compra detectado");
    await executeTrade("BTC", "BUY");
    await agentUpdate("Satoshi", "task_trade", "done", "Posição aberta");
  }
}

satoshiCheckSignal();
```

---

## 🔄 REAL-TIME SYNC

### **Como funciona:**

```
1. Agent chama /api/agents/update
   ↓
2. API atualiza banco (PostgreSQL)
   ↓
3. PostgreSQL WAL notifica Supabase Realtime
   ↓
4. Supabase WebSocket envia update para todos clientes
   ↓
5. Kanban UI auto-refresh (instantâneo!)
   ↓
6. Polling fallback (5s) se WebSocket falhar
```

### ** Tecnologias:**

- **WebSocket:** Supabase Realtime (PostgreSQL WAL)
- **Fallback:** HTTP Polling (5 segundos)
- **Drag & Drop:** @dnd-kit/core
- **UI:** React + Tailwind Wonder Games

---

## 📱 VISUALIZAÇÃO

### **Kanban Board:**
- ✅ Status indicator (online/offline)
- ✅ Wonder Games Design (neon glow)
- ✅ Drag & Drop funcional
- ✅ Auto-sync em tempo real
- ✅ Badge com contagem de tarefas

### **Cores das Colunas:**

| Coluna | Cor Light | Cor Dark |
|---|---|---|
| Pending | 🟡 slate-50 | 🌑 slate-800 |
| In Progress | 🔵 blue-50 | 🌑 blue-900 |
| Done | 🟢 green-50 | 🌑 green-900 |
| Blocked | 🔴 red-50 | 🌑 red-900 |

---

## 🎯 CASOS DE USO

### **1. Atualização Manual por Agent**
```bash
# Neo inicia tarefa
node scripts/agent-update.js "Neo" "task_abc" "in_progress" "Iniciando implementação"
```

### **2. Atualização Automática por Cron**
```javascript
// Cron job a cada 10 minutos
cron.schedule('*/10 * * * *', async () => {
  const tasks = await getPendingTasks();
  for (const task of tasks) {
    await agentUpdate("System", task.id, "in_progress", "Auto-assign");
  }
});
```

### **3. Multi-Agent Sync**
```javascript
// MAX COO coordena múltiplos agents
await agentUpdate("MAX COO", "task_1", "in_progress", "Neo trabalhando");
await agentUpdate("MAX COO", "task_2", "in_progress", "Ine processando");
await agentUpdate("MAX COO", "task_3", "in_progress", "Satoshi analisando");
```

### **4. Webhook Externo**
```bash
# Shopify webhook → Kanban
curl -X POST /api/agents/update \\
  -d '{"agentName":"Ine", "taskId":"shopify_sync", "status":"done"}'
```

---

## 🛠️ AMBIENTE

### **Variáveis de Ambiente (.env):**

```bash
# Supabase (para Realtime)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Agent Update Secret
AGENT_UPDATE_SECRET=agent-secret-2026

# Kanban Update URL (opcional)
KANBAN_UPDATE_URL=https://workspace-pessoal-opentask-app.hshars.easypanel.host/api/agents/update
```

---

## 📚 ARQUIVOS DO SISTEMA

```
max-task-manager/
├── src/
│   ├── lib/
│   │   └── kanban-realtime.ts        # Realtime subscription
│   ├── app/
│   │   ├── kanban/
│   │   │   └── page.tsx              # Kanban UI com Realtime
│   │   └── api/
│   │       ├── agents/
│   │       │   └── update/
│   │       │       └── route.ts      # Agent update endpoint
│   │       └── tasks/
│   │           └── [id]/
│   │               └── route.ts      # Task CRUD
└── scripts/
    └── agent-update.js               # CLI para agents
```

---

## 🎮 PRÓXIMOS PASSOS

1. ✅ **Commit** as mudanças
2. ✅ **Rebuild** no Easypanel
3. ✅ **Acessar** `/kanban`
4. ✅ **Testar** drag & drop
5. ✅ **Chamar** agent-update remotamente
6. ✅ **Ver** atualização em tempo real!

---

**Sistema Kanban Real-Time completo!** 🚀✨
