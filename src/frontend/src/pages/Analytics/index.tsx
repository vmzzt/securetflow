import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  scans: {
    total: number;
    successful: number;
    failed: number;
    averageDuration: number;
  };
  targets: {
    total: number;
    active: number;
    inactive: number;
  };
  performance: {
    responseTime: number;
    throughput: number;
    errorRate: number;
    uptime: number;
  };
}

interface TimeRange {
  value: string;
  label: string;
}

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const timeRanges: TimeRange[] = [
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
    { value: '1y', label: 'Último ano' }
  ];

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'vulnerabilities', label: 'Vulnerabilidades', icon: '🐛' },
    { id: 'scans', label: 'Scans', icon: '🔍' },
    { id: 'targets', label: 'Targets', icon: '🎯' },
    { id: 'performance', label: 'Performance', icon: '⚡' }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setData({
        vulnerabilities: {
          total: 156,
          critical: 12,
          high: 34,
          medium: 67,
          low: 43
        },
        scans: {
          total: 89,
          successful: 82,
          failed: 7,
          averageDuration: 45
        },
        targets: {
          total: 24,
          active: 18,
          inactive: 6
        },
        performance: {
          responseTime: 2.3,
          throughput: 95.2,
          errorRate: 1.8,
          uptime: 99.9
        }
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-center">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar dados</h3>
          <p className="mt-1 text-sm text-gray-500">Tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 Analytics
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Análises detalhadas e métricas do sistema
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          
          {/* Export Button */}
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Vulnerability Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Vulnerabilidades
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {data.vulnerabilities.total}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-red-600">Críticas: {data.vulnerabilities.critical}</span>
                  <span className="text-orange-600">Altas: {data.vulnerabilities.high}</span>
                </div>
              </div>
            </div>

            {/* Scan Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-8 w-8 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Scans Executados
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {data.scans.total}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Sucesso: {data.scans.successful}</span>
                  <span className="text-red-600">Falhas: {data.scans.failed}</span>
                </div>
              </div>
            </div>

            {/* Target Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ServerIcon className="h-8 w-8 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Targets
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {data.targets.total}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Ativos: {data.targets.active}</span>
                  <span className="text-gray-600">Inativos: {data.targets.inactive}</span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowTrendingUpIcon className="h-8 w-8 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Uptime
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {data.performance.uptime}%
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Throughput: {data.performance.throughput}%</span>
                  <span className="text-red-600">Erro: {data.performance.errorRate}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vulnerabilities' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Análise de Vulnerabilidades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{data.vulnerabilities.critical}</div>
                <div className="text-sm text-red-600">Críticas</div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{data.vulnerabilities.high}</div>
                <div className="text-sm text-orange-600">Altas</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{data.vulnerabilities.medium}</div>
                <div className="text-sm text-yellow-600">Médias</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.vulnerabilities.low}</div>
                <div className="text-sm text-green-600">Baixas</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scans' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Estatísticas de Scans
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.scans.total}</div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.scans.successful}</div>
                <div className="text-sm text-green-600">Sucessos</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{data.scans.failed}</div>
                <div className="text-sm text-red-600">Falhas</div>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-lg font-medium text-gray-900 dark:text-white">
                  Duração Média: {data.scans.averageDuration} minutos
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'targets' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Status dos Targets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.targets.total}</div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.targets.active}</div>
                <div className="text-sm text-green-600">Ativos</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{data.targets.inactive}</div>
                <div className="text-sm text-gray-600">Inativos</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Métricas de Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{data.performance.responseTime}s</div>
                <div className="text-sm text-blue-600">Tempo de Resposta</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{data.performance.throughput}%</div>
                <div className="text-sm text-green-600">Throughput</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{data.performance.errorRate}%</div>
                <div className="text-sm text-red-600">Taxa de Erro</div>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{data.performance.uptime}%</div>
                <div className="text-sm text-purple-600">Uptime</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 