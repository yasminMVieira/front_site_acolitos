import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import api, { errorMessage } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import MarkdownView from '../components/MarkdownView';

const CATEGORIAS = ['Liturgia', 'Normas', 'Formação', 'Escalas', 'Avisos'];

/** Tira o "**Título**" e o ".docx.md" para adivinhar um título decente. */
const deduzirTitulo = (markdown: string, nomeArquivo: string) => {
  for (const linha of markdown.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, 10)) {
    const heading = linha.match(/^#{1,3}\s+\*{0,2}(.+?)\*{0,2}\s*$/);
    if (heading) return heading[1].trim();
    const negrito = linha.match(/^\*\*(.+?)\*\*$/);
    if (negrito) return negrito[1].trim();
  }
  return nomeArquivo.replace(/\.docx\.md$|\.md$/i, '');
};

const PublicarDocumento: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const editando = Boolean(slug);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [titulo, setTitulo] = useState('');
  const [resumo, setResumo] = useState('');
  const [categoria, setCategoria] = useState('Liturgia');
  const [conteudo, setConteudo] = useState('');
  const [tags, setTags] = useState('');
  const [destaque, setDestaque] = useState(false);
  const [previa, setPrevia] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [carregando, setCarregando] = useState(editando);

  useEffect(() => {
    if (!slug) return;
    api
      .get(`/documents/${slug}`)
      .then((res) => {
        const d = res.data;
        setTitulo(d.titulo);
        setResumo(d.resumo || '');
        setCategoria(d.categoria);
        setConteudo(d.conteudo);
        setTags((d.tags || []).join(', '));
        setDestaque(Boolean(d.destaque));
      })
      .catch(() => {
        toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Documento não encontrado', life: 4000 });
      })
      .finally(() => setCarregando(false));
  }, [slug]);

  const lerArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    if (arquivo.size > 9 * 1024 * 1024) {
      toast.current?.show({
        severity: 'error',
        summary: 'Arquivo grande demais',
        detail: 'O limite é 9MB. Reduza as imagens do documento antes de exportar.',
        life: 5000,
      });
      return;
    }

    const leitor = new FileReader();
    leitor.onload = () => {
      const texto = String(leitor.result || '');
      setConteudo(texto);
      if (!titulo) setTitulo(deduzirTitulo(texto, arquivo.name));
      toast.current?.show({
        severity: 'success',
        summary: 'Arquivo lido',
        detail: `${Math.round(texto.length / 1024)} KB carregados. Confira a prévia antes de publicar.`,
        life: 4000,
      });
    };
    leitor.onerror = () => {
      toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Não foi possível ler o arquivo', life: 4000 });
    };
    leitor.readAsText(arquivo, 'utf-8');
  };

  const publicar = async () => {
    if (!titulo.trim() || !conteudo.trim()) {
      toast.current?.show({
        severity: 'warn',
        summary: 'Faltou algo',
        detail: 'Título e conteúdo são obrigatórios',
        life: 3000,
      });
      return;
    }

    setSalvando(true);
    const corpo = {
      titulo: titulo.trim(),
      resumo: resumo.trim(),
      categoria,
      conteudo,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      destaque,
    };

    try {
      const res = editando
        ? await api.put(`/documents/${slug}`, corpo)
        : await api.post('/documents', corpo);
      toast.current?.show({
        severity: 'success',
        summary: editando ? 'Atualizado' : 'Publicado',
        detail: titulo.trim(),
        life: 2500,
      });
      setTimeout(() => navigate(`/biblioteca/${res.data.slug}`), 900);
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Não deu certo',
        detail: errorMessage(err, 'Não foi possível salvar o documento.'),
        life: 5000,
      });
    } finally {
      setSalvando(false);
    }
  };

  const kb = Math.round(conteudo.length / 1024);
  const imagens = (conteudo.match(/data:image\//g) || []).length;

  const rotulo = `mb-2 flex items-center gap-2 font-medium text-adaptive-secondary`;

  if (carregando) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20">
        <i className="pi pi-spin pi-spinner text-4xl text-primary-light"></i>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-8">
      <Toast ref={toast} position="top-center" />
      <div className="glass-card mx-auto w-full max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-2xl font-bold text-transparent">
              {editando ? 'Editar documento' : 'Publicar documento'}
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              Escreva direto aqui ou carregue um arquivo .md exportado do Word.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent">
            <i className="pi pi-file-edit text-2xl text-white"></i>
          </div>
        </div>

        <div className="space-y-5">
          {!editando && (
            <div>
              <label className={rotulo}>
                <i className="pi pi-upload text-primary-light"></i>
                Carregar arquivo
              </label>
              <input
                type="file"
                accept=".md,.markdown,text/markdown,text/plain"
                onChange={lerArquivo}
                className={`w-full cursor-pointer rounded-xl border p-3 text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white ${
                  isDark ? 'border-white/10 bg-white/5 text-white/60' : 'border-gray-200 bg-white text-gray-600'
                }`}
              />
            </div>
          )}

          <div>
            <label className={rotulo}>
              <i className="pi pi-pencil text-primary-light"></i>
              Título
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Procissões e Exposição do Santíssimo"
              className="input-dark"
            />
          </div>

          <div>
            <label className={rotulo}>
              <i className="pi pi-align-left text-primary-light"></i>
              Resumo
            </label>
            <input
              type="text"
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Uma frase que aparece no índice da biblioteca"
              className="input-dark"
            />
          </div>

          <div>
            <label className={rotulo}>
              <i className="pi pi-tag text-primary-light"></i>
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((c) => (
                <button
                  key={c}
                  type="button"
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
          </div>

          <div>
            <label className={rotulo}>
              <i className="pi pi-hashtag text-primary-light"></i>
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="procissão, incenso, turíbulo (separadas por vírgula)"
              className="input-dark"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={destaque}
              onChange={(e) => setDestaque(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-adaptive-secondary text-sm">Fixar no topo da biblioteca</span>
          </label>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className={`${rotulo} mb-0`}>
                <i className="pi pi-book text-primary-light"></i>
                Conteúdo em Markdown
              </label>
              {conteudo && (
                <button
                  type="button"
                  onClick={() => setPrevia((p) => !p)}
                  className="text-sm font-medium text-primary-light hover:text-accent"
                >
                  {previa ? 'Voltar a editar' : 'Ver prévia'}
                </button>
              )}
            </div>

            {previa ? (
              <div className={`rounded-xl border p-4 ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-gray-200 bg-white'}`}>
                <MarkdownView conteudo={conteudo} />
              </div>
            ) : (
              <textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                rows={14}
                placeholder="# Título&#10;&#10;Escreva aqui, ou carregue um arquivo acima."
                className="input-dark resize-y font-mono text-sm"
              />
            )}

            {conteudo && (
              <p className={`mt-2 text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                {kb} KB
                {imagens > 0 && ` · ${imagens} imagem${imagens > 1 ? 'ns' : ''} embutida${imagens > 1 ? 's' : ''}`}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={publicar}
              disabled={salvando}
              className="btn-gradient flex-1 disabled:opacity-60"
            >
              {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Publicar'}
            </button>
            <button
              onClick={() => navigate('/biblioteca')}
              className={`rounded-xl border px-5 font-medium transition-colors ${
                isDark ? 'border-white/10 text-white/70 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:border-primary/40'
              }`}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicarDocumento;
