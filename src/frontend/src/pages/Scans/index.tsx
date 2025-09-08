import React, { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { scansApi, type ScanDTO, type ScanCreateDTO, type ScanUpdateDTO, type ScanType } from '@/services/api/scans';
import { targetsApi, type TargetDTO } from '@/services/api/targets';

const scanTypeOptions: ScanType[] = ['vulnerability', 'penetration', 'compliance', 'custom'];

const emptyForm: ScanCreateDTO = {
  name: '',
  description: '',
  target_id: 0,
  scan_type: 'vulnerability',
};

const Scans: React.FC = () => {
  const [items, setItems] = useState<ScanDTO[]>([]);
  const [targets, setTargets] = useState<TargetDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [form, setForm] = useState<ScanCreateDTO>(emptyForm);
  const [editing, setEditing] = useState<ScanDTO | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [scans, tgts] = await Promise.all([scansApi.list(), targetsApi.list()]);
      setItems(scans);
      setTargets(tgts);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar scans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => setForm({ ...emptyForm, target_id: targets[0]?.id ?? 0 });

  const handleCreate = async () => {
    if (!form.name || !form.target_id) return;
    setLoading(true);
    setError(null);
    try {
      const created = await scansApi.create(form);
      setItems((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      resetForm();
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Erro ao criar scan');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (s: ScanDTO) => {
    setEditing(s);
    setForm({
      name: s.name,
      description: s.description ?? '',
      target_id: s.target_id,
      scan_type: s.scan_type,
      config: s.config ?? undefined,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    const payload: ScanUpdateDTO = { name: form.name, description: form.description, scan_type: form.scan_type, config: form.config };
    setLoading(true);
    setError(null);
    try {
      const updated = await scansApi.update(editing.id, payload);
      setItems((prev) => prev.map((i) => (i.id === editing.id ? updated : i)));
      setIsEditOpen(false);
      setEditing(null);
      resetForm();
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Erro ao atualizar scan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    setLoading(true);
    setError(null);
    try {
      await scansApi.remove(editing.id);
      setItems((prev) => prev.filter((i) => i.id !== editing.id));
      setIsDeleteOpen(false);
      setEditing(null);
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Erro ao remover scan');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async (scan: ScanDTO) => {
    setLoading(true);
    setError(null);
    try {
      await scansApi.start(scan.id);
      setItems((prev) => prev.map((i) => (i.id === scan.id ? { ...i, status: 'running', started_at: new Date().toISOString() } : i)));
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Erro ao iniciar scan');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async (scan: ScanDTO) => {
    setLoading(true);
    setError(null);
    try {
      await scansApi.stop(scan.id);
      setItems((prev) => prev.map((i) => (i.id === scan.id ? { ...i, status: 'completed', completed_at: new Date().toISOString() } : i)));
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Erro ao parar scan');
    } finally {
      setLoading(false);
    }
  };

  const hasItems = items.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scans</h1>
          <p className="text-gray-600">Gerencie e monitore seus scans de segurança</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Novo Scan
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading && !hasItems ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : !hasItems ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum scan encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Comece criando seu primeiro scan de segurança.</p>
            <div className="mt-6">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" onClick={() => { resetForm(); setIsCreateOpen(true); }}>
                Criar Novo Scan
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alvo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{targets.find(t => t.id === s.target_id)?.name ?? s.target_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.scan_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">{s.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {s.status !== 'running' ? (
                        <button onClick={() => handleStart(s)} className="text-green-600 hover:text-green-800">Iniciar</button>
                      ) : (
                        <button onClick={() => handleStop(s)} className="text-yellow-600 hover:text-yellow-800">Parar</button>
                      )}
                      <button onClick={() => handleOpenEdit(s)} className="text-blue-600 hover:text-blue-900">Editar</button>
                      <button onClick={() => { setEditing(s); setIsDeleteOpen(true); }} className="text-red-600 hover:text-red-900">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title="Novo Scan">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input className="w-full px-3 py-2 border rounded-md" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alvo</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={form.target_id}
                onChange={(e) => setForm({ ...form, target_id: Number(e.target.value) })}
              >
                {targets.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={form.scan_type}
                onChange={(e) => setForm({ ...form, scan_type: e.target.value as ScanType })}
              >
                {scanTypeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea className="w-full px-3 py-2 border rounded-md" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setIsCreateOpen(false); resetForm(); }} className="px-4 py-2 rounded-md border">Cancelar</button>
            <button onClick={handleCreate} className="px-4 py-2 rounded-md bg-blue-600 text-white">Salvar</button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditing(null); resetForm(); }} title="Editar Scan">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input className="w-full px-3 py-2 border rounded-md" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select className="w-full px-3 py-2 border rounded-md" value={form.scan_type} onChange={(e) => setForm({ ...form, scan_type: e.target.value as ScanType })}>
                {scanTypeOptions.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea className="w-full px-3 py-2 border rounded-md" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setIsEditOpen(false); setEditing(null); resetForm(); }} className="px-4 py-2 rounded-md border">Cancelar</button>
            <button onClick={handleUpdate} className="px-4 py-2 rounded-md bg-blue-600 text-white">Salvar</button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setEditing(null); }} title="Remover Scan">
        <div className="space-y-4">
          <p>Tem certeza que deseja remover o scan <strong>{editing?.name}</strong>? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setIsDeleteOpen(false); setEditing(null); }} className="px-4 py-2 rounded-md border">Cancelar</button>
            <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white">Remover</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Scans; 