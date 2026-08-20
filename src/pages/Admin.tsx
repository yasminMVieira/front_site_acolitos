import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import api, { errorMessage } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth, UserStatus } from '../context/AuthContext';

interface StatusChange {
  de: UserStatus | null;
  para: UserStatus;
  em: string;
  por: string;
  observacao?: string;
}

interface Member {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  lastLoginAt?: string;
  historico: StatusChange[];
}

const FILTROS: { key: UserStatus | 'todos'; label: string }[] = [
  { key: 'pendente', label: 'Pendentes' },
  { key: 'aprovado', label: 'Ativos' },
  { key: 'inativo', label: 'Inativos' },
  { key: 'todos', label: 'Todos' },
];

const CORES: Record<UserStatus, string> = {
  pendente: 'bg-amber-500/15 text-amber-500',
  aprovado: 'bg-emerald-500/15 text-emerald-500',
  admin: 'bg-primary/20 text-primary-light',
  inativo: 'bg-gray-500/20 text-gray-400',
  recusado: 'bg-red-500/15 text-red-400',
};

const ACOES: { status: UserStatus; label: string; icon: string; classe: string; explica: string }[] = [
  { status: 'aprovado', label: 'Aprovar', icon: 'pi pi-check', classe: 'bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25', explica: 'Libera o acesso às áreas internas' },
  { status: 'admin', label: 'Coordenação', icon: 'pi pi-star', classe: 'bg-primary/20 text-primary-light hover:bg-primary/30', explica: 'Além do acesso, pode aprovar e publicar' },
  { status: 'inativo', label: 'Desativar', icon: 'pi pi-power-off', classe: 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30', explica: 'Saiu do grupo. Ficha e histórico ficam guardados' },
  { status: 'recusado', label: 'Recusar', icon: 'pi pi-ban', classe: 'bg-red-500/15 text-red-400 hover:bg-red-500/25', explica: 'Nunca fez parte. Nega o pedido de entrada' },
];

const dataCurta = (iso: string) => new Date(iso).toLocaleDateString('pt-BR');

const Admin: React.FC = () => {
  const toast = useRef<Toast>(null);
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [filtro, setFiltro] = useState<UserStatus | 'todos'>('pendente');
  const [aberto, setAberto] = useState<string | null>(null);
  const [nota, setNota] = useState('');
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
      const res = await api.patch<Member>(`/admin/members/${member.id}/status`, {
        status,
        observacao: nota.trim() || undefined,
      });
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status, historico: res.data.historico ?? m.historico } : m))
      );
      setNota('');
      toast.current?.show({
        severity: 'success',
        summary: 'Pronto',
        detail: `${member.name.split(' ')[0]} agora está como ${status}.`,
        life: 3000,
      });
    } catch (err) {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: errorMessage(err), life: 4000 });
    } finally {
      setSalvando(null);
    }
  };

  const visiveis =
    filtro === 'todos'
      ? members
      : filtro === 'aprovado'
        ? members.filter((m) => m.status === 'aprovado' || m.status === 'admin')
        : filtro === 'inativo'
          ? members.filter((m) => m.status === 'inativo' || m.status === 'recusado')
          : members.filter((m) => m.status === filtro);

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
              className={`flex-1 rounded-lg px-2 py-2 text-sm font-medium transition-all duration-300
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
            <i className="pi pi-spin pi-spinner text-4xl text-primary-light"></i>
          </div>
        ) : erro ? (
          <p className="py-12 text-center text-red-400">Não foi possível carregar a lista.</p>
        ) : visiveis.length === 0 ? (
          <p className={`py-12 text-center ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Ninguém nesta situação.</p>
        ) : (
          <div className="space-y-2">
            {visiveis.map((member) => {
              const euMesma = member.id === user?.id;
              const expandido = aberto === member.id;

              return (
                <div
                  key={member.id}
                  className={`rounded-2xl border transition-colors ${
                    isDark ? 'border-white/10 bg-white/[0.03]' : 'border-gray-200 bg-white'
                  }`}
                >
                  <button
                    onClick={() => {
                      setAberto(expandido ? null : member.id);
                      setNota('');
                    }}
                    className="flex w-full items-center gap-3 p-4 text-left"
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
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${CORES[member.status]}`}>
                      {member.status}
                    </span>
                    <i
                      className={`pi pi-chevron-down shrink-0 text-xs transition-transform ${
                        expandido ? 'rotate-180' : ''
                      } ${isDark ? 'text-white/30' : 'text-gray-400'}`}
                    ></i>
                  </button>

                  {expandido && (
                    <div className={`border-t px-4 pb-4 pt-3 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                      {/* Linha do tempo */}
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                        Histórico
                      </p>
                      {member.historico?.length ? (
                        <ol className="mb-4 space-y-2">
                          {member.historico.map((h, i) => (
                            <li key={i} className="flex gap-3 text-sm">
                              <span className={`shrink-0 ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
                                {dataCurta(h.em)}
                              </span>
                              <span className={isDark ? 'text-white/70' : 'text-gray-700'}>
                                {h.de ? `${h.de} para ${h.para}` : `entrou como ${h.para}`}
                                {h.observacao && (
                                  <span className={`block text-xs italic ${isDark ? 'text-white/45' : 'text-gray-500'}`}>
                                    {h.observacao}
                                  </span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className={`mb-4 text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                          Nada registrado ainda. O histórico começa na primeira mudança feita por aqui.
                        </p>
                      )}

                      {!euMesma && (
                        <>
                          <input
                            type="text"
                            value={nota}
                            onChange={(e) => setNota(e.target.value)}
                            placeholder="Motivo (opcional, fica no histórico)"
                            className="input-dark mb-3 !py-2 !text-sm"
                          />
                          <div className="flex flex-wrap gap-2">
                            {ACOES.filter((a) => a.status !== member.status).map((acao) => (
                              <button
                                key={acao.status}
                                onClick={() => alterar(member, acao.status)}
                                disabled={salvando === member.id}
                                title={acao.explica}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-40 ${acao.classe}`}
                              >
                                <i className={`${acao.icon} text-xs`}></i>
                                {acao.label}
                              </button>
                            ))}
                          </div>
                        </>
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
