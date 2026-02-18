# ⚡ QUICK REFERENCE - PRE-COMMAND

## 🚀 ANTES DE QUALQUER COMMIT

```bash
# OPÇÃO 1: Script automático (RECOMENDADO)
./scripts/pre-commit.sh "tipo: descrição"

# OPÇÃO 2: Manual completo
npm install --legacy-peer-deps && \
npm run build && \
git add -A && \
git commit -m "tipo: descrição" && \
git push origin master
```

---

## 📦 SE MUDOU package.json

```bash
npm install --legacy-peer-deps
git add package.json package-lock.json
git commit -m "deps: adicionar pacote"
git push origin master
```

---

## 🗄️ SE MUDOU prisma/schema.prisma

```bash
npx prisma generate
npx prisma db push
git add -A
git commit -m "db: mudança no schema"
git push origin master
```

---

## 🎨 SE MUDOU UI/CSS/TS

```bash
npm run build
git add -A
git commit -m "ui/style: mudança visual"
git push origin master
```

---

## ⚠️ NUNCA ESQUECER

- ❌ package.json SEM package-lock.json
- ❌ Mudanças SEM testar build
- ❌ Commit SEM revisar git diff
- ✅ Sempre: npm install após mudar package.json
- ✅ Sempre: npm run build antes de commitar
- ✅ Sempre: revisar git diff --cached

---

## 🔄 FLUXO COMPLETO

```
1. Editar arquivos
2. ./scripts/pre-commit.sh "mensagem"
3. Rebuild no Easypanel
```
