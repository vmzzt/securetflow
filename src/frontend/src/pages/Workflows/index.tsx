import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Icons
const WorkflowIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h2a2 2 0 002-2V7a2 2 0 00-2-2H9m0 0V3m0 2v2m-.5-2h1m-.5 0h1m-.5 0h1M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PauseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'notification';
  name: string;
  config: {
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  condition?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft' | 'error';
  trigger: {
    type: 'schedule' | 'event' | 'manual' | 'webhook';
    config: any;
  };
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
  lastRun?: string;
  nextRun?: string;
  runCount: number;
  successRate: number;
  averageDuration: number;
  tags: string[];
  isTemplate: boolean;
  category: string;
  author: string;
  version: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration?: number;
  trigger: string;
  progress: number;
  steps: Array<{
    id: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    startTime?: string;
    endTime?: string;
    duration?: number;
    output?: string;
    error?: string;
  }>;
  logs: Array<{
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
    step?: string;
  }>;
}

const Workflows: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflows');
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const tabs = [
    { id: 'workflows', label: 'Workflows', icon: '🔄' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'executions', label: 'Execuções', icon: '🏃' },
    { id: 'builder', label: 'Builder', icon: '🛠️' }
  ];

  const workflowCategories = [
    { id: 'security', name: 'Segurança', icon: '🛡️', count: 0 },
    { id: 'scanning', name: 'Scanning', icon: '🔍', count: 0 },
    { id: 'reporting', name: 'Relatórios', icon: '📊', count: 0 },
    { id: 'notification', name: 'Notificações', icon: '🔔', count: 0 },
    { id: 'automation', name: 'Automação', icon: '🤖', count: 0 },
    { id: 'integration', name: 'Integração', icon: '🔗', count: 0 }
  ];

  useEffect(() => {
    loadWorkflows();
    loadExecutions();
  }, []);

  const loadWorkflows = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setWorkflows([
        {
          id: 'wf1',
          name: 'Scan Automático Diário',
          description: 'Executa scan completo de vulnerabilidades todos os dias às 2h',
          status: 'active',
          trigger: {
            type: 'schedule',
            config: {
              cron: '0 2 * * *',
              timezone: 'America/Sao_Paulo'
            }
          },
          nodes: [
            {
              id: 'trigger1',
              type: 'trigger',
              name: 'Agendamento Diário',
              config: { time: '02:00' },
              position: { x: 100, y: 100 }
            },
            {
              id: 'action1',
              type: 'action',
              name: 'Executar Nuclei',
              config: { tool: 'nuclei', targets: 'all' },
              position: { x: 300, y: 100 }
            },
            {
              id: 'condition1',
              type: 'condition',
              name: 'Vulnerabilidades Críticas?',
              config: { severity: 'critical', count: '>0' },
              position: { x: 500, y: 100 }
            },
            {
              id: 'notification1',
              type: 'notification',
              name: 'Alerta Discord',
              config: { integration: 'discord', template: 'critical_alert' },
              position: { x: 700, y: 100 }
            }
          ],
          edges: [
            { id: 'e1', source: 'trigger1', target: 'action1' },
            { id: 'e2', source: 'action1', target: 'condition1' },
            { id: 'e3', source: 'condition1', target: 'notification1', condition: 'true' }
          ],
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-14T15:30:00Z',
          lastRun: '2024-01-15T02:00:00Z',
          nextRun: '2024-01-16T02:00:00Z',
          runCount: 45,
          successRate: 97.8,
          averageDuration: 1800, // 30 minutes
          tags: ['automated', 'daily', 'critical'],
          isTemplate: false,
          category: 'security',
          author: 'Security Team',
          version: '1.2'
        },
        {
          id: 'wf2',
          name: 'Resposta a Incidentes',
          description: 'Workflow automatizado para resposta a vulnerabilidades críticas',
          status: 'active',
          trigger: {
            type: 'event',
            config: {
              event: 'vulnerability_found',
              severity: 'critical'
            }
          },
          nodes: [
            {
              id: 'trigger2',
              type: 'trigger',
              name: 'Vulnerabilidade Crítica',
              config: { event: 'vulnerability_found', severity: 'critical' },
              position: { x: 100, y: 100 }
            },
            {
              id: 'notification2',
              type: 'notification',
              name: 'Alerta Imediato',
              config: { integrations: ['discord', 'slack'], urgent: true },
              position: { x: 300, y: 100 }
            },
            {
              id: 'action2',
              type: 'action',
              name: 'Criar Ticket Jira',
              config: { integration: 'jira', priority: 'highest' },
              position: { x: 500, y: 100 }
            }
          ],
          edges: [
            { id: 'e4', source: 'trigger2', target: 'notification2' },
            { id: 'e5', source: 'notification2', target: 'action2' }
          ],
          createdAt: '2024-01-08T14:20:00Z',
          updatedAt: '2024-01-12T09:15:00Z',
          lastRun: '2024-01-15T09:15:00Z',
          runCount: 12,
          successRate: 100,
          averageDuration: 45, // 45 seconds
          tags: ['incident-response', 'critical', 'automated'],
          isTemplate: false,
          category: 'security',
          author: 'Security Team',
          version: '1.1'
        },
        {
          id: 'wf3',
          name: 'Template: Scan Completo',
          description: 'Template para scan completo com múltiplas ferramentas',
          status: 'draft',
          trigger: {
            type: 'manual',
            config: {}
          },
          nodes: [
            {
              id: 'trigger3',
              type: 'trigger',
              name: 'Execução Manual',
              config: {},
              position: { x: 100, y: 100 }
            },
            {
              id: 'action3',
              type: 'action',
              name: 'Nmap Discovery',
              config: { tool: 'nmap', scan_type: 'discovery' },
              position: { x: 300, y: 100 }
            },
            {
              id: 'action4',
              type: 'action',
              name: 'Nuclei Scan',
              config: { tool: 'nuclei', templates: 'all' },
              position: { x: 500, y: 100 }
            },
            {
              id: 'action5',
              type: 'action',
              name: 'Gerar Relatório',
              config: { format: 'pdf', template: 'comprehensive' },
              position: { x: 700, y: 100 }
            }
          ],
          edges: [
            { id: 'e6', source: 'trigger3', target: 'action3' },
            { id: 'e7', source: 'action3', target: 'action4' },
            { id: 'e8', source: 'action4', target: 'action5' }
          ],
          createdAt: '2024-01-05T11:30:00Z',
          updatedAt: '2024-01-05T11:30:00Z',
          runCount: 0,
          successRate: 0,
          averageDuration: 0,
          tags: ['template', 'comprehensive', 'multi-tool'],
          isTemplate: true,
          category: 'scanning',
          author: 'System',
          version: '1.0'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const loadExecutions = async () => {
    // Simulate API call
    setTimeout(() => {
      setExecutions([
        {
          id: 'exec1',
          workflowId: 'wf1',
          workflowName: 'Scan Automático Diário',
          status: 'running',
          startTime: '2024-01-15T02:00:00Z',
          trigger: 'Agendamento (02:00)',
          progress: 75,
          steps: [
            {
              id: 'step1',
              name: 'Inicializar Scan',
              status: 'completed',
              startTime: '2024-01-15T02:00:00Z',
              endTime: '2024-01-15T02:00:30Z',
              duration: 30
            },
            {
              id: 'step2',
              name: 'Executar Nuclei',
              status: 'running',
              startTime: '2024-01-15T02:00:30Z'
            },
            {
              id: 'step3',
              name: 'Analisar Resultados',
              status: 'pending'
            },
            {
              id: 'step4',
              name: 'Enviar Notificações',
              status: 'pending'
            }
          ],
          logs: [
            {
              timestamp: '2024-01-15T02:00:00Z',
              level: 'info',
              message: 'Workflow iniciado',
              step: 'step1'
            },
            {
              timestamp: '2024-01-15T02:00:30Z',
              level: 'info',
              message: 'Nuclei scan iniciado com 1200+ templates',
              step: 'step2'
            }
          ]
        },
        {
          id: 'exec2',
          workflowId: 'wf2',
          workflowName: 'Resposta a Incidentes',
          status: 'completed',
          startTime: '2024-01-15T09:15:00Z',
          endTime: '2024-01-15T09:15:45Z',
          duration: 45,
          trigger: 'Vulnerabilidade Crítica Detectada',
          progress: 100,
          steps: [
            {
              id: 'step5',
              name: 'Processar Evento',
              status: 'completed',
              startTime: '2024-01-15T09:15:00Z',
              endTime: '2024-01-15T09:15:05Z',
              duration: 5
            },
            {
              id: 'step6',
              name: 'Enviar Alertas',
              status: 'completed',
              startTime: '2024-01-15T09:15:05Z',
              endTime: '2024-01-15T09:15:25Z',
              duration: 20
            },
            {
              id: 'step7',
              name: 'Criar Ticket Jira',
              status: 'completed',
              startTime: '2024-01-15T09:15:25Z',
              endTime: '2024-01-15T09:15:45Z',
              duration: 20,
              output: 'Ticket SEC-1234 criado com sucesso'
            }
          ],
          logs: [
            {
              timestamp: '2024-01-15T09:15:00Z',
              level: 'info',
              message: 'Workflow acionado por vulnerabilidade crítica'
            },
            {
              timestamp: '2024-01-15T09:15:45Z',
              level: 'info',
              message: 'Workflow concluído com sucesso'
            }
          ]
        }
      ]);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'draft':
        return 'text-blue-600 bg-blue-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getExecutionStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'skipped':
        return 'text-yellow-600 bg-yellow-100';
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const handleRunWorkflow = (workflow: Workflow) => {
    console.log(`Running workflow: ${workflow.name}`);
    // In real implementation, this would trigger the workflow
  };

  const handleEditWorkflow = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setShowBuilderModal(true);
  };

  const handleViewExecution = (execution: WorkflowExecution) => {
    setSelectedExecution(execution);
    setShowExecutionModal(true);
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = !filterStatus || workflow.status === filterStatus;
    const matchesCategory = !filterCategory || workflow.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getFilteredWorkflowsByTab = () => {
    switch (activeTab) {
      case 'templates':
        return filteredWorkflows.filter(workflow => workflow.isTemplate);
      default:
        return filteredWorkflows.filter(workflow => !workflow.isTemplate);
    }
  };

  const activeWorkflows = workflows.filter(w => w.status === 'active').length;
  const totalRuns = workflows.reduce((sum, w) => sum + w.runCount, 0);
  const avgSuccessRate = workflows.length > 0 ? 
    (workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando workflows...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-2">
            Automação de processos de segurança - {activeWorkflows} ativos de {workflows.length} total
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowBuilderModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Novo Workflow</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Importar Template
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <WorkflowIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{workflows.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-green-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ativos</p>
              <p className="text-2xl font-semibold text-gray-900">{activeWorkflows}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <PlayIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Execuções</p>
              <p className="text-2xl font-semibold text-gray-900">{totalRuns}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-green-600">{avgSuccessRate}%</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
              <p className="text-xs text-gray-500">média geral</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="draft">Rascunho</option>
            <option value="error">Com erro</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as categorias</option>
            <option value="security">Segurança</option>
            <option value="scanning">Scanning</option>
            <option value="reporting">Relatórios</option>
            <option value="notification">Notificações</option>
            <option value="automation">Automação</option>
          </select>

          <button
            onClick={loadWorkflows}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {(activeTab === 'workflows' || activeTab === 'templates') && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {getFilteredWorkflowsByTab().map((workflow, index) => (
                <motion.div
                  key={workflow.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Workflow Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <WorkflowIcon className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                        <p className="text-sm text-gray-500">v{workflow.version} • {workflow.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {workflow.isTemplate && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                          Template
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(workflow.status)}`}>
                        {workflow.status === 'active' ? 'Ativo' :
                         workflow.status === 'inactive' ? 'Inativo' :
                         workflow.status === 'draft' ? 'Rascunho' :
                         'Erro'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{workflow.description}</p>

                  {/* Workflow Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm font-bold text-blue-600">{workflow.runCount}</div>
                      <div className="text-xs text-gray-600">Execuções</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm font-bold text-green-600">{workflow.successRate}%</div>
                      <div className="text-xs text-gray-600">Sucesso</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm font-bold text-purple-600">{formatDuration(workflow.averageDuration)}</div>
                      <div className="text-xs text-gray-600">Duração</div>
                    </div>
                  </div>

                  {/* Trigger Info */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <ClockIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {workflow.trigger.type === 'schedule' ? 'Agendado' :
                         workflow.trigger.type === 'event' ? 'Por Evento' :
                         workflow.trigger.type === 'manual' ? 'Manual' :
                         'Webhook'}
                      </span>
                    </div>
                    {workflow.nextRun && (
                      <div className="text-xs text-blue-700">
                        Próxima execução: {formatTime(workflow.nextRun)}
                      </div>
                    )}
                    {workflow.lastRun && (
                      <div className="text-xs text-blue-700">
                        Última execução: {formatTime(workflow.lastRun)}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {workflow.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                      {workflow.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          +{workflow.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {workflow.status === 'active' && !workflow.isTemplate && (
                      <button
                        onClick={() => handleRunWorkflow(workflow)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                      >
                        <PlayIcon className="h-4 w-4" />
                        <span>Executar</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleEditWorkflow(workflow)}
                      className={`${workflow.status === 'active' && !workflow.isTemplate ? '' : 'flex-1'} bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-1 text-sm`}
                    >
                      <EditIcon className="h-4 w-4" />
                      <span>{workflow.isTemplate ? 'Usar' : 'Editar'}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'executions' && (
          <motion.div
            key="executions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {executions.map((execution, index) => (
              <motion.div
                key={execution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewExecution(execution)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        execution.status === 'running' ? 'bg-blue-500 animate-pulse' :
                        execution.status === 'completed' ? 'bg-green-500' :
                        execution.status === 'failed' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></div>
                      <h3 className="text-lg font-semibold text-gray-900">{execution.workflowName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getExecutionStatusColor(execution.status)}`}>
                        {execution.status === 'running' ? 'Executando' :
                         execution.status === 'completed' ? 'Concluído' :
                         execution.status === 'failed' ? 'Falhou' :
                         'Cancelado'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div><strong>Trigger:</strong> {execution.trigger}</div>
                      <div><strong>Iniciado:</strong> {formatTime(execution.startTime)}</div>
                      {execution.duration && (
                        <div><strong>Duração:</strong> {formatDuration(execution.duration)}</div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {execution.status === 'running' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progresso</span>
                          <span className="font-medium">{execution.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${execution.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Steps Preview */}
                    <div className="flex space-x-2">
                      {execution.steps.slice(0, 4).map((step, i) => (
                        <div
                          key={step.id}
                          className={`flex-1 h-2 rounded-full ${
                            step.status === 'completed' ? 'bg-green-500' :
                            step.status === 'running' ? 'bg-blue-500' :
                            step.status === 'failed' ? 'bg-red-500' :
                            step.status === 'skipped' ? 'bg-yellow-500' :
                            'bg-gray-300'
                          }`}
                        ></div>
                      ))}
                      {execution.steps.length > 4 && (
                        <div className="text-xs text-gray-500 self-center">
                          +{execution.steps.length - 4}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'builder' && (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
          >
            <div className="text-center">
              <WorkflowIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Workflow Builder</h3>
              <p className="text-gray-600 mb-6">
                Crie workflows personalizados usando nosso editor visual drag & drop
              </p>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="text-center">
                      <PlusIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">Workflow em Branco</div>
                      <div className="text-xs text-gray-500">Comece do zero</div>
                    </div>
                  </div>
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="text-center">
                      <CopyIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-900">Usar Template</div>
                      <div className="text-xs text-gray-500">Baseado em templates</div>
                    </div>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Abrir Builder
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Execution Details Modal */}
      <AnimatePresence>
        {showExecutionModal && selectedExecution && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      selectedExecution.status === 'running' ? 'bg-blue-500 animate-pulse' :
                      selectedExecution.status === 'completed' ? 'bg-green-500' :
                      selectedExecution.status === 'failed' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}></div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedExecution.workflowName}</h2>
                      <p className="text-gray-600">Execução iniciada em {formatTime(selectedExecution.startTime)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowExecutionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Execution Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-blue-600">{selectedExecution.progress}%</div>
                    <div className="text-xs text-gray-600">Progresso</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-green-600">
                      {selectedExecution.steps.filter(s => s.status === 'completed').length}
                    </div>
                    <div className="text-xs text-gray-600">Concluídos</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-red-600">
                      {selectedExecution.steps.filter(s => s.status === 'failed').length}
                    </div>
                    <div className="text-xs text-gray-600">Falhas</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-bold text-purple-600">
                      {selectedExecution.duration ? formatDuration(selectedExecution.duration) : 'Em execução'}
                    </div>
                    <div className="text-xs text-gray-600">Duração</div>
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Etapas</h3>
                  <div className="space-y-3">
                    {selectedExecution.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            step.status === 'completed' ? 'bg-green-500 text-white' :
                            step.status === 'running' ? 'bg-blue-500 text-white' :
                            step.status === 'failed' ? 'bg-red-500 text-white' :
                            step.status === 'skipped' ? 'bg-yellow-500 text-white' :
                            'bg-gray-300 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{step.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStepStatusColor(step.status)}`}>
                              {step.status === 'pending' ? 'Pendente' :
                               step.status === 'running' ? 'Executando' :
                               step.status === 'completed' ? 'Concluído' :
                               step.status === 'failed' ? 'Falhou' :
                               'Ignorado'}
                            </span>
                          </div>
                          {step.duration && (
                            <div className="text-sm text-gray-600">
                              Duração: {formatDuration(step.duration)}
                            </div>
                          )}
                          {step.output && (
                            <div className="text-sm text-gray-600 mt-1">
                              <strong>Output:</strong> {step.output}
                            </div>
                          )}
                          {step.error && (
                            <div className="text-sm text-red-600 mt-1">
                              <strong>Erro:</strong> {step.error}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logs */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logs</h3>
                  <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm max-h-64 overflow-auto">
                    {selectedExecution.logs.map((log, index) => (
                      <div key={index} className="mb-1">
                        <span className="text-gray-400">[{formatTime(log.timestamp)}]</span>
                        <span className={`ml-2 ${
                          log.level === 'error' ? 'text-red-400' :
                          log.level === 'warn' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>
                          {log.level.toUpperCase()}
                        </span>
                        {log.step && <span className="text-blue-400 ml-2">[{log.step}]</span>}
                        <span className="ml-2">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Workflows; 