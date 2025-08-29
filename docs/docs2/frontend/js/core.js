/**
 * SecureFlow SSC - Core Application Class
 * Main application class definition
 */

class SecureFlowApp {
    constructor() {
        this.currentPage = 'overview';
        this.pages = {};
        this.modals = {};
        this.notifications = [];
        this.mockData = this.initializeMockData();
        this.selectedTarget = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoadingScreen();
        this.initializeComponents();
    }

    setupEventListeners() {
        this.setupMenuNavigation();
        this.setupMobileMenu();
        this.setupSearch();
        this.setupNotifications();
        this.setupUserMenu();
        this.setupGlobalEvents();
        this.setupKeyboardShortcuts();
    }

    setupMenuNavigation() {
        document.querySelectorAll('.menu-section li').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('open');
            });
        }
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
    }

    setupNotifications() {
        const notificationsBtn = document.querySelector('.notifications');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                this.showNotifications();
            });
        }
    }

    setupUserMenu() {
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', () => {
                this.showUserMenu();
            });
        }
    }

    setupGlobalEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                app.style.display = 'flex';
                this.hideLoadingScreen();
            }, 500);
        }, 2000);
    }

    hideLoadingScreen() {
        this.loadOverview();
    }

    navigateToPage(pageName) {
        this.updateActiveMenuItem(pageName);
        this.currentPage = pageName;
        this.updateBreadcrumb(pageName);
        this.loadPageContent(pageName);
        this.closeMobileMenu();
    }

    updateActiveMenuItem(pageName) {
        document.querySelectorAll('.menu-section li').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-page="${pageName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    updateBreadcrumb(pageName) {
        const breadcrumb = document.getElementById('breadcrumb');
        const pageTitles = {
            'overview': 'Overview',
            'targets': 'Targets',
            'scans': 'Scan Operations',
            'vulnerabilities': 'Vulnerabilities',
            'reports': 'Reports',
            'tools': 'Tool Library',
            'analytics': 'Analytics',
            'ai-analysis': 'AI Analysis',
            'integrations': 'Integrations',
            'workflows': 'Workflows',
            'pipelines': 'CI/CD Pipelines',
            'compliance': 'Compliance',
            'settings': 'Settings',
            'profile': 'Profile'
        };

        breadcrumb.innerHTML = `<span>${pageTitles[pageName] || 'Dashboard'}</span>`;
    }

    loadPageContent(pageName) {
        const pageHandlers = {
            'overview': () => this.loadOverview(),
            'targets': () => this.loadTargets(),
            'scans': () => this.loadScans(),
            'vulnerabilities': () => this.loadVulnerabilities(),
            'reports': () => this.loadReports(),
            'tools': () => this.loadTools(),
            'analytics': () => this.loadAnalytics(),
            'ai-analysis': () => this.loadAIAnalysis(),
            'integrations': () => this.loadIntegrations(),
            'workflows': () => this.loadWorkflows(),
            'pipelines': () => this.loadPipelines(),
            'compliance': () => this.loadCompliance(),
            'settings': () => this.loadSettings(),
            'profile': () => this.loadProfile(),
            'risk-analysis': () => this.loadRiskAnalysis()
        };

        const handler = pageHandlers[pageName] || pageHandlers['overview'];
        handler();
    }

    closeMobileMenu() {
        document.querySelector('.sidebar').classList.remove('open');
    }

    initializeComponents() {
        console.log('SecureFlow Platform initialized successfully');
    }

    initializeMockData() {
        return {
            targets: [
                { id: 1, name: 'example.com', type: 'web', status: 'active', risk: 'critical' },
                { id: 2, name: 'api.company.com', type: 'api', status: 'active', risk: 'high' },
                { id: 3, name: '192.168.1.1', type: 'network', status: 'active', risk: 'medium' }
            ],
            scans: [
                { id: 1, target: 'example.com', status: 'running', progress: 65 },
                { id: 2, target: 'api.company.com', status: 'queued', progress: 0 }
            ],
            vulnerabilities: [
                { id: 1, title: 'SQL Injection', severity: 'critical', status: 'open' },
                { id: 2, title: 'XSS', severity: 'high', status: 'open' }
            ]
        };
    }

    handleSearch(query) {
        console.log('Searching for:', query);
    }

    showNotifications() {
        this.showModal('notifications');
    }

    showUserMenu() {
        console.log('Show user menu');
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.querySelector('.search-bar input').focus();
        }
    }

    showModal(modalType, data = {}) {
        const modalContainer = document.getElementById('modal-container');
        const modalHTML = this.getModalHTML(modalType, data);
        
        modalContainer.innerHTML = modalHTML;
        modalContainer.style.display = 'flex';
        
        this.setupModalEvents(modalType);
    }

    closeModal() {
        const modalContainer = document.getElementById('modal-container');
        modalContainer.style.display = 'none';
        modalContainer.innerHTML = '';
    }

    showNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date()
        };

        this.notifications.push(notification);
        this.displayNotification(notification);

        setTimeout(() => {
            this.removeNotification(notification.id);
        }, 5000);
    }

    displayNotification(notification) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = `notification notification-${notification.type}`;
        notificationContainer.innerHTML = `
            <div class="notification-content">
                <span>${notification.message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notificationContainer);

        setTimeout(() => {
            notificationContainer.classList.add('show');
        }, 100);
    }

    removeNotification(id) {
        const notification = document.querySelector(`[data-notification-id="${id}"]`);
        if (notification) {
            notification.remove();
        }
    }

    // Placeholder methods for page loading - will be implemented in pages.js
    loadOverview() {}
    loadTargets() {}
    loadScans() {}
    loadVulnerabilities() {}
    loadReports() {}
    loadTools() {}
    loadAnalytics() {}
    loadAIAnalysis() {}
    loadIntegrations() {}
    loadWorkflows() {}
    loadPipelines() {}
    loadCompliance() {}
    loadSettings() {}
    loadProfile() {}
    loadRiskAnalysis() {}

    getModalHTML(modalType, data) {
        return '<div class="modal-overlay"><div class="modal">Modal not implemented</div></div>';
    }

    setupModalEvents(modalType) {}
} 