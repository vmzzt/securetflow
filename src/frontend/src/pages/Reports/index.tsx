import React from 'react';
import { Card } from '@components/ui/Card';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Relatórios e análises</p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Relatórios e Análises
          </h2>
          <p className="text-gray-600">
            Esta página está em desenvolvimento. Em breve você verá:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• 📋 Relatórios de scans</li>
            <li>• 📈 Análises de tendências</li>
            <li>• 🎯 Relatórios de compliance</li>
            <li>• 📊 Dashboards personalizados</li>
            <li>• 📤 Exportação de dados</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Reports; 