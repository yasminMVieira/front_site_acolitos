import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import BirthdayCard from './BirthdayCard';
import {
  Birthday,
  currentMonth,
  groupByMonth,
  monthName,
} from '../utils/birthday';

type TabKey = 'today' | 'month' | 'all';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'today', label: 'Hoje', icon: 'pi pi-gift' },
  { key: 'month', label: 'Do mês', icon: 'pi pi-calendar' },
  { key: 'all', label: 'Ano todo', icon: 'pi pi-users' },
];

const endpointFor = (tab: TabKey, month: number) => {
  if (tab === 'today') return '/birthdays/today';
  if (tab === 'month') return `/birthdays/month?month=${month}`;
  return '/birthdays/all';
};

const BirthdayList: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [tab, setTab] = useState<TabKey>('today');
  const [month, setMonth] = useState(currentMonth());
  const [search, setSearch] = useState('');

  // Cada aba (e cada mês) é buscada uma vez só e fica em cache.
  const [cache, setCache] = useState<Record<string, Birthday[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const cacheKey = tab === 'month' ? `month-${month}` : tab;
  const data = cache[cacheKey];

  useEffect(() => {
    if (data) {
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    api
      .get<Birthday[]>(endpointFor(tab, month))
      .then((response) => {
        if (!cancelled) setCache((prev) => ({ ...prev, [cacheKey]: response.data }));
      })
      .catch((err) => {
        console.error('Erro ao buscar aniversariantes:', err);
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, data, tab, month]);

  const visible = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((entry) => entry.name.toLowerCase().includes(term));
  }, [data, search]);

  const subtitle = () => {
    if (tab === 'today') {
      return visible.length > 0
        ? `${visible.length} aniversariante${visible.length > 1 ? 's' : ''} hoje!`
        : 'Nenhum aniversariante hoje';
    }
    if (tab === 'month') {
      return `${visible.length} em ${monthName(month)}`;
    }
    return `${visible.length} acólito${visible.length !== 1 ? 's' : ''} cadastrado${visible.length !== 1 ? 's' : ''}`;
  };

  const emptyMessage = () => {
    if (search.trim()) return `Ninguém encontrado com "${search.trim()}".`;
    if (tab === 'today') return 'Não há aniversariantes registrados para hoje.';
    if (tab === 'month') return `Ninguém faz aniversário em ${monthName(month)}.`;
    return 'Ainda não há acólitos cadastrados.';
  };

  const changeMonth = (delta: number) => {
    setMonth((prev) => ((prev - 1 + delta + 12) % 12) + 1);
  };

  return (
    <div className="flex-1 px-4 py-8">
      <div className="glass-card mx-auto w-full max-w-2xl">
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="bg-gradient-to-r from-primary-light to-accent bg-clip-text text-2xl font-bold text-transparent">
              Aniversários
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
              {loading ? 'Carregando...' : subtitle()}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-primary to-accent">
            <i className="pi pi-gift text-2xl text-white"></i>
          </div>
        </div>

        {/* Abas */}
        <div className={`mb-5 flex gap-1 rounded-xl p-1 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          {TABS.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setTab(item.key);
                setSearch('');
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300
                ${
                  tab === item.key
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20'
                    : isDark
                      ? 'text-white/60 hover:text-white'
                      : 'text-gray-600 hover:text-primary'
                }`}
            >
              <i className={`${item.icon} text-sm`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Seletor de mês */}
        {tab === 'month' && (
          <div className="mb-5 flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              aria-label="Mês anterior"
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors
                ${isDark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <i className="pi pi-chevron-left"></i>
            </button>
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {monthName(month)}
            </span>
            <button
              onClick={() => changeMonth(1)}
              aria-label="Próximo mês"
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors
                ${isDark ? 'text-white/70 hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <i className="pi pi-chevron-right"></i>
            </button>
          </div>
        )}

        {/* Busca por nome */}
        {tab === 'all' && (
          <div className="relative mb-5">
            <i
              className={`pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-sm ${
                isDark ? 'text-white/40' : 'text-gray-400'
              }`}
            ></i>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome..."
              className="input-dark !pl-11"
            />
          </div>
        )}

        {/* Conteúdo */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <i className="pi pi-spin pi-spinner mb-4 text-4xl text-primary-light"></i>
            <p className={isDark ? 'text-white/60' : 'text-gray-600'}>Carregando aniversariantes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
              <i className="pi pi-exclamation-triangle text-4xl text-red-400"></i>
            </div>
            <h3 className={`mb-2 text-lg font-semibold ${isDark ? 'text-white/80' : 'text-gray-900'}`}>
              Erro ao carregar
            </h3>
            <p className={`text-center ${isDark ? 'text-white/50' : 'text-gray-600'}`}>
              Não foi possível buscar os aniversariantes. Tente novamente mais tarde.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div
              className={`mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
                isDark ? 'bg-surface-light/50' : 'bg-gray-200'
              }`}
            >
              <i className={`pi pi-calendar-times text-4xl ${isDark ? 'text-white/40' : 'text-gray-400'}`}></i>
            </div>
            <h3 className={`mb-2 text-lg font-semibold ${isDark ? 'text-white/80' : 'text-gray-900'}`}>
              Nenhum aniversariante
            </h3>
            <p className={`text-center ${isDark ? 'text-white/50' : 'text-gray-600'}`}>{emptyMessage()}</p>
          </div>
        ) : tab === 'all' ? (
          /* Ano todo: agrupado por mês */
          <div className="space-y-6">
            {groupByMonth(visible).map(({ month: groupMonth, entries }) => (
              <div key={groupMonth}>
                <div className="mb-3 flex items-center gap-3">
                  <h3
                    className={`text-sm font-semibold uppercase tracking-wide ${
                      groupMonth === currentMonth()
                        ? 'text-primary-light'
                        : isDark
                          ? 'text-white/50'
                          : 'text-gray-500'
                    }`}
                  >
                    {monthName(groupMonth)}
                  </h3>
                  <div className={`h-px flex-1 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                  <span className={`text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>{entries.length}</span>
                </div>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <BirthdayCard key={entry._id} birthday={entry} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((entry) => (
              <BirthdayCard key={entry._id} birthday={entry} highlight={tab === 'today'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BirthdayList;
