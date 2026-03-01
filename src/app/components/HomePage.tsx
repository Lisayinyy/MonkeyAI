import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { TrendingUp, TrendingDown, Activity, ChevronRight, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { fetchAgentReply, fetchMarketSummary, type MarketSummary } from '../api/client';
import { usePortfolio } from '../contexts/PortfolioContext';

function sanitizeTip(raw: string, fallbackTip: string) {
  const text = String(raw || '').trim();
  if (!text) return fallbackTip;

  const marker = 'Suggested next step:';
  if (text.includes(marker)) {
    const cleaned = text.split(marker).at(-1)?.trim();
    return cleaned || fallbackTip;
  }

  if (text.startsWith('Agent "') && text.includes('received:')) {
    return fallbackTip;
  }

  return text;
}

export function HomePage() {
  const { language } = usePortfolio();
  const isZh = language === 'zh';
  const l = (en: string, zh: string) => (isZh ? zh : en);
  const defaultTip = l(
    'Stage entries over multiple sessions to reduce timing risk.',
    '分批执行建仓，能更好控制择时风险。'
  );
  const [marketData, setMarketData] = useState<MarketSummary>({
    spy: { symbol: 'SPY', price: 568.42, change: 0.87, trend: 'up' },
    volatility: 'Low',
    lastUpdated: '10:23 AM ET',
  });
  const [marketWarning, setMarketWarning] = useState<string | null>(null);
  const [agentTip, setAgentTip] = useState(defaultTip);

  const behavioralScore = 78;
  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat(isZh ? 'zh-CN' : 'en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date()),
    [isZh]
  );
  const isMarketUp = marketData.spy.change >= 0;
  const volatilityLabel = l(
    marketData.volatility,
    marketData.volatility === 'Low'
      ? '低'
      : marketData.volatility === 'Medium'
        ? '中'
        : marketData.volatility === 'High'
          ? '高'
          : marketData.volatility
  );
  const marketCacheWarning = l(
    'Using local market cache. Start backend to get live updates.',
    '当前使用本地市场缓存，启动后端后可获取实时更新。'
  );

  useEffect(() => {
    setAgentTip(defaultTip);
  }, [defaultTip]);

  useEffect(() => {
    const controller = new AbortController();

    fetchMarketSummary('SPY', controller.signal)
      .then((response) => {
        setMarketData(response);
        setMarketWarning(null);
      })
      .catch(() => {
        setMarketWarning(marketCacheWarning);
      });

    fetchAgentReply({
      agentId: 'advisor',
      prompt: 'Give me one short portfolio tip for today.',
      signal: controller.signal,
    })
      .then((response) => {
        setAgentTip(sanitizeTip(response.reply, defaultTip));
      })
      .catch(() => {
        setAgentTip(defaultTip);
      });

    return () => controller.abort();
  }, [defaultTip, marketCacheWarning]);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Monkey</h1>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <div className="relative">
          <Bell size={24} className="text-gray-600" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
        </div>
      </div>

      {/* Market Summary */}
      <Link to="/market">
        <Card className="hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base dark:text-gray-100">{l('Market Summary', '市场摘要')}</CardTitle>
              <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{l('SPY (S&P 500)', 'SPY（标普500）')}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  ${marketData.spy.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isMarketUp ? (
                  <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                ) : (
                  <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
                )}
                <div className="text-right">
                  <p className={`text-lg font-semibold ${isMarketUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isMarketUp ? '+' : ''}{marketData.spy.change.toFixed(2)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{l('Today', '今日')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#60a5fa]/10">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{l('Volatility', '波动率')}</span>
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {volatilityLabel}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
              {l('Updated', '更新于')} {marketData.lastUpdated}
            </p>
            {marketWarning && (
              <p className="text-xs text-amber-600 dark:text-amber-300 pt-1">{marketWarning}</p>
            )}
          </CardContent>
        </Card>
      </Link>

      {/* Today's Investment Suggestion */}
      <Card className="border-blue-100 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base text-blue-900">{l("Today's Investment Suggestion", '今日投资建议')}</CardTitle>
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
              {l('New', '新')}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-blue-900 font-medium">{l('3 Buy Opportunities', '3 个买入机会')}</p>
                <p className="text-xs text-blue-700">{l('2 Hold, 1 Reduce position', '2 个持有，1 个减仓')}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-xs text-blue-700">{l('Portfolio Impact', '组合影响')}</p>
                <p className="text-sm font-semibold text-blue-900">{l('Moderate Risk', '中等风险')}</p>
              </div>
              <div>
                <p className="text-xs text-blue-700">{l('Confidence', '置信度')}</p>
                <p className="text-sm font-semibold text-blue-900">82%</p>
              </div>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <p className="text-xs text-blue-700">{l('Monkey Tip', 'Monkey 提示')}</p>
              <p className="text-xs text-blue-900 mt-1">{agentTip}</p>
            </div>
          </div>
          <Link
            to="/advice"
            className="mt-4 w-full bg-blue-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
          >
            {l("View Today's Advice", '查看今日建议')}
            <ChevronRight size={18} />
          </Link>
        </CardContent>
      </Card>

      {/* Behavioral Score Snapshot */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{l('Behavioral Score', '行为评分')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  stroke="#2563eb"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(behavioralScore / 100) * 201.06} 201.06`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-semibold text-gray-900">
                  {behavioralScore}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">{l('Overall discipline and consistency', '整体纪律性与一致性')}</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">{l('Discipline', '纪律性')}</span>
                  <span className="text-gray-700 font-medium">{l('Good', '良好')}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">{l('Loss Aversion', '损失厌恶')}</span>
                  <span className="text-amber-600 font-medium">{l('Monitor', '需关注')}</span>
                </div>
              </div>
            </div>
          </div>
          <Link
            to="/insights"
            className="mt-4 w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            {l('View Full Analysis', '查看完整分析')}
            <ChevronRight size={16} />
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/events"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <Activity size={20} className="text-gray-600 mb-2" />
          <p className="text-sm font-medium text-gray-900">{l('Events', '事件')}</p>
          <p className="text-xs text-gray-500">{l('Portfolio alerts', '持仓提醒')}</p>
        </Link>
        <Link
          to="/monthly-report"
          className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <TrendingUp size={20} className="text-gray-600 mb-2" />
          <p className="text-sm font-medium text-gray-900">{l('Report', '报告')}</p>
          <p className="text-xs text-gray-500">{l('Monthly insights', '月度洞察')}</p>
        </Link>
      </div>
    </div>
  );
}
