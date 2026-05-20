import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="w-10 h-10 rounded-full border border-border bg-surface hover:bg-surface-hover flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-md"
    >
      <span className="text-foreground text-base leading-none" aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
    </button>
  );
};
