import React from 'react';
import { motion } from 'framer-motion';
import Card from '@components/ui/Card';

interface Insight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

const AIInsights: React.FC = () => {
  const insights: Insight[] = [
    {
      id: '1',
      type: 'critical',
      title: 'Vulnerabilidade Crítica Detectada',
      description: 'SQL Injection encontrada no endpoint /api/users. Recomenda-se correção imediata.',
      timestamp: '5 min atrás',
      priority: 'high'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Padrão de Ataque Identificado',
      description: 'Múltiplas tentativas de login detectadas. Possível ataque de força bruta.',
      timestamp: '15 min atrás',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'info',
      title: 'Otimização de Performance',
      description: 'Scan engine pode ser otimizado para reduzir tempo de execução em 30%.',
      timestamp: '1 hora atrás',
      priority: 'low'
    },
    {
      id: '4',
      type: 'success',
      title: 'Configuração Segura',
      description: 'Todas as configurações de segurança estão adequadas para o ambiente.',
      timestamp: '2 horas atrás',
      priority: 'low'
    }
  ];

  const getTypeColor = (type: Insight['type']) => {
    switch (type) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'success':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getTypeIcon = (type: Insight['type']) => {
    switch (type) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '💡';
    }
  };

  const getPriorityColor = (priority: Insight['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Insights de IA
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">🤖 IA Ativa</span>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 border rounded-lg ${getTypeColor(insight.type)}`}
          >
            <div className="flex items-start space-x-3">
              <span className="text-xl flex-shrink-0">
                {getTypeIcon(insight.type)}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900">
                    {insight.title}
                  </h3>
                  <span className={`text-xs font-medium ${getPriorityColor(insight.priority)}`}>
                    {insight.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {insight.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {insight.timestamp}
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Ver detalhes
                    </button>
                    <button className="text-xs text-gray-500 hover:text-gray-700">
                      Ignorar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {insights.length} insights ativos
          </span>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Ver todos os insights
          </button>
        </div>
      </div>
    </Card>
  );
};

export default AIInsights; 