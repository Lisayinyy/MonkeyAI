import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Holding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  allocation: number;
  dayChange: number;
  totalReturn: number;
  suggestedAllocation: number;
}

export interface InvestmentPreferences {
  tradingStyle: 'long-term' | 'swing' | 'day-trader';
  preferredSectors: string[];
  excludedStocks: string[];
  returnTarget: number; // percentage
  timeHorizon: number; // months
  dividendFocus: boolean;
  targetHoldings: number;
  coreHoldings: string[];
}

export type ThemeMode = 'light' | 'dark' | 'auto';
export type AppLanguage = 'en' | 'zh';

interface PortfolioContextType {
  portfolioValue: number;
  setPortfolioValue: (value: number) => void;
  holdings: Holding[];
  updateHoldings: (holdings: Holding[]) => void;
  adjustPortfolioProportionally: (newValue: number) => void;
  preferences: InvestmentPreferences;
  updatePreferences: (preferences: Partial<InvestmentPreferences>) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
}

const initialHoldings: Holding[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    shares: 95,
    avgCost: 185.4,
    currentPrice: 189.23,
    value: 17977,
    allocation: 18.0,
    dayChange: 0.42,
    totalReturn: 2.06,
    suggestedAllocation: 18,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    shares: 31,
    avgCost: 442.8,
    currentPrice: 448.32,
    value: 13898,
    allocation: 13.9,
    dayChange: 0.88,
    totalReturn: 1.25,
    suggestedAllocation: 15,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc',
    shares: 75,
    avgCost: 176.2,
    currentPrice: 178.45,
    value: 13384,
    allocation: 13.4,
    dayChange: -0.34,
    totalReturn: 1.28,
    suggestedAllocation: 14,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    shares: 12,
    avgCost: 895.3,
    currentPrice: 918.45,
    value: 11021,
    allocation: 11.0,
    dayChange: 1.24,
    totalReturn: 2.58,
    suggestedAllocation: 12,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    shares: 14,
    avgCost: 618.5,
    currentPrice: 632.78,
    value: 8859,
    allocation: 8.9,
    dayChange: 2.15,
    totalReturn: 2.31,
    suggestedAllocation: 10,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com',
    shares: 52,
    avgCost: 182.4,
    currentPrice: 186.72,
    value: 9709,
    allocation: 9.7,
    dayChange: 0.67,
    totalReturn: 2.37,
    suggestedAllocation: 9,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    shares: 98,
    avgCost: 258.9,
    currentPrice: 245.67,
    value: 24076,
    allocation: 24.1,
    dayChange: -1.87,
    totalReturn: -5.11,
    suggestedAllocation: 5,
  },
  {
    symbol: 'CASH',
    name: 'Cash Reserve',
    shares: 1,
    avgCost: 1076,
    currentPrice: 1076,
    value: 1076,
    allocation: 1.1,
    dayChange: 0,
    totalReturn: 0,
    suggestedAllocation: 17,
  },
];

const initialPreferences: InvestmentPreferences = {
  tradingStyle: 'long-term',
  preferredSectors: ['Technology', 'Healthcare'],
  excludedStocks: [],
  returnTarget: 15,
  timeHorizon: 12,
  dividendFocus: false,
  targetHoldings: 6,
  coreHoldings: ['AAPL', 'MSFT'],
};

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const initialTotal = initialHoldings.reduce((sum, h) => sum + h.value, 0);
  const [portfolioValue, setPortfolioValue] = useState(initialTotal);
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [preferences, setPreferences] = useState<InvestmentPreferences>(initialPreferences);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem('monkey-language');
    return saved === 'zh' ? 'zh' : 'en';
  });

  const updateHoldings = (newHoldings: Holding[]) => {
    setHoldings(newHoldings);
    const newTotal = newHoldings.reduce((sum, h) => sum + h.value, 0);
    setPortfolioValue(newTotal);
  };

  const adjustPortfolioProportionally = (newValue: number) => {
    const currentTotal = holdings.reduce((sum, h) => sum + h.value, 0);
    const ratio = newValue / currentTotal;

    const adjustedHoldings = holdings.map((holding) => {
      const newHoldingValue = Math.round(holding.value * ratio);
      const newShares = holding.symbol === 'CASH' 
        ? 1 
        : Math.round((newHoldingValue / holding.currentPrice) * 100) / 100;
      const actualValue = holding.symbol === 'CASH' 
        ? newHoldingValue 
        : Math.round(newShares * holding.currentPrice);

      return {
        ...holding,
        shares: newShares,
        value: actualValue,
      };
    });

    // Recalculate allocations based on new total
    const newTotal = adjustedHoldings.reduce((sum, h) => sum + h.value, 0);
    const holdingsWithNewAllocations = adjustedHoldings.map((holding) => ({
      ...holding,
      allocation: Math.round((holding.value / newTotal) * 1000) / 10,
    }));

    setHoldings(holdingsWithNewAllocations);
    setPortfolioValue(newTotal);
  };

  const updatePreferences = (newPreferences: Partial<InvestmentPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  const setLanguage = (nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('monkey-language', language);
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolioValue,
        setPortfolioValue,
        holdings,
        updateHoldings,
        adjustPortfolioProportionally,
        preferences,
        updatePreferences,
        theme,
        setTheme,
        language,
        setLanguage,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
