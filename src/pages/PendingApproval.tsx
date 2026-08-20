import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const PendingApproval: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <div className="glass-card w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent">
          <i className="pi pi-clock text-4xl text-white"></i>
        </div>
        <h2 className="mb-3 text-xl font-bold text-adaptive">Cadastro em análise</h2>
        <p className={`mb-6 leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
          Recebemos seu pedido com o e-mail <span className="font-medium text-primary-light">{user?.email}</span>.
          Assim que a coordenação liberar, você entra direto pelo mesmo caminho.
        </p>
        <button
          onClick={logout}
          className={`text-sm transition-colors ${
            isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-primary'
          }`}
        >
          Sair
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
