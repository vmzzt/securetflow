/**
 * SecureFlow SSC - Modal Handlers
 * Modal management and creation
 */

// Extend SecureFlowApp with modal methods
Object.assign(SecureFlowApp.prototype, {
    
    /**
     * Show New Scan Modal
     */
    showNewScanModal() {
        this.showModal('new-scan', {
            title: 'Novo Scan',
            targets: ['example.com', 'api.example.com'],
            scanTypes: [
                { id: 'stealth', name: 'Stealth Scan', tools: ['Subfinder', 'Amass', 'DNSx'] },
                { id: 'routine', name: 'Routine Scan', tools: ['Nuclei', 'FFUF', 'Nmap'] },
                { id: 'massive', name: 'Massive Scan', tools: ['Masscan', 'SQLMap', 'Nuclei Aggressive'] }
            ]
        });
    },

    /**
     * Show Add Target Modal
     */
    showAddTargetModal() {
        this.showModal('add-target', {
            title: 'Adicionar Novo Target'
        });
    },

    /**
     * Create New Scan Modal
     */
    createNewScanModal(data) {
        const scanTypesHTML = data.scanTypes.map(type => `
            <option value="${type.id}">${type.name} (${type.tools.join(', ')})</option>
        `).join('');

        const targetsHTML = data.targets.map(target => `
            <label class="target-item">
                <input type="checkbox" value="${target}" checked>
                <span>${target}</span>
            </label>
        `).join('');

        return `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${data.title}</h3>
                        <button class="modal-close" onclick="app.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="newScanForm">
                            <div class="form-group">
                                <label for="scanType">Tipo de Scan</label>
                                <select id="scanType" required>
                                    <option value="">Selecione o tipo</option>
                                    ${scanTypesHTML}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Targets</label>
                                <div class="target-selection">
                                    ${targetsHTML}
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="scanPriority">Prioridade</label>
                                <select id="scanPriority">
                                    <option value="low">Baixa</option>
                                    <option value="normal" selected>Normal</option>
                                    <option value="high">Alta</option>
                                    <option value="critical">Crítica</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn--outline" onclick="app.closeModal()">Cancelar</button>
                        <button class="btn btn--primary" onclick="app.startNewScan()">Iniciar Scan</button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Start New Scan Action
     */
    startNewScan() {
        try {
            const form = document.getElementById('newScanForm');
            const scanType = document.getElementById('scanType').value;
            const priority = document.getElementById('scanPriority').value;
            const selectedTargets = Array.from(document.querySelectorAll('.target-selection input:checked'))
                .map(input => input.value);

            if (!scanType || selectedTargets.length === 0) {
                this.showError('Por favor, selecione o tipo de scan e pelo menos um target');
                return;
            }

            const scanData = {
                type: scanType,
                targets: selectedTargets,
                priority: priority
            };

            this.simulateAPICall('POST', '/api/scans', scanData)
                .then(() => {
                    this.showSuccess('Scan iniciado com sucesso!');
                    this.closeModal();
                    this.navigateToPage('scans');
                })
                .catch(error => {
                    console.error('Failed to start scan:', error);
                    this.showError('Falha ao iniciar scan');
                });
        } catch (error) {
            console.error('Start new scan error:', error);
            this.showError('Erro ao processar scan');
        }
    },

    /**
     * View Target Details
     */
    viewTargetDetails(targetName) {
        this.showModal('target-details', {
            title: `Detalhes do Target: ${targetName}`,
            target: {
                name: targetName,
                type: 'Web Application',
                url: `https://${targetName}`,
                risk_score: 85,
                last_scan: '2025-08-21 10:30:00',
                vulnerabilities: {
                    critical: 3,
                    high: 7,
                    medium: 12,
                    low: 25
                }
            }
        });
    },

    /**
     * Create Target Details Modal
     */
    createTargetDetailsModal(data) {
        const target = data.target;
        return `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${data.title}</h3>
                        <button class="modal-close" onclick="app.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="target-details">
                            <div class="detail-row">
                                <span class="label">Nome:</span>
                                <span class="value">${target.name}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Tipo:</span>
                                <span class="value">${target.type}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">URL:</span>
                                <span class="value">${target.url}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Risk Score:</span>
                                <span class="value risk-high">${target.risk_score}</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">Último Scan:</span>
                                <span class="value">${target.last_scan}</span>
                            </div>
                            
                            <div class="vulnerabilities-summary">
                                <h4>Vulnerabilidades</h4>
                                <div class="vuln-stats">
                                    <div class="vuln-stat critical">
                                        <span class="count">${target.vulnerabilities.critical}</span>
                                        <span class="label">Críticas</span>
                                    </div>
                                    <div class="vuln-stat high">
                                        <span class="count">${target.vulnerabilities.high}</span>
                                        <span class="label">Altas</span>
                                    </div>
                                    <div class="vuln-stat medium">
                                        <span class="count">${target.vulnerabilities.medium}</span>
                                        <span class="label">Médias</span>
                                    </div>
                                    <div class="vuln-stat low">
                                        <span class="count">${target.vulnerabilities.low}</span>
                                        <span class="label">Baixas</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn--outline" onclick="app.closeModal()">Fechar</button>
                        <button class="btn btn--primary" onclick="app.startScan('${target.name}')">
                            <i class="fas fa-play"></i> Iniciar Scan
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * View Vulnerability Details
     */
    viewVulnerabilityDetails(vulnId) {
        this.showModal('vulnerability-details', {
            title: 'Detalhes da Vulnerabilidade',
            vulnerability: {
                id: vulnId,
                name: 'SQL Injection',
                severity: 'critical',
                description: 'SQL injection vulnerability detected in login endpoint',
                cvss_score: 9.8,
                affected_url: 'https://example.com/login',
                payload: "' OR 1=1--",
                remediation: 'Use parameterized queries and input validation'
            }
        });
    },

    /**
     * Create Vulnerability Details Modal
     */
    createVulnerabilityDetailsModal(data) {
        const vuln = data.vulnerability;
        return `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${data.title}</h3>
                        <button class="modal-close" onclick="app.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="vulnerability-details">
                            <div class="vuln-header">
                                <h4>${vuln.name}</h4>
                                <span class="severity-badge ${vuln.severity}">${vuln.severity.toUpperCase()}</span>
                            </div>
                            
                            <div class="vuln-info">
                                <div class="info-item">
                                    <span class="label">CVSS Score:</span>
                                    <span class="value">${vuln.cvss_score}</span>
                                </div>
                                <div class="info-item">
                                    <span class="label">Affected URL:</span>
                                    <span class="value">${vuln.affected_url}</span>
                                </div>
                            </div>
                            
                            <div class="vuln-description">
                                <h5>Descrição</h5>
                                <p>${vuln.description}</p>
                            </div>
                            
                            <div class="vuln-payload">
                                <h5>Payload</h5>
                                <code>${vuln.payload}</code>
                            </div>
                            
                            <div class="vuln-remediation">
                                <h5>Remediação</h5>
                                <p>${vuln.remediation}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn--outline" onclick="app.closeModal()">Fechar</button>
                        <button class="btn btn--primary" onclick="app.markAsFixed('${vuln.id}')">
                            <i class="fas fa-check"></i> Marcar como Corrigida
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Create Add Target Modal
     */
    createAddTargetModal(data) {
        return `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${data.title || 'Adicionar Novo Target'}</h3>
                        <button class="modal-close" onclick="app.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form class="target-form" id="addTargetForm">
                            <div class="form-group">
                                <label for="targetName">Nome do Target</label>
                                <input type="text" id="targetName" placeholder="ex: example.com" required>
                            </div>
                            <div class="form-group">
                                <label for="targetType">Tipo</label>
                                <select id="targetType" required>
                                    <option value="">Selecione o tipo</option>
                                    <option value="web">Web Application</option>
                                    <option value="api">API</option>
                                    <option value="network">Network</option>
                                    <option value="file">File</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="targetUrl">URL/IP</label>
                                <input type="text" id="targetUrl" placeholder="https://example.com ou 192.168.1.1" required>
                            </div>
                            <div class="form-group">
                                <label for="targetDescription">Descrição</label>
                                <textarea id="targetDescription" placeholder="Descrição opcional do target"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="targetTags">Tags</label>
                                <input type="text" id="targetTags" placeholder="tag1, tag2, tag3">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn--outline" onclick="app.closeModal()">Cancelar</button>
                        <button class="btn btn--primary" onclick="app.addTarget()">Adicionar Target</button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Add Target Action
     */
    addTarget() {
        try {
            const form = document.getElementById('addTargetForm');
            if (form && form.checkValidity()) {
                const formData = new FormData(form);
                const targetData = {
                    name: formData.get('targetName') || document.getElementById('targetName').value,
                    type: formData.get('targetType') || document.getElementById('targetType').value,
                    url: formData.get('targetUrl') || document.getElementById('targetUrl').value,
                    description: formData.get('targetDescription') || document.getElementById('targetDescription').value,
                    tags: formData.get('targetTags') || document.getElementById('targetTags').value
                };

                if (!targetData.name || !targetData.type || !targetData.url) {
                    this.showError('Por favor, preencha todos os campos obrigatórios');
                    return;
                }

                this.simulateAPICall('POST', '/api/targets', targetData)
                    .then(() => {
                        this.showSuccess('Target adicionado com sucesso!');
                        this.closeModal();
                        this.updateMetrics();
                    })
                    .catch(error => {
                        console.error('Failed to add target:', error);
                        this.showError('Falha ao adicionar target');
                    });
            } else {
                this.showError('Por favor, preencha todos os campos obrigatórios');
            }
        } catch (error) {
            console.error('Add target error:', error);
            this.showError('Erro ao processar formulário');
        }
    },

    /**
     * Mark Vulnerability as Fixed
     */
    markAsFixed(vulnId) {
        this.showSuccess('Vulnerabilidade marcada como corrigida!');
        this.closeModal();
        this.navigateToPage('vulnerabilities');
    },

    /**
     * Start Scan
     */
    startScan(targetName) {
        this.showInfo(`Iniciando scan em ${targetName}...`);
        this.closeModal();
        
        setTimeout(() => {
            this.showSuccess(`Scan iniciado em ${targetName}!`);
            this.navigateToPage('scans');
        }, 1000);
    },

    /**
     * Update Metrics
     */
    updateMetrics() {
        const totalTargets = document.getElementById('totalTargets');
        const activeScans = document.getElementById('activeScans');
        
        if (totalTargets) {
            const current = parseInt(totalTargets.textContent);
            totalTargets.textContent = current + 1;
        }
        
        if (activeScans) {
            const current = parseInt(activeScans.textContent);
            activeScans.textContent = current + 1;
        }
    },

    /**
     * Simulate API Call
     */
    simulateAPICall(method, endpoint, data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ success: true, data });
                } else {
                    reject(new Error('API call failed'));
                }
            }, 1000);
        });
    }
}); 