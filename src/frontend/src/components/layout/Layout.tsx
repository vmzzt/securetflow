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
import { useAuthStore } from '@stores/authStore';

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
    description: 'Conformidade e auditoria'
  },
  {
    name: 'Shift Left',
    path: '/shift-left',
    icon: BeakerIcon,
    description: 'Segurança no desenvolvimento'
  }
];

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (!user) {
    return null; // Don't render anything if not authenticated
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Securet Flow</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.full_name || user.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800">
                <BellIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="bg-gray-50 dark:bg-gray-800 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout; 