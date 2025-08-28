import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Icons
const ServerIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
  </svg>
);

const WifiIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface SystemStatus {
  id: string;
  name: string;
  type: 'server' | 'database' | 'api' | 'scanner' | 'network';
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  uptime: number;
  responseTime: number;
  load: number;
  memory: number;
  disk: number;
  lastCheck: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  system: string;
}

interface PerformanceMetric {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  responseTime: number;
}

const Monitoring: React.FC = () => {
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  useEffect(() => {
    loadMonitoringData();
    
    if (autoRefresh) {
      const interval = setInterval(loadMonitoringData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadMonitoringData = () => {
    // Simulate real-time data
    setSystemStatuses([
      {
        id: 'web-server',
        name: 'Servidor Web',
        type: 'server',
        status: 'online',
        uptime: 99.8,
        responseTime: 45,
        load: 23,
        memory: 67,
        disk: 34,
        lastCheck: new Date().toISOString(),
        icon: ServerIcon
      },
      {
        id: 'database',
        name: 'Banco de Dados',
        type: 'database',
        status: 'online',
        uptime: 99.9,
        responseTime: 12,
        load: 15,
        memory: 45,
        disk: 78,
        lastCheck: new Date().toISOString(),
        icon: DatabaseIcon
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        type: 'api',
        status: 'online',
        uptime: 99.7,
        responseTime: 89,
        load: 31,
        memory: 52,
        disk: 23,
        lastCheck: new Date().toISOString(),
        icon: WifiIcon
      },
      {
        id: 'scanner-engine',
        name: 'Scanner Engine',
        type: 'scanner',
        status: 'warning',
        uptime: 98.5,
        responseTime: 156,
        load: 78,
        memory: 89,
        disk: 45,
        lastCheck: new Date().toISOString(),
        icon: ServerIcon
      },
      {
        id: 'network-monitor',
        name: 'Monitor de Rede',
        type: 'network',
        status: 'online',
        uptime: 99.6,
        responseTime: 23,
        load: 12,
        memory: 34,
        disk: 12,
        lastCheck: new Date().toISOString(),
        icon: WifiIcon
      }
    ]);

    setAlerts([
      {
        id: '1',
        severity: 'high',
        title: 'Alto uso de CPU no Scanner Engine',
        description: 'O Scanner Engine está utilizando 78% da CPU, acima do limite recomendado de 70%',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        acknowledged: false,
        system: 'scanner-engine'
      },
      {
        id: '2',
        severity: 'medium',
        title: 'Tempo de resposta elevado na API',
        description: 'A API Gateway está respondendo em 89ms, acima da média de 50ms',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        acknowledged: true,
        system: 'api-gateway'
      },
      {
        id: '3',
        severity: 'low',
        title: 'Espaço em disco baixo',
        description: 'O banco de dados está com 78% de uso do disco',
        timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        acknowledged: false,
        system: 'database'
      }
    ]);

    // Generate performance data for the last 24 hours
    const performanceData = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 3600000);
      performanceData.push({
        timestamp: timestamp.toISOString(),
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 100,
        responseTime: Math.random() * 200 + 50
      });
    }
    setPerformanceData(performanceData);

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(1)}%`;
  };

  const formatResponseTime = (ms: number) => {
    return `${ms}ms`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando monitoramento...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Monitoramento</h1>
          <p className="text-gray-600 mt-2">
            Monitoramento em tempo real do sistema Securet Flow SSC
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Auto-refresh</span>
          </label>
          <button
            onClick={loadMonitoringData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </motion.div>

      {/* System Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        {systemStatuses.map((system, index) => {
          const IconComponent = system.icon;
          return (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm p-6 border border-gray-200 cursor-pointer transition-all hover:shadow-md ${
                selectedSystem === system.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedSystem(selectedSystem === system.id ? null : system.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    system.status === 'online' ? 'bg-green-50' :
                    system.status === 'offline' ? 'bg-red-50' :
                    system.status === 'warning' ? 'bg-yellow-50' :
                    'bg-blue-50'
                  }`}>
                    <IconComponent className={`h-5 w-5 ${
                      system.status === 'online' ? 'text-green-600' :
                      system.status === 'offline' ? 'text-red-600' :
                      system.status === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{system.name}</h3>
                    <p className="text-sm text-gray-500">{system.type}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(system.status)}`}>
                  {system.status === 'online' ? 'Online' :
                   system.status === 'offline' ? 'Offline' :
                   system.status === 'warning' ? 'Atenção' :
                   'Manutenção'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-medium">{formatUptime(system.uptime)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Resposta</span>
                  <span className="font-medium">{formatResponseTime(system.responseTime)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CPU</span>
                  <span className="font-medium">{system.load}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Memória</span>
                  <span className="font-medium">{system.memory}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Disco</span>
                  <span className="font-medium">{system.disk}%</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">CPU</span>
                    <span className="text-gray-500">{system.load}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        system.load > 80 ? 'bg-red-500' :
                        system.load > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${system.load}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Memória</span>
                    <span className="text-gray-500">{system.memory}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        system.memory > 80 ? 'bg-red-500' :
                        system.memory > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${system.memory}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Disco</span>
                    <span className="text-gray-500">{system.disk}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        system.disk > 80 ? 'bg-red-500' :
                        system.disk > 60 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${system.disk}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Alerts and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Alertas do Sistema</h2>
            <span className="text-sm text-gray-500">
              {alerts.filter(a => !a.acknowledged).length} não reconhecidos
            </span>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{alert.title}</h3>
                      <p className="text-sm opacity-90 mt-1">{alert.description}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(alert.timestamp).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
                        >
                          Reconhecer
                        </button>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        alert.acknowledged ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {alert.acknowledged ? 'Reconhecido' : 'Pendente'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance do Sistema</h2>
          
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <ServerIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Gráfico de performance</p>
              <p className="text-sm text-gray-400">Chart.js / D3.js integration</p>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.8%</div>
              <div className="text-sm text-gray-600">Uptime Geral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">245ms</div>
              <div className="text-sm text-gray-600">Tempo Médio de Resposta</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Health Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumo de Saúde do Sistema</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {systemStatuses.filter(s => s.status === 'online').length}
            </div>
            <div className="text-sm text-gray-600">Sistemas Online</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {systemStatuses.filter(s => s.status === 'warning').length}
            </div>
            <div className="text-sm text-gray-600">Atenção</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {alerts.filter(a => !a.acknowledged).length}
            </div>
            <div className="text-sm text-gray-600">Alertas Ativos</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {formatUptime(systemStatuses.reduce((acc, sys) => acc + sys.uptime, 0) / systemStatuses.length)}
            </div>
            <div className="text-sm text-gray-600">Uptime Médio</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Monitoring; 