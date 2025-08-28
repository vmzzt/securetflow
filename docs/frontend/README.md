# 🎨 Securet Flow SSC - Frontend Documentation

## 🌐 Visão Geral do Frontend

O frontend do **Securet Flow SSC** é construído com React 18, TypeScript, e tecnologias modernas para criar uma interface enterprise-grade, responsiva e performática para security testing e purple team operations.

## 🛠️ Stack Tecnológica

### **Core Framework**
```typescript
// React 18 com TypeScript
import React from 'react';
import { createRoot } from 'react-dom/client';

// Vite - Build tool moderno
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
});
```

### **Styling & UI**
```typescript
// Tailwind CSS - Utility-first CSS
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        security: {
          low: '#10b981',
          medium: '#f59e0b',
          high: '#ef4444',
          critical: '#7c2d12',
        },
      },
    },
  },
  plugins: [],
};

// Framer Motion - Animações
import { motion } from 'framer-motion';

const AnimatedCard = motion.div;
```

### **State Management**
```typescript
// Zustand - State management simples
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### **Data Fetching**
```typescript
// React Query - Data fetching e cache
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Custom hook para targets
export const useTargets = (filters?: TargetFilters) => {
  return useQuery({
    queryKey: ['targets', filters],
    queryFn: () => api.getTargets(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook para scans
export const useScans = (targetId?: string) => {
  return useQuery({
    queryKey: ['scans', targetId],
    queryFn: () => api.getScans({ targetId }),
    refetchInterval: 30000, // 30 seconds
  });
};
```

## 📁 Estrutura do Projeto

```
src/frontend/
├── public/
│   ├── favicon.ico
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── index.html
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Componente principal
│   ├── components/
│   │   ├── ui/                  # Componentes base
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── index.ts
│   │   ├── layout/              # Componentes de layout
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   ├── charts/              # Componentes de gráficos
│   │   │   ├── LineChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── DoughnutChart.tsx
│   │   │   └── index.ts
│   │   └── forms/               # Componentes de formulário
│   │       ├── TargetForm.tsx
│   │       ├── ScanForm.tsx
│   │       └── index.ts
│   ├── pages/                   # Páginas da aplicação
│   │   ├── Dashboard/
│   │   │   ├── index.tsx
│   │   │   └── components/
│   │   ├── Targets/
│   │   │   ├── index.tsx
│   │   │   ├── TargetCard.tsx
│   │   │   └── TargetModal.tsx
│   │   ├── Scans/
│   │   │   ├── index.tsx
│   │   │   ├── ScanProgress.tsx
│   │   │   └── ScanResults.tsx
│   │   ├── Vulnerabilities/
│   │   │   ├── index.tsx
│   │   │   ├── VulnerabilityTable.tsx
│   │   │   └── VulnerabilityDetails.tsx
│   │   ├── Reports/
│   │   │   ├── index.tsx
│   │   │   └── ReportGenerator.tsx
│   │   ├── Analytics/
│   │   │   ├── index.tsx
│   │   │   └── AnalyticsCharts.tsx
│   │   ├── Settings/
│   │   │   ├── index.tsx
│   │   │   ├── ProfileSettings.tsx
│   │   │   └── SystemSettings.tsx
│   │   └── Auth/
│   │       ├── Login.tsx
│   │       ├── Register.tsx
│   │       └── ForgotPassword.tsx
│   ├── hooks/                   # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   └── useWebSocket.ts
│   ├── services/                # Serviços de API
│   │   ├── api.ts               # Cliente HTTP base
│   │   ├── auth.ts              # Serviços de autenticação
│   │   ├── targets.ts           # Serviços de targets
│   │   ├── scans.ts             # Serviços de scans
│   │   ├── vulnerabilities.ts   # Serviços de vulnerabilidades
│   │   └── reports.ts           # Serviços de relatórios
│   ├── stores/                  # Stores Zustand
│   │   ├── authStore.ts
│   │   ├── themeStore.ts
│   │   ├── notificationStore.ts
│   │   └── index.ts
│   ├── types/                   # Tipos TypeScript
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── target.ts
│   │   ├── scan.ts
│   │   ├── vulnerability.ts
│   │   └── index.ts
│   ├── utils/                   # Utilitários
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── index.ts
│   ├── styles/                  # Estilos globais
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── index.css
│   └── tests/                   # Testes
│       ├── setup.ts
│       ├── components/
│       ├── pages/
│       └── utils/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```

## 🎨 Sistema de Design

### **Design Tokens**
```typescript
// design-tokens.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  security: {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#7c2d12',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
};
```

### **Componentes Base**
```typescript
// Button.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

## 📊 Componentes de Gráficos

### **Chart.js Integration**
```typescript
// LineChart.tsx
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
  title?: string;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({ data, title, height = 300 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line options={options} data={data} />
    </div>
  );
};
```

## 🔐 Sistema de Autenticação

### **Auth Context**
```typescript
// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, isAuthenticated, login: storeLogin, logout: storeLogout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar token na inicialização
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await api.getProfile();
          storeLogin(userData, token);
        } catch (error) {
          storeLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token, storeLogin, storeLogout]);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    storeLogin(response.user, response.access_token);
  };

  const logout = () => {
    storeLogout();
    api.logout();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 🌐 Roteamento

### **React Router Setup**
```typescript
// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Layout } from '@/components/layout/Layout';

// Pages
import { Dashboard } from '@/pages/Dashboard';
import { Targets } from '@/pages/Targets';
import { Scans } from '@/pages/Scans';
import { Vulnerabilities } from '@/pages/Vulnerabilities';
import { Reports } from '@/pages/Reports';
import { Analytics } from '@/pages/Analytics';
import { Settings } from '@/pages/Settings';
import { Login } from '@/pages/Auth/Login';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="targets" element={<Targets />} />
              <Route path="scans" element={<Scans />} />
              <Route path="vulnerabilities" element={<Vulnerabilities />} />
              <Route path="reports" element={<Reports />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
};
```

## 📱 Responsividade

### **Breakpoints**
```typescript
// breakpoints.ts
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// useBreakpoint hook
import { useState, useEffect } from 'react';

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('lg');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else if (width < 1280) setBreakpoint('xl');
      else setBreakpoint('2xl');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};
```

## 🎨 Tema Escuro/Claro

### **Theme Provider**
```typescript
// ThemeProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useThemeStore } from '@/stores/themeStore';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

## 🧪 Testing

### **Vitest Setup**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

// Test setup
// src/tests/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

### **Component Testing**
```typescript
// Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });
});
```

## 🚀 Build e Deploy

### **Vite Configuration**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
});
```

### **Docker Configuration**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

## 📚 Documentação Adicional

### **Links Úteis**
- [🏗️ Arquitetura Frontend](architecture.md)
- [🎨 Sistema de Design](design-system.md)
- [🔧 Componentes](components.md)
- [🚀 Deploy](deployment.md)

### **APIs**
- [📊 API Integration](../api/README.md)
- [🔗 Backend Communication](../backend/README.md)

### **Ferramentas**
- [🛠️ Ferramentas de Desenvolvimento](../tools/README.md)

---

**Última atualização**: 27 de Agosto de 2025  
**Versão**: 4.0.0-master  
**Status**: ✅ **Frontend Completo e Documentado** 