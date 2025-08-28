import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
  delay?: number;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  delay = 0,
  className
}) => {
  const changeClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  };
  
  const changeIcon = {
    positive: '↗️',
    negative: '↘️',
    neutral: '→'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={clsx('text-sm font-medium', changeClasses[changeType])}>
                {changeIcon[changeType]} {change}
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
              {icon}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard; 