import React, { useEffect, useMemo, useState } from 'react';
import Modal from '@components/ui/Modal';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { reportsApi, type ReportDTO, type ReportCreateDTO } from '@services/api/reports';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportDTO | null>(null);
  const [createForm, setCreateForm] = useState<ReportCreateDTO>({ title: '', description: '', report_type: 'vulnerability', content: {}, scan_id: undefined });

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await reportsApi.list();
      setReports(data);
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const stats = useMemo(() => ({
    total: reports.length,
    generated: reports.filter(r => r.status !== 'draft').length,
    drafts: reports.filter(r => r.status === 'draft').length,
    sent: 0,
  }), [reports]);

  async function createReport() {
    try {
      const created = await reportsApi.create(createForm);
      setReports((prev) => [created, ...prev]);
      setShowCreateModal(false);
      setCreateForm({ title: '', description: '', report_type: 'vulnerability', content: {}, scan_id: undefined });
    } catch (e: any) {
      setError(e?.message || 'Falha ao criar relatório');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie e visualize relatórios de segurança</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>Criar Relatório</Button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total de Relatórios</h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Gerados</h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.generated}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rascunhos</h3>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.drafts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Enviados</h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.sent}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Relatórios Recentes</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="p-6">Carregando...</div>
          ) : reports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{report.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{report.report_type}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                    {report.status}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="ghost" onClick={() => setSelectedReport(report)}>Visualizar</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Criar Novo Relatório" size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Relatório</label>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={createForm.report_type} onChange={(e) => setCreateForm({ ...createForm, report_type: e.target.value as any })}>
              <option value="vulnerability">Relatório de Vulnerabilidades</option>
              <option value="compliance">Relatório de Compliance</option>
              <option value="audit">Relatório de Auditoria</option>
              <option value="custom">Relatório Customizado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
            <Input value={createForm.title} onChange={(e: any) => setCreateForm({ ...createForm, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descrição</label>
            <textarea className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white" value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
            <Button onClick={createReport}>Criar Relatório</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selectedReport} onClose={() => setSelectedReport(null)} title={selectedReport?.title || ''} size="xl">
        {selectedReport && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedReport.report_type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedReport.status}</p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Conteúdo do Relatório</h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{JSON.stringify(selectedReport.content, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Reports; 