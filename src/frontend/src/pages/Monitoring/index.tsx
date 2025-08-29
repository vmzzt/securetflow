import React from 'react';
import { motion } from 'framer-motion';
import { ServerIcon } from '@heroicons/react/24/outline';
import { Card } from '@components/ui/Card';

const Monitoring: React.FC = () => {
  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <ServerIcon className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoring</h1>
          <p className="text-gray-600">Monitoramento em tempo real dos sistemas</p>
        </div>
      </div>

      {/* Content */}
      <Card className="p-8 text-center">
        <ServerIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Monitoring em Desenvolvimento
        </h2>
        <p className="text-gray-600 mb-6">
          Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            💡 <strong>Previsto para:</strong> Próxima versão<br/>
            🔧 <strong>Status:</strong> Em desenvolvimento<br/>
            📊 <strong>Progresso:</strong> Interface definida, backend em implementação
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default Monitoring; 