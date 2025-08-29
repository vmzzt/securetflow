/**
 * SecureFlow SSC - Page Handlers
 * Handlers para carregamento de páginas específicas
 */

// Extend SecureFlowApp with page methods
Object.assign(SecureFlowApp.prototype, {
    
    /**
     * Load Dashboard Page
     */
    loadDashboard() {
        try {
            const pageContainer = document.getElementById('page-container');
            if (!pageContainer) {
                throw new Error('Page container element not found');
            }
            
            pageContainer.innerHTML = this.getDashboardHTML();
            this.initializeDashboardCharts();
            this.loadMockData();
        } catch (error) {
            console.error('Failed to load dashboard:', error);
            this.showError('Falha ao carregar dashboard');
        }
    },

    /**
     * Get Dashboard HTML
     */
    getDashboardHTML() {
        return `
            <div class="dashboard-container">
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <div class="welcome-content">
                        <h1>Bem-vindo ao SecureFlow SSC</h1>
                        <p>Plataforma enterprise-grade para security testing e purple team operations</p>
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
                            <button class="quick-action-btn" onclick="app.showAddTargetModal()">
                                <i class="fas fa-plus"></i>
                                <span>Novo Target</span>
                            </button>
                            <button class="quick-action-btn" onclick="app.startQuickScan('stealth')">
                                <i class="fas fa-user-secret"></i>
                                <span>Scan Stealth</span>
                            </button>
                            <button class="quick-action-btn" onclick="app.startQuickScan('routine')">
                                <i class="fas fa-search"></i>
                                <span>Scan Rotina</span>
                            </button>
                            <button class="quick-action-btn" onclick="app.startQuickScan('massive')">
                                <i class="fas fa-rocket"></i>
                                <span>Scan Massivo</span>
                            </button>
                        </div>
                    </div>

                    <!-- Recent Activity -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-history"></i> Atividade Recente</h3>
                            <button class="btn btn--outline btn--sm">Ver Todos</button>
                        </div>
                        <div class="activity-list" id="activityList">
                            <!-- Activity items will be populated -->
                        </div>
                    </div>

                    <!-- Vulnerability Chart -->
                    <div class="dashboard-card chart-card">
                        <div class="card-header">
                            <h3><i class="fas fa-chart-pie"></i> Distribuição de Vulnerabilidades</h3>
                        </div>
                        <div class="chart-container">
                            <canvas id="vulnerabilityChart"></canvas>
                        </div>
                    </div>

                    <!-- System Health -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-heartbeat"></i> Saúde do Sistema</h3>
                        </div>
                        <div class="system-health">
                            <div class="health-item">
                                <span class="health-label">CPU Usage</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 45%"></div>
                                </div>
                                <span class="health-value">45%</span>
                            </div>
                            <div class="health-item">
                                <span class="health-label">Memory</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 62%"></div>
                                </div>
                                <span class="health-value">62%</span>
                            </div>
                            <div class="health-item">
                                <span class="health-label">Storage</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 78%"></div>
                                </div>
                                <span class="health-value">78%</span>
                            </div>
                        </div>
                    </div>

                    <!-- Tool Status -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-tools"></i> Status das Ferramentas</h3>
                        </div>
                        <div class="tool-status-grid" id="toolStatus">
                            <!-- Tool status will be populated -->
                        </div>
                    </div>

                    <!-- AI Insights -->
                    <div class="dashboard-card">
                        <div class="card-header">
                            <h3><i class="fas fa-brain"></i> Insights da IA</h3>
                        </div>
                        <div class="ai-insights" id="aiInsights">
                            <!-- AI insights will be populated -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Initialize Dashboard Charts
     */
    initializeDashboardCharts() {
        try {
            // Load Chart.js dynamically
            PurpleTeamUtils.loadChartJS().then(Chart => {
                const ctx = document.getElementById('vulnerabilityChart');
                if (ctx) {
                    new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Críticas', 'Altas', 'Médias', 'Baixas', 'Info'],
                            datasets: [{
                                data: [15, 42, 89, 156, 234],
                                backgroundColor: [
                                    '#ef4444',
                                    '#f97316',
                                    '#f59e0b',
                                    '#22c55e',
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
                                        padding: 20,
                                        usePointStyle: true
                                    }
                                }
                            }
                        }
                    });
                }
            }).catch(error => {
                console.error('Failed to load Chart.js:', error);
            });
        } catch (error) {
            console.error('Failed to initialize charts:', error);
        }
    },

    /**
     * Load Mock Data
     */
    loadMockData() {
        this.loadActivityList();
        this.loadToolStatus();
        this.loadAIInsights();
    },

    /**
     * Load Activity List
     */
    loadActivityList() {
        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">Scan completado em example.com</div>
                        <div class="activity-time">2 minutos atrás</div>
                    </div>
                    <div class="activity-status success">
                        <i class="fas fa-check"></i>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-bug"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">Nova vulnerabilidade crítica detectada</div>
                        <div class="activity-time">15 minutos atrás</div>
                    </div>
                    <div class="activity-status critical">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                </div>
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">Novo target adicionado: api.example.com</div>
                        <div class="activity-time">1 hora atrás</div>
                    </div>
                    <div class="activity-status info">
                        <i class="fas fa-info"></i>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Tool Status
     */
    loadToolStatus() {
        const toolStatus = document.getElementById('toolStatus');
        if (toolStatus) {
            toolStatus.innerHTML = `
                <div class="tool-status-item online">
                    <i class="fas fa-circle"></i>
                    <span>Nmap</span>
                </div>
                <div class="tool-status-item online">
                    <i class="fas fa-circle"></i>
                    <span>OWASP ZAP</span>
                </div>
                <div class="tool-status-item online">
                    <i class="fas fa-circle"></i>
                    <span>Nuclei</span>
                </div>
                <div class="tool-status-item online">
                    <i class="fas fa-circle"></i>
                    <span>SQLMap</span>
                </div>
                <div class="tool-status-item online">
                    <i class="fas fa-circle"></i>
                    <span>Amass</span>
                </div>
                <div class="tool-status-item online">
                    <i class="fas fa-circle"></i>
                    <span>Subfinder</span>
                </div>
            `;
        }
    },

    /**
     * Load AI Insights
     */
    loadAIInsights() {
        const aiInsights = document.getElementById('aiInsights');
        if (aiInsights) {
            aiInsights.innerHTML = `
                <div class="ai-insight">
                    <div class="insight-icon">
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <div class="insight-content">
                        <div class="insight-title">Padrão de Vulnerabilidade Detectado</div>
                        <div class="insight-description">Identificamos um padrão similar em 3 targets diferentes. Recomendamos investigação prioritária.</div>
                    </div>
                </div>
                <div class="ai-insight">
                    <div class="insight-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="insight-content">
                        <div class="insight-title">Tendência de Melhoria</div>
                        <div class="insight-description">Redução de 23% em vulnerabilidades críticas nos últimos 30 dias.</div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Targets Page
     */
    loadTargets() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-crosshairs"></i> Target Management</h1>
                        <button class="btn btn--primary" onclick="app.showAddTargetModal()">
                            <i class="fas fa-plus"></i> Novo Target
                        </button>
                    </div>
                    
                    <div class="targets-grid">
                        <div class="target-card">
                            <div class="target-header">
                                <h3>example.com</h3>
                                <span class="target-status active">Ativo</span>
                            </div>
                            <div class="target-info">
                                <p><strong>Tipo:</strong> Web Application</p>
                                <p><strong>URL:</strong> https://example.com</p>
                                <p><strong>Risk Score:</strong> <span class="risk-high">85</span></p>
                            </div>
                            <div class="target-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.startScan('example.com')">
                                    <i class="fas fa-play"></i> Scan
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.viewTargetDetails('example.com')">
                                    <i class="fas fa-eye"></i> Detalhes
                                </button>
                            </div>
                        </div>
                        
                        <div class="target-card">
                            <div class="target-header">
                                <h3>api.example.com</h3>
                                <span class="target-status active">Ativo</span>
                            </div>
                            <div class="target-info">
                                <p><strong>Tipo:</strong> API</p>
                                <p><strong>URL:</strong> https://api.example.com</p>
                                <p><strong>Risk Score:</strong> <span class="risk-medium">45</span></p>
                            </div>
                            <div class="target-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.startScan('api.example.com')">
                                    <i class="fas fa-play"></i> Scan
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.viewTargetDetails('api.example.com')">
                                    <i class="fas fa-eye"></i> Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Scans Page
     */
    loadScans() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-search"></i> Active Scans</h1>
                        <button class="btn btn--primary" onclick="app.showNewScanModal()">
                            <i class="fas fa-plus"></i> Novo Scan
                        </button>
                    </div>
                    
                    <div class="scans-list">
                        <div class="scan-item running">
                            <div class="scan-info">
                                <h3>Port Scan - example.com</h3>
                                <p>Nmap scan em progresso</p>
                                <div class="scan-progress">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 65%"></div>
                                    </div>
                                    <span>65% completo</span>
                                </div>
                            </div>
                            <div class="scan-actions">
                                <button class="btn btn--sm btn--danger" onclick="app.stopScan('scan-1')">
                                    <i class="fas fa-stop"></i> Parar
                                </button>
                            </div>
                        </div>
                        
                        <div class="scan-item completed">
                            <div class="scan-info">
                                <h3>Vulnerability Scan - api.example.com</h3>
                                <p>Nuclei scan completado</p>
                                <div class="scan-results">
                                    <span class="result-critical">3 críticas</span>
                                    <span class="result-high">7 altas</span>
                                    <span class="result-medium">12 médias</span>
                                </div>
                            </div>
                            <div class="scan-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.viewScanResults('scan-2')">
                                    <i class="fas fa-eye"></i> Ver Resultados
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Vulnerabilities Page
     */
    loadVulnerabilities() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-bug"></i> Vulnerabilities</h1>
                        <div class="header-actions">
                            <button class="btn btn--outline" onclick="app.exportVulnerabilities()">
                                <i class="fas fa-download"></i> Exportar
                            </button>
                            <button class="btn btn--primary" onclick="app.showVulnerabilityFilters()">
                                <i class="fas fa-filter"></i> Filtros
                            </button>
                        </div>
                    </div>
                    
                    <div class="vulnerabilities-summary">
                        <div class="vuln-stat critical">
                            <span class="stat-number">15</span>
                            <span class="stat-label">Críticas</span>
                        </div>
                        <div class="vuln-stat high">
                            <span class="stat-number">32</span>
                            <span class="stat-label">Altas</span>
                        </div>
                        <div class="vuln-stat medium">
                            <span class="stat-number">67</span>
                            <span class="stat-label">Médias</span>
                        </div>
                        <div class="vuln-stat low">
                            <span class="stat-number">124</span>
                            <span class="stat-label">Baixas</span>
                        </div>
                    </div>
                    
                    <div class="vulnerabilities-list">
                        <div class="vuln-item critical">
                            <div class="vuln-severity">
                                <i class="fas fa-exclamation-triangle"></i>
                            </div>
                            <div class="vuln-info">
                                <h3>SQL Injection</h3>
                                <p>example.com/login.php</p>
                                <span class="vuln-cve">CVE-2023-1234</span>
                            </div>
                            <div class="vuln-status">
                                <span class="status-open">Aberta</span>
                            </div>
                            <div class="vuln-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.viewVulnerabilityDetails('vuln-1')">
                                    <i class="fas fa-eye"></i> Detalhes
                                </button>
                            </div>
                        </div>
                        
                        <div class="vuln-item high">
                            <div class="vuln-severity">
                                <i class="fas fa-exclamation-circle"></i>
                            </div>
                            <div class="vuln-info">
                                <h3>XSS Reflected</h3>
                                <p>api.example.com/search</p>
                                <span class="vuln-cve">CVE-2023-5678</span>
                            </div>
                            <div class="vuln-status">
                                <span class="status-open">Aberta</span>
                            </div>
                            <div class="vuln-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.viewVulnerabilityDetails('vuln-2')">
                                    <i class="fas fa-eye"></i> Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Reports Page
     */
    loadReports() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-file-alt"></i> Reports</h1>
                        <button class="btn btn--primary" onclick="app.showNewReportModal()">
                            <i class="fas fa-plus"></i> Novo Relatório
                        </button>
                    </div>
                    
                    <div class="reports-grid">
                        <div class="report-card">
                            <div class="report-header">
                                <h3>Security Assessment - example.com</h3>
                                <span class="report-date">15/12/2023</span>
                            </div>
                            <div class="report-summary">
                                <p>Relatório completo de vulnerabilidades e recomendações</p>
                                <div class="report-stats">
                                    <span class="stat critical">15 críticas</span>
                                    <span class="stat high">32 altas</span>
                                </div>
                            </div>
                            <div class="report-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.downloadReport('report-1')">
                                    <i class="fas fa-download"></i> PDF
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.viewReport('report-1')">
                                    <i class="fas fa-eye"></i> Visualizar
                                </button>
                            </div>
                        </div>
                        
                        <div class="report-card">
                            <div class="report-header">
                                <h3>Network Scan Report</h3>
                                <span class="report-date">10/12/2023</span>
                            </div>
                            <div class="report-summary">
                                <p>Análise de segurança da rede corporativa</p>
                                <div class="report-stats">
                                    <span class="stat medium">45 médias</span>
                                    <span class="stat low">89 baixas</span>
                                </div>
                            </div>
                            <div class="report-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.downloadReport('report-2')">
                                    <i class="fas fa-download"></i> PDF
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.viewReport('report-2')">
                                    <i class="fas fa-eye"></i> Visualizar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Tools Page
     */
    loadTools() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-tools"></i> Tool Library</h1>
                        <button class="btn btn--primary" onclick="app.showAddToolModal()">
                            <i class="fas fa-plus"></i> Adicionar Ferramenta
                        </button>
                    </div>
                    
                    <div class="tools-grid">
                        <div class="tool-card">
                            <div class="tool-icon">
                                <i class="fas fa-network-wired"></i>
                            </div>
                            <div class="tool-info">
                                <h3>Nmap</h3>
                                <p>Network discovery and security auditing</p>
                                <div class="tool-status online">Online</div>
                            </div>
                            <div class="tool-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.configureTool('nmap')">
                                    <i class="fas fa-cog"></i> Configurar
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.testTool('nmap')">
                                    <i class="fas fa-play"></i> Testar
                                </button>
                            </div>
                        </div>
                        
                        <div class="tool-card">
                            <div class="tool-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <div class="tool-info">
                                <h3>Nessus</h3>
                                <p>Vulnerability assessment and management</p>
                                <div class="tool-status online">Online</div>
                            </div>
                            <div class="tool-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.configureTool('nessus')">
                                    <i class="fas fa-cog"></i> Configurar
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.testTool('nessus')">
                                    <i class="fas fa-play"></i> Testar
                                </button>
                            </div>
                        </div>
                        
                        <div class="tool-card">
                            <div class="tool-icon">
                                <i class="fas fa-bug"></i>
                            </div>
                            <div class="tool-info">
                                <h3>Burp Suite</h3>
                                <p>Web application security testing</p>
                                <div class="tool-status offline">Offline</div>
                            </div>
                            <div class="tool-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.configureTool('burp')">
                                    <i class="fas fa-cog"></i> Configurar
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.testTool('burp')">
                                    <i class="fas fa-play"></i> Testar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Analytics Page
     */
    loadAnalytics() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-chart-bar"></i> Analytics</h1>
                        <div class="header-actions">
                            <button class="btn btn--outline" onclick="app.exportAnalytics()">
                                <i class="fas fa-download"></i> Exportar
                            </button>
                            <button class="btn btn--primary" onclick="app.showAnalyticsFilters()">
                                <i class="fas fa-filter"></i> Filtros
                            </button>
                        </div>
                    </div>
                    
                    <div class="analytics-grid">
                        <div class="chart-container">
                            <h3>Vulnerability Trends</h3>
                            <div class="chart-placeholder">
                                <i class="fas fa-chart-line"></i>
                                <p>Chart visualization will be displayed here</p>
                            </div>
                        </div>
                        
                        <div class="chart-container">
                            <h3>Scan Performance</h3>
                            <div class="chart-placeholder">
                                <i class="fas fa-chart-bar"></i>
                                <p>Performance metrics will be displayed here</p>
                            </div>
                        </div>
                        
                        <div class="chart-container">
                            <h3>Risk Distribution</h3>
                            <div class="chart-placeholder">
                                <i class="fas fa-chart-pie"></i>
                                <p>Risk analysis will be displayed here</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load AI Analysis Page
     */
    loadAIAnalysis() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-brain"></i> AI Analysis</h1>
                        <button class="btn btn--primary" onclick="app.startAIAnalysis()">
                            <i class="fas fa-play"></i> Iniciar Análise
                        </button>
                    </div>
                    
                    <div class="ai-analysis-content">
                        <div class="ai-status">
                            <div class="ai-indicator online">
                                <i class="fas fa-circle"></i>
                                <span>AI Engine Online</span>
                            </div>
                        </div>
                        
                        <div class="ai-insights">
                            <h3>AI Insights</h3>
                            <div class="insight-item">
                                <div class="insight-icon">
                                    <i class="fas fa-lightbulb"></i>
                                </div>
                                <div class="insight-content">
                                    <h4>Pattern Detection</h4>
                                    <p>AI detected similar vulnerability patterns across multiple targets</p>
                                </div>
                            </div>
                            
                            <div class="insight-item">
                                <div class="insight-icon">
                                    <i class="fas fa-chart-line"></i>
                                </div>
                                <div class="insight-content">
                                    <h4>Risk Prediction</h4>
                                    <p>Predicted 15% increase in critical vulnerabilities based on recent trends</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Integrations Page
     */
    loadIntegrations() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-plug"></i> Integrations</h1>
                        <button class="btn btn--primary" onclick="app.showAddIntegrationModal()">
                            <i class="fas fa-plus"></i> Nova Integração
                        </button>
                    </div>
                    
                    <div class="integrations-grid">
                        <div class="integration-card">
                            <div class="integration-icon">
                                <i class="fab fa-github"></i>
                            </div>
                            <div class="integration-info">
                                <h3>GitHub</h3>
                                <p>Source code repository integration</p>
                                <div class="integration-status connected">Conectado</div>
                            </div>
                            <div class="integration-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.configureIntegration('github')">
                                    <i class="fas fa-cog"></i> Configurar
                                </button>
                                <button class="btn btn--sm btn--danger" onclick="app.disconnectIntegration('github')">
                                    <i class="fas fa-unlink"></i> Desconectar
                                </button>
                            </div>
                        </div>
                        
                        <div class="integration-card">
                            <div class="integration-icon">
                                <i class="fab fa-jira"></i>
                            </div>
                            <div class="integration-info">
                                <h3>Jira</h3>
                                <p>Issue tracking and project management</p>
                                <div class="integration-status connected">Conectado</div>
                            </div>
                            <div class="integration-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.configureIntegration('jira')">
                                    <i class="fas fa-cog"></i> Configurar
                                </button>
                                <button class="btn btn--sm btn--danger" onclick="app.disconnectIntegration('jira')">
                                    <i class="fas fa-unlink"></i> Desconectar
                                </button>
                            </div>
                        </div>
                        
                        <div class="integration-card">
                            <div class="integration-icon">
                                <i class="fab fa-slack"></i>
                            </div>
                            <div class="integration-info">
                                <h3>Slack</h3>
                                <p>Team communication and notifications</p>
                                <div class="integration-status disconnected">Desconectado</div>
                            </div>
                            <div class="integration-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.configureIntegration('slack')">
                                    <i class="fas fa-cog"></i> Configurar
                                </button>
                                <button class="btn btn--sm btn--primary" onclick="app.connectIntegration('slack')">
                                    <i class="fas fa-link"></i> Conectar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Workflows Page
     */
    loadWorkflows() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-project-diagram"></i> Workflows</h1>
                        <button class="btn btn--primary" onclick="app.showNewWorkflowModal()">
                            <i class="fas fa-plus"></i> Novo Workflow
                        </button>
                    </div>
                    
                    <div class="workflows-grid">
                        <div class="workflow-card">
                            <div class="workflow-header">
                                <h3>Automated Security Scan</h3>
                                <span class="workflow-status active">Ativo</span>
                            </div>
                            <div class="workflow-description">
                                <p>Executa scan automático diário em todos os targets</p>
                            </div>
                            <div class="workflow-trigger">
                                <i class="fas fa-clock"></i>
                                <span>Diário às 02:00</span>
                            </div>
                            <div class="workflow-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.editWorkflow('workflow-1')">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.runWorkflow('workflow-1')">
                                    <i class="fas fa-play"></i> Executar
                                </button>
                            </div>
                        </div>
                        
                        <div class="workflow-card">
                            <div class="workflow-header">
                                <h3>Vulnerability Report</h3>
                                <span class="workflow-status active">Ativo</span>
                            </div>
                            <div class="workflow-description">
                                <p>Gera relatório semanal de vulnerabilidades</p>
                            </div>
                            <div class="workflow-trigger">
                                <i class="fas fa-calendar"></i>
                                <span>Semanal às Segunda</span>
                            </div>
                            <div class="workflow-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.editWorkflow('workflow-2')">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.runWorkflow('workflow-2')">
                                    <i class="fas fa-play"></i> Executar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Pipelines Page
     */
    loadPipelines() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-stream"></i> CI/CD Pipelines</h1>
                        <button class="btn btn--primary" onclick="app.showNewPipelineModal()">
                            <i class="fas fa-plus"></i> Nova Pipeline
                        </button>
                    </div>
                    
                    <div class="pipelines-grid">
                        <div class="pipeline-card">
                            <div class="pipeline-header">
                                <h3>Security Scan Pipeline</h3>
                                <span class="pipeline-status success">Sucesso</span>
                            </div>
                            <div class="pipeline-info">
                                <p>Pipeline de segurança para aplicações web</p>
                                <div class="pipeline-steps">
                                    <div class="step completed">
                                        <i class="fas fa-check"></i>
                                        <span>Code Analysis</span>
                                    </div>
                                    <div class="step completed">
                                        <i class="fas fa-check"></i>
                                        <span>Dependency Check</span>
                                    </div>
                                    <div class="step completed">
                                        <i class="fas fa-check"></i>
                                        <span>Security Scan</span>
                                    </div>
                                </div>
                            </div>
                            <div class="pipeline-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.viewPipelineDetails('pipeline-1')">
                                    <i class="fas fa-eye"></i> Detalhes
                                </button>
                                <button class="btn btn--sm btn--outline" onclick="app.runPipeline('pipeline-1')">
                                    <i class="fas fa-play"></i> Executar
                                </button>
                            </div>
                        </div>
                        
                        <div class="pipeline-card">
                            <div class="pipeline-header">
                                <h3>Compliance Check</h3>
                                <span class="pipeline-status running">Executando</span>
                            </div>
                            <div class="pipeline-info">
                                <p>Verificação de compliance e auditoria</p>
                                <div class="pipeline-steps">
                                    <div class="step completed">
                                        <i class="fas fa-check"></i>
                                        <span>Policy Check</span>
                                    </div>
                                    <div class="step running">
                                        <i class="fas fa-spinner fa-spin"></i>
                                        <span>Compliance Scan</span>
                                    </div>
                                    <div class="step pending">
                                        <i class="fas fa-clock"></i>
                                        <span>Report Generation</span>
                                    </div>
                                </div>
                            </div>
                            <div class="pipeline-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.viewPipelineDetails('pipeline-2')">
                                    <i class="fas fa-eye"></i> Detalhes
                                </button>
                                <button class="btn btn--sm btn--danger" onclick="app.stopPipeline('pipeline-2')">
                                    <i class="fas fa-stop"></i> Parar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Compliance Page
     */
    loadCompliance() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-clipboard-check"></i> Compliance</h1>
                        <button class="btn btn--primary" onclick="app.showComplianceReport()">
                            <i class="fas fa-file-alt"></i> Gerar Relatório
                        </button>
                    </div>
                    
                    <div class="compliance-grid">
                        <div class="compliance-card">
                            <div class="compliance-header">
                                <h3>ISO 27001</h3>
                                <span class="compliance-status compliant">Compliant</span>
                            </div>
                            <div class="compliance-info">
                                <p>Information Security Management</p>
                                <div class="compliance-score">
                                    <div class="score-circle">
                                        <span>95%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="compliance-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.viewComplianceDetails('iso27001')">
                                    <i class="fas fa-eye"></i> Detalhes
                                </button>
                            </div>
                        </div>
                        
                        <div class="compliance-card">
                            <div class="compliance-header">
                                <h3>GDPR</h3>
                                <span class="compliance-status warning">Atenção</span>
                            </div>
                            <div class="compliance-info">
                                <p>General Data Protection Regulation</p>
                                <div class="compliance-score">
                                    <div class="score-circle warning">
                                        <span>78%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="compliance-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.viewComplianceDetails('gdpr')">
                                    <i class="fas fa-eye"></i> Detalhes
                                </button>
                            </div>
                        </div>
                        
                        <div class="compliance-card">
                            <div class="compliance-header">
                                <h3>PCI DSS</h3>
                                <span class="compliance-status non-compliant">Não Compliant</span>
                            </div>
                            <div class="compliance-info">
                                <p>Payment Card Industry Data Security</p>
                                <div class="compliance-score">
                                    <div class="score-circle danger">
                                        <span>45%</span>
                                    </div>
                                </div>
                            </div>
                            <div class="compliance-actions">
                                <button class="btn btn--sm btn--outline" onclick="app.viewComplianceDetails('pci-dss')">
                                    <i class="fas fa-eye"></i> Detalhes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    },

    /**
     * Load Settings Page
     */
    loadSettings() {
        const pageContainer = document.getElementById('page-container');
        if (pageContainer) {
            pageContainer.innerHTML = `
                <div class="page-content">
                    <div class="page-header">
                        <h1><i class="fas fa-cog"></i> Settings</h1>
                        <button class="btn btn--primary" onclick="app.saveSettings()">
                            <i class="fas fa-save"></i> Salvar Configurações
                        </button>
                    </div>
                    
                    <div class="settings-grid">
                        <div class="settings-section">
                            <h3>General Settings</h3>
                            <div class="setting-item">
                                <label>Company Name</label>
                                <input type="text" value="SecureFlow SSC" />
                            </div>
                            <div class="setting-item">
                                <label>Default Timezone</label>
                                <select>
                                    <option value="UTC">UTC</option>
                                    <option value="America/Sao_Paulo" selected>America/Sao_Paulo</option>
                                    <option value="Europe/London">Europe/London</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>Language</label>
                                <select>
                                    <option value="en">English</option>
                                    <option value="pt" selected>Português</option>
                                    <option value="es">Español</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h3>Security Settings</h3>
                            <div class="setting-item">
                                <label>Session Timeout (minutes)</label>
                                <input type="number" value="30" />
                            </div>
                            <div class="setting-item">
                                <label>Two-Factor Authentication</label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="2fa-toggle" checked />
                                    <label for="2fa-toggle"></label>
                                </div>
                            </div>
                            <div class="setting-item">
                                <label>Password Policy</label>
                                <select>
                                    <option value="strong">Strong</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="weak">Weak</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h3>Notification Settings</h3>
                            <div class="setting-item">
                                <label>Email Notifications</label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="email-toggle" checked />
                                    <label for="email-toggle"></label>
                                </div>
                            </div>
                            <div class="setting-item">
                                <label>Critical Alerts</label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="critical-toggle" checked />
                                    <label for="critical-toggle"></label>
                                </div>
                            </div>
                            <div class="setting-item">
                                <label>Weekly Reports</label>
                                <div class="toggle-switch">
                                    <input type="checkbox" id="weekly-toggle" />
                                    <label for="weekly-toggle"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}); 