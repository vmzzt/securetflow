import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@components/layout/Layout';
import LoadingSpinner from '@components/ui/LoadingSpinner';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@pages/Dashboard'));
const Analytics = React.lazy(() => import('@pages/Analytics'));
const Monitoring = React.lazy(() => import('@pages/Monitoring'));
const Targets = React.lazy(() => import('@pages/Targets'));
const Scans = React.lazy(() => import('@pages/Scans'));
const Vulnerabilities = React.lazy(() => import('@pages/Vulnerabilities'));
const Reports = React.lazy(() => import('@pages/Reports'));
const AIAnalysis = React.lazy(() => import('@pages/AIAnalysis'));
const ResultsByTarget = React.lazy(() => import('@pages/ResultsByTarget'));
const Tools = React.lazy(() => import('@pages/Tools'));
const Integrations = React.lazy(() => import('@pages/Integrations'));
const Workflows = React.lazy(() => import('@pages/Workflows'));
const Plugins = React.lazy(() => import('@pages/Plugins'));
const Pipelines = React.lazy(() => import('@pages/Pipelines'));
const Compliance = React.lazy(() => import('@pages/Compliance'));
const ShiftLeft = React.lazy(() => import('@pages/ShiftLeft'));
const Profile = React.lazy(() => import('@pages/Profile'));
const Settings = React.lazy(() => import('@pages/Settings'));
const Terminal = React.lazy(() => import('@pages/Terminal'));
const Login = React.lazy(() => import('@pages/Login'));

// Loading Component
const PageLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner size="lg" />
  </div>
);

const App: React.FC = () => {
  return (
    <Routes>
      {/* Login route - outside layout */}
      <Route path="/login" element={
        <Suspense fallback={<PageLoading />}>
          <Login />
        </Suspense>
      } />
      
      {/* All other routes with layout */}
      <Route path="/" element={<Layout />}>
        {/* Redirect root to dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard Routes */}
        <Route path="/dashboard" element={
          <Suspense fallback={<PageLoading />}>
            <Dashboard />
          </Suspense>
        } />
        
        <Route path="/analytics" element={
          <Suspense fallback={<PageLoading />}>
            <Analytics />
          </Suspense>
        } />
        
        <Route path="/monitoring" element={
          <Suspense fallback={<PageLoading />}>
            <Monitoring />
          </Suspense>
        } />
        
        {/* Target Management Routes */}
        <Route path="/targets" element={
          <Suspense fallback={<PageLoading />}>
            <Targets />
          </Suspense>
        } />
        
        {/* Scan Management Routes */}
        <Route path="/scans" element={
          <Suspense fallback={<PageLoading />}>
            <Scans />
          </Suspense>
        } />
        
        {/* Vulnerability Management Routes */}
        <Route path="/vulnerabilities" element={
          <Suspense fallback={<PageLoading />}>
            <Vulnerabilities />
          </Suspense>
        } />
        
        {/* Report Management Routes */}
        <Route path="/reports" element={
          <Suspense fallback={<PageLoading />}>
            <Reports />
          </Suspense>
        } />
        
        {/* AI Analysis Routes */}
        <Route path="/ai-analysis" element={
          <Suspense fallback={<PageLoading />}>
            <AIAnalysis />
          </Suspense>
        } />
        
        {/* Results Routes */}
        <Route path="/results" element={
          <Suspense fallback={<PageLoading />}>
            <ResultsByTarget />
          </Suspense>
        } />
        
        {/* Tool Management Routes */}
        <Route path="/tools" element={
          <Suspense fallback={<PageLoading />}>
            <Tools />
          </Suspense>
        } />
        
        {/* Integration Routes */}
        <Route path="/integrations" element={
          <Suspense fallback={<PageLoading />}>
            <Integrations />
          </Suspense>
        } />
        
        {/* Workflow Routes */}
        <Route path="/workflows" element={
          <Suspense fallback={<PageLoading />}>
            <Workflows />
          </Suspense>
        } />
        
        {/* Plugin Routes */}
        <Route path="/plugins" element={
          <Suspense fallback={<PageLoading />}>
            <Plugins />
          </Suspense>
        } />
        
        {/* Pipeline Routes */}
        <Route path="/pipelines" element={
          <Suspense fallback={<PageLoading />}>
            <Pipelines />
          </Suspense>
        } />
        
        {/* Compliance Routes */}
        <Route path="/compliance" element={
          <Suspense fallback={<PageLoading />}>
            <Compliance />
          </Suspense>
        } />
        
        {/* Shift Left Routes */}
        <Route path="/shift-left" element={
          <Suspense fallback={<PageLoading />}>
            <ShiftLeft />
          </Suspense>
        } />
        
        {/* User Management Routes */}
        <Route path="/profile" element={
          <Suspense fallback={<PageLoading />}>
            <Profile />
          </Suspense>
        } />
        
        <Route path="/settings" element={
          <Suspense fallback={<PageLoading />}>
            <Settings />
          </Suspense>
        } />
        
        {/* Terminal Routes */}
        <Route path="/terminal" element={
          <Suspense fallback={<PageLoading />}>
            <Terminal />
          </Suspense>
        } />
        
        {/* Catch all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default App; 