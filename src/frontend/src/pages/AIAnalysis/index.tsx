import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Icons
const BrainIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

interface AIAnalysis {
  id: string;
  title: string;
  description: string;
  type: 'vulnerability_analysis' | 'threat_intelligence' | 'anomaly_detection' | 'risk_assessment' | 'compliance_check' | 'behavioral_analysis';
  status: 'pending' | 'running' | 'completed' | 'failed';
  target: string;
  model: string;
  confidence: number;
  created_by: string;
  created_at: string;
  completed_at?: string;
  duration?: number;
  insights: string[];
  recommendations: string[];
  risk_score: number;
  tags: string[];
  data_sources: string[];
  accuracy: number;
}

const AIAnalysis: React.FC = () => {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadAnalyses();
  }, []);

  const loadAnalyses = () => {
    setTimeout(() => {
      const mockAnalyses: AIAnalysis[] = [
        {
          id: '1',
          title: 'Análise de Vulnerabilidades - API Gateway',
          description: 'Análise inteligente de vulnerabilidades na API Gateway usando machine learning',
          type: 'vulnerability_analysis',
          status: 'completed',
          target: 'api.example.com',
          model: 'GPT-4 Security',
          confidence: 94.5,
          created_by: 'ai@securet-flow.com',
          created_at: '2024-01-15T10:00:00Z',
          completed_at: '2024-01-15T10:15:00Z',
          duration: 900,
          insights: [
            'Detectado padrão de SQL injection em 3 endpoints',
            'Falta de rate limiting em endpoints críticos',
            'Configuração inadequada de CORS',
            'Ausência de validação de entrada em 5 endpoints'
          ],
          recommendations: [
            'Implementar WAF com regras específicas para SQL injection',
            'Configurar rate limiting baseado em IP e usuário',
            'Restringir CORS para domínios específicos',
            'Adicionar validação de entrada em todos os endpoints'
          ],
          risk_score: 8.5,
          tags: ['api', 'security', 'ml'],
          data_sources: ['nmap', 'zap', 'burp'],
          accuracy: 94.5
        },
        {
          id: '2',
          title: 'Inteligência de Ameaças - Rede Corporativa',
          description: 'Análise de inteligência de ameaças para identificar padrões suspeitos',
          type: 'threat_intelligence',
          status: 'running',
          target: 'corporate.example.com',
          model: 'ThreatGPT',
          confidence: 87.2,
          created_by: 'threat@securet-flow.com',
          created_at: '2024-01-15T09:30:00Z',
          duration: 1800,
          insights: [
            'Detectado tráfego suspeito de IPs conhecidos por ataques',
            'Padrão de reconhecimento em portas não padrão',
            'Tentativas de brute force em múltiplas contas'
          ],
          recommendations: [
            'Bloquear IPs maliciosos identificados',
            'Implementar detecção de anomalias em tempo real',
            'Reforçar políticas de senha e autenticação'
          ],
          risk_score: 7.8,
          tags: ['threat', 'network', 'intelligence'],
          data_sources: ['firewall', 'ids', 'logs'],
          accuracy: 87.2
        },
        {
          id: '3',
          title: 'Detecção de Anomalias - Aplicação Web',
          description: 'Análise comportamental para detectar atividades anômalas',
          type: 'anomaly_detection',
          status: 'completed',
          target: 'web.example.com',
          model: 'AnomalyDetector',
          confidence: 91.3,
          created_by: 'behavior@securet-flow.com',
          created_at: '2024-01-15T08:00:00Z',
          completed_at: '2024-01-15T08:45:00Z',
          duration: 2700,
          insights: [
            'Detectado comportamento anômalo em 12 sessões de usuário',
            'Padrão de navegação suspeito em páginas administrativas',
            'Acesso fora do horário comercial em contas privilegiadas'
          ],
          recommendations: [
            'Implementar monitoramento de sessão em tempo real',
            'Configurar alertas para acesso fora do horário',
            'Reforçar autenticação para páginas administrativas'
          ],
          risk_score: 6.9,
          tags: ['anomaly', 'behavior', 'web'],
          data_sources: ['logs', 'analytics', 'session'],
          accuracy: 91.3
        },
        {
          id: '4',
          title: 'Avaliação de Risco - Infraestrutura Cloud',
          description: 'Avaliação abrangente de riscos na infraestrutura cloud',
          type: 'risk_assessment',
          status: 'completed',
          target: 'cloud.example.com',
          model: 'RiskGPT',
          confidence: 89.7,
          created_by: 'risk@securet-flow.com',
          created_at: '2024-01-14T16:00:00Z',
          completed_at: '2024-01-14T17:30:00Z',
          duration: 5400,
          insights: [
            'Configurações de segurança inadequadas em 3 buckets S3',
            'Falta de criptografia em trânsito para 2 serviços',
            'Políticas de backup insuficientes',
            'Ausência de monitoramento em 5 instâncias'
          ],
          recommendations: [
            'Configurar políticas de acesso restritivo para buckets S3',
            'Implementar criptografia TLS em todos os serviços',
            'Estabelecer rotina de backup automatizada',
            'Deployar agentes de monitoramento em todas as instâncias'
          ],
          risk_score: 7.2,
          tags: ['cloud', 'risk', 'infrastructure'],
          data_sources: ['aws', 'terraform', 'cloudtrail'],
          accuracy: 89.7
        },
        {
          id: '5',
          title: 'Verificação de Compliance - PCI DSS',
          description: 'Análise automatizada de conformidade com PCI DSS',
          type: 'compliance_check',
          status: 'pending',
          target: 'payment.example.com',
          model: 'ComplianceGPT',
          confidence: 0,
          created_by: 'compliance@securet-flow.com',
          created_at: '2024-01-15T11:00:00Z',
          insights: [],
          recommendations: [],
          risk_score: 0,
          tags: ['compliance', 'pci-dss', 'payment'],
          data_sources: ['config', 'logs', 'policies'],
          accuracy: 0
        }
      ];
      setAnalyses(mockAnalyses);
      setLoading(false);
    }, 1000);
  };

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || analysis.type === filterType;
    const matchesStatus = filterStatus === 'all' || analysis.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedAnalyses = [...filteredAnalyses].sort((a, b) => {
    let aValue: any = a[sortBy as keyof AIAnalysis];
    let bValue: any = b[sortBy as keyof AIAnalysis];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vulnerability_analysis':
        return 'text-red-600 bg-red-100';
      case 'threat_intelligence':
        return 'text-orange-600 bg-orange-100';
      case 'anomaly_detection':
        return 'text-purple-600 bg-purple-100';
      case 'risk_assessment':
        return 'text-blue-600 bg-blue-100';
      case 'compliance_check':
        return 'text-green-600 bg-green-100';
      case 'behavioral_analysis':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      case 'running':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8.0) return 'text-red-600 bg-red-100';
    if (score >= 6.0) return 'text-orange-600 bg-orange-100';
    if (score >= 4.0) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const handleViewDetails = (analysis: AIAnalysis) => {
    setSelectedAnalysis(analysis);
    setShowDetailsModal(true);
  };

  const handleStartAnalysis = (analysisId: string) => {
    setAnalyses(analyses.map(analysis => 
      analysis.id === analysisId ? { ...analysis, status: 'running' as const } : analysis
    ));
  };

  const handleStopAnalysis = (analysisId: string) => {
    setAnalyses(analyses.map(analysis => 
      analysis.id === analysisId ? { ...analysis, status: 'completed' as const } : analysis
    ));
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

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const getTypeCount = (type: string) => {
    return analyses.filter(a => a.type === type).length;
  };

  const getStatusCount = (status: string) => {
    return analyses.filter(a => a.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando análises de IA...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Análise de IA</h1>
          <p className="text-gray-600 mt-2">
            Análises inteligentes e insights baseados em machine learning
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowNewAnalysisModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <BrainIcon className="h-5 w-5" />
            <span>Nova Análise</span>
          </button>
        </div>
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
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{analyses.length}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <BrainIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('completed')}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Executando</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('running')}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <span className="text-2xl">🔄</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Precisão Média</p>
              <p className="text-2xl font-bold text-blue-600">
                {analyses.length > 0 ? 
                  (analyses.reduce((sum, a) => sum + a.accuracy, 0) / analyses.length).toFixed(1) : 
                  '0.0'}%
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl">🎯</span>
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
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar análises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Tipos</option>
              <option value="vulnerability_analysis">Análise de Vulnerabilidades</option>
              <option value="threat_intelligence">Inteligência de Ameaças</option>
              <option value="anomaly_detection">Detecção de Anomalias</option>
              <option value="risk_assessment">Avaliação de Risco</option>
              <option value="compliance_check">Verificação de Compliance</option>
              <option value="behavioral_analysis">Análise Comportamental</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="running">Executando</option>
              <option value="completed">Concluída</option>
              <option value="failed">Falhou</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="created_at">Ordenar por Data</option>
              <option value="title">Ordenar por Título</option>
              <option value="type">Ordenar por Tipo</option>
              <option value="status">Ordenar por Status</option>
              <option value="risk_score">Ordenar por Risco</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Analyses Table */}
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
                  Análise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risco
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precisão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {sortedAnalyses.map((analysis, index) => (
                  <motion.tr
                    key={analysis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{analysis.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{analysis.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Modelo: {analysis.model}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(analysis.type)}`}>
                        {analysis.type === 'vulnerability_analysis' ? 'Vulnerabilidades' :
                         analysis.type === 'threat_intelligence' ? 'Inteligência' :
                         analysis.type === 'anomaly_detection' ? 'Anomalias' :
                         analysis.type === 'risk_assessment' ? 'Risco' :
                         analysis.type === 'compliance_check' ? 'Compliance' :
                         'Comportamental'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(analysis.status)}`}>
                        {analysis.status === 'pending' ? 'Pendente' :
                         analysis.status === 'running' ? 'Executando' :
                         analysis.status === 'completed' ? 'Concluída' :
                         'Falhou'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{analysis.target}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(analysis.risk_score)}`}>
                        {analysis.risk_score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{analysis.accuracy.toFixed(1)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(analysis.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(analysis)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver Detalhes"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {analysis.status === 'pending' && (
                          <button
                            onClick={() => handleStartAnalysis(analysis.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Iniciar"
                          >
                            <PlayIcon className="h-4 w-4" />
                          </button>
                        )}
                        {analysis.status === 'running' && (
                          <button
                            onClick={() => handleStopAnalysis(analysis.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Parar"
                          >
                            <StopIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {sortedAnalyses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🧠</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma análise encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar uma nova análise.</p>
          </div>
        )}
      </motion.div>

      {/* Analysis Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedAnalysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedAnalysis.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedAnalysis.description}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações Básicas</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tipo:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedAnalysis.type)}`}>
                          {selectedAnalysis.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedAnalysis.status)}`}>
                          {selectedAnalysis.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target:</span>
                        <span className="font-medium">{selectedAnalysis.target}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Modelo:</span>
                        <span className="font-medium">{selectedAnalysis.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confiança:</span>
                        <span className="font-medium">{selectedAnalysis.confidence.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Métricas</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Score de Risco:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(selectedAnalysis.risk_score)}`}>
                          {selectedAnalysis.risk_score.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precisão:</span>
                        <span className="font-medium">{selectedAnalysis.accuracy.toFixed(1)}%</span>
                      </div>
                      {selectedAnalysis.duration && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duração:</span>
                          <span className="font-medium">{formatDuration(selectedAnalysis.duration)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Criado:</span>
                        <span className="font-medium">{formatDate(selectedAnalysis.created_at)}</span>
                      </div>
                      {selectedAnalysis.completed_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Concluído:</span>
                          <span className="font-medium">{formatDate(selectedAnalysis.completed_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Insights */}
                {selectedAnalysis.insights.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Insights</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedAnalysis.insights.map((insight, index) => (
                          <li key={index} className="text-sm text-blue-800 flex items-start space-x-2">
                            <span className="text-blue-600 mt-1">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {selectedAnalysis.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recomendações</h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <ul className="space-y-2">
                        {selectedAnalysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm text-green-800 flex items-start space-x-2">
                            <span className="text-green-600 mt-1">•</span>
                            <span>{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Tags and Data Sources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedAnalysis.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedAnalysis.data_sources.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Fontes de Dados</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedAnalysis.data_sources.map((source, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded"
                          >
                            {source}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Analysis Modal */}
      <AnimatePresence>
        {showNewAnalysisModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewAnalysisModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Nova Análise de IA</h2>
                  <button
                    onClick={() => setShowNewAnalysisModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Análise
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o título da análise"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a descrição da análise"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Análise
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Selecione o tipo</option>
                      <option value="vulnerability_analysis">Análise de Vulnerabilidades</option>
                      <option value="threat_intelligence">Inteligência de Ameaças</option>
                      <option value="anomaly_detection">Detecção de Anomalias</option>
                      <option value="risk_assessment">Avaliação de Risco</option>
                      <option value="compliance_check">Verificação de Compliance</option>
                      <option value="behavioral_analysis">Análise Comportamental</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modelo de IA
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Selecione o modelo</option>
                      <option value="GPT-4 Security">GPT-4 Security</option>
                      <option value="ThreatGPT">ThreatGPT</option>
                      <option value="AnomalyDetector">AnomalyDetector</option>
                      <option value="RiskGPT">RiskGPT</option>
                      <option value="ComplianceGPT">ComplianceGPT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ex: example.com"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowNewAnalysisModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Criar Análise
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

export default AIAnalysis; 