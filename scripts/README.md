# 🔧 Scripts - MAX Task Manager

## 📂 Scripts Disponíveis

### **pre-commit.sh** ⭐ MAIS IMPORTANTE
**Script automático de verificação pré-commit**

**Uso:**
```bash
./scripts/pre-commit.sh "tipo: descrição do commit"
```

**O que faz:**
1. ✅ Verifica se `package.json` e `package-lock.json` estão sincronizados
2. ✅ Regenera Prisma Client se schema mudou
3. ✅ Roda build para verificar erros
4. ✅ Mostra arquivos que serão commitados
5. ✅ Pede confirmação antes de commitar
6. ✅ Faz commit + push automaticamente

**Quando usar:**
- ANTES de qualquer commit
- Especialmente após mudar dependências
- Após modificar schema do Prisma
- Antes de rebuildar no Easypanel

---

## 📖 Documentação

### **PRE_COMMIT_CHECKLIST.md**
Checklist completo com todas as verificações necessárias

### **QUICK_REFERENCE.md**
Referência rápida de comandos mais usados

---

## 🎯 Workflow Recomendado

```bash
# 1. Faça suas mudanças
# Edite arquivos...

# 2. Rode o script de pré-commit
./scripts/pre-commit.sh "feat: nova funcionalidade"

# 3. Rebuild no Easypanel
# Vá ao Easypanel → max_task_app → Rebuild
```

---

## ⚠️ Erros Comuns

### **Erro: package-lock.json desincronizado**
```bash
# Solução:
npm install --legacy-peer-deps
git add package-lock.json
```

### **Erro: Build falha**
```bash
# Solução:
npm run build
# Corrija os erros
git add -A
```

### **Erro: Prisma Client desincronizado**
```bash
# Solução:
npx prisma generate
git add -A
```

---

## 📋 Checklist Visual

Antes de pedir rebuild no Easypanel:

```
□ ./scripts/pre-commit.sh "mensagem"
□ Git push realizado com sucesso
□ Build local passou
□ Rebuild no Easypanel
```

---

**ÚLTIMA ATUALIZAÇÃO:** 18 Fev 2026
**AUTOR:** Neo Dev
