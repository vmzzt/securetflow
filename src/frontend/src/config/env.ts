// Environment variable validation

interface EnvConfig {
  VITE_API_URL: string;
  VITE_APP_NAME: string;
  VITE_APP_VERSION: string;
  VITE_DEBUG: boolean;
  VITE_ENABLE_ANALYTICS: boolean;
}

const requiredEnvVars = [
  'VITE_API_URL',
] as const;

// Validate required environment variables
for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    console.warn(`Missing environment variable: ${envVar}`);
  }
}

export const env: EnvConfig = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME || 'Securet Flow SSC',
  VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  VITE_DEBUG: import.meta.env.VITE_DEBUG === 'true',
  VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
};

// Validate API URL format
try {
  new URL(env.VITE_API_URL);
} catch {
  console.warn(`Invalid VITE_API_URL format: ${env.VITE_API_URL}`);
}

export default env; 