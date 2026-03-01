import { useEffect, ReactNode } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';

export function ThemeWrapper({ children }: { children: ReactNode }) {
  const { theme } = usePortfolio();

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'auto') {
      // Follow system preference
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const applyTheme = (isDark: boolean) => {
        root.classList.toggle('dark', isDark);
      };
      
      applyTheme(mediaQuery.matches);
      
      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      // Manual theme
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return <>{children}</>;
}
