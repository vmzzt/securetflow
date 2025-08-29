import React, { useEffect, useState } from 'react';
import { 
  ShieldCheckIcon, 
  MagnifyingGlassIcon, 
  BugAntIcon, 
  ChartBarIcon,
  PlayIcon,
  PlusIcon,
  DocumentTextIcon,
  BrainIcon,
  ServerIcon,
  CpuChipIcon,
  BrainIcon as BrainIcon2,
  PlugIcon,
  ClockIcon,
  CrosshairIcon,
  DocumentTextIcon as DocumentIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Metric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  color: string;
}

interface RecentScan {
  id: string;
  name: string;
  target: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  time: string;
  tools: string[];
}

interface SystemService {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  icon: React.ComponentType<any>;
}

interface AIInsight {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
}

interface RecentActivity {
  id: string;
  type: 'scan' | 'target' | 'report';
  action: string;
  user: string;
  time: string;
  icon: React.ComponentType<any>;
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      id: 'active-scans',
      title: 'Scans Ativos',
      value: '8',
      change: '+12% vs ontem',
      changeType: 'positive',
      icon: MagnifyingGlassIcon,
      color: 'bg-blue-500'
    },
    {
      id: 'critical-vulns',
      title: 'Vulnerabilidades Críticas',
      value: '15',
      change: '+3 novas',
      changeType: 'negative',
      icon: BugAntIcon,
      color: 'bg-red-500'
    },
    {
      id: 'protected-targets',
      title: 'Targets Protegidos',
      value: '142/150',
      change: '+5 protegidos',
      changeType: 'positive',
      icon: ShieldCheckIcon,
      color: 'bg-green-500'
    },
    {
      id: 'risk-score',
      title: 'Score de Risco',
      value: '7.2/10',
      change: '-0.3 vs semana passada',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'bg-yellow-500'
    }
  ]);

  const [recentScans, setRecentScans] = useState<RecentScan[]>([
    {
      id: '1',
      name: 'Vulnerability Scan',
      target: 'example.com',
      status: 'running',
      progress: 65,
      time: '2 minutos atrás',
      tools: ['Nuclei', 'ZAP']
    },
    {
      id: '2',
      name: 'Port Scan',
      target: 'api.example.com',
      status: 'running',
      progress: 30,
      time: '5 minutos atrás',
      tools: ['Nmap']
    },
    {
      id: '3',
      name: 'Security Scan',
      target: 'admin.example.com',
      status: 'failed',
      progress: 0,
      time: '10 minutos atrás',
      tools: ['Nuclei']
    }
  ]);

  const [systemServices, setSystemServices] = useState<SystemService[]>([
    {
      id: 'database',
      name: 'Database',
      status: 'online',
      icon: ServerIcon
    },
    {
      id: 'scan-engine',
      name: 'Scan Engine',
      status: 'online',
      icon: CpuChipIcon
    },
    {
      id: 'ai-service',
      name: 'AI Service',
      status: 'warning',
      icon: BrainIcon2
    },
    {
      id: 'integrations',
      name: 'Integrations',
      status: 'online',
      icon: PlugIcon
    }
  ]);

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Padrão de Ataque Detectado',
      message: 'Múltiplas tentativas de SQL injection detectadas em /login',
      time: '5 min atrás'
    },
    {
      id: '2',
      type: 'info',
      title: 'Recomendação de Segurança',
      message: 'Implementar rate limiting para prevenir ataques de força bruta',
      time: '15 min atrás'
    },
    {
      id: '3',
      type: 'success',
      title: 'Melhoria de Performance',
      message: 'Scan otimizado reduzido de 45 para 25 minutos',
      time: '1 hora atrás'
    }
  ]);

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'scan',
      action: 'Scan iniciado em example.com',
      user: 'Admin',
      time: '2 min atrás',
      icon: MagnifyingGlassIcon
    },
    {
      id: '2',
      type: 'target',
      action: 'Novo target adicionado: api.example.com',
      user: 'Admin',
      time: '5 min atrás',
      icon: CrosshairIcon
    },
    {
      id: '3',
      type: 'report',
      action: 'Relatório de compliance gerado',
      user: 'Admin',
      time: '10 min atrás',
      icon: DocumentIcon
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'warning': return 'Lento';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  };

  const getScanStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScanStatusText = (status: string) => {
    switch (status) {
      case 'running': return 'Executando';
      case 'completed': return 'Concluído';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">🛡️ Securet Flow SSC</h1>
        <p className="text-blue-100 mb-4">Plataforma Enterprise-Grade de Security Testing</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">150</div>
            <div className="text-sm text-blue-200">Targets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">8</div>
            <div className="text-sm text-blue-200">Scans Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">1,250</div>
            <div className="text-sm text-blue-200">Vulnerabilidades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">96.5%</div>
            <div className="text-sm text-blue-200">Taxa de Sucesso</div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
                <metric.icon className={`w-6 h-6 ${metric.color.replace('bg-', 'text-')}`} />
              </div>
              <div className={`text-sm ${
                metric.changeType === 'positive' ? 'text-green-600' :
                metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PlayIcon className="w-5 h-5 mr-2 text-blue-600" />
              Ações Rápidas
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">Ver todas</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <PlayIcon className="w-5 h-5 mr-2 text-green-600" />
              <span className="text-sm font-medium">Novo Scan</span>
            </button>
            <button className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <PlusIcon className="w-5 h-5 mr-2 text-blue-600" />
              <span className="text-sm font-medium">Adicionar Target</span>
            </button>
            <button className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <DocumentTextIcon className="w-5 h-5 mr-2 text-purple-600" />
              <span className="text-sm font-medium">Gerar Relatório</span>
            </button>
            <button className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BrainIcon className="w-5 h-5 mr-2 text-indigo-600" />
              <span className="text-sm font-medium">Análise IA</span>
            </button>
          </div>
        </motion.div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
              Scans Recentes
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700">Ver todos</button>
          </div>
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MagnifyingGlassIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{scan.name}</h4>
                  <p className="text-xs text-gray-500">{scan.target} • {scan.time}</p>
                  {scan.status === 'running' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${scan.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{scan.progress}% completo</p>
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScanStatusColor(scan.status)}`}>
                  {getScanStatusText(scan.status)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ServerIcon className="w-5 h-5 mr-2 text-blue-600" />
              Status do Sistema
            </h3>
          </div>
          <div className="space-y-3">
            {systemServices.map((service) => (
              <div key={service.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <service.icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{service.name}</h4>
                  <p className="text-xs text-gray-500">{getStatusText(service.status)}</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`}></div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BrainIcon className="w-5 h-5 mr-2 text-blue-600" />
              Insights da IA
            </h3>
          </div>
          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`p-3 border-l-4 rounded-r-lg ${
                insight.type === 'warning' ? 'border-yellow-400 bg-yellow-50' :
                insight.type === 'info' ? 'border-blue-400 bg-blue-50' :
                'border-green-400 bg-green-50'
              }`}>
                <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                <p className="text-xs text-gray-500 mt-2">{insight.time}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2 text-blue-600" />
            Atividade Recente
          </h3>
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
              <div className="p-2 bg-gray-100 rounded-lg">
                <activity.icon className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">por {activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard; 