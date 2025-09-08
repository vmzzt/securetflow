/**
 * Securet Flow SSC - Main Application
 * POC Frontend - 100% Funcional
 */

class SecuretFlowApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.pages = {};
        this.modals = {};
        this.notifications = [];
        this.mockData = this.initializeMockData();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showLoadingScreen();
        this.initializeComponents();
    }

    setupEventListeners() {
        // Menu navigation
        document.querySelectorAll('.menu-section li').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                }
            });
        });

        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('open');
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            // Keyboard shortcut
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    searchInput.focus();
                }
            });
        }

        // Notifications
        const notificationsBtn = document.querySelector('.notifications');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotifications();
            });
        }

        // User menu
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            userMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Global click handler for modals and dropdowns
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
            this.closeDropdowns();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // User dropdown actions
        document.querySelectorAll('.user-actions a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                } else if (link.classList.contains('logout')) {
                    this.handleLogout();
                }
            });
        });
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        // Simulate loading time with progress
        let progress = 0;
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        const loadingSteps = [
            'Inicializando módulos...',
            'Carregando ferramentas...',
            'Conectando IA/LLM...',
            'Configurando integrações...',
            'Preparando dashboard...',
            'Sistema pronto!'
        ];

        const interval = setInterval(() => {
            progress += 16.67; // 100% / 6 steps
            if (progressFill) progressFill.style.width = `${progress}%`;
            if (progressText && progress < 100) {
                progressText.textContent = loadingSteps[Math.floor(progress / 16.67)];
            }
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        app.style.display = 'flex';
                        this.hideLoadingScreen();
                    }, 500);
                }, 500);
            }
        }, 500);
    }

    hideLoadingScreen() {
        // Initialize dashboard after loading
        this.loadDashboard();
        this.showWelcomeToast();
    }

    showWelcomeToast() {
        this.showToast('Bem-vindo ao Securet Flow SSC!', 'success');
    }

    navigateToPage(pageName) {
        // Update active menu item
        document.querySelectorAll('.menu-section li').forEach(item => {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`[data-page="${pageName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }

        // Update breadcrumb
        this.updateBreadcrumb(pageName);

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            this.loadPageContent(pageName);
        }

        // Close mobile menu
        document.querySelector('.sidebar').classList.remove('open');
    }

    updateBreadcrumb(pageName) {
        const breadcrumb = document.getElementById('breadcrumb');
        const pageTitles = {
            'dashboard': 'Dashboard',
            'analytics': 'Analytics',
            'monitoring': 'Monitoring',
            'targets': 'Target Management',
            'add-target': 'Add Target',
            'target-analytics': 'Risk Analysis',
            'scans': 'Active Scans',
            'new-scan': 'New Scan',
            'scan-history': 'Scan History',
            'custom-scan': 'Custom Scan',
            'vulnerabilities': 'Vulnerabilities',
            'reports': 'Reports',
            'ai-analysis': 'AI Analysis',
            'results-by-target': 'Results by Target',
            'tools': 'Tool Library',
            'integrations': 'Integrations',
            'workflows': 'Workflows',
            'plugins': 'Plugins',
            'pipelines': 'CI/CD Pipelines',
            'compliance': 'Compliance',
            'shift-left': 'Shift Left',
            'profile': 'Profile',
            'settings': 'Settings',
            'terminal': 'Terminal'
        };

        breadcrumb.innerHTML = `<span>${pageTitles[pageName] || pageName}</span>`;
    }

    loadPageContent(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'targets':
                this.loadTargets();
                break;
            case 'scans':
                this.loadScans();
                break;
            case 'vulnerabilities':
                this.loadVulnerabilities();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'tools':
                this.loadTools();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'ai-analysis':
                this.loadAIAnalysis();
                break;
            case 'integrations':
                this.loadIntegrations();
                break;
            case 'workflows':
                this.loadWorkflows();
                break;
            case 'pipelines':
                this.loadPipelines();
                break;
            case 'compliance':
                this.loadCompliance();
                break;
            case 'settings':
                this.loadSettings();
                break;
            case 'terminal':
                this.loadTerminal();
                break;
            case 'monitoring':
                this.loadMonitoring();
                break;
            case 'custom-scan':
                this.loadCustomScan();
                break;
            case 'results-by-target':
                this.loadResultsByTarget();
                break;
            case 'plugins':
                this.loadPlugins();
                break;
            case 'shift-left':
                this.loadShiftLeft();
                break;
            default:
                this.loadDashboard();
        }
    }

    loadDashboard() {
        const dashboardPage = document.getElementById('dashboard-page');
        dashboardPage.innerHTML = this.getDashboardHTML();
        this.initializeDashboardCharts();
        this.loadMockData();
    }

    getDashboardHTML() {
        return `
            <div class="dashboard-container">
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <div class="welcome-content">
                        <h1>Bem-vindo ao Securet Flow SSC</h1>
                        <p>Plataforma enterprise-grade para security testing e secure flow operations</p>
                        <div class="welcome-stats">
                            <div class="stat-item">
                                <span class="stat-number">100+</span>
                                <span class="stat-label">Ferramentas</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">AI</span>
                                <span class="stat-label">Powered</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">Enterprise</span>
                                <span class="stat-label">Ready</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Key Metrics -->
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="fas fa-crosshairs"></i>
                        </div>
                        <div class="metric-info">
                            <h3 id="totalTargets">12</h3>
                            <p>Total Targets</p>
                            <div class="metric-trend">
                                <i class="fas fa-arrow-up"></i>
                                <span>+3 esta semana</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon status-running">
                            <i class="fas fa-play"></i>
                        </div>
                        <div class="metric-info">
                            <h3 id="activeScans">8</h3>
                            <p>Scans Ativos</p>
                            <div class="metric-trend">
                                <i class="fas fa-clock"></i>
                                <span>15min avg</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon status-critical">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="metric-info">
                            <h3 id="criticalFindings">15</h3>
                            <p>Críticas</p>
                            <div class="metric-trend critical">
                                <i class="fas fa-arrow-up"></i>
                                <span>+5 hoje</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-icon status-success">
                            <i class="fas fa-check-shield"></i>
                        </div>
                        <div class="metric-info">
                            <h3 id="successRate">96%</h3>
                            <p>Taxa Sucesso</p>
                            <div class="metric-trend">
                                <i class="fas fa-arrow-up"></i>
                                <span>+2.1%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Dashboard Content Grid -->
                <div class="dashboard-grid">
                    <!-- Quick Actions -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-bolt"></i> Ações Rápidas</h3>
                        </div>
                        <div class="quick-actions">
                            <button class="quick-action-btn" onclick="app.navigateToPage('new-scan')">
                                <i class="fas fa-play"></i>
                                <span>Novo Scan</span>
                            </button>
                            <button class="quick-action-btn" onclick="app.navigateToPage('add-target')">
                                <i class="fas fa-plus"></i>
                                <span>Add Target</span>
                            </button>
                            <button class="quick-action-btn" onclick="app.navigateToPage('reports')">
                                <i class="fas fa-file-alt"></i>
                                <span>Gerar Relatório</span>
                            </button>
                            <button class="quick-action-btn" onclick="app.navigateToPage('ai-analysis')">
                                <i class="fas fa-brain"></i>
                                <span>AI Analysis</span>
                            </button>
                        </div>
                    </div>

                    <!-- Recent Scans -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-history"></i> Scans Recentes</h3>
                            <a href="#" onclick="app.navigateToPage('scan-history')" class="view-all">Ver todos</a>
                        </div>
                        <div class="recent-scans" id="recentScans">
                            <!-- Recent scans will be loaded here -->
                        </div>
                    </div>

                    <!-- Vulnerability Overview -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-bug"></i> Vulnerabilidades</h3>
                            <a href="#" onclick="app.navigateToPage('vulnerabilities')" class="view-all">Ver todas</a>
                        </div>
                        <div class="vulnerability-overview">
                            <canvas id="vulnerabilityChart" width="400" height="200"></canvas>
                        </div>
                    </div>

                    <!-- System Status -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-server"></i> Status do Sistema</h3>
                        </div>
                        <div class="system-status" id="systemStatus">
                            <!-- System status will be loaded here -->
                        </div>
                    </div>

                    <!-- AI Insights -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-brain"></i> Insights da IA</h3>
                        </div>
                        <div class="ai-insights" id="aiInsights">
                            <!-- AI insights will be loaded here -->
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-activity"></i> Atividade Recente</h3>
                        </div>
                        <div class="recent-activity" id="recentActivity">
                            <!-- Recent activity will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initializeDashboardCharts() {
        // Vulnerability Chart
        const ctx = document.getElementById('vulnerabilityChart');
        if (ctx) {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Críticas', 'Altas', 'Médias', 'Baixas', 'Info'],
                    datasets: [{
                        data: [15, 28, 42, 35, 12],
                        backgroundColor: [
                            '#ef4444',
                            '#f97316',
                            '#f59e0b',
                            '#10b981',
                            '#3b82f6'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                padding: 15
                            }
                        }
                    }
                }
            });
        }
    }

    loadMockData() {
        // Load recent scans
        this.loadRecentScans();
        
        // Load system status
        this.loadSystemStatus();
        
        // Load AI insights
        this.loadAIInsights();
        
        // Load recent activity
        this.loadRecentActivity();
    }

    loadRecentScans() {
        const recentScansContainer = document.getElementById('recentScans');
        if (!recentScansContainer) return;

        const scans = [
            { name: 'Nmap Scan - example.com', status: 'completed', time: '2 min ago', icon: 'fas fa-search' },
            { name: 'OWASP ZAP - api.example.com', status: 'running', time: '15 min ago', icon: 'fas fa-spider' },
            { name: 'Nuclei Scan - web.example.com', status: 'completed', time: '1 hour ago', icon: 'fas fa-bug' },
            { name: 'SQLMap - login.example.com', status: 'failed', time: '2 hours ago', icon: 'fas fa-database' }
        ];

        recentScansContainer.innerHTML = scans.map(scan => `
            <div class="scan-item ${scan.status}">
                <div class="scan-icon">
                    <i class="${scan.icon}"></i>
                </div>
                <div class="scan-info">
                    <h4>${scan.name}</h4>
                    <span class="scan-time">${scan.time}</span>
                </div>
                <div class="scan-status">
                    <span class="status-badge ${scan.status}">${scan.status}</span>
                </div>
            </div>
        `).join('');
    }

    loadSystemStatus() {
        const systemStatusContainer = document.getElementById('systemStatus');
        if (!systemStatusContainer) return;

        const services = [
            { name: 'API Gateway', status: 'online', icon: 'fas fa-server' },
            { name: 'Database', status: 'online', icon: 'fas fa-database' },
            { name: 'Redis Cache', status: 'online', icon: 'fas fa-memory' },
            { name: 'AI Service', status: 'online', icon: 'fas fa-brain' },
            { name: 'Scan Engine', status: 'online', icon: 'fas fa-cogs' },
            { name: 'Monitoring', status: 'warning', icon: 'fas fa-desktop' }
        ];

        systemStatusContainer.innerHTML = services.map(service => `
            <div class="service-item ${service.status}">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <div class="service-info">
                    <h4>${service.name}</h4>
                    <span class="service-status">${service.status}</span>
                </div>
                <div class="service-indicator">
                    <span class="status-dot ${service.status}"></span>
                </div>
            </div>
        `).join('');
    }

    loadAIInsights() {
        const aiInsightsContainer = document.getElementById('aiInsights');
        if (!aiInsightsContainer) return;

        const insights = [
            {
                type: 'warning',
                title: 'Padrão de Ataque Detectado',
                description: 'Identificado padrão similar ao CVE-2023-1234 em 3 targets',
                time: '5 min ago'
            },
            {
                type: 'info',
                title: 'Otimização de Scan',
                description: 'IA sugere usar Nmap + Nuclei para melhor cobertura',
                time: '15 min ago'
            },
            {
                type: 'success',
                title: 'False Positive Reduzido',
                description: 'Análise automática reduziu 23% de falsos positivos',
                time: '1 hour ago'
            }
        ];

        aiInsightsContainer.innerHTML = insights.map(insight => `
            <div class="insight-item ${insight.type}">
                <div class="insight-icon">
                    <i class="fas fa-${insight.type === 'warning' ? 'exclamation-triangle' : insight.type === 'info' ? 'info-circle' : 'check-circle'}"></i>
                </div>
                <div class="insight-content">
                    <h4>${insight.title}</h4>
                    <p>${insight.description}</p>
                    <span class="insight-time">${insight.time}</span>
                </div>
            </div>
        `).join('');
    }

    loadRecentActivity() {
        const recentActivityContainer = document.getElementById('recentActivity');
        if (!recentActivityContainer) return;

        const activities = [
            { action: 'Target adicionado', target: 'new-target.com', user: 'admin', time: '2 min ago' },
            { action: 'Scan iniciado', target: 'example.com', user: 'admin', time: '5 min ago' },
            { action: 'Relatório gerado', target: 'api.example.com', user: 'admin', time: '10 min ago' },
            { action: 'Vulnerabilidade corrigida', target: 'web.example.com', user: 'admin', time: '1 hour ago' },
            { action: 'Integração configurada', target: 'Discord Bot', user: 'admin', time: '2 hours ago' }
        ];

        recentActivityContainer.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-circle"></i>
                </div>
                <div class="activity-content">
                    <p><strong>${activity.action}</strong> em <strong>${activity.target}</strong></p>
                    <span class="activity-meta">por ${activity.user} • ${activity.time}</span>
                </div>
            </div>
        `).join('');
    }

    handleSearch(query) {
        if (query.length < 2) return;
        
        // Simulate search results
        const results = this.mockData.search(query);
        this.showSearchResults(results);
    }

    showSearchResults(results) {
        // Implementation for search results dropdown
        console.log('Search results:', results);
    }

    toggleNotifications() {
        const dropdown = document.querySelector('.notification-dropdown');
        dropdown.classList.toggle('show');
    }

    toggleUserMenu() {
        const dropdown = document.querySelector('.user-dropdown');
        dropdown.classList.toggle('show');
    }

    closeDropdowns() {
        document.querySelectorAll('.notification-dropdown, .user-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.querySelector('.search-bar input').focus();
        }
        
        // Escape to close modals/dropdowns
        if (e.key === 'Escape') {
            this.closeDropdowns();
            this.closeModal();
        }
    }

    handleLogout() {
        this.showToast('Logout realizado com sucesso!', 'info');
        // In a real app, this would redirect to login
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    initializeMockData() {
        return {
            search: (query) => {
                // Mock search functionality
                return [
                    { type: 'target', name: 'example.com', description: 'Web application target' },
                    { type: 'scan', name: 'Nmap Scan', description: 'Network discovery scan' },
                    { type: 'vulnerability', name: 'SQL Injection', description: 'Critical vulnerability found' }
                ].filter(item => 
                    item.name.toLowerCase().includes(query.toLowerCase()) ||
                    item.description.toLowerCase().includes(query.toLowerCase())
                );
            }
        };
    }

    initializeComponents() {
        // Initialize any additional components
        console.log('Securet Flow SSC initialized successfully!');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SecuretFlowApp();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SecuretFlowApp;
} 