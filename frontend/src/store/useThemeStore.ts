import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => {
  // Read saved preference or default to dark
  const saved = (typeof window !== 'undefined' ? localStorage.getItem('al-theme') : null) as Theme | null;
  const initial: Theme = saved === 'light' ? 'light' : 'dark';

  // Apply on load
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('light', initial === 'light');
  }

  return {
    theme: initial,
    toggle: () => set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('light', next === 'light');
      localStorage.setItem('al-theme', next);
      return { theme: next };
    }),
    setTheme: (t: Theme) => set(() => {
      document.documentElement.classList.toggle('light', t === 'light');
      localStorage.setItem('al-theme', t);
      return { theme: t };
    }),
  };
});
