import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Icons
const TargetIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 1.657-2.657 1.657-2.657A8 8 0 1017.657 18.657z" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ExclamationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0V9a8.002 8.002 0 0115.356 2M15 15v4a8.001 8.001 0 01-11.418-5M2.05 11A8.002 8.002 0 0115 4.582M4.582 9H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

interface TargetResult {
  id: string;
  target: {
    id: string;
    url: string;
    name: string;
    type: 'web' | 'api' | 'mobile' | 'network';
    status: 'active' | 'inactive' | 'scanning';
  };
  lastScan: {
    id: string;
    timestamp: string;
    duration: number;
    status: 'completed' | 'running' | 'failed';
  };
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    fixed: number;
  };
  riskScore: number;
  trends: {
    vulnerabilityTrend: 'up' | 'down' | 'stable';
    riskTrend: 'up' | 'down' | 'stable';
    scanFrequency: number;
  };
  compliance: {
    score: number;
    frameworks: Array<{
      name: string;
      score: number;
      status: 'compliant' | 'non_compliant' | 'partial';
    }>;
  };
  technologies: string[];
  ports: Array<{
    number: number;
    service: string;
    status: 'open' | 'closed' | 'filtered';
  }>;
}

const ResultsByTarget: React.FC = () => {
  const [targets, setTargets] = useState<TargetResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<TargetResult | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [sortBy, setSortBy] = useState('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTargets([
        {
          id: 'target1',
          target: {
            id: 'tgt1',
            url: 'https://app.example.com',
            name: 'Main Application',
            type: 'web',
            status: 'active'
          },
          lastScan: {
            id: 'scan1',
            timestamp: '2024-01-15T10:30:00Z',
            duration: 1800,
            status: 'completed'
          },
          vulnerabilities: {
            total: 23,
            critical: 2,
            high: 5,
            medium: 8,
            low: 8,
            fixed: 15
          },
          riskScore: 8.5,
          trends: {
            vulnerabilityTrend: 'down',
            riskTrend: 'down',
            scanFrequency: 7
          },
          compliance: {
            score: 75,
            frameworks: [
              { name: 'OWASP', score: 78, status: 'partial' },
              { name: 'ISO 27001', score: 72, status: 'partial' },
              { name: 'NIST', score: 80, status: 'compliant' }
            ]
          },
          technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
          ports: [
            { number: 80, service: 'HTTP', status: 'open' },
            { number: 443, service: 'HTTPS', status: 'open' },
            { number: 22, service: 'SSH', status: 'filtered' }
          ]
        },
        {
          id: 'target2',
          target: {
            id: 'tgt2',
            url: 'https://api.example.com',
            name: 'REST API',
            type: 'api',
            status: 'active'
          },
          lastScan: {
            id: 'scan2',
            timestamp: '2024-01-15T09:15:00Z',
            duration: 900,
            status: 'completed'
          },
          vulnerabilities: {
            total: 12,
            critical: 1,
            high: 2,
            medium: 4,
            low: 5,
            fixed: 8
          },
          riskScore: 6.2,
          trends: {
            vulnerabilityTrend: 'stable',
            riskTrend: 'down',
            scanFrequency: 3
          },
          compliance: {
            score: 85,
            frameworks: [
              { name: 'OWASP', score: 88, status: 'compliant' },
              { name: 'ISO 27001', score: 82, status: 'compliant' }
            ]
          },
          technologies: ['Express.js', 'MongoDB', 'JWT'],
          ports: [
            { number: 443, service: 'HTTPS', status: 'open' },
            { number: 3000, service: 'API', status: 'open' }
          ]
        },
        {
          id: 'target3',
          target: {
            id: 'tgt3',
            url: 'https://admin.example.com',
            name: 'Admin Panel',
            type: 'web',
            status: 'scanning'
          },
          lastScan: {
            id: 'scan3',
            timestamp: '2024-01-15T11:00:00Z',
            duration: 0,
            status: 'running'
          },
          vulnerabilities: {
            total: 45,
            critical: 5,
            high: 12,
            medium: 15,
            low: 13,
            fixed: 20
          },
          riskScore: 9.1,
          trends: {
            vulnerabilityTrend: 'up',
            riskTrend: 'up',
            scanFrequency: 14
          },
          compliance: {
            score: 45,
            frameworks: [
              { name: 'OWASP', score: 42, status: 'non_compliant' },
              { name: 'ISO 27001', score: 48, status: 'non_compliant' }
            ]
          },
          technologies: ['PHP', 'MySQL', 'Apache'],
          ports: [
            { number: 80, service: 'HTTP', status: 'open' },
            { number: 443, service: 'HTTPS', status: 'open' },
            { number: 3306, service: 'MySQL', status: 'open' }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-100 border-red-200';
    if (score >= 6) return 'text-orange-600 bg-orange-100 border-orange-200';
    if (score >= 4) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'scanning':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-100';
      case 'partial':
        return 'text-yellow-600 bg-yellow-100';
      case 'non_compliant':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '➡️';
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

  const handleViewDetails = (target: TargetResult) => {
    setSelectedTarget(target);
    setShowDetailsModal(true);
  };

  const filteredTargets = targets.filter(target => {
    const matchesSearch = target.target.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         target.target.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || target.target.type === filterType;
    const matchesRisk = !filterRisk || 
      (filterRisk === 'critical' && target.riskScore >= 8) ||
      (filterRisk === 'high' && target.riskScore >= 6 && target.riskScore < 8) ||
      (filterRisk === 'medium' && target.riskScore >= 4 && target.riskScore < 6) ||
      (filterRisk === 'low' && target.riskScore < 4);

    return matchesSearch && matchesType && matchesRisk;
  });

  const sortedTargets = [...filteredTargets].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.target.name;
        bValue = b.target.name;
        break;
      case 'riskScore':
        aValue = a.riskScore;
        bValue = b.riskScore;
        break;
      case 'vulnerabilities':
        aValue = a.vulnerabilities.total;
        bValue = b.vulnerabilities.total;
        break;
      case 'lastScan':
        aValue = new Date(a.lastScan.timestamp);
        bValue = new Date(b.lastScan.timestamp);
        break;
      default:
        aValue = a.riskScore;
        bValue = b.riskScore;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando resultados por target...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Resultados por Target</h1>
          <p className="text-gray-600 mt-2">
            Análise detalhada de vulnerabilidades por target - {targets.length} targets analisados
          </p>
        </div>
        <button 
          onClick={loadTargets}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <RefreshIcon className="h-4 w-4" />
          <span>Atualizar</span>
        </button>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Buscar targets..."
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
            <option value="web">Web</option>
            <option value="api">API</option>
            <option value="mobile">Mobile</option>
            <option value="network">Network</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os riscos</option>
            <option value="critical">Crítico (8.0+)</option>
            <option value="high">Alto (6.0-7.9)</option>
            <option value="medium">Médio (4.0-5.9)</option>
            <option value="low">Baixo (&lt;4.0)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="riskScore">Score de Risco</option>
            <option value="name">Nome</option>
            <option value="vulnerabilities">Vulnerabilidades</option>
            <option value="lastScan">Último Scan</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>
        </div>
      </motion.div>

      {/* Targets Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {sortedTargets.map((target, index) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleViewDetails(target)}
            >
              {/* Target Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <TargetIcon className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{target.target.name}</h3>
                    <p className="text-sm text-gray-500">{target.target.url}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(target.target.status)}`}>
                    {target.target.status === 'active' ? 'Ativo' :
                     target.target.status === 'inactive' ? 'Inativo' :
                     'Scanning'}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {target.target.type.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Risk Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Score de Risco</span>
                  <span className={`text-lg font-bold px-3 py-1 rounded-lg border ${getRiskColor(target.riskScore)}`}>
                    {target.riskScore.toFixed(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      target.riskScore >= 8 ? 'bg-red-500' :
                      target.riskScore >= 6 ? 'bg-orange-500' :
                      target.riskScore >= 4 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${(target.riskScore / 10) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Vulnerabilities Summary */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Vulnerabilidades</div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-lg font-bold text-red-600">{target.vulnerabilities.critical}</div>
                    <div className="text-xs text-gray-600">Críticas</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="text-lg font-bold text-orange-600">{target.vulnerabilities.high}</div>
                    <div className="text-xs text-gray-600">Altas</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="text-lg font-bold text-yellow-600">{target.vulnerabilities.medium}</div>
                    <div className="text-xs text-gray-600">Médias</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-600">{target.vulnerabilities.low}</div>
                    <div className="text-xs text-gray-600">Baixas</div>
                  </div>
                </div>
              </div>

              {/* Trends */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Tendências</div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Vulnerabilidades:</span>
                    <span className="text-sm">{getTrendIcon(target.trends.vulnerabilityTrend)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Risco:</span>
                    <span className="text-sm">{getTrendIcon(target.trends.riskTrend)}</span>
                  </div>
                </div>
              </div>

              {/* Last Scan Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Último Scan</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    target.lastScan.status === 'completed' ? 'text-green-600 bg-green-100' :
                    target.lastScan.status === 'running' ? 'text-blue-600 bg-blue-100' :
                    'text-red-600 bg-red-100'
                  }`}>
                    {target.lastScan.status === 'completed' ? 'Concluído' :
                     target.lastScan.status === 'running' ? 'Executando' :
                     'Falhou'}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {formatTime(target.lastScan.timestamp)}
                  {target.lastScan.duration > 0 && ` • ${formatDuration(target.lastScan.duration)}`}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Tecnologias</div>
                <div className="flex flex-wrap gap-1">
                  {target.technologies.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {target.technologies.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      +{target.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Compliance Score */}
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Compliance</div>
                <div className={`text-lg font-bold px-3 py-1 rounded-lg ${
                  target.compliance.score >= 80 ? 'text-green-600 bg-green-100' :
                  target.compliance.score >= 60 ? 'text-yellow-600 bg-yellow-100' :
                  'text-red-600 bg-red-100'
                }`}>
                  {target.compliance.score}%
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Target Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedTarget && (
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
              className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <TargetIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedTarget.target.name}</h2>
                      <p className="text-gray-600">{selectedTarget.target.url}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-2xl font-bold text-red-600">{selectedTarget.riskScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Score de Risco</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">{selectedTarget.vulnerabilities.total}</div>
                    <div className="text-sm text-gray-600">Vulnerabilidades</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">{selectedTarget.vulnerabilities.fixed}</div>
                    <div className="text-sm text-gray-600">Corrigidas</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{selectedTarget.compliance.score}%</div>
                    <div className="text-sm text-gray-600">Compliance</div>
                  </div>
                </div>

                {/* Vulnerability Distribution */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição de Vulnerabilidades</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-center">
                        <ExclamationIcon className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600">{selectedTarget.vulnerabilities.critical}</div>
                        <div className="text-sm text-gray-600">Críticas</div>
                      </div>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="text-center">
                        <ExclamationIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-600">{selectedTarget.vulnerabilities.high}</div>
                        <div className="text-sm text-gray-600">Altas</div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="text-center">
                        <ExclamationIcon className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-600">{selectedTarget.vulnerabilities.medium}</div>
                        <div className="text-sm text-gray-600">Médias</div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-center">
                        <ExclamationIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">{selectedTarget.vulnerabilities.low}</div>
                        <div className="text-sm text-gray-600">Baixas</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compliance Frameworks */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Frameworks de Compliance</h3>
                  <div className="space-y-3">
                    {selectedTarget.compliance.frameworks.map((framework, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="font-medium text-gray-900">{framework.name}</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getComplianceColor(framework.status)}`}>
                            {framework.status === 'compliant' ? 'Compliant' :
                             framework.status === 'partial' ? 'Parcial' :
                             'Não Compliant'}
                          </span>
                        </div>
                        <div className="text-lg font-bold text-blue-600">{framework.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tecnologias Detectadas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTarget.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="text-sm px-3 py-1 bg-purple-100 text-purple-800 rounded-lg"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Open Ports */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Portas Abertas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedTarget.ports.map((port, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="font-medium text-gray-900">Porta {port.number}</div>
                          <div className="text-sm text-gray-600">{port.service}</div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          port.status === 'open' ? 'text-green-600 bg-green-100' :
                          port.status === 'closed' ? 'text-red-600 bg-red-100' :
                          'text-yellow-600 bg-yellow-100'
                        }`}>
                          {port.status === 'open' ? 'Aberta' :
                           port.status === 'closed' ? 'Fechada' :
                           'Filtrada'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scan Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações do Scan</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-blue-800">Último Scan</div>
                        <div className="text-sm text-blue-700">{formatTime(selectedTarget.lastScan.timestamp)}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-800">Duração</div>
                        <div className="text-sm text-blue-700">
                          {selectedTarget.lastScan.duration > 0 ? formatDuration(selectedTarget.lastScan.duration) : 'Em execução'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-800">Frequência</div>
                        <div className="text-sm text-blue-700">A cada {selectedTarget.trends.scanFrequency} dias</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-800">Status</div>
                        <div className="text-sm text-blue-700">
                          {selectedTarget.lastScan.status === 'completed' ? 'Concluído' :
                           selectedTarget.lastScan.status === 'running' ? 'Executando' :
                           'Falhou'}
                        </div>
                      </div>
                    </div>
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

export default ResultsByTarget; 