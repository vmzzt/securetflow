import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, fullWidth = false, variant = 'default', className, ...props }, ref) => {
    const baseClasses = 'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500';
    
    const variantClasses = {
      default: 'bg-white',
      filled: 'bg-gray-50 border-gray-200',
      outlined: 'bg-transparent border-2'
    };
    
    const errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : '';
    const iconClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      errorClasses,
      iconClasses,
      widthClass,
      className
    );
    
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={classes}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 