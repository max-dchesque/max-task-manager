import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Agent Tree...')

  // Limpar agentes existentes
  await prisma.agent.deleteMany({})
  console.log('✅ Cleared existing agents')

  // MAX COO - Coordenador da Operação (Raiz)
  const maxCoo = await prisma.agent.create({
    data: {
      name: 'MAX COO',
      role: 'Coordenador da Operação',
      description: 'Coordenador estratégico de toda a operação OpenClaw',
      emoji: '👔',
      color: '#8B5CF6',
      status: 'online',
      parentId: null,
    },
  })
  console.log('✅ Created MAX COO')

  // NEO - Dev Full-stack
  const neo = await prisma.agent.create({
    data: {
      name: 'Neo',
      role: 'Dev Full-stack',
      description: 'Desenvolvedor full-stack da operação. Código limpo, arquitetura sólida, deploy rápido.',
      emoji: '💻',
      color: '#3B82F6',
      status: 'online',
      parentId: maxCoo.id,
    },
  })
  console.log('✅ Created Neo')

  // Subagentes do Neo (9 frentes)
  const neoSubagents = [
    { name: 'Frontend Agent', role: 'UI/UX Development', emoji: '🎨', color: '#EC4899' },
    { name: 'Backend Agent', role: 'API & Database', emoji: '⚙️', color: '#10B981' },
    { name: 'Infra Agent', role: 'DevOps & Infrastructure', emoji: '🔧', color: '#F59E0B' },
    { name: 'Produto Agent', role: 'Product Management', emoji: '📊', color: '#8B5CF6' },
    { name: 'Code Review Agent', role: 'Code Quality', emoji: '🔍', color: '#EF4444' },
    { name: 'Security Agent', role: 'Security Audit', emoji: '🛡️', color: '#DC2626' },
    { name: 'Bug Fix Agent', role: 'Debug & Fix', emoji: '🐛', color: '#F97316' },
    { name: 'Performance Agent', role: 'Optimization', emoji: '⚡', color: '#EAB308' },
    { name: 'Testing Agent', role: 'QA & Testing', emoji: '✅', color: '#22C55E' },
  ]

  for (const sub of neoSubagents) {
    await prisma.agent.create({
      data: {
        name: sub.name,
        role: sub.role,
        emoji: sub.emoji,
        color: sub.color,
        status: 'offline',
        parentId: neo.id,
      },
    })
  }
  console.log('✅ Created Neo subagents (9 agents)')

  // INE - Opera JC/Chesque & Cione
  const ine = await prisma.agent.create({
    data: {
      name: 'Ine',
      role: 'Opera JC/Chesque & Cione',
      description: 'Operacional de e-commerce das marcas JC Plus Size, Chesque e Cione',
      emoji: '🛍️',
      color: '#EC4899',
      status: 'online',
      parentId: maxCoo.id,
    },
  })
  console.log('✅ Created Ine')

  // Subagentes da Ine
  await prisma.agent.create({
    data: {
      name: 'E-commerce Agent',
      role: 'Gestão de Lojas Online',
      description: 'Gerencia operações de e-commerce Shopee, Mercado Livre, Bagy',
      emoji: '🏪',
      color: '#F472B6',
      status: 'online',
      parentId: ine.id,
    },
  })
  console.log('✅ Created Ine subagents')

  // SATOSHI - Opera Crypto
  const satoshi = await prisma.agent.create({
    data: {
      name: 'Satoshi',
      role: 'Opera Crypto',
      description: 'Operacional de criptomoedas e trading',
      emoji: '₿',
      color: '#F59E0B',
      status: 'online',
      parentId: maxCoo.id,
    },
  })
  console.log('✅ Created Satoshi')

  // Subagentes do Satoshi
  const satoshiSubagents = [
    { name: 'Trading Agent', role: 'Crypto Trading', description: 'Análise e execução de trades', emoji: '📈', color: '#EAB308' },
    { name: 'Analysis Agent', role: 'Market Analysis', description: 'Análise de mercado e tendências', emoji: '📊', color: '#3B82F6' },
  ]

  for (const sub of satoshiSubagents) {
    await prisma.agent.create({
      data: {
        name: sub.name,
        role: sub.role,
        description: sub.description,
        emoji: sub.emoji,
        color: sub.color,
        status: 'offline',
        parentId: satoshi.id,
      },
    })
  }
  console.log('✅ Created Satoshi subagents (2 agents)')

  // STRIDER - Coordenador de Operações
  const strider = await prisma.agent.create({
    data: {
      name: 'Strider',
      role: 'Coordenador de Operações',
      description: 'Coordena operações diárias e infraestrutura',
      emoji: '🚀',
      color: '#06B6D4',
      status: 'online',
      parentId: null, // Outra raiz independente
    },
  })
  console.log('✅ Created Strider')

  // Subagentes operacionais do Strider
  const striderSubagents = [
    { name: 'Maintenance Agent', role: 'System Maintenance', emoji: '🔧', color: '#6B7280' },
    { name: 'Monitoring Agent', role: 'System Monitoring', emoji: '📡', color: '#0EA5E9' },
    { name: 'Backup Agent', role: 'Data Backup', emoji: '💾', color: '#6366F1' },
  ]

  for (const sub of striderSubagents) {
    await prisma.agent.create({
      data: {
        name: sub.name,
        role: sub.role,
        emoji: sub.emoji,
        color: sub.color,
        status: 'offline',
        parentId: strider.id,
      },
    })
  }
  console.log('✅ Created Strider subagents (3 agents)')

  console.log('\n🎉 Agent Tree seeded successfully!')
  console.log(`\n📊 Summary:`)
  console.log(`   - Total agents: ${await prisma.agent.count()}`)
  console.log(`   - Root agents: 2 (MAX COO, Strider)`)
  console.log(`   - Neo subagents: 9`)
  console.log(`   - Ine subagents: 1`)
  console.log(`   - Satoshi subagents: 2`)
  console.log(`   - Strider subagents: 3`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
