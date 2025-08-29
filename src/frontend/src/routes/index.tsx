import React, { Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import LoadingSpinner from '@components/ui/LoadingSpinner';

// Lazy load pages
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Login = React.lazy(() => import('@pages/Login'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <LoadingSpinner size="lg" />
  </div>
);

// Route wrapper with Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

// Route configuration
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: withSuspense(Login),
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: withSuspense(Dashboard),
      },
    ],
  },
];

export default routes; 