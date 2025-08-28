import React from 'react';
import { motion } from 'framer-motion';
import Card from '@components/ui/Card';

interface Scan {
  id: string;
  target: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  duration: string;
  vulnerabilities: number;
}

const RecentScans: React.FC = () => {
  const scans: Scan[] = [
    {
      id: '1',
      target: 'example.com',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15 10:30',
      duration: '45 min',
      vulnerabilities: 12
    },
    {
      id: '2',
      target: 'api.example.com',
      status: 'running',
      progress: 65,
      startTime: '2024-01-15 11:15',
      duration: '30 min',
      vulnerabilities: 0
    },
    {
      id: '3',
      target: 'admin.example.com',
      status: 'failed',
      progress: 0,
      startTime: '2024-01-15 09:45',
      duration: '5 min',
      vulnerabilities: 0
    },
    {
      id: '4',
      target: 'mobile.example.com',
      status: 'pending',
      progress: 0,
      startTime: '2024-01-15 12:00',
      duration: '0 min',
      vulnerabilities: 0
    }
  ];

  const getStatusColor = (status: Scan['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: Scan['status']) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'running':
        return 'Executando';
      case 'failed':
        return 'Falhou';
      case 'pending':
        return 'Pendente';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Scans Recentes
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Ver todos
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {scans.map((scan, index) => (
          <motion.div
            key={scan.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <h3 className="font-medium text-gray-900">{scan.target}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(scan.status)}`}>
                  {getStatusText(scan.status)}
                </span>
              </div>
              
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>Início: {scan.startTime}</span>
                <span>Duração: {scan.duration}</span>
                {scan.vulnerabilities > 0 && (
                  <span className="text-red-600 font-medium">
                    {scan.vulnerabilities} vulnerabilidades
                  </span>
                )}
              </div>
              
              {scan.status === 'running' && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progresso</span>
                    <span>{scan.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${scan.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                👁️
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                📊
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default RecentScans; 