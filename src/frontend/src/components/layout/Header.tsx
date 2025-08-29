import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden -m-2.5 p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden lg:flex lg:items-center lg:space-x-4 ml-4">
            <h1 className="text-lg font-semibold text-gray-900">
              Securet Flow SSC
            </h1>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header; 