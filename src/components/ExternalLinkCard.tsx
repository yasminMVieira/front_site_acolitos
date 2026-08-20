import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { ExternalLink } from '../config/links';

interface ExternalLinkCardProps {
  link: ExternalLink;
  /** Layout maior, com ícone em bloco, usado nos destaques da Home. */
  prominent?: boolean;
}

const ExternalLinkCard: React.FC<ExternalLinkCardProps> = ({ link, prominent = false }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex gap-4 rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-0.5
        ${
          isDark
            ? 'border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.06]'
            : 'border-gray-200 bg-white hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10'
        }`}
    >
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent
          ${prominent ? 'h-14 w-14' : 'h-11 w-11'}`}
      >
        <i className={`${link.icon} text-white ${prominent ? 'text-2xl' : 'text-lg'}`}></i>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={`font-semibold ${prominent ? 'text-lg' : 'text-base'} ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {link.title}
          </h3>
          <i
            className={`pi pi-external-link text-xs transition-transform duration-300 group-hover:translate-x-0.5 ${
              isDark ? 'text-white/40' : 'text-gray-400'
            }`}
          ></i>
        </div>
        <p className={`mt-1 text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
          {link.description}
        </p>
      </div>
    </a>
  );
};

export default ExternalLinkCard;
