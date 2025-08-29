import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  DesktopComputerIcon,
  CrosshairIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  PlayCircleIcon,
  ClockIcon,
  Cog6ToothIcon,
  BugAntIcon,
  DocumentTextIcon,
  BrainIcon,
  FunnelIcon,
  WrenchScrewdriverIcon,
  PlugIcon,
  Square3Stack3DIcon,
  PuzzlePieceIcon,
  QueueListIcon,
  ClipboardDocumentCheckIcon,
  ArrowLeftIcon,
  UserIcon,
  CommandLineIcon,
  BellIcon,
  MagnifyingGlassIcon as SearchIcon
} from '@heroicons/react/24/outline';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      section: 'Dashboard',
      items: [
        { name: 'Overview', path: '/dashboard', icon: ShieldCheckIcon, active: location.pathname === '/dashboard' },
        { name: 'Analytics', path: '/analytics', icon: ChartBarIcon, active: location.pathname === '/analytics' },
        { name: 'Monitoring', path: '/monitoring', icon: DesktopComputerIcon, active: location.pathname === '/monitoring' }
      ]
    },
    {
      section: 'Target Management',
      items: [
        { name: 'Targets', path: '/targets', icon: CrosshairIcon, badge: '12', active: location.pathname === '/targets' },
        { name: 'Add Target', path: '/targets/add', icon: PlusCircleIcon, active: location.pathname === '/targets/add' },
        { name: 'Risk Analysis', path: '/targets/analytics', icon: ChartBarIcon, active: location.pathname === '/targets/analytics' }
      ]
    },
    {
      section: 'Scan Operations',
      items: [
        { name: 'Active Scans', path: '/scans', icon: MagnifyingGlassIcon, badge: '8', badgeType: 'running', active: location.pathname === '/scans' },
        { name: 'New Scan', path: '/scans/new', icon: PlayCircleIcon, active: location.pathname === '/scans/new' },
        { name: 'Scan History', path: '/scans/history', icon: ClockIcon, active: location.pathname === '/scans/history' },
        { name: 'Custom Scan', path: '/scans/custom', icon: Cog6ToothIcon, active: location.pathname === '/scans/custom' }
      ]
    },
    {
      section: 'Results & Analysis',
      items: [
        { name: 'Vulnerabilities', path: '/vulnerabilities', icon: BugAntIcon, badge: '15', badgeType: 'critical', active: location.pathname === '/vulnerabilities' },
        { name: 'Reports', path: '/reports', icon: DocumentTextIcon, active: location.pathname === '/reports' },
        { name: 'AI Analysis', path: '/ai-analysis', icon: BrainIcon, active: location.pathname === '/ai-analysis' },
        { name: 'Results by Target', path: '/results', icon: FunnelIcon, active: location.pathname === '/results' }
      ]
    },
    {
      section: 'Tools & Arsenal',
      items: [
        { name: 'Tool Library', path: '/tools', icon: WrenchScrewdriverIcon, badge: '100+', active: location.pathname === '/tools' },
        { name: 'Integrations', path: '/integrations', icon: PlugIcon, active: location.pathname === '/integrations' },
        { name: 'Workflows', path: '/workflows', icon: Square3Stack3DIcon, active: location.pathname === '/workflows' },
        { name: 'Plugins', path: '/plugins', icon: PuzzlePieceIcon, active: location.pathname === '/plugins' }
      ]
    },
    {
      section: 'DevSecOps',
      items: [
        { name: 'CI/CD Pipelines', path: '/pipelines', icon: QueueListIcon, active: location.pathname === '/pipelines' },
        { name: 'Compliance', path: '/compliance', icon: ClipboardDocumentCheckIcon, active: location.pathname === '/compliance' },
        { name: 'Shift Left', path: '/shift-left', icon: ArrowLeftIcon, active: location.pathname === '/shift-left' }
      ]
    },
    {
      section: 'Settings',
      items: [
        { name: 'Profile', path: '/profile', icon: UserIcon, active: location.pathname === '/profile' },
        { name: 'Settings', path: '/settings', icon: Cog6ToothIcon, active: location.pathname === '/settings' },
        { name: 'Terminal', path: '/terminal', icon: CommandLineIcon, active: location.pathname === '/terminal' }
      ]
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Scan Completed',
      message: 'Nmap scan on example.com found 5 open ports',
      time: '2 min ago'
    },
    {
      id: 2,
      type: 'danger',
      title: 'Critical Vulnerability',
      message: 'SQL Injection detected in login form',
      time: '5 min ago'
    },
    {
      id: 3,
      type: 'success',
      title: 'AI Analysis Complete',
      message: 'Vulnerability analysis completed by LLM',
      time: '10 min ago'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Securet Flow</span>
            </div>
            <div className="text-xs text-gray-500">v1.0.0-ssc</div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center p-2 bg-green-50 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">Online</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {navItems.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  {section.section}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          item.active
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        <span className="flex-1">{item.name}</span>
                        {item.badge && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.badgeType === 'critical' 
                              ? 'bg-red-100 text-red-800'
                              : item.badgeType === 'running'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="text-sm text-gray-500">
                {navItems.flatMap(section => section.items).find(item => item.active)?.name || 'Dashboard'}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search targets, scans, vulnerabilities..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                >
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-3">
                        {notifications.map(notification => (
                          <div key={notification.id} className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.type === 'danger' ? 'bg-red-500' :
                              notification.type === 'warning' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-sm text-gray-500">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md"
                >
                  <img
                    className="w-8 h-8 rounded-full"
                    src="https://via.placeholder.com/32x32/6366f1/ffffff?text=AD"
                    alt="Admin"
                  />
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <img
                          className="w-10 h-10 rounded-full"
                          src="https://via.placeholder.com/40x40/6366f1/ffffff?text=AD"
                          alt="Admin"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Administrator</p>
                          <p className="text-sm text-gray-500">admin@purpleteam.local</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
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