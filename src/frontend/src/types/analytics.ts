/**
 * Analytics Types
 * TypeScript interfaces and types for analytics and metrics
 */

/**
 * Analytics metric type enumeration
 */
export enum AnalyticsMetricType {
  COUNT = 'count',
  SUM = 'sum',
  AVERAGE = 'average',
  MIN = 'min',
  MAX = 'max',
  PERCENTAGE = 'percentage',
  RATIO = 'ratio',
  TREND = 'trend'
}

/**
 * Analytics time period enumeration
 */
export enum AnalyticsTimePeriod {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
  CUSTOM = 'custom'
}

/**
 * Analytics chart type enumeration
 */
export enum AnalyticsChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  RADAR = 'radar',
  SCATTER = 'scatter',
  AREA = 'area',
  STACKED_BAR = 'stacked_bar',
  STACKED_AREA = 'stacked_area',
  HEATMAP = 'heatmap',
  GAUGE = 'gauge',
  FUNNEL = 'funnel'
}

/**
 * Analytics dashboard interface
 */
export interface AnalyticsDashboard {
  id: string;
  name: string;
  description?: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  isDefault: boolean;
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/**
 * Dashboard layout interface
 */
export interface DashboardLayout {
  columns: number;
  rows: number;
  grid: DashboardGridItem[];
}

/**
 * Dashboard grid item interface
 */
export interface DashboardGridItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  widgetId: string;
}

/**
 * Dashboard widget interface
 */
export interface DashboardWidget {
  id: string;
  name: string;
  type: AnalyticsWidgetType;
  config: WidgetConfig;
  data?: WidgetData;
  position: WidgetPosition;
  size: WidgetSize;
  refreshInterval?: number; // seconds
  lastUpdated?: Date;
}

/**
 * Analytics widget type enumeration
 */
export enum AnalyticsWidgetType {
  METRIC = 'metric',
  CHART = 'chart',
  TABLE = 'table',
  LIST = 'list',
  PROGRESS = 'progress',
  GAUGE = 'gauge',
  HEATMAP = 'heatmap',
  TIMELINE = 'timeline',
  MAP = 'map',
  CUSTOM = 'custom'
}

/**
 * Widget configuration interface
 */
export interface WidgetConfig {
  metric?: string;
  chartType?: AnalyticsChartType;
  timePeriod?: AnalyticsTimePeriod;
  filters?: Record<string, any>;
  options?: Record<string, any>;
  customConfig?: Record<string, any>;
}

/**
 * Widget data interface
 */
export interface WidgetData {
  value?: number;
  values?: number[];
  labels?: string[];
  series?: WidgetSeries[];
  table?: WidgetTable;
  list?: WidgetListItem[];
  metadata?: Record<string, any>;
}

/**
 * Widget series interface
 */
export interface WidgetSeries {
  name: string;
  data: number[];
  color?: string;
}

/**
 * Widget table interface
 */
export interface WidgetTable {
  headers: string[];
  rows: any[][];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * Widget list item interface
 */
export interface WidgetListItem {
  id: string;
  title: string;
  subtitle?: string;
  value?: number;
  trend?: number;
  color?: string;
  icon?: string;
  url?: string;
}

/**
 * Widget position interface
 */
export interface WidgetPosition {
  x: number;
  y: number;
}

/**
 * Widget size interface
 */
export interface WidgetSize {
  width: number;
  height: number;
}

/**
 * Dashboard filter interface
 */
export interface DashboardFilter {
  id: string;
  name: string;
  type: 'date' | 'select' | 'multiselect' | 'text' | 'number' | 'boolean';
  field: string;
  value?: any;
  options?: any[];
  required: boolean;
  defaultValue?: any;
}

/**
 * Analytics metric interface
 */
export interface AnalyticsMetric {
  id: string;
  name: string;
  description?: string;
  type: AnalyticsMetricType;
  unit?: string;
  category: string;
  tags: string[];
  formula?: string;
  dependencies?: string[];
  isCalculated: boolean;
  isCustom: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Analytics data point interface
 */
export interface AnalyticsDataPoint {
  timestamp: Date;
  value: number;
  metadata?: Record<string, any>;
}

/**
 * Analytics time series interface
 */
export interface AnalyticsTimeSeries {
  metric: string;
  period: AnalyticsTimePeriod;
  data: AnalyticsDataPoint[];
  summary: {
    min: number;
    max: number;
    average: number;
    total: number;
    count: number;
  };
}

/**
 * Analytics trend interface
 */
export interface AnalyticsTrend {
  metric: string;
  period: AnalyticsTimePeriod;
  current: number;
  previous: number;
  change: number;
  changePercentage: number;
  direction: 'up' | 'down' | 'stable';
  significance: 'high' | 'medium' | 'low';
}

/**
 * Analytics comparison interface
 */
export interface AnalyticsComparison {
  metric: string;
  current: AnalyticsTimeSeries;
  previous: AnalyticsTimeSeries;
  difference: {
    absolute: number;
    percentage: number;
    trend: AnalyticsTrend;
  };
}

/**
 * Analytics insight interface
 */
export interface AnalyticsInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'forecast' | 'recommendation';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  metrics: string[];
  data: any;
  recommendations?: string[];
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Analytics forecast interface
 */
export interface AnalyticsForecast {
  metric: string;
  period: AnalyticsTimePeriod;
  predictions: AnalyticsDataPoint[];
  confidence: {
    lower: AnalyticsDataPoint[];
    upper: AnalyticsDataPoint[];
  };
  accuracy: number; // 0-100
  model: string;
  lastUpdated: Date;
}

/**
 * Analytics correlation interface
 */
export interface AnalyticsCorrelation {
  metric1: string;
  metric2: string;
  coefficient: number; // -1 to 1
  strength: 'weak' | 'moderate' | 'strong';
  direction: 'positive' | 'negative';
  significance: number; // p-value
  sampleSize: number;
}

/**
 * Analytics anomaly interface
 */
export interface AnalyticsAnomaly {
  id: string;
  metric: string;
  timestamp: Date;
  value: number;
  expectedValue: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  context?: Record<string, any>;
}

/**
 * Analytics KPI interface
 */
export interface AnalyticsKPI {
  id: string;
  name: string;
  description?: string;
  metric: string;
  target: number;
  current: number;
  unit: string;
  status: 'on_track' | 'at_risk' | 'off_track' | 'exceeded';
  progress: number; // 0-100
  trend: AnalyticsTrend;
  owner?: string;
  lastUpdated: Date;
}

/**
 * Analytics report interface
 */
export interface AnalyticsReport {
  id: string;
  name: string;
  description?: string;
  type: 'summary' | 'detailed' | 'comparison' | 'forecast';
  metrics: string[];
  timeRange: {
    start: Date;
    end: Date;
  };
  filters: Record<string, any>;
  data: {
    summary: Record<string, number>;
    trends: AnalyticsTrend[];
    insights: AnalyticsInsight[];
    charts: AnalyticsChart[];
    tables: AnalyticsTable[];
  };
  generatedAt: Date;
  generatedBy: string;
  expiresAt?: Date;
}

/**
 * Analytics chart interface
 */
export interface AnalyticsChart {
  id: string;
  name: string;
  type: AnalyticsChartType;
  data: any;
  options?: any;
  config?: Record<string, any>;
}

/**
 * Analytics table interface
 */
export interface AnalyticsTable {
  id: string;
  name: string;
  headers: string[];
  data: any[][];
  summary?: Record<string, number>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

/**
 * Analytics export interface
 */
export interface AnalyticsExport {
  format: 'json' | 'csv' | 'xlsx' | 'pdf';
  metrics: string[];
  timeRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  includeCharts?: boolean;
  includeInsights?: boolean;
}

/**
 * Analytics API response types
 */
export namespace AnalyticsAPI {
  export interface DashboardResponse {
    dashboard: AnalyticsDashboard;
  }

  export interface DashboardListResponse {
    dashboards: AnalyticsDashboard[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }

  export interface WidgetResponse {
    widget: DashboardWidget;
  }

  export interface MetricResponse {
    metric: AnalyticsMetric;
  }

  export interface MetricListResponse {
    metrics: AnalyticsMetric[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }

  export interface TimeSeriesResponse {
    timeSeries: AnalyticsTimeSeries;
  }

  export interface TrendResponse {
    trend: AnalyticsTrend;
  }

  export interface ComparisonResponse {
    comparison: AnalyticsComparison;
  }

  export interface InsightResponse {
    insights: AnalyticsInsight[];
  }

  export interface ForecastResponse {
    forecast: AnalyticsForecast;
  }

  export interface CorrelationResponse {
    correlations: AnalyticsCorrelation[];
  }

  export interface AnomalyResponse {
    anomalies: AnalyticsAnomaly[];
  }

  export interface KPIResponse {
    kpis: AnalyticsKPI[];
  }

  export interface ReportResponse {
    report: AnalyticsReport;
  }

  export interface ExportResponse {
    url: string;
    filename: string;
    size: number;
    expiresAt: Date;
  }
} 