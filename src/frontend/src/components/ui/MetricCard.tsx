import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface MetricCardProps {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
  color: string;
  bgColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
  name, 
  value, 
  change, 
  changeType, 
  icon, 
  color, 
  bgColor 
}) => {
  return (
    <motion.div 
      className={clsx(
        'p-6 rounded-lg border shadow-sm',
        bgColor
      )}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center">
        <span className="text-3xl mr-4">{icon}</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{name}</p>
          <p className={clsx('text-2xl font-bold mb-1', color)}>{value}</p>
          <p className={clsx(
            'text-xs font-medium',
            changeType === 'positive' && 'text-green-600',
            changeType === 'negative' && 'text-red-600',
            changeType === 'neutral' && 'text-gray-500'
          )}>
            {change}
          </p>
        </div>
      </div>
    </motion.div>
  );
}; 