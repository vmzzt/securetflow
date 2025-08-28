import React from 'react';
import { motion } from 'framer-motion';
import Card from '@components/ui/Card';
import Button from '@components/ui/Button';
import { logInfo } from '@utils/logger';

const QuickActions: React.FC = () => {
  const actions = [
    {
      id: 'new-scan',
      title: 'Novo Scan',
      description: 'Iniciar um novo scan de vulnerabilidades',
      icon: '🔍',
      color: 'bg-blue-100 text-blue-600',
      action: () => logInfo('Quick action: Novo scan', 'dashboard')
    },
    {
      id: 'add-target',
      title: 'Adicionar Target',
      description: 'Adicionar um novo alvo para análise',
      icon: '🎯',
      color: 'bg-green-100 text-green-600',
      action: () => logInfo('Quick action: Adicionar target', 'dashboard')
    },
    {
      id: 'generate-report',
      title: 'Gerar Relatório',
      description: 'Criar relatório de vulnerabilidades',
      icon: '📊',
      color: 'bg-purple-100 text-purple-600',
      action: () => logInfo('Quick action: Gerar relatório', 'dashboard')
    },
    {
      id: 'ai-analysis',
      title: 'Análise IA',
      description: 'Executar análise inteligente',
      icon: '🤖',
      color: 'bg-orange-100 text-orange-600',
      action: () => logInfo('Quick action: Análise IA', 'dashboard')
    }
  ];

  return (
    <Card
      header={
        <h2 className="text-xl font-semibold text-gray-900">
          Ações Rápidas
        </h2>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            onClick={action.action}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xl ${action.color}`}>
                {action.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {action.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="primary"
            size="md"
            fullWidth
            icon="🚀"
            onClick={() => logInfo('Quick action: Scan rápido', 'dashboard')}
          >
            Scan Rápido
          </Button>
          <Button
            variant="outline"
            size="md"
            fullWidth
            icon="⚙️"
            onClick={() => logInfo('Quick action: Configurações', 'dashboard')}
          >
            Configurações
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuickActions; 