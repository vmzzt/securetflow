/**
 * Target Types
 * TypeScript interfaces and types for target management
 */

/**
 * Target status enumeration
 */
export enum TargetStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ERROR = 'error',
  SCANNING = 'scanning'
}

/**
 * Target type enumeration
 */
export enum TargetType {
  WEB = 'web',
  API = 'api',
  NETWORK = 'network',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  CLOUD = 'cloud',
  CONTAINER = 'container',
  IOT = 'iot'
}

/**
 * Target priority enumeration
 */
export enum TargetPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Target risk level enumeration
 */
export enum TargetRiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Target scan frequency enumeration
 */
export enum ScanFrequency {
  MANUAL = 'manual',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

/**
 * Target configuration interface
 */
export interface TargetConfig {
  scanFrequency: ScanFrequency;
  preferredTools: string[];
  exclusions: string[];
  customHeaders?: Record<string, string>;
  authentication?: TargetAuth;
  scanDepth: 'quick' | 'standard' | 'deep';
  timeout: number;
  retryAttempts: number;
  notifications: boolean;
}

/**
 * Target authentication interface
 */
export interface TargetAuth {
  type: 'basic' | 'bearer' | 'api_key' | 'oauth2' | 'custom';
  credentials: Record<string, string>;
  headers?: Record<string, string>;
}

/**
 * Target metadata interface
 */
export interface TargetMetadata {
  description?: string;
  tags: string[];
  owner?: string;
  department?: string;
  environment: 'development' | 'staging' | 'production';
  compliance?: string[];
  customFields?: Record<string, any>;
}

/**
 * Target statistics interface
 */
export interface TargetStats {
  totalScans: number;
  lastScanDate?: Date;
  vulnerabilitiesFound: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  averageScanDuration: number;
  successRate: number;
  uptime: number;
}

/**
 * Target health check interface
 */
export interface TargetHealth {
  isOnline: boolean;
  responseTime: number;
  statusCode?: number;
  lastChecked: Date;
  errorMessage?: string;
  sslValid: boolean;
  sslExpiryDate?: Date;
}

/**
 * Target interface
 */
export interface Target {
  id: string;
  name: string;
  url: string;
  type: TargetType;
  status: TargetStatus;
  priority: TargetPriority;
  riskLevel: TargetRiskLevel;
  config: TargetConfig;
  metadata: TargetMetadata;
  stats: TargetStats;
  health: TargetHealth;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

/**
 * Target creation request interface
 */
export interface CreateTargetRequest {
  name: string;
  url: string;
  type: TargetType;
  priority: TargetPriority;
  config?: Partial<TargetConfig>;
  metadata?: Partial<TargetMetadata>;
}

/**
 * Target update request interface
 */
export interface UpdateTargetRequest {
  name?: string;
  url?: string;
  type?: TargetType;
  priority?: TargetPriority;
  status?: TargetStatus;
  config?: Partial<TargetConfig>;
  metadata?: Partial<TargetMetadata>;
}

/**
 * Target filter interface
 */
export interface TargetFilter {
  status?: TargetStatus[];
  type?: TargetType[];
  priority?: TargetPriority[];
  riskLevel?: TargetRiskLevel[];
  tags?: string[];
  environment?: string[];
  owner?: string;
  department?: string;
  compliance?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

/**
 * Target sort options interface
 */
export interface TargetSort {
  field: keyof Target;
  direction: 'asc' | 'desc';
}

/**
 * Target list response interface
 */
export interface TargetListResponse {
  targets: Target[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Target bulk operation interface
 */
export interface TargetBulkOperation {
  targetIds: string[];
  operation: 'activate' | 'deactivate' | 'delete' | 'update' | 'scan';
  data?: Partial<UpdateTargetRequest>;
}

/**
 * Target import interface
 */
export interface TargetImport {
  targets: CreateTargetRequest[];
  overwrite: boolean;
  validateOnly: boolean;
}

/**
 * Target export interface
 */
export interface TargetExport {
  format: 'json' | 'csv' | 'xlsx';
  filters?: TargetFilter;
  fields?: (keyof Target)[];
}

/**
 * Target scan schedule interface
 */
export interface TargetScanSchedule {
  targetId: string;
  frequency: ScanFrequency;
  nextScan: Date;
  enabled: boolean;
  config?: Partial<TargetConfig>;
}

/**
 * Target group interface
 */
export interface TargetGroup {
  id: string;
  name: string;
  description?: string;
  targets: string[];
  config: TargetConfig;
  metadata: TargetMetadata;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Target template interface
 */
export interface TargetTemplate {
  id: string;
  name: string;
  description?: string;
  type: TargetType;
  config: TargetConfig;
  metadata: TargetMetadata;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Target validation result interface
 */
export interface TargetValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Target discovery result interface
 */
export interface TargetDiscoveryResult {
  discoveredTargets: CreateTargetRequest[];
  duplicates: string[];
  invalid: string[];
  summary: {
    total: number;
    valid: number;
    duplicates: number;
    invalid: number;
  };
}

/**
 * Target compliance interface
 */
export interface TargetCompliance {
  framework: string;
  version: string;
  status: 'compliant' | 'non-compliant' | 'partial';
  score: number;
  requirements: ComplianceRequirement[];
  lastAssessment: Date;
  nextAssessment: Date;
}

/**
 * Compliance requirement interface
 */
export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'not-applicable';
  evidence?: string;
  remediation?: string;
}

/**
 * Target risk assessment interface
 */
export interface TargetRiskAssessment {
  overallRisk: TargetRiskLevel;
  riskFactors: RiskFactor[];
  recommendations: string[];
  lastAssessment: Date;
  nextAssessment: Date;
}

/**
 * Risk factor interface
 */
export interface RiskFactor {
  factor: string;
  weight: number;
  score: number;
  description: string;
  mitigation?: string;
}

/**
 * Target API response types
 */
export namespace TargetAPI {
  export interface CreateResponse {
    target: Target;
    message: string;
  }

  export interface UpdateResponse {
    target: Target;
    message: string;
  }

  export interface DeleteResponse {
    message: string;
    deletedCount: number;
  }

  export interface BulkResponse {
    success: string[];
    failed: Array<{
      id: string;
      error: string;
    }>;
    message: string;
  }

  export interface ValidateResponse {
    result: TargetValidationResult;
  }

  export interface DiscoverResponse {
    result: TargetDiscoveryResult;
  }

  export interface HealthCheckResponse {
    health: TargetHealth;
  }

  export interface StatsResponse {
    stats: TargetStats;
  }

  export interface ComplianceResponse {
    compliance: TargetCompliance[];
  }

  export interface RiskAssessmentResponse {
    assessment: TargetRiskAssessment;
  }
} 