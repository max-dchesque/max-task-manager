import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Agent {
  id: string;
  name: string;
  role: string;
  description: string | null;
  emoji: string | null;
  color: string | null;
  status: string;
  parentId: string | null;
}

// Dados dos agentes (mesmo do seed.ts)
const AGENTS_DATA: Agent[] = [
  // MAX COO - Raiz
  {
    id: 'max-coo',
    name: 'MAX COO',
    role: 'Coordenador da Operação',
    description: 'Coordenador estratégico de toda a operação OpenClaw',
    emoji: '👔',
    color: '#8B5CF6',
    status: 'online',
    parentId: null,
  },
  // Neo
  {
    id: 'neo',
    name: 'Neo',
    role: 'Dev Full-stack',
    description: 'Desenvolvedor full-stack da operação. Código limpo, arquitetura sólida, deploy rápido.',
    emoji: '💻',
    color: '#3B82F6',
    status: 'online',
    parentId: 'max-coo',
  },
  // Subagentes do Neo
  { id: 'frontend-agent', name: 'Frontend Agent', role: 'UI/UX Development', emoji: '🎨', color: '#EC4899', status: 'offline', parentId: 'neo', description: null },
  { id: 'backend-agent', name: 'Backend Agent', role: 'API & Database', emoji: '⚙️', color: '#10B981', status: 'offline', parentId: 'neo', description: null },
  { id: 'infra-agent', name: 'Infra Agent', role: 'DevOps & Infrastructure', emoji: '🔧', color: '#F59E0B', status: 'offline', parentId: 'neo', description: null },
  { id: 'produto-agent', name: 'Produto Agent', role: 'Product Management', emoji: '📊', color: '#8B5CF6', status: 'offline', parentId: 'neo', description: null },
  { id: 'code-review-agent', name: 'Code Review Agent', role: 'Code Quality', emoji: '🔍', color: '#EF4444', status: 'offline', parentId: 'neo', description: null },
  { id: 'security-agent', name: 'Security Agent', role: 'Security Audit', emoji: '🛡️', color: '#DC2626', status: 'offline', parentId: 'neo', description: null },
  { id: 'bug-fix-agent', name: 'Bug Fix Agent', role: 'Debug & Fix', emoji: '🐛', color: '#F97316', status: 'offline', parentId: 'neo', description: null },
  { id: 'performance-agent', name: 'Performance Agent', role: 'Optimization', emoji: '⚡', color: '#EAB308', status: 'offline', parentId: 'neo', description: null },
  { id: 'testing-agent', name: 'Testing Agent', role: 'QA & Testing', emoji: '✅', color: '#22C55E', status: 'offline', parentId: 'neo', description: null },
  // Ine
  {
    id: 'ine',
    name: 'Ine',
    role: 'Opera JC/Chesque & Cione',
    description: 'Operacional de e-commerce das marcas JC Plus Size, Chesque e Cione',
    emoji: '🛍️',
    color: '#EC4899',
    status: 'online',
    parentId: 'max-coo',
  },
  { id: 'ecommerce-agent', name: 'E-commerce Agent', role: 'Gestão de Lojas Online', description: 'Gerencia operações de e-commerce Shopee, Mercado Livre, Bagy', emoji: '🏪', color: '#F472B6', status: 'online', parentId: 'ine' },
  // Satoshi
  {
    id: 'satoshi',
    name: 'Satoshi',
    role: 'Opera Crypto',
    description: 'Operacional de criptomoedas e trading',
    emoji: '₿',
    color: '#F59E0B',
    status: 'online',
    parentId: 'max-coo',
  },
  { id: 'trading-agent', name: 'Trading Agent', role: 'Crypto Trading', description: 'Análise e execução de trades', emoji: '📈', color: '#EAB308', status: 'offline', parentId: 'satoshi' },
  { id: 'analysis-agent', name: 'Analysis Agent', role: 'Market Analysis', description: 'Análise de mercado e tendências', emoji: '📊', color: '#3B82F6', status: 'offline', parentId: 'satoshi' },
  // Strider - Raiz independente
  {
    id: 'strider',
    name: 'Strider',
    role: 'Coordenador de Operações',
    description: 'Coordena operações diárias e infraestrutura',
    emoji: '🚀',
    color: '#06B6D4',
    status: 'online',
    parentId: null,
  },
  { id: 'maintenance-agent', name: 'Maintenance Agent', role: 'System Maintenance', emoji: '🔧', color: '#6B7280', status: 'offline', parentId: 'strider', description: null },
  { id: 'monitoring-agent', name: 'Monitoring Agent', role: 'System Monitoring', emoji: '📡', color: '#0EA5E9', status: 'offline', parentId: 'strider', description: null },
  { id: 'backup-agent', name: 'Backup Agent', role: 'Data Backup', emoji: '💾', color: '#6366F1', status: 'offline', parentId: 'strider', description: null },
];

export async function POST(request: NextRequest) {
  try {
    // Verificar se já existe agentes
    const existingCount = await prisma.agent.count();

    if (existingCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already seeded with ${existingCount} agents`,
        count: existingCount,
      });
    }

    // Limpar agentes existentes
    await prisma.agent.deleteMany({});

    // Criar agentes
    const agents = await Promise.all(
      AGENTS_DATA.map(data => prisma.agent.create({ data }))
    );

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${agents.length} agents`,
      count: agents.length,
      agents,
    });
  } catch (error) {
    console.error('Error seeding agents:', error);
    return NextResponse.json(
      { error: 'Failed to seed agents', details: error },
      { status: 500 }
    );
  }
}
