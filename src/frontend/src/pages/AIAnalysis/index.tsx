import React, { useState } from 'react';
import Modal from '@components/ui/Modal';

interface AIAnalysis {
  id: string;
  title: string;
  type: 'vulnerability' | 'threat' | 'compliance' | 'risk';
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  createdAt: string;
  target: string;
  confidence: number;
  insights: string[];
}

const AIAnalysis: React.FC = () => {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([
    {
      id: '1',
      title: 'Análise de Vulnerabilidades Críticas',
      type: 'vulnerability',
      status: 'completed',
      createdAt: '2024-01-15T10:30:00Z',
      target: '192.168.1.100',
      confidence: 94,
      insights: [
        'SQL Injection detectado com alta confiança',
        'Recomendação: Implementar prepared statements',
        'Risco de comprometimento de dados críticos'
      ]
    },
    {
      id: '2',
      title: 'Análise de Ameaças Emergentes',
      type: 'threat',
      status: 'analyzing',
      createdAt: '2024-01-15T11:00:00Z',
      target: 'example.com',
      confidence: 0,
      insights: []
    },
    {
      id: '3',
      title: 'Análise de Compliance GDPR',
      type: 'compliance',
      status: 'completed',
      createdAt: '2024-01-14T15:45:00Z',
      target: 'api.company.com',
      confidence: 87,
      insights: [
        'Conformidade geral: 87%',
        'Pontos de atenção: Processamento de dados pessoais',
        'Recomendação: Revisar políticas de retenção'
      ]
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AIAnalysis | null>(null);
  const [newAnalysis, setNewAnalysis] = useState({
    title: '',
    type: 'vulnerability',
    target: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'analyzing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vulnerability': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'threat': return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z';
      case 'compliance': return 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
      case 'risk': return 'M13 10V3L4 14h7v7l9-11h-7z';
      default: return 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'analyzing': return 'Analisando';
      case 'completed': return 'Concluído';
      case 'failed': return 'Falhou';
      default: return 'Desconhecido';
    }
  };

  const handleCreateAnalysis = () => {
    const analysis: AIAnalysis = {
      id: Date.now().toString(),
      title: newAnalysis.title,
      type: newAnalysis.type as any,
      status: 'pending',
      createdAt: new Date().toISOString(),
      target: newAnalysis.target,
      confidence: 0,
      insights: []
    };
    
    setAnalyses([analysis, ...analyses]);
    setShowCreateModal(false);
    setNewAnalysis({ title: '', type: 'vulnerability', target: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Análise de IA</h1>
          <p className="text-gray-600 dark:text-gray-400">Análise inteligente de segurança com IA</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Nova Análise
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total de Análises</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{analyses.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Concluídas</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {analyses.filter(a => a.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Em Análise</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {analyses.filter(a => a.status === 'analyzing').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Confiança Média</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(analyses.filter(a => a.status === 'completed').reduce((acc, a) => acc + a.confidence, 0) / Math.max(analyses.filter(a => a.status === 'completed').length, 1))}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* AI Models Status */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Status dos Modelos de IA</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Vulnerability Detection', status: 'online', accuracy: '94.2%' },
            { name: 'Threat Intelligence', status: 'online', accuracy: '91.8%' },
            { name: 'Compliance Analysis', status: 'online', accuracy: '89.5%' }
          ].map((model, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Precisão: {model.accuracy}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600 dark:text-green-400">Online</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analyses List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Análises Recentes</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getTypeIcon(analysis.type)} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">{analysis.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{analysis.target}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Criado em {new Date(analysis.createdAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {analysis.status === 'completed' && (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Confiança</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{analysis.confidence}%</p>
                    </div>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                    {getStatusText(analysis.status)}
                  </span>
                  <button
                    onClick={() => setSelectedAnalysis(analysis)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
              
              {analysis.status === 'completed' && analysis.insights.length > 0 && (
                <div className="mt-4 pl-14">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Insights:</h5>
                  <ul className="space-y-1">
                    {analysis.insights.map((insight, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Create Analysis Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nova Análise de IA"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Análise
            </label>
            <select
              value={newAnalysis.type}
              onChange={(e) => setNewAnalysis({ ...newAnalysis, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="vulnerability">Detecção de Vulnerabilidades</option>
              <option value="threat">Análise de Ameaças</option>
              <option value="compliance">Análise de Compliance</option>
              <option value="risk">Análise de Risco</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título da Análise
            </label>
            <input
              type="text"
              value={newAnalysis.title}
              onChange={(e) => setNewAnalysis({ ...newAnalysis, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Digite o título da análise"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target
            </label>
            <input
              type="text"
              value={newAnalysis.target}
              onChange={(e) => setNewAnalysis({ ...newAnalysis, target: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Digite o alvo da análise"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateAnalysis}
              disabled={!newAnalysis.title || !newAnalysis.target}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Iniciar Análise
            </button>
          </div>
        </div>
      </Modal>

      {/* Analysis Details Modal */}
      <Modal
        isOpen={!!selectedAnalysis}
        onClose={() => setSelectedAnalysis(null)}
        title={selectedAnalysis?.title || ''}
        size="xl"
      >
        {selectedAnalysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedAnalysis.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <p className="text-sm text-gray-900 dark:text-white">{getStatusText(selectedAnalysis.status)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedAnalysis.target}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confiança</label>
                <p className="text-sm text-gray-900 dark:text-white">{selectedAnalysis.confidence}%</p>
              </div>
            </div>
            
            {selectedAnalysis.insights.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Insights da IA</h4>
                <div className="space-y-2">
                  {selectedAnalysis.insights.map((insight, index) => (
                    <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
                      <p className="text-sm text-blue-800 dark:text-blue-200">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setSelectedAnalysis(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                Exportar Relatório
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AIAnalysis; 