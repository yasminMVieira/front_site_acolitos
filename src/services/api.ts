import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

// O axios devolve um "Unsupported protocol" bem obscuro quando falta o http://
// na frente da URL, então vale avisar em português antes de a requisição sair.
if (!baseURL) {
  console.error(
    'REACT_APP_API_URL não está definida. Copie o .env.example para .env e reinicie o servidor de desenvolvimento.'
  );
} else if (!/^https?:\/\//i.test(baseURL)) {
  console.error(
    `REACT_APP_API_URL precisa começar com http:// ou https://. Valor atual: "${baseURL}"`
  );
}

export const TOKEN_KEY = 'acolitos_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const api = axios.create({ baseURL });

// Toda requisição sai com a sessão, quando existe uma.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Mensagem de erro da API, ou um texto padrão quando ela não mandou nada legível. */
export const errorMessage = (err: unknown, fallback = 'Algo deu errado. Tente de novo.') => {
  const detail = (err as any)?.response?.data?.error;
  return typeof detail === 'string' ? detail : fallback;
};

export default api;
