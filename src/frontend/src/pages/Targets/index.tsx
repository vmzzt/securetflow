import React from 'react';

const Targets: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Targets</h1>
        <p className="text-gray-600">Gerencie seus alvos de segurança</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum target encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Adicione seus primeiros alvos para começar a escanear.</p>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Adicionar Target
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Targets; 