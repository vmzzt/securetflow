import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Icons
const IntegrationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TestIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8.002 8.002 0 0115.356 2M15 15v4a8.001 8.001 0 01-11.418-5M2.05 11A8.002 8.002 0 0115 4.582M4.582 9H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'notification' | 'repository' | 'ticketing' | 'monitoring' | 'ci_cd' | 'siem' | 'chat' | 'email';
  category: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  isActive: boolean;
  lastSync: string;
  syncFrequency: string;
  config: {
    [key: string]: any;
  };
  features: string[];
  events: string[];
  webhookUrl?: string;
  apiKey?: string;
  isConfigured: boolean;
  icon: string;
  color: string;
  version?: string;
  documentation: string;
  supportedEvents: string[];
  rateLimits?: {
    requests: number;
    period: string;
  };
  metrics: {
    totalNotifications: number;
    successRate: number;
    lastActivity: string;
    errorCount: number;
  };
}

interface IntegrationEvent {
  id: string;
  integrationId: string;
  integrationName: string;
  type: string;
  title: string;
  description: string;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  timestamp: string;
  retryCount: number;
  response?: string;
  error?: string;
}

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [events, setEvents] = useState<IntegrationEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'connected', label: 'Conectadas', icon: '✅' },
    { id: 'available', label: 'Disponíveis', icon: '🔌' },
    { id: 'events', label: 'Eventos', icon: '📝' }
  ];

  const integrationTypes = [
    { id: 'notification', name: 'Notificações', icon: '🔔', count: 0 },
    { id: 'repository', name: 'Repositórios', icon: '📦', count: 0 },
    { id: 'ticketing', name: 'Tickets', icon: '🎫', count: 0 },
    { id: 'monitoring', name: 'Monitoramento', icon: '📈', count: 0 },
    { id: 'ci_cd', name: 'CI/CD', icon: '🔄', count: 0 },
    { id: 'siem', name: 'SIEM', icon: '🛡️', count: 0 },
    { id: 'chat', name: 'Chat', icon: '💬', count: 0 },
    { id: 'email', name: 'Email', icon: '📧', count: 0 }
  ];

  useEffect(() => {
    loadIntegrations();
    loadEvents();
  }, []);

  const loadIntegrations = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIntegrations([
        {
          id: 'discord',
          name: 'Discord',
          description: 'Receba notificações de segurança no Discord',
          type: 'notification',
          category: 'Chat',
          status: 'connected',
          isActive: true,
          lastSync: '2024-01-15T10:30:00Z',
          syncFrequency: 'real-time',
          config: {
            webhookUrl: 'https://discord.com/api/webhooks/***',
            channel: '#security-alerts',
            mentionRoles: ['@security-team']
          },
          features: ['Alertas em tempo real', 'Formatação rica', 'Menções de roles', 'Threads'],
          events: ['vulnerability_found', 'scan_completed', 'critical_alert', 'system_health'],
          isConfigured: true,
          icon: '🎮',
          color: '#5865F2',
          documentation: 'https://discord.com/developers/docs/resources/webhook',
          supportedEvents: ['vulnerability_found', 'scan_completed', 'critical_alert', 'system_health', 'target_added'],
          rateLimits: {
            requests: 30,
            period: 'minute'
          },
          metrics: {
            totalNotifications: 1245,
            successRate: 98.5,
            lastActivity: '2024-01-15T10:25:00Z',
            errorCount: 18
          }
        },
        {
          id: 'slack',
          name: 'Slack',
          description: 'Integração com workspace do Slack',
          type: 'notification',
          category: 'Chat',
          status: 'connected',
          isActive: true,
          lastSync: '2024-01-15T10:28:00Z',
          syncFrequency: 'real-time',
          config: {
            botToken: 'xoxb-***',
            channel: '#security',
            workspace: 'company-workspace'
          },
          features: ['Bot interativo', 'Comandos slash', 'Notificações customizáveis', 'Workflows'],
          events: ['vulnerability_found', 'scan_completed', 'critical_alert'],
          isConfigured: true,
          icon: '💬',
          color: '#4A154B',
          documentation: 'https://api.slack.com/messaging/webhooks',
          supportedEvents: ['vulnerability_found', 'scan_completed', 'critical_alert', 'system_health'],
          rateLimits: {
            requests: 100,
            period: 'minute'
          },
          metrics: {
            totalNotifications: 892,
            successRate: 99.2,
            lastActivity: '2024-01-15T10:28:00Z',
            errorCount: 7
          }
        },
        {
          id: 'teams',
          name: 'Microsoft Teams',
          description: 'Notificações via Microsoft Teams',
          type: 'notification',
          category: 'Chat',
          status: 'disconnected',
          isActive: false,
          lastSync: '2024-01-10T15:20:00Z',
          syncFrequency: 'real-time',
          config: {
            webhookUrl: '',
            team: 'Security Team',
            channel: 'General'
          },
          features: ['Cards adaptáveis', 'Ações rápidas', 'Integração Office 365'],
          events: [],
          isConfigured: false,
          icon: '🏢',
          color: '#6264A7',
          documentation: 'https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/',
          supportedEvents: ['vulnerability_found', 'scan_completed', 'critical_alert'],
          metrics: {
            totalNotifications: 0,
            successRate: 0,
            lastActivity: '2024-01-10T15:20:00Z',
            errorCount: 0
          }
        },
        {
          id: 'gitlab',
          name: 'GitLab',
          description: 'Integração com repositórios GitLab',
          type: 'repository',
          category: 'DevOps',
          status: 'connected',
          isActive: true,
          lastSync: '2024-01-15T09:45:00Z',
          syncFrequency: 'hourly',
          config: {
            apiToken: 'glpat-***',
            baseUrl: 'https://gitlab.company.com',
            projects: ['security/scanner', 'web/frontend']
          },
          features: ['Merge requests', 'Issues', 'Pipeline triggers', 'Security reports'],
          events: ['scan_completed', 'vulnerability_found'],
          isConfigured: true,
          icon: '🦊',
          color: '#FC6D26',
          documentation: 'https://docs.gitlab.com/ee/api/',
          supportedEvents: ['scan_completed', 'vulnerability_found', 'target_added'],
          rateLimits: {
            requests: 2000,
            period: 'hour'
          },
          metrics: {
            totalNotifications: 156,
            successRate: 97.4,
            lastActivity: '2024-01-15T09:45:00Z',
            errorCount: 4
          }
        },
        {
          id: 'jira',
          name: 'Jira',
          description: 'Criação automática de tickets no Jira',
          type: 'ticketing',
          category: 'Project Management',
          status: 'connected',
          isActive: true,
          lastSync: '2024-01-15T08:15:00Z',
          syncFrequency: 'on-demand',
          config: {
            baseUrl: 'https://company.atlassian.net',
            username: 'security@company.com',
            apiToken: '***',
            project: 'SEC',
            issueType: 'Bug'
          },
          features: ['Auto ticket creation', 'Custom fields', 'Priority mapping', 'Assignee rules'],
          events: ['vulnerability_found'],
          isConfigured: true,
          icon: '🎫',
          color: '#0052CC',
          documentation: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/',
          supportedEvents: ['vulnerability_found', 'critical_alert'],
          rateLimits: {
            requests: 300,
            period: 'minute'
          },
          metrics: {
            totalNotifications: 89,
            successRate: 94.4,
            lastActivity: '2024-01-15T08:15:00Z',
            errorCount: 5
          }
        },
        {
          id: 'email',
          name: 'Email SMTP',
          description: 'Notificações por email via SMTP',
          type: 'email',
          category: 'Communication',
          status: 'connected',
          isActive: true,
          lastSync: '2024-01-15T10:20:00Z',
          syncFrequency: 'real-time',
          config: {
            smtpHost: 'smtp.company.com',
            smtpPort: 587,
            username: 'security@company.com',
            recipients: ['admin@company.com', 'security-team@company.com']
          },
          features: ['HTML templates', 'Anexos', 'Prioridade', 'Agendamento'],
          events: ['vulnerability_found', 'scan_completed', 'critical_alert', 'system_health'],
          isConfigured: true,
          icon: '📧',
          color: '#EA4335',
          documentation: 'https://nodemailer.com/smtp/',
          supportedEvents: ['vulnerability_found', 'scan_completed', 'critical_alert', 'system_health'],
          metrics: {
            totalNotifications: 2341,
            successRate: 99.8,
            lastActivity: '2024-01-15T10:20:00Z',
            errorCount: 5
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const loadEvents = async () => {
    // Simulate API call
    setTimeout(() => {
      setEvents([
        {
          id: 'event1',
          integrationId: 'discord',
          integrationName: 'Discord',
          type: 'vulnerability_found',
          title: 'Nova vulnerabilidade crítica encontrada',
          description: 'SQL Injection detectada em example.com/login',
          status: 'delivered',
          timestamp: '2024-01-15T10:25:00Z',
          retryCount: 0,
          response: 'Message sent successfully'
        },
        {
          id: 'event2',
          integrationId: 'slack',
          integrationName: 'Slack',
          type: 'scan_completed',
          title: 'Scan completo - example.com',
          description: '45 vulnerabilidades encontradas em 30 minutos',
          status: 'delivered',
          timestamp: '2024-01-15T09:45:00Z',
          retryCount: 0,
          response: 'ok'
        },
        {
          id: 'event3',
          integrationId: 'jira',
          integrationName: 'Jira',
          type: 'vulnerability_found',
          title: 'Ticket criado: SEC-1234',
          description: 'XSS vulnerability in user input validation',
          status: 'failed',
          timestamp: '2024-01-15T08:15:00Z',
          retryCount: 2,
          error: 'Authentication failed: Invalid API token'
        }
      ]);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-green-600 bg-green-100';
      case 'disconnected':
        return 'text-gray-600 bg-gray-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-blue-600 bg-blue-100';
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
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

  const handleConnect = (integration: Integration) => {
    console.log(`Connecting integration: ${integration.name}`);
    // In real implementation, this would initiate the connection flow
  };

  const handleDisconnect = (integration: Integration) => {
    console.log(`Disconnecting integration: ${integration.name}`);
    // In real implementation, this would disconnect the integration
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConfigModal(true);
  };

  const handleTest = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowTestModal(true);
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || integration.type === filterType;
    const matchesStatus = !filterStatus || integration.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getFilteredIntegrationsByTab = () => {
    switch (activeTab) {
      case 'connected':
        return filteredIntegrations.filter(integration => integration.status === 'connected');
      case 'available':
        return filteredIntegrations.filter(integration => integration.status !== 'connected');
      default:
        return filteredIntegrations;
    }
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;
  const activeCount = integrations.filter(i => i.isActive).length;
  const totalEvents = events.length;
  const successRate = events.length > 0 ? 
    (events.filter(e => e.status === 'delivered').length / events.length * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando integrações...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
          <p className="text-gray-600 mt-2">
            Conecte com suas ferramentas favoritas - {connectedCount}/{integrations.length} conectadas
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>Nova Integração</span>
          </button>
          <button 
            onClick={loadIntegrations}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshIcon className="h-4 w-4" />
            <span>Atualizar</span>
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
              <IntegrationIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{integrations.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conectadas</p>
              <p className="text-2xl font-semibold text-gray-900">{connectedCount}</p>
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
              <p className="text-sm font-medium text-gray-600">Ativas</p>
              <p className="text-2xl font-semibold text-gray-900">{activeCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-blue-600">{successRate}%</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taxa de Sucesso</p>
              <p className="text-2xl font-semibold text-gray-900">{totalEvents}</p>
              <p className="text-xs text-gray-500">eventos enviados</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar integrações..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os tipos</option>
            <option value="notification">Notificações</option>
            <option value="repository">Repositórios</option>
            <option value="ticketing">Tickets</option>
            <option value="monitoring">Monitoramento</option>
            <option value="email">Email</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="connected">Conectadas</option>
            <option value="disconnected">Desconectadas</option>
            <option value="error">Com erro</option>
            <option value="pending">Pendentes</option>
          </select>
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {(activeTab === 'overview' || activeTab === 'connected' || activeTab === 'available') && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {getFilteredIntegrationsByTab().map((integration, index) => (
                <motion.div
                  key={integration.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Integration Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: integration.color + '20' }}
                      >
                        {integration.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                        <p className="text-sm text-gray-500">{integration.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {integration.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(integration.status)}`}>
                        {integration.status === 'connected' ? 'Conectada' :
                         integration.status === 'disconnected' ? 'Desconectada' :
                         integration.status === 'error' ? 'Erro' :
                         'Pendente'}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

                  {/* Integration Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-blue-600">{integration.metrics.totalNotifications}</div>
                      <div className="text-xs text-gray-600">Notificações</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-lg font-bold text-green-600">{integration.metrics.successRate}%</div>
                      <div className="text-xs text-gray-600">Sucesso</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Recursos:</div>
                    <div className="flex flex-wrap gap-1">
                      {integration.features.slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {integration.features.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          +{integration.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {integration.status === 'connected' ? (
                      <>
                        <button
                          onClick={() => handleConfigure(integration)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                        >
                          <SettingsIcon className="h-4 w-4" />
                          <span>Configurar</span>
                        </button>
                        <button
                          onClick={() => handleTest(integration)}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <TestIcon className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(integration)}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                      >
                        <IntegrationIcon className="h-4 w-4" />
                        <span>Conectar</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'events' && (
          <motion.div
            key="events"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        event.status === 'delivered' ? 'bg-green-500' :
                        event.status === 'sent' ? 'bg-blue-500' :
                        event.status === 'pending' ? 'bg-yellow-500 animate-pulse' :
                        'bg-red-500'
                      }`}></div>
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getEventStatusColor(event.status)}`}>
                        {event.status === 'sent' ? 'Enviado' :
                         event.status === 'delivered' ? 'Entregue' :
                         event.status === 'failed' ? 'Falhou' :
                         'Pendente'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div><strong>Integração:</strong> {event.integrationName}</div>
                      <div><strong>Tipo:</strong> {event.type}</div>
                      <div><strong>Descrição:</strong> {event.description}</div>
                      <div><strong>Timestamp:</strong> {formatTime(event.timestamp)}</div>
                      {event.retryCount > 0 && (
                        <div><strong>Tentativas:</strong> {event.retryCount}</div>
                      )}
                    </div>

                    {/* Response/Error */}
                    {event.response && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <div className="text-sm font-medium text-green-800 mb-1">Resposta:</div>
                        <div className="text-sm text-green-700">{event.response}</div>
                      </div>
                    )}

                    {event.error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                        <div className="text-sm font-medium text-red-800 mb-1">Erro:</div>
                        <div className="text-sm text-red-700">{event.error}</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && selectedIntegration && (
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
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: selectedIntegration.color + '20' }}
                    >
                      {selectedIntegration.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Configurar {selectedIntegration.name}</h2>
                      <p className="text-gray-600">{selectedIntegration.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Configuration Form */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedIntegration.config).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                        </label>
                        <input
                          type={key.includes('token') || key.includes('password') ? 'password' : 'text'}
                          defaultValue={typeof value === 'string' ? value : JSON.stringify(value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Supported Events */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Eventos Suportados</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedIntegration.supportedEvents.map((event, i) => (
                      <label key={i} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          defaultChecked={selectedIntegration.events.includes(event)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rate Limits */}
                {selectedIntegration.rateLimits && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Limites de Taxa</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="text-sm text-yellow-800">
                        <strong>Limite:</strong> {selectedIntegration.rateLimits.requests} requisições por {selectedIntegration.rateLimits.period}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleTest(selectedIntegration)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Testar
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Modal */}
      <AnimatePresence>
        {showTestModal && selectedIntegration && (
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
              className="bg-white rounded-lg shadow-xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Testar {selectedIntegration.name}</h2>
                  <button
                    onClick={() => setShowTestModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Teste
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="vulnerability_found">Vulnerabilidade Encontrada</option>
                    <option value="scan_completed">Scan Completo</option>
                    <option value="critical_alert">Alerta Crítico</option>
                    <option value="system_health">Status do Sistema</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem de Teste
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Esta é uma mensagem de teste do SecureFlow SSC. Se você receber esta notificação, a integração está funcionando corretamente."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowTestModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Enviar Teste
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Integrations; 