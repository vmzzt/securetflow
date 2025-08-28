/**
 * Scan Types
 * TypeScript interfaces and types for scan operations
 */

import { TargetType } from './target';

/**
 * Scan status enumeration
 */
export enum ScanStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
  RESUMED = 'resumed'
}

/**
 * Scan type enumeration
 */
export enum ScanType {
  VULNERABILITY = 'vulnerability',
  PENETRATION = 'penetration',
  COMPLIANCE = 'compliance',
  CONFIGURATION = 'configuration',
  CODE_REVIEW = 'code_review',
  DEPENDENCY = 'dependency',
  CONTAINER = 'container',
  INFRASTRUCTURE = 'infrastructure',
  API = 'api',
  MOBILE = 'mobile',
  CUSTOM = 'custom'
}

/**
 * Scan priority enumeration
 */
export enum ScanPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Scan mode enumeration
 */
export enum ScanMode {
  QUICK = 'quick',
  STANDARD = 'standard',
  DEEP = 'deep',
  STEALTH = 'stealth',
  AGGRESSIVE = 'aggressive'
}

/**
 * Scan configuration interface
 */
export interface ScanConfig {
  type: ScanType;
  mode: ScanMode;
  priority: ScanPriority;
  tools: string[];
  parameters: Record<string, any>;
  exclusions: string[];
  customHeaders?: Record<string, string>;
  authentication?: Record<string, any>;
  timeout: number;
  maxConcurrent: number;
  retryAttempts: number;
  notifications: boolean;
  schedule?: ScanSchedule;
}

/**
 * Scan schedule interface
 */
export interface ScanSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate?: Date;
  time: string; // HH:mm format
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  daysOfMonth?: number[]; // 1-31
  timezone: string;
  enabled: boolean;
}

/**
 * Scan target interface
 */
export interface ScanTarget {
  id: string;
  name: string;
  url: string;
  type: TargetType;
  config?: Record<string, any>;
}

/**
 * Scan tool interface
 */
export interface ScanTool {
  id: string;
  name: string;
  version: string;
  category: string;
  status: 'available' | 'running' | 'error';
  config: Record<string, any>;
  results?: any;
}

/**
 * Scan progress interface
 */
export interface ScanProgress {
  currentStep: number;
  totalSteps: number;
  currentTool: string;
  progress: number; // 0-100
  estimatedTimeRemaining: number; // seconds
  status: string;
  details: string;
}

/**
 * Scan result interface
 */
export interface ScanResult {
  vulnerabilities: Vulnerability[];
  findings: Finding[];
  metrics: ScanMetrics;
  summary: ScanSummary;
  rawData?: any;
}

/**
 * Vulnerability interface
 */
export interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  cvss?: number;
  cve?: string;
  cwe?: string;
  affectedUrl?: string;
  affectedParameter?: string;
  payload?: string;
  evidence?: string;
  remediation?: string;
  references?: string[];
  tags: string[];
  tool: string;
  discoveredAt: Date;
  status: 'open' | 'fixed' | 'false_positive' | 'accepted';
}

/**
 * Finding interface
 */
export interface Finding {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  evidence?: string;
  recommendation?: string;
  tool: string;
  discoveredAt: Date;
}

/**
 * Scan metrics interface
 */
export interface ScanMetrics {
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  infoFindings: number;
  scanDuration: number; // seconds
  requestsSent: number;
  responsesReceived: number;
  errors: number;
  warnings: number;
}

/**
 * Scan summary interface
 */
export interface ScanSummary {
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceScore?: number;
  recommendations: string[];
  executiveSummary: string;
  technicalSummary: string;
}

/**
 * Scan interface
 */
export interface Scan {
  id: string;
  name: string;
  description?: string;
  targets: ScanTarget[];
  config: ScanConfig;
  status: ScanStatus;
  progress: ScanProgress;
  result?: ScanResult;
  startedAt?: Date;
  completedAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  metadata?: Record<string, any>;
}

/**
 * Scan creation request interface
 */
export interface CreateScanRequest {
  name: string;
  description?: string;
  targetIds: string[];
  config: Partial<ScanConfig>;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Scan update request interface
 */
export interface UpdateScanRequest {
  name?: string;
  description?: string;
  config?: Partial<ScanConfig>;
  status?: ScanStatus;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Scan filter interface
 */
export interface ScanFilter {
  status?: ScanStatus[];
  type?: ScanType[];
  priority?: ScanPriority[];
  mode?: ScanMode[];
  targetIds?: string[];
  createdBy?: string;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

/**
 * Scan sort options interface
 */
export interface ScanSort {
  field: keyof Scan;
  direction: 'asc' | 'desc';
}

/**
 * Scan list response interface
 */
export interface ScanListResponse {
  scans: Scan[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Scan bulk operation interface
 */
export interface ScanBulkOperation {
  scanIds: string[];
  operation: 'start' | 'stop' | 'pause' | 'resume' | 'delete' | 'duplicate';
  data?: Partial<UpdateScanRequest>;
}

/**
 * Scan template interface
 */
export interface ScanTemplate {
  id: string;
  name: string;
  description?: string;
  type: ScanType;
  config: ScanConfig;
  isDefault: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Scan report interface
 */
export interface ScanReport {
  id: string;
  scanId: string;
  format: 'pdf' | 'html' | 'json' | 'csv' | 'xml';
  content: string | Blob;
  generatedAt: Date;
  generatedBy: string;
  size: number;
  url?: string;
}

/**
 * Scan notification interface
 */
export interface ScanNotification {
  id: string;
  scanId: string;
  type: 'started' | 'completed' | 'failed' | 'progress' | 'vulnerability_found';
  message: string;
  data?: Record<string, any>;
  sentAt: Date;
  recipients: string[];
  status: 'sent' | 'failed' | 'pending';
}

/**
 * Scan history interface
 */
export interface ScanHistory {
  id: string;
  scanId: string;
  action: 'created' | 'started' | 'paused' | 'resumed' | 'completed' | 'failed' | 'cancelled' | 'updated';
  timestamp: Date;
  userId: string;
  details?: Record<string, any>;
}

/**
 * Scan comparison interface
 */
export interface ScanComparison {
  scan1Id: string;
  scan2Id: string;
  differences: {
    newVulnerabilities: Vulnerability[];
    fixedVulnerabilities: Vulnerability[];
    changedVulnerabilities: Array<{
      old: Vulnerability;
      new: Vulnerability;
      changes: string[];
    }>;
    metrics: {
      scan1: ScanMetrics;
      scan2: ScanMetrics;
      changes: Record<string, number>;
    };
  };
  summary: {
    totalNew: number;
    totalFixed: number;
    totalChanged: number;
    riskScoreChange: number;
  };
}

/**
 * Scan API response types
 */
export namespace ScanAPI {
  export interface CreateResponse {
    scan: Scan;
    message: string;
  }

  export interface UpdateResponse {
    scan: Scan;
    message: string;
  }

  export interface DeleteResponse {
    message: string;
    deletedCount: number;
  }

  export interface StartResponse {
    scan: Scan;
    message: string;
  }

  export interface StopResponse {
    scan: Scan;
    message: string;
  }

  export interface PauseResponse {
    scan: Scan;
    message: string;
  }

  export interface ResumeResponse {
    scan: Scan;
    message: string;
  }

  export interface BulkResponse {
    success: string[];
    failed: Array<{
      id: string;
      error: string;
    }>;
    message: string;
  }

  export interface ProgressResponse {
    progress: ScanProgress;
  }

  export interface ResultResponse {
    result: ScanResult;
  }

  export interface ReportResponse {
    report: ScanReport;
  }

  export interface ComparisonResponse {
    comparison: ScanComparison;
  }

  export interface TemplateResponse {
    templates: ScanTemplate[];
  }

  export interface NotificationResponse {
    notifications: ScanNotification[];
  }

  export interface HistoryResponse {
    history: ScanHistory[];
  }
} 