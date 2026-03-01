import { Link } from 'react-router';
import { ChevronLeft, TrendingUp, TrendingDown, Activity, Clock, DollarSign, Globe, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { useState } from 'react';
import { usePortfolio } from '../contexts/PortfolioContext';

export function MarketPage() {
  const { language } = usePortfolio();
  const isZh = language === 'zh';
  const l = (en: string, zh: string) => (isZh ? zh : en);
  const [searchQuery, setSearchQuery] = useState('');

  const marketIndices = [
    {
      name: 'S&P 500',
      symbol: 'SPY',
      price: 568.42,
      change: 0.87,
      changeAmount: 4.89,
      volume: '87.2M',
    },
    {
      name: 'Nasdaq 100',
      symbol: 'QQQ',
      price: 484.35,
      change: 1.24,
      changeAmount: 5.93,
      volume: '52.8M',
    },
    {
      name: 'Dow Jones',
      symbol: 'DIA',
      price: 428.91,
      change: 0.45,
      changeAmount: 1.92,
      volume: '3.2M',
    },
    {
      name: 'Russell 2000',
      symbol: 'IWM',
      price: 217.64,
      change: -0.32,
      changeAmount: -0.70,
      volume: '28.4M',
    },
  ];

  const sectorPerformance = [
    { name: 'Technology', change: 1.45, trend: 'up' },
    { name: 'Healthcare', change: 0.87, trend: 'up' },
    { name: 'Finance', change: 0.65, trend: 'up' },
    { name: 'Consumer', change: -0.23, trend: 'down' },
    { name: 'Energy', change: -0.98, trend: 'down' },
    { name: 'Utilities', change: 0.34, trend: 'up' },
  ];

  const topMovers = {
    gainers: [
      { symbol: 'NVDA', name: 'NVIDIA Corp', change: 5.24, price: 918.45 },
      { symbol: 'META', name: 'Meta Platforms', change: 3.87, price: 632.78 },
      { symbol: 'TSLA', name: 'Tesla Inc', change: 3.12, price: 245.67 },
    ],
    losers: [
      { symbol: 'INTC', name: 'Intel Corp', change: -4.23, price: 42.31 },
      { symbol: 'DIS', name: 'Walt Disney', change: -2.98, price: 108.92 },
      { symbol: 'BA', name: 'Boeing Co', change: -2.45, price: 187.54 },
    ],
  };

  const marketStats = {
    vix: { value: 14.23, label: 'VIX', status: 'Low', color: 'green' },
    advancers: { value: 1842, total: 2834, percentage: 65 },
    decliners: { value: 992, total: 2834, percentage: 35 },
    volume: { value: '12.4B', label: 'Total Volume' },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f23] pb-4">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-[#60a5fa]/15 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              <ChevronLeft size={24} />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{l('Market Overview', '市场概览')}</h1>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock size={12} />
                <span>{l('Updated 10:23 AM ET', '更新于美东时间 10:23')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <Card className="border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardContent className="p-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder={l('Search stocks (e.g., AAPL, NVDA, TSLA)', '搜索股票（如 AAPL、NVDA、TSLA）')}
                className="pl-10 bg-white dark:bg-[#1a1a2e] border-blue-200 dark:border-blue-500/30 focus:border-blue-500 dark:focus:border-blue-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    window.location.href = `/market/stock/${searchQuery}`;
                  }
                }}
              />
            </div>
            {searchQuery && (
              <Link
                to={`/market/stock/${searchQuery}`}
                className="mt-2 w-full bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm"
              >
                <Search size={16} />
                {l('View', '查看')} {searchQuery} {l('Details', '详情')}
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Major Indices */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 dark:text-gray-100">
              <Globe size={18} />
              {l('Major Indices', '主要指数')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {marketIndices.map((index, i) => (
              <div
                key={index.symbol}
                className={`flex items-center justify-between ${
                  i !== marketIndices.length - 1 ? 'pb-3 border-b border-gray-100 dark:border-[#60a5fa]/10' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{index.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{index.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">${index.price}</p>
                  <div className="flex items-center gap-1 justify-end">
                    {index.change >= 0 ? (
                      <TrendingUp size={14} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown size={14} className="text-red-600 dark:text-red-400" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        index.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {index.change >= 0 ? '+' : ''}
                      {index.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Market Statistics */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-3">
            <CardTitle className="text-base dark:text-gray-100">{l('Market Statistics', '市场统计')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* VIX */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{marketStats.vix.label}</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{marketStats.vix.value}</p>
                <span className={`text-xs font-medium text-${marketStats.vix.color}-600 dark:text-${marketStats.vix.color}-400`}>
                  {isZh
                    ? `${marketStats.vix.status === 'Low' ? '低' : marketStats.vix.status}波动`
                    : `${marketStats.vix.status} Volatility`}
                </span>
              </div>
            </div>

            {/* Advancers vs Decliners */}
            <div className="pt-3 border-t border-gray-100 dark:border-[#60a5fa]/10">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{l('Advancers vs Decliners', '上涨家数 vs 下跌家数')}</p>
              <div className="flex gap-2 mb-2">
                <div className="flex-1 h-2 bg-green-600 dark:bg-green-500 rounded-full" style={{ width: `${marketStats.advancers.percentage}%` }} />
                <div className="flex-1 h-2 bg-red-600 dark:bg-red-500 rounded-full" style={{ width: `${marketStats.decliners.percentage}%` }} />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {marketStats.advancers.value} ({marketStats.advancers.percentage}%)
                </span>
                <span className="text-red-600 dark:text-red-400 font-medium">
                  {marketStats.decliners.value} ({marketStats.decliners.percentage}%)
                </span>
              </div>
            </div>

            {/* Volume */}
              <div className="pt-3 border-t border-gray-100 dark:border-[#60a5fa]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{l(marketStats.volume.label, '总成交量')}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{marketStats.volume.value}</span>
              </div>
            </CardContent>
        </Card>

        {/* Sector Performance */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-3">
            <CardTitle className="text-base dark:text-gray-100">{l('Sector Performance', '板块表现')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sectorPerformance.map((sector, i) => (
              <div
                key={sector.name}
                className={`flex items-center justify-between ${
                  i !== sectorPerformance.length - 1 ? 'pb-3 border-b border-gray-100 dark:border-[#60a5fa]/10' : ''
                }`}
              >
                <span className="text-sm text-gray-900 dark:text-gray-100">{l(
                  sector.name,
                  sector.name === 'Technology'
                    ? '科技'
                    : sector.name === 'Healthcare'
                      ? '医疗健康'
                      : sector.name === 'Finance'
                        ? '金融'
                        : sector.name === 'Consumer'
                          ? '消费'
                          : sector.name === 'Energy'
                            ? '能源'
                            : sector.name === 'Utilities'
                              ? '公用事业'
                              : sector.name
                )}</span>
                <div className="flex items-center gap-2">
                  {sector.trend === 'up' ? (
                    <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      sector.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {sector.change >= 0 ? '+' : ''}
                    {sector.change}%
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Gainers */}
        <Card className="border-green-100 dark:border-green-500/20 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-green-900 dark:text-green-400">{l('Top Gainers', '涨幅榜')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topMovers.gainers.map((stock, i) => (
              <Link
                key={stock.symbol}
                to={`/market/stock/${stock.symbol}`}
                className={`flex items-center justify-between hover:bg-green-100 dark:hover:bg-green-900/30 -mx-3 px-3 py-2 rounded-lg transition-colors ${
                  i !== topMovers.gainers.length - 1 ? 'border-b border-green-200 dark:border-green-500/20' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-300">{stock.symbol}</p>
                  <p className="text-xs text-green-700 dark:text-green-500">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-300">${stock.price}</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">+{stock.change}%</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Top Losers */}
        <Card className="border-red-100 dark:border-red-500/20 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-900 dark:text-red-400">{l('Top Losers', '跌幅榜')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topMovers.losers.map((stock, i) => (
              <Link
                key={stock.symbol}
                to={`/market/stock/${stock.symbol}`}
                className={`flex items-center justify-between hover:bg-red-100 dark:hover:bg-red-900/30 -mx-3 px-3 py-2 rounded-lg transition-colors ${
                  i !== topMovers.losers.length - 1 ? 'border-b border-red-200 dark:border-red-500/20' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-300">{stock.symbol}</p>
                  <p className="text-xs text-red-700 dark:text-red-500">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-red-900 dark:text-red-300">${stock.price}</p>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">{stock.change}%</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Market Sentiment */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-3">
            <CardTitle className="text-base dark:text-gray-100">{l('Market Sentiment', '市场情绪')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">{l('Fear & Greed Index', '恐惧与贪婪指数')}</span>
                <span className="text-lg font-semibold text-green-600 dark:text-green-400">62</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-[#252541] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{ width: '62%' }} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">{l('Greed', '偏贪婪')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
