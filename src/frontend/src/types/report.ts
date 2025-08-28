/**
 * Report Types
 * TypeScript interfaces and types for report management
 */

/**
 * Report type enumeration
 */
export enum ReportType {
  VULNERABILITY = 'vulnerability',
  COMPLIANCE = 'compliance',
  EXECUTIVE = 'executive',
  TECHNICAL = 'technical',
  TREND = 'trend',
  COMPARISON = 'comparison',
  CUSTOM = 'custom'
}

/**
 * Report format enumeration
 */
export enum ReportFormat {
  PDF = 'pdf',
  HTML = 'html',
  JSON = 'json',
  CSV = 'csv',
  XML = 'xml',
  EXCEL = 'xlsx',
  WORD = 'docx'
}

/**
 * Report status enumeration
 */
export enum ReportStatus {
  DRAFT = 'draft',
  GENERATING = 'generating',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

/**
 * Report template interface
 */
export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  sections: ReportSection[];
  styling: ReportStyling;
  isDefault: boolean;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Report section interface
 */
export interface ReportSection {
  id: string;
  name: string;
  type: 'summary' | 'details' | 'charts' | 'tables' | 'custom';
  order: number;
  required: boolean;
  config: Record<string, any>;
  content?: string;
}

/**
 * Report styling interface
 */
export interface ReportStyling {
  theme: 'light' | 'dark' | 'custom';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    code: string;
  };
  logo?: string;
  header?: string;
  footer?: string;
  customCSS?: string;
}

/**
 * Report filter interface
 */
export interface ReportFilter {
  targetIds?: string[];
  scanIds?: string[];
  vulnerabilityIds?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  severity?: string[];
  status?: string[];
  category?: string[];
  tags?: string[];
  custom?: Record<string, any>;
}

/**
 * Report configuration interface
 */
export interface ReportConfig {
  type: ReportType;
  format: ReportFormat;
  template?: string;
  filters: ReportFilter;
  sections: string[];
  styling?: Partial<ReportStyling>;
  includeCharts: boolean;
  includeTables: boolean;
  includeEvidence: boolean;
  includeRemediation: boolean;
  includeTimeline: boolean;
  includeMetadata: boolean;
  customFields?: Record<string, any>;
}

/**
 * Report metadata interface
 */
export interface ReportMetadata {
  title: string;
  subtitle?: string;
  description?: string;
  author: string;
  department?: string;
  version: string;
  classification?: 'public' | 'internal' | 'confidential' | 'restricted';
  tags: string[];
  customFields?: Record<string, any>;
}

/**
 * Report content interface
 */
export interface ReportContent {
  sections: ReportSectionContent[];
  summary: ReportSummary;
  charts?: ReportChart[];
  tables?: ReportTable[];
  attachments?: ReportAttachment[];
}

/**
 * Report section content interface
 */
export interface ReportSectionContent {
  id: string;
  name: string;
  content: string;
  order: number;
  data?: any;
}

/**
 * Report summary interface
 */
export interface ReportSummary {
  totalVulnerabilities: number;
  criticalVulnerabilities: number;
  highVulnerabilities: number;
  mediumVulnerabilities: number;
  lowVulnerabilities: number;
  infoFindings: number;
  riskScore: number;
  complianceScore?: number;
  recommendations: string[];
  executiveSummary: string;
  technicalSummary: string;
  keyFindings: string[];
  nextSteps: string[];
}

/**
 * Report chart interface
 */
export interface ReportChart {
  id: string;
  type: 'pie' | 'bar' | 'line' | 'doughnut' | 'radar' | 'scatter';
  title: string;
  data: any;
  options?: any;
  order: number;
}

/**
 * Report table interface
 */
export interface ReportTable {
  id: string;
  title: string;
  headers: string[];
  data: any[][];
  order: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * Report attachment interface
 */
export interface ReportAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  description?: string;
}

/**
 * Report interface
 */
export interface Report {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  config: ReportConfig;
  metadata: ReportMetadata;
  content?: ReportContent;
  fileUrl?: string;
  fileSize?: number;
  generatedAt?: Date;
  expiresAt?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
}

/**
 * Report creation request interface
 */
export interface CreateReportRequest {
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  config: ReportConfig;
  metadata: ReportMetadata;
  template?: string;
  isPublic?: boolean;
  tags?: string[];
  schedule?: ReportSchedule;
}

/**
 * Report update request interface
 */
export interface UpdateReportRequest {
  name?: string;
  description?: string;
  config?: Partial<ReportConfig>;
  metadata?: Partial<ReportMetadata>;
  status?: ReportStatus;
  isPublic?: boolean;
  tags?: string[];
}

/**
 * Report schedule interface
 */
export interface ReportSchedule {
  frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';
  startDate: Date;
  endDate?: Date;
  time: string; // HH:mm format
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  daysOfMonth?: number[]; // 1-31
  timezone: string;
  enabled: boolean;
  recipients: string[];
  format: ReportFormat;
}

/**
 * Report filter interface
 */
export interface ReportListFilter {
  type?: ReportType[];
  format?: ReportFormat[];
  status?: ReportStatus[];
  createdBy?: string[];
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  isPublic?: boolean;
  search?: string;
}

/**
 * Report sort options interface
 */
export interface ReportSort {
  field: keyof Report;
  direction: 'asc' | 'desc';
}

/**
 * Report list response interface
 */
export interface ReportListResponse {
  reports: Report[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Report bulk operation interface
 */
export interface ReportBulkOperation {
  reportIds: string[];
  operation: 'delete' | 'duplicate' | 'export' | 'update_status';
  data?: Partial<UpdateReportRequest>;
}

/**
 * Report export interface
 */
export interface ReportExport {
  format: ReportFormat;
  filters?: ReportListFilter;
  fields?: (keyof Report)[];
  includeContent?: boolean;
  includeAttachments?: boolean;
}

/**
 * Report template creation request interface
 */
export interface CreateReportTemplateRequest {
  name: string;
  description?: string;
  type: ReportType;
  format: ReportFormat;
  sections: ReportSection[];
  styling: ReportStyling;
  isDefault?: boolean;
  isPublic?: boolean;
  tags?: string[];
}

/**
 * Report template update request interface
 */
export interface UpdateReportTemplateRequest {
  name?: string;
  description?: string;
  sections?: ReportSection[];
  styling?: Partial<ReportStyling>;
  isDefault?: boolean;
  isPublic?: boolean;
  tags?: string[];
}

/**
 * Report generation progress interface
 */
export interface ReportGenerationProgress {
  reportId: string;
  progress: number; // 0-100
  currentStep: string;
  estimatedTimeRemaining: number; // seconds
  status: 'preparing' | 'generating' | 'finalizing' | 'completed' | 'failed';
  details: string;
}

/**
 * Report sharing interface
 */
export interface ReportSharing {
  id: string;
  reportId: string;
  type: 'email' | 'link' | 'api';
  recipients?: string[];
  link?: string;
  expiresAt?: Date;
  password?: string;
  permissions: {
    view: boolean;
    download: boolean;
    share: boolean;
    edit: boolean;
  };
  createdBy: string;
  createdAt: Date;
  accessedAt?: Date;
  accessCount: number;
}

/**
 * Report analytics interface
 */
export interface ReportAnalytics {
  totalReports: number;
  totalDownloads: number;
  totalViews: number;
  averageGenerationTime: number;
  popularTemplates: ReportTemplate[];
  recentReports: Report[];
  byType: Record<ReportType, number>;
  byFormat: Record<ReportFormat, number>;
  byStatus: Record<ReportStatus, number>;
  trends: {
    period: string;
    reports: number;
    downloads: number;
    views: number;
  }[];
}

/**
 * Report API response types
 */
export namespace ReportAPI {
  export interface CreateResponse {
    report: Report;
    message: string;
  }

  export interface UpdateResponse {
    report: Report;
    message: string;
  }

  export interface DeleteResponse {
    message: string;
    deletedCount: number;
  }

  export interface GenerateResponse {
    report: Report;
    progress: ReportGenerationProgress;
    message: string;
  }

  export interface DownloadResponse {
    url: string;
    filename: string;
    size: number;
    expiresAt: Date;
  }

  export interface ShareResponse {
    sharing: ReportSharing;
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

  export interface TemplateResponse {
    templates: ReportTemplate[];
  }

  export interface TemplateCreateResponse {
    template: ReportTemplate;
    message: string;
  }

  export interface TemplateUpdateResponse {
    template: ReportTemplate;
    message: string;
  }

  export interface TemplateDeleteResponse {
    message: string;
    deletedCount: number;
  }

  export interface ProgressResponse {
    progress: ReportGenerationProgress;
  }

  export interface AnalyticsResponse {
    analytics: ReportAnalytics;
  }

  export interface SharingResponse {
    sharing: ReportSharing[];
  }
} 