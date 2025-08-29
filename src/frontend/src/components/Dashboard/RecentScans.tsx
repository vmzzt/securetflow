import React from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Card } from '@components/ui/Card';

interface Scan {
  id: string | number;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  target: string;
  createdAt: string;
  duration?: string;
}

interface RecentScansProps {
  scans?: Scan[];
}

export const RecentScans: React.FC<RecentScansProps> = ({ 
  scans = [
    {
      id: 1,
      name: 'Scan de Vulnerabilidades Web',
      status: 'completed',
      target: 'https://example.com',
      createdAt: new Date().toISOString(),
      duration: '2m 34s'
    },
    {
      id: 2, 
      name: 'Scan de Portas',
      status: 'running',
      target: '192.168.1.100',
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      name: 'Scan de SSL/TLS', 
      status: 'completed',
      target: 'https://secure-site.com',
      createdAt: new Date().toISOString(),
      duration: '1m 12s'
    }
  ]
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'running':
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'running':
        return 'Executando';
      case 'failed':
        return 'Falhou';
      default:
        return 'Pendente';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'running':
        return 'text-blue-600 bg-blue-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Scans Recentes</h3>
      <div className="space-y-4">
        {scans.map((scan, index) => (
          <motion.div
            key={scan.id}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              {getStatusIcon(scan.status)}
              <div>
                <p className="font-medium text-gray-900">{scan.name}</p>
                <p className="text-sm text-gray-500">{scan.target}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(scan.status)}`}>
                {getStatusText(scan.status)}
              </span>
              {scan.duration && (
                <p className="text-xs text-gray-500 mt-1">{scan.duration}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}; 