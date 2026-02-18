#!/usr/bin/env node

/**
 * Agent Auto-Update Script
 * 
 * Este script permite que agentes remotos atualizem o Kanban automaticamente.
 * 
 * Uso:
 *   node scripts/agent-update.js "Agent Name" "TaskID" "status" "note opcional"
 * 
 * Exemplo:
 *   node scripts/agent-update.js "Neo" "task_123" "in_progress" "Working on it"
 */

const https = require('https');

const AGENT_UPDATE_URL = process.env.KANBAN_UPDATE_URL || 'https://workspace-pessoal-opentask-app.hshars.easypanel.host/api/agents/update';
const AGENT_SECRET = process.env.AGENT_UPDATE_SECRET || 'agent-secret-2026';

async function agentUpdate(agentName, taskId, status, note = '') {
  const payload = {
    agentName,
    agentSecret: AGENT_SECRET,
    updates: [
      {
        taskId,
        status,
        note,
      }
    ]
  };

  return new Promise((resolve, reject) => {
    const url = new URL(AGENT_UPDATE_URL);
    const data = JSON.stringify(payload);

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode === 200) {
            resolve(response);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${response.error || 'Unknown error'}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);

    req.write(data);
    req.end();
  });
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║         Agent Auto-Update Script - Kanban Real-time           ║
╚══════════════════════════════════════════════════════════════╝

Uso:
  node scripts/agent-update.js "Agent Name" "TaskID" "status" "note"

Status válidos:
  - pending
  - in_progress
  - done
  - blocked

Exemplos:
  node scripts/agent-update.js "Neo" "task_abc123" "in_progress" "Working on frontend"
  node scripts/agent-update.js "Ine" "task_def456" "done" "Task completed"
  node scripts/agent-update.js "Satoshi" "task_ghi789" "blocked" "Waiting for review"

Environment Variables (opcional):
  KANBAN_UPDATE_URL  - URL do endpoint de update
  AGENT_UPDATE_SECRET - Segredo de autenticação
    `);
    process.exit(1);
  }

  const [agentName, taskId, status, note] = args;

  console.log(`\n🤖 Agent: ${agentName}`);
  console.log(`📋 Task: ${taskId}`);
  console.log(`📊 Status: ${status}`);
  if (note) console.log(`📝 Note: ${note}`);
  console.log('');

  try {
    const result = await agentUpdate(agentName, taskId, status, note);

    console.log('✅ SUCCESS!');
    console.log(`Message: ${result.message}`);
    console.log('');
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Export for programmatic use
module.exports = { agentUpdate };

// Run if called directly
if (require.main === module) {
  main();
}
