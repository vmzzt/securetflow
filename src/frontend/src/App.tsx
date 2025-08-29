import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@components/layout/Layout';

// Importações diretas para evitar problemas de lazy loading
import Dashboard from '@pages/Dashboard';
import Analytics from '@pages/Analytics';
import Monitoring from '@pages/Monitoring';
import Targets from '@pages/Targets';
import Scans from '@pages/Scans';
import Vulnerabilities from '@pages/Vulnerabilities';
import Reports from '@pages/Reports';
import AIAnalysis from '@pages/AIAnalysis';
import ResultsByTarget from '@pages/ResultsByTarget';
import Tools from '@pages/Tools';
import Integrations from '@pages/Integrations';
import Workflows from '@pages/Workflows';
import Plugins from '@pages/Plugins';
import Pipelines from '@pages/Pipelines';
import Compliance from '@pages/Compliance';
import ShiftLeft from '@pages/ShiftLeft';
import Profile from '@pages/Profile';
import Settings from '@pages/Settings';
import Terminal from '@pages/Terminal';
import Login from '@pages/Login';

const App: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={<Login />} 
      />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="targets" element={<Targets />} />
        <Route path="scans" element={<Scans />} />
        <Route path="vulnerabilities" element={<Vulnerabilities />} />
        <Route path="reports" element={<Reports />} />
        <Route path="ai-analysis" element={<AIAnalysis />} />
        <Route path="results" element={<ResultsByTarget />} />
        <Route path="tools" element={<Tools />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="workflows" element={<Workflows />} />
        <Route path="plugins" element={<Plugins />} />
        <Route path="pipelines" element={<Pipelines />} />
        <Route path="compliance" element={<Compliance />} />
        <Route path="shift-left" element={<ShiftLeft />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="terminal" element={<Terminal />} />
      </Route>
    </Routes>
  );
};

export default App; 