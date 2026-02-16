#!/usr/bin/env node

/**
 * MAX Task Manager - CLI Tool para Agents
 * 
 * Uso:
 *   node scripts/task-cli.js "Título da task" --priority alta --agent Ine
 * 
 * Exemplos:
 *   node scripts/task-cli.js "Atualizar estoque" --priority alta --agent Ine --metric "Estoque sincronizado"
 *   node scripts/task-cli.js "Enviar newsletter" --agent "MAX" --deadline "2026-02-20"
 */

const https = require('https');

const API_URL = process.env.TASK_API_URL || 'http://localhost:3000';
const API_ENDPOINT = `${API_URL}/api/tasks`;

// Parse argumentos
const args = process.argv.slice(2);
const title = args[0];

if (!title) {
  console.error('❌ Erro: Título da task é obrigatório');
  console.log('\nUso: node task-cli.js "Título" [opções]');
  console.log('\nOpções:');
  console.log('  --priority <alta|media|baixa>');
  console.log('  --agent <nome>');
  console.log('  --deadline <YYYY-MM-DD>');
  console.log('  --metric <descrição>');
  console.log('  --description <texto>');
  process.exit(1);
}

// Parse flags
const flags = {
  title,
  priority: 'media',
  agent: 'Unknown',
};

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    const key = arg.slice(2);
    const value = args[i + 1];
    if (value && !value.startsWith('--')) {
      flags[key] = value;
      i++; // skip next arg
    }
  }
}

// Enviar task
fetch(API_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: flags.title,
    description: flags.description || '',
    priority: flags.priority,
    agent: flags.agent,
    deadline: flags.deadline || null,
    metric: flags.metric || null,
  }),
})
  .then((res) => res.json())
  .then((data) => {
    if (data.success) {
      console.log('✅ Task criada com sucesso!');
      console.log(`\n📋 Task ID: ${data.task.id}`);
      console.log(`📝 Título: ${data.task.title}`);
      console.log(`👤 Agent: ${flags.agent}`);
      console.log(`⚡ Prioridade: ${flags.priority}`);
      console.log(`\n💾 Acesse: ${API_URL}`);
    } else {
      console.error('❌ Erro ao criar task:', data.error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Erro na requisição:', error.message);
    process.exit(1);
  });
