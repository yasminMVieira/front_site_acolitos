import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { externalLinks } from '../config/links';
import ExternalLinkCard from '../components/ExternalLinkCard';

const Links: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex-1 px-4 py-8">
      <div className="glass-card mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-2xl font-bold text-transparent">
              Links úteis
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              Tudo que o acólito precisa, em um lugar só.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent">
            <i className="pi pi-link text-2xl text-white"></i>
          </div>
        </div>

        <div className="space-y-3">
          {externalLinks.map((link) => (
            <ExternalLinkCard key={link.id} link={link} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Links;
