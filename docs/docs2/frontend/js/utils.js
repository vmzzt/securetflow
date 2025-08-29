/**
 * SecureFlow SSC - Utilities
 * Utility functions for the application
 */

// Chart.js loader
function loadChartJS() {
    return new Promise((resolve, reject) => {
        if (window.Chart) {
            resolve(window.Chart);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js';
        script.onload = () => resolve(window.Chart);
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Number formatting
const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
};

// Date formatting
const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    return new Date(date).toLocaleDateString('pt-BR');
};

// Duration formatting
const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
};

// Generate unique ID
const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

// URL validation
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

// IP validation
const isValidIP = (ip) => {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
};

// Debounce function
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Local Storage utilities
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
    },
    get: (key, defaultValue = null) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Error reading from localStorage', e);
            return defaultValue;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage', e);
        }
    }
};

// Cookie utilities
const cookies = {
    set: (name, value, days = 7) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    get: (name) => {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    remove: (name) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
};

// API utilities
const api = {
    baseURL: '/api',
    
    request: async (endpoint, options = {}) => {
        const url = `${api.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    get: (endpoint) => api.request(endpoint),
    
    post: (endpoint, data) => api.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    put: (endpoint, data) => api.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    
    delete: (endpoint) => api.request(endpoint, {
        method: 'DELETE'
    })
};

// Mock data for development
const mockData = {
    targets: [
        { id: 1, name: 'example.com', type: 'web', url: 'https://example.com', risk_score: 85, status: 'active' },
        { id: 2, name: 'api.example.com', type: 'api', url: 'https://api.example.com', risk_score: 92, status: 'active' },
        { id: 3, name: 'admin.example.com', type: 'web', url: 'https://admin.example.com', risk_score: 78, status: 'active' }
    ],
    
    scans: [
        { id: 1, target: 'example.com', type: 'routine', status: 'completed', progress: 100, start_time: new Date(Date.now() - 3600000) },
        { id: 2, target: 'api.example.com', type: 'stealth', status: 'running', progress: 65, start_time: new Date(Date.now() - 1800000) },
        { id: 3, target: 'admin.example.com', type: 'massive', status: 'queued', progress: 0, start_time: null }
    ],
    
    vulnerabilities: [
        { id: 1, title: 'SQL Injection', severity: 'critical', target: 'example.com', tool: 'SQLMap', cvss: 9.8, status: 'open' },
        { id: 2, title: 'XSS Reflected', severity: 'high', target: 'api.example.com', tool: 'OWASP ZAP', cvss: 7.2, status: 'open' },
        { id: 3, title: 'Weak Password Policy', severity: 'medium', target: 'admin.example.com', tool: 'Nuclei', cvss: 5.5, status: 'fixed' }
    ],
    
    tools: [
        { name: 'Nmap', status: 'online', version: '7.94', category: 'network' },
        { name: 'OWASP ZAP', status: 'online', version: '2.14.0', category: 'web' },
        { name: 'Nuclei', status: 'online', version: '3.0.0', category: 'vulnerability' },
        { name: 'SQLMap', status: 'online', version: '1.7.2', category: 'exploitation' }
    ]
};

// Color constants
const colors = {
    primary: '#6366f1',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
    warning: '#f97316',
    success: '#22c55e',
    info: '#3b82f6',
    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827'
    }
};

// Severity colors mapping
const severityColors = {
    critical: colors.danger,
    high: colors.warning,
    medium: colors.accent,
    low: colors.success,
    info: colors.info
};

// Status colors mapping
const statusColors = {
    online: colors.success,
    offline: colors.danger,
    warning: colors.warning,
    running: colors.primary,
    completed: colors.success,
    failed: colors.danger,
    queued: colors.info
};

// Export utilities
window.SecureFlowUtils = {
    loadChartJS,
    formatNumber,
    formatDate,
    formatDuration,
    generateId,
    isValidUrl,
    isValidIP,
    debounce,
    throttle,
    storage,
    cookies,
    api,
    mockData,
    colors,
    severityColors,
    statusColors
}; 