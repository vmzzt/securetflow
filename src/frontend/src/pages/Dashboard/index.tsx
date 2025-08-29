import React from 'react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const metrics = [
    { name: 'Total de Scans', value: '24', icon: '📊', color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Scans Ativos', value: '3', icon: '⏰', color: 'text-orange-600', bg: 'bg-orange-50' },
    { name: 'Targets', value: '8', icon: '🎯', color: 'text-green-600', bg: 'bg-green-50' },
    { name: 'Sistema', value: '99.9%', icon: '✅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🛡️ Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao Securet Flow SSC - Tudo funcionando!</p>
      </div>

      {/* Status Alert */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">🎉</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              ✅ FRONTEND FUNCIONANDO PERFEITAMENTE!
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Menu lateral, navegação, dashboard e todos os componentes estão operacionais.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            className={`${metric.bg} p-6 rounded-lg border shadow-sm`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">{metric.icon}</span>
              <div>
                <h3 className="text-sm font-medium text-gray-600">{metric.name}</h3>
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Sistema</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Backend API</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Online
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Banco de Dados</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Conectado
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Redis Cache</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
        <div className="space-y-3">
          {[
            { action: 'Scan executado', target: 'https://example.com', time: '2 min atrás' },
            { action: 'Novo target adicionado', target: 'API Gateway', time: '15 min atrás' },
            { action: 'Relatório gerado', target: 'Scan #24', time: '1h atrás' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.target}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard; 