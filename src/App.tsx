import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Register from './pages/Register';
import Birthday from './pages/Birthday';
import 'primereact/resources/themes/lara-dark-purple/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Componente interno para usar o hook useTheme
const AppContent: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <Router>
      <div className={`min-h-screen pb-20 md:pb-0 md:pt-24 transition-colors duration-300
        ${theme === 'dark' 
          ? 'bg-background' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
        <BottomNav />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/birthdays" element={<Birthday />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App: React. FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;