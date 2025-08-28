// Base API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// API Error
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, any>;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Filters
export interface BaseFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Request/Response Headers
export interface ApiHeaders {
  'Content-Type'?: string;
  'Authorization'?: string;
  'Accept'?: string;
  'X-Requested-With'?: string;
}

// File Upload
export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  url: string;
  uploadedAt: string;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// WebSocket
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
  id?: string;
}

export interface WebSocketEvent {
  type: 'open' | 'message' | 'close' | 'error';
  data?: any;
  timestamp: number;
}

// Authentication
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// User
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  permissions: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'user' | 'viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  notifications?: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  types: string[];
}

// Target
export interface Target {
  id: string;
  name: string;
  url: string;
  type: TargetType;
  status: TargetStatus;
  lastScan?: string;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type TargetType = 'web' | 'api' | 'network' | 'mobile';
export type TargetStatus = 'active' | 'inactive' | 'scanning' | 'error';

export interface CreateTargetRequest {
  name: string;
  url: string;
  type: TargetType;
  description?: string;
  tags?: string[];
}

export interface UpdateTargetRequest {
  name?: string;
  url?: string;
  type?: TargetType;
  description?: string;
  tags?: string[];
  status?: TargetStatus;
}

// Scan
export interface Scan {
  id: string;
  name: string;
  target: string;
  targetName: string;
  type: ScanType;
  status: ScanStatus;
  progress: number;
  startTime: string;
  endTime?: string;
  duration?: string;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  tools: string[];
  description?: string;
  config: Record<string, any>;
  logs?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ScanType = 'vulnerability' | 'port' | 'web' | 'api' | 'custom';
export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused';

export interface CreateScanRequest {
  name: string;
  target: string;
  type: ScanType;
  tools?: string[];
  description?: string;
  config?: Record<string, any>;
}

export interface UpdateScanRequest {
  name?: string;
  description?: string;
  config?: Record<string, any>;
}

export interface ScanResult {
  vulnerabilities: Vulnerability[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  scanInfo: {
    duration: string;
    tools: string[];
    config: Record<string, any>;
  };
}

export interface ScanLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  tool?: string;
}

// Vulnerability
export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: VulnerabilitySeverity;
  status: VulnerabilityStatus;
  cvss: number;
  cve?: string;
  target: string;
  targetName: string;
  discoveredAt: string;
  lastUpdated: string;
  assignedTo?: string;
  tags: string[];
  references?: string[];
  remediation?: string;
  affected: string;
  impact: string;
  evidence?: string;
  createdAt: string;
  updatedAt: string;
}

export type VulnerabilitySeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type VulnerabilityStatus = 'open' | 'in_progress' | 'resolved' | 'false_positive';

export interface CreateVulnerabilityRequest {
  title: string;
  description: string;
  severity: VulnerabilitySeverity;
  target: string;
  affected: string;
  impact: string;
  remediation?: string;
  references?: string[];
  tags?: string[];
}

export interface UpdateVulnerabilityRequest {
  title?: string;
  description?: string;
  severity?: VulnerabilitySeverity;
  status?: VulnerabilityStatus;
  assignedTo?: string;
  remediation?: string;
  references?: string[];
  tags?: string[];
}

// Report
export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  target: string;
  targetName: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  description?: string;
  tags: string[];
  format: ReportFormat;
  template?: string;
  sections?: string[];
  data?: Record<string, any>;
}

export type ReportType = 'executive' | 'technical' | 'compliance' | 'custom';
export type ReportStatus = 'draft' | 'in_progress' | 'completed' | 'archived';
export type ReportFormat = 'pdf' | 'html' | 'docx' | 'json';

export interface CreateReportRequest {
  title: string;
  type: ReportType;
  target: string;
  description?: string;
  tags?: string[];
  format?: ReportFormat;
  template?: string;
  sections?: string[];
}

export interface UpdateReportRequest {
  title?: string;
  description?: string;
  tags?: string[];
  format?: ReportFormat;
  template?: string;
  sections?: string[];
}

// Tool
export interface Tool {
  id: string;
  name: string;
  category: ToolCategory;
  status: ToolStatus;
  version: string;
  description: string;
  author: string;
  lastUsed?: string;
  usageCount: number;
  avgExecutionTime: number;
  tags: string[];
  command?: string;
  parameters?: string[];
  output?: string;
  isCustom: boolean;
}

export type ToolCategory = 'network' | 'web' | 'vulnerability' | 'exploitation' | 'forensics' | 'custom';
export type ToolStatus = 'available' | 'running' | 'error' | 'maintenance';

export interface CreateToolRequest {
  name: string;
  category: ToolCategory;
  description: string;
  command?: string;
  parameters?: string[];
  tags?: string[];
}

export interface UpdateToolRequest {
  name?: string;
  description?: string;
  command?: string;
  parameters?: string[];
  tags?: string[];
}

// Integration
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  provider: string;
  status: IntegrationStatus;
  description: string;
  webhookUrl?: string;
  apiKey?: string;
  config: Record<string, any>;
  lastSync?: string;
  syncStatus: 'success' | 'error' | 'pending';
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IntegrationType = 'chat' | 'git' | 'ci_cd' | 'monitoring' | 'ticketing' | 'custom';
export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'configuring';

export interface CreateIntegrationRequest {
  name: string;
  type: IntegrationType;
  provider: string;
  description: string;
  webhookUrl?: string;
  apiKey?: string;
  config?: Record<string, any>;
  enabled?: boolean;
}

export interface UpdateIntegrationRequest {
  name?: string;
  description?: string;
  webhookUrl?: string;
  apiKey?: string;
  config?: Record<string, any>;
  enabled?: boolean;
}

// Analytics
export interface AnalyticsData {
  period: string;
  scans: number;
  vulnerabilities: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface DashboardStats {
  targets: {
    total: number;
    active: number;
    scanning: number;
  };
  scans: {
    total: number;
    running: number;
    completed: number;
    failed: number;
  };
  vulnerabilities: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  reports: {
    total: number;
    completed: number;
    inProgress: number;
  };
}

// System
export interface SystemStatus {
  status: 'healthy' | 'warning' | 'error';
  services: {
    name: string;
    status: 'up' | 'down' | 'warning';
    responseTime?: number;
    lastCheck: string;
  }[];
  resources: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  uptime: string;
  version: string;
}

export interface SystemConfig {
  features: Record<string, boolean>;
  limits: Record<string, number>;
  settings: Record<string, any>;
}

// Notifications
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export interface CreateNotificationRequest {
  type: Notification['type'];
  title: string;
  message: string;
  data?: Record<string, any>;
}

// Search
export interface SearchRequest {
  query: string;
  filters?: Record<string, any>;
  limit?: number;
  offset?: number;
}

export interface SearchResponse<T = any> {
  results: T[];
  total: number;
  query: string;
  filters?: Record<string, any>;
}

// Export/Import
export interface ExportRequest {
  format: 'csv' | 'json' | 'pdf' | 'xlsx';
  filters?: Record<string, any>;
  fields?: string[];
}

export interface ImportRequest {
  file: File;
  options?: Record<string, any>;
}

export interface ImportResponse {
  imported: number;
  failed: number;
  errors: string[];
}

// Bulk Operations
export interface BulkOperationRequest {
  ids: string[];
  action: string;
  data?: Record<string, any>;
}

export interface BulkOperationResponse {
  success: number;
  failed: number;
  errors: string[];
}

// Audit Log
export interface AuditLog {
  id: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  userName: string;
  timestamp: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// API Endpoints
export interface ApiEndpoints {
  auth: {
    login: string;
    register: string;
    logout: string;
    refresh: string;
    profile: string;
    changePassword: string;
    forgotPassword: string;
    resetPassword: string;
  };
  targets: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
    scan: (id: string) => string;
    vulnerabilities: (id: string) => string;
  };
  scans: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
    start: (id: string) => string;
    stop: (id: string) => string;
    pause: (id: string) => string;
    resume: (id: string) => string;
    results: (id: string) => string;
    logs: (id: string) => string;
  };
  vulnerabilities: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
    bulkUpdate: string;
    export: string;
  };
  reports: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
    generate: string;
    export: (id: string) => string;
    templates: string;
  };
  tools: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
    execute: (id: string) => string;
    stop: (id: string) => string;
    config: (id: string) => string;
  };
  integrations: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
    test: (id: string) => string;
    sync: (id: string) => string;
  };
  analytics: {
    dashboard: string;
    vulnerabilities: string;
    scans: string;
    targets: string;
    trends: string;
    metrics: string;
  };
  system: {
    status: string;
    health: string;
    config: string;
    logs: string;
    metrics: string;
    backup: string;
    restore: string;
  };
  users: {
    list: string;
    create: string;
    get: (id: string) => string;
    update: (id: string) => string;
    delete: (id: string) => string;
    roles: string;
    permissions: string;
  };
}

// All types are already exported individually above 