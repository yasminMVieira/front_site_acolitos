export interface Birthday {
  _id: string;
  name: string;
  birthdate: string;
  /** 1-12, calculado no backend a partir da data em UTC. */
  month: number;
  /** 1-31, calculado no backend a partir da data em UTC. */
  day: number;
}

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const monthName = (month: number) => MONTH_NAMES[month - 1] ?? '';

const startOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

/** Data de nascimento formatada como dd/mm/aaaa. */
export const formatBirthdate = (birthdate: string) =>
  new Date(birthdate).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

/** "12 de Março", o dia sem o ano, que é o que interessa numa lista de aniversários. */
export const formatDayAndMonth = (birthday: Birthday) =>
  `${birthday.day} de ${monthName(birthday.month)}`;

/** Quantos anos a pessoa completa (ou completou) no aniversário deste ano. */
export const getAgeThisYear = (birthday: Birthday) => {
  const birthYear = new Date(birthday.birthdate).getUTCFullYear();
  return new Date().getFullYear() - birthYear;
};

export const isToday = (birthday: Birthday) => {
  const today = startOfToday();
  return birthday.month === today.getMonth() + 1 && birthday.day === today.getDate();
};

/** Dias até a próxima ocorrência do aniversário. 0 = hoje. */
export const getDaysUntil = (birthday: Birthday) => {
  const today = startOfToday();
  let next = new Date(today.getFullYear(), birthday.month - 1, birthday.day);
  if (next < today) {
    next = new Date(today.getFullYear() + 1, birthday.month - 1, birthday.day);
  }
  return Math.round((next.getTime() - today.getTime()) / 86_400_000);
};

/** Rótulo curto de contagem regressiva, usado nos badges dos cards. */
export const getCountdownLabel = (birthday: Birthday) => {
  const days = getDaysUntil(birthday);
  if (days === 0) return 'Hoje!';
  if (days === 1) return 'Amanhã';
  if (days <= 30) return `Em ${days} dias`;
  return null;
};

/** Agrupa por mês, preservando a ordem cronológica vinda do backend. */
export const groupByMonth = (birthdays: Birthday[]) => {
  const groups = new Map<number, Birthday[]>();
  birthdays.forEach((birthday) => {
    const current = groups.get(birthday.month) ?? [];
    current.push(birthday);
    groups.set(birthday.month, current);
  });
  return Array.from(groups.entries())
    .sort(([a], [b]) => a - b)
    .map(([month, entries]) => ({ month, entries }));
};

export const currentMonth = () => new Date().getMonth() + 1;
