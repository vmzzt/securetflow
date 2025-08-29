import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Icons
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StopIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

interface Scan {
  id: string;
  name: string;
  target: string;
  type: 'full' | 'quick' | 'custom' | 'scheduled';
  status: 'running' | 'completed' | 'failed' | 'queued' | 'stopped';
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  tools: string[];
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdBy: string;
  createdAt: string;
}

const Scans: React.FC = () => {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewScanModal, setShowNewScanModal] = useState(false);
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = () => {
    // Simulate API call
    setTimeout(() => {
      const mockScans: Scan[] = [
        {
          id: '1',
          name: 'Full Security Scan - Example.com',
          target: 'example.com',
          type: 'full',
          status: 'completed',
          progress: 100,
          startTime: '2024-01-15T10:30:00Z',
          endTime: '2024-01-15T11:15:00Z',
          duration: '45m',
          vulnerabilities: {
            critical: 0,
            high: 2,
            medium: 5,
            low: 8,
            info: 12
          },
          tools: ['nmap', 'nuclei', 'sqlmap', 'dirb'],
          description: 'Comprehensive security scan of the main website',
          priority: 'high',
          createdBy: 'admin@securet-flow.com',
          createdAt: '2024-01-15T10:25:00Z'
        },
        {
          id: '2',
          name: 'API Security Test - API Gateway',
          target: 'api.example.com',
          type: 'custom',
          status: 'running',
          progress: 65,
          startTime: '2024-01-15T09:15:00Z',
          vulnerabilities: {
            critical: 1,
            high: 3,
            medium: 7,
            low: 4,
            info: 6
          },
          tools: ['nuclei', 'sqlmap', 'custom-api-tester'],
          description: 'API security testing with custom rules',
          priority: 'critical',
          createdBy: 'security@securet-flow.com',
          createdAt: '2024-01-15T09:10:00Z'
        },
        {
          id: '3',
          name: 'Quick Vulnerability Check - Staging',
          target: 'staging.example.com',
          type: 'quick',
          status: 'completed',
          progress: 100,
          startTime: '2024-01-14T16:45:00Z',
          endTime: '2024-01-14T17:00:00Z',
          duration: '15m',
          vulnerabilities: {
            critical: 0,
            high: 0,
            medium: 2,
            low: 5,
            info: 8
          },
          tools: ['nuclei'],
          description: 'Quick vulnerability assessment for staging environment',
          priority: 'medium',
          createdBy: 'dev@securet-flow.com',
          createdAt: '2024-01-14T16:40:00Z'
        },
        {
          id: '4',
          name: 'Network Discovery - Internal Network',
          target: '192.168.1.0/24',
          type: 'full',
          status: 'failed',
          progress: 23,
          startTime: '2024-01-10T14:30:00Z',
          endTime: '2024-01-10T15:45:00Z',
          duration: '1h 15m',
          vulnerabilities: {
            critical: 3,
            high: 8,
            medium: 12,
            low: 15,
            info: 20
          },
          tools: ['nmap', 'masscan', 'nuclei'],
          description: 'Network discovery and vulnerability assessment',
          priority: 'high',
          createdBy: 'admin@securet-flow.com',
          createdAt: '2024-01-10T14:25:00Z'
        },
        {
          id: '5',
          name: 'Scheduled Daily Scan - Production',
          target: 'example.com',
          type: 'scheduled',
          status: 'queued',
          progress: 0,
          startTime: '2024-01-16T02:00:00Z',
          vulnerabilities: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            info: 0
          },
          tools: ['nuclei', 'nmap'],
          description: 'Daily automated security scan',
          priority: 'medium',
          createdBy: 'system@securet-flow.com',
          createdAt: '2024-01-15T23:55:00Z'
        }
      ];
      setScans(mockScans);
      setLoading(false);
    }, 1000);
  };

  const filteredScans = scans.filter(scan => {
    const matchesSearch = scan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scan.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || scan.status === filterStatus;
    const matchesType = filterType === 'all' || scan.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'queued':
        return 'text-yellow-600 bg-yellow-100';
      case 'stopped':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full':
        return '🔍';
      case 'quick':
        return '⚡';
      case 'custom':
        return '⚙️';
      case 'scheduled':
        return '📅';
      default:
        return '🎯';
    }
  };

  const handleStartScan = (scanId: string) => {
    setScans(scans.map(scan => 
      scan.id === scanId ? { ...scan, status: 'running' as const, progress: 0 } : scan
    ));
    
    // Simulate scan progress
    const interval = setInterval(() => {
      setScans(currentScans => {
        const updatedScans = currentScans.map(scan => {
          if (scan.id === scanId && scan.status === 'running') {
            const newProgress = Math.min(scan.progress + Math.random() * 20, 100);
            return {
              ...scan,
              progress: newProgress,
              status: newProgress >= 100 ? 'completed' as const : 'running' as const
            };
          }
          return scan;
        });
        
        if (updatedScans.find(s => s.id === scanId)?.status === 'completed') {
          clearInterval(interval);
        }
        
        return updatedScans;
      });
    }, 2000);
  };

  const handleStopScan = (scanId: string) => {
    setScans(scans.map(scan => 
      scan.id === scanId ? { ...scan, status: 'stopped' as const } : scan
    ));
  };

  const handleDeleteScan = (scanId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este scan?')) {
      setScans(scans.filter(scan => scan.id !== scanId));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration: string) => {
    return duration;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando scans...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Scans</h1>
          <p className="text-gray-600 mt-2">
            Gerencie e monitore seus scans de segurança
          </p>
        </div>
        <button
          onClick={() => setShowNewScanModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Novo Scan</span>
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Scans</p>
              <p className="text-2xl font-bold text-gray-900">{scans.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">🔍</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Em Execução</p>
              <p className="text-2xl font-bold text-gray-900">
                {scans.filter(s => s.status === 'running').length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">▶️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900">
                {scans.filter(s => s.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Falharam</p>
              <p className="text-2xl font-bold text-gray-900">
                {scans.filter(s => s.status === 'failed').length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <span className="text-2xl">❌</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar scans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="running">Executando</option>
              <option value="completed">Concluído</option>
              <option value="failed">Falhou</option>
              <option value="queued">Na Fila</option>
              <option value="stopped">Parado</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="full">Completo</option>
              <option value="quick">Rápido</option>
              <option value="custom">Customizado</option>
              <option value="scheduled">Agendado</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Scans Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vulnerabilidades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Iniciado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {filteredScans.map((scan, index) => (
                  <motion.tr
                    key={scan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-lg">{getTypeIcon(scan.type)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{scan.name}</div>
                          <div className="text-sm text-gray-500">{scan.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{scan.target}</div>
                      <div className="text-sm text-gray-500">{scan.tools.join(', ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(scan.status)}`}>
                        {scan.status === 'running' ? 'Executando' :
                         scan.status === 'completed' ? 'Concluído' :
                         scan.status === 'failed' ? 'Falhou' :
                         scan.status === 'queued' ? 'Na Fila' :
                         'Parado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              scan.status === 'completed' ? 'bg-green-500' :
                              scan.status === 'failed' ? 'bg-red-500' :
                              scan.status === 'running' ? 'bg-blue-500' :
                              'bg-gray-400'
                            }`}
                            style={{ width: `${scan.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{scan.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {scan.vulnerabilities.critical > 0 && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                            {scan.vulnerabilities.critical} Críticas
                          </span>
                        )}
                        {scan.vulnerabilities.high > 0 && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            {scan.vulnerabilities.high} Altas
                          </span>
                        )}
                        {scan.vulnerabilities.medium > 0 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            {scan.vulnerabilities.medium} Médias
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(scan.startTime)}
                      {scan.duration && (
                        <div className="text-xs text-gray-400">
                          Duração: {formatDuration(scan.duration)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {scan.status === 'queued' && (
                          <button
                            onClick={() => handleStartScan(scan.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Iniciar Scan"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}
                        {scan.status === 'running' && (
                          <button
                            onClick={() => handleStopScan(scan.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Parar Scan"
                          >
                            <StopIcon className="h-4 w-4" />
                          </button>
                        )}
                        {scan.status === 'completed' && (
                          <button
                            onClick={() => setSelectedScan(scan)}
                            className="text-green-600 hover:text-green-900"
                            title="Ver Resultados"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {/* Download results */}}
                          className="text-purple-600 hover:text-purple-900"
                          title="Download"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteScan(scan.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredScans.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum scan encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou crie um novo scan.</p>
          </div>
        )}
      </motion.div>

      {/* New Scan Modal */}
      <AnimatePresence>
        {showNewScanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowNewScanModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Novo Scan</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Scan</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do scan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Selecione um target</option>
                    <option value="example.com">example.com</option>
                    <option value="api.example.com">api.example.com</option>
                    <option value="staging.example.com">staging.example.com</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Scan</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="full">Scan Completo</option>
                    <option value="quick">Scan Rápido</option>
                    <option value="custom">Scan Customizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ferramentas</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Nmap</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Nuclei</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">SQLMap</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Dirb</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Descrição do scan"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowNewScanModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => setShowNewScanModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Criar Scan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Scans; 