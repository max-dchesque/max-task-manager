# 🔒 PRE-COMMIT CHECKLIST - MAX Task Manager

## ⚠️ REGRA DE OURO: NUNCA COMMITAR SEM VERIFICAR!

---

## 📋 CHECKLIST OBRIGATÓRIO

Antes de **TODO** commit, execute:

```bash
# 1. Verificar arquivos modificados
git status

# 2. Se mudou package.json → RODAR NPM INSTALL
npm install --legacy-peer-deps

# 3. Se mudou prisma/schema.prisma → RODAR PRISMA GENERATE
npx prisma generate

# 4. Se mudou TypeScript → RODAR TYPE CHECK
npm run build (ou tsc --noEmit)

# 5. Adicionar TODOS os arquivos
git add -A

# 6. Verificar o que vai ser commitado
git diff --cached --stat

# 7. Fazer commit com mensagem clara
git commit -m "tipo: descrição

DETAHES:
- O que foi mudado
- Por que foi mudado
- Arquivos afetados"

# 8. Push imediatamente
git push origin master
```

---

## 🎯 SITUAÇÕES ESPECÍFICAS

### **1. Mudou dependências (package.json)**
```bash
# ✅ OBRIGATÓRIO:
npm install --legacy-peer-deps
git add package.json package-lock.json
git commit -m "deps: adicionar/remover pacote"
```

**Nunca esquecer:**
- ❌ `package.json` + `package-lock.json` DEVEM ser commitados juntos
- ❌ NUNCA commitar `package.json` sem `package-lock.json`

---

### **2. Mudou schema do Prisma (prisma/schema.prisma)**
```bash
# ✅ OBRIGATÓRIO:
npx prisma generate
npx prisma db push (ou db migrate)
git add -A
git commit -m "db: mudança no schema"
```

**Nunca esquecer:**
- ❌ Schema mudou → `prisma generate` é obrigatório
- ❌ Client Prisma desincronizado → quebra build

---

### **3. Mudou componentes UI**
```bash
# ✅ VERIFICAR:
npm run build
git add -A
git commit -m "ui: mudança no componente"
```

**Nunca esquecer:**
- ❌ Componentes quebram → build falha
- ❌ Imports errados → erro de compilação

---

### **4. Mudou CSS/Tailwind (globals.css, tailwind.config.ts)**
```bash
# ✅ VERIFICAR:
npm run build
git add -A
git commit -m "style: mudança visual"
```

**Nunca esquecer:**
- ❌ CSS quebra → build falha
- ❌ Classes inexistentes → erro de runtime

---

### **5. Mudou tipos TypeScript (.ts, .tsx)**
```bash
# ✅ VERIFICAR:
npm run build
git add -A
git commit -m "types: mudança de tipos"
```

**Nunca esquecer:**
- ❌ Tipos errados → erro de compilação
- ❌ Imports faltando → erro de runtime

---

## 🚫 ERROS COMUNS (E COMO EVITAR)

| Erro | Causa | Solução |
|---|---|---|
| `npm ci` falha | `package-lock.json` desincronizado | `npm install` + `git add package-lock.json` |
| Build falha | Tipo/import errado | `npm run build` antes de commit |
| Prisma erro | Schema/client desincronizado | `npx prisma generate` |
| Tailwind erro | Plugin/class faltando | Verificar imports + build |

---

## ✅ COMANDO MÁGICO (PRÉ-COMPLETO)

```bash
# Copiar e colar antes de TODO commit:
npm install --legacy-peer-deps && \
npm run build && \
git add -A && \
git diff --cached --stat && \
read -p "Commit message: " MSG && \
git commit -m "$MSG" && \
git push origin master
```

---

## 📋 FLUXO CORRETO

```
1. Editar arquivos
   ↓
2. RODAR COMANDOS DE VERIFICAÇÃO (npm install, build, etc)
   ↓
3. git add -A
   ↓
4. git diff --cached (VER O QUE VAI SER COMMITADO)
   ↓
5. git commit -m "mensagem clara"
   ↓
6. git push origin master
   ↓
7. REBUILD NO EASYPANEL
```

---

## 🎯 DICAS DE OURO

### **1. Sempre revise antes de commitar**
```bash
git diff --cached --name-only
# Mostra todos os arquivos que vão ser commitados
```

### **2. Verifique diffs críticos**
```bash
git diff --cached package.json
git diff --cached package-lock.json
git diff --cached prisma/schema.prisma
```

### **3. Build local antes de push**
```bash
npm run build
# Se passar local, vai passar no Docker
```

### **4. Commits pequenos e frequentes**
- ❌ Um commit gigante com 10 mudanças
- ✅ 10 commits pequenos, um por mudança

### **5. Mensagens de commit claras**
```bash
# ❌ RUIM
git commit -m "fix stuff"

# ✅ BOM
git commit -m "fix: resolve build errors

PROBLEMAS:
1. tailwindcss-animate não instalado
2. Ícone Task não existe no lucide-react

SOLUÇÃO:
1. npm install tailwindcss-animate
2. Task → ClipboardList (ícone correto)"
```

---

## 🚨 ANTES DE PEDIR REBUILD

```bash
# 1. Verificar último commit
git log --oneline -1

# 2. Verificar se package.json e package-lock.json estão sincronizados
grep "tailwindcss-animate" package.json
grep "tailwindcss-animate" package-lock.json

# 3. Verificar se build passa
npm run build

# 4. SE TUDO OK → Pedir rebuild no Easypanel
```

---

## 📊 CHECKLIST VISUAL

```
□ Editei os arquivos necessários
□ Rodei npm install (se mudei package.json)
□ Rodei npm run build (para verificar)
□ Rodei npx prisma generate (se mudei schema)
□ git add -A (adicionei tudo)
□ git diff --cached (revisei as mudanças)
□ git commit -m "mensagem clara"
□ git push origin master
□ rebuild no Easypanel
```

---

## 🎯 LEMBRETE FINAL

### **⚠️ NUNCA:**
- ❌ Commitar `package.json` sem `package-lock.json`
- ❌ Commitar mudanças sem testar build
- ❌ Commitar sem revisar `git diff --cached`
- ❌ Fazer commits gigantes com múltiplas mudanças

### **✅ SEMPRE:**
- ✅ Rodar `npm install` após mudar `package.json`
- ✅ Rodar `npm run build` antes de commitar
- ✅ Revisar `git diff --cached` antes de commitar
- ✅ Commits pequenos e descritivos
- ✅ Push imediatamente após commit

---

**ÚLTIMA ATUALIZAÇÃO:** 18 Fev 2026
**AUTOR:** Neo Dev
**STATUS:** ✅ ATIVO E OBRIGATÓRIO
