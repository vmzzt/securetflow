import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema de segurança</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">Scans Ativos</h3>
          <p className="text-3xl font-bold text-blue-600">8</p>
          <p className="text-sm text-gray-500">+12% vs ontem</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">Vulnerabilidades Críticas</h3>
          <p className="text-3xl font-bold text-red-600">15</p>
          <p className="text-sm text-gray-500">+3 novas</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">Targets Protegidos</h3>
          <p className="text-3xl font-bold text-green-600">142/150</p>
          <p className="text-sm text-gray-500">+5 protegidos</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900">Score de Risco</h3>
          <p className="text-3xl font-bold text-yellow-600">7.2/10</p>
          <p className="text-sm text-gray-500">-0.3 vs semana passada</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Status do Sistema</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">API Backend</span>
            <span className="text-green-600">Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Database</span>
            <span className="text-green-600">Online</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Redis Cache</span>
            <span className="text-green-600">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 