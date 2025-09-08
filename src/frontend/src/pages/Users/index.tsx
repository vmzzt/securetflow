import React, { useEffect, useMemo, useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { usersApi, type UserDTO } from '@/services/api/users';
import { rolesApi, type RoleDTO } from '@/services/api/roles';

interface UserCreateForm {
  username: string;
  email: string;
  full_name?: string;
  password: string;
  role_id?: number;
  department?: string;
}

interface UserEditForm {
  username?: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
  role_id?: number;
  department?: string;
}

const Users: React.FC = () => {
  const [items, setItems] = useState<UserDTO[]>([]);
  const [roles, setRoles] = useState<RoleDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<UserCreateForm>({ username: '', email: '', password: '', full_name: '', role_id: undefined, department: '' });

  const [editItem, setEditItem] = useState<UserDTO | null>(null);
  const [editForm, setEditForm] = useState<UserEditForm>({});

  const filtered = useMemo(() => {
    return items.filter((u) => `${u.username} ${u.email} ${u.full_name || ''}`.toLowerCase().includes(search.toLowerCase()));
  }, [items, search]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [data, roleList] = await Promise.all([usersApi.list(), rolesApi.list()]);
      setItems(data);
      setRoles(roleList);
    } catch (e: any) {
      setError(e?.message || 'Falha ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createUser() {
    try {
      const created = await usersApi.create(createForm as any);
      setItems((prev) => [created, ...prev]);
      setIsCreateOpen(false);
      setCreateForm({ username: '', email: '', password: '', full_name: '', role_id: undefined, department: '' });
    } catch (e: any) {
      setError(e?.message || 'Falha ao criar usuário');
    }
  }

  function openEdit(u: UserDTO) {
    setEditItem(u);
    setEditForm({ username: u.username, email: u.email, full_name: u.full_name || '', is_active: u.is_active, role_id: u.role_id || undefined, department: u.department || '' });
  }

  async function saveEdit() {
    if (!editItem) return;
    try {
      const updated = await usersApi.update(editItem.id, editForm as any);
      setItems((prev) => prev.map((u) => (u.id === editItem.id ? updated : u)));
      setEditItem(null);
      setEditForm({});
    } catch (e: any) {
      setError(e?.message || 'Falha ao salvar alterações');
    }
  }

  async function removeUser(id: number) {
    if (!confirm('Excluir usuário?')) return;
    try {
      await usersApi.remove(id);
      setItems((prev) => prev.filter((u) => u.id !== id));
    } catch (e: any) {
      setError(e?.message || 'Falha ao excluir usuário');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie usuários e permissões</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>Adicionar Usuário</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <Input placeholder="Buscar por nome ou email" value={search} onChange={(e: any) => setSearch(e.target.value)} />
        <Button variant="secondary" onClick={load} disabled={loading}>Atualizar</Button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departamento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td className="px-6 py-4" colSpan={6}>Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-6 py-4" colSpan={6}>Nenhum usuário</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{u.full_name || u.username}</div>
                    <div className="text-xs text-gray-500">@{u.username}</div>
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 capitalize">{(() => roles.find(r => r.id === u.role_id)?.name || '—')()}</td>
                  <td className="px-6 py-4">{u.department || '-'}</td>
                  <td className="px-6 py-4">{u.is_active ? 'Ativo' : 'Inativo'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" onClick={() => openEdit(u)}>Editar</Button>
                      <Button variant="destructive" onClick={() => removeUser(u.id)}>Excluir</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Novo Usuário">
        <div className="space-y-3">
          <Input placeholder="Nome completo" value={createForm.full_name} onChange={(e: any) => setCreateForm({ ...createForm, full_name: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Username" value={createForm.username} onChange={(e: any) => setCreateForm({ ...createForm, username: e.target.value })} />
            <Input placeholder="Email" type="email" value={createForm.email} onChange={(e: any) => setCreateForm({ ...createForm, email: e.target.value })} />
          </div>
          <Input placeholder="Senha" type="password" value={createForm.password} onChange={(e: any) => setCreateForm({ ...createForm, password: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select className="border rounded-md px-3 py-2" value={createForm.role_id ?? ''} onChange={(e) => setCreateForm({ ...createForm, role_id: e.target.value ? Number(e.target.value) : undefined })}>
              <option value="">Função</option>
              {roles.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}
            </select>
            <Input placeholder="Departamento" value={createForm.department} onChange={(e: any) => setCreateForm({ ...createForm, department: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
            <Button onClick={createUser} disabled={loading}>Criar</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Editar Usuário">
        <div className="space-y-3">
          <Input placeholder="Nome completo" value={editForm.full_name || ''} onChange={(e: any) => setEditForm({ ...editForm, full_name: e.target.value })} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input placeholder="Username" value={editForm.username || ''} onChange={(e: any) => setEditForm({ ...editForm, username: e.target.value })} />
            <Input placeholder="Email" type="email" value={editForm.email || ''} onChange={(e: any) => setEditForm({ ...editForm, email: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select className="border rounded-md px-3 py-2" value={editForm.role_id ?? ''} onChange={(e) => setEditForm({ ...editForm, role_id: e.target.value ? Number(e.target.value) : undefined })}>
              <option value="">Função</option>
              {roles.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}
            </select>
            <Input placeholder="Departamento" value={editForm.department || ''} onChange={(e: any) => setEditForm({ ...editForm, department: e.target.value })} />
            <select className="border rounded-md px-3 py-2" value={editForm.is_active ? '1' : '0'} onChange={(e) => setEditForm({ ...editForm, is_active: e.target.value === '1' })}>
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setEditItem(null)}>Cancelar</Button>
            <Button onClick={saveEdit} disabled={loading}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users; 