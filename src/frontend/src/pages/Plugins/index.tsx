import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Plugins: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando plugins...</p>
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
        <h1 className="text-3xl font-bold text-gray-900">Plugins</h1>
        <p className="text-gray-600 mt-2">
          Marketplace de extensões e plugins para SecureFlow
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Plugins Disponíveis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'OWASP ZAP Integration', description: 'Integração com OWASP ZAP para testes automatizados', status: 'Disponível' },
            { name: 'Burp Suite Plugin', description: 'Conecta com Burp Suite Professional', status: 'Instalado' },
            { name: 'Custom Report Templates', description: 'Templates personalizados para relatórios', status: 'Disponível' },
            { name: 'Slack Notifications', description: 'Notificações avançadas via Slack', status: 'Instalado' },
            { name: 'JIRA Integration', description: 'Criação automática de tickets', status: 'Disponível' },
            { name: 'Custom Nuclei Templates', description: 'Templates personalizados do Nuclei', status: 'Instalado' }
          ].map((plugin, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-gray-900">{plugin.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{plugin.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded ${
                  plugin.status === 'Instalado' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {plugin.status}
                </span>
                <button className={`text-sm px-3 py-1 rounded transition-colors ${
                  plugin.status === 'Instalado'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  {plugin.status === 'Instalado' ? 'Remover' : 'Instalar'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Plugins; 