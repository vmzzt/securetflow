import React, { useState } from 'react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
  }[];
}

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('vulnerabilities');

  const vulnerabilityData: ChartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Vulnerabilidades Críticas',
        data: [12, 19, 15, 25, 22, 18, 24],
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        borderColor: 'rgba(239, 68, 68, 1)'
      },
      {
        label: 'Vulnerabilidades Altas',
        data: [8, 12, 10, 18, 15, 12, 16],
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: 'rgba(245, 158, 11, 1)'
      }
    ]
  };

  const scanData: ChartData = {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Scans Completados',
        data: [45, 52, 48, 65, 58, 42, 55],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)'
      }
    ]
  };

  const getCurrentData = () => {
    return selectedMetric === 'vulnerabilities' ? vulnerabilityData : scanData;
  };

  const renderChart = () => {
    const data = getCurrentData();
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {selectedMetric === 'vulnerabilities' ? 'Vulnerabilidades por Dia' : 'Scans por Dia'}
          </h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedMetric('vulnerabilities')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === 'vulnerabilities'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Vulnerabilidades
            </button>
            <button
              onClick={() => setSelectedMetric('scans')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === 'scans'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Scans
            </button>
          </div>
        </div>
        
        {/* Simulated Chart */}
        <div className="h-64 flex items-end justify-between space-x-2">
          {data.datasets[0].data.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-blue-500 dark:bg-blue-400 rounded-t"
                style={{ height: `${(value / Math.max(...data.datasets[0].data)) * 200}px` }}
              ></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {data.labels[index]}
              </span>
            </div>
          ))}
        </div>
        
        {data.datasets.length > 1 && (
          <div className="mt-4 flex justify-center space-x-4">
            {data.datasets.map((dataset, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: dataset.backgroundColor }}
                ></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">{dataset.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Análise detalhada de dados de segurança</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          <button className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
            Exportar Dados
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total de Scans</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1,247</p>
              <p className="text-sm text-green-600 dark:text-green-400">+12% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Vulnerabilidades</h3>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">342</p>
              <p className="text-sm text-red-600 dark:text-red-400">+8% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Taxa de Sucesso</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">94.2%</p>
              <p className="text-sm text-green-600 dark:text-green-400">+2.1% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Tempo Médio</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">2.4h</p>
              <p className="text-sm text-green-600 dark:text-green-400">-15% vs mês anterior</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderChart()}
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribuição por Severidade</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Crítica</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">25%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Alta</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">35%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Média</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">30%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">Baixa</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Targets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top Targets por Vulnerabilidades</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {[
            { target: '192.168.1.100', vulns: 45, severity: 'high' },
            { target: 'example.com', vulns: 32, severity: 'medium' },
            { target: 'api.company.com', vulns: 28, severity: 'high' },
            { target: 'mail.server.com', vulns: 22, severity: 'low' },
            { target: 'db.internal.com', vulns: 18, severity: 'critical' }
          ].map((item, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium text-gray-900 dark:text-white">#{index + 1}</span>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.target}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.vulns} vulnerabilidades</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                  item.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' :
                  item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                }`}>
                  {item.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 