import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  /** Só deixa passar administradores. */
  adminOnly?: boolean;
}

const Carregando: React.FC = () => (
  <div className="flex flex-1 flex-col items-center justify-center py-20">
    <i className="pi pi-spin pi-spinner mb-4 text-4xl text-primary-light"></i>
    <p className="text-adaptive-secondary">Conferindo seu acesso...</p>
  </div>
);

const RequireAuth: React.FC<RequireAuthProps> = ({ children, adminOnly = false }) => {
  const { user, loading, isApproved, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Carregando />;

  if (!user) {
    return <Navigate to="/entrar" state={{ from: location.pathname }} replace />;
  }

  if (!isApproved) {
    return <Navigate to="/aguardando" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
