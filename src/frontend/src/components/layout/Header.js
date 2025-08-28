import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline';
const Header = ({ onMenuClick }) => {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const notifications = [
        {
            id: 1,
            title: 'Scan concluído',
            message: 'Scan do target example.com foi concluído com sucesso',
            time: '2 min atrás',
            type: 'success'
        },
        {
            id: 2,
            title: 'Vulnerabilidade encontrada',
            message: 'Nova vulnerabilidade crítica detectada no sistema',
            time: '5 min atrás',
            type: 'warning'
        },
        {
            id: 3,
            title: 'Sistema atualizado',
            message: 'Atualização do sistema foi aplicada com sucesso',
            time: '1 hora atrás',
            type: 'info'
        }
    ];
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'success':
                return '✅';
            case 'warning':
                return '⚠️';
            case 'error':
                return '❌';
            default:
                return 'ℹ️';
        }
    };
    return (_jsx("header", { className: "bg-white shadow-sm border-b border-gray-200", children: _jsxs("div", { className: "flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("button", { onClick: onMenuClick, className: "lg:hidden -m-2.5 p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg", children: _jsx(Bars3Icon, { className: "h-6 w-6" }) }), _jsxs("div", { className: "hidden lg:flex lg:items-center lg:space-x-4 ml-4", children: [_jsx("h1", { className: "text-lg font-semibold text-gray-900", children: "Securet Flow SSC" }), _jsx("span", { className: "text-sm text-gray-500", children: "|" }), _jsx("span", { className: "text-sm text-gray-600", children: "Plataforma Enterprise" })] })] }), _jsx("div", { className: "flex-1 max-w-lg mx-4 hidden md:block", children: _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(MagnifyingGlassIcon, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "text", placeholder: "Buscar targets, scans, vulnerabilidades...", className: "block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" })] }) }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsNotificationsOpen(!isNotificationsOpen), className: "relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg", children: [_jsx(BellIcon, { className: "h-6 w-6" }), _jsx("span", { className: "absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400" })] }), isNotificationsOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50", children: [_jsx("div", { className: "p-4 border-b border-gray-200", children: _jsx("h3", { className: "text-sm font-medium text-gray-900", children: "Notifica\u00E7\u00F5es" }) }), _jsx("div", { className: "max-h-64 overflow-y-auto", children: notifications.map((notification) => (_jsx("div", { className: "p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer", children: _jsxs("div", { className: "flex items-start", children: [_jsx("span", { className: "mr-3 text-lg", children: getNotificationIcon(notification.type) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: notification.title }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: notification.message }), _jsx("p", { className: "text-xs text-gray-400 mt-2", children: notification.time })] })] }) }, notification.id))) }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsx("button", { className: "text-sm text-blue-600 hover:text-blue-800 font-medium", children: "Ver todas as notifica\u00E7\u00F5es" }) })] }))] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsUserMenuOpen(!isUserMenuOpen), className: "flex items-center space-x-3 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg", children: [_jsx(UserCircleIcon, { className: "h-8 w-8" }), _jsx("span", { className: "hidden md:block text-sm font-medium text-gray-700", children: "Usu\u00E1rio" })] }), isUserMenuOpen && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50", children: _jsxs("div", { className: "py-1", children: [_jsx("a", { href: "/profile", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: "Perfil" }), _jsx("a", { href: "/settings", className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: "Configura\u00E7\u00F5es" }), _jsx("hr", { className: "my-1" }), _jsx("button", { className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100", children: "Sair" })] }) }))] })] })] }) }));
};
export default Header;
