import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      label,
      error,
      helperText,
      size = 'md',
      variant = 'default',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    const sizeClasses = {
      sm: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3'
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5'
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6'
      }
    };

    const variantClasses = {
      default: {
        off: 'bg-gray-200',
        on: 'bg-blue-600'
      },
      success: {
        off: 'bg-gray-200',
        on: 'bg-green-600'
      },
      warning: {
        off: 'bg-gray-200',
        on: 'bg-yellow-600'
      },
      danger: {
        off: 'bg-gray-200',
        on: 'bg-red-600'
      }
    };

    const currentSize = sizeClasses[size];
    const currentVariant = variantClasses[variant];

    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={switchId}
              className="sr-only"
              {...props}
            />
            
            <label
              htmlFor={switchId}
              className={clsx(
                'flex items-center cursor-pointer',
                props.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <motion.div
                className={clsx(
                  'relative rounded-full transition-colors',
                  currentSize.track,
                  props.checked ? currentVariant.on : currentVariant.off,
                  error && 'bg-red-500',
                  className
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className={clsx(
                    'absolute top-0.5 bg-white rounded-full shadow-sm transition-transform',
                    currentSize.thumb
                  )}
                  animate={{
                    x: props.checked 
                      ? currentSize.track === 'w-8 h-4' ? 16 
                        : currentSize.track === 'w-11 h-6' ? 20 
                        : 28
                      : 2
                  }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                />
              </motion.div>
            </label>
          </div>

          {label && (
            <label
              htmlFor={switchId}
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

Switch.displayName = 'Switch';

export default Switch; 