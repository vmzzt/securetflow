import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScanData {
  id: string;
  target: string;
  status: 'running' | 'completed' | 'failed';
  progress: number;
  vulnerabilities: number;
  startTime: string;
}

interface VulnerabilityData {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  target: string;
  status: 'open' | 'fixed' | 'false_positive';
  cve?: string;
}

const Dashboard: React.FC = () => {
  const [activeScans, setActiveScans] = useState<ScanData[]>([]);
  const [recentVulnerabilities, setRecentVulnerabilities] = useState<VulnerabilityData[]>([]);
  const [systemStatus] = useState({
    backend: 'online',
    database: 'online',
    redis: 'online',
    scanner: 'online'
  });
  const [stats, setStats] = useState({
    totalScans: 0,
    activeScans: 0,
    criticalVulns: 0,
    protectedTargets: 0,
    riskScore: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Simular dados do sistema
    setActiveScans([
      {
        id: '1',
        target: '192.168.1.100',
        status: 'running',
        progress: 75,
        vulnerabilities: 3,
        startTime: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        target: 'example.com',
        status: 'running',
        progress: 45,
        vulnerabilities: 1,
        startTime: '2024-01-15T11:00:00Z'
      }
    ]);

    setRecentVulnerabilities([
      {
        id: '1',
        title: 'SQL Injection Vulnerability',
        severity: 'critical',
        target: '192.168.1.100',
        status: 'open',
        cve: 'CVE-2024-001'
      },
      {
        id: '2',
        title: 'Cross-Site Scripting (XSS)',
        severity: 'high',
        target: 'example.com',
        status: 'open'
      },
      {
        id: '3',
        title: 'Weak SSL Configuration',
        severity: 'medium',
        target: '192.168.1.101',
        status: 'open'
      }
    ]);

    setStats({
      totalScans: 156,
      activeScans: 2,
      criticalVulns: 8,
      protectedTargets: 142,
      riskScore: 7.2
    });
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'text-green-600' : 'text-red-600';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema de segurança</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/scans')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Novo Scan
          </button>
          <button
            onClick={() => navigate('/targets')}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Gerenciar Targets
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Scans Ativos</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.activeScans}</p>
              <p className="text-sm text-gray-500">de {stats.totalScans} total</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Vulnerabilidades Críticas</h3>
              <p className="text-3xl font-bold text-red-600">{stats.criticalVulns}</p>
              <p className="text-sm text-gray-500">+3 novas hoje</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Targets Protegidos</h3>
              <p className="text-3xl font-bold text-green-600">{stats.protectedTargets}/150</p>
              <p className="text-sm text-gray-500">+5 protegidos</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Score de Risco</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.riskScore}/10</p>
              <p className="text-sm text-gray-500">-0.3 vs semana passada</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Active Scans */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Scans Ativos</h2>
          <button
            onClick={() => navigate('/scans')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todos →
          </button>
        </div>
        <div className="space-y-4">
          {activeScans.map((scan) => (
            <div key={scan.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{scan.target}</span>
                  <span className="text-sm text-gray-500">ID: {scan.id}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(scan.startTime).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso</span>
                    <span>{scan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(scan.progress)}`}
                      style={{ width: `${scan.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">Vulnerabilidades encontradas:</span>
                  <p className="text-lg font-semibold text-red-600">{scan.vulnerabilities}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Vulnerabilities */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Vulnerabilidades Recentes</h2>
          <button
            onClick={() => navigate('/vulnerabilities')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Ver todas →
          </button>
        </div>
        <div className="space-y-3">
          {recentVulnerabilities.map((vuln) => (
            <div key={vuln.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                  {vuln.severity.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{vuln.title}</h4>
                  <p className="text-sm text-gray-500">{vuln.target}</p>
                  {vuln.cve && <p className="text-xs text-gray-400">{vuln.cve}</p>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  vuln.status === 'open' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {vuln.status === 'open' ? 'Aberto' : 'Fechado'}
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Status do Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${systemStatus.backend === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">API Backend</span>
            </div>
            <span className={`font-medium ${getStatusColor(systemStatus.backend)}`}>
              {systemStatus.backend === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${systemStatus.database === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">Database</span>
            </div>
            <span className={`font-medium ${getStatusColor(systemStatus.database)}`}>
              {systemStatus.database === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${systemStatus.redis === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">Redis Cache</span>
            </div>
            <span className={`font-medium ${getStatusColor(systemStatus.redis)}`}>
              {systemStatus.redis === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${systemStatus.scanner === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-700">Scanner Engine</span>
            </div>
            <span className={`font-medium ${getStatusColor(systemStatus.scanner)}`}>
              {systemStatus.scanner === 'online' ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 