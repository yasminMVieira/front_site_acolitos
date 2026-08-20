import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import BottomNav from './components/BottomNav';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import Register from './pages/Register';
import Birthday from './pages/Birthday';
import Links from './pages/Links';
import Login from './pages/Login';
import PendingApproval from './pages/PendingApproval';
import Admin from './pages/Admin';
import Account from './pages/Account';
import Biblioteca from './pages/Biblioteca';
import DocumentoPage from './pages/DocumentoPage';
import 'primereact/resources/themes/lara-dark-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Componente interno para usar o hook useTheme
const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Router>
      <div className={`min-h-screen flex flex-col pb-20 md:pb-0 md:pt-24 transition-colors duration-300
        ${theme === 'dark'
          ? 'bg-background'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
        <BottomNav />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/birthdays" element={<Birthday />} />
            <Route path="/links" element={<Links />} />
            <Route path="/entrar" element={<Login />} />
            <Route path="/aguardando" element={<PendingApproval />} />
            <Route path="/conta" element={<Account />} />
            <Route
              path="/biblioteca"
              element={
                <RequireAuth>
                  <Biblioteca />
                </RequireAuth>
              }
            />
            <Route
              path="/biblioteca/:slug"
              element={
                <RequireAuth>
                  <DocumentoPage />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth adminOnly>
                  <Admin />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
