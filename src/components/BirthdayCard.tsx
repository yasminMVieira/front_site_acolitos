import React from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Birthday,
  formatBirthdate,
  formatDayAndMonth,
  getAgeThisYear,
  getCountdownLabel,
  isToday,
} from '../utils/birthday';

interface BirthdayCardProps {
  birthday: Birthday;
  /** Cartão maior, usado na aba "Hoje". */
  highlight?: boolean;
}

const BirthdayCard: React.FC<BirthdayCardProps> = ({ birthday, highlight = false }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const celebratingToday = isToday(birthday);
  const countdown = getCountdownLabel(birthday);
  const age = getAgeThisYear(birthday);

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300
        ${
          celebratingToday
            ? 'border-primary/40 bg-gradient-to-r from-primary/15 to-accent/10'
            : isDark
              ? 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
              : 'border-gray-200 bg-white hover:border-primary/30'
        }`}
    >
      {/* Avatar com a inicial */}
      <div
        className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-semibold text-white
          ${highlight ? 'h-14 w-14 text-xl' : 'h-11 w-11 text-base'}`}
      >
        {birthday.name.charAt(0).toUpperCase()}
      </div>

      {/* Nome e data */}
      <div className="min-w-0 flex-1">
        <p
          className={`truncate font-semibold ${highlight ? 'text-lg' : 'text-base'} ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {birthday.name}
        </p>
        <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-600'}`}>
          {formatDayAndMonth(birthday)}
          <span className={isDark ? 'text-white/35' : 'text-gray-400'}> · {formatBirthdate(birthday.birthdate)}</span>
        </p>
      </div>

      {/* Idade e contagem regressiva */}
      <div className="shrink-0 text-right">
        <p className={`font-semibold ${highlight ? 'text-lg' : 'text-base'} ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {age} <span className="text-xs font-normal opacity-60">anos</span>
        </p>
        {countdown && (
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium
              ${
                celebratingToday
                  ? 'bg-primary text-white'
                  : isDark
                    ? 'bg-white/10 text-white/70'
                    : 'bg-primary/10 text-primary'
              }`}
          >
            {countdown}
          </span>
        )}
      </div>
    </div>
  );
};

export default BirthdayCard;
