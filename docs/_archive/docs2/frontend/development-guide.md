# Frontend Development Guide

## 🎨 Visão Geral

O frontend da Purple Team Platform V4 Master é uma aplicação web moderna construída com HTML5, CSS3 e JavaScript ES6+. A arquitetura segue padrões de Clean Code e Design Patterns para garantir manutenibilidade e escalabilidade.

## 🏗️ Arquitetura

### Estrutura de Arquivos
```
src/frontend/
├── 📄 index.html              # Página principal
├── 📄 package.json            # Dependências e scripts
├── 📄 Dockerfile              # Containerização
├── 📁 styles/                 # Estilos CSS
│   ├── 📄 main.css           # Estilos principais e variáveis
│   ├── 📄 dashboard.css      # Estilos do dashboard
│   ├── 📄 components.css     # Componentes reutilizáveis
│   ├── 📄 animations.css     # Animações e transições
│   └── 📄 pages.css          # Estilos específicos das páginas
├── 📁 js/                     # JavaScript modularizado
│   ├── 📄 app.js             # Aplicação principal
│   ├── 📄 pages.js           # Handlers de páginas
│   ├── 📄 modals.js          # Factory de modais
│   └── 📄 utils.js           # Utilitários e helpers
└── 📁 assets/                 # Recursos estáticos
    ├── 📄 favicon.ico        # Favicon
    └── 📄 images/            # Imagens
```

## 🎯 Design Patterns Aplicados

### 1. Singleton Pattern
- **Aplicação**: Classe principal `PurpleTeamApp`
- **Benefício**: Garante uma única instância da aplicação

### 2. Observer Pattern
- **Aplicação**: Sistema de eventos e listeners
- **Benefício**: Desacoplamento entre componentes

### 3. Factory Pattern
- **Aplicação**: Criação de modais dinâmicos
- **Benefício**: Flexibilidade na criação de componentes

### 4. Strategy Pattern
- **Aplicação**: Carregamento de páginas
- **Benefício**: Fácil extensão de novas páginas

### 5. Command Pattern
- **Aplicação**: Ações e shortcuts de teclado
- **Benefício**: Encapsulamento de comandos

## 🎨 Sistema de Design

### Variáveis CSS
```css
:root {
    /* Colors */
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    --danger-color: #ef4444;
    --warning-color: #f97316;
    --success-color: #22c55e;
    
    /* Typography */
    --font-family: 'Inter', sans-serif;
    --font-size-base: 1rem;
    
    /* Spacing */
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    
    /* Border Radius */
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
}
```

### Componentes Reutilizáveis
- **Cards**: `.card`, `.metric-card`, `.target-card`
- **Buttons**: `.btn`, `.btn--primary`, `.btn--outline`
- **Forms**: `.form-group`, `.form-control`
- **Modals**: `.modal-overlay`, `.modal-content`
- **Tables**: `.data-table`, `.table-header`

## 📱 Páginas Implementadas

### 1. Dashboard
- **Rota**: `/dashboard`
- **Funcionalidades**: Métricas, gráficos, ações rápidas
- **Componentes**: Charts, metric cards, activity list

### 2. Target Management
- **Rota**: `/targets`
- **Funcionalidades**: Lista de targets, adicionar target
- **Componentes**: Target cards, add target modal

### 3. Scan Operations
- **Rota**: `/scans`
- **Funcionalidades**: Scans ativos, histórico, novo scan
- **Componentes**: Scan items, progress bars

### 4. Vulnerabilities
- **Rota**: `/vulnerabilities`
- **Funcionalidades**: Lista de vulnerabilidades, filtros
- **Componentes**: Vulnerability items, severity badges

### 5. Reports
- **Rota**: `/reports`
- **Funcionalidades**: Relatórios gerados, exportação
- **Componentes**: Report cards, export buttons

### 6. Tools Library
- **Rota**: `/tools`
- **Funcionalidades**: Catálogo de ferramentas, status
- **Componentes**: Tool cards, status indicators

### 7. Analytics
- **Rota**: `/analytics`
- **Funcionalidades**: Gráficos e métricas avançadas
- **Componentes**: Chart containers, analytics cards

### 8. AI Analysis
- **Rota**: `/ai-analysis`
- **Funcionalidades**: Insights de IA, análise inteligente
- **Componentes**: AI insight cards, analysis progress

### 9. Integrations
- **Rota**: `/integrations`
- **Funcionalidades**: Status de integrações
- **Componentes**: Integration cards, status badges

### 10. Workflows
- **Rota**: `/workflows`
- **Funcionalidades**: Workflows automatizados
- **Componentes**: Workflow cards, step indicators

### 11. CI/CD Pipelines
- **Rota**: `/pipelines`
- **Funcionalidades**: Pipelines de DevSecOps
- **Componentes**: Pipeline cards, stage indicators

### 12. Compliance
- **Rota**: `/compliance`
- **Funcionalidades**: Status de compliance
- **Componentes**: Compliance cards, progress bars

### 13. Settings
- **Rota**: `/settings`
- **Funcionalidades**: Configurações da aplicação
- **Componentes**: Settings forms, configuration items

## 🔧 Funcionalidades Implementadas

### Navegação
- **Sidebar**: Menu lateral responsivo
- **Breadcrumbs**: Navegação hierárquica
- **Mobile Menu**: Menu para dispositivos móveis

### Interações
- **Modais**: Sistema de modais dinâmicos
- **Toasts**: Notificações temporárias
- **Loading States**: Estados de carregamento
- **Error Handling**: Tratamento de erros

### Performance
- **Lazy Loading**: Carregamento sob demanda
- **Debouncing**: Otimização de inputs
- **Caching**: Cache de dados
- **Minification**: Arquivos otimizados

## 🎨 Responsividade

### Breakpoints
```css
/* Mobile First */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

### Grid System
- **Flexbox**: Layout flexível
- **CSS Grid**: Layouts complexos
- **Auto-fit**: Responsividade automática

## 🚀 Como Executar

### Desenvolvimento Local
```bash
# Navegar para o diretório frontend
cd src/frontend

# Instalar dependências
npm install

# Executar servidor de desenvolvimento
npm run dev
```

### Produção
```bash
# Build da aplicação
npm run build

# Executar servidor de produção
npm start
```

### Docker
```bash
# Build da imagem
docker build -t purple-team-frontend .

# Executar container
docker run -p 3000:80 purple-team-frontend
```

## 🧪 Testes

### Estrutura de Testes
```
tests/
├── 📁 unit/                  # Testes unitários
├── 📁 integration/           # Testes de integração
├── 📁 e2e/                   # Testes end-to-end
└── 📁 visual/                # Testes visuais
```

### Executar Testes
```bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Testes e2e
npm run test:e2e
```

## 📦 Dependências

### Produção
- **Chart.js**: Gráficos interativos
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia

### Desenvolvimento
- **Serve**: Servidor de desenvolvimento
- **ESLint**: Linting de código
- **Prettier**: Formatação de código

## 🔄 Integração com Backend

### API Endpoints
```javascript
// Exemplo de integração
const api = {
    baseURL: '/api',
    endpoints: {
        targets: '/targets',
        scans: '/scans',
        vulnerabilities: '/vulnerabilities',
        reports: '/reports'
    }
};
```

### WebSocket
```javascript
// Conexão WebSocket para atualizações em tempo real
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    // Atualizar interface
};
```

## 🎯 Próximos Passos

### Melhorias Planejadas
1. **TypeScript**: Migração para TypeScript
2. **React**: Migração para React
3. **State Management**: Redux ou Zustand
4. **Testing**: Jest e React Testing Library
5. **PWA**: Progressive Web App
6. **Offline Support**: Funcionalidade offline
7. **Real-time Updates**: WebSocket completo
8. **Advanced Charts**: Gráficos mais avançados

### Roadmap
- **Q1 2025**: Migração para React
- **Q2 2025**: PWA e offline support
- **Q3 2025**: Advanced analytics
- **Q4 2025**: Mobile app

## 📚 Recursos

### Documentação
- [HTML5 Specification](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS3 Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript ES6+](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Chart.js Documentation](https://www.chartjs.org/docs/)

### Ferramentas
- [VS Code](https://code.visualstudio.com/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**Última atualização**: 21 de Agosto de 2025  
**Versão**: 4.0.0-master 