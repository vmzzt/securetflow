import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { AnimatePresence } from 'framer-motion';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  onChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const variantClasses = {
    default: {
      tab: 'border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700',
      active: 'border-blue-500 text-blue-600',
      inactive: 'text-gray-500'
    },
    pills: {
      tab: 'rounded-lg hover:bg-gray-100',
      active: 'bg-blue-100 text-blue-700',
      inactive: 'text-gray-500'
    },
    underline: {
      tab: 'border-b-2 border-transparent hover:border-gray-300',
      active: 'border-blue-500 text-blue-600',
      inactive: 'text-gray-500'
    }
  };

  const currentVariant = variantClasses[variant];

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className={clsx(
        'border-b border-gray-200',
        variant === 'pills' && 'border-b-0'
      )}>
        <nav className={clsx(
          'flex space-x-8',
          fullWidth && 'justify-between',
          variant === 'pills' && 'space-x-2'
        )}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabChange(tab.id)}
              disabled={tab.disabled}
              className={clsx(
                'flex items-center space-x-2 font-medium transition-colors',
                sizeClasses[size],
                currentVariant.tab,
                activeTab === tab.id ? currentVariant.active : currentVariant.inactive,
                tab.disabled && 'opacity-50 cursor-not-allowed',
                !tab.disabled && 'cursor-pointer',
                fullWidth && 'flex-1 justify-center'
              )}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={clsx(
                  'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            tab.id === activeTab && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {tab.content}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tabs; 