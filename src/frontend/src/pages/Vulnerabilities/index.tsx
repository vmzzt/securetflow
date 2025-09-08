import React, { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { vulnerabilitiesApi, type VulnerabilityDTO, type VulnerabilityCreateDTO, type VulnerabilitySeverity, type VulnerabilityStatus } from '@/services/api/vulnerabilities';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const severityOptions: VulnerabilitySeverity[] = ['critical', 'high', 'medium', 'low'];
const statusOptions: VulnerabilityStatus[] = ['open', 'in-progress', 'resolved', 'false-positive'];

const Vulnerabilities: React.FC = () => {
  const [items, setItems] = useState<VulnerabilityDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState<VulnerabilitySeverity | ''>('');
  const [status, setStatus] = useState<VulnerabilityStatus | ''>('');

  const [viewItem, setViewItem] = useState<VulnerabilityDTO | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState<VulnerabilityCreateDTO>({
    title: '',
    description: '',
    severity: 'medium',
    category: '',
    cvss: undefined,
    status: 'open',
    solution: '',
    references: [],
    cve: '',
    target_id: undefined,
  });

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const matchesSearch = [it.title, it.description || '', it.category || '', it.cve || '']
        .join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesSeverity = !severity || it.severity === severity;
      const matchesStatus = !status || it.status === status;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [items, search, severity, status]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await vulnerabilitiesApi.list({ severity: severity || undefined, status: status || undefined });
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar vulnerabilidades');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [severity, status]);

  async function createItem() {
    setLoading(true);
    try {
      const created = await vulnerabilitiesApi.create(form);
      setItems((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      setForm({ ...form, title: '', description: '' });
    } catch (e: any) {
      setError(e?.message || 'Falha ao criar vulnerabilidade');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, newStatus: VulnerabilityStatus) {
    try {
      const updated = await vulnerabilitiesApi.update(id, { status: newStatus });
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
    } catch (e: any) {
      setError(e?.message || 'Falha ao atualizar status');
    }
  }

  async function removeItem(id: number) {
    if (!confirm('Remover vulnerabilidade?')) return;
    try {
      await vulnerabilitiesApi.remove(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch (e: any) {
      setError(e?.message || 'Falha ao remover');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vulnerabilidades</h1>
          <p className="text-gray-600">Gerencie e acompanhe vulnerabilidades detectadas</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Nova Vulnerabilidade</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <Input placeholder="Buscar por título, categoria ou CVE" value={search} onChange={(e: any) => setSearch(e.target.value)} />
        <select className="border rounded-md px-3 py-2" value={severity} onChange={(e) => setSeverity((e.target.value || '') as any)}>
          <option value="">Severidade (todas)</option>
          {severityOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
        </select>
        <select className="border rounded-md px-3 py-2" value={status} onChange={(e) => setStatus((e.target.value || '') as any)}>
          <option value="">Status (todos)</option>
          {statusOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
        </select>
        <Button variant="secondary" onClick={load} disabled={loading}>Atualizar</Button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CVSS</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td className="px-6 py-4" colSpan={6}>Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-6 py-4" colSpan={6}>Nenhum item encontrado</td></tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 max-w-xs">
                    <div className="font-medium text-gray-900 truncate">{v.title}</div>
                    {v.cve && <div className="text-xs text-gray-500">{v.cve}</div>}
                  </td>
                  <td className="px-6 py-4 capitalize">{v.severity}</td>
                  <td className="px-6 py-4">{v.cvss ?? '-'}</td>
                  <td className="px-6 py-4">{v.category ?? '-'}</td>
                  <td className="px-6 py-4 capitalize">{v.status}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" onClick={() => setViewItem(v)}>Ver</Button>
                      <Button variant="ghost" onClick={() => updateStatus(v.id, 'in-progress')}>Em andamento</Button>
                      <Button variant="ghost" onClick={() => updateStatus(v.id, 'resolved')}>Resolver</Button>
                      <Button variant="ghost" onClick={() => updateStatus(v.id, 'false-positive')}>Falso positivo</Button>
                      <Button variant="destructive" onClick={() => removeItem(v.id)}>Excluir</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Nova Vulnerabilidade">
        <div className="space-y-3">
          <Input placeholder="Título" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
          <textarea className="w-full border rounded-md px-3 py-2" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select className="border rounded-md px-3 py-2" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value as VulnerabilitySeverity })}>
              {severityOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
            <select className="border rounded-md px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as VulnerabilityStatus })}>
              {statusOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Categoria" value={form.category} onChange={(e: any) => setForm({ ...form, category: e.target.value })} />
            <Input placeholder="CVE (opcional)" value={form.cve} onChange={(e: any) => setForm({ ...form, cve: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="CVSS (0-10)" type="number" value={form.cvss as any} onChange={(e: any) => setForm({ ...form, cvss: e.target.value ? Number(e.target.value) : undefined })} />
            <Input placeholder="Target ID (opcional)" type="number" value={form.target_id as any} onChange={(e: any) => setForm({ ...form, target_id: e.target.value ? Number(e.target.value) : undefined })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button onClick={createItem} disabled={loading}>Criar</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!viewItem} onClose={() => setViewItem(null)} title={viewItem?.title || ''} size="lg">
        {viewItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Severidade</div>
                <div className="capitalize">{viewItem.severity}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Status</div>
                <div className="capitalize">{viewItem.status}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Categoria</div>
                <div>{viewItem.category || '-'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">CVSS</div>
                <div>{viewItem.cvss ?? '-'}</div>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Descrição</div>
              <div className="whitespace-pre-wrap">{viewItem.description || '-'}</div>
            </div>
            {viewItem.solution && (
              <div>
                <div className="text-sm text-gray-500">Solução</div>
                <div className="whitespace-pre-wrap">{viewItem.solution}</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Vulnerabilities; 