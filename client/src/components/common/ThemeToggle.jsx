import { useTheme } from '../../context/ThemeContext.jsx';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 h-12 rounded-xl bg-bg-elevated border border-line shadow-sm flex items-center justify-center gap-3 text-xl transition-all duration-300 hover:border-accent hover:bg-accent/5 active:scale-90"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span>{theme === 'light' ? '🌙' : '☀️'}</span>
      <span className="text-[0.7rem] font-black uppercase tracking-widest text-text">{theme}</span>
    </button>
  );
};

export default ThemeToggle;
