import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Target {
  id: string;
  name: string;
  type: 'web' | 'api' | 'network' | 'mobile';
  url?: string;
  networkRange?: string;
  status: 'active' | 'inactive' | 'scanning';
  riskScore: number;
  lastScan?: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  tags: string[];
  description?: string;
}

const Targets: React.FC = () => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchTargets = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTargets: Target[] = [
          {
            id: '1',
            name: 'example.com',
            type: 'web',
            url: 'https://example.com',
            status: 'active',
            riskScore: 85,
            lastScan: '2024-01-15T10:30:00Z',
            vulnerabilities: { critical: 2, high: 5, medium: 8, low: 12 },
            tags: ['production', 'web'],
            description: 'Main production website'
          },
          {
            id: '2',
            name: 'api.example.com',
            type: 'api',
            url: 'https://api.example.com',
            status: 'scanning',
            riskScore: 65,
            lastScan: '2024-01-15T09:15:00Z',
            vulnerabilities: { critical: 1, high: 3, medium: 6, low: 9 },
            tags: ['production', 'api'],
            description: 'REST API endpoints'
          },
          {
            id: '3',
            name: '192.168.1.0/24',
            type: 'network',
            networkRange: '192.168.1.0/24',
            status: 'active',
            riskScore: 45,
            lastScan: '2024-01-14T16:45:00Z',
            vulnerabilities: { critical: 0, high: 2, medium: 4, low: 7 },
            tags: ['internal', 'network'],
            description: 'Internal network segment'
          },
          {
            id: '4',
            name: 'staging.example.com',
            type: 'web',
            url: 'https://staging.example.com',
            status: 'inactive',
            riskScore: 30,
            lastScan: '2024-01-10T14:20:00Z',
            vulnerabilities: { critical: 0, high: 1, medium: 3, low: 5 },
            tags: ['staging', 'web'],
            description: 'Staging environment'
          }
        ];

        setTargets(mockTargets);
      } catch (error) {
        console.error('Error fetching targets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTargets();
  }, []);

  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         target.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || target.type === filterType;
    const matchesStatus = filterStatus === 'all' || target.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'scanning': return 'text-blue-600 bg-blue-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return '🌐';
      case 'api': return '🔌';
      case 'network': return '🌍';
      case 'mobile': return '📱';
      default: return '🔍';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Targets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie seus alvos de segurança
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Target
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar targets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os tipos</option>
              <option value="web">Web</option>
              <option value="api">API</option>
              <option value="network">Rede</option>
              <option value="mobile">Mobile</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="scanning">Escaneando</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTargets.map((target, index) => (
          <motion.div
            key={target.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getTypeIcon(target.type)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {target.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {target.type}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-yellow-600 transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            {target.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {target.description}
              </p>
            )}

            {/* Status and Risk */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(target.status)}`}>
                {target.status === 'active' ? 'Ativo' :
                 target.status === 'scanning' ? 'Escaneando' : 'Inativo'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(target.riskScore)}`}>
                Risco: {target.riskScore}
              </span>
            </div>

            {/* Vulnerabilities */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Vulnerabilidades
              </h4>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                  <div className="text-red-600 font-semibold">{target.vulnerabilities.critical}</div>
                  <div className="text-gray-500">Críticas</div>
                </div>
                <div className="text-center">
                  <div className="text-orange-600 font-semibold">{target.vulnerabilities.high}</div>
                  <div className="text-gray-500">Altas</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-600 font-semibold">{target.vulnerabilities.medium}</div>
                  <div className="text-gray-500">Médias</div>
                </div>
                <div className="text-center">
                  <div className="text-green-600 font-semibold">{target.vulnerabilities.low}</div>
                  <div className="text-gray-500">Baixas</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {target.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {target.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Last Scan */}
            {target.lastScan && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <ClockIcon className="w-3 h-3 mr-1" />
                Último scan: {formatDate(target.lastScan)}
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                  Iniciar Scan
                </button>
                <button className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Ver Detalhes
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTargets.length === 0 && !loading && (
        <div className="text-center py-12">
          <ShieldCheckIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Nenhum target encontrado
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Tente ajustar os filtros de busca'
              : 'Comece adicionando seu primeiro target'}
          </p>
          {!searchTerm && filterType === 'all' && filterStatus === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Adicionar Target
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Targets; 