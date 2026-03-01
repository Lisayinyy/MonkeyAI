import { InvestmentPreferences } from '../contexts/PortfolioContext';

export interface StockAdvice {
  symbol: string;
  name: string;
  sector: string;
  action: 'Buy' | 'Sell' | 'Hold';
  currentPrice: number;
  targetAllocation: number;
  baseDollarAmount: number;
  reasoning: string;
  risk: {
    momentum: string;
    volatility: string;
    drawdown: string;
  };
}

const allPossibleAdvice: StockAdvice[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    sector: 'Technology',
    action: 'Buy',
    currentPrice: 918.45,
    targetAllocation: 12,
    baseDollarAmount: 12000,
    reasoning: 'Strong momentum in AI infrastructure, positive earnings momentum',
    risk: {
      momentum: 'Strong',
      volatility: 'Medium',
      drawdown: '-8.2% (30d)',
    },
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    sector: 'Technology',
    action: 'Buy',
    currentPrice: 448.32,
    targetAllocation: 15,
    baseDollarAmount: 15000,
    reasoning: 'Stable growth, diversified revenue streams, AI integration',
    risk: {
      momentum: 'Moderate',
      volatility: 'Low',
      drawdown: '-4.1% (30d)',
    },
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    sector: 'Technology',
    action: 'Hold',
    currentPrice: 189.23,
    targetAllocation: 18,
    baseDollarAmount: 0,
    reasoning: 'Maintain current position, neutral technical signals',
    risk: {
      momentum: 'Neutral',
      volatility: 'Low',
      drawdown: '-2.8% (30d)',
    },
  },
  {
    symbol: 'META',
    name: 'Meta Platforms',
    sector: 'Technology',
    action: 'Buy',
    currentPrice: 632.78,
    targetAllocation: 10,
    baseDollarAmount: 10000,
    reasoning: 'Recovery in advertising spend, cost optimization success',
    risk: {
      momentum: 'Strong',
      volatility: 'Medium-High',
      drawdown: '-11.4% (30d)',
    },
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    sector: 'Consumer',
    action: 'Sell',
    currentPrice: 245.67,
    targetAllocation: 5,
    baseDollarAmount: -5000,
    reasoning: 'Reduce concentration risk, momentum weakening',
    risk: {
      momentum: 'Weak',
      volatility: 'High',
      drawdown: '-18.6% (30d)',
    },
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc',
    sector: 'Technology',
    action: 'Hold',
    currentPrice: 178.45,
    targetAllocation: 14,
    baseDollarAmount: 0,
    reasoning: 'Stable position, monitoring AI competition',
    risk: {
      momentum: 'Moderate',
      volatility: 'Low',
      drawdown: '-5.3% (30d)',
    },
  },
  {
    symbol: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    action: 'Buy',
    currentPrice: 156.78,
    targetAllocation: 8,
    baseDollarAmount: 8000,
    reasoning: 'Defensive play, strong dividend yield, healthcare sector growth',
    risk: {
      momentum: 'Moderate',
      volatility: 'Low',
      drawdown: '-3.2% (30d)',
    },
  },
  {
    symbol: 'UNH',
    name: 'UnitedHealth Group',
    sector: 'Healthcare',
    action: 'Buy',
    currentPrice: 523.45,
    targetAllocation: 7,
    baseDollarAmount: 7000,
    reasoning: 'Healthcare sector leader, consistent earnings growth',
    risk: {
      momentum: 'Strong',
      volatility: 'Low',
      drawdown: '-2.1% (30d)',
    },
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    sector: 'Finance',
    action: 'Buy',
    currentPrice: 178.92,
    targetAllocation: 9,
    baseDollarAmount: 9000,
    reasoning: 'Banking sector recovery, interest rate environment favorable',
    risk: {
      momentum: 'Moderate',
      volatility: 'Medium',
      drawdown: '-6.5% (30d)',
    },
  },
  {
    symbol: 'BAC',
    name: 'Bank of America',
    sector: 'Finance',
    action: 'Buy',
    currentPrice: 34.56,
    targetAllocation: 6,
    baseDollarAmount: 6000,
    reasoning: 'Value play in financials, improving credit quality',
    risk: {
      momentum: 'Moderate',
      volatility: 'Medium',
      drawdown: '-7.8% (30d)',
    },
  },
  {
    symbol: 'XOM',
    name: 'Exxon Mobil',
    sector: 'Energy',
    action: 'Buy',
    currentPrice: 112.34,
    targetAllocation: 5,
    baseDollarAmount: 5000,
    reasoning: 'Energy sector strength, high dividend yield',
    risk: {
      momentum: 'Strong',
      volatility: 'High',
      drawdown: '-9.3% (30d)',
    },
  },
  {
    symbol: 'PG',
    name: 'Procter & Gamble',
    sector: 'Consumer',
    action: 'Buy',
    currentPrice: 162.45,
    targetAllocation: 6,
    baseDollarAmount: 6000,
    reasoning: 'Defensive consumer staples, reliable dividends',
    risk: {
      momentum: 'Moderate',
      volatility: 'Low',
      drawdown: '-2.5% (30d)',
    },
  },
];

export function getFilteredAdvice(preferences: InvestmentPreferences): StockAdvice[] {
  let filtered = [...allPossibleAdvice];

  // Filter out excluded stocks
  if (preferences.excludedStocks.length > 0) {
    filtered = filtered.filter((advice) => !preferences.excludedStocks.includes(advice.symbol));
  }

  // If preferred sectors are selected, prioritize them
  if (preferences.preferredSectors.length > 0) {
    const preferredAdvice = filtered.filter((advice) =>
      preferences.preferredSectors.includes(advice.sector)
    );
    const otherAdvice = filtered.filter(
      (advice) => !preferences.preferredSectors.includes(advice.sector)
    );

    // Combine: preferred first, then others (limited)
    filtered = [...preferredAdvice, ...otherAdvice.slice(0, 2)];
  }

  // Adjust based on trading style
  if (preferences.tradingStyle === 'day-trader') {
    // Day traders prefer high momentum stocks
    filtered = filtered.filter(
      (advice) =>
        advice.risk.momentum === 'Strong' ||
        advice.risk.momentum === 'Moderate' ||
        advice.action === 'Sell'
    );
  } else if (preferences.tradingStyle === 'long-term') {
    // Long-term investors prefer stable, low volatility
    filtered = filtered.filter(
      (advice) =>
        advice.risk.volatility === 'Low' ||
        advice.risk.volatility === 'Medium' ||
        advice.action === 'Hold'
    );
  }

  // Adjust based on dividend focus
  if (preferences.dividendFocus) {
    // Prioritize dividend-paying sectors and stocks
    const dividendStocks = ['JNJ', 'PG', 'XOM', 'JPM'];
    const dividendAdvice = filtered.filter((advice) => dividendStocks.includes(advice.symbol));
    const otherAdvice = filtered.filter((advice) => !dividendStocks.includes(advice.symbol));
    filtered = [...dividendAdvice, ...otherAdvice.slice(0, 3)];
  }

  // Limit to top 6-8 suggestions
  return filtered.slice(0, 6);
}
