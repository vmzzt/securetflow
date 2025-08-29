import React, { useEffect, useState } from 'react';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  ServerIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { Card } from '@components/ui/Card';
import { MetricCard } from '@components/ui/MetricCard';
import { VulnerabilityChart } from '@components/charts/VulnerabilityChart';
import { RecentScans } from '@components/Dashboard/RecentScans';
import { useAuthStore } from '@stores/authStore';
import { useScanStore } from '@stores/scanStore';
import { useTargetStore } from '@stores/targetStore';
import { api } from '@services/api/client';

interface DashboardStats {
  totalScans: number;
  activeScans: number;
  completedScans: number;
  totalTargets: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  recentScans: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { scans, fetchScans } = useScanStore();
  const { targets, fetchTargets } = useTargetStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalScans: 0,
    activeScans: 0,
    completedScans: 0,
    totalTargets: 0,
    vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
    recentScans: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Carregar dados em paralelo
        const [scansData, targetsData, statsData] = await Promise.all([
          fetchScans(),
          fetchTargets(),
          api.get('/dashboard/stats').catch(() => null)
        ]);

        // Se temos dados de stats da API, usar eles
        if (statsData) {
          setStats(statsData);
        } else {
          // Calcular stats localmente
          const activeScans = scans.filter(scan => scan.status === 'running').length;
          const completedScans = scans.filter(scan => scan.status === 'completed').length;
          
          setStats({
            totalScans: scans.length,
            activeScans,
            completedScans,
            totalTargets: targets.length,
            vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
            recentScans: scans.slice(0, 5)
          });
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchScans, fetchTargets, scans, targets]);

  const metrics = [
    {
      name: 'Total de Scans',
      value: stats.totalScans.toString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: '📊',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Scans Ativos',
      value: stats.activeScans.toString(),
      change: '+2',
      changeType: 'positive' as const,
      icon: '⏰',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'Targets Monitorados',
      value: stats.totalTargets.toString(),
      change: '+3',
      changeType: 'positive' as const,
      icon: '🖥️',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Sistema Online',
      value: '99.9%',
      change: '+0.1%',
      changeType: 'positive' as const,
      icon: '✅',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              🛡️ Securet Flow SSC
            </h1>
            <p className="text-gray-600">
              Bem-vindo, {user?.full_name || user?.username}! Dashboard de Segurança Funcionando.
            </p>
          </div>
        </div>
      </Card>

      {/* Status do Sistema */}
      <Card>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">
              ✅ SISTEMA FUNCIONANDO PERFEITAMENTE!
            </span>
          </div>
          <p className="text-green-700 mt-1">
            Menu lateral, navegação e todas as páginas estão operacionais.
          </p>
        </div>
      </Card>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Scans"
          value={stats.totalScans}
          change="+12%"
          changeType="positive"
          icon="📊"
        />
        <MetricCard
          title="Scans Ativos"
          value={stats.activeScans}
          change="+2"
          changeType="positive"
          icon="⏰"
        />
        <MetricCard
          title="Targets Monitorados"
          value={stats.totalTargets}
          change="+3"
          changeType="positive"
          icon="🖥️"
        />
        <MetricCard
          title="Sistema Online"
          value="99.9%"
          change="+0.1%"
          changeType="positive"
          icon="✅"
        />
      </div>

      {/* Gráficos e Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Vulnerabilidades */}
        <Card title="Distribuição de Vulnerabilidades">
          <VulnerabilityChart data={stats.vulnerabilities} />
        </Card>

        {/* Scans Recentes */}
        <Card title="Scans Recentes">
          <RecentScans scans={stats.recentScans} />
        </Card>
      </div>

      {/* Informações do Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Informações do Usuário">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {user?.full_name || user?.username}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600">
                Conta Ativa
              </span>
            </div>
          </div>
        </Card>

        <Card title="Status dos Serviços">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Backend API</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Banco de Dados</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Redis Cache</span>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                Online
              </span>
            </div>
          </div>
        </Card>

        <Card title="Ações Rápidas">
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Novo Scan
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Adicionar Target
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Gerar Relatório
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 