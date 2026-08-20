import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import api, { errorMessage } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { UserStatus } from '../context/AuthContext';

interface Member {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  lastLoginAt?: string;
}

const FILTROS: { key: UserStatus | 'todos'; label: string }[] = [
  { key: 'pendente', label: 'Pendentes' },
  { key: 'aprovado', label: 'Aprovados' },
  { key: 'admin', label: 'Admins' },
  { key: 'todos', label: 'Todos' },
];

const CORES: Record<UserStatus, string> = {
  pendente: 'bg-amber-500/15 text-amber-500',
  aprovado: 'bg-emerald-500/15 text-emerald-500',
  admin: 'bg-primary/20 text-primary-light',
  recusado: 'bg-red-500/15 text-red-400',
};

const Admin: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [filtro, setFiltro] = useState<UserStatus | 'todos'>('pendente');
  const [salvando, setSalvando] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<Member[]>('/admin/members')
      .then((res) => {
        if (!cancelled) setMembers(res.data);
      })
      .catch(() => {
        if (!cancelled) setErro(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const alterar = async (member: Member, status: UserStatus) => {
    setSalvando(member.id);
    try {
      await api.patch(`/admin/members/${member.id}/status`, { status });
      setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, status } : m)));
      toast.current?.show({
        severity: 'success',
        summary: 'Pronto',
        detail: `${member.name.split(' ')[0]} agora está como ${status}.`,
        life: 3000,
      });
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Erro',
        detail: errorMessage(err),
        life: 4000,
      });
    } finally {
      setSalvando(null);
    }
  };

  const visiveis = filtro === 'todos' ? members : members.filter((m) => m.status === filtro);
  const pendentes = members.filter((m) => m.status === 'pendente').length;

  return (
    <div className="flex-1 px-4 py-8">
      <Toast ref={toast} position="top-center" />
      <div className="glass-card mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-2xl font-bold text-transparent">
              Membros
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {loading
                ? 'Carregando...'
                : pendentes > 0
                  ? `${pendentes} aguardando aprovação`
                  : `${members.length} cadastrados, ninguém na fila`}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent">
            <i className="pi pi-shield text-2xl text-white"></i>
          </div>
        </div>

        <div className={`mb-5 flex gap-1 rounded-xl p-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          {FILTROS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300
                ${
                  filtro === f.key
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20'
                    : isDark
                      ? 'text-white/60 hover:text-white'
                      : 'text-gray-600 hover:text-primary'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-12">
            <i className="pi pi-spin pi-spinner mb-4 text-4xl text-primary-light"></i>
          </div>
        ) : erro ? (
          <p className="py-12 text-center text-red-400">Não foi possível carregar a lista.</p>
        ) : visiveis.length === 0 ? (
          <p className={`py-12 text-center ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            Ninguém nesta situação.
          </p>
        ) : (
          <div className="space-y-2">
            {visiveis.map((member) => {
              const euMesma = member.id === user?.id;
              return (
                <div
                  key={member.id}
                  className={`flex flex-wrap items-center gap-3 rounded-2xl border p-4 ${
                    isDark ? 'border-white/10 bg-white/[0.03]' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-semibold text-white">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {member.name}
                      {euMesma && <span className="ml-2 text-xs font-normal opacity-50">(você)</span>}
                    </p>
                    <p className={`truncate text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{member.email}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${CORES[member.status]}`}>
                    {member.status}
                  </span>
                  {!euMesma && (
                    <div className="flex gap-1">
                      {member.status !== 'aprovado' && (
                        <button
                          onClick={() => alterar(member, 'aprovado')}
                          disabled={salvando === member.id}
                          title="Aprovar"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500 transition-colors hover:bg-emerald-500/25 disabled:opacity-40"
                        >
                          <i className="pi pi-check text-sm"></i>
                        </button>
                      )}
                      {member.status !== 'admin' && (
                        <button
                          onClick={() => alterar(member, 'admin')}
                          disabled={salvando === member.id}
                          title="Tornar administrador"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-primary-light transition-colors hover:bg-primary/30 disabled:opacity-40"
                        >
                          <i className="pi pi-star text-sm"></i>
                        </button>
                      )}
                      {member.status !== 'recusado' && (
                        <button
                          onClick={() => alterar(member, 'recusado')}
                          disabled={salvando === member.id}
                          title="Recusar acesso"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/15 text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-40"
                        >
                          <i className="pi pi-ban text-sm"></i>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
