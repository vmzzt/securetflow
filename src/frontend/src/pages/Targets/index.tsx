import React, { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { targetsApi, type TargetDTO, type TargetCreateDTO, type TargetUpdateDTO } from '@/services/api/targets';

const emptyForm: TargetCreateDTO = {
  name: '',
  host: '',
  port: undefined,
  protocol: 'http',
  description: ''
};

const protocolOptions = ['http', 'https', 'ftp', 'ssh', 'tcp', 'udp'];

const Targets: React.FC = () => {
  const [items, setItems] = useState<TargetDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [form, setForm] = useState<TargetCreateDTO>(emptyForm);
  const [editing, setEditing] = useState<TargetDTO | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await targetsApi.list();
      setItems(data);
    } catch (e: any) {
      setError(e?.message || 'Erro ao carregar targets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => setForm(emptyForm);

  const handleCreate = async () => {
    if (!form.name || !form.host) return;
    setLoading(true);
    setError(null);
    try {
      const created = await targetsApi.create(form);
      setItems((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      resetForm();
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Erro ao criar target');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (t: TargetDTO) => {
    setEditing(t);
    setForm({
      name: t.name,
      host: t.host,
      port: t.port ?? undefined,
      protocol: t.protocol,
      description: t.description ?? ''
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editing) return;
    const payload: TargetUpdateDTO = { ...form };
    setLoading(true);
    setError(null);
    try {
      const updated = await targetsApi.update(editing.id, payload);
      setItems((prev) => prev.map((i) => (i.id === editing.id ? updated : i)));
      setIsEditOpen(false);
      setEditing(null);
      resetForm();
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Erro ao atualizar target');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    setLoading(true);
    setError(null);
    try {
      await targetsApi.remove(editing.id);
      setItems((prev) => prev.filter((i) => i.id !== editing.id));
      setIsDeleteOpen(false);
      setEditing(null);
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Erro ao remover target');
    } finally {
      setLoading(false);
    }
  };

  const hasItems = items.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Targets</h1>
          <p className="text-gray-600">Gerencie seus alvos de segurança</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Adicionar Target
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum target encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Adicione seus primeiros alvos para começar a escanear.</p>
            <div className="mt-6">
              <button onClick={() => setIsCreateOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Adicionar Target
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Host</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocolo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((t) => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.host}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 uppercase">{t.protocol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.port ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{t.description ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => { setEditing(t); setIsDeleteOpen(true); }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); resetForm(); }} title="Novo Target">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                className="w-full px-3 py-2 border rounded-md"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Servidor Web"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
              <input
                className="w-full px-3 py-2 border rounded-md"
                value={form.host}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
                placeholder="exemplo.com ou 10.0.0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protocolo</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={form.protocol}
                onChange={(e) => setForm({ ...form, protocol: e.target.value })}
              >
                {protocolOptions.map((p) => (
                  <option key={p} value={p}>{p.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Porta</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={form.port ?? ''}
                onChange={(e) => setForm({ ...form, port: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="80"
                min={1}
                max={65535}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detalhes do alvo (opcional)"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setIsCreateOpen(false); resetForm(); }} className="px-4 py-2 rounded-md border">Cancelar</button>
            <button onClick={handleCreate} className="px-4 py-2 rounded-md bg-blue-600 text-white">Salvar</button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setEditing(null); resetForm(); }} title="Editar Target">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                className="w-full px-3 py-2 border rounded-md"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
              <input
                className="w-full px-3 py-2 border rounded-md"
                value={form.host}
                onChange={(e) => setForm({ ...form, host: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protocolo</label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={form.protocol}
                onChange={(e) => setForm({ ...form, protocol: e.target.value })}
              >
                {protocolOptions.map((p) => (
                  <option key={p} value={p}>{p.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Porta</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={form.port ?? ''}
                onChange={(e) => setForm({ ...form, port: e.target.value ? Number(e.target.value) : undefined })}
                min={1}
                max={65535}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setIsEditOpen(false); setEditing(null); resetForm(); }} className="px-4 py-2 rounded-md border">Cancelar</button>
            <button onClick={handleUpdate} className="px-4 py-2 rounded-md bg-blue-600 text-white">Salvar</button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => { setIsDeleteOpen(false); setEditing(null); }} title="Remover Target">
        <div className="space-y-4">
          <p>Tem certeza que deseja remover o target <strong>{editing?.name}</strong>? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end gap-2">
            <button onClick={() => { setIsDeleteOpen(false); setEditing(null); }} className="px-4 py-2 rounded-md border">Cancelar</button>
            <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white">Remover</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Targets; 