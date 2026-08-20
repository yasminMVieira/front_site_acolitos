import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { featuredLinks } from '../config/links';
import ExternalLinkCard from './ExternalLinkCard';

interface Shortcut {
  icon: string;
  title: string;
  description: string;
  path: string;
}

const shortcuts: Shortcut[] = [
  {
    icon: 'pi pi-gift',
    title: 'Aniversários',
    description: 'Quem faz aniversário hoje, no mês e no ano todo',
    path: '/birthdays',
  },
  {
    icon: 'pi pi-user-plus',
    title: 'Cadastro',
    description: 'Registre-se como acólito do grupo',
    path: '/register',
  },
];

const Welcome: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = 'Bem-vindo(a), Acólito(a)!';
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(intervalId);
      }
    }, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden px-4 py-8">
      {/* Orbes animados de fundo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`animate-float absolute left-1/4 top-1/4 h-64 w-64 rounded-full blur-3xl md:h-96 md:w-96
          ${isDark ? 'bg-gradient-to-r from-primary/30 to-accent/30' : 'bg-gradient-to-r from-primary/20 to-accent/20'}`}
        ></div>
        <div
          className={`animate-float-delayed absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full blur-3xl md:h-72 md:w-72
          ${isDark ? 'bg-gradient-to-r from-accent/30 to-primary/30' : 'bg-gradient-to-r from-accent/20 to-primary/20'}`}
        ></div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
        {/* Logo */}
        <div className="animate-pulse-glow mb-6 rounded-full p-2">
          <img
            src={`${process.env.PUBLIC_URL}/logo_acolito.png`}
            alt="Logo Acólitos"
            className="h-24 w-24 object-contain md:h-32 md:w-32"
          />
        </div>

        {/* Título com efeito de digitação */}
        <div className="glass-card mb-10 text-center">
          <h1 className={`text-2xl font-bold md:text-4xl ${isDark ? 'text-glow' : ''}`}>
            <span className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">{text}</span>
            <span className={`animate-pulse ${isDark ? 'text-white' : 'text-primary'}`}>|</span>
          </h1>
          <p className={`mt-3 text-sm md:text-base ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
            O portal do grupo de acólitos da Paróquia Nossa Senhora do Caminho.
          </p>
        </div>

        {/* Atalhos internos */}
        <section className="mb-10 w-full">
          <h2 className={`mb-4 text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
            Atalhos
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {shortcuts.map((shortcut) => (
              <button
                key={shortcut.path}
                onClick={() => navigate(shortcut.path)}
                className="glass-card cursor-pointer text-left transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent">
                  <i className={`${shortcut.icon} text-2xl text-white`}></i>
                </div>
                <h3 className={`mb-1 text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {shortcut.title}
                </h3>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{shortcut.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Links em destaque */}
        <section className="w-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className={`text-sm font-semibold uppercase tracking-wide ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              Em destaque
            </h2>
            <Link
              to="/links"
              className="flex items-center gap-1 text-sm font-medium text-primary-light transition-colors hover:text-accent"
            >
              Ver todos
              <i className="pi pi-arrow-right text-xs"></i>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {featuredLinks.map((link) => (
              <ExternalLinkCard key={link.id} link={link} prominent />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Welcome;
