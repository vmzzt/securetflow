import React from 'react';
import { Card } from '@components/ui/Card';

const Monitoring: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoring</h1>
          <p className="text-gray-600">Monitoramento em tempo real</p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🔍 Monitoramento em Tempo Real
          </h2>
          <p className="text-gray-600">
            Esta página está em desenvolvimento. Em breve você verá:
          </p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>• 🚨 Alertas em tempo real</li>
            <li>• 📊 Status dos serviços</li>
            <li>• 🔄 Logs de atividades</li>
            <li>• ⚡ Performance metrics</li>
            <li>• 🛡️ Security events</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Monitoring; 