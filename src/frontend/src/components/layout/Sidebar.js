import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { HomeIcon, ChartBarIcon, EyeIcon, TagIcon, MagnifyingGlassIcon, ExclamationTriangleIcon, DocumentTextIcon, CpuChipIcon, WrenchScrewdriverIcon, PuzzlePieceIcon, Cog6ToothIcon, UserIcon, CommandLineIcon, ShieldCheckIcon, ArrowTrendingUpIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Monitoramento', href: '/monitoring', icon: EyeIcon },
    { name: 'Targets', href: '/targets', icon: TagIcon },
    { name: 'Scans', href: '/scans', icon: MagnifyingGlassIcon },
    { name: 'Vulnerabilidades', href: '/vulnerabilities', icon: ExclamationTriangleIcon },
    { name: 'Relatórios', href: '/reports', icon: DocumentTextIcon },
    { name: 'Análise IA', href: '/ai-analysis', icon: CpuChipIcon },
    { name: 'Resultados por Target', href: '/results-by-target', icon: TagIcon },
    { name: 'Ferramentas', href: '/tools', icon: WrenchScrewdriverIcon },
    { name: 'Integrações', href: '/integrations', icon: PuzzlePieceIcon },
    { name: 'Workflows', href: '/workflows', icon: ArrowTrendingUpIcon },
    { name: 'Plugins', href: '/plugins', icon: PuzzlePieceIcon },
    { name: 'Pipelines', href: '/pipelines', icon: BuildingOfficeIcon },
    { name: 'Compliance', href: '/compliance', icon: ShieldCheckIcon },
    { name: 'Shift Left', href: '/shift-left', icon: ArrowTrendingUpIcon },
    { name: 'Terminal', href: '/terminal', icon: CommandLineIcon },
    { name: 'Perfil', href: '/profile', icon: UserIcon },
    { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon }
];
const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    return (_jsxs(_Fragment, { children: [isOpen && (_jsx("div", { className: "fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden", onClick: onClose })), _jsxs(motion.div, { className: clsx('fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-y-0 lg:left-0', isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'), initial: { x: -256 }, animate: { x: isOpen ? 0 : -256 }, transition: { duration: 0.3 }, children: [_jsx("div", { className: "flex h-16 items-center justify-center border-b border-gray-200 px-4", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white", children: "\uD83D\uDEE1\uFE0F" }), _jsx("span", { className: "text-lg font-bold text-gray-900", children: "Securet Flow SSC" })] }) }), _jsx("nav", { className: "flex-1 space-y-1 overflow-y-auto px-2 py-4", children: navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (_jsxs(Link, { to: item.href, className: clsx('group flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors', isActive
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'), onClick: () => {
                                    // Close sidebar on mobile after navigation
                                    if (window.innerWidth < 1024) {
                                        onClose();
                                    }
                                }, children: [_jsx(item.icon, { className: clsx('mr-3 h-5 w-5 flex-shrink-0', isActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500') }), _jsx("span", { className: "flex-1", children: item.name }), item.badge && (_jsx("span", { className: "ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800", children: item.badge }))] }, item.name));
                        }) }), _jsx("div", { className: "border-t border-gray-200 p-4", children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "h-8 w-8 rounded-full bg-gray-300" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-700", children: "Usu\u00E1rio" }), _jsx("p", { className: "text-xs text-gray-500", children: "usuario@securet-flow.com" })] })] }) })] })] }));
};
export default Sidebar;
