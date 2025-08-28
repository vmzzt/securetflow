import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  InformationCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive';
  cvss_score: number;
  cve_id?: string;
  target: string;
  discovered_at: string;
  updated_at: string;
  tags: string[];
  affected_components?: string[];
  remediation?: string;
  references?: string[];
}

const Vulnerabilities: React.FC = () => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('discovered_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Simulate API call
    const fetchVulnerabilities = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockVulnerabilities: Vulnerability[] = [
          {
            id: '1',
            title: 'SQL Injection in Login Form',
            description: 'The login form is vulnerable to SQL injection attacks, allowing unauthorized access to the database.',
            severity: 'critical',
            status: 'open',
            cvss_score: 9.8,
            cve_id: 'CVE-2024-0001',
            target: 'example.com',
            discovered_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z',
            tags: ['sql-injection', 'authentication', 'web'],
            affected_components: ['/login', '/auth'],
            remediation: 'Use parameterized queries and input validation to prevent SQL injection.',
            references: ['https://owasp.org/www-community/attacks/SQL_Injection']
          },
          {
            id: '2',
            title: 'Cross-Site Scripting (XSS) in User Comments',
            description: 'User input in comments section is not properly sanitized, allowing XSS attacks.',
            severity: 'high',
            status: 'in_progress',
            cvss_score: 7.5,
            cve_id: 'CVE-2024-0002',
            target: 'example.com',
            discovered_at: '2024-01-14T15:20:00Z',
            updated_at: '2024-01-15T09:15:00Z',
            tags: ['xss', 'user-input', 'web'],
            affected_components: ['/comments', '/forum'],
            remediation: 'Implement proper input sanitization and output encoding.',
            references: ['https://owasp.org/www-community/attacks/xss/']
          },
          {
            id: '3',
            title: 'Weak Password Policy',
            description: 'The application allows weak passwords that can be easily brute-forced.',
            severity: 'medium',
            status: 'open',
            cvss_score: 5.5,
            target: 'example.com',
            discovered_at: '2024-01-13T11:45:00Z',
            updated_at: '2024-01-13T11:45:00Z',
            tags: ['authentication', 'password', 'policy'],
            affected_components: ['/register', '/password-reset'],
            remediation: 'Implement strong password requirements and rate limiting.'
          },
          {
            id: '4',
            title: 'Missing Security Headers',
            description: 'Important security headers like Content-Security-Policy are not configured.',
            severity: 'low',
            status: 'resolved',
            cvss_score: 3.1,
            target: 'api.example.com',
            discovered_at: '2024-01-12T14:30:00Z',
            updated_at: '2024-01-14T16:20:00Z',
            tags: ['headers', 'security', 'web'],
            affected_components: ['All endpoints'],
            remediation: 'Configure security headers in web server configuration.'
          },
          {
            id: '5',
            title: 'Information Disclosure in Error Messages',
            description: 'Error messages reveal sensitive information about the application structure.',
            severity: 'medium',
            status: 'false_positive',
            cvss_score: 4.2,
            target: 'staging.example.com',
            discovered_at: '2024-01-11T09:15:00Z',
            updated_at: '2024-01-12T10:30:00Z',
            tags: ['information-disclosure', 'error-handling'],
            affected_components: ['/api/*'],
            remediation: 'Use generic error messages in production environment.'
          }
        ];

        setVulnerabilities(mockVulnerabilities);
      } catch (error) {
        console.error('Error fetching vulnerabilities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVulnerabilities();
  }, []);

  const filteredVulnerabilities = vulnerabilities.filter(vuln => {
    const matchesSearch = vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.cve_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || vuln.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || vuln.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const sortedVulnerabilities = [...filteredVulnerabilities].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Vulnerability];
    let bValue: any = b[sortBy as keyof Vulnerability];
    
    if (sortBy === 'cvss_score') {
      aValue = a.cvss_score;
      bValue = b.cvss_score;
    } else if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'info': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'false_positive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Progresso';
      case 'resolved': return 'Resolvido';
      case 'false_positive': return 'Falso Positivo';
      default: return status;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'high': return <ShieldExclamationIcon className="w-5 h-5" />;
      case 'medium': return <ExclamationTriangleIcon className="w-5 h-5" />;
      case 'low': return <InformationCircleIcon className="w-5 h-5" />;
      case 'info': return <InformationCircleIcon className="w-5 h-5" />;
      default: return <InformationCircleIcon className="w-5 h-5" />;
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

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
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
            Vulnerabilidades
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie e monitore vulnerabilidades de segurança
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total: {vulnerabilities.length} vulnerabilidades
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Críticas', count: vulnerabilities.filter(v => v.severity === 'critical').length, color: 'bg-red-500' },
          { label: 'Altas', count: vulnerabilities.filter(v => v.severity === 'high').length, color: 'bg-orange-500' },
          { label: 'Médias', count: vulnerabilities.filter(v => v.severity === 'medium').length, color: 'bg-yellow-500' },
          { label: 'Baixas', count: vulnerabilities.filter(v => v.severity === 'low').length, color: 'bg-blue-500' },
          { label: 'Resolvidas', count: vulnerabilities.filter(v => v.status === 'resolved').length, color: 'bg-green-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.count}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <ExclamationTriangleIcon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
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
                placeholder="Buscar vulnerabilidades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas as severidades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Média</option>
              <option value="low">Baixa</option>
              <option value="info">Info</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos os status</option>
              <option value="open">Aberto</option>
              <option value="in_progress">Em Progresso</option>
              <option value="resolved">Resolvido</option>
              <option value="false_positive">Falso Positivo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vulnerabilities List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vulnerabilidade
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('severity')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Severidade</span>
                    {sortBy === 'severity' && (
                      sortOrder === 'asc' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('cvss_score')}
                >
                  <div className="flex items-center space-x-1">
                    <span>CVSS</span>
                    {sortBy === 'cvss_score' && (
                      sortOrder === 'asc' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('discovered_at')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Descoberta</span>
                    {sortBy === 'discovered_at' && (
                      sortOrder === 'asc' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedVulnerabilities.map((vuln, index) => (
                <motion.tr
                  key={vuln.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg border ${getSeverityColor(vuln.severity)}`}>
                        {getSeverityIcon(vuln.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {vuln.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {vuln.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {vuln.target}
                          </span>
                          {vuln.cve_id && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                              {vuln.cve_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity === 'critical' ? 'Crítica' :
                       vuln.severity === 'high' ? 'Alta' :
                       vuln.severity === 'medium' ? 'Média' :
                       vuln.severity === 'low' ? 'Baixa' : 'Info'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {vuln.cvss_score.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(vuln.status)}`}>
                      {getStatusText(vuln.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(vuln.discovered_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {sortedVulnerabilities.length === 0 && !loading && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhuma vulnerabilidade encontrada
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterSeverity !== 'all' || filterStatus !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'Nenhuma vulnerabilidade foi detectada ainda'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vulnerabilities; 