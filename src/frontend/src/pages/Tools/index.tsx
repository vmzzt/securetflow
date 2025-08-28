import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Icons
const ToolIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'scanner' | 'exploitation' | 'reconnaissance' | 'forensics' | 'network' | 'web' | 'mobile' | 'cloud';
  subcategory: string;
  version: string;
  status: 'installed' | 'available' | 'updating' | 'error';
  rating: number;
  downloads: number;
  size: number;
  lastUpdated: string;
  author: string;
  license: string;
  platforms: string[];
  requirements: string[];
  features: string[];
  documentation: string;
  website: string;
  github?: string;
  tags: string[];
  isPopular: boolean;
  isFree: boolean;
  isOpenSource: boolean;
  executionTime?: string;
  lastUsed?: string;
  usageCount: number;
}

interface ToolExecution {
  id: string;
  toolId: string;
  toolName: string;
  target: string;
  command: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  output?: string;
  exitCode?: number;
  results?: {
    vulnerabilities: number;
    findings: Array<{
      type: string;
      severity: string;
      description: string;
    }>;
  };
}

const Tools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [tools, setTools] = useState<Tool[]>([]);
  const [executions, setExecutions] = useState<ToolExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const tabs = [
    { id: 'library', label: 'Biblioteca', icon: '📚' },
    { id: 'installed', label: 'Instaladas', icon: '✅' },
    { id: 'executions', label: 'Execuções', icon: '🏃' },
    { id: 'popular', label: 'Populares', icon: '⭐' }
  ];

  const categories = [
    { id: 'scanner', name: 'Scanners', icon: '🔍', count: 0 },
    { id: 'exploitation', name: 'Exploitation', icon: '💥', count: 0 },
    { id: 'reconnaissance', name: 'Reconnaissance', icon: '🕵️', count: 0 },
    { id: 'forensics', name: 'Forensics', icon: '🔬', count: 0 },
    { id: 'network', name: 'Network', icon: '🌐', count: 0 },
    { id: 'web', name: 'Web', icon: '🌍', count: 0 },
    { id: 'mobile', name: 'Mobile', icon: '📱', count: 0 },
    { id: 'cloud', name: 'Cloud', icon: '☁️', count: 0 }
  ];

  useEffect(() => {
    loadTools();
    loadExecutions();
  }, []);

  const loadTools = async () => {
    setLoading(true);
    
    // Simulate API call with comprehensive tool library
    setTimeout(() => {
      setTools([
        {
          id: 'nmap',
          name: 'Nmap',
          description: 'Network discovery and security auditing tool',
          category: 'network',
          subcategory: 'Port Scanner',
          version: '7.94',
          status: 'installed',
          rating: 4.9,
          downloads: 1000000,
          size: 25 * 1024 * 1024, // 25MB
          lastUpdated: '2024-01-10T00:00:00Z',
          author: 'Gordon Lyon',
          license: 'GPL',
          platforms: ['Linux', 'Windows', 'macOS'],
          requirements: ['Python 3.6+'],
          features: ['Port scanning', 'OS detection', 'Service enumeration', 'Script engine'],
          documentation: 'https://nmap.org/docs.html',
          website: 'https://nmap.org',
          github: 'https://github.com/nmap/nmap',
          tags: ['network', 'scanning', 'reconnaissance'],
          isPopular: true,
          isFree: true,
          isOpenSource: true,
          lastUsed: '2024-01-15T10:30:00Z',
          usageCount: 45
        },
        {
          id: 'sqlmap',
          name: 'SQLMap',
          description: 'Automatic SQL injection and database takeover tool',
          category: 'exploitation',
          subcategory: 'SQL Injection',
          version: '1.8.1',
          status: 'installed',
          rating: 4.8,
          downloads: 750000,
          size: 15 * 1024 * 1024, // 15MB
          lastUpdated: '2024-01-08T00:00:00Z',
          author: 'Miroslav Stampar',
          license: 'GPL',
          platforms: ['Linux', 'Windows', 'macOS'],
          requirements: ['Python 3.x'],
          features: ['SQL injection detection', 'Database enumeration', 'Data extraction', 'File system access'],
          documentation: 'https://sqlmap.org/doc/',
          website: 'https://sqlmap.org',
          github: 'https://github.com/sqlmapproject/sqlmap',
          tags: ['sql', 'injection', 'database', 'exploitation'],
          isPopular: true,
          isFree: true,
          isOpenSource: true,
          lastUsed: '2024-01-15T09:15:00Z',
          usageCount: 32
        },
        {
          id: 'burpsuite',
          name: 'Burp Suite',
          description: 'Web application security testing platform',
          category: 'web',
          subcategory: 'Web App Scanner',
          version: '2024.1.1',
          status: 'installed',
          rating: 4.7,
          downloads: 500000,
          size: 150 * 1024 * 1024, // 150MB
          lastUpdated: '2024-01-05T00:00:00Z',
          author: 'PortSwigger',
          license: 'Commercial',
          platforms: ['Linux', 'Windows', 'macOS'],
          requirements: ['Java 11+'],
          features: ['Proxy', 'Scanner', 'Intruder', 'Repeater', 'Sequencer'],
          documentation: 'https://portswigger.net/burp/documentation',
          website: 'https://portswigger.net/burp',
          tags: ['web', 'proxy', 'scanner', 'testing'],
          isPopular: true,
          isFree: false,
          isOpenSource: false,
          lastUsed: '2024-01-14T16:20:00Z',
          usageCount: 28
        },
        {
          id: 'zap',
          name: 'OWASP ZAP',
          description: 'Web application security scanner',
          category: 'web',
          subcategory: 'Web App Scanner',
          version: '2.14.0',
          status: 'installed',
          rating: 4.6,
          downloads: 800000,
          size: 80 * 1024 * 1024, // 80MB
          lastUpdated: '2024-01-12T00:00:00Z',
          author: 'OWASP',
          license: 'Apache 2.0',
          platforms: ['Linux', 'Windows', 'macOS'],
          requirements: ['Java 8+'],
          features: ['Automated scanner', 'Manual testing tools', 'API scanner', 'Fuzzing'],
          documentation: 'https://www.zaproxy.org/docs/',
          website: 'https://www.zaproxy.org',
          github: 'https://github.com/zaproxy/zaproxy',
          tags: ['web', 'owasp', 'scanner', 'proxy'],
          isPopular: true,
          isFree: true,
          isOpenSource: true,
          lastUsed: '2024-01-13T14:45:00Z',
          usageCount: 38
        },
        {
          id: 'nuclei',
          name: 'Nuclei',
          description: 'Fast vulnerability scanner based on templates',
          category: 'scanner',
          subcategory: 'Vulnerability Scanner',
          version: '3.1.5',
          status: 'installed',
          rating: 4.8,
          downloads: 300000,
          size: 50 * 1024 * 1024, // 50MB
          lastUpdated: '2024-01-14T00:00:00Z',
          author: 'ProjectDiscovery',
          license: 'MIT',
          platforms: ['Linux', 'Windows', 'macOS'],
          requirements: ['Go 1.19+'],
          features: ['Template-based scanning', 'High-speed scanning', 'Custom templates', 'CI/CD integration'],
          documentation: 'https://docs.nuclei.sh/',
          website: 'https://nuclei.sh',
          github: 'https://github.com/projectdiscovery/nuclei',
          tags: ['scanner', 'templates', 'fast', 'automation'],
          isPopular: true,
          isFree: true,
          isOpenSource: true,
          lastUsed: '2024-01-12T11:30:00Z',
          usageCount: 22
        },
        {
          id: 'metasploit',
          name: 'Metasploit',
          description: 'Penetration testing framework',
          category: 'exploitation',
          subcategory: 'Exploitation Framework',
          version: '6.3.57',
          status: 'available',
          rating: 4.9,
          downloads: 600000,
          size: 300 * 1024 * 1024, // 300MB
          lastUpdated: '2024-01-09T00:00:00Z',
          author: 'Rapid7',
          license: 'BSD',
          platforms: ['Linux', 'Windows', 'macOS'],
          requirements: ['Ruby 3.0+', 'PostgreSQL'],
          features: ['Exploit database', 'Payload generation', 'Post-exploitation', 'Auxiliary modules'],
          documentation: 'https://docs.metasploit.com/',
          website: 'https://www.metasploit.com',
          github: 'https://github.com/rapid7/metasploit-framework',
          tags: ['exploitation', 'framework', 'penetration-testing'],
          isPopular: true,
          isFree: true,
          isOpenSource: true,
          usageCount: 0
        }
      ]);
      
      // Update category counts
      categories.forEach(cat => {
        cat.count = tools.filter(tool => tool.category === cat.id).length;
      });
      
      setLoading(false);
    }, 1000);
  };

  const loadExecutions = async () => {
    // Simulate API call
    setTimeout(() => {
      setExecutions([
        {
          id: 'exec1',
          toolId: 'nmap',
          toolName: 'Nmap',
          target: 'example.com',
          command: 'nmap -sV -sC example.com',
          status: 'running',
          progress: 65,
          startTime: '2024-01-15T10:30:00Z',
          output: 'Starting Nmap 7.94\\nNmap scan report for example.com (93.184.216.34)\\nHost is up (0.12s latency).\\n...'
        },
        {
          id: 'exec2',
          toolId: 'sqlmap',
          toolName: 'SQLMap',
          target: 'example.com/login',
          command: 'sqlmap -u "http://example.com/login" --forms --batch',
          status: 'completed',
          progress: 100,
          startTime: '2024-01-15T09:15:00Z',
          endTime: '2024-01-15T09:45:00Z',
          duration: '30m',
          exitCode: 0,
          results: {
            vulnerabilities: 2,
            findings: [
              { type: 'SQL Injection', severity: 'critical', description: 'Boolean-based blind SQL injection' },
              { type: 'SQL Injection', severity: 'high', description: 'Time-based blind SQL injection' }
            ]
          }
        }
      ]);
    }, 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'installed':
        return 'text-green-600 bg-green-100';
      case 'available':
        return 'text-blue-600 bg-blue-100';
      case 'updating':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scanner':
        return 'text-blue-600 bg-blue-100';
      case 'exploitation':
        return 'text-red-600 bg-red-100';
      case 'reconnaissance':
        return 'text-purple-600 bg-purple-100';
      case 'forensics':
        return 'text-green-600 bg-green-100';
      case 'network':
        return 'text-indigo-600 bg-indigo-100';
      case 'web':
        return 'text-orange-600 bg-orange-100';
      case 'mobile':
        return 'text-pink-600 bg-pink-100';
      case 'cloud':
        return 'text-cyan-600 bg-cyan-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getExecutionStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
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

  const handleInstallTool = (tool: Tool) => {
    console.log(`Installing tool: ${tool.name}`);
    // In real implementation, this would install the tool
  };

  const handleExecuteTool = (tool: Tool) => {
    setSelectedTool(tool);
    setShowExecuteModal(true);
  };

  const handleViewDetails = (tool: Tool) => {
    setSelectedTool(tool);
    setShowDetailsModal(true);
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filterCategory || tool.category === filterCategory;
    const matchesStatus = !filterStatus || tool.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getFilteredToolsByTab = () => {
    switch (activeTab) {
      case 'installed':
        return filteredTools.filter(tool => tool.status === 'installed');
      case 'popular':
        return filteredTools.filter(tool => tool.isPopular).sort((a, b) => b.downloads - a.downloads);
      default:
        return filteredTools;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ferramentas...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Ferramentas</h1>
          <p className="text-gray-600 mt-2">
            Biblioteca de ferramentas de segurança - {tools.length} ferramentas disponíveis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
            Instalar Personalizadas
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Atualizar Todas
          </button>
        </div>
      </motion.div>

      {/* Categories Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            onClick={() => setFilterCategory(filterCategory === category.id ? '' : category.id)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              filterCategory === category.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{category.icon}</div>
              <div className="text-sm font-medium text-gray-900">{category.name}</div>
              <div className="text-xs text-gray-500">
                {tools.filter(t => t.category === category.id).length} ferramentas
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="flex space-x-1 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar ferramentas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="installed">Instaladas</option>
            <option value="available">Disponíveis</option>
            <option value="updating">Atualizando</option>
            <option value="error">Com erro</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Nome</option>
            <option value="rating">Avaliação</option>
            <option value="downloads">Downloads</option>
            <option value="lastUpdated">Última atualização</option>
            <option value="usageCount">Uso</option>
          </select>

          <button
            onClick={loadTools}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </motion.div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {(activeTab === 'library' || activeTab === 'installed' || activeTab === 'popular') && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {getFilteredToolsByTab().map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  {/* Tool Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <ToolIcon className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                        <p className="text-sm text-gray-500">v{tool.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {tool.isPopular && (
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                      )}
                      {tool.isFree && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          Free
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{tool.description}</p>

                  {/* Tool Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Categoria:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(tool.category)}`}>
                        {tool.category}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(tool.status)}`}>
                        {tool.status === 'installed' ? 'Instalada' :
                         tool.status === 'available' ? 'Disponível' :
                         tool.status === 'updating' ? 'Atualizando' :
                         'Erro'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tamanho:</span>
                      <span className="font-medium">{formatFileSize(tool.size)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avaliação:</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{tool.rating}</span>
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(tool.rating) ? 'text-yellow-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {tool.usageCount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Usado:</span>
                        <span className="font-medium">{tool.usageCount}x</span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Recursos principais:</div>
                    <div className="flex flex-wrap gap-1">
                      {tool.features.slice(0, 3).map((feature, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {tool.features.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          +{tool.features.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    {tool.status === 'installed' ? (
                      <button
                        onClick={() => handleExecuteTool(tool)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                      >
                        <PlayIcon className="h-4 w-4" />
                        <span>Executar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInstallTool(tool)}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1 text-sm"
                      >
                        <DownloadIcon className="h-4 w-4" />
                        <span>Instalar</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleViewDetails(tool)}
                      className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <InfoIcon className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {activeTab === 'executions' && (
          <motion.div
            key="executions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {executions.map((execution, index) => (
              <motion.div
                key={execution.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        execution.status === 'running' ? 'bg-blue-500 animate-pulse' :
                        execution.status === 'completed' ? 'bg-green-500' :
                        'bg-red-500'
                      }`}></div>
                      <h3 className="text-lg font-semibold text-gray-900">{execution.toolName}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getExecutionStatusColor(execution.status)}`}>
                        {execution.status === 'running' ? 'Executando' :
                         execution.status === 'completed' ? 'Concluído' :
                         'Falhou'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div><strong>Target:</strong> {execution.target}</div>
                      <div><strong>Comando:</strong> <code className="bg-gray-100 px-1 rounded">{execution.command}</code></div>
                      <div><strong>Iniciado:</strong> {formatTime(execution.startTime)}</div>
                      {execution.duration && (
                        <div><strong>Duração:</strong> {execution.duration}</div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {execution.status === 'running' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progresso</span>
                          <span className="font-medium">{execution.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${execution.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    {execution.results && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Resultados:</div>
                        <div className="text-sm text-gray-600">
                          <div><strong>Vulnerabilidades encontradas:</strong> {execution.results.vulnerabilities}</div>
                          {execution.results.findings.length > 0 && (
                            <div className="mt-2">
                              <strong>Principais achados:</strong>
                              <ul className="mt-1 space-y-1">
                                {execution.results.findings.map((finding, i) => (
                                  <li key={i} className="flex items-center space-x-2">
                                    <span className={`w-2 h-2 rounded-full ${
                                      finding.severity === 'critical' ? 'bg-red-500' :
                                      finding.severity === 'high' ? 'bg-orange-500' :
                                      finding.severity === 'medium' ? 'bg-yellow-500' :
                                      'bg-blue-500'
                                    }`}></span>
                                    <span>{finding.type}: {finding.description}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Output Preview */}
                    {execution.output && (
                      <div className="bg-gray-900 text-green-400 rounded-lg p-3 font-mono text-xs">
                        <div className="text-gray-400 mb-1">Output:</div>
                        <div className="max-h-24 overflow-auto">
                          {execution.output}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tool Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedTool && (
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
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <ToolIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedTool.name}</h2>
                      <p className="text-gray-600">v{selectedTool.version} • {selectedTool.author}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Tool Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Visão Geral</h3>
                  <p className="text-gray-700">{selectedTool.description}</p>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{selectedTool.rating}</div>
                      <div className="text-xs text-gray-600">Avaliação</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{(selectedTool.downloads / 1000).toFixed(0)}K</div>
                      <div className="text-xs text-gray-600">Downloads</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{formatFileSize(selectedTool.size)}</div>
                      <div className="text-xs text-gray-600">Tamanho</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-orange-600">{selectedTool.usageCount}</div>
                      <div className="text-xs text-gray-600">Usos</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recursos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedTool.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm">
                        <CheckIcon className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalhes Técnicos</h3>
                    <div className="space-y-2 text-sm">
                      <div><strong>Licença:</strong> {selectedTool.license}</div>
                      <div><strong>Plataformas:</strong> {selectedTool.platforms.join(', ')}</div>
                      <div><strong>Última atualização:</strong> {formatTime(selectedTool.lastUpdated)}</div>
                      {selectedTool.lastUsed && (
                        <div><strong>Último uso:</strong> {formatTime(selectedTool.lastUsed)}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisitos</h3>
                    <div className="space-y-1">
                      {selectedTool.requirements.map((req, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Links</h3>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={selectedTool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Website
                    </a>
                    <a
                      href={selectedTool.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Documentação
                    </a>
                    {selectedTool.github && (
                      <a
                        href={selectedTool.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                      >
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedTool.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
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

export default Tools; 