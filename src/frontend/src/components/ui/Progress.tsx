import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'inside';
  animated?: boolean;
  striped?: boolean;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  labelPosition = 'top',
  animated = true,
  striped = false,
  className
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    info: 'bg-cyan-600'
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const renderLabel = () => {
    if (!showLabel) return null;

    const labelContent = `${Math.round(percentage)}%`;

    if (labelPosition === 'inside' && percentage > 15) {
      return (
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">
          {labelContent}
        </span>
      );
    }

    return (
      <div className={clsx(
        'font-medium text-gray-700',
        labelSizeClasses[size],
        labelPosition === 'top' && 'mb-1',
        labelPosition === 'bottom' && 'mt-1'
      )}>
        {labelContent}
      </div>
    );
  };

  return (
    <div className={className}>
      {labelPosition === 'top' && renderLabel()}
      
      <div className={clsx(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <motion.div
          className={clsx(
            'h-full rounded-full relative',
            variantClasses[variant],
            striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px]',
            animated && striped && 'animate-pulse'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 0.8 : 0, ease: 'easeOut' }}
        >
          {labelPosition === 'inside' && renderLabel()}
        </motion.div>
      </div>
      
      {labelPosition === 'bottom' && renderLabel()}
    </div>
  );
};

export default Progress; 