import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { errorMessage } from '../services/api';

const Login: React.FC = () => {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const { requestCode, verifyCode } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [step, setStep] = useState<'email' | 'codigo'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  // Guardado fora do toast porque some rápido demais para quem precisa agir.
  const [semCadastro, setSemCadastro] = useState(false);

  const enviarCodigo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'Digite seu e-mail', life: 3000 });
      return;
    }

    setLoading(true);
    setSemCadastro(false);
    try {
      await requestCode(email);
      setStep('codigo');
      toast.current?.show({
        severity: 'success',
        summary: 'Código enviado',
        detail: `Confira a caixa de entrada de ${email.trim()}.`,
        life: 5000,
      });
    } catch (err) {
      const status = (err as any)?.response?.status;

      // 404 é o e-mail que não está no cadastro. Em vez de um toast que some,
      // a tela mostra o caminho para se cadastrar.
      if (status === 404) {
        setSemCadastro(true);
        return;
      }

      toast.current?.show({
        severity: status === 403 ? 'warn' : 'error',
        summary: status === 403 ? 'Cadastro inativo' : 'Erro',
        detail: errorMessage(err, 'Não foi possível enviar o código agora.'),
        life: 6000,
      });
    } finally {
      setLoading(false);
    }
  };

  const conferirCodigo = async (event: React.FormEvent) => {
    event.preventDefault();
    if (code.trim().length !== 6) {
      toast.current?.show({ severity: 'warn', summary: 'Atenção', detail: 'O código tem 6 dígitos', life: 3000 });
      return;
    }

    setLoading(true);
    try {
      const user = await verifyCode(email, code);
      navigate(user.status === 'pendente' ? '/aguardando' : '/');
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Não deu certo',
        detail: errorMessage(err, 'Código inválido ou expirado.'),
        life: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-8">
      <Toast ref={toast} position="top-center" />
      <div className="glass-card w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <img
            src={`${process.env.PUBLIC_URL}/logo_acolito.png`}
            alt="Logo Acólitos"
            className="animate-pulse-glow h-20 w-20 rounded-full object-contain p-1 md:h-24 md:w-24"
          />
        </div>

        <h2 className="mb-2 bg-gradient-to-r from-primary-light to-accent bg-clip-text text-center text-2xl font-bold text-transparent">
          Entrar no portal
        </h2>
        <p className={`mb-6 text-center text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
          {step === 'email'
            ? 'Use o mesmo e-mail que você informou no cadastro.'
            : `Enviamos um código de 6 dígitos para ${email}.`}
        </p>

        {step === 'email' ? (
          <form className="space-y-5" onSubmit={enviarCodigo}>
            <div>
              <label htmlFor="email" className="text-adaptive-secondary mb-2 flex items-center gap-2 font-medium">
                <i className="pi pi-envelope text-primary-light"></i>
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-dark"
                placeholder="seunome@exemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (semCadastro) setSemCadastro(false);
                }}
              />
            </div>

            {semCadastro && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="mb-1 flex items-center gap-2 font-medium text-amber-500">
                  <i className="pi pi-info-circle text-sm"></i>
                  E-mail não encontrado
                </p>
                <p className={`text-sm ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                  Não achamos esse endereço no cadastro dos acólitos. Confira se digitou certo, ou
                  se você usou outro e-mail quando se inscreveu.
                </p>
                <Link
                  to="/register"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary-light hover:text-accent"
                >
                  Fazer meu cadastro
                  <i className="pi pi-arrow-right text-xs"></i>
                </Link>
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-gradient w-full disabled:opacity-60">
              {loading ? 'Enviando...' : 'Receber código'}
            </button>
          </form>
        ) : (
          <form className="space-y-5" onSubmit={conferirCodigo}>
            <div>
              <label htmlFor="code" className="text-adaptive-secondary mb-2 flex items-center gap-2 font-medium">
                <i className="pi pi-key text-primary-light"></i>
                Código
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                className="input-dark text-center text-2xl tracking-[0.5em]"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-gradient w-full disabled:opacity-60">
              {loading ? 'Conferindo...' : 'Entrar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
              }}
              className={`w-full text-sm transition-colors ${
                isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-primary'
              }`}
            >
              Usar outro e-mail
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
