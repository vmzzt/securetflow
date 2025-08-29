import React, { Suspense } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy load pages
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Login = React.lazy(() => import('../pages/Login'));
const Scans = React.lazy(() => import('../pages/Scans'));
const Targets = React.lazy(() => import('../pages/Targets'));
const Vulnerabilities = React.lazy(() => import('../pages/Vulnerabilities'));
const Reports = React.lazy(() => import('../pages/Reports'));
const Analytics = React.lazy(() => import('../pages/Analytics'));
const AIAnalysis = React.lazy(() => import('../pages/AIAnalysis'));
const Settings = React.lazy(() => import('../pages/Settings'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Docs = React.lazy(() => import('../pages/Docs'));
const Support = React.lazy(() => import('../pages/Support'));

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
      {
        path: 'scans',
        element: withSuspense(Scans),
      },
      {
        path: 'targets',
        element: withSuspense(Targets),
      },
      {
        path: 'vulnerabilities',
        element: withSuspense(Vulnerabilities),
      },
      {
        path: 'reports',
        element: withSuspense(Reports),
      },
      {
        path: 'analytics',
        element: withSuspense(Analytics),
      },
      {
        path: 'ai-analysis',
        element: withSuspense(AIAnalysis),
      },
      {
        path: 'settings',
        element: withSuspense(Settings),
      },
      {
        path: 'profile',
        element: withSuspense(Profile),
      },
      {
        path: 'docs',
        element: withSuspense(Docs),
      },
      {
        path: 'support',
        element: withSuspense(Support),
      },
    ],
  },
];

export default routes; 