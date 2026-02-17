// Test script to create a task and verify API
const taskData = {
  title: "Task de teste - Setup inicial",
  description: "Esta é uma tarefa de exemplo para testar o sistema",
  priority: "media",
  agent: "Neo",
  metric: "Sistema funcionando"
};

fetch('http://localhost:3000/api/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(taskData)
})
  .then(res => res.json())
  .then(data => console.log('✅ Task criada:', data))
  .catch(err => console.error('❌ Erro:', err.message));
