import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../context/ThemeContext';

/**
 * Endereços de imagem aceitos.
 *
 * O react-markdown bloqueia "data:" por padrão, e os documentos exportados do
 * Word trazem os desenhos justamente assim. Liberamos só formatos de imagem
 * que não executam nada. SVG fica de fora de propósito: um data:image/svg+xml
 * pode carregar script dentro e viraria uma porta de XSS.
 */
const IMAGEM_SEGURA = /^data:image\/(png|jpe?g|gif|webp);base64,/i;

const urlTransform = (url: string) => {
  if (IMAGEM_SEGURA.test(url)) return url;
  if (/^(https?:|mailto:|tel:|#|\/)/i.test(url)) return url;
  if (!url.includes(':')) return url; // caminho relativo
  return '';
};

interface MarkdownViewProps {
  conteudo: string;
}

const MarkdownView: React.FC<MarkdownViewProps> = ({ conteudo }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const texto = isDark ? 'text-white/80' : 'text-gray-700';
  const titulo = isDark ? 'text-white' : 'text-gray-900';
  const borda = isDark ? 'border-white/10' : 'border-gray-200';

  return (
    <div className={`leading-relaxed ${texto}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        urlTransform={urlTransform}
        components={{
          h1: ({ children }) => (
            <h1 className={`mb-4 mt-10 border-b pb-2 text-2xl font-bold first:mt-0 md:text-3xl ${titulo} ${borda}`}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={`mb-3 mt-8 text-xl font-bold md:text-2xl ${titulo}`}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className={`mb-2 mt-6 text-lg font-semibold ${titulo}`}>{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4">{children}</p>,
          ul: ({ children }) => <ul className="mb-4 list-disc space-y-1.5 pl-6">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1.5 pl-6">{children}</ol>,
          strong: ({ children }) => <strong className={`font-semibold ${titulo}`}>{children}</strong>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light underline underline-offset-2 hover:text-accent"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className={`my-4 border-l-4 border-primary/50 pl-4 italic ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {children}
            </blockquote>
          ),
          hr: () => <hr className={`my-8 ${borda}`} />,
          img: ({ src, alt }) => (
            <img
              src={typeof src === 'string' ? src : ''}
              alt={alt || 'Ilustração do documento'}
              // Fundo branco porque os desenhos vêm com transparência e
              // sumiriam contra o fundo escuro do tema noturno.
              className="mx-auto my-6 h-auto w-full max-w-2xl rounded-xl bg-white p-2 shadow-lg"
              loading="lazy"
            />
          ),
          // Tabelas rolam sozinhas no celular em vez de esticar a página.
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto">
              <table className={`w-full border-collapse text-sm ${borda}`}>{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className={`border p-2 text-left font-semibold ${titulo} ${borda} ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              {children}
            </th>
          ),
          td: ({ children }) => <td className={`border p-2 align-top ${borda}`}>{children}</td>,
          code: ({ children }) => (
            <code className={`rounded px-1.5 py-0.5 text-sm ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
              {children}
            </code>
          ),
        }}
      >
        {conteudo}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownView;
