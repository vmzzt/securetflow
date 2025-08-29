# Purple Team Platform V3 - Lista Completa de Ferramentas

## 🛠️ **Arsenal Completo de 100+ Ferramentas**

Com base no seu feedback sobre a necessidade de uma lista robusta e eficaz, expandimos drasticamente o arsenal para incluir TODAS as ferramentas essenciais de pentest e security testing:

### **Network & Infrastructure (20 tools)**

#### **Port Scanning & Discovery:**
```yaml
Core Scanners:
  - Nmap: Network Mapper - O scanner mais completo e versátil
  - Masscan: Ultra-fast internet scanner, capaz de escanear toda a internet
  - RustScan: Scanner de alta performance escrito em Rust
  - Zmap: Scanner para pesquisas em larga escala da internet
  - Unicornscan: Scanner distribuído assíncrono
  - Angry IP Scanner: Scanner GUI multiplataforma
  - Advanced Port Scanner: Scanner Windows com GUI
  - SuperScan: Scanner de portas Windows avançado

Network Discovery:
  - hping3: Packet crafting e análise de rede
  - fping: Utilitário de ping rápido para múltiplos hosts
  - arp-scan: Scanner baseado em ARP para descoberta de rede local
  - NBTscan: Scanner NetBIOS para redes Windows
  - enum4linux: Enumeração de sistemas Linux/Unix via SMB
  - rpcclient: Cliente RPC para interação com serviços Windows
  - smbclient: Cliente SMB para acesso e enumeração
  - showmount: Lista exports NFS disponíveis

Advanced Network Tools:
  - Wireshark: Analisador de protocolos de rede mais completo
  - tcpdump: Analisador de pacotes via linha de comando
  - Ettercap: Network sniffer/interceptor com capacidades MitM
  - Bettercap: Framework moderno para ataques de rede
```

#### **Exploitation Frameworks:**
```yaml
Primary Frameworks:
  - Metasploit Framework: Premier exploitation platform
    * msfconsole: Interface principal
    * msfvenom: Payload generator
    * msfdb: Database management
    * Armitage: GUI for Metasploit
  
  - Empire: PowerShell post-exploitation framework
  - Cobalt Strike: Comercial red team platform (se licenciado)
  - Canvas: Comercial exploitation framework
  - Core Impact: Comercial penetration testing platform

Specialized Exploitation:
  - Veil: Payload generator para evasão de AV
  - TheFatRat: Backdoor generator
  - Social Engineer Toolkit (SET): Social engineering attacks
  - BeEF: Browser exploitation framework
  - Legion: Automated scanner integrado com Metasploit
```

### **Web Application Security (25 tools)**

#### **Web Proxies & Comprehensive Scanners:**
```yaml
Professional Proxies:
  - Burp Suite Professional: Industry standard web proxy
    * Scanner: Automated vulnerability detection
    * Intruder: Automated attacks
    * Repeater: Manual request testing
    * Sequencer: Session token analysis
    * Extensions: 500+ community extensions
  
  - OWASP ZAP: Free web application scanner
    * Active Scanner: Automated vulnerability detection
    * Passive Scanner: Traffic analysis
    * Spider: Web crawling
    * Fuzzer: Parameter fuzzing
    * REST API: Automation integration

Full-Featured Scanners:
  - w3af: Web application attack and audit framework
  - Wapiti: Black-box web vulnerability scanner
  - Skipfish: Web application security reconnaissance
  - Arachni: Web security scanner framework
  - WebScarab: Web application security framework
  - Vega: Web security scanner with GUI
  - Paros Proxy: Java-based web proxy
  - WebGoat: Deliberately vulnerable web application
```

#### **Web Fuzzers & Directory Discovery:**
```yaml
Modern Fuzzers:
  - FFUF: Fast web fuzzer written in Go
    * Directory fuzzing
    * Parameter fuzzing
    * VHost fuzzing
    * POST data fuzzing
  
  - Feroxbuster: Rust-based recursive content discovery
    * Recursive directory discovery
    * Link extraction
    * Response filtering
    * High performance
  
  - Gobuster: Directory/file, DNS and VHost busting
  - Dirsearch: Web path scanner with threading
  - DirBuster: Multi-threaded directory brute forcer
  - Wfuzz: Web application fuzzer framework
  - Patator: Multi-purpose brute forcer

Legacy But Effective:
  - dirb: Web Content Scanner
  - nikto: Web server scanner
  - cadaver: WebDAV client
  - davtest: WebDAV testing tool
```

#### **Specialized Web Tools:**
```yaml
Technology Detection:
  - WhatWeb: Web technology identifier
  - Wappalyzer: Technology stack detection
  - BuiltWith: Website technology profiler
  - webanalyze: Web technology analyzer

Screenshot & Visual:
  - EyeWitness: Web application screenshot utility
  - Aquatone: Domain flyover tool
  - webscreenshot: Batch website screenshots
  - cutycapt: Website screenshot utility

Web Utilities:
  - httprobe: HTTP/HTTPS probe utility
  - meg: Fetch many paths for many hosts
  - unfurl: URL analysis tool
  - waybackurls: Wayback machine URL extractor
```

### **Vulnerability Scanning (18 tools)**

#### **Template-Based Modern Scanners:**
```yaml
Next-Generation Scanners:
  - Nuclei: YAML-based vulnerability scanner
    * 5000+ community templates
    * Custom template development
    * High-speed scanning
    * CI/CD integration
    * Cloud-native design
  
  - Jaeles: Signature-based scanner
  - Qsfuzz: Custom vulnerability scanner
  - Intrigue Core: Attack surface discovery

Enterprise Scanners:
  - OpenVAS: Full-featured open-source scanner
    * GVM (Greenbone Vulnerability Management)
    * Comprehensive vulnerability database
    * Authenticated scanning
    * Compliance reporting
  
  - Nessus: Commercial vulnerability scanner (Tenable)
  - Rapid7 Nexpose: Enterprise vulnerability management
  - Qualys VMDR: Cloud vulnerability scanner
  - Acunetix: Web vulnerability scanner
```

#### **Specialized Injection Tools:**
```yaml
SQL Injection:
  - SQLMap: Advanced SQL injection tool
    * Database takeover
    * File system access
    * OS command execution
    * Advanced evasion techniques
  
  - jSQL Injection: Java-based SQL injection tool
  - Blind-SQL-Bitshifting: Blind SQL injection tool
  - SQLNinja: SQL Server injection tool

NoSQL Injection:
  - NoSQLMap: NoSQL injection testing
  - NoSQLAttack: NoSQL database attack tool

Other Injection Types:
  - XSStrike: XSS detection and exploitation suite
  - SSRFmap: SSRF exploitation tool
  - CommIX: Command injection exploiter
  - XXEinjector: XXE injection tool
  - LDAPi: LDAP injection testing
  - Tplmap: Template injection testing
```

### **Reconnaissance & OSINT (30 tools)**

#### **Subdomain Enumeration:**
```yaml
Passive Discovery:
  - Subfinder: Passive subdomain discovery
    * 40+ sources integration
    * API key support
    * High-speed resolution
    * JSON output
  
  - Amass: Attack surface mapping
    * Active and passive enumeration
    * Graph database integration
    * API integrations
    * Network mapping
  
  - Assetfinder: Domain and subdomain discovery
  - Findomain: Cross-platform subdomain enumerator
  - chaos: Subdomain discovery using ProjectDiscovery

DNS Tools:
  - DNSx: Fast DNS resolver and toolkit
  - MassDNS: High-performance DNS resolver  
  - Shuffledns: Wrapper around massdns
  - PureDNS: Accurate DNS resolution
  - DNSgen: DNS wordlist generator
  - dnstwist: Domain name permutation engine
```

#### **Content & URL Discovery:**
```yaml
Web Crawlers:
  - Hakrawler: Web crawler for endpoint discovery
  - Katana: Next-generation crawling framework
  - gospider: Fast web spider
  - crawley: Advanced web crawler

Archive Tools:
  - Gau: Get All URLs from web archives
  - Waybackurls: Wayback machine URL extractor
  - getallurls: URL discovery from archives
  - waybackpack: Download Wayback Machine snapshots

JavaScript Analysis:
  - URLFinder: Extract URLs from JavaScript
  - LinkFinder: Discover endpoints in JS files
  - SecretFinder: Discover API keys in JS files
  - relative-url-extractor: Extract relative URLs
  - jsbeautifier: JavaScript beautifier
  - retire.js: JavaScript vulnerability scanner
```

#### **OSINT Frameworks:**
```yaml
Comprehensive OSINT:
  - theHarvester: Email, subdomain and people names harvester
  - Maltego: Link analysis and data mining tool
  - Recon-ng: Full-featured reconnaissance framework
  - SpiderFoot: OSINT automation tool
  - Sherlock: Hunt down social media accounts
  - social-analyzer: Social media analyzer

Search Engine Integration:
  - Shodan CLI: Search engine for Internet-connected devices
  - Censys CLI: Internet scanning and analysis
  - BinaryEdge CLI: Internet scanning platform
  - GreyNoise CLI: Internet noise analysis

Social Media OSINT:
  - Instagram-py: Instagram OSINT tool
  - InSpy: LinkedIn enumeration tool
  - WhatsMyName: Username enumeration
  - Twint: Twitter intelligence tool
```

#### **Email & People OSINT:**
```yaml
Email Discovery:
  - Hunter.io: Email finder service
  - Phonebook.cz: Email and subdomain search
  - clearbit-python: People and company data
  - pipl: People search engine

Breach Data:
  - HaveIBeenPwned API: Breach data checking
  - DeHashed API: Breach database search
  - leak-lookup: Data breach search
```

### **Mobile & Wireless Security (12 tools)**

#### **Mobile Application Security:**
```yaml
Android Security:
  - MobSF: Mobile Security Framework
    * Static and dynamic analysis
    * Malware analysis
    * API testing
    * Report generation
  
  - Drozer: Android security testing framework
  - QARK: Quick Android Review Kit
  - AndroBugs: Android vulnerability scanner
  - APKTool: Android APK reverse engineering
  - dex2jar: Android DEX to JAR converter
  - jadx: Dex to Java decompiler

iOS Security:
  - idb: iOS security testing toolkit
  - Objection: Runtime mobile exploration
  - Frida: Dynamic instrumentation toolkit
  - class-dump: Objective-C class information utility
  - otool: Object file displaying tool
```

#### **Wireless Security:**
```yaml
WiFi Security:
  - Aircrack-ng: WiFi security auditing tools suite
    * airmon-ng: Monitor mode activation
    * airodump-ng: Packet capture
    * aireplay-ng: Packet injection
    * aircrack-ng: WEP/WPA cracking
  
  - Kismet: Wireless network detector and sniffer
  - Wifite: Automated wireless auditor
  - Fluxion: Wireless auditing tool
  - WiFi-Pumpkin: Rogue access point framework

WPS & Advanced Attacks:
  - Reaver: WPS cracking tool
  - Bully: WPS brute force tool
  - Pixiewps: WPS pixie dust attack
  - Hashcat: Advanced password recovery
  - John the Ripper: Password cracker
```

### **Forensics & Analysis (15 tools)**

#### **Network Forensics:**
```yaml
Packet Analysis:
  - Wireshark: Network protocol analyzer
  - NetworkMiner: Network forensic analysis
  - Xplico: Network forensic analysis
  - Moloch: Large scale packet capture
  - PcapXray: Network packet analysis
  - CapAnalysis: Web visual tool for packet analysis

Network Monitoring:
  - Security Onion: Network security monitoring
  - Suricata: Network threat detection
  - Zeek (Bro): Network security monitor
  - RITA: Real Intelligence Threat Analytics
```

#### **Digital Forensics:**
```yaml
Memory Forensics:
  - Volatility: Memory forensics framework
  - Rekall: Memory analysis framework
  - LiME: Linux Memory Extractor
  - WinPmem: Windows memory acquisition

File System Forensics:
  - Autopsy: Digital forensics platform
  - Sleuth Kit: Digital investigation tools
  - PhotoRec: File carving tool
  - Foremost: File carving tool
  - Scalpel: File carving tool

Metadata & Analysis:
  - ExifTool: Metadata analyzer
  - Binwalk: Firmware analysis tool
  - YARA: Pattern matching engine
  - ClamAV: Antivirus scanner
```

### **DevSecOps Integration (25 tools)**

#### **Static Application Security Testing (SAST):**
```yaml
Multi-Language SAST:
  - SonarQube: Code quality and security analysis
    * 25+ programming languages
    * Quality gates
    * Technical debt tracking
    * Security hotspots
  
  - Checkmarx SAST: Static application security testing
  - Veracode SAST: Cloud-based static analysis
  - CodeQL: Semantic code analysis (GitHub)
  - Semgrep: Static analysis at scale

Language-Specific SAST:
  - Bandit: Python security linter
  - ESLint Security: JavaScript security rules
  - Brakeman: Ruby on Rails security scanner
  - SpotBugs: Java static analysis
  - Gosec: Go security checker
  - TSLint: TypeScript linter with security rules
  - PHPStan: PHP static analysis
  - RuboCop: Ruby static code analyzer
```

#### **Dependency Scanning:**
```yaml
Multi-Platform Scanners:
  - Snyk: Developer security platform
    * Vulnerability database
    * Fix recommendations
    * License compliance
    * Container scanning
  
  - OWASP Dependency Check: Vulnerable dependency identification
  - WhiteSource: Open source security management
  - JFrog Xray: Universal artifact analysis

Language-Specific Scanners:
  - Retire.js: JavaScript vulnerability scanner
  - Safety: Python dependency vulnerability scanner
  - Bundler Audit: Ruby dependency security scanner
  - Yarn Audit: Node.js dependency auditing
  - Nancy: .NET dependency scanner
  - golangci-lint: Go linters aggregator
```

#### **Container Security:**
```yaml
Container Vulnerability Scanners:
  - Trivy: Container vulnerability scanner
    * OS package vulnerabilities
    * Application dependencies
    * Configuration issues
    * Kubernetes manifests
  
  - Clair: Container vulnerability analysis
  - Anchore: Container security analysis
  - Dagda: Static analysis of Docker images
  - Docker Bench: Docker security benchmark
  - kube-score: Kubernetes security analysis
  - Falco: Runtime security monitoring

Container Platforms:
  - Twistlock (Prisma Cloud): Container security platform
  - Aqua Security: Container security platform
  - Sysdig Secure: Container security monitoring
  - StackRox: Kubernetes security platform
```

#### **Infrastructure as Code (IaC) Security:**
```yaml
IaC Scanners:
  - Checkov: Static analysis for infrastructure
    * Terraform scanning
    * CloudFormation analysis
    * Kubernetes manifests
    * Dockerfile security
  
  - Terrascan: IaC security scanner
  - Kics: Infrastructure as code scanner
  - Tfsec: Terraform security scanner
  - CloudFormation Guard: AWS CloudFormation validation
  - Config Lint: Configuration file linter
  - InSpec: Infrastructure testing framework
```

#### **Secrets Management:**
```yaml
Secrets Detection:
  - GitLeaks: Secrets detection in git repos
  - TruffleHog: Secrets scanner for repositories
  - detect-secrets: Secrets detection library
  - git-secrets: AWS secrets scanner for git
  - Whispers: Static code analysis for secrets

Secrets Management Platforms:
  - HashiCorp Vault: Secrets management platform
  - AWS Secrets Manager: Cloud secrets management
  - Azure Key Vault: Cloud secrets management
  - Secrets Bridge: Secrets management bridge
```

### **Cloud Security (18 tools)**

#### **Multi-Cloud Security:**
```yaml
Universal Cloud Scanners:
  - ScoutSuite: Multi-cloud security auditing
    * AWS, Azure, GCP, Alibaba Cloud
    * Configuration assessment
    * Compliance reporting
    * HTML reports
  
  - CloudSploit: Cloud security scanning
  - CloudMapper: AWS network visualization
  - CloudQuery: Cloud asset inventory
  - CloudCustodian: Cloud resource governance
```

#### **AWS Security:**
```yaml
AWS-Specific Tools:
  - Prowler: AWS security tool
    * 200+ security checks
    * CIS compliance
    * GDPR compliance
    * Multi-account support
  
  - AWS Config: Resource configuration monitoring
  - AWS Inspector: Application security assessment
  - AWS GuardDuty: Threat detection service
  - Pacu: AWS exploitation framework
  - CloudTracker: AWS CloudTrail analysis
  - Principal Mapper: AWS IAM analysis
  - WeirdAAL: AWS attack library
  - Enumerate-IAM: AWS IAM enumeration
```

#### **Azure Security:**
```yaml
Azure-Specific Tools:
  - Azucar: Azure security auditing
  - MicroBurst: Azure security assessment
  - ROADtools: Azure AD security tools
  - Azure Security Center: Cloud security posture
  - Azure Sentinel: Cloud SIEM solution
```

#### **GCP Security:**
```yaml
GCP-Specific Tools:
  - GCP Security Command Center
  - Forseti Security: GCP security toolkit
  - G-Scout: GCP security auditing
  - GCPBucketBrute: GCP storage enumeration
```

#### **Kubernetes Security:**
```yaml
K8s Security Tools:
  - kube-bench: CIS Kubernetes benchmark
  - kube-hunter: Kubernetes penetration testing
  - kubectl: Kubernetes command-line tool
  - Polaris: Kubernetes best practices validation
  - OPA Gatekeeper: Policy enforcement
  - Calico: Network security for Kubernetes
  - Istio: Service mesh security
```

### **AI/ML Security Tools (10 tools)**

#### **AI-Powered Security:**
```yaml
LLM-Based Security:
  - PentestGPT: GPT-powered penetration testing
  - Auto-GPT: Autonomous security testing
  - SecurityCopilot: AI security assistant
  - Langchain Security: LLM security framework
  - GPT Engineer: AI code generation and review

ML Security Testing:
  - Adversarial Robustness Toolbox: ML security testing
  - Foolbox: Python toolbox for adversarial attacks
  - CleverHans: Library for adversarial examples
  - AI Safety Gym: Safe exploration in RL
  - Model Card Toolkit: ML model documentation
```

### **Password & Credential Security (8 tools)**

#### **Password Cracking:**
```yaml
Advanced Crackers:
  - Hashcat: Advanced password recovery
    * GPU acceleration
    * 300+ hash types
    * Rule-based attacks
    * Mask attacks
  
  - John the Ripper: Password cracker
  - Hydra: Network logon cracker
  - Medusa: Parallel brute forcer
  - CrackMapExec: SMB/WinRM/LDAP authentication
  
Wordlist Generators:
  - CeWL: Custom wordlist generator
  - Crunch: Wordlist generator
  - CUPP: Common User Passwords Profiler
```

### **Social Engineering & Phishing (6 tools)**

#### **Social Engineering Frameworks:**
```yaml
SE Platforms:
  - Social Engineer Toolkit (SET): Social engineering attacks
  - King Phisher: Phishing campaign toolkit
  - Gophish: Open-source phishing toolkit
  - SpeedPhish Framework: Quick phishing deployment
  - PhishingKitTracker: Phishing kit monitoring
  - Blackeye: Social engineering toolkit
```

## 🎯 **Tool Selection Intelligence com LLM**

### **AI-Powered Tool Compatibility:**
```python
Tool Compatibility Matrix:
  # Network scanning compatibility
  nmap + masscan: "Complementary - use masscan for port discovery, nmap for service detection"
  nmap + metasploit: "Perfect integration - nmap results auto-import to MSF database"
  
  # Web testing compatibility  
  burp + zaproxy: "Conflicting proxies - use one at a time or different ports"
  ffuf + feroxbuster: "Similar function - choose based on use case (speed vs features)"
  
  # Vulnerability scanning compatibility
  nuclei + nmap: "Excellent combo - nmap for discovery, nuclei for vulnerability detection"
  sqlmap + burp: "Perfect integration - use Burp to find injection points, SQLMap to exploit"

Configuration Optimization:
  # Performance tuning
  - Auto-adjust thread counts based on target responsiveness
  - Rate limiting recommendations based on target type
  - Memory allocation optimization for tool combinations
  - Network bandwidth management

Conflict Resolution:
  # Port conflicts
  - Automatic port reassignment for proxy tools
  - Sequential execution recommendations
  - Resource usage prediction and management
```

## 🔧 **Custom Scan Execution Logic**

### **Business Rules Engine:**
```yaml
Rule Examples:
  # Tool incompatibility rules
  - IF burp_enabled AND zaproxy_enabled THEN suggest_alternative_ports
  - IF masscan_threads > 1000 AND target_type == "production" THEN reduce_threads
  - IF metasploit_enabled AND no_database THEN initialize_database
  
  # Performance optimization rules  
  - IF target_count > 100 THEN enable_distributed_scanning
  - IF scan_time > 4_hours THEN suggest_chunking
  - IF memory_usage > 80% THEN reduce_concurrent_tools
  
  # Safety rules
  - IF target_category == "production" AND scan_level == "massive" THEN require_approval
  - IF destructive_tests_enabled THEN require_explicit_confirmation
  - IF business_hours AND scan_type == "aggressive" THEN schedule_later
```

---

**Esta lista expandida de 100+ ferramentas representa o arsenal mais completo disponível para security testing, cobrindo todos os aspectos de um programa purple team moderno. Cada ferramenta foi selecionada por sua eficácia, popularidade na comunidade e integração com ecossistemas modernos de DevSecOps.**