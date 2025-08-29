import React, { useState } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  PlayIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface Target {
  id: string;
  name: string;
  type: 'web' | 'api' | 'network' | 'mobile';
  url: string;
  status: 'active' | 'inactive';
  riskScore: number;
  lastScan: string;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const Targets: React.FC = () => {
  const [targets, setTargets] = useState<Target[]>([
    {
      id: '1',
      name: 'example.com',
      type: 'web',
      url: 'https://example.com',
      status: 'active',
      riskScore: 85,
      lastScan: '2 horas atrás',
      vulnerabilities: { critical: 3, high: 7, medium: 12, low: 25 }
    },
    {
      id: '2',
      name: 'api.example.com',
      type: 'api',
      url: 'https://api.example.com',
      status: 'active',
      riskScore: 92,
      lastScan: '1 hora atrás',
      vulnerabilities: { critical: 5, high: 10, medium: 8, low: 15 }
    },
    {
      id: '3',
      name: 'admin.example.com',
      type: 'web',
      url: 'https://admin.example.com',
      status: 'inactive',
      riskScore: 45,
      lastScan: '1 dia atrás',
      vulnerabilities: { critical: 1, high: 3, medium: 5, low: 10 }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         target.url.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'web': return 'bg-blue-100 text-blue-800';
      case 'api': return 'bg-purple-100 text-purple-800';
      case 'network': return 'bg-green-100 text-green-800';
      case 'mobile': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Targets</h1>
          <p className="text-gray-600">Gerencie seus alvos de segurança</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Adicionar Target
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar targets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="web">Web</option>
              <option value="api">API</option>
              <option value="network">Network</option>
              <option value="mobile">Mobile</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os status</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Targets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTargets.map((target) => (
          <div key={target.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{target.name}</h3>
                <p className="text-sm text-gray-500">{target.url}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(target.type)}`}>
                  {target.type.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(target.status)}`}>
                  {target.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Score de Risco:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(target.riskScore)}`}>
                  {target.riskScore}/100
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Último Scan:</span>
                <span className="text-sm text-gray-900">{target.lastScan}</span>
              </div>

              <div className="border-t pt-3">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Vulnerabilidades:</h4>
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
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                  <PlayIcon className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTargets.length === 0 && (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum target encontrado</h3>
          <p className="text-gray-500">Tente ajustar os filtros ou adicionar um novo target.</p>
        </div>
      )}
    </div>
  );
};

export default Targets; 