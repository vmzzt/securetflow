import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface DropdownItem {
  id: string;
  label: string;
  value?: any;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  placeholder?: string;
  value?: string;
  onChange?: (item: DropdownItem) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline';
  className?: string;
  trigger?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  placeholder = 'Selecione uma opção',
  value,
  onChange,
  disabled = false,
  size = 'md',
  variant = 'default',
  className,
  trigger
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find(item => item.id === value);

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    default: 'bg-white border border-gray-300 hover:border-gray-400',
    outline: 'bg-transparent border-2 border-gray-300 hover:border-gray-400'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled || item.divider) return;
    
    onChange?.(item);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {trigger ? (
        <div onClick={() => !disabled && setIsOpen(!isOpen)}>
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={clsx(
            'relative w-full text-left flex items-center justify-between',
            sizeClasses[size],
            variantClasses[variant],
            'rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            disabled && 'opacity-50 cursor-not-allowed',
            !disabled && 'cursor-pointer'
          )}
        >
          <span className={selectedItem ? 'text-gray-900' : 'text-gray-500'}>
            {selectedItem ? selectedItem.label : placeholder}
          </span>
          <ChevronDownIcon
            className={clsx(
              'h-4 w-4 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="py-1 max-h-60 overflow-auto">
              {items.map((item, index) => (
                <div key={item.id}>
                  {item.divider ? (
                    <div className="border-t border-gray-200 my-1" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelect(item)}
                      disabled={item.disabled}
                      className={clsx(
                        'w-full text-left px-4 py-2 text-sm flex items-center space-x-2',
                        'hover:bg-gray-100 focus:bg-gray-100 focus:outline-none',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        !item.disabled && 'cursor-pointer',
                        selectedItem?.id === item.id && 'bg-blue-50 text-blue-700'
                      )}
                    >
                      {item.icon && <span>{item.icon}</span>}
                      <span>{item.label}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown; 