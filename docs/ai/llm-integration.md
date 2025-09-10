# Purple Team Platform V4 Master - Integração LLM

## 🧠 Visão Geral da Integração LLM

A Purple Team Platform V4 Master integra múltiplos modelos de Large Language Models (LLMs) para fornecer análise inteligente de vulnerabilidades, recomendações automatizadas e insights de segurança avançados.

## 🎯 Arquitetura de IA

### **1. Multi-Model Architecture**
```yaml
LLM Providers:
  - Ollama (Local): Llama 3.1, Mistral, CodeLlama
  - OpenAI: GPT-4, GPT-3.5-turbo
  - Anthropic: Claude 3.5 Sonnet
  - Custom Models: Fine-tuned security models
```

### **2. Service Architecture**
```python
# Estrutura de serviços de IA
class AIService:
    def __init__(self):
        self.ollama_client = OllamaClient()
        self.openai_client = OpenAIClient()
        self.anthropic_client = AnthropicClient()
        self.model_registry = ModelRegistry()
    
    async def analyze_vulnerability(self, vuln_data: dict) -> dict:
        """Análise inteligente de vulnerabilidade"""
        pass
    
    async def generate_recommendations(self, context: dict) -> list:
        """Geração de recomendações"""
        pass
    
    async def detect_patterns(self, data: list) -> dict:
        """Detecção de padrões"""
        pass
```

## 🔧 Configuração de Modelos

### **1. Ollama (Local LLM)**

#### **Instalação e Configuração**
```bash
# Instalação do Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Download de modelos
ollama pull llama3.1:latest
ollama pull mistral:latest
ollama pull codellama:latest
ollama pull security-llm:latest
```

#### **Configuração do Serviço**
```python
# Configuração do cliente Ollama
import ollama
from typing import Dict, List

class OllamaClient:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.client = ollama.Client(host=base_url)
        self.models = {
            "llama3.1": "llama3.1:latest",
            "mistral": "mistral:latest",
            "codellama": "codellama:latest",
            "security": "security-llm:latest"
        }
    
    async def generate_response(
        self,
        model: str,
        prompt: str,
        context: Dict = None,
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> str:
        """Gera resposta usando modelo Ollama"""
        
        try:
            response = self.client.chat(
                model=self.models.get(model, "llama3.1:latest"),
                messages=[
                    {
                        "role": "system",
                        "content": self.get_system_prompt(context)
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                options={
                    "temperature": temperature,
                    "num_predict": max_tokens
                }
            )
            
            return response["message"]["content"]
            
        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
            return None
    
    def get_system_prompt(self, context: Dict = None) -> str:
        """Retorna prompt do sistema baseado no contexto"""
        base_prompt = """
        Você é um assistente especializado em segurança cibernética e análise de vulnerabilidades.
        Sua função é analisar dados de segurança e fornecer insights valiosos.
        
        Diretrizes:
        - Sempre priorize a segurança
        - Forneça recomendações práticas
        - Explique conceitos técnicos de forma clara
        - Considere o contexto empresarial
        """
        
        if context:
            base_prompt += f"\nContexto: {json.dumps(context, indent=2)}"
        
        return base_prompt
```

### **2. OpenAI Integration**

#### **Configuração do Cliente**
```python
# Integração com OpenAI
import openai
from openai import AsyncOpenAI

class OpenAIClient:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.client = AsyncOpenAI(api_key=self.api_key)
        self.models = {
            "gpt4": "gpt-4",
            "gpt35": "gpt-3.5-turbo",
            "gpt4_turbo": "gpt-4-turbo-preview"
        }
    
    async def analyze_vulnerability(
        self,
        vuln_data: Dict,
        model: str = "gpt4"
    ) -> Dict:
        """Análise de vulnerabilidade com OpenAI"""
        
        prompt = self.build_vulnerability_prompt(vuln_data)
        
        try:
            response = await self.client.chat.completions.create(
                model=self.models.get(model, "gpt-4"),
                messages=[
                    {
                        "role": "system",
                        "content": self.get_security_analyst_prompt()
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=2000
            )
            
            return self.parse_vulnerability_analysis(response.choices[0].message.content)
            
        except Exception as e:
            logger.error(f"OpenAI analysis failed: {e}")
            return None
    
    def build_vulnerability_prompt(self, vuln_data: Dict) -> str:
        """Constrói prompt para análise de vulnerabilidade"""
        return f"""
        Analise a seguinte vulnerabilidade de segurança:
        
        Título: {vuln_data.get('title', 'N/A')}
        Severidade: {vuln_data.get('severity', 'N/A')}
        CVSS Score: {vuln_data.get('cvss_score', 'N/A')}
        Descrição: {vuln_data.get('description', 'N/A')}
        Localização: {vuln_data.get('location', 'N/A')}
        Ferramenta: {vuln_data.get('tool_detected', 'N/A')}
        
        Por favor, forneça:
        1. Análise detalhada da vulnerabilidade
        2. Impacto potencial no negócio
        3. Recomendações de remediação
        4. Prioridade de correção
        5. Verificação de falsos positivos
        """
    
    def get_security_analyst_prompt(self) -> str:
        """Prompt do sistema para analista de segurança"""
        return """
        Você é um analista de segurança cibernética experiente com mais de 10 anos de experiência.
        Sua especialidade é análise de vulnerabilidades e recomendações de segurança.
        
        Ao analisar vulnerabilidades:
        - Considere o contexto empresarial
        - Avalie o impacto real no negócio
        - Forneça recomendações práticas e acionáveis
        - Identifique possíveis falsos positivos
        - Sugira métricas de sucesso para remediação
        
        Sempre mantenha um tom profissional e técnico.
        """
```

### **3. Anthropic Claude Integration**

#### **Configuração do Cliente**
```python
# Integração com Anthropic Claude
import anthropic

class AnthropicClient:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")
        self.client = anthropic.AsyncAnthropic(api_key=self.api_key)
        self.models = {
            "claude3_sonnet": "claude-3-sonnet-20240229",
            "claude3_haiku": "claude-3-haiku-20240307",
            "claude3_opus": "claude-3-opus-20240229"
        }
    
    async def generate_security_insights(
        self,
        data: Dict,
        model: str = "claude3_sonnet"
    ) -> Dict:
        """Gera insights de segurança com Claude"""
        
        prompt = self.build_insights_prompt(data)
        
        try:
            response = await self.client.messages.create(
                model=self.models.get(model, "claude-3-sonnet-20240229"),
                max_tokens=4000,
                temperature=0.3,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            return self.parse_insights_response(response.content[0].text)
            
        except Exception as e:
            logger.error(f"Claude analysis failed: {e}")
            return None
```

## 🔍 Análise de Vulnerabilidades

### **1. Análise Inteligente de Vulnerabilidades**

#### **Sistema de Análise**
```python
# Sistema de análise inteligente de vulnerabilidades
class VulnerabilityAnalyzer:
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.analysis_cache = {}
    
    async def analyze_vulnerability(
        self,
        vuln_data: Dict,
        target_context: Dict = None
    ) -> Dict:
        """Análise completa de vulnerabilidade"""
        
        # Verificar cache
        cache_key = self.generate_cache_key(vuln_data)
        if cache_key in self.analysis_cache:
            return self.analysis_cache[cache_key]
        
        # Análise com múltiplos modelos
        analyses = await asyncio.gather(
            self.ai_service.ollama_client.analyze_vulnerability(vuln_data),
            self.ai_service.openai_client.analyze_vulnerability(vuln_data),
            self.ai_service.anthropic_client.generate_security_insights(vuln_data)
        )
        
        # Consolidação dos resultados
        consolidated_analysis = self.consolidate_analyses(analyses)
        
        # Adicionar contexto do target
        if target_context:
            consolidated_analysis["business_context"] = self.analyze_business_impact(
                vuln_data, target_context
            )
        
        # Cache do resultado
        self.analysis_cache[cache_key] = consolidated_analysis
        
        return consolidated_analysis
    
    def consolidate_analyses(self, analyses: List[Dict]) -> Dict:
        """Consolida análises de múltiplos modelos"""
        consolidated = {
            "severity_assessment": {},
            "remediation_recommendations": [],
            "false_positive_analysis": {},
            "business_impact": {},
            "confidence_score": 0.0
        }
        
        # Agregar avaliações de severidade
        severity_scores = []
        for analysis in analyses:
            if analysis and "severity" in analysis:
                severity_scores.append(analysis["severity"])
        
        if severity_scores:
            consolidated["severity_assessment"] = {
                "consensus_severity": self.get_consensus_severity(severity_scores),
                "confidence": len(severity_scores) / len(analyses)
            }
        
        # Agregar recomendações
        all_recommendations = []
        for analysis in analyses:
            if analysis and "recommendations" in analysis:
                all_recommendations.extend(analysis["recommendations"])
        
        consolidated["remediation_recommendations"] = self.deduplicate_recommendations(
            all_recommendations
        )
        
        return consolidated
    
    def analyze_business_impact(
        self,
        vuln_data: Dict,
        target_context: Dict
    ) -> Dict:
        """Análise do impacto no negócio"""
        
        impact_factors = {
            "data_sensitivity": target_context.get("data_classification", "low"),
            "business_criticality": target_context.get("criticality", "low"),
            "external_exposure": target_context.get("external", False),
            "compliance_requirements": target_context.get("compliance", [])
        }
        
        # Calcular score de impacto
        impact_score = 0
        if impact_factors["data_sensitivity"] == "high":
            impact_score += 30
        if impact_factors["business_criticality"] == "critical":
            impact_score += 25
        if impact_factors["external_exposure"]:
            impact_score += 20
        if impact_factors["compliance_requirements"]:
            impact_score += 25
        
        return {
            "impact_score": min(impact_score, 100),
            "impact_level": self.get_impact_level(impact_score),
            "factors": impact_factors,
            "recommendations": self.get_business_recommendations(impact_factors)
        }
```

### **2. Detecção de Falsos Positivos**

#### **Sistema de Detecção**
```python
# Sistema de detecção de falsos positivos
class FalsePositiveDetector:
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.fp_patterns = self.load_fp_patterns()
    
    async def analyze_false_positive(
        self,
        vuln_data: Dict,
        historical_data: List[Dict] = None
    ) -> Dict:
        """Análise de possível falso positivo"""
        
        analysis = {
            "is_false_positive": False,
            "confidence": 0.0,
            "reasons": [],
            "recommendation": "verify_manually"
        }
        
        # Análise baseada em padrões
        pattern_analysis = self.analyze_patterns(vuln_data)
        if pattern_analysis["score"] > 0.7:
            analysis["is_false_positive"] = True
            analysis["confidence"] = pattern_analysis["score"]
            analysis["reasons"].extend(pattern_analysis["reasons"])
        
        # Análise com IA
        ai_analysis = await self.ai_service.analyze_false_positive(vuln_data)
        if ai_analysis:
            ai_confidence = ai_analysis.get("confidence", 0.0)
            if ai_confidence > 0.8:
                analysis["is_false_positive"] = ai_analysis.get("is_false_positive", False)
                analysis["confidence"] = max(analysis["confidence"], ai_confidence)
                analysis["reasons"].extend(ai_analysis.get("reasons", []))
        
        # Análise histórica
        if historical_data:
            historical_analysis = self.analyze_historical_data(vuln_data, historical_data)
            analysis["historical_context"] = historical_analysis
        
        return analysis
    
    def analyze_patterns(self, vuln_data: Dict) -> Dict:
        """Análise baseada em padrões conhecidos"""
        
        score = 0.0
        reasons = []
        
        # Verificar padrões de falso positivo
        for pattern in self.fp_patterns:
            if self.matches_pattern(vuln_data, pattern):
                score += pattern["weight"]
                reasons.append(pattern["reason"])
        
        return {
            "score": min(score, 1.0),
            "reasons": reasons
        }
    
    def load_fp_patterns(self) -> List[Dict]:
        """Carrega padrões de falso positivo"""
        return [
            {
                "name": "test_environment",
                "pattern": {"location": "test", "environment": "testing"},
                "weight": 0.8,
                "reason": "Vulnerabilidade em ambiente de teste"
            },
            {
                "name": "low_severity_old_tool",
                "pattern": {"severity": "low", "tool_detected": "old_scanner"},
                "weight": 0.6,
                "reason": "Ferramenta antiga detectando vulnerabilidade de baixa severidade"
            },
            {
                "name": "known_fp_signature",
                "pattern": {"title": "known_fp_title"},
                "weight": 0.9,
                "reason": "Assinatura conhecida de falso positivo"
            }
        ]
```

## 🎯 Geração de Recomendações

### **1. Sistema de Recomendações Inteligentes**

#### **Gerador de Recomendações**
```python
# Sistema de geração de recomendações
class RecommendationGenerator:
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.recommendation_templates = self.load_templates()
    
    async def generate_recommendations(
        self,
        vuln_data: Dict,
        target_context: Dict,
        business_context: Dict = None
    ) -> List[Dict]:
        """Gera recomendações personalizadas"""
        
        recommendations = []
        
        # Recomendações baseadas em templates
        template_recs = self.generate_template_recommendations(vuln_data)
        recommendations.extend(template_recs)
        
        # Recomendações com IA
        ai_recs = await self.ai_service.generate_recommendations({
            "vulnerability": vuln_data,
            "target": target_context,
            "business": business_context
        })
        
        if ai_recs:
            recommendations.extend(ai_recs)
        
        # Priorização das recomendações
        prioritized_recs = self.prioritize_recommendations(recommendations)
        
        return prioritized_recs
    
    def generate_template_recommendations(self, vuln_data: Dict) -> List[Dict]:
        """Gera recomendações baseadas em templates"""
        
        recommendations = []
        vuln_type = vuln_data.get("type", "unknown")
        
        if vuln_type in self.recommendation_templates:
            template = self.recommendation_templates[vuln_type]
            
            for rec_template in template:
                recommendation = {
                    "title": rec_template["title"],
                    "description": rec_template["description"].format(**vuln_data),
                    "priority": rec_template["priority"],
                    "effort": rec_template["effort"],
                    "category": rec_template["category"],
                    "implementation_steps": rec_template["steps"],
                    "references": rec_template["references"]
                }
                
                recommendations.append(recommendation)
        
        return recommendations
    
    def prioritize_recommendations(self, recommendations: List[Dict]) -> List[Dict]:
        """Prioriza recomendações baseado em múltiplos fatores"""
        
        for rec in recommendations:
            priority_score = 0
            
            # Fator de severidade
            if rec.get("priority") == "critical":
                priority_score += 40
            elif rec.get("priority") == "high":
                priority_score += 30
            elif rec.get("priority") == "medium":
                priority_score += 20
            else:
                priority_score += 10
            
            # Fator de esforço (menor esforço = maior prioridade)
            if rec.get("effort") == "low":
                priority_score += 30
            elif rec.get("effort") == "medium":
                priority_score += 20
            else:
                priority_score += 10
            
            # Fator de impacto no negócio
            if rec.get("business_impact") == "high":
                priority_score += 30
            elif rec.get("business_impact") == "medium":
                priority_score += 20
            else:
                priority_score += 10
            
            rec["priority_score"] = priority_score
        
        # Ordenar por score de prioridade
        recommendations.sort(key=lambda x: x["priority_score"], reverse=True)
        
        return recommendations
    
    def load_templates(self) -> Dict:
        """Carrega templates de recomendações"""
        return {
            "sql_injection": [
                {
                    "title": "Implementar Prepared Statements",
                    "description": "Use prepared statements para prevenir SQL injection em {location}",
                    "priority": "critical",
                    "effort": "medium",
                    "category": "code_security",
                    "steps": [
                        "Identificar todas as queries dinâmicas",
                        "Substituir por prepared statements",
                        "Validar entrada de dados",
                        "Testar com payloads maliciosos"
                    ],
                    "references": [
                        "https://owasp.org/www-community/attacks/SQL_Injection",
                        "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
                    ]
                }
            ],
            "xss": [
                {
                    "title": "Implementar Output Encoding",
                    "description": "Aplicar encoding adequado para prevenir XSS em {location}",
                    "priority": "high",
                    "effort": "low",
                    "category": "code_security",
                    "steps": [
                        "Identificar pontos de saída de dados",
                        "Aplicar HTML encoding",
                        "Implementar CSP headers",
                        "Validar entrada de dados"
                    ],
                    "references": [
                        "https://owasp.org/www-community/attacks/xss/",
                        "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html"
                    ]
                }
            ]
        }
```

## 🔍 Detecção de Padrões

### **1. Sistema de Detecção de Padrões**

#### **Detector de Padrões**
```python
# Sistema de detecção de padrões de segurança
class PatternDetector:
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.pattern_database = self.load_pattern_database()
    
    async def detect_security_patterns(
        self,
        vulnerabilities: List[Dict],
        target_data: Dict = None
    ) -> Dict:
        """Detecta padrões de segurança nos dados"""
        
        patterns = {
            "attack_patterns": [],
            "vulnerability_clusters": [],
            "trends": [],
            "anomalies": [],
            "recommendations": []
        }
        
        # Detecção de clusters de vulnerabilidades
        clusters = self.detect_vulnerability_clusters(vulnerabilities)
        patterns["vulnerability_clusters"] = clusters
        
        # Detecção de padrões de ataque
        attack_patterns = self.detect_attack_patterns(vulnerabilities)
        patterns["attack_patterns"] = attack_patterns
        
        # Análise de tendências
        trends = self.analyze_trends(vulnerabilities)
        patterns["trends"] = trends
        
        # Detecção de anomalias
        anomalies = await self.detect_anomalies(vulnerabilities)
        patterns["anomalies"] = anomalies
        
        # Geração de recomendações baseadas em padrões
        recommendations = self.generate_pattern_based_recommendations(patterns)
        patterns["recommendations"] = recommendations
        
        return patterns
    
    def detect_vulnerability_clusters(self, vulnerabilities: List[Dict]) -> List[Dict]:
        """Detecta clusters de vulnerabilidades similares"""
        
        clusters = []
        processed = set()
        
        for i, vuln1 in enumerate(vulnerabilities):
            if i in processed:
                continue
            
            cluster = {
                "vulnerabilities": [vuln1],
                "common_characteristics": {},
                "cluster_type": "unknown"
            }
            
            for j, vuln2 in enumerate(vulnerabilities[i+1:], i+1):
                if j in processed:
                    continue
                
                similarity = self.calculate_similarity(vuln1, vuln2)
                if similarity > 0.8:  # Threshold de similaridade
                    cluster["vulnerabilities"].append(vuln2)
                    processed.add(j)
            
            if len(cluster["vulnerabilities"]) > 1:
                cluster["common_characteristics"] = self.extract_common_characteristics(
                    cluster["vulnerabilities"]
                )
                cluster["cluster_type"] = self.classify_cluster(cluster)
                clusters.append(cluster)
            
            processed.add(i)
        
        return clusters
    
    def calculate_similarity(self, vuln1: Dict, vuln2: Dict) -> float:
        """Calcula similaridade entre duas vulnerabilidades"""
        
        similarity_score = 0.0
        total_factors = 0
        
        # Similaridade de tipo
        if vuln1.get("type") == vuln2.get("type"):
            similarity_score += 0.3
        total_factors += 0.3
        
        # Similaridade de severidade
        if vuln1.get("severity") == vuln2.get("severity"):
            similarity_score += 0.2
        total_factors += 0.2
        
        # Similaridade de localização
        if self.similar_location(vuln1.get("location"), vuln2.get("location")):
            similarity_score += 0.3
        total_factors += 0.3
        
        # Similaridade de ferramenta
        if vuln1.get("tool_detected") == vuln2.get("tool_detected"):
            similarity_score += 0.2
        total_factors += 0.2
        
        return similarity_score / total_factors if total_factors > 0 else 0.0
    
    def detect_attack_patterns(self, vulnerabilities: List[Dict]) -> List[Dict]:
        """Detecta padrões de ataque"""
        
        patterns = []
        
        # Padrão de SQL Injection
        sql_injection_vulns = [
            v for v in vulnerabilities 
            if "sql" in v.get("title", "").lower() or "injection" in v.get("title", "").lower()
        ]
        
        if len(sql_injection_vulns) >= 3:
            patterns.append({
                "pattern_type": "sql_injection_attack",
                "description": "Múltiplas vulnerabilidades de SQL injection detectadas",
                "vulnerabilities": sql_injection_vulns,
                "severity": "critical",
                "recommendation": "Implementar validação de entrada e prepared statements"
            })
        
        # Padrão de XSS
        xss_vulns = [
            v for v in vulnerabilities 
            if "xss" in v.get("title", "").lower() or "cross-site" in v.get("title", "").lower()
        ]
        
        if len(xss_vulns) >= 2:
            patterns.append({
                "pattern_type": "xss_attack",
                "description": "Múltiplas vulnerabilidades de XSS detectadas",
                "vulnerabilities": xss_vulns,
                "severity": "high",
                "recommendation": "Implementar output encoding e CSP headers"
            })
        
        return patterns
```

## 📊 Análise Preditiva

### **1. Sistema de Análise Preditiva**

#### **Preditor de Vulnerabilidades**
```python
# Sistema de análise preditiva
class PredictiveAnalyzer:
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.model = self.load_prediction_model()
    
    async def predict_vulnerabilities(
        self,
        target_data: Dict,
        historical_data: List[Dict] = None
    ) -> Dict:
        """Prediz vulnerabilidades futuras"""
        
        predictions = {
            "vulnerability_types": [],
            "risk_score_prediction": 0.0,
            "timeline": [],
            "confidence": 0.0,
            "recommendations": []
        }
        
        # Análise baseada em dados históricos
        if historical_data:
            historical_analysis = self.analyze_historical_patterns(historical_data)
            predictions["vulnerability_types"] = historical_analysis["predicted_types"]
            predictions["risk_score_prediction"] = historical_analysis["predicted_risk"]
        
        # Análise com IA
        ai_predictions = await self.ai_service.predict_vulnerabilities(target_data)
        if ai_predictions:
            predictions.update(ai_predictions)
        
        # Geração de timeline
        predictions["timeline"] = self.generate_vulnerability_timeline(predictions)
        
        # Recomendações preventivas
        predictions["recommendations"] = self.generate_preventive_recommendations(predictions)
        
        return predictions
    
    def analyze_historical_patterns(self, historical_data: List[Dict]) -> Dict:
        """Analisa padrões históricos para predição"""
        
        analysis = {
            "predicted_types": [],
            "predicted_risk": 0.0,
            "confidence": 0.0
        }
        
        # Análise de frequência de tipos de vulnerabilidade
        vuln_types = {}
        for vuln in historical_data:
            vuln_type = vuln.get("type", "unknown")
            vuln_types[vuln_type] = vuln_types.get(vuln_type, 0) + 1
        
        # Predizer tipos mais prováveis
        total_vulns = len(historical_data)
        for vuln_type, count in vuln_types.items():
            probability = count / total_vulns
            if probability > 0.1:  # Threshold de 10%
                analysis["predicted_types"].append({
                    "type": vuln_type,
                    "probability": probability,
                    "confidence": min(probability * 2, 1.0)
                })
        
        # Predizer score de risco
        risk_scores = [v.get("cvss_score", 0) for v in historical_data if v.get("cvss_score")]
        if risk_scores:
            analysis["predicted_risk"] = sum(risk_scores) / len(risk_scores)
        
        return analysis
```

## 🔄 Integração com Workflows

### **1. Automação de Análise**

#### **Workflow de Análise Automática**
```python
# Workflow de análise automática com IA
class AIAnalysisWorkflow:
    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.workflow_steps = self.define_workflow_steps()
    
    async def execute_analysis_workflow(
        self,
        scan_results: Dict,
        target_context: Dict
    ) -> Dict:
        """Executa workflow completo de análise"""
        
        workflow_result = {
            "workflow_id": str(uuid.uuid4()),
            "status": "completed",
            "steps": [],
            "final_analysis": {},
            "recommendations": [],
            "execution_time": 0
        }
        
        start_time = time.time()
        
        # Executar cada passo do workflow
        for step in self.workflow_steps:
            step_result = await self.execute_workflow_step(step, scan_results, target_context)
            workflow_result["steps"].append(step_result)
            
            # Verificar se deve continuar
            if step_result["status"] == "failed" and step.get("critical", False):
                workflow_result["status"] = "failed"
                break
        
        # Consolidação final
        if workflow_result["status"] == "completed":
            workflow_result["final_analysis"] = await self.consolidate_analysis(
                workflow_result["steps"]
            )
            workflow_result["recommendations"] = await self.generate_final_recommendations(
                workflow_result["final_analysis"]
            )
        
        workflow_result["execution_time"] = time.time() - start_time
        
        return workflow_result
    
    def define_workflow_steps(self) -> List[Dict]:
        """Define os passos do workflow"""
        return [
            {
                "name": "vulnerability_analysis",
                "description": "Análise individual de vulnerabilidades",
                "critical": True,
                "ai_model": "gpt4"
            },
            {
                "name": "pattern_detection",
                "description": "Detecção de padrões de ataque",
                "critical": False,
                "ai_model": "claude3_sonnet"
            },
            {
                "name": "false_positive_analysis",
                "description": "Análise de falsos positivos",
                "critical": False,
                "ai_model": "llama3.1"
            },
            {
                "name": "business_impact_analysis",
                "description": "Análise de impacto no negócio",
                "critical": True,
                "ai_model": "gpt4"
            },
            {
                "name": "recommendation_generation",
                "description": "Geração de recomendações",
                "critical": True,
                "ai_model": "claude3_sonnet"
            }
        ]
```

---

**Última atualização**: 21 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ Documentação de Integração LLM Completa 