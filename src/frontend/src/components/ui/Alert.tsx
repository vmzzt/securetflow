import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export interface AlertProps {
  type?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  show?: boolean;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
  show = true
}) => {
  const alertConfig = {
    success: {
      icon: CheckCircleIcon,
      classes: 'bg-green-50 border-green-200 text-green-800',
      iconClasses: 'text-green-400'
    },
    warning: {
      icon: ExclamationTriangleIcon,
      classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconClasses: 'text-yellow-400'
    },
    error: {
      icon: XCircleIcon,
      classes: 'bg-red-50 border-red-200 text-red-800',
      iconClasses: 'text-red-400'
    },
    info: {
      icon: InformationCircleIcon,
      classes: 'bg-blue-50 border-blue-200 text-blue-800',
      iconClasses: 'text-blue-400'
    }
  };

  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            'border rounded-lg p-4',
            config.classes,
            className
          )}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <Icon className={clsx('h-5 w-5', config.iconClasses)} />
            </div>
            <div className="ml-3 flex-1">
              {title && (
                <h3 className="text-sm font-medium mb-1">
                  {title}
                </h3>
              )}
              <div className="text-sm">
                {message}
              </div>
            </div>
            {dismissible && (
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    type="button"
                    onClick={onDismiss}
                    className={clsx(
                      'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                      type === 'success' && 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600',
                      type === 'warning' && 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600',
                      type === 'error' && 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600',
                      type === 'info' && 'bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
                    )}
                  >
                    <span className="sr-only">Fechar</span>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert; 