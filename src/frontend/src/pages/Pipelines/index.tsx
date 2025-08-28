import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Pipelines: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando pipelines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Pipelines CI/CD</h1>
        <p className="text-gray-600 mt-2">
          Integração com pipelines de CI/CD para segurança automatizada
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Pipelines Ativos
        </h2>
        <div className="space-y-4">
          {[
            { name: 'Production Deploy Pipeline', status: 'Ativo', lastRun: '2h ago', result: 'Sucesso' },
            { name: 'Security Scan Pipeline', status: 'Ativo', lastRun: '30m ago', result: 'Sucesso' },
            { name: 'Code Quality Pipeline', status: 'Pausado', lastRun: '1d ago', result: 'Falhou' }
          ].map((pipeline, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{pipeline.name}</p>
                <p className="text-sm text-gray-500">Última execução: {pipeline.lastRun}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm px-2 py-1 rounded ${
                  pipeline.result === 'Sucesso' ? 'bg-green-100 text-green-800' :
                  pipeline.result === 'Falhou' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {pipeline.result}
                </span>
                <span className={`text-sm px-2 py-1 rounded ${
                  pipeline.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {pipeline.status}
                </span>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                  Configurar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Pipelines; 