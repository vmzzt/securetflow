# SecureFlow SSC - Frontend POC

## 🚀 Visão Geral

O SecureFlow SSC é uma plataforma enterprise-grade para security testing e purple team operations. Esta é a versão POC (Proof of Concept) do frontend, demonstrando todas as funcionalidades planejadas com dados mock.

## 📋 Funcionalidades Implementadas

### ✅ Páginas Principais
- **Overview**: Dashboard principal com ações rápidas e status das ferramentas
- **Targets**: Gerenciamento de alvos com interface similar ao Burp Suite Enterprise
- **Scan Operations**: Operações de scan com visualizações detalhadas
- **Vulnerabilities**: Análise de vulnerabilidades com métricas e filtros
- **Reports**: Geração e visualização de relatórios
- **Tool Library**: Biblioteca com 100+ ferramentas de segurança
- **Analytics**: Visualizações e métricas de performance
- **AI Analysis**: Análise inteligente com insights automáticos
- **Integrations**: Integrações com ferramentas externas
- **Workflows**: Automação de processos de segurança
- **CI/CD Pipelines**: Pipelines de DevSecOps
- **Compliance**: Gestão de compliance e auditoria
- **Settings**: Configurações da plataforma
- **Profile**: Perfil do usuário e preferências

### ✅ Funcionalidades Avançadas
- **Quick Actions**: Ações rápidas com wizards interativos
- **Modal System**: Sistema de modais para configurações
- **Tool Status**: Status em tempo real das ferramentas
- **Responsive Design**: Interface responsiva para todos os dispositivos
- **Dark/Light Theme**: Suporte a temas claro e escuro
- **Notifications**: Sistema de notificações em tempo real
- **Search**: Busca global em toda a plataforma
- **Keyboard Shortcuts**: Atalhos de teclado para produtividade

## 🛠️ Como Executar

### Pré-requisitos
- Python 3.x (para servidor local)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Execução Local

1. **Navegue para o diretório frontend:**
   ```bash
   cd src/frontend
   ```

2. **Inicie o servidor local:**
   ```bash
   python -m http.server 8000
   ```

3. **Acesse a aplicação:**
   - Abra seu navegador
   - Acesse: `http://localhost:8000`
   - Para testar: `http://localhost:8000/test.html`

## 📁 Estrutura de Arquivos

```
src/frontend/
├── index.html              # Página principal
├── test.html               # Página de teste
├── README.md               # Este arquivo
├── js/
│   ├── core.js             # Classe principal OverviewApp
│   ├── pages.js            # Implementações das páginas
│   ├── modals.js           # Sistema de modais
│   ├── app.js              # Extensões da aplicação
│   └── utils.js            # Utilitários
├── styles/
│   ├── main.css            # Estilos principais
│   ├── dashboard.css       # Estilos do dashboard
│   ├── components.css      # Componentes reutilizáveis
│   ├── pages.css           # Estilos das páginas
│   └── animations.css      # Animações
└── assets/
    ├── favicon.ico         # Favicon
    ├── favicon-16x16.png   # Favicon 16x16
    └── favicon-32x32.png   # Favicon 32x32
```

## 🎨 Design System

### Cores
- **Primary**: `#6366f1` (Indigo)
- **Secondary**: `#8b5cf6` (Purple)
- **Success**: `#10b981` (Emerald)
- **Warning**: `#f59e0b` (Amber)
- **Danger**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

### Componentes
- **Cards**: Containers com sombras e bordas arredondadas
- **Buttons**: Botões com estados hover e focus
- **Modals**: Overlays para configurações e ações
- **Tables**: Tabelas responsivas com sorting
- **Charts**: Visualizações de dados (Chart.js)
- **Forms**: Formulários com validação

## 🔧 Arquitetura

### Padrões de Design
- **Singleton**: Classe principal OverviewApp
- **Observer**: Sistema de eventos e notificações
- **Factory**: Criação de modais e componentes
- **Strategy**: Diferentes tipos de scan e análise
- **Command**: Ações e operações da aplicação

### Estrutura JavaScript
```javascript
// Classe principal
class OverviewApp {
    constructor() {
        // Inicialização
    }
    
    // Métodos principais
    loadOverview() { /* ... */ }
    showModal() { /* ... */ }
    navigateToPage() { /* ... */ }
}

// Extensões via Object.assign
Object.assign(OverviewApp.prototype, {
    // Métodos específicos das páginas
    loadTargets() { /* ... */ },
    loadScans() { /* ... */ }
});
```

## 🚀 Funcionalidades Demonstradas

### 1. Overview Page
- **Quick Actions**: Botões para ações rápidas com wizards
- **Tool Status**: Status em tempo real das ferramentas
- **Recent Activity**: Atividades recentes da plataforma

### 2. Target Management
- **Target Cards**: Cards visuais com informações detalhadas
- **Risk Scoring**: Pontuação de risco por target
- **Quick Actions**: Scan, detalhes, configurações

### 3. Scan Operations
- **Active Scans**: Scans em andamento com progresso
- **New Scan**: Wizard para criação de novos scans
- **Scan History**: Histórico de scans executados

### 4. Vulnerability Analysis
- **Vulnerability Metrics**: Métricas por severidade
- **Detailed List**: Lista detalhada com filtros
- **Visualizations**: Gráficos e charts

### 5. Tool Library
- **100+ Tools**: Biblioteca completa de ferramentas
- **Tool Status**: Status online/offline
- **Configuration**: Configuração individual por ferramenta

## 🔍 Testando a Aplicação

### Teste Automático
1. Acesse `http://localhost:8000/test.html`
2. O teste automático verifica:
   - Carregamento da classe OverviewApp
   - Instanciação da aplicação
   - Métodos principais
   - Funcionalidades básicas

### Teste Manual
1. **Navegação**: Teste todas as páginas do menu
2. **Modais**: Clique nos botões de ação para abrir modais
3. **Responsividade**: Redimensione a janela do navegador
4. **Interações**: Teste botões, formulários e links

## 🐛 Solução de Problemas

### Erro: "OverviewApp is not defined"
- **Causa**: Ordem incorreta de carregamento dos scripts
- **Solução**: Verifique se `core.js` é carregado antes de `pages.js` e `modals.js`

### Erro: "Failed to load resource"
- **Causa**: Arquivos de favicon não encontrados
- **Solução**: Verifique se os arquivos em `assets/` existem

### Página não carrega
- **Causa**: Elemento `page-container` não encontrado
- **Solução**: Verifique se o HTML tem a estrutura correta

## 📈 Próximos Passos

### Backend Integration
- [ ] API REST para dados reais
- [ ] WebSocket para atualizações em tempo real
- [ ] Autenticação e autorização
- [ ] Persistência de dados

### Funcionalidades Avançadas
- [ ] Gráficos interativos com Chart.js
- [ ] Drag & drop para workflows
- [ ] Exportação de relatórios em PDF
- [ ] Integração com ferramentas externas

### Melhorias de UX
- [ ] Animações mais fluidas
- [ ] Feedback visual aprimorado
- [ ] Acessibilidade (WCAG 2.1)
- [ ] Performance otimizada

## 🤝 Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Implemente as mudanças
4. Teste localmente
5. Envie um pull request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas:
- Abra uma issue no GitHub
- Consulte a documentação técnica
- Entre em contato com a equipe de desenvolvimento

---

**SecureFlow SSC** - Enterprise-grade security testing platform 