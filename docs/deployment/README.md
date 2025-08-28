# 🚀 Securet Flow SSC - Deployment Documentation

## 🌐 Visão Geral de Deployment

Este guia abrange todas as estratégias de deployment do **Securet Flow SSC**, desde desenvolvimento local até produção enterprise, incluindo monitoramento, backup e disaster recovery.

## 🎯 Estratégias de Deployment

### **Ambientes Suportados**
```yaml
Deployment Environments:
  Development:
    - Local Docker Compose
    - Hot reload para desenvolvimento
    - Dados de teste
    
  Staging:
    - Kubernetes cluster
    - Dados de teste realistas
    - Testes de integração
    
  Production:
    - Kubernetes multi-cluster
    - Alta disponibilidade
    - Monitoramento completo
    - Backup automatizado
```

## 🐳 Docker Deployment

### **Docker Compose (Desenvolvimento)**
```yaml
# docker-compose.yml
version: '3.8'

services:
  # API Gateway
  api-gateway:
    image: kong/kong-gateway:3.4
    container_name: securet-api-gateway
    environment:
      KONG_DATABASE: "off"
      KONG_DECLARATIVE_CONFIG: /kong/declarative/kong.yml
      KONG_ADMIN_LISTEN: 0.0.0.0:8001
    ports:
      - "8000:8000"
      - "8001:8001"
    volumes:
      - ./configs/kong:/kong/declarative
    networks:
      - securet-network

  # Backend Services
  backend:
    build: ./src/backend
    container_name: securet-backend
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/securet_flow
      - REDIS_URL=redis://redis:6379
      - SECRET_KEY=${SECRET_KEY}
    ports:
      - "8002:8000"
    depends_on:
      - postgres
      - redis
    networks:
      - securet-network

  # Frontend
  frontend:
    build: ./src/frontend
    container_name: securet-frontend
    ports:
      - "3000:80"
    depends_on:
      - api-gateway
    networks:
      - securet-network

  # Database
  postgres:
    image: postgres:16-alpine
    container_name: securet-postgres
    environment:
      POSTGRES_DB: securet_flow
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - securet-network

  # Cache
  redis:
    image: redis:7-alpine
    container_name: securet-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - securet-network

  # Search
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: securet-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - ES_JAVA_OPTS=-Xms2g -Xmx2g
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - securet-network

  # Monitoring
  prometheus:
    image: prom/prometheus:latest
    container_name: securet-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./configs/prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    networks:
      - securet-network

  grafana:
    image: grafana/grafana:latest
    container_name: securet-grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - securet-network

  # AI Services
  ollama:
    image: ollama/ollama:latest
    container_name: securet-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    networks:
      - securet-network

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:
  prometheus_data:
  grafana_data:
  ollama_data:

networks:
  securet-network:
    driver: bridge
```

### **Docker Production**
```dockerfile
# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image
FROM nginx:alpine AS runner
WORKDIR /app

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

## ☸️ Kubernetes Deployment

### **Namespace e Configurações**
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: securet-flow
  labels:
    name: securet-flow
    environment: production
```

### **ConfigMaps e Secrets**
```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: securet-config
  namespace: securet-flow
data:
  DATABASE_URL: "postgresql://postgres:password@postgres:5432/securet_flow"
  REDIS_URL: "redis://redis:6379"
  ELASTICSEARCH_URL: "http://elasticsearch:9200"
  API_HOST: "0.0.0.0"
  API_PORT: "8000"
  DEBUG: "false"
  LOG_LEVEL: "info"
```

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: securet-secrets
  namespace: securet-flow
type: Opaque
data:
  SECRET_KEY: <base64-encoded-secret>
  JWT_SECRET: <base64-encoded-jwt-secret>
  POSTGRES_PASSWORD: <base64-encoded-password>
  REDIS_PASSWORD: <base64-encoded-redis-password>
  GRAFANA_PASSWORD: <base64-encoded-grafana-password>
```

### **Deployments**
```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: securet-backend
  namespace: securet-flow
spec:
  replicas: 3
  selector:
    matchLabels:
      app: securet-backend
  template:
    metadata:
      labels:
        app: securet-backend
    spec:
      containers:
      - name: backend
        image: securet-flow/backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            configMapKeyRef:
              name: securet-config
              key: DATABASE_URL
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: securet-secrets
              key: SECRET_KEY
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
```

```yaml
# frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: securet-frontend
  namespace: securet-flow
spec:
  replicas: 2
  selector:
    matchLabels:
      app: securet-frontend
  template:
    metadata:
      labels:
        app: securet-frontend
    spec:
      containers:
      - name: frontend
        image: securet-flow/frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
```

### **Services**
```yaml
# services.yaml
apiVersion: v1
kind: Service
metadata:
  name: securet-backend-service
  namespace: securet-flow
spec:
  selector:
    app: securet-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP
---
apiVersion: v1
kind: Service
metadata:
  name: securet-frontend-service
  namespace: securet-flow
spec:
  selector:
    app: securet-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: ClusterIP
```

### **Ingress**
```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: securet-ingress
  namespace: securet-flow
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.securet-flow.com
    - app.securet-flow.com
    secretName: securet-tls
  rules:
  - host: api.securet-flow.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: securet-backend-service
            port:
              number: 80
  - host: app.securet-flow.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: securet-frontend-service
            port:
              number: 80
```

## 📊 Monitoramento e Observabilidade

### **Prometheus Configuration**
```yaml
# prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: securet-flow
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
      - job_name: 'securet-backend'
        static_configs:
          - targets: ['securet-backend-service:80']
        metrics_path: '/metrics'
        scrape_interval: 30s

      - job_name: 'securet-frontend'
        static_configs:
          - targets: ['securet-frontend-service:80']
        metrics_path: '/metrics'
        scrape_interval: 30s

      - job_name: 'postgres'
        static_configs:
          - targets: ['postgres-service:5432']
        scrape_interval: 60s

      - job_name: 'redis'
        static_configs:
          - targets: ['redis-service:6379']
        scrape_interval: 60s
```

### **Grafana Dashboards**
```yaml
# grafana-dashboard.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: grafana-dashboards
  namespace: securet-flow
data:
  securet-dashboard.json: |
    {
      "dashboard": {
        "title": "Securet Flow SSC Dashboard",
        "panels": [
          {
            "title": "API Requests",
            "type": "graph",
            "targets": [
              {
                "expr": "rate(securet_requests_total[5m])",
                "legendFormat": "{{method}} {{endpoint}}"
              }
            ]
          },
          {
            "title": "Active Scans",
            "type": "stat",
            "targets": [
              {
                "expr": "securet_active_scans",
                "legendFormat": "Active Scans"
              }
            ]
          },
          {
            "title": "Vulnerabilities Found",
            "type": "graph",
            "targets": [
              {
                "expr": "securet_vulnerabilities_total",
                "legendFormat": "{{severity}}"
              }
            ]
          }
        ]
      }
    }
```

## 🔄 CI/CD Pipeline

### **GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

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
        cd src/backend
        pip install -r requirements.txt
    
    - name: Run tests
      run: |
        cd src/backend
        pytest tests/ -v --cov=app
    
    - name: Set up Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install frontend dependencies
      run: |
        cd src/frontend
        npm ci
    
    - name: Run frontend tests
      run: |
        cd src/frontend
        npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Build and push Backend
      uses: docker/build-push-action@v5
      with:
        context: ./src/backend
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/backend:${{ github.sha }}
    
    - name: Build and push Frontend
      uses: docker/build-push-action@v5
      with:
        context: ./src/frontend
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Update kubeconfig
      run: aws eks update-kubeconfig --name securet-flow-cluster
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/securet-backend backend=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/backend:${{ github.sha }} -n securet-flow
        kubectl set image deployment/securet-frontend frontend=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend:${{ github.sha }} -n securet-flow
        kubectl rollout status deployment/securet-backend -n securet-flow
        kubectl rollout status deployment/securet-frontend -n securet-flow
```

## 🔐 Segurança

### **Network Policies**
```yaml
# network-policies.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: securet-network-policy
  namespace: securet-flow
spec:
  podSelector:
    matchLabels:
      app: securet-backend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: securet-flow
    ports:
    - protocol: TCP
      port: 8000
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          name: securet-flow
    ports:
    - protocol: TCP
      port: 5432
    - protocol: TCP
      port: 6379
    - protocol: TCP
      port: 9200
```

### **Pod Security Standards**
```yaml
# pod-security.yaml
apiVersion: v1
kind: Pod
metadata:
  name: securet-backend-pod
  namespace: securet-flow
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
    runAsGroup: 1000
    fsGroup: 1000
  containers:
  - name: backend
    image: securet-flow/backend:latest
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true
      capabilities:
        drop:
        - ALL
    volumeMounts:
    - name: tmp
      mountPath: /tmp
    - name: logs
      mountPath: /app/logs
  volumes:
  - name: tmp
    emptyDir: {}
  - name: logs
    emptyDir: {}
```

## 📋 Scripts de Deploy

### **Deploy Script**
```bash
#!/bin/bash
# deploy.sh

set -e

# Configuration
NAMESPACE="securet-flow"
REGISTRY="ghcr.io/securet-flow"
VERSION="${1:-latest}"

echo "🚀 Deploying Securet Flow SSC v${VERSION}"

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl not found"
    exit 1
fi

# Check if namespace exists
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
    echo "📦 Creating namespace $NAMESPACE"
    kubectl create namespace $NAMESPACE
fi

# Apply configurations
echo "⚙️ Applying configurations..."
kubectl apply -f k8s/configmap.yaml -n $NAMESPACE
kubectl apply -f k8s/secret.yaml -n $NAMESPACE

# Deploy services
echo "🔧 Deploying services..."
kubectl apply -f k8s/deployments/ -n $NAMESPACE
kubectl apply -f k8s/services/ -n $NAMESPACE

# Deploy ingress
echo "🌐 Deploying ingress..."
kubectl apply -f k8s/ingress.yaml -n $NAMESPACE

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl rollout status deployment/securet-backend -n $NAMESPACE
kubectl rollout status deployment/securet-frontend -n $NAMESPACE

# Check services
echo "🔍 Checking services..."
kubectl get pods -n $NAMESPACE
kubectl get services -n $NAMESPACE

echo "✅ Deployment completed successfully!"
echo "🌐 Access URLs:"
echo "   Frontend: https://app.securet-flow.com"
echo "   API: https://api.securet-flow.com"
echo "   Grafana: https://monitoring.securet-flow.com"
```

### **Rollback Script**
```bash
#!/bin/bash
# rollback.sh

set -e

NAMESPACE="securet-flow"
PREVIOUS_VERSION="${1}"

if [ -z "$PREVIOUS_VERSION" ]; then
    echo "❌ Please provide the previous version to rollback to"
    exit 1
fi

echo "🔄 Rolling back to version $PREVIOUS_VERSION"

# Rollback deployments
kubectl rollout undo deployment/securet-backend -n $NAMESPACE --to-revision=$PREVIOUS_VERSION
kubectl rollout undo deployment/securet-frontend -n $NAMESPACE --to-revision=$PREVIOUS_VERSION

# Wait for rollback
kubectl rollout status deployment/securet-backend -n $NAMESPACE
kubectl rollout status deployment/securet-frontend -n $NAMESPACE

echo "✅ Rollback completed successfully!"
```

## 📚 Documentação Adicional

### **Links Úteis**
- [📖 Guia de Instalação](installation-guide.md)
- [🏭 Deploy em Produção](production-deploy.md)
- [📊 Monitoramento](monitoring-observability.md)
- [🔄 Backup e DR](backup-disaster-recovery.md)

### **Ferramentas**
- [🐳 Docker](https://docs.docker.com/)
- [☸️ Kubernetes](https://kubernetes.io/docs/)
- [📊 Prometheus](https://prometheus.io/docs/)
- [📈 Grafana](https://grafana.com/docs/)

---

**Última atualização**: 27 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ **Documentação de Deployment Completa** 