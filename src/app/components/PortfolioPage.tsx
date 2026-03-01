import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { usePortfolio } from '../contexts/PortfolioContext';
import { buildRebalancePlan } from '../utils/rebalancePlanner';
import { t } from '../i18n/uiText';

export function PortfolioPage() {
  const { holdings, portfolioValue, preferences, language } = usePortfolio();
  const isZh = language === 'zh';
  const l = (en: string, zh: string) => (isZh ? zh : en);

  const totalValue = portfolioValue;
  const investableHoldings = useMemo(
    () => holdings.filter((holding) => holding.symbol !== 'CASH'),
    [holdings]
  );

  const rebalancePlan = useMemo(
    () => buildRebalancePlan(holdings, preferences.targetHoldings, preferences.coreHoldings),
    [holdings, preferences.targetHoldings, preferences.coreHoldings]
  );

  const trimSymbols = useMemo(
    () => new Set(rebalancePlan.trim.map((holding) => holding.symbol)),
    [rebalancePlan.trim]
  );
  const coreSymbols = useMemo(
    () => new Set(rebalancePlan.coreSymbols),
    [rebalancePlan.coreSymbols]
  );

  const chartData = holdings
    .filter((h) => h.symbol !== 'CASH')
    .map((h) => ({
      name: h.symbol,
      value: h.value,
    }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

  const largestPosition = investableHoldings.reduce(
    (max, holding) => Math.max(max, holding.allocation),
    0
  );
  const top3Concentration = [...investableHoldings]
    .sort((a, b) => b.allocation - a.allocation)
    .slice(0, 3)
    .reduce((sum, holding) => sum + holding.allocation, 0);

  const concentrationLevel = largestPosition >= 20 ? 'High' : largestPosition >= 12 ? 'Medium' : 'Low';

  const riskMetrics = {
    concentration: concentrationLevel,
    largestPosition: Number(largestPosition.toFixed(1)),
    top3Concentration: Number(top3Concentration.toFixed(1)),
    sectorDiversification:
      investableHoldings.length >= 8 ? 'Good' : investableHoldings.length >= 5 ? 'Medium' : 'Low',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-900">{t(language, 'page_portfolio')}</h1>
          <p className="text-xs text-gray-500">{l('Last updated: 2 min ago', '上次更新：2 分钟前')}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Total Value */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm text-gray-600">{l('Total Portfolio Value', '组合总市值')}</p>
                <p className="text-3xl font-semibold text-gray-900 mt-1">
                  ${totalValue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp size={16} />
                  +2.4%
                </p>
                <p className="text-xs text-gray-500">{l('Today', '今日')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position Count */}
        <Card className="border-blue-100 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">{l('Position Count', '持仓数量')}</p>
                <p className="text-2xl font-semibold text-blue-900 mt-1">
                  {rebalancePlan.currentCount} / {rebalancePlan.effectiveTargetCount}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {l('Current vs target holdings', '当前持仓 vs 目标持仓')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">{l('Core Holdings', '核心持仓')}</p>
                <p className="text-sm font-semibold text-gray-900">{rebalancePlan.coreSymbols.length}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {rebalancePlan.trim.length}{' '}
                  {l(
                    rebalancePlan.trim.length === 1 ? 'trim candidate' : 'trim candidates',
                    rebalancePlan.trim.length === 1 ? '个减仓候选' : '个减仓候选'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allocation Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{l('Allocation Breakdown', '持仓分布')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {chartData.slice(0, 6).map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Concentration Alert */}
        {rebalancePlan.trim.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    {l('Rebalance Opportunity', '再平衡机会')}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {l(
                      `You have ${rebalancePlan.currentCount} positions and target is ${rebalancePlan.effectiveTargetCount}. Consider trimming ${rebalancePlan.trim.length} positions.`,
                      `你当前有 ${rebalancePlan.currentCount} 个持仓，目标是 ${rebalancePlan.effectiveTargetCount} 个。建议减仓 ${rebalancePlan.trim.length} 个。`
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Risk Metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{l('Risk Analysis', '风险分析')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{l('Concentration Risk', '集中度风险')}</span>
              <span className="text-sm font-semibold text-amber-600">
                {l(
                  riskMetrics.concentration,
                  riskMetrics.concentration === 'High'
                    ? '高'
                    : riskMetrics.concentration === 'Medium'
                      ? '中'
                      : '低'
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{l('Largest Position', '最大单一持仓')}</span>
              <span className="text-sm font-semibold text-gray-900">
                {riskMetrics.largestPosition}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{l('Top 3 Holdings', '前3大持仓')}</span>
              <span className="text-sm font-semibold text-gray-900">
                {riskMetrics.top3Concentration}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{l('Sector Diversification', '行业分散度')}</span>
              <span className="text-sm font-semibold text-blue-600">
                {l(
                  riskMetrics.sectorDiversification,
                  riskMetrics.sectorDiversification === 'Good'
                    ? '良好'
                    : riskMetrics.sectorDiversification === 'Medium'
                      ? '中等'
                      : '偏低'
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Holdings List */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{l('Current Holdings', '当前持仓')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {holdings.map((holding) => (
              <div
                key={holding.symbol}
                className={`pb-3 border-b border-gray-100 last:border-0 ${
                  trimSymbols.has(holding.symbol) ? 'bg-red-50/50 rounded-lg px-2 -mx-2' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{holding.symbol}</h4>
                      {Math.abs(holding.allocation - holding.suggestedAllocation) > 2 && (
                        <Info size={14} className="text-blue-600" />
                      )}
                      {coreSymbols.has(holding.symbol) && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-900 text-white">
                          {l('Core', '核心')}
                          </span>
                      )}
                      {!coreSymbols.has(holding.symbol) && trimSymbols.has(holding.symbol) && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                          {l('Trim Candidate', '减仓候选')}
                          </span>
                      )}
                      {!coreSymbols.has(holding.symbol) &&
                        !trimSymbols.has(holding.symbol) &&
                        holding.symbol !== 'CASH' && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                            {l('Keep', '保留')}
                          </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">{holding.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${holding.value.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs ${
                        holding.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {holding.dayChange >= 0 ? '+' : ''}
                      {holding.dayChange}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{l('Shares:', '股数:')}</span>
                    <span className="text-gray-700">{holding.shares}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{l('Avg Cost:', '成本价:')}</span>
                    <span className="text-gray-700">${holding.avgCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{l('Current:', '现价:')}</span>
                    <span className="text-gray-700">${holding.currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{l('Return:', '收益:')}</span>
                    <span
                      className={holding.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {holding.totalReturn >= 0 ? '+' : ''}
                      {holding.totalReturn}%
                    </span>
                  </div>
                </div>

                {/* Allocation Comparison */}
                <div className="mt-2 pt-2 border-t border-gray-50">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-500">{l('Current vs Suggested', '当前 vs 建议')}</span>
                    <span className="text-gray-700">
                      {holding.allocation.toFixed(1)}% → {holding.suggestedAllocation}%
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5">
                    <div
                      className="bg-gray-300 rounded-full"
                      style={{ width: `${holding.allocation}%` }}
                    />
                    <div
                      className={`rounded-full ${
                        holding.suggestedAllocation > holding.allocation
                          ? 'bg-green-200'
                          : holding.suggestedAllocation < holding.allocation
                          ? 'bg-red-200'
                          : 'bg-gray-200'
                      }`}
                      style={{
                        width: `${Math.abs(holding.suggestedAllocation - holding.allocation)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
