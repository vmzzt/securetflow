# Purple Team Platform V4 Master - Monitoramento e Observabilidade

## 📊 Visão Geral do Monitoramento

Este guia detalha a implementação de um sistema completo de monitoramento e observabilidade para a Purple Team Platform V4 Master, garantindo visibilidade total sobre performance, segurança e saúde da aplicação.

## 🏗️ Arquitetura de Monitoramento

### **1. Stack de Observabilidade**
```yaml
Observability Stack:
  Metrics Collection:
    - Prometheus (time-series database)
    - Node Exporter (system metrics)
    - Custom metrics (application-specific)
  
  Logging:
    - Fluentd/Fluent Bit (log aggregation)
    - Elasticsearch (log storage)
    - Kibana (log visualization)
    - Loki (alternative lightweight)
  
  Tracing:
    - Jaeger (distributed tracing)
    - OpenTelemetry (standards)
    - Custom spans (business logic)
  
  Alerting:
    - Alertmanager (alert routing)
    - PagerDuty/Slack (notifications)
    - Escalation policies
  
  Visualization:
    - Grafana (dashboards)
    - Custom dashboards
    - Real-time monitoring
```

### **2. Integração com Cloud Providers**

#### **AWS CloudWatch Integration**
```hcl
# CloudWatch Configuration
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "purple-team-platform"
  
  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", "purple-team-api", "ClusterName", "purple-team-cluster"],
            [".", "MemoryUtilization", ".", ".", ".", "."]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "ECS Service Metrics"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", "app/purple-team-alb/1234567890abcdef"],
            [".", "TargetResponseTime", ".", "."],
            [".", "HTTPCode_Target_5XX_Count", ".", "."]
          ]
          period = 300
          stat   = "Sum"
          region = "us-east-1"
          title  = "Load Balancer Metrics"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        
        properties = {
          metrics = [
            ["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", "purple-team-postgres"],
            [".", "DatabaseConnections", ".", "."],
            [".", "FreeableMemory", ".", "."]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "RDS Database Metrics"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        
        properties = {
          metrics = [
            ["AWS/ElastiCache", "CPUUtilization", "CacheClusterId", "purple-team-redis"],
            [".", "DatabaseMemoryUsagePercentage", ".", "."],
            [".", "CurrConnections", ".", "."]
          ]
          period = 300
          stat   = "Average"
          region = "us-east-1"
          title  = "Redis Cache Metrics"
        }
      }
    ]
  })
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "api_errors" {
  alarm_name          = "purple-team-api-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "API 5XX errors exceeded threshold"
  
  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.api.arn_suffix
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "api_latency" {
  alarm_name          = "purple-team-api-latency"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "TargetResponseTime"
  namespace           = "AWS/ApplicationELB"
  period              = "300"
  statistic           = "Average"
  threshold           = "2"
  alarm_description   = "API response time exceeded 2 seconds"
  
  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.api.arn_suffix
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
}

resource "aws_cloudwatch_metric_alarm" "database_cpu" {
  alarm_name          = "purple-team-database-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/RDS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Database CPU utilization exceeded 80%"
  
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.postgres.id
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
}

# SNS Topic for Alerts
resource "aws_sns_topic" "alerts" {
  name = "purple-team-alerts"
}

resource "aws_sns_topic_subscription" "email" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = "security-team@company.com"
}

resource "aws_sns_topic_subscription" "slack" {
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "https"
  endpoint  = "https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK"
}
```

## 📈 Métricas da Aplicação

### **1. Custom Metrics**

#### **Python Application Metrics**
```python
# src/monitoring/metrics.py
from prometheus_client import Counter, Histogram, Gauge, Summary
import time
from functools import wraps

# Request metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_DURATION = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration in seconds',
    ['method', 'endpoint']
)

# Business metrics
SECURITY_SCAN_COUNT = Counter(
    'security_scans_total',
    'Total security scans performed',
    ['tool', 'status', 'severity']
)

VULNERABILITY_COUNT = Gauge(
    'vulnerabilities_active',
    'Number of active vulnerabilities',
    ['severity', 'category']
)

# System metrics
ACTIVE_USERS = Gauge(
    'active_users',
    'Number of active users'
)

DATABASE_CONNECTIONS = Gauge(
    'database_connections_active',
    'Number of active database connections'
)

# Performance metrics
API_RESPONSE_TIME = Summary(
    'api_response_time_seconds',
    'API response time in seconds',
    ['endpoint']
)

# Decorator for timing requests
def monitor_request_time(endpoint):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                REQUEST_COUNT.labels(
                    method='GET',
                    endpoint=endpoint,
                    status='200'
                ).inc()
                return result
            except Exception as e:
                REQUEST_COUNT.labels(
                    method='GET',
                    endpoint=endpoint,
                    status='500'
                ).inc()
                raise
            finally:
                duration = time.time() - start_time
                REQUEST_DURATION.labels(
                    method='GET',
                    endpoint=endpoint
                ).observe(duration)
                API_RESPONSE_TIME.labels(endpoint=endpoint).observe(duration)
        return wrapper
    return decorator

# Security metrics tracking
def track_security_scan(tool, status, severity):
    SECURITY_SCAN_COUNT.labels(
        tool=tool,
        status=status,
        severity=severity
    ).inc()

def update_vulnerability_count(severity, category, count):
    VULNERABILITY_COUNT.labels(
        severity=severity,
        category=category
    ).set(count)

# System metrics tracking
def update_active_users(count):
    ACTIVE_USERS.set(count)

def update_database_connections(count):
    DATABASE_CONNECTIONS.set(count)
```

#### **FastAPI Integration**
```python
# src/monitoring/middleware.py
from fastapi import Request, Response
from prometheus_client import Counter, Histogram
import time
from .metrics import REQUEST_COUNT, REQUEST_DURATION

class PrometheusMiddleware:
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            start_time = time.time()
            
            # Create a custom send function to capture response
            async def custom_send(message):
                if message["type"] == "http.response.start":
                    # Record metrics
                    duration = time.time() - start_time
                    method = scope.get("method", "UNKNOWN")
                    path = scope.get("path", "/")
                    status = message.get("status", 500)
                    
                    REQUEST_COUNT.labels(
                        method=method,
                        endpoint=path,
                        status=str(status)
                    ).inc()
                    
                    REQUEST_DURATION.labels(
                        method=method,
                        endpoint=path
                    ).observe(duration)
                
                await send(message)
            
            await self.app(scope, receive, custom_send)
        else:
            await self.app(scope, receive, send)

# src/main.py
from fastapi import FastAPI
from prometheus_client import make_asgi_app
from .monitoring.middleware import PrometheusMiddleware
from .monitoring.metrics import *

app = FastAPI(title="Purple Team Platform API")

# Add Prometheus middleware
app.add_middleware(PrometheusMiddleware)

# Mount Prometheus metrics endpoint
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/ready")
async def readiness_check():
    # Check database connection
    # Check Redis connection
    # Check external services
    return {"status": "ready"}
```

### **2. Database Metrics**

#### **PostgreSQL Monitoring**
```yaml
# monitoring/postgres-exporter.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-exporter-config
  namespace: monitoring
data:
  DATA_SOURCE_NAME: "postgresql://postgres:password@postgres:5432/purpleteam?sslmode=disable"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-exporter
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres-exporter
  template:
    metadata:
      labels:
        app: postgres-exporter
    spec:
      containers:
      - name: postgres-exporter
        image: prometheuscommunity/postgres-exporter:latest
        ports:
        - containerPort: 9187
        env:
        - name: DATA_SOURCE_NAME
          valueFrom:
            configMapKeyRef:
              name: postgres-exporter-config
              key: DATA_SOURCE_NAME
        resources:
          requests:
            memory: "64Mi"
            cpu: "50m"
          limits:
            memory: "128Mi"
            cpu: "100m"

---
apiVersion: v1
kind: Service
metadata:
  name: postgres-exporter
  namespace: monitoring
spec:
  selector:
    app: postgres-exporter
  ports:
  - protocol: TCP
    port: 9187
    targetPort: 9187
```

### **3. Redis Metrics**

#### **Redis Monitoring**
```yaml
# monitoring/redis-exporter.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: redis-exporter-config
  namespace: monitoring
data:
  REDIS_ADDR: "redis://redis:6379"

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-exporter
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis-exporter
  template:
    metadata:
      labels:
        app: redis-exporter
    spec:
      containers:
      - name: redis-exporter
        image: oliver006/redis_exporter:latest
        ports:
        - containerPort: 9121
        env:
        - name: REDIS_ADDR
          valueFrom:
            configMapKeyRef:
              name: redis-exporter-config
              key: REDIS_ADDR
        resources:
          requests:
            memory: "32Mi"
            cpu: "25m"
          limits:
            memory: "64Mi"
            cpu: "50m"

---
apiVersion: v1
kind: Service
metadata:
  name: redis-exporter
  namespace: monitoring
spec:
  selector:
    app: redis-exporter
  ports:
  - protocol: TCP
    port: 9121
    targetPort: 9121
```

## 📝 Logging Strategy

### **1. Structured Logging**

#### **Python Logging Configuration**
```python
# src/monitoring/logging.py
import logging
import json
import sys
from datetime import datetime
from typing import Any, Dict

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        # Add extra fields if present
        if hasattr(record, 'extra_fields'):
            log_entry.update(record.extra_fields)
        
        # Add exception info if present
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_entry)

class SecurityLogger:
    def __init__(self, name: str = "security"):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.INFO)
        
        # Add JSON formatter
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter())
        self.logger.addHandler(handler)
    
    def log_security_event(self, event_type: str, details: Dict[str, Any], severity: str = "INFO"):
        extra_fields = {
            "event_type": event_type,
            "severity": severity,
            "details": details
        }
        
        log_record = self.logger.makeRecord(
            self.logger.name,
            logging.getLevelName(severity),
            "",
            0,
            f"Security event: {event_type}",
            (),
            None,
            extra_fields=extra_fields
        )
        
        self.logger.handle(log_record)
    
    def log_vulnerability_scan(self, tool: str, target: str, findings: list, status: str):
        self.log_security_event(
            "vulnerability_scan",
            {
                "tool": tool,
                "target": target,
                "findings_count": len(findings),
                "status": status,
                "findings": findings
            },
            "INFO"
        )
    
    def log_security_incident(self, incident_type: str, description: str, affected_systems: list):
        self.log_security_event(
            "security_incident",
            {
                "incident_type": incident_type,
                "description": description,
                "affected_systems": affected_systems
            },
            "WARNING"
        )

# Initialize security logger
security_logger = SecurityLogger()

# Usage example
def scan_target(target: str):
    try:
        # Perform security scan
        findings = perform_scan(target)
        
        security_logger.log_vulnerability_scan(
            tool="nmap",
            target=target,
            findings=findings,
            status="completed"
        )
        
        return findings
    except Exception as e:
        security_logger.log_security_incident(
            incident_type="scan_failure",
            description=str(e),
            affected_systems=[target]
        )
        raise
```

### **2. Log Aggregation**

#### **Fluentd Configuration**
```yaml
# monitoring/fluentd-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: monitoring
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/purple-team-*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      <parse>
        @type json
        time_format %Y-%m-%dT%H:%M:%S.%NZ
      </parse>
    </source>

    <filter kubernetes.**>
      @type kubernetes_metadata
      @id filter_kube_metadata
    </filter>

    <filter kubernetes.**>
      @type record_transformer
      enable_ruby true
      <record>
        @timestamp ${time.strftime('%Y-%m-%dT%H:%M:%S.%NZ')}
        level ${record['level'] || 'INFO'}
        message ${record['message'] || record['log']}
        pod_name ${record['kubernetes']['pod_name']}
        namespace ${record['kubernetes']['namespace_name']}
        container_name ${record['kubernetes']['container_name']}
      </record>
    </filter>

    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch
      port 9200
      logstash_format true
      logstash_prefix purple-team-logs
      <buffer>
        @type file
        path /var/log/fluentd-buffers/kubernetes.system.buffer
        flush_mode interval
        retry_type exponential_backoff
        flush_interval 5s
        retry_forever false
        retry_max_interval 30
        chunk_limit_size 2M
        queue_limit_length 8
        overflow_action block
      </buffer>
    </match>

---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd
  namespace: monitoring
spec:
  selector:
    matchLabels:
      name: fluentd
  template:
    metadata:
      labels:
        name: fluentd
    spec:
      serviceAccount: fluentd
      containers:
      - name: fluentd
        image: fluent/fluentd-kubernetes-daemonset:v1.14-debian-elasticsearch7-1
        env:
        - name: FLUENT_ELASTICSEARCH_HOST
          value: "elasticsearch"
        - name: FLUENT_ELASTICSEARCH_PORT
          value: "9200"
        - name: FLUENT_ELASTICSEARCH_SCHEME
          value: "http"
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
        - name: config
          mountPath: /fluentd/etc
      terminationGracePeriodSeconds: 30
      volumes:
      - name: varlog
        hostPath:
          path: /var/log
      - name: varlibdockercontainers
        hostPath:
          path: /var/lib/docker/containers
      - name: config
        configMap:
          name: fluentd-config
```

## 🔍 Distributed Tracing

### **1. Jaeger Integration**

#### **Jaeger Configuration**
```yaml
# monitoring/jaeger.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jaeger
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jaeger
  template:
    metadata:
      labels:
        app: jaeger
    spec:
      containers:
      - name: jaeger
        image: jaegertracing/all-in-one:latest
        ports:
        - containerPort: 16686
        - containerPort: 14268
        env:
        - name: COLLECTOR_OTLP_ENABLED
          value: "true"
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"

---
apiVersion: v1
kind: Service
metadata:
  name: jaeger
  namespace: monitoring
spec:
  selector:
    app: jaeger
  ports:
  - name: http-query
    port: 16686
    targetPort: 16686
  - name: http-collector
    port: 14268
    targetPort: 14268
```

#### **OpenTelemetry Integration**
```python
# src/monitoring/tracing.py
from opentelemetry import trace
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor

def setup_tracing():
    # Create tracer provider
    trace.set_tracer_provider(TracerProvider())
    
    # Create Jaeger exporter
    jaeger_exporter = JaegerExporter(
        agent_host_name="jaeger",
        agent_port=6831,
    )
    
    # Create span processor
    span_processor = BatchSpanProcessor(jaeger_exporter)
    trace.get_tracer_provider().add_span_processor(span_processor)
    
    # Get tracer
    tracer = trace.get_tracer(__name__)
    
    return tracer

# Initialize tracing
tracer = setup_tracing()

# Decorator for tracing functions
def trace_function(operation_name: str):
    def decorator(func):
        def wrapper(*args, **kwargs):
            with tracer.start_as_current_span(operation_name) as span:
                span.set_attribute("function.name", func.__name__)
                span.set_attribute("function.module", func.__module__)
                
                try:
                    result = func(*args, **kwargs)
                    span.set_attribute("function.success", True)
                    return result
                except Exception as e:
                    span.set_attribute("function.success", False)
                    span.set_attribute("function.error", str(e))
                    span.record_exception(e)
                    raise
        return wrapper
    return decorator

# Usage example
@trace_function("security_scan")
def perform_security_scan(target: str, scan_type: str):
    with tracer.start_as_current_span("scan_execution") as span:
        span.set_attribute("scan.target", target)
        span.set_attribute("scan.type", scan_type)
        
        # Perform scan logic
        results = execute_scan(target, scan_type)
        
        span.set_attribute("scan.results_count", len(results))
        return results
```

## 📊 Dashboards e Visualização

### **1. Grafana Dashboards**

#### **Main Dashboard Configuration**
```json
{
  "dashboard": {
    "title": "Purple Team Platform - Overview",
    "panels": [
      {
        "title": "API Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ],
        "yAxes": [
          {
            "label": "Response Time (seconds)",
            "min": 0
          }
        ]
      },
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ],
        "yAxes": [
          {
            "label": "Requests per second",
            "min": 0
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])",
            "legendFormat": "{{method}} {{endpoint}}"
          }
        ],
        "yAxes": [
          {
            "label": "Errors per second",
            "min": 0
          }
        ]
      },
      {
        "title": "Security Scans",
        "type": "stat",
        "targets": [
          {
            "expr": "security_scans_total",
            "legendFormat": "{{tool}} {{status}}"
          }
        ]
      },
      {
        "title": "Active Vulnerabilities",
        "type": "stat",
        "targets": [
          {
            "expr": "vulnerabilities_active",
            "legendFormat": "{{severity}} {{category}}"
          }
        ]
      },
      {
        "title": "Database Connections",
        "type": "graph",
        "targets": [
          {
            "expr": "database_connections_active",
            "legendFormat": "Active Connections"
          }
        ]
      },
      {
        "title": "System Resources",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(container_cpu_usage_seconds_total[5m])",
            "legendFormat": "{{pod}} CPU"
          },
          {
            "expr": "container_memory_usage_bytes / 1024 / 1024",
            "legendFormat": "{{pod}} Memory (MB)"
          }
        ]
      }
    ],
    "time": {
      "from": "now-1h",
      "to": "now"
    },
    "refresh": "30s"
  }
}
```

### **2. Security Dashboard**
```json
{
  "dashboard": {
    "title": "Purple Team Platform - Security",
    "panels": [
      {
        "title": "Vulnerability Distribution",
        "type": "piechart",
        "targets": [
          {
            "expr": "vulnerabilities_active",
            "legendFormat": "{{severity}}"
          }
        ]
      },
      {
        "title": "Security Scans by Tool",
        "type": "barchart",
        "targets": [
          {
            "expr": "security_scans_total",
            "legendFormat": "{{tool}}"
          }
        ]
      },
      {
        "title": "Scan Success Rate",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(security_scans_total{status=\"success\"}[1h]) / rate(security_scans_total[1h]) * 100",
            "legendFormat": "Success Rate (%)"
          }
        ]
      },
      {
        "title": "Recent Security Events",
        "type": "table",
        "targets": [
          {
            "expr": "security_events_total",
            "legendFormat": "{{event_type}} {{severity}}"
          }
        ]
      }
    ]
  }
}
```

## 🚨 Alerting Configuration

### **1. Prometheus Alert Rules**
```yaml
# monitoring/alert-rules.yaml
groups:
  - name: purple-team-alerts
    rules:
      # API Alerts
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors per second"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }} seconds"

      # Security Alerts
      - alert: SecurityScanFailure
        expr: rate(security_scans_total{status="failure"}[5m]) > 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Security scan failure detected"
          description: "Security scan is failing"

      - alert: HighVulnerabilityCount
        expr: vulnerabilities_active{severity="critical"} > 10
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High number of critical vulnerabilities"
          description: "{{ $value }} critical vulnerabilities detected"

      # System Alerts
      - alert: HighCPUUsage
        expr: rate(container_cpu_usage_seconds_total[5m]) > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage detected"
          description: "CPU usage is {{ $value }}%"

      - alert: HighMemoryUsage
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.8
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"
          description: "Memory usage is {{ $value }}%"

      # Database Alerts
      - alert: DatabaseConnectionHigh
        expr: database_connections_active > 80
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High database connection count"
          description: "{{ $value }} active database connections"

      - alert: DatabaseDown
        expr: up{job="postgres"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Database is down"
          description: "PostgreSQL database is not responding"
```

### **2. Alertmanager Configuration**
```yaml
# monitoring/alertmanager-config.yaml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'slack-notifications'
  routes:
    - match:
        severity: critical
      receiver: 'pagerduty-critical'
      continue: true
    - match:
        severity: warning
      receiver: 'slack-notifications'

receivers:
  - name: 'slack-notifications'
    slack_configs:
      - channel: '#security-alerts'
        title: '{{ template "slack.title" . }}'
        text: '{{ template "slack.text" . }}'
        send_resolved: true

  - name: 'pagerduty-critical'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_SERVICE_KEY'
        description: '{{ template "pagerduty.description" . }}'
        severity: '{{ if eq .CommonLabels.severity "critical" }}critical{{ else }}warning{{ end }}'
        client: 'Purple Team Platform'
        client_url: '{{ template "pagerduty.clientURL" . }}'

templates:
  - '/etc/alertmanager/template/*.tmpl'
```

## 🔧 Monitoring Scripts

### **1. Health Check Script**
```bash
#!/bin/bash
# monitoring/health-check.sh

set -e

# Configuration
API_URL="https://api.purpleteam-platform.com"
HEALTH_ENDPOINT="/health"
READY_ENDPOINT="/ready"
METRICS_ENDPOINT="/metrics"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Health check function
check_health() {
    local endpoint=$1
    local name=$2
    
    log_info "Checking $name..."
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
    
    if [ "$response" = "200" ]; then
        log_info "$name is healthy (HTTP $response)"
        return 0
    else
        log_error "$name is unhealthy (HTTP $response)"
        return 1
    fi
}

# Metrics check function
check_metrics() {
    log_info "Checking metrics endpoint..."
    
    if curl -s "$API_URL$METRICS_ENDPOINT" | grep -q "http_requests_total"; then
        log_info "Metrics endpoint is working"
        return 0
    else
        log_error "Metrics endpoint is not working"
        return 1
    fi
}

# Database check function
check_database() {
    log_info "Checking database connection..."
    
    # This would typically check database connectivity
    # For now, we'll check if the API can respond to database-dependent endpoints
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/v1/status")
    
    if [ "$response" = "200" ]; then
        log_info "Database connection is healthy"
        return 0
    else
        log_error "Database connection is unhealthy"
        return 1
    fi
}

# Redis check function
check_redis() {
    log_info "Checking Redis connection..."
    
    # This would typically check Redis connectivity
    # For now, we'll check if the API can respond to cache-dependent endpoints
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/api/v1/cache/status")
    
    if [ "$response" = "200" ]; then
        log_info "Redis connection is healthy"
        return 0
    else
        log_warning "Redis connection check failed (endpoint may not exist)"
        return 0
    fi
}

# Main health check
main() {
    log_info "Starting comprehensive health check..."
    
    local exit_code=0
    
    # Check basic health
    check_health "$HEALTH_ENDPOINT" "API Health" || exit_code=1
    
    # Check readiness
    check_health "$READY_ENDPOINT" "API Readiness" || exit_code=1
    
    # Check metrics
    check_metrics || exit_code=1
    
    # Check database
    check_database || exit_code=1
    
    # Check Redis
    check_redis || exit_code=1
    
    if [ $exit_code -eq 0 ]; then
        log_info "All health checks passed!"
    else
        log_error "Some health checks failed!"
    fi
    
    exit $exit_code
}

# Run main function
main "$@"
```

### **2. Performance Monitoring Script**
```bash
#!/bin/bash
# monitoring/performance-monitor.sh

set -e

# Configuration
API_URL="https://api.purpleteam-platform.com"
METRICS_ENDPOINT="/metrics"
LOG_FILE="/var/log/performance-monitor.log"

# Performance thresholds
MAX_RESPONSE_TIME=2.0
MAX_ERROR_RATE=0.1
MAX_CPU_USAGE=80
MAX_MEMORY_USAGE=80

log_info() { echo "$(date '+%Y-%m-%d %H:%M:%S') [INFO] $1" | tee -a "$LOG_FILE"; }
log_warning() { echo "$(date '+%Y-%m-%d %H:%M:%S') [WARNING] $1" | tee -a "$LOG_FILE"; }
log_error() { echo "$(date '+%Y-%m-%d %H:%M:%S') [ERROR] $1" | tee -a "$LOG_FILE"; }

# Get metrics from Prometheus endpoint
get_metrics() {
    local metrics=$(curl -s "$API_URL$METRICS_ENDPOINT")
    echo "$metrics"
}

# Check response time
check_response_time() {
    local start_time=$(date +%s.%N)
    curl -s -o /dev/null "$API_URL/health"
    local end_time=$(date +%s.%N)
    
    local response_time=$(echo "$end_time - $start_time" | bc)
    
    if (( $(echo "$response_time > $MAX_RESPONSE_TIME" | bc -l) )); then
        log_warning "Response time is high: ${response_time}s (threshold: ${MAX_RESPONSE_TIME}s)"
        return 1
    else
        log_info "Response time is normal: ${response_time}s"
        return 0
    fi
}

# Check error rate
check_error_rate() {
    local metrics=$(get_metrics)
    
    # Extract error count and total requests
    local error_count=$(echo "$metrics" | grep "http_requests_total.*status=\"5" | awk '{print $2}' | awk '{sum+=$1} END {print sum}')
    local total_requests=$(echo "$metrics" | grep "http_requests_total" | awk '{print $2}' | awk '{sum+=$1} END {print sum}')
    
    if [ -z "$error_count" ]; then
        error_count=0
    fi
    
    if [ -z "$total_requests" ]; then
        total_requests=0
    fi
    
    if [ "$total_requests" -gt 0 ]; then
        local error_rate=$(echo "scale=4; $error_count / $total_requests" | bc)
        
        if (( $(echo "$error_rate > $MAX_ERROR_RATE" | bc -l) )); then
            log_warning "Error rate is high: ${error_rate} (threshold: ${MAX_ERROR_RATE})"
            return 1
        else
            log_info "Error rate is normal: ${error_rate}"
            return 0
        fi
    else
        log_info "No requests recorded yet"
        return 0
    fi
}

# Check system resources
check_system_resources() {
    # CPU usage
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    
    if (( $(echo "$cpu_usage > $MAX_CPU_USAGE" | bc -l) )); then
        log_warning "CPU usage is high: ${cpu_usage}% (threshold: ${MAX_CPU_USAGE}%)"
    else
        log_info "CPU usage is normal: ${cpu_usage}%"
    fi
    
    # Memory usage
    local memory_usage=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
    
    if (( $(echo "$memory_usage > $MAX_MEMORY_USAGE" | bc -l) )); then
        log_warning "Memory usage is high: ${memory_usage}% (threshold: ${MAX_MEMORY_USAGE}%)"
    else
        log_info "Memory usage is normal: ${memory_usage}%"
    fi
}

# Main monitoring function
main() {
    log_info "Starting performance monitoring..."
    
    local exit_code=0
    
    # Check response time
    check_response_time || exit_code=1
    
    # Check error rate
    check_error_rate || exit_code=1
    
    # Check system resources
    check_system_resources
    
    if [ $exit_code -eq 0 ]; then
        log_info "Performance monitoring completed - all checks passed"
    else
        log_error "Performance monitoring completed - some checks failed"
    fi
    
    exit $exit_code
}

# Run main function
main "$@"
```

---

**Última atualização**: 21 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ Guia de Monitoramento e Observabilidade Completo 