import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  ShieldCheckIcon, 
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  UserIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  WrenchScrewdriverIcon,
  PuzzlePieceIcon,
  CommandLineIcon,
  BeakerIcon,
  ShieldExclamationIcon,
  ArrowPathIcon,
  CpuChipIcon,
  ServerIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
  description: string;
}

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
    description: 'Visão geral do sistema'
  },
  {
    name: 'Analytics',
    path: '/analytics',
    icon: ChartBarIcon,
    description: 'Análises e métricas'
  },
  {
    name: 'Monitoring',
    path: '/monitoring',
    icon: ServerIcon,
    description: 'Monitoramento em tempo real'
  },
  {
    name: 'Targets',
    path: '/targets',
    icon: ShieldCheckIcon,
    description: 'Gerenciar alvos'
  },
  {
    name: 'Scans',
    path: '/scans',
    icon: MagnifyingGlassIcon,
    description: 'Executar e monitorar scans'
  },
  {
    name: 'Vulnerabilities',
    path: '/vulnerabilities',
    icon: DocumentTextIcon,
    description: 'Análise de vulnerabilidades'
  },
  {
    name: 'Reports',
    path: '/reports',
    icon: ChartBarIcon,
    description: 'Relatórios e análises'
  },
  {
    name: 'AI Analysis',
    path: '/ai-analysis',
    icon: CpuChipIcon,
    description: 'Análise com IA'
  },
  {
    name: 'Results by Target',
    path: '/results',
    icon: ShieldCheckIcon,
    description: 'Resultados por alvo'
  },
  {
    name: 'Tools',
    path: '/tools',
    icon: WrenchScrewdriverIcon,
    description: 'Ferramentas de segurança'
  },
  {
    name: 'Integrations',
    path: '/integrations',
    icon: PuzzlePieceIcon,
    description: 'Integrações externas'
  },
  {
    name: 'Workflows',
    path: '/workflows',
    icon: ArrowPathIcon,
    description: 'Fluxos de trabalho'
  },
  {
    name: 'Plugins',
    path: '/plugins',
    icon: PuzzlePieceIcon,
    description: 'Plugins e extensões'
  },
  {
    name: 'Pipelines',
    path: '/pipelines',
    icon: CommandLineIcon,
    description: 'Pipelines de CI/CD'
  },
  {
    name: 'Compliance',
    path: '/compliance',
    icon: ShieldExclamationIcon,
    description: 'Conformidade'
  },
  {
    name: 'Shift Left',
    path: '/shift-left',
    icon: BeakerIcon,
    description: 'Segurança no desenvolvimento'
  },
  {
    name: 'Terminal',
    path: '/terminal',
    icon: CommandLineIcon,
    description: 'Terminal integrado'
  },
  {
    name: 'Profile',
    path: '/profile',
    icon: UserIcon,
    description: 'Perfil do usuário'
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: CogIcon,
    description: 'Configurações do sistema'
  }
];

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();
  const navigate = useNavigate();

  // Mock user data for development
  const user = {
    username: 'Admin User',
    role: 'Administrator'
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const currentNavItem = navItems.find(item => item.path === location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar - SEMPRE VISÍVEL */}
        <div className="w-64 bg-white shadow-lg flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ShieldCheckIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                Securet Flow
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role || 'User'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    {currentNavItem?.name || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {currentNavItem?.description || 'Visão geral do sistema'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="w-5 h-5" />
                  ) : (
                    <MoonIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Notifications */}
                <button className="relative p-2 rounded-md text-gray-400 hover:text-gray-600 transition-colors">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.username || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-4 md:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout; 