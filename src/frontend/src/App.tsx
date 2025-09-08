import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { useAuthStore } from '@stores/authStore';

const App: React.FC = () => {
  const element = useRoutes(routes);
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return element;
};

export default App; 