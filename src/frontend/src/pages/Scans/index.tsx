import React, { useState } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface Scan {
  id: string;
  name: string;
  target: string;
  type: 'vulnerability' | 'port' | 'web' | 'custom';
  status: 'running' | 'paused' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  estimatedTime: string;
  tools: string[];
  results: {
    vulnerabilities: number;
    critical: number;
    high: number;
    medium: number;
  };
}

const Scans: React.FC = () => {
  const [scans, setScans] = useState<Scan[]>([
    {
      id: '1',
      name: 'Vulnerability Scan',
      target: 'example.com',
      type: 'vulnerability',
      status: 'running',
      progress: 65,
      startTime: '25 min atrás',
      estimatedTime: '15 min restantes',
      tools: ['Nuclei', 'ZAP'],
      results: { vulnerabilities: 0, critical: 0, high: 0, medium: 0 }
    },
    {
      id: '2',
      name: 'Port Scan',
      target: 'api.example.com',
      type: 'port',
      status: 'running',
      progress: 30,
      startTime: '10 min atrás',
      estimatedTime: '20 min restantes',
      tools: ['Nmap'],
      results: { vulnerabilities: 0, critical: 0, high: 0, medium: 0 }
    },
    {
      id: '3',
      name: 'Security Scan',
      target: 'admin.example.com',
      type: 'web',
      status: 'failed',
      progress: 0,
      startTime: '1 hora atrás',
      estimatedTime: 'N/A',
      tools: ['Nuclei'],
      results: { vulnerabilities: 0, critical: 0, high: 0, medium: 0 }
    },
    {
      id: '4',
      name: 'Comprehensive Scan',
      target: 'test.example.com',
      type: 'custom',
      status: 'completed',
      progress: 100,
      startTime: '2 horas atrás',
      estimatedTime: 'Concluído',
      tools: ['Nuclei', 'ZAP', 'Nmap'],
      results: { vulnerabilities: 15, critical: 3, high: 7, medium: 5 }
    }
  ]);

  const [activeTab, setActiveTab] = useState('active');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <PlayIcon className="w-4 h-4" />;
      case 'paused': return <PauseIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'failed': return <XCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vulnerability': return 'bg-red-100 text-red-800';
      case 'port': return 'bg-blue-100 text-blue-800';
      case 'web': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredScans = scans.filter(scan => {
    if (activeTab === 'active') return scan.status === 'running' || scan.status === 'paused';
    if (activeTab === 'completed') return scan.status === 'completed';
    if (activeTab === 'failed') return scan.status === 'failed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scans</h1>
          <p className="text-gray-600">Gerencie seus scans de segurança</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <PlayIcon className="w-5 h-5 mr-2" />
          Novo Scan
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'active', name: 'Scans Ativos', count: scans.filter(s => s.status === 'running' || s.status === 'paused').length },
              { id: 'completed', name: 'Concluídos', count: scans.filter(s => s.status === 'completed').length },
              { id: 'failed', name: 'Falharam', count: scans.filter(s => s.status === 'failed').length },
              { id: 'all', name: 'Todos', count: scans.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Scans List */}
        <div className="p-6">
          <div className="space-y-4">
            {filteredScans.map((scan) => (
              <div key={scan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{scan.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(scan.type)}`}>
                        {scan.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(scan.status)} flex items-center`}>
                        {getStatusIcon(scan.status)}
                        <span className="ml-1">
                          {scan.status === 'running' ? 'Executando' :
                           scan.status === 'paused' ? 'Pausado' :
                           scan.status === 'completed' ? 'Concluído' :
                           'Falhou'}
                        </span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">Target: {scan.target}</p>
                    
                    {scan.status === 'running' && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progresso</span>
                          <span>{scan.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${scan.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Iniciado:</span>
                        <p className="font-medium">{scan.startTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Tempo Estimado:</span>
                        <p className="font-medium">{scan.estimatedTime}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Ferramentas:</span>
                        <p className="font-medium">{scan.tools.join(', ')}</p>
                      </div>
                      {scan.status === 'completed' && (
                        <div>
                          <span className="text-gray-500">Vulnerabilidades:</span>
                          <p className="font-medium">{scan.results.vulnerabilities}</p>
                        </div>
                      )}
                    </div>

                    {scan.status === 'completed' && scan.results.vulnerabilities > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Resultados:</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-red-600 font-semibold">{scan.results.critical}</div>
                            <div className="text-gray-500">Críticas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-orange-600 font-semibold">{scan.results.high}</div>
                            <div className="text-gray-500">Altas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-600 font-semibold">{scan.results.medium}</div>
                            <div className="text-gray-500">Médias</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {scan.status === 'running' && (
                      <>
                        <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                          <PauseIcon className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <StopIcon className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {scan.status === 'paused' && (
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <PlayIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <MagnifyingGlassIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredScans.length === 0 && (
            <div className="text-center py-12">
              <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum scan encontrado</h3>
              <p className="text-gray-500">Não há scans {activeTab === 'active' ? 'ativos' : activeTab === 'completed' ? 'concluídos' : 'que falharam'}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scans; 