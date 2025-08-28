import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ShiftLeft: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando Shift Left...</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Shift Left Security</h1>
        <p className="text-gray-600 mt-2">
          Integração DevSecOps para segurança desde o desenvolvimento
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Integrações DevSecOps
        </h2>
        <div className="space-y-4">
          {[
            { name: 'GitHub Actions', status: 'Configurado', scans: 45, lastRun: '2h ago' },
            { name: 'GitLab CI/CD', status: 'Configurado', scans: 23, lastRun: '4h ago' },
            { name: 'Jenkins Pipeline', status: 'Pendente', scans: 0, lastRun: 'Never' },
            { name: 'Azure DevOps', status: 'Configurado', scans: 12, lastRun: '1d ago' }
          ].map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900">{integration.name}</p>
                <p className="text-sm text-gray-500">
                  {integration.scans} scans executados • Último: {integration.lastRun}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm px-2 py-1 rounded ${
                  integration.status === 'Configurado' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {integration.status}
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

export default ShiftLeft; 