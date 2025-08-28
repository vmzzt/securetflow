# Securet Flow SSC - Frontend

Frontend moderno e responsivo para o sistema Securet Flow SSC, construído com React, TypeScript, Tailwind CSS e Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Zustand** - Gerenciamento de estado
- **Framer Motion** - Animações
- **Heroicons** - Ícones
- **Chart.js** - Gráficos
- **React Query** - Gerenciamento de dados

## 📦 Instalação

1. **Instalar dependências:**
   ```bash
   pnpm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   cp .env.example .env.local
   ```

3. **Iniciar servidor de desenvolvimento:**
   ```bash
   pnpm dev
   ```

## 🛠️ Scripts Disponíveis

- `pnpm dev` - Inicia o servidor de desenvolvimento
- `pnpm build` - Gera build de produção
- `pnpm preview` - Visualiza o build de produção
- `pnpm test` - Executa os testes
- `pnpm test:ui` - Executa os testes com interface
- `pnpm test:coverage` - Executa os testes com cobertura
- `pnpm lint` - Executa o linter
- `pnpm lint:fix` - Corrige problemas do linter
- `pnpm format` - Formata o código
- `pnpm type-check` - Verifica tipos TypeScript

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de UI base
│   └── layout/         # Componentes de layout
├── pages/              # Páginas da aplicação
├── stores/             # Stores Zustand
├── services/           # Serviços e APIs
├── hooks/              # Custom hooks
├── utils/              # Utilitários
├── types/              # Definições de tipos
├── styles/             # Estilos globais
└── tests/              # Testes
```

## 🎨 Tema e Estilização

O projeto utiliza Tailwind CSS com tema personalizado e suporte a modo escuro. As variáveis CSS estão definidas em `src/styles/globals.css`.

### Cores Principais
- **Primary**: Azul (#3b82f6)
- **Secondary**: Cinza (#6b7280)
- **Success**: Verde (#10b981)
- **Warning**: Amarelo (#f59e0b)
- **Danger**: Vermelho (#ef4444)

## 🔧 Configuração

### Vite
Configuração em `vite.config.ts` com:
- Aliases para imports
- Proxy para API
- Build optimization
- Test configuration

### TypeScript
Configuração em `tsconfig.json` com:
- Path mapping
- Strict mode
- Modern ES features

### ESLint & Prettier
- ESLint para linting
- Prettier para formatação
- Regras personalizadas para React/TypeScript

## 📱 Responsividade

O frontend é totalmente responsivo com breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🌙 Modo Escuro

Suporte completo a modo escuro com:
- Toggle automático
- Persistência de preferência
- Transições suaves

## 📊 Componentes de Gráficos

Utiliza Chart.js para visualizações:
- Gráficos de linha
- Gráficos de barras
- Gráficos de rosca
- Gráficos de área

## 🔐 Autenticação

Sistema de autenticação com:
- JWT tokens
- Refresh tokens
- Proteção de rotas
- Gerenciamento de sessão

## 🧪 Testes

Testes com Vitest e Testing Library:
- Testes unitários
- Testes de integração
- Testes de componentes
- Cobertura de código

## 📦 Build e Deploy

### Build de Produção
```bash
pnpm build
```

### Deploy
O build gera arquivos estáticos em `dist/` que podem ser servidos por qualquer servidor web.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato com a equipe Securet Flow SSC ou abra uma issue no repositório. 