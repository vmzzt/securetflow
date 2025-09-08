# Purple Team Platform V4 Master - Deploy em Produção

## 🚀 Visão Geral do Deploy em Produção

Este guia fornece instruções completas para implantar a Purple Team Platform V4 Master em um ambiente de produção enterprise, garantindo alta disponibilidade, segurança e performance.

## 🏗️ Arquitetura de Produção

### **1. Arquitetura de Alta Disponibilidade**
```yaml
Production Architecture:
  Load Balancer:
    - AWS ALB / Azure Application Gateway / GCP Cloud Load Balancer
    - SSL Termination
    - Health Checks
    - Rate Limiting
  
  Application Tier:
    - Auto-scaling groups (2-10 instances)
    - Multi-AZ deployment
    - Health monitoring
    - Blue-green deployments
  
  Database Tier:
    - Primary database (PostgreSQL RDS/Aurora)
    - Read replicas (2-3 instances)
    - Automated backups
    - Point-in-time recovery
  
  Cache Tier:
    - Redis Cluster (ElastiCache)
    - Multi-AZ replication
    - Automatic failover
  
  Storage Tier:
    - S3-compatible object storage
    - Encrypted at rest
    - Lifecycle policies
    - Cross-region replication
```

### **2. Infraestrutura como Código (IaC)**

#### **Terraform Configuration**
```hcl
# main.tf - Infraestrutura principal
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket = "purple-team-terraform-state"
    key    = "production/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Environment = "production"
      Project     = "purple-team-platform"
      ManagedBy   = "terraform"
    }
  }
}

# VPC Configuration
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "purple-team-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  single_nat_gateway = false
  one_nat_gateway_per_az = true
  
  enable_dns_hostnames = true
  enable_dns_support   = true
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "purple-team-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = {
    Name = "purple-team-ecs-cluster"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "purple-team-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = module.vpc.public_subnets
  
  enable_deletion_protection = true
  
  access_logs {
    bucket  = aws_s3_bucket.alb_logs.bucket
    prefix  = "alb-logs"
    enabled = true
  }
  
  tags = {
    Name = "purple-team-alb"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier = "purple-team-postgres"
  
  engine         = "postgres"
  engine_version = "16.1"
  instance_class = "db.r6g.xlarge"
  
  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_type         = "gp3"
  storage_encrypted    = true
  
  db_name  = "purpleteam"
  username = "postgres"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  multi_az               = true
  publicly_accessible    = false
  skip_final_snapshot    = false
  deletion_protection    = true
  
  performance_insights_enabled = true
  monitoring_interval          = 60
  monitoring_role_arn          = aws_iam_role.rds_monitoring.arn
  
  tags = {
    Name = "purple-team-postgres"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "purple-team-redis"
  engine               = "redis"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  
  security_group_ids = [aws_security_group.redis.id]
  subnet_group_name  = aws_elasticache_subnet_group.main.name
  
  tags = {
    Name = "purple-team-redis"
  }
}

# S3 Bucket for Storage
resource "aws_s3_bucket" "storage" {
  bucket = "purple-team-storage-${random_string.bucket_suffix.result}"
  
  tags = {
    Name = "purple-team-storage"
  }
}

resource "aws_s3_bucket_versioning" "storage" {
  bucket = aws_s3_bucket.storage.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "storage" {
  bucket = aws_s3_bucket.storage.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "storage" {
  bucket = aws_s3_bucket.storage.id
  
  rule {
    id     = "transition_to_ia"
    status = "Enabled"
    
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
    
    expiration {
      days = 2555  # 7 years
    }
  }
}
```

#### **Kubernetes Manifests**
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: purple-team
  labels:
    name: purple-team

---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: purple-team-config
  namespace: purple-team
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
  API_VERSION: "v1"

---
# k8s/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: purple-team-secrets
  namespace: purple-team
type: Opaque
data:
  DATABASE_URL: <base64-encoded-db-url>
  REDIS_URL: <base64-encoded-redis-url>
  JWT_SECRET: <base64-encoded-jwt-secret>
  ENCRYPTION_KEY: <base64-encoded-encryption-key>

---
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: purple-team-api
  namespace: purple-team
spec:
  replicas: 3
  selector:
    matchLabels:
      app: purple-team-api
  template:
    metadata:
      labels:
        app: purple-team-api
    spec:
      containers:
      - name: api
        image: purple-team/api:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: purple-team-secrets
              key: DATABASE_URL
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: purple-team-secrets
              key: REDIS_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: purple-team-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: purple-team-api-service
  namespace: purple-team
spec:
  selector:
    app: purple-team-api
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: purple-team-ingress
  namespace: purple-team
  annotations:
    kubernetes.io/ingress.class: "nginx"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.purpleteam-platform.com
    secretName: purple-team-tls
  rules:
  - host: api.purpleteam-platform.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: purple-team-api-service
            port:
              number: 80
```

## 🔐 Configuração de Segurança

### **1. Security Groups e Network ACLs**

#### **AWS Security Groups**
```hcl
# Security Groups
resource "aws_security_group" "alb" {
  name        = "purple-team-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    description = "HTTPS from Internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTP from Internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "purple-team-alb-sg"
  }
}

resource "aws_security_group" "ecs" {
  name        = "purple-team-ecs-sg"
  description = "Security group for ECS tasks"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    description     = "HTTP from ALB"
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "purple-team-ecs-sg"
  }
}

resource "aws_security_group" "rds" {
  name        = "purple-team-rds-sg"
  description = "Security group for RDS PostgreSQL"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    description     = "PostgreSQL from ECS"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = {
    Name = "purple-team-rds-sg"
  }
}
```

### **2. IAM Roles e Políticas**

#### **IAM Configuration**
```hcl
# IAM Roles
resource "aws_iam_role" "ecs_task_execution" {
  name = "purple-team-ecs-task-execution"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task" {
  name = "purple-team-ecs-task"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Custom policy for S3 access
resource "aws_iam_policy" "s3_access" {
  name = "purple-team-s3-access"
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.storage.arn,
          "${aws_s3_bucket.storage.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_s3" {
  role       = aws_iam_role.ecs_task.name
  policy_arn = aws_iam_policy.s3_access.arn
}
```

## 🔄 CI/CD Pipeline

### **1. GitHub Actions Pipeline**

#### **Workflow de Deploy**
```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: purple-team-platform
  ECS_CLUSTER: purple-team-cluster
  ECS_SERVICE: purple-team-api

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Set up Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.11'
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
        pip install -r requirements-dev.txt
    
    - name: Run tests
      run: |
        pytest tests/ --cov=src --cov-report=xml
    
    - name: Run security scan
      run: |
        bandit -r src/ -f json -o bandit-report.json
        safety check --json --output safety-report.json
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2
    
    - name: Build, tag, and push image to Amazon ECR
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
        docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
        docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
        echo "image=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: production
    steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ${{ env.AWS_REGION }}
    
    - name: Download task definition
      run: |
        aws ecs describe-task-definition --task-definition purple-team-api \
          --query taskDefinition > task-definition.json
    
    - name: Fill in the new image ID in the Amazon ECS task definition
      id: task-def
      uses: aws-actions/amazon-ecs-render-task-definition@v2
      with:
        task-definition: task-definition.json
        container-name: api
        image: ${{ needs.build.outputs.image }}
    
    - name: Deploy Amazon ECS task definition
      uses: aws-actions/amazon-ecs-deploy-task-definition@v2
      with:
        task-definition: ${{ steps.task-def.outputs.task-definition }}
        service: ${{ env.ECS_SERVICE }}
        cluster: ${{ env.ECS_CLUSTER }}
        wait-for-service-stability: true
    
    - name: Run database migrations
      run: |
        aws ecs run-task \
          --cluster ${{ env.ECS_CLUSTER }} \
          --task-definition purple-team-migrations \
          --launch-type FARGATE \
          --network-configuration "awsvpcConfiguration={subnets=[subnet-12345,subnet-67890],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
    
    - name: Health check
      run: |
        for i in {1..30}; do
          if curl -f https://api.purpleteam-platform.com/health; then
            echo "Health check passed"
            break
          fi
          echo "Health check failed, retrying in 10 seconds..."
          sleep 10
        done
```

### **2. Docker Multi-Stage Build**

#### **Dockerfile Otimizado**
```dockerfile
# Dockerfile
# Build stage
FROM python:3.11-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production stage
FROM python:3.11-slim

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Copy Python packages from builder
COPY --from=builder /root/.local /home/appuser/.local

# Copy application code
COPY src/ ./src/
COPY alembic.ini .
COPY migrations/ ./migrations/

# Set environment variables
ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONPATH=/app/src

# Change ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📊 Monitoramento e Observabilidade

### **1. CloudWatch Configuration**

#### **Logs e Métricas**
```hcl
# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "api" {
  name              = "/ecs/purple-team-api"
  retention_in_days = 30
  
  tags = {
    Name = "purple-team-api-logs"
  }
}

resource "aws_cloudwatch_log_group" "alb" {
  name              = "/aws/applicationloadbalancer/purple-team-alb"
  retention_in_days = 30
  
  tags = {
    Name = "purple-team-alb-logs"
  }
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
  alarm_description   = "This metric monitors API 5XX errors"
  
  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.api.arn_suffix
  }
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
  alarm_description   = "This metric monitors API response time"
  
  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
    TargetGroup  = aws_lb_target_group.api.arn_suffix
  }
}
```

### **2. Prometheus e Grafana**

#### **Monitoring Stack**
```yaml
# monitoring/prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s
    
    rule_files:
      - "alert_rules.yml"
    
    alerting:
      alertmanagers:
        - static_configs:
            - targets:
              - alertmanager:9093
    
    scrape_configs:
      - job_name: 'purple-team-api'
        static_configs:
          - targets: ['purple-team-api-service:8000']
        metrics_path: '/metrics'
        scrape_interval: 10s
      
      - job_name: 'postgres'
        static_configs:
          - targets: ['postgres-exporter:9187']
      
      - job_name: 'redis'
        static_configs:
          - targets: ['redis-exporter:9121']

---
# monitoring/grafana-dashboard.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboard
  namespace: monitoring
data:
  purple-team-dashboard.json: |
    {
      "dashboard": {
        "title": "Purple Team Platform",
        "panels": [
          {
            "title": "API Response Time",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])",
                "legendFormat": "{{method}} {{endpoint}}"
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
            ]
          }
        ]
      }
    }
```

## 🔒 Backup e Disaster Recovery

### **1. Backup Strategy**

#### **Automated Backups**
```hcl
# RDS Automated Backups
resource "aws_db_instance" "postgres" {
  # ... existing configuration ...
  
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  # Point-in-time recovery
  storage_encrypted = true
  deletion_protection = true
  
  # Performance Insights
  performance_insights_enabled = true
  monitoring_interval          = 60
}

# S3 Lifecycle for backups
resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  
  rule {
    id     = "backup_lifecycle"
    status = "Enabled"
    
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
    
    expiration {
      days = 2555  # 7 years
    }
  }
}
```

### **2. Disaster Recovery Plan**

#### **DR Configuration**
```yaml
# dr/backup-script.sh
#!/bin/bash

# Backup script for disaster recovery
set -e

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_BUCKET="purple-team-backups"
BACKUP_PREFIX="dr-backup"

# Database backup
echo "Creating database backup..."
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | gzip > /tmp/db_backup_${BACKUP_DATE}.sql.gz

# Upload to S3
aws s3 cp /tmp/db_backup_${BACKUP_DATE}.sql.gz s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/database/

# Application backup
echo "Creating application backup..."
tar -czf /tmp/app_backup_${BACKUP_DATE}.tar.gz /app/data/

# Upload to S3
aws s3 cp /tmp/app_backup_${BACKUP_DATE}.tar.gz s3://${BACKUP_BUCKET}/${BACKUP_PREFIX}/application/

# Cleanup
rm /tmp/db_backup_${BACKUP_DATE}.sql.gz
rm /tmp/app_backup_${BACKUP_DATE}.tar.gz

echo "Backup completed: ${BACKUP_DATE}"
```

## 🚀 Deploy Scripts

### **1. Automated Deploy Script**

#### **Deploy Script**
```bash
#!/bin/bash
# deploy-production.sh

set -e

# Configuration
ENVIRONMENT="production"
REGION="us-east-1"
CLUSTER_NAME="purple-team-cluster"
SERVICE_NAME="purple-team-api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Pre-deployment checks
pre_deployment_checks() {
    log_info "Running pre-deployment checks..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found"
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker not found"
        exit 1
    fi
    
    # Check kubectl (if using Kubernetes)
    if ! command -v kubectl &> /dev/null; then
        log_warning "kubectl not found, skipping Kubernetes checks"
    fi
    
    log_info "Pre-deployment checks passed"
}

# Build and push Docker image
build_and_push() {
    log_info "Building Docker image..."
    
    # Build image
    docker build -t purple-team-platform:latest .
    
    # Tag for ECR
    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
    
    docker tag purple-team-platform:latest $ECR_REGISTRY/purple-team-platform:latest
    docker tag purple-team-platform:latest $ECR_REGISTRY/purple-team-platform:$IMAGE_TAG
    
    # Push to ECR
    docker push $ECR_REGISTRY/purple-team-platform:latest
    docker push $ECR_REGISTRY/purple-team-platform:$IMAGE_TAG
    
    log_info "Docker image pushed successfully"
}

# Deploy to ECS
deploy_ecs() {
    log_info "Deploying to ECS..."
    
    # Update ECS service
    aws ecs update-service \
        --cluster $CLUSTER_NAME \
        --service $SERVICE_NAME \
        --force-new-deployment
    
    # Wait for deployment to complete
    log_info "Waiting for deployment to complete..."
    aws ecs wait services-stable \
        --cluster $CLUSTER_NAME \
        --services $SERVICE_NAME
    
    log_info "ECS deployment completed"
}

# Deploy to Kubernetes
deploy_kubernetes() {
    log_info "Deploying to Kubernetes..."
    
    # Apply Kubernetes manifests
    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/secret.yaml
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl apply -f k8s/ingress.yaml
    
    # Wait for deployment
    kubectl rollout status deployment/purple-team-api -n purple-team
    
    log_info "Kubernetes deployment completed"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # Run migrations using Alembic
    alembic upgrade head
    
    log_info "Database migrations completed"
}

# Health checks
health_check() {
    log_info "Running health checks..."
    
    # Wait for service to be ready
    sleep 30
    
    # Check API health
    for i in {1..10}; do
        if curl -f https://api.purpleteam-platform.com/health; then
            log_info "Health check passed"
            return 0
        fi
        log_warning "Health check failed, retrying in 10 seconds..."
        sleep 10
    done
    
    log_error "Health check failed after 10 attempts"
    return 1
}

# Post-deployment tasks
post_deployment() {
    log_info "Running post-deployment tasks..."
    
    # Clear cache
    redis-cli FLUSHALL
    
    # Update DNS if needed
    # aws route53 change-resource-record-sets --hosted-zone-id Z1234567890 --change-batch file://dns-update.json
    
    log_info "Post-deployment tasks completed"
}

# Main deployment function
main() {
    log_info "Starting production deployment..."
    
    # Set variables
    IMAGE_TAG=$(git rev-parse --short HEAD)
    ECR_REGISTRY=$(aws sts get-caller-identity --query Account --output text).dkr.ecr.$REGION.amazonaws.com
    
    # Run deployment steps
    pre_deployment_checks
    build_and_push
    run_migrations
    
    # Deploy based on platform
    if [ "$DEPLOY_PLATFORM" = "kubernetes" ]; then
        deploy_kubernetes
    else
        deploy_ecs
    fi
    
    health_check
    post_deployment
    
    log_info "Production deployment completed successfully!"
}

# Run main function
main "$@"
```

## 📋 Checklist de Deploy

### **1. Pré-Deploy Checklist**
```markdown
## Pré-Deploy Checklist

### Infraestrutura
- [ ] VPC e subnets configuradas
- [ ] Security groups configuradas
- [ ] IAM roles e políticas criadas
- [ ] RDS PostgreSQL configurado
- [ ] ElastiCache Redis configurado
- [ ] S3 buckets criados
- [ ] CloudWatch log groups criados

### Segurança
- [ ] SSL certificates instalados
- [ ] WAF rules configuradas
- [ ] Security groups restritivas
- [ ] IAM least privilege aplicado
- [ ] Encryption at rest habilitado
- [ ] Encryption in transit habilitado

### Monitoramento
- [ ] CloudWatch alarms configurados
- [ ] Prometheus/Grafana configurados
- [ ] Log aggregation configurado
- [ ] Health checks implementados
- [ ] Performance monitoring ativo

### Backup
- [ ] RDS automated backups configurados
- [ ] S3 lifecycle policies configuradas
- [ ] Cross-region replication configurado
- [ ] Backup scripts testados
- [ ] Recovery procedures documentados
```

### **2. Deploy Checklist**
```markdown
## Deploy Checklist

### Build
- [ ] Código testado e aprovado
- [ ] Docker image buildado
- [ ] Image pushed para registry
- [ ] Security scan executado
- [ ] Vulnerabilities corrigidas

### Deploy
- [ ] Database migrations executadas
- [ ] Configurações atualizadas
- [ ] Secrets atualizados
- [ ] Service deployed
- [ ] Health checks passando

### Verificação
- [ ] API endpoints funcionando
- [ ] Database connections ativas
- [ ] Redis connections ativas
- [ ] Logs sendo gerados
- [ ] Métricas sendo coletadas

### Pós-Deploy
- [ ] Cache limpo
- [ ] DNS atualizado
- [ ] Monitoring ativo
- [ ] Alerts configurados
- [ ] Documentação atualizada
```

---

**Última atualização**: 21 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ Guia de Deploy em Produção Completo 