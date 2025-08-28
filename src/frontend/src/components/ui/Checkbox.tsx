import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { CheckIcon } from '@heroicons/react/24/solid';
import { AnimatePresence } from 'framer-motion';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      indeterminate = false,
      size = 'md',
      variant = 'default',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };

    const iconSizeClasses = {
      sm: 'w-2.5 h-2.5',
      md: 'w-3 h-3',
      lg: 'w-4 h-4'
    };

    const variantClasses = {
      default: 'border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500',
      outline: 'border-2 border-gray-300 bg-transparent focus:ring-blue-500 focus:border-blue-500'
    };

    const baseClasses = clsx(
      'rounded transition-colors focus:outline-none focus:ring-2',
      sizeClasses[size],
      variantClasses[variant],
      error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
      className
    );

    return (
      <div className="space-y-1">
        <div className="flex items-start space-x-3">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className="sr-only"
              {...props}
            />
            
            <label
              htmlFor={checkboxId}
              className={clsx(
                'flex items-center justify-center cursor-pointer',
                props.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <motion.div
                className={clsx(
                  'border rounded flex items-center justify-center',
                  baseClasses
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence>
                  {(props.checked || indeterminate) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {indeterminate ? (
                        <div className={clsx(
                          'bg-gray-600 rounded-sm',
                          size === 'sm' ? 'w-2 h-0.5' : size === 'md' ? 'w-2.5 h-0.5' : 'w-3 h-1'
                        )} />
                      ) : (
                        <CheckIcon className={clsx(
                          'text-white',
                          iconSizeClasses[size]
                        )} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </label>
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className={clsx(
                'text-sm font-medium cursor-pointer',
                props.disabled ? 'text-gray-400' : 'text-gray-700'
              )}
            >
              {label}
            </label>
          )}
        </div>

        {(error || helperText) && (
          <p className={clsx(
            'text-sm',
            error ? 'text-red-600' : 'text-gray-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox; 