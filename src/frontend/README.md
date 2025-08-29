# Securet Flow SSC - Frontend

Frontend da aplicação Securet Flow SSC, uma plataforma de segurança e compliance.

## 🚀 Tecnologias

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **React Query** - Cache e sincronização de dados
- **Axios** - Cliente HTTP
- **Framer Motion** - Animações
- **Vitest** - Testes unitários

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

## 🛠️ Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Verificar tipos TypeScript
npm run type-check

# Executar linting
npm run lint

# Formatar código
npm run format

# Executar testes
npm run test
```

## 🏗️ Build

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🐳 Docker

```bash
# Build da imagem
docker build -t securet-flow-frontend .

# Executar container
docker run -p 80:80 securet-flow-frontend
```

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── hooks/         # Custom hooks
├── stores/        # Gerenciamento de estado (Zustand)
├── services/      # Serviços de API
├── utils/         # Utilitários
├── types/         # Definições de tipos
├── config/        # Configurações
├── styles/        # Estilos globais
└── tests/         # Testes
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Securet Flow SSC
VITE_APP_VERSION=1.0.0
VITE_DEBUG=false
VITE_ENABLE_ANALYTICS=false
```

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run test` - Executar testes
- `npm run lint` - Verificar código
- `npm run format` - Formatar código
- `npm run type-check` - Verificar tipos

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Executar testes com UI
npm run test:ui

# Executar testes com coverage
npm run test:coverage
```

## 📝 Convenções

### Nomenclatura

- **Componentes**: PascalCase (ex: `UserProfile.tsx`)
- **Hooks**: camelCase com prefixo `use` (ex: `useAuth.ts`)
- **Utilitários**: camelCase (ex: `formatDate.ts`)
- **Tipos**: PascalCase (ex: `User.ts`)

### Estrutura de Componentes

```tsx
import React from 'react';

interface ComponentProps {
  // Props aqui
}

export const Component: React.FC<ComponentProps> = ({ /* props */ }) => {
  // Lógica aqui
  
  return (
    // JSX aqui
  );
};
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../LICENSE) para mais detalhes.

## 🆘 Suporte

Para suporte, envie um email para suporte@securetflow.com ou abra uma issue no repositório. 