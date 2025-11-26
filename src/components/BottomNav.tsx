import React from 'react';
import { Link, useLocation } from 'react-router-dom';

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

  return (
    <>
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass border-t border-white/10 rounded-t-2xl">
          <div className="flex justify-around items-center h-16 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? 'nav-item-active' : ''
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Top Navigation for Desktop */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="glass border-b border-white/10 rounded-b-2xl mx-4 mt-4">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <img
                  src={`${process.env.PUBLIC_URL}/logo_acolito.png`}
                  alt="Logo Acólitos"
                  className="h-10 w-auto"
                />
                <span className="text-lg font-semibold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                  Acólitos
                </span>
              </Link>

              {/* Navigation Items */}
              <div className="flex items-center gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300
                      ${
                        location.pathname === item.path
                          ? 'bg-primary/20 text-primary-light'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <i className={`${item.icon} text-sm`}></i>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
