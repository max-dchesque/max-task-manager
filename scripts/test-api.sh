#!/bin/bash

# Test MAX Task Manager API

echo "🧪 Testing MAX Task Manager API"
echo ""

# Verificar se a API está rodando
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "❌ API not responding at http://localhost:3000"
  echo "Start with: npm run dev"
  exit 1
fi

echo "✅ API is running"
echo ""

# Test 1: Criar task
echo "📝 Test 1: Creating task..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test task from API",
    "description": "Testing API integration",
    "priority": "alta",
    "agent": "MAX",
    "metric": "API working"
  }')

echo "$RESPONSE" | jq .

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Task created successfully"
else
  echo "❌ Failed to create task"
  exit 1
fi

echo ""

# Test 2: Listar tasks
echo "📋 Test 2: Listing tasks..."
RESPONSE=$(curl -s http://localhost:3000/api/tasks)

echo "$RESPONSE" | jq .

if echo "$RESPONSE" | grep -q '"success":true'; then
  echo "✅ Tasks listed successfully"
else
  echo "❌ Failed to list tasks"
  exit 1
fi

echo ""
echo "🎉 All tests passed!"
