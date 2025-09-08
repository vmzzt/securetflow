# Purple Team Platform V4 Master - Backup e Disaster Recovery

## 🔄 Visão Geral do Backup e DR

Este guia detalha a estratégia completa de backup e disaster recovery para a Purple Team Platform V4 Master, garantindo proteção de dados e continuidade de negócios.

## 🏗️ Estratégia de Backup

### **1. Tipos de Backup**

```yaml
Backup Strategy:
  Database Backups:
    - Automated daily backups (RDS/Aurora)
    - Point-in-time recovery (7 days)
    - Cross-region replication
    - Encrypted storage
  
  Application Backups:
    - Configuration files
    - User data and settings
    - Security configurations
    - Custom scripts and tools
  
  Infrastructure Backups:
    - Terraform state files
    - Kubernetes manifests
    - Docker images
    - SSL certificates
  
  Security Backups:
    - Audit logs
    - Security scan results
    - Vulnerability reports
    - Compliance documentation
```

### **2. Configuração de Backup Automatizado**

#### **RDS Backup Configuration**
```hcl
# RDS Automated Backups
resource "aws_db_instance" "postgres" {
  identifier = "purple-team-postgres"
  
  engine         = "postgres"
  engine_version = "16.1"
  instance_class = "db.r6g.xlarge"
  
  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_type         = "gp3"
  storage_encrypted    = true
  
  # Backup configuration
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  # Point-in-time recovery
  delete_automated_backups = false
  skip_final_snapshot     = false
  final_snapshot_identifier = "purple-team-final-snapshot"
  
  # Multi-AZ for high availability
  multi_az = true
  
  # Performance Insights
  performance_insights_enabled = true
  monitoring_interval          = 60
  
  tags = {
    Name = "purple-team-postgres"
    Backup = "enabled"
  }
}

# S3 Bucket for Backup Storage
resource "aws_s3_bucket" "backups" {
  bucket = "purple-team-backups-${random_string.bucket_suffix.result}"
  
  tags = {
    Name = "purple-team-backups"
    Purpose = "backup-storage"
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Bucket Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Lifecycle Policy
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
    
    transition {
      days          = 365
      storage_class = "DEEP_ARCHIVE"
    }
    
    expiration {
      days = 2555  # 7 years
    }
  }
}

# Cross-Region Replication
resource "aws_s3_bucket" "backups_dr" {
  bucket = "purple-team-backups-dr-${random_string.bucket_suffix.result}"
  provider = aws.dr_region
  
  tags = {
    Name = "purple-team-backups-dr"
    Purpose = "disaster-recovery"
  }
}

resource "aws_s3_bucket_replication_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id
  role   = aws_iam_role.s3_replication.arn
  
  rule {
    id     = "cross_region_replication"
    status = "Enabled"
    
    destination {
      bucket = aws_s3_bucket.backups_dr.arn
      storage_class = "STANDARD"
    }
  }
}
```

## 🔄 Disaster Recovery Plan

### **1. RTO e RPO Objectives**

```yaml
DR Objectives:
  Recovery Time Objective (RTO):
    - Critical systems: 4 hours
    - Non-critical systems: 24 hours
    - Full platform: 48 hours
  
  Recovery Point Objective (RPO):
    - Database: 15 minutes
    - Application data: 1 hour
    - Configuration: 24 hours
    - Documentation: 1 week
```

### **2. DR Infrastructure Setup**

#### **Multi-Region Configuration**
```hcl
# DR Region Provider
provider "aws" {
  alias  = "dr_region"
  region = "us-west-2"
}

# DR VPC
module "vpc_dr" {
  source = "terraform-aws-modules/vpc/aws"
  providers = {
    aws = aws.dr_region
  }
  
  name = "purple-team-vpc-dr"
  cidr = "10.1.0.0/16"
  
  azs             = ["us-west-2a", "us-west-2b", "us-west-2c"]
  private_subnets = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
  public_subnets  = ["10.1.101.0/24", "10.1.102.0/24", "10.1.103.0/24"]
  
  enable_nat_gateway = true
  single_nat_gateway = false
  one_nat_gateway_per_az = true
  
  enable_dns_hostnames = true
  enable_dns_support   = true
}

# DR RDS Instance
resource "aws_db_instance" "postgres_dr" {
  provider = aws.dr_region
  
  identifier = "purple-team-postgres-dr"
  
  engine         = "postgres"
  engine_version = "16.1"
  instance_class = "db.r6g.xlarge"
  
  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_type         = "gp3"
  storage_encrypted    = true
  
  # DR configuration
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  # Point-in-time recovery
  delete_automated_backups = false
  skip_final_snapshot     = false
  
  # Multi-AZ for high availability
  multi_az = true
  
  tags = {
    Name = "purple-team-postgres-dr"
    Environment = "dr"
  }
}
```

## 📋 Scripts de Backup

### **1. Database Backup Script**
```bash
#!/bin/bash
# scripts/backup-database.sh

set -e

# Configuration
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_BUCKET="purple-team-backups"
BACKUP_PREFIX="database"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-purpleteam}"
DB_USER="${DB_USER:-postgres}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Create backup directory
BACKUP_DIR="/tmp/backups/${BACKUP_DATE}"
mkdir -p "$BACKUP_DIR"

# Database backup function
backup_database() {
    log_info "Starting database backup..."
    
    # Create database dump
    pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --verbose --clean --no-owner --no-privileges \
        --file="$BACKUP_DIR/database_backup.sql"
    
    # Compress backup
    gzip "$BACKUP_DIR/database_backup.sql"
    
    log_info "Database backup completed: $BACKUP_DIR/database_backup.sql.gz"
}

# Upload to S3
upload_to_s3() {
    log_info "Uploading backup to S3..."
    
    aws s3 cp "$BACKUP_DIR/database_backup.sql.gz" \
        "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/database_backup_${BACKUP_DATE}.sql.gz"
    
    log_info "Backup uploaded to S3: s3://$BACKUP_BUCKET/$BACKUP_PREFIX/database_backup_${BACKUP_DATE}.sql.gz"
}

# Cleanup old backups
cleanup_old_backups() {
    log_info "Cleaning up old backups..."
    
    # Keep backups for 30 days
    find /tmp/backups -type d -mtime +30 -exec rm -rf {} \; 2>/dev/null || true
    
    log_info "Old backups cleaned up"
}

# Verify backup
verify_backup() {
    log_info "Verifying backup..."
    
    # Download and test backup
    aws s3 cp "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/database_backup_${BACKUP_DATE}.sql.gz" \
        "/tmp/test_backup.sql.gz"
    
    gunzip -t "/tmp/test_backup.sql.gz"
    
    rm "/tmp/test_backup.sql.gz"
    
    log_info "Backup verification completed"
}

# Main backup function
main() {
    log_info "Starting database backup process..."
    
    # Check prerequisites
    if ! command -v pg_dump &> /dev/null; then
        log_error "pg_dump not found"
        exit 1
    fi
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found"
        exit 1
    fi
    
    # Run backup process
    backup_database
    upload_to_s3
    verify_backup
    cleanup_old_backups
    
    log_info "Database backup process completed successfully!"
}

# Run main function
main "$@"
```

### **2. Application Backup Script**
```bash
#!/bin/bash
# scripts/backup-application.sh

set -e

# Configuration
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_BUCKET="purple-team-backups"
BACKUP_PREFIX="application"
APP_DIR="/app"
CONFIG_DIR="/etc/purple-team"

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Create backup directory
BACKUP_DIR="/tmp/backups/app_${BACKUP_DATE}"
mkdir -p "$BACKUP_DIR"

# Backup application data
backup_application_data() {
    log_info "Backing up application data..."
    
    # Backup configuration files
    if [ -d "$CONFIG_DIR" ]; then
        tar -czf "$BACKUP_DIR/config_backup.tar.gz" -C "$CONFIG_DIR" .
        log_info "Configuration backup created: $BACKUP_DIR/config_backup.tar.gz"
    fi
    
    # Backup application files
    if [ -d "$APP_DIR" ]; then
        tar -czf "$BACKUP_DIR/app_backup.tar.gz" \
            --exclude='*.log' \
            --exclude='*.tmp' \
            --exclude='node_modules' \
            -C "$APP_DIR" .
        log_info "Application backup created: $BACKUP_DIR/app_backup.tar.gz"
    fi
    
    # Backup logs (last 7 days)
    if [ -d "/var/log/purple-team" ]; then
        find /var/log/purple-team -name "*.log" -mtime -7 -exec tar -czf "$BACKUP_DIR/logs_backup.tar.gz" {} \;
        log_info "Logs backup created: $BACKUP_DIR/logs_backup.tar.gz"
    fi
}

# Upload to S3
upload_to_s3() {
    log_info "Uploading application backup to S3..."
    
    for backup_file in "$BACKUP_DIR"/*.tar.gz; do
        if [ -f "$backup_file" ]; then
            filename=$(basename "$backup_file")
            aws s3 cp "$backup_file" "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/$filename"
            log_info "Uploaded: $filename"
        fi
    done
}

# Main backup function
main() {
    log_info "Starting application backup process..."
    
    backup_application_data
    upload_to_s3
    
    log_info "Application backup process completed successfully!"
}

# Run main function
main "$@"
```

## 🔄 Scripts de Recovery

### **1. Database Recovery Script**
```bash
#!/bin/bash
# scripts/recover-database.sh

set -e

# Configuration
BACKUP_BUCKET="purple-team-backups"
BACKUP_PREFIX="database"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-purpleteam}"
DB_USER="${DB_USER:-postgres}"

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to list available backups
list_backups() {
    log_info "Available backups:"
    aws s3 ls "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/" | grep "database_backup_" | sort -r
}

# Function to download backup
download_backup() {
    local backup_file="$1"
    local local_file="/tmp/$(basename "$backup_file")"
    
    log_info "Downloading backup: $backup_file"
    aws s3 cp "s3://$BACKUP_BUCKET/$BACKUP_PREFIX/$backup_file" "$local_file"
    
    echo "$local_file"
}

# Function to restore database
restore_database() {
    local backup_file="$1"
    
    log_info "Starting database restoration..."
    
    # Stop application if running
    log_warning "Stopping application..."
    systemctl stop purple-team-api || true
    
    # Drop and recreate database
    log_info "Recreating database..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"
    
    # Restore from backup
    log_info "Restoring from backup..."
    gunzip -c "$backup_file" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"
    
    # Start application
    log_info "Starting application..."
    systemctl start purple-team-api || true
    
    log_info "Database restoration completed!"
}

# Main recovery function
main() {
    if [ $# -eq 0 ]; then
        log_error "Usage: $0 <backup_filename>"
        log_info "Available backups:"
        list_backups
        exit 1
    fi
    
    local backup_file="$1"
    
    log_info "Starting database recovery process..."
    
    # Check prerequisites
    if ! command -v psql &> /dev/null; then
        log_error "psql not found"
        exit 1
    fi
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not found"
        exit 1
    fi
    
    # Download and restore
    local local_backup=$(download_backup "$backup_file")
    restore_database "$local_backup"
    
    # Cleanup
    rm -f "$local_backup"
    
    log_info "Database recovery process completed successfully!"
}

# Run main function
main "$@"
```

### **2. Full System Recovery Script**
```bash
#!/bin/bash
# scripts/disaster-recovery.sh

set -e

# Configuration
PRIMARY_REGION="us-east-1"
DR_REGION="us-west-2"
BACKUP_BUCKET="purple-team-backups"
CLUSTER_NAME="purple-team-cluster"

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to check primary region health
check_primary_health() {
    log_info "Checking primary region health..."
    
    # Check if primary region is accessible
    if aws ec2 describe-regions --region-names "$PRIMARY_REGION" &>/dev/null; then
        log_info "Primary region is accessible"
        return 0
    else
        log_error "Primary region is not accessible"
        return 1
    fi
}

# Function to initiate DR failover
initiate_failover() {
    log_warning "Initiating disaster recovery failover..."
    
    # Update DNS to point to DR region
    log_info "Updating DNS records..."
    # aws route53 change-resource-record-sets --hosted-zone-id Z1234567890 --change-batch file://dns-failover.json
    
    # Scale up DR resources
    log_info "Scaling up DR resources..."
    aws ecs update-service --cluster "$CLUSTER_NAME" --service purple-team-api --desired-count 3 --region "$DR_REGION"
    
    # Verify DR environment
    log_info "Verifying DR environment..."
    sleep 30
    
    # Health check DR environment
    if curl -f https://api-dr.purpleteam-platform.com/health; then
        log_info "DR environment is healthy"
    else
        log_error "DR environment health check failed"
        exit 1
    fi
}

# Function to restore from backup
restore_from_backup() {
    local backup_date="$1"
    
    log_info "Restoring from backup: $backup_date"
    
    # Restore database
    log_info "Restoring database..."
    ./scripts/recover-database.sh "database_backup_${backup_date}.sql.gz"
    
    # Restore application data
    log_info "Restoring application data..."
    aws s3 cp "s3://$BACKUP_BUCKET/application/config_backup_${backup_date}.tar.gz" /tmp/
    tar -xzf "/tmp/config_backup_${backup_date}.tar.gz" -C /etc/purple-team/
    
    # Restart services
    log_info "Restarting services..."
    systemctl restart purple-team-api
    systemctl restart purple-team-worker
    
    log_info "Restoration completed"
}

# Function to test DR environment
test_dr_environment() {
    log_info "Testing DR environment..."
    
    # Run health checks
    curl -f https://api-dr.purpleteam-platform.com/health
    curl -f https://api-dr.purpleteam-platform.com/ready
    
    # Run basic functionality tests
    curl -f https://api-dr.purpleteam-platform.com/api/v1/status
    
    log_info "DR environment tests passed"
}

# Main DR function
main() {
    log_info "Starting disaster recovery process..."
    
    # Check if primary region is down
    if check_primary_health; then
        log_warning "Primary region is healthy. Are you sure you want to initiate DR?"
        read -p "Continue with DR? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "DR process cancelled"
            exit 0
        fi
    fi
    
    # Initiate failover
    initiate_failover
    
    # Restore from latest backup if needed
    if [ $# -eq 1 ]; then
        restore_from_backup "$1"
    fi
    
    # Test DR environment
    test_dr_environment
    
    log_info "Disaster recovery process completed successfully!"
}

# Run main function
main "$@"
```

## 📋 Checklist de DR

### **1. Pré-DR Checklist**
```markdown
## Pré-DR Checklist

### Infraestrutura
- [ ] DR region configurada
- [ ] VPC e subnets criadas
- [ ] Security groups configuradas
- [ ] IAM roles e políticas criadas
- [ ] RDS DR instance configurado
- [ ] S3 buckets replicados
- [ ] DNS failover configurado

### Backup
- [ ] Backups automatizados funcionando
- [ ] Cross-region replication ativo
- [ ] Backup verification scripts testados
- [ ] Recovery procedures documentados
- [ ] Backup retention policies configuradas

### Monitoramento
- [ ] DR environment monitoring ativo
- [ ] Health checks configurados
- [ ] Alerting para DR events
- [ ] Performance monitoring
- [ ] Log aggregation

### Testes
- [ ] DR failover testado
- [ ] Backup restoration testado
- [ ] Performance baseline estabelecido
- [ ] RTO/RPO validados
- [ ] Team training realizado
```

### **2. DR Execution Checklist**
```markdown
## DR Execution Checklist

### Failover
- [ ] Primary region status confirmado
- [ ] DR team notificado
- [ ] DNS failover executado
- [ ] DR resources escalados
- [ ] Health checks executados

### Restoration
- [ ] Latest backup identificado
- [ ] Database restoration executado
- [ ] Application data restoration
- [ ] Configuration restoration
- [ ] Services restarted

### Verification
- [ ] DR environment health verified
- [ ] Application functionality tested
- [ ] Performance baseline checked
- [ ] Security controls verified
- [ ] Monitoring confirmed

### Communication
- [ ] Stakeholders notified
- [ ] Status updates sent
- [ ] Timeline communicated
- [ ] Recovery progress tracked
- [ ] Documentation updated
```

---

**Última atualização**: 21 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ Guia de Backup e Disaster Recovery Completo 