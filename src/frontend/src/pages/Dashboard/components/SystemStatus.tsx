import React from 'react';
import { motion } from 'framer-motion';
import Card from '@components/ui/Card';

interface SystemComponent {
  name: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  uptime: string;
  responseTime: string;
  lastCheck: string;
}

const SystemStatus: React.FC = () => {
  const components: SystemComponent[] = [
    {
      name: 'API Backend',
      status: 'online',
      uptime: '99.9%',
      responseTime: '45ms',
      lastCheck: '2 min atrás'
    },
    {
      name: 'Database',
      status: 'online',
      uptime: '99.8%',
      responseTime: '12ms',
      lastCheck: '1 min atrás'
    },
    {
      name: 'Scan Engine',
      status: 'warning',
      uptime: '95.2%',
      responseTime: '120ms',
      lastCheck: '5 min atrás'
    },
    {
      name: 'AI Service',
      status: 'online',
      uptime: '99.5%',
      responseTime: '200ms',
      lastCheck: '3 min atrás'
    },
    {
      name: 'File Storage',
      status: 'online',
      uptime: '99.9%',
      responseTime: '8ms',
      lastCheck: '1 min atrás'
    }
  ];

  const getStatusColor = (status: SystemComponent['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'maintenance':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: SystemComponent['status']) => {
    switch (status) {
      case 'online':
        return '🟢';
      case 'offline':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'maintenance':
        return '🔵';
      default:
        return '⚪';
    }
  };

  const getStatusText = (status: SystemComponent['status']) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'warning':
        return 'Atenção';
      case 'maintenance':
        return 'Manutenção';
      default:
        return 'Desconhecido';
    }
  };

  const overallStatus = components.every(c => c.status === 'online') ? 'online' : 'warning';

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Status do Sistema
          </h2>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(overallStatus)}`}>
              {getStatusIcon(overallStatus)} {getStatusText(overallStatus)}
            </span>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {components.map((component, index) => (
          <motion.div
            key={component.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{getStatusIcon(component.status)}</span>
              <div>
                <h3 className="font-medium text-gray-900">{component.name}</h3>
                <p className="text-sm text-gray-500">
                  Uptime: {component.uptime} | Response: {component.responseTime}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(component.status)}`}>
                {getStatusText(component.status)}
              </span>
              <p className="text-xs text-gray-400 mt-1">
                {component.lastCheck}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Uptime Geral</p>
            <p className="font-semibold text-gray-900">99.7%</p>
          </div>
          <div>
            <p className="text-gray-500">Tempo de Resposta</p>
            <p className="font-semibold text-gray-900">77ms</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SystemStatus; 