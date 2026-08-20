import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';

export interface DocumentoResumo {
  _id: string;
  titulo: string;
  slug: string;
  resumo: string;
  categoria: string;
  tags: string[];
  destaque: boolean;
  atualizadoEm: string;
  visualizacoes: number;
}

const CATEGORIAS = ['Liturgia', 'Normas', 'Formação', 'Escalas', 'Avisos'];

const ICONES: Record<string, string> = {
  Liturgia: 'pi pi-book',
  Normas: 'pi pi-verified',
  Formação: 'pi pi-graduation-cap',
  Escalas: 'pi pi-calendar',
  Avisos: 'pi pi-megaphone',
};

const Biblioteca: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [documentos, setDocumentos] = useState<DocumentoResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<DocumentoResumo[]>('/documents')
      .then((res) => {
        if (!cancelled) setDocumentos(res.data);
      })
      .catch(() => {
        if (!cancelled) setErro(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return documentos.filter((doc) => {
      if (categoria && doc.categoria !== categoria) return false;
      if (!termo) return true;
      return (
        doc.titulo.toLowerCase().includes(termo) ||
        doc.resumo.toLowerCase().includes(termo) ||
        doc.tags.some((t) => t.toLowerCase().includes(termo))
      );
    });
  }, [documentos, busca, categoria]);

  // Só mostra as categorias que têm documento, para o filtro não ficar cheio de vazio.
  const categoriasComDocs = CATEGORIAS.filter((c) => documentos.some((d) => d.categoria === c));

  return (
    <div className="flex-1 px-4 py-8">
      <div className="glass-card mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-2xl font-bold text-transparent">
              Biblioteca
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {loading
                ? 'Carregando...'
                : `${visiveis.length} documento${visiveis.length !== 1 ? 's' : ''} disponível${visiveis.length !== 1 ? 'eis' : ''}`}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent">
            <i className="pi pi-book text-2xl text-white"></i>
          </div>
        </div>

        <div className="relative mb-4">
          <i className={`pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}></i>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar documento..."
            className="input-dark !pl-11"
          />
        </div>

        {categoriasComDocs.length > 1 && (
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              onClick={() => setCategoria(null)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                categoria === null
                  ? 'bg-primary text-white'
                  : isDark
                    ? 'bg-white/5 text-white/60 hover:text-white'
                    : 'bg-gray-100 text-gray-600 hover:text-primary'
              }`}
            >
              Todos
            </button>
            {categoriasComDocs.map((c) => (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  categoria === c
                    ? 'bg-primary text-white'
                    : isDark
                      ? 'bg-white/5 text-white/60 hover:text-white'
                      : 'bg-gray-100 text-gray-600 hover:text-primary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center py-12">
            <i className="pi pi-spin pi-spinner text-4xl text-primary-light"></i>
          </div>
        ) : erro ? (
          <p className="py-12 text-center text-red-400">Não foi possível carregar a biblioteca.</p>
        ) : visiveis.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${isDark ? 'bg-surface-light/50' : 'bg-gray-200'}`}>
              <i className={`pi pi-book text-4xl ${isDark ? 'text-white/40' : 'text-gray-400'}`}></i>
            </div>
            <p className={`text-center ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              {busca.trim() ? `Nada encontrado com "${busca.trim()}".` : 'Ainda não há documentos publicados.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visiveis.map((doc) => (
              <Link
                key={doc._id}
                to={`/biblioteca/${doc.slug}`}
                className={`group flex gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 ${
                  isDark
                    ? 'border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.06]'
                    : 'border-gray-200 bg-white hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10'
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <i className={`${ICONES[doc.categoria] || 'pi pi-file'} text-lg text-white`}></i>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{doc.titulo}</h3>
                    {doc.destaque && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary-light">
                        destaque
                      </span>
                    )}
                  </div>
                  {doc.resumo && (
                    <p className={`mt-1 text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
                      {doc.resumo}
                    </p>
                  )}
                  <p className={`mt-2 text-xs ${isDark ? 'text-white/35' : 'text-gray-400'}`}>
                    {doc.categoria} · atualizado em{' '}
                    {new Date(doc.atualizadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Biblioteca;
