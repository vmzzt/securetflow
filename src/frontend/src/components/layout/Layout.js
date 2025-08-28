import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (_jsxs("div", { className: "flex h-screen bg-gray-100", children: [_jsx(Sidebar, { isOpen: sidebarOpen, onClose: () => setSidebarOpen(false) }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsx(Header, { onMenuClick: () => setSidebarOpen(true) }), _jsx("main", { className: "flex-1 overflow-x-hidden overflow-y-auto bg-gray-50", children: _jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-6", children: _jsx(Outlet, {}) }) })] })] }));
};
export default Layout;
