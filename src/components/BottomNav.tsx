import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: 'pi pi-home' },
  { path: '/register', label: 'Cadastro', icon: 'pi pi-user-plus' },
  { path: '/birthdays', label: 'Aniversários', icon: 'pi pi-gift' },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className={`glass border-t rounded-t-2xl ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item. path ? 'nav-item-active' : ''
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="text-xs font-medium">{item. label}</span>
              </Link>
            ))}
            
            {/* Toggle de Tema - Mobile */}
            <button
              onClick={toggleTheme}
              className={`nav-item`}
              aria-label="Alternar tema"
            >
              <i className={`${theme === 'dark' ? 'pi pi-sun text-yellow-400' : 'pi pi-moon text-primary'} text-xl`}></i>
              <span className="text-xs font-medium">Tema</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Top Navigation for Desktop */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className={`glass border-b rounded-b-2xl mx-4 mt-4 ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <img
                  src={`${process.env.PUBLIC_URL}/logo_acolito.png`}
                  alt="Logo Acólitos"
                  className="h-10 w-auto"
                />
              </Link>

              {/* Navigation Items */}
              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                      ${
                        location.pathname === item. path
                          ? 'bg-primary/20 text-primary-light'
                          : theme === 'dark'
                            ? 'text-white/70 hover:text-white hover:bg-white/5'
                            : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                      }`}
                  >
                    <i className={`${item.icon} text-sm`}></i>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                {/* Toggle de Tema - Desktop */}
                <button
                  onClick={toggleTheme}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ml-2
                    ${theme === 'dark'
                      ? 'text-white/70 hover:text-yellow-400 hover:bg-white/5'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`}
                  aria-label="Alternar tema"
                >
                  {theme === 'dark' ? (
                    <>
                      <i className="pi pi-sun text-sm text-yellow-400"></i>
                      <span className="font-medium">Claro</span>
                    </>
                  ) : (
                    <>
                      <i className="pi pi-moon text-sm"></i>
                      <span className="font-medium">Escuro</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;