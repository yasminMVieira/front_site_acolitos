import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-surface-light/50 
                 backdrop-blur-md border border-white/10 hover:border-primary/50 
                 transition-all duration-300 hover:scale-110"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <i className="pi pi-sun text-xl text-yellow-400"></i>
      ) : (
        <i className="pi pi-moon text-xl text-primary"></i>
      )}
    </button>
  );
};

export default ThemeToggle;