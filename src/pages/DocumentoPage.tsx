import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import MarkdownView from '../components/MarkdownView';

interface DocumentoCompleto {
  titulo: string;
  slug: string;
  resumo: string;
  categoria: string;
  conteudo: string;
  autor?: string;
  atualizadoEm: string;
}

const DocumentoPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [documento, setDocumento] = useState<DocumentoCompleto | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setErro(null);

    api
      .get<DocumentoCompleto>(`/documents/${slug}`)
      .then((res) => {
        if (!cancelled) setDocumento(res.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setErro(err?.response?.status === 404 ? 'Documento não encontrado.' : 'Não foi possível abrir o documento.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Volta ao topo ao trocar de documento, senão a leitura começa no meio.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="flex-1 px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          to="/biblioteca"
          className={`mb-4 inline-flex items-center gap-2 text-sm transition-colors ${
            isDark ? 'text-white/60 hover:text-white' : 'text-gray-600 hover:text-primary'
          }`}
        >
          <i className="pi pi-arrow-left text-xs"></i>
          Voltar para a biblioteca
        </Link>

        <div className="glass-card">
          {loading ? (
            <div className="flex flex-col items-center py-16">
              <i className="pi pi-spin pi-spinner mb-4 text-4xl text-primary-light"></i>
              <p className={isDark ? 'text-white/60' : 'text-gray-600'}>Abrindo documento...</p>
            </div>
          ) : erro ? (
            <div className="flex flex-col items-center py-16">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                <i className="pi pi-exclamation-triangle text-4xl text-red-400"></i>
              </div>
              <p className={`text-center ${isDark ? 'text-white/60' : 'text-gray-600'}`}>{erro}</p>
            </div>
          ) : documento ? (
            <>
              <header className={`mb-8 border-b pb-6 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <span className="mb-3 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary-light">
                  {documento.categoria}
                </span>
                <h1 className={`text-2xl font-bold md:text-3xl ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {documento.titulo}
                </h1>
                {documento.resumo && (
                  <p className={`mt-2 leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                    {documento.resumo}
                  </p>
                )}
                <p className={`mt-3 text-xs ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
                  Atualizado em {new Date(documento.atualizadoEm).toLocaleDateString('pt-BR')}
                  {documento.autor ? ` · ${documento.autor}` : ''}
                </p>
              </header>

              <MarkdownView conteudo={documento.conteudo} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DocumentoPage;
