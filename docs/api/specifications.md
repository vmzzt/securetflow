# Purple Team Platform V4 Master - API Specifications

## 🌐 Visão Geral da API

A Purple Team Platform V4 Master oferece uma API RESTful completa e bem documentada, seguindo os padrões OpenAPI 3.0. A API é projetada para ser escalável, segura e fácil de integrar.

## 📋 Informações da API

```yaml
API Information:
  Title: Purple Team Platform V4 Master API
  Version: 4.0.0-master
  Description: Enterprise Security Testing Platform API
  Base URL: https://api.purpleteam-platform.com
  Protocol: HTTPS
  Content Type: application/json
  Authentication: JWT Bearer Token
```

## 🔐 Autenticação e Autorização

### **JWT Token Authentication**
```http
Authorization: Bearer <jwt_token>
```

### **Token Structure**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": "123",
    "username": "admin",
    "email": "admin@purpleteam.local",
    "roles": ["admin", "security_analyst"],
    "permissions": [
      "read:targets",
      "write:targets",
      "read:scans",
      "write:scans",
      "read:vulnerabilities",
      "write:reports"
    ],
    "exp": 1640995200,
    "iat": 1640908800
  }
}
```

### **OAuth2 Integration**
```yaml
OAuth2 Providers:
  - Google OAuth2
  - Microsoft Azure AD
  - Okta
  - Custom OAuth2 Provider
```

## 📊 Endpoints da API

### **1. Authentication Endpoints**

#### **POST /api/v1/auth/login**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "123",
    "username": "admin",
    "email": "admin@purpleteam.local",
    "roles": ["admin"],
    "permissions": ["read:targets", "write:targets"]
  }
}
```

#### **POST /api/v1/auth/refresh**
```http
POST /api/v1/auth/refresh
Authorization: Bearer <refresh_token>
```

#### **POST /api/v1/auth/logout**
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

### **2. Target Management Endpoints**

#### **GET /api/v1/targets**
```http
GET /api/v1/targets?page=1&limit=20&category=web&status=active
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "target_123",
      "name": "example.com",
      "type": "web",
      "url": "https://example.com",
      "category": "production",
      "status": "active",
      "risk_score": 85,
      "tags": ["critical", "external"],
      "business_unit": "IT",
      "compliance": ["ISO27001", "PCI-DSS"],
      "created_at": "2025-08-21T10:30:00Z",
      "updated_at": "2025-08-21T15:45:00Z",
      "last_scan": "2025-08-21T14:00:00Z",
      "vulnerability_count": {
        "critical": 3,
        "high": 7,
        "medium": 12,
        "low": 25
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### **POST /api/v1/targets**
```http
POST /api/v1/targets
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "new-target.com",
  "type": "web",
  "url": "https://new-target.com",
  "category": "development",
  "tags": ["test", "internal"],
  "business_unit": "Development",
  "compliance": ["ISO27001"],
  "description": "New web application target"
}
```

#### **GET /api/v1/targets/{target_id}**
```http
GET /api/v1/targets/target_123
Authorization: Bearer <access_token>
```

#### **PUT /api/v1/targets/{target_id}**
```http
PUT /api/v1/targets/target_123
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "updated-target.com",
  "risk_score": 90,
  "status": "inactive"
}
```

#### **DELETE /api/v1/targets/{target_id}**
```http
DELETE /api/v1/targets/target_123
Authorization: Bearer <access_token>
```

### **3. Scan Management Endpoints**

#### **GET /api/v1/scans**
```http
GET /api/v1/scans?status=running&target_id=target_123&page=1&limit=20
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "scan_456",
      "target_id": "target_123",
      "target_name": "example.com",
      "scan_type": "vulnerability",
      "status": "running",
      "progress": 65,
      "tools": ["nuclei", "zap", "sqlmap"],
      "started_at": "2025-08-21T14:00:00Z",
      "estimated_completion": "2025-08-21T15:30:00Z",
      "created_by": "admin",
      "priority": "high",
      "results_summary": {
        "vulnerabilities_found": 15,
        "critical": 3,
        "high": 7,
        "medium": 5
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

#### **POST /api/v1/scans**
```http
POST /api/v1/scans
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "target_id": "target_123",
  "scan_type": "vulnerability",
  "tools": ["nuclei", "zap"],
  "priority": "high",
  "scheduled_at": "2025-08-21T16:00:00Z",
  "options": {
    "aggressive": false,
    "stealth": true,
    "custom_headers": {
      "User-Agent": "PurpleTeam Scanner"
    }
  }
}
```

#### **GET /api/v1/scans/{scan_id}**
```http
GET /api/v1/scans/scan_456
Authorization: Bearer <access_token>
```

#### **PUT /api/v1/scans/{scan_id}/pause**
```http
PUT /api/v1/scans/scan_456/pause
Authorization: Bearer <access_token>
```

#### **PUT /api/v1/scans/{scan_id}/resume**
```http
PUT /api/v1/scans/scan_456/resume
Authorization: Bearer <access_token>
```

#### **DELETE /api/v1/scans/{scan_id}**
```http
DELETE /api/v1/scans/scan_456
Authorization: Bearer <access_token>
```

### **4. Vulnerability Management Endpoints**

#### **GET /api/v1/vulnerabilities**
```http
GET /api/v1/vulnerabilities?severity=critical&target_id=target_123&status=new
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "vuln_789",
      "scan_id": "scan_456",
      "target_id": "target_123",
      "target_name": "example.com",
      "severity": "critical",
      "title": "SQL Injection",
      "description": "SQL injection vulnerability detected in login endpoint",
      "location": "https://example.com/login",
      "tool_detected": "sqlmap",
      "cvss_score": 9.8,
      "cvss_vector": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
      "status": "new",
      "false_positive": false,
      "verified": false,
      "remediation": "Use parameterized queries and input validation",
      "references": [
        "https://owasp.org/www-community/attacks/SQL_Injection"
      ],
      "created_at": "2025-08-21T15:30:00Z",
      "updated_at": "2025-08-21T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### **GET /api/v1/vulnerabilities/{vulnerability_id}**
```http
GET /api/v1/vulnerabilities/vuln_789
Authorization: Bearer <access_token>
```

#### **PUT /api/v1/vulnerabilities/{vulnerability_id}**
```http
PUT /api/v1/vulnerabilities/vuln_789
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "fixed",
  "notes": "Vulnerability has been patched",
  "false_positive": false,
  "verified": true
}
```

#### **POST /api/v1/vulnerabilities/{vulnerability_id}/verify**
```http
POST /api/v1/vulnerabilities/vuln_789/verify
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "verified": true,
  "verification_notes": "Manually verified the vulnerability"
}
```

### **5. Report Management Endpoints**

#### **GET /api/v1/reports**
```http
GET /api/v1/reports?type=executive&target_id=target_123&date_from=2025-08-01
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "report_101",
      "title": "Security Assessment - example.com",
      "type": "executive",
      "target_id": "target_123",
      "target_name": "example.com",
      "generated_by": "admin",
      "status": "completed",
      "format": "pdf",
      "file_size": "2.5MB",
      "download_url": "https://api.purpleteam-platform.com/reports/report_101/download",
      "summary": {
        "total_vulnerabilities": 25,
        "critical": 3,
        "high": 7,
        "medium": 10,
        "low": 5,
        "risk_score": 85
      },
      "created_at": "2025-08-21T16:00:00Z",
      "expires_at": "2025-09-21T16:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 30,
    "pages": 2
  }
}
```

#### **POST /api/v1/reports**
```http
POST /api/v1/reports
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Security Assessment Report",
  "type": "executive",
  "target_id": "target_123",
  "format": "pdf",
  "include_sections": [
    "executive_summary",
    "vulnerabilities",
    "recommendations",
    "compliance"
  ],
  "custom_template": "enterprise_template",
  "scheduled_at": "2025-08-22T09:00:00Z"
}
```

#### **GET /api/v1/reports/{report_id}**
```http
GET /api/v1/reports/report_101
Authorization: Bearer <access_token>
```

#### **GET /api/v1/reports/{report_id}/download**
```http
GET /api/v1/reports/report_101/download
Authorization: Bearer <access_token>
```

### **6. Analytics Endpoints**

#### **GET /api/v1/analytics/dashboard**
```http
GET /api/v1/analytics/dashboard?period=30d
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "metrics": {
    "total_targets": 150,
    "active_scans": 8,
    "total_vulnerabilities": 1250,
    "critical_vulnerabilities": 45,
    "scan_success_rate": 96.5,
    "average_scan_duration": "25m 30s"
  },
  "trends": {
    "vulnerabilities_by_day": [
      {"date": "2025-08-15", "count": 15},
      {"date": "2025-08-16", "count": 12},
      {"date": "2025-08-17", "count": 18}
    ],
    "scans_by_type": [
      {"type": "vulnerability", "count": 45},
      {"type": "port", "count": 30},
      {"type": "web", "count": 25}
    ]
  },
  "top_targets": [
    {
      "id": "target_123",
      "name": "example.com",
      "risk_score": 95,
      "vulnerability_count": 25
    }
  ]
}
```

#### **GET /api/v1/analytics/vulnerabilities/trends**
```http
GET /api/v1/analytics/vulnerabilities/trends?period=90d&severity=critical
Authorization: Bearer <access_token>
```

#### **GET /api/v1/analytics/performance/scans**
```http
GET /api/v1/analytics/performance/scans?period=30d&tool=nuclei
Authorization: Bearer <access_token>
```

### **7. AI Analysis Endpoints**

#### **POST /api/v1/ai/analyze**
```http
POST /api/v1/ai/analyze
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "analysis_type": "vulnerability_pattern",
  "target_id": "target_123",
  "data": {
    "vulnerabilities": [...],
    "scan_results": {...}
  },
  "options": {
    "model": "llama3.1",
    "confidence_threshold": 0.8
  }
}
```

**Response:**
```json
{
  "analysis_id": "analysis_202",
  "status": "completed",
  "results": {
    "patterns_detected": [
      {
        "pattern": "SQL Injection Cluster",
        "confidence": 0.95,
        "affected_endpoints": ["/login", "/search", "/admin"],
        "recommendation": "Implement input validation and parameterized queries"
      }
    ],
    "risk_assessment": {
      "overall_risk": "high",
      "risk_factors": ["multiple_critical_vulns", "external_exposure"],
      "mitigation_priority": "immediate"
    },
    "ai_insights": [
      "Pattern suggests systematic input validation issues",
      "Recommend implementing WAF for immediate protection"
    ]
  },
  "created_at": "2025-08-21T16:30:00Z"
}
```

#### **GET /api/v1/ai/insights**
```http
GET /api/v1/ai/insights?target_id=target_123&type=recommendations
Authorization: Bearer <access_token>
```

### **8. Integration Endpoints**

#### **GET /api/v1/integrations**
```http
GET /api/v1/integrations
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": "integration_301",
      "name": "GitHub",
      "type": "version_control",
      "status": "connected",
      "config": {
        "webhook_url": "https://api.purpleteam-platform.com/webhooks/github",
        "repositories": ["org/repo1", "org/repo2"]
      },
      "last_sync": "2025-08-21T16:00:00Z",
      "sync_status": "success"
    },
    {
      "id": "integration_302",
      "name": "Slack",
      "type": "notification",
      "status": "connected",
      "config": {
        "webhook_url": "https://hooks.slack.com/services/...",
        "channels": ["#security", "#alerts"]
      },
      "last_notification": "2025-08-21T15:45:00Z"
    }
  ]
}
```

#### **POST /api/v1/integrations**
```http
POST /api/v1/integrations
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Discord",
  "type": "notification",
  "config": {
    "webhook_url": "https://discord.com/api/webhooks/...",
    "channel_id": "123456789",
    "notifications": ["critical_vulns", "scan_complete"]
  }
}
```

### **9. Webhook Endpoints**

#### **POST /api/v1/webhooks/github**
```http
POST /api/v1/webhooks/github
Content-Type: application/json
X-GitHub-Event: push

{
  "ref": "refs/heads/main",
  "repository": {
    "name": "webapp",
    "full_name": "company/webapp"
  },
  "commits": [
    {
      "id": "abc123",
      "message": "Update security headers"
    }
  ]
}
```

#### **POST /api/v1/webhooks/slack**
```http
POST /api/v1/webhooks/slack
Content-Type: application/json

{
  "text": "Critical vulnerability detected on example.com",
  "attachments": [
    {
      "title": "SQL Injection",
      "text": "Critical vulnerability found in login endpoint",
      "color": "danger"
    }
  ]
}
```

## 📊 Status Codes e Error Handling

### **Success Status Codes**
```yaml
200: OK - Request successful
201: Created - Resource created successfully
202: Accepted - Request accepted for processing
204: No Content - Request successful, no content to return
```

### **Client Error Status Codes**
```yaml
400: Bad Request - Invalid request syntax
401: Unauthorized - Authentication required
403: Forbidden - Insufficient permissions
404: Not Found - Resource not found
409: Conflict - Resource conflict
422: Unprocessable Entity - Validation error
429: Too Many Requests - Rate limit exceeded
```

### **Server Error Status Codes**
```yaml
500: Internal Server Error - Unexpected server error
502: Bad Gateway - Upstream service error
503: Service Unavailable - Service temporarily unavailable
504: Gateway Timeout - Upstream service timeout
```

### **Error Response Format**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2025-08-21T16:45:00Z",
    "request_id": "req_123456"
  }
}
```

## 🔄 Rate Limiting

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

### **Rate Limit Rules**
```yaml
Authentication Endpoints:
  - /api/v1/auth/login: 5 requests per minute
  - /api/v1/auth/refresh: 10 requests per minute

API Endpoints:
  - GET requests: 1000 requests per hour
  - POST requests: 100 requests per hour
  - PUT/DELETE requests: 50 requests per hour

Scan Endpoints:
  - POST /api/v1/scans: 10 requests per hour
  - GET /api/v1/scans: 100 requests per hour
```

## 📈 Pagination

### **Pagination Parameters**
```yaml
page: Page number (default: 1)
limit: Items per page (default: 20, max: 100)
sort: Sort field (e.g., "created_at", "-created_at")
filter: Filter criteria (JSON format)
```

### **Pagination Response**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## 🔍 Search and Filtering

### **Search Parameters**
```yaml
q: Global search term
target_id: Filter by target
status: Filter by status
severity: Filter by vulnerability severity
date_from: Filter from date
date_to: Filter to date
category: Filter by category
tags: Filter by tags
```

### **Advanced Filtering**
```json
{
  "filters": {
    "target": {
      "category": ["production", "development"],
      "risk_score": {"min": 50, "max": 100}
    },
    "vulnerabilities": {
      "severity": ["critical", "high"],
      "status": ["new", "open"]
    },
    "date_range": {
      "created_at": {
        "from": "2025-08-01T00:00:00Z",
        "to": "2025-08-21T23:59:59Z"
      }
    }
  }
}
```

## 📚 API Documentation

### **OpenAPI Specification**
```yaml
# Available at: https://api.purpleteam-platform.com/docs
# Swagger UI: https://api.purpleteam-platform.com/swagger
# ReDoc: https://api.purpleteam-platform.com/redoc
```

### **SDK Libraries**
```yaml
Python SDK: pip install purple-team-sdk
JavaScript SDK: npm install @purple-team/sdk
Go SDK: go get github.com/purple-team/sdk
```

### **Postman Collection**
```yaml
Download: https://api.purpleteam-platform.com/postman-collection.json
Environment: https://api.purpleteam-platform.com/postman-environment.json
```

## 🧪 Testing

### **API Testing Endpoints**
```http
GET /api/v1/health - Health check
GET /api/v1/status - System status
GET /api/v1/version - API version
```

### **Test Environment**
```yaml
Base URL: https://test-api.purpleteam-platform.com
Authentication: Test API key
Rate Limits: 10x higher for testing
Data: Mock data for testing
```

---

**Última atualização**: 21 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ Especificações Completas 