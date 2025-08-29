/**
 * Securet Flow SSC - Targets Management
 */

// Extend the main app with targets functionality
Object.assign(SecuretFlowApp.prototype, {
    
    loadTargets() {
        const targetsPage = document.getElementById('targets-page');
        targetsPage.innerHTML = this.getTargetsHTML();
        this.initializeTargetsTable();
        this.loadTargetsData();
    },

    getTargetsHTML() {
        return `
            <div class="targets-container">
                <!-- Header -->
                <div class="page-header">
                    <div class="header-content">
                        <h1>Target Management</h1>
                        <p>Gerencie seus alvos de segurança e configure monitoramento</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="app.showAddTargetModal()">
                            <i class="fas fa-plus"></i>
                            Add Target
                        </button>
                        <button class="btn btn-secondary" onclick="app.importTargets()">
                            <i class="fas fa-upload"></i>
                            Import
                        </button>
                    </div>
                </div>

                <!-- Filters and Search -->
                <div class="filters-section">
                    <div class="search-filters">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search targets..." id="targetSearch">
                        </div>
                        <div class="filter-options">
                            <select id="typeFilter">
                                <option value="">All Types</option>
                                <option value="web">Web Application</option>
                                <option value="api">API</option>
                                <option value="network">Network</option>
                                <option value="mobile">Mobile</option>
                            </select>
                            <select id="statusFilter">
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="monitoring">Monitoring</option>
                            </select>
                            <select id="riskFilter">
                                <option value="">All Risk Levels</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div class="bulk-actions">
                        <button class="btn btn-outline" onclick="app.bulkScan()">
                            <i class="fas fa-play"></i>
                            Bulk Scan
                        </button>
                        <button class="btn btn-outline" onclick="app.bulkExport()">
                            <i class="fas fa-download"></i>
                            Export
                        </button>
                    </div>
                </div>

                <!-- Targets Table -->
                <div class="table-container">
                    <table class="data-table" id="targetsTable">
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" id="selectAll" onchange="app.toggleSelectAll()">
                                </th>
                                <th>Target</th>
                                <th>Type</th>
                                <th>Risk Score</th>
                                <th>Last Scan</th>
                                <th>Status</th>
                                <th>Vulnerabilities</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="targetsTableBody">
                            <!-- Targets will be loaded here -->
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="pagination" id="targetsPagination">
                    <!-- Pagination will be generated here -->
                </div>
            </div>
        `;
    },

    initializeTargetsTable() {
        // Add event listeners for filters
        document.getElementById('targetSearch').addEventListener('input', (e) => {
            this.filterTargets();
        });

        document.getElementById('typeFilter').addEventListener('change', () => {
            this.filterTargets();
        });

        document.getElementById('statusFilter').addEventListener('change', () => {
            this.filterTargets();
        });

        document.getElementById('riskFilter').addEventListener('change', () => {
            this.filterTargets();
        });
    },

    loadTargetsData() {
        // Mock data for targets
        const targets = [
            {
                id: 1,
                name: 'example.com',
                url: 'https://example.com',
                type: 'web',
                riskScore: 85,
                lastScan: '2024-01-15 14:30',
                status: 'active',
                vulnerabilities: { critical: 3, high: 5, medium: 8, low: 12 }
            },
            {
                id: 2,
                name: 'api.example.com',
                url: 'https://api.example.com',
                type: 'api',
                riskScore: 92,
                lastScan: '2024-01-15 12:15',
                status: 'active',
                vulnerabilities: { critical: 5, high: 7, medium: 10, low: 15 }
            },
            {
                id: 3,
                name: '192.168.1.0/24',
                url: '192.168.1.0/24',
                type: 'network',
                riskScore: 45,
                lastScan: '2024-01-14 09:45',
                status: 'monitoring',
                vulnerabilities: { critical: 1, high: 2, medium: 5, low: 8 }
            },
            {
                id: 4,
                name: 'mobile-app.example.com',
                url: 'https://mobile-app.example.com',
                type: 'mobile',
                riskScore: 78,
                lastScan: '2024-01-13 16:20',
                status: 'active',
                vulnerabilities: { critical: 2, high: 4, medium: 6, low: 9 }
            },
            {
                id: 5,
                name: 'admin.example.com',
                url: 'https://admin.example.com',
                type: 'web',
                riskScore: 95,
                lastScan: '2024-01-15 10:30',
                status: 'active',
                vulnerabilities: { critical: 7, high: 9, medium: 12, low: 18 }
            }
        ];

        this.renderTargetsTable(targets);
    },

    renderTargetsTable(targets) {
        const tbody = document.getElementById('targetsTableBody');
        tbody.innerHTML = targets.map(target => `
            <tr data-target-id="${target.id}">
                <td>
                    <input type="checkbox" class="target-checkbox" value="${target.id}">
                </td>
                <td>
                    <div class="target-info">
                        <div class="target-name">${target.name}</div>
                        <div class="target-url">${target.url}</div>
                    </div>
                </td>
                <td>
                    <span class="badge badge-${target.type}">${target.type.toUpperCase()}</span>
                </td>
                <td>
                    <div class="risk-score">
                        <div class="risk-bar">
                            <div class="risk-fill" style="width: ${target.riskScore}%"></div>
                        </div>
                        <span class="risk-value">${target.riskScore}</span>
                    </div>
                </td>
                <td>
                    <div class="last-scan">
                        <span class="scan-date">${target.lastScan}</span>
                        <button class="btn-icon" onclick="app.rescanTarget(${target.id})" title="Rescan">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${target.status}">${target.status}</span>
                </td>
                <td>
                    <div class="vulnerability-summary">
                        <span class="vuln-count critical">${target.vulnerabilities.critical}</span>
                        <span class="vuln-count high">${target.vulnerabilities.high}</span>
                        <span class="vuln-count medium">${target.vulnerabilities.medium}</span>
                        <span class="vuln-count low">${target.vulnerabilities.low}</span>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="app.viewTarget(${target.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="app.editTarget(${target.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="app.scanTarget(${target.id})" title="Scan">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn-icon" onclick="app.deleteTarget(${target.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    },

    filterTargets() {
        const searchTerm = document.getElementById('targetSearch').value.toLowerCase();
        const typeFilter = document.getElementById('typeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const riskFilter = document.getElementById('riskFilter').value;

        const rows = document.querySelectorAll('#targetsTableBody tr');

        rows.forEach(row => {
            const targetName = row.querySelector('.target-name').textContent.toLowerCase();
            const targetUrl = row.querySelector('.target-url').textContent.toLowerCase();
            const targetType = row.querySelector('.badge').textContent.toLowerCase();
            const targetStatus = row.querySelector('.status-badge').textContent.toLowerCase();
            const riskValue = parseInt(row.querySelector('.risk-value').textContent);

            let show = true;

            // Search filter
            if (searchTerm && !targetName.includes(searchTerm) && !targetUrl.includes(searchTerm)) {
                show = false;
            }

            // Type filter
            if (typeFilter && targetType !== typeFilter) {
                show = false;
            }

            // Status filter
            if (statusFilter && targetStatus !== statusFilter) {
                show = false;
            }

            // Risk filter
            if (riskFilter) {
                const riskRanges = {
                    'critical': riskValue >= 90,
                    'high': riskValue >= 70 && riskValue < 90,
                    'medium': riskValue >= 40 && riskValue < 70,
                    'low': riskValue < 40
                };
                if (!riskRanges[riskFilter]) {
                    show = false;
                }
            }

            row.style.display = show ? 'table-row' : 'none';
        });
    },

    toggleSelectAll() {
        const selectAll = document.getElementById('selectAll');
        const checkboxes = document.querySelectorAll('.target-checkbox');
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectAll.checked;
        });
    },

    showAddTargetModal() {
        const modalHTML = `
            <div class="modal-overlay">
                <div class="modal modal-large">
                    <div class="modal-header">
                        <h2>Add New Target</h2>
                        <button class="modal-close" onclick="app.closeModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="addTargetForm">
                            <div class="form-grid">
                                <div class="form-group">
                                    <label for="targetName">Target Name *</label>
                                    <input type="text" id="targetName" required placeholder="e.g., example.com">
                                </div>
                                <div class="form-group">
                                    <label for="targetUrl">URL/IP Address *</label>
                                    <input type="text" id="targetUrl" required placeholder="e.g., https://example.com or 192.168.1.1">
                                </div>
                                <div class="form-group">
                                    <label for="targetType">Target Type *</label>
                                    <select id="targetType" required>
                                        <option value="">Select Type</option>
                                        <option value="web">Web Application</option>
                                        <option value="api">API</option>
                                        <option value="network">Network</option>
                                        <option value="mobile">Mobile Application</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="targetDescription">Description</label>
                                    <textarea id="targetDescription" placeholder="Brief description of the target"></textarea>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h3>Scan Configuration</h3>
                                <div class="form-grid">
                                    <div class="form-group">
                                        <label for="scanFrequency">Scan Frequency</label>
                                        <select id="scanFrequency">
                                            <option value="manual">Manual Only</option>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="scanLevel">Scan Level</label>
                                        <select id="scanLevel">
                                            <option value="stealth">Stealth</option>
                                            <option value="routine">Routine</option>
                                            <option value="aggressive">Aggressive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3>Tool Selection</h3>
                                <div class="tool-selection">
                                    <label class="tool-option">
                                        <input type="checkbox" value="nmap" checked>
                                        <span>Nmap</span>
                                    </label>
                                    <label class="tool-option">
                                        <input type="checkbox" value="nuclei" checked>
                                        <span>Nuclei</span>
                                    </label>
                                    <label class="tool-option">
                                        <input type="checkbox" value="zap">
                                        <span>OWASP ZAP</span>
                                    </label>
                                    <label class="tool-option">
                                        <input type="checkbox" value="sqlmap">
                                        <span>SQLMap</span>
                                    </label>
                                    <label class="tool-option">
                                        <input type="checkbox" value="amass">
                                        <span>Amass</span>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
                        <button class="btn btn-primary" onclick="app.addTarget()">Add Target</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('modal-container').innerHTML = modalHTML;
    },

    addTarget() {
        const form = document.getElementById('addTargetForm');
        const formData = new FormData(form);
        
        // Validate form
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Mock API call
        this.showToast('Target added successfully!', 'success');
        this.closeModal();
        
        // Reload targets
        this.loadTargetsData();
    },

    viewTarget(targetId) {
        this.navigateToPage('target-analytics');
        // In a real app, you would pass the target ID to the analytics page
    },

    editTarget(targetId) {
        this.showToast('Edit target functionality coming soon!', 'info');
    },

    scanTarget(targetId) {
        this.showToast('Scan initiated for target!', 'success');
        // In a real app, this would start a scan
    },

    rescanTarget(targetId) {
        this.showToast('Rescan initiated!', 'success');
        // In a real app, this would start a rescan
    },

    deleteTarget(targetId) {
        if (confirm('Are you sure you want to delete this target?')) {
            this.showToast('Target deleted successfully!', 'success');
            // In a real app, this would delete the target
        }
    },

    bulkScan() {
        const selectedTargets = document.querySelectorAll('.target-checkbox:checked');
        if (selectedTargets.length === 0) {
            this.showToast('Please select targets to scan', 'warning');
            return;
        }
        
        this.showToast(`Bulk scan initiated for ${selectedTargets.length} targets!`, 'success');
    },

    bulkExport() {
        const selectedTargets = document.querySelectorAll('.target-checkbox:checked');
        if (selectedTargets.length === 0) {
            this.showToast('Please select targets to export', 'warning');
            return;
        }
        
        this.showToast(`Exporting ${selectedTargets.length} targets...`, 'info');
    },

    importTargets() {
        this.showToast('Import functionality coming soon!', 'info');
    }
}); 