import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserStatus } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ROTULOS: Record<UserStatus, string> = {
  pendente: 'Aguardando aprovação',
  aprovado: 'Acólito aprovado',
  admin: 'Coordenação',
  inativo: 'Acesso desativado',
  recusado: 'Acesso recusado',
};

const CORES: Record<UserStatus, string> = {
  pendente: 'bg-amber-500/15 text-amber-500',
  aprovado: 'bg-emerald-500/15 text-emerald-500',
  admin: 'bg-primary/20 text-primary-light',
  inativo: 'bg-gray-500/20 text-gray-400',
  recusado: 'bg-red-500/15 text-red-400',
};

const Account: React.FC = () => {
  const { user, loading, isAdmin, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20">
        <i className="pi pi-spin pi-spinner mb-4 text-4xl text-primary-light"></i>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <div className="glass-card w-full max-w-md">
        {user ? (
          <>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-3xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-adaptive">{user.name}</h2>
              <p className={`mt-1 text-sm ${isDark ? 'text-white/50' : 'text-gray-500'}`}>{user.email}</p>
              <span className={`mt-3 rounded-full px-3 py-1 text-xs font-medium ${CORES[user.status]}`}>
                {ROTULOS[user.status]}
              </span>
            </div>

            <div className="space-y-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${
                    isDark
                      ? 'border-white/10 hover:bg-white/5'
                      : 'border-gray-200 hover:border-primary/40'
                  }`}
                >
                  <i className="pi pi-shield text-primary-light"></i>
                  <span className="flex-1 font-medium text-adaptive">Gerenciar membros</span>
                  <i className={`pi pi-chevron-right text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}></i>
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 transition-colors ${
                  isDark ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:border-red-300'
                }`}
              >
                <i className="pi pi-sign-out text-red-400"></i>
                <span className="flex-1 text-left font-medium text-adaptive">Sair</span>
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
                <i className="pi pi-user text-2xl text-white"></i>
              </div>
              <h2 className="text-xl font-bold text-adaptive">Sua conta</h2>
              <p className={`mt-2 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                Entre com o e-mail do seu cadastro para acessar as áreas internas do portal.
              </p>
            </div>

            <div className="space-y-3">
              <Link to="/entrar" className="btn-gradient block w-full text-center">
                Entrar
              </Link>
              <Link
                to="/register"
                className={`block w-full rounded-xl border p-3 text-center font-medium transition-colors ${
                  isDark
                    ? 'border-white/10 text-white/70 hover:bg-white/5'
                    : 'border-gray-200 text-gray-600 hover:border-primary/40'
                }`}
              >
                Ainda não tenho cadastro
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
