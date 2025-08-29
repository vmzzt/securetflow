import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Icons
const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface Report {
  id: string;
  title: string;
  description: string;
  type: 'vulnerability' | 'compliance' | 'penetration_test' | 'security_assessment' | 'incident' | 'audit';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  format: 'pdf' | 'html' | 'json' | 'csv' | 'xml';
  target: string;
  scan_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  file_size?: string;
  download_count: number;
  tags: string[];
  summary: {
    total_vulnerabilities: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  format: string;
  is_default: boolean;
}

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadReports();
    loadTemplates();
  }, []);

  const loadReports = () => {
    // Simulate API call
    setTimeout(() => {
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Relatório de Vulnerabilidades - Q1 2024',
          description: 'Análise completa de vulnerabilidades encontradas no primeiro trimestre de 2024',
          type: 'vulnerability',
          status: 'completed',
          format: 'pdf',
          target: 'example.com',
          scan_id: 'scan-1',
          created_by: 'security@securet-flow.com',
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-01-15T14:30:00Z',
          completed_at: '2024-01-15T14:30:00Z',
          file_size: '2.4 MB',
          download_count: 15,
          tags: ['quarterly', 'vulnerabilities', 'security'],
          summary: {
            total_vulnerabilities: 23,
            critical: 2,
            high: 5,
            medium: 8,
            low: 6,
            info: 2
          }
        },
        {
          id: '2',
          title: 'Teste de Penetração - API Gateway',
          description: 'Relatório detalhado do teste de penetração realizado na API Gateway',
          type: 'penetration_test',
          status: 'completed',
          format: 'html',
          target: 'api.example.com',
          scan_id: 'scan-2',
          created_by: 'pentest@securet-flow.com',
          created_at: '2024-01-14T09:00:00Z',
          updated_at: '2024-01-14T17:00:00Z',
          completed_at: '2024-01-14T17:00:00Z',
          file_size: '1.8 MB',
          download_count: 8,
          tags: ['pentest', 'api', 'gateway'],
          summary: {
            total_vulnerabilities: 12,
            critical: 1,
            high: 3,
            medium: 4,
            low: 3,
            info: 1
          }
        },
        {
          id: '3',
          title: 'Avaliação de Compliance - PCI DSS',
          description: 'Avaliação de conformidade com o padrão PCI DSS para processamento de pagamentos',
          type: 'compliance',
          status: 'in_progress',
          format: 'pdf',
          target: 'payment.example.com',
          created_by: 'compliance@securet-flow.com',
          created_at: '2024-01-15T08:00:00Z',
          updated_at: '2024-01-15T12:00:00Z',
          file_size: '0 KB',
          download_count: 0,
          tags: ['compliance', 'pci-dss', 'payments'],
          summary: {
            total_vulnerabilities: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            info: 0
          }
        },
        {
          id: '4',
          title: 'Relatório de Incidente - Data Breach',
          description: 'Análise pós-incidente de violação de dados ocorrida em 10/01/2024',
          type: 'incident',
          status: 'completed',
          format: 'pdf',
          target: 'internal.example.com',
          created_by: 'incident@securet-flow.com',
          created_at: '2024-01-11T16:00:00Z',
          updated_at: '2024-01-13T10:00:00Z',
          completed_at: '2024-01-13T10:00:00Z',
          file_size: '3.2 MB',
          download_count: 25,
          tags: ['incident', 'data-breach', 'forensics'],
          summary: {
            total_vulnerabilities: 8,
            critical: 3,
            high: 2,
            medium: 2,
            low: 1,
            info: 0
          }
        },
        {
          id: '5',
          title: 'Auditoria de Segurança - Infraestrutura',
          description: 'Auditoria completa da infraestrutura de segurança da empresa',
          type: 'audit',
          status: 'draft',
          format: 'html',
          target: 'infrastructure.example.com',
          created_by: 'audit@securet-flow.com',
          created_at: '2024-01-15T11:00:00Z',
          updated_at: '2024-01-15T11:00:00Z',
          file_size: '0 KB',
          download_count: 0,
          tags: ['audit', 'infrastructure', 'security'],
          summary: {
            total_vulnerabilities: 0,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            info: 0
          }
        },
        {
          id: '6',
          title: 'Avaliação de Segurança - Aplicação Web',
          description: 'Avaliação de segurança da aplicação web principal',
          type: 'security_assessment',
          status: 'completed',
          format: 'json',
          target: 'web.example.com',
          scan_id: 'scan-3',
          created_by: 'security@securet-flow.com',
          created_at: '2024-01-13T14:00:00Z',
          updated_at: '2024-01-13T18:00:00Z',
          completed_at: '2024-01-13T18:00:00Z',
          file_size: '856 KB',
          download_count: 12,
          tags: ['web', 'assessment', 'security'],
          summary: {
            total_vulnerabilities: 18,
            critical: 1,
            high: 4,
            medium: 6,
            low: 5,
            info: 2
          }
        }
      ];
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  };

  const loadTemplates = () => {
    const mockTemplates: ReportTemplate[] = [
      {
        id: '1',
        name: 'Relatório de Vulnerabilidades Padrão',
        description: 'Template padrão para relatórios de vulnerabilidades',
        type: 'vulnerability',
        format: 'pdf',
        is_default: true
      },
      {
        id: '2',
        name: 'Relatório de Compliance PCI DSS',
        description: 'Template específico para relatórios de compliance PCI DSS',
        type: 'compliance',
        format: 'pdf',
        is_default: false
      },
      {
        id: '3',
        name: 'Relatório de Teste de Penetração',
        description: 'Template para relatórios de teste de penetração',
        type: 'penetration_test',
        format: 'html',
        is_default: false
      },
      {
        id: '4',
        name: 'Relatório de Incidente',
        description: 'Template para relatórios de incidentes de segurança',
        type: 'incident',
        format: 'pdf',
        is_default: false
      }
    ];
    setTemplates(mockTemplates);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || report.type === filterType;
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesFormat = filterFormat === 'all' || report.format === filterFormat;
    
    return matchesSearch && matchesType && matchesStatus && matchesFormat;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Report];
    let bValue: any = b[sortBy as keyof Report];
    
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
      case 'vulnerability':
        return 'text-red-600 bg-red-100';
      case 'compliance':
        return 'text-blue-600 bg-blue-100';
      case 'penetration_test':
        return 'text-purple-600 bg-purple-100';
      case 'security_assessment':
        return 'text-green-600 bg-green-100';
      case 'incident':
        return 'text-orange-600 bg-orange-100';
      case 'audit':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'archived':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf':
        return '📄';
      case 'html':
        return '🌐';
      case 'json':
        return '📋';
      case 'csv':
        return '📊';
      case 'xml':
        return '📄';
      default:
        return '📄';
    }
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleDownload = (report: Report) => {
    console.log(`Downloading report: ${report.title}`);
    // In real implementation, this would trigger download
  };

  const handleDelete = (reportId: string) => {
    setReports(reports.filter(report => report.id !== reportId));
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

  const getTypeCount = (type: string) => {
    return reports.filter(r => r.type === type).length;
  };

  const getStatusCount = (status: string) => {
    return reports.filter(r => r.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatórios...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-2">
            Gerencie e visualize relatórios de segurança
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Novo Relatório</span>
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
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <DocumentIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídos</p>
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
              <p className="text-sm font-medium text-gray-600">Em Progresso</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('in_progress')}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rascunhos</p>
              <p className="text-2xl font-bold text-gray-600">{getStatusCount('draft')}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📝</span>
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
                placeholder="Buscar relatórios..."
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
              <option value="vulnerability">Vulnerabilidades</option>
              <option value="compliance">Compliance</option>
              <option value="penetration_test">Teste de Penetração</option>
              <option value="security_assessment">Avaliação de Segurança</option>
              <option value="incident">Incidente</option>
              <option value="audit">Auditoria</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Status</option>
              <option value="draft">Rascunho</option>
              <option value="in_progress">Em Progresso</option>
              <option value="completed">Concluído</option>
              <option value="archived">Arquivado</option>
            </select>

            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos os Formatos</option>
              <option value="pdf">PDF</option>
              <option value="html">HTML</option>
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="xml">XML</option>
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
            </select>
          </div>
        </div>
      </motion.div>

      {/* Reports Table */}
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
                  Relatório
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {sortedReports.map((report, index) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Criado por: {report.created_by}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.type)}`}>
                        {report.type === 'vulnerability' ? 'Vulnerabilidades' :
                         report.type === 'compliance' ? 'Compliance' :
                         report.type === 'penetration_test' ? 'Teste de Penetração' :
                         report.type === 'security_assessment' ? 'Avaliação de Segurança' :
                         report.type === 'incident' ? 'Incidente' :
                         'Auditoria'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status === 'draft' ? 'Rascunho' :
                         report.status === 'in_progress' ? 'Em Progresso' :
                         report.status === 'completed' ? 'Concluído' :
                         'Arquivado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getFormatIcon(report.format)}</span>
                        <span className="text-sm font-medium text-gray-900">{report.format.toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.target}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{report.download_count}</div>
                      {report.file_size && report.file_size !== '0 KB' && (
                        <div className="text-xs text-gray-500">{report.file_size}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(report)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver Detalhes"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {report.status === 'completed' && (
                          <button
                            onClick={() => handleDownload(report)}
                            className="text-green-600 hover:text-green-900"
                            title="Download"
                          >
                            <DownloadIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(report.id)}
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

        {sortedReports.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou criar um novo relatório.</p>
          </div>
        )}
      </motion.div>

      {/* Report Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedReport && (
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
                    <h2 className="text-xl font-semibold text-gray-900">{selectedReport.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{selectedReport.description}</p>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(selectedReport.type)}`}>
                          {selectedReport.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedReport.status)}`}>
                          {selectedReport.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Formato:</span>
                        <span className="font-medium">{selectedReport.format.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Target:</span>
                        <span className="font-medium">{selectedReport.target}</span>
                      </div>
                      {selectedReport.scan_id && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scan ID:</span>
                          <span className="font-medium">{selectedReport.scan_id}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Criado:</span>
                        <span className="font-medium">{formatDate(selectedReport.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Atualizado:</span>
                        <span className="font-medium">{formatDate(selectedReport.updated_at)}</span>
                      </div>
                      {selectedReport.completed_at && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Concluído:</span>
                          <span className="font-medium">{formatDate(selectedReport.completed_at)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Criado por:</span>
                        <span className="font-medium">{selectedReport.created_by}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vulnerability Summary */}
                {selectedReport.summary.total_vulnerabilities > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Resumo de Vulnerabilidades</h3>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-900">{selectedReport.summary.total_vulnerabilities}</div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{selectedReport.summary.critical}</div>
                        <div className="text-sm text-red-600">Críticas</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">{selectedReport.summary.high}</div>
                        <div className="text-sm text-orange-600">Altas</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{selectedReport.summary.medium}</div>
                        <div className="text-sm text-yellow-600">Médias</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedReport.summary.low}</div>
                        <div className="text-sm text-blue-600">Baixas</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-gray-600">{selectedReport.summary.info}</div>
                        <div className="text-sm text-gray-600">Info</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {selectedReport.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedReport.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Informações do Arquivo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Tamanho</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedReport.file_size}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Downloads</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedReport.download_count}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600">Formato</div>
                      <div className="text-lg font-semibold text-gray-900">{selectedReport.format.toUpperCase()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Report Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
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
                  <h2 className="text-xl font-semibold text-gray-900">Criar Novo Relatório</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título do Relatório
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o título do relatório"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite a descrição do relatório"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Selecione o tipo</option>
                      <option value="vulnerability">Vulnerabilidades</option>
                      <option value="compliance">Compliance</option>
                      <option value="penetration_test">Teste de Penetração</option>
                      <option value="security_assessment">Avaliação de Segurança</option>
                      <option value="incident">Incidente</option>
                      <option value="audit">Auditoria</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Selecione o formato</option>
                      <option value="pdf">PDF</option>
                      <option value="html">HTML</option>
                      <option value="json">JSON</option>
                      <option value="csv">CSV</option>
                      <option value="xml">XML</option>
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
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Criar Relatório
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

export default Reports; 