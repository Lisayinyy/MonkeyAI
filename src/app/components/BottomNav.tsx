import { Link, useLocation } from 'react-router';
import { Home, Briefcase, Brain, Settings, TrendingUp } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';
import { t } from '../i18n/uiText';

export function BottomNav() {
  const location = useLocation();
  const { language } = usePortfolio();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a2e] border-t border-gray-200 dark:border-[#60a5fa]/15 max-w-[430px] mx-auto">
      <div className="flex items-center justify-around h-16 px-2">
        <Link
          to="/"
          className={`flex flex-col items-center gap-1 flex-1 ${
            isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Home size={22} />
          <span className="text-xs">{t(language, 'nav_home')}</span>
        </Link>
        <Link
          to="/market"
          className={`flex flex-col items-center gap-1 flex-1 ${
            isActive('/market') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <TrendingUp size={22} />
          <span className="text-xs">{t(language, 'nav_market')}</span>
        </Link>
        <Link
          to="/portfolio"
          className={`flex flex-col items-center gap-1 flex-1 ${
            isActive('/portfolio') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Briefcase size={22} />
          <span className="text-xs">{t(language, 'nav_portfolio')}</span>
        </Link>
        <Link
          to="/insights"
          className={`flex flex-col items-center gap-1 flex-1 ${
            isActive('/insights') || isActive('/monthly-report')
              ? 'text-blue-600 dark:text-blue-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Brain size={22} />
          <span className="text-xs">{t(language, 'nav_insights')}</span>
        </Link>
        <Link
          to="/settings"
          className={`flex flex-col items-center gap-1 flex-1 ${
            isActive('/settings') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Settings size={22} />
          <span className="text-xs">{t(language, 'nav_settings')}</span>
        </Link>
      </div>
    </nav>
  );
}
