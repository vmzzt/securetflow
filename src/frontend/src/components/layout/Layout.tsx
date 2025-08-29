import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CogIcon,
  UserIcon,
  ChartBarIcon,
  ServerIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  PuzzlePieceIcon,
  CommandLineIcon,
  BeakerIcon,
  ShieldExclamationIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Analytics', path: '/analytics', icon: ChartBarIcon },
  { name: 'Monitoring', path: '/monitoring', icon: ServerIcon },
  { name: 'Targets', path: '/targets', icon: ShieldCheckIcon },
  { name: 'Scans', path: '/scans', icon: MagnifyingGlassIcon },
  { name: 'Vulnerabilities', path: '/vulnerabilities', icon: ShieldExclamationIcon },
  { name: 'Reports', path: '/reports', icon: DocumentTextIcon },
  { name: 'AI Analysis', path: '/ai-analysis', icon: CpuChipIcon },
  { name: 'Results by Target', path: '/results', icon: ShieldCheckIcon },
  { name: 'Tools', path: '/tools', icon: WrenchScrewdriverIcon },
  { name: 'Integrations', path: '/integrations', icon: PuzzlePieceIcon },
  { name: 'Workflows', path: '/workflows', icon: ArrowPathIcon },
  { name: 'Plugins', path: '/plugins', icon: PuzzlePieceIcon },
  { name: 'Pipelines', path: '/pipelines', icon: CommandLineIcon },
  { name: 'Compliance', path: '/compliance', icon: ShieldExclamationIcon },
  { name: 'Shift Left', path: '/shift-left', icon: BeakerIcon },
  { name: 'Profile', path: '/profile', icon: UserIcon },
  { name: 'Settings', path: '/settings', icon: CogIcon },
  { name: 'Terminal', path: '/terminal', icon: CommandLineIcon },
];

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Securet Flow</h1>
              <p className="text-xs text-gray-500">Security Platform</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-4 h-[calc(100vh-200px)] overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 w-64 p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Sistema Online</span>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 