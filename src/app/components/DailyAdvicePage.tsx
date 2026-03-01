import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, ChevronDown, Check, DollarSign, AlertCircle, Edit3, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { usePortfolio, type Holding } from '../contexts/PortfolioContext';
import { getFilteredAdvice, StockAdvice } from '../utils/adviceEngine';
import { fetchDailyAdvice } from '../api/client';
import { buildRebalancePlan } from '../utils/rebalancePlanner';
import { t } from '../i18n/uiText';

export function DailyAdvicePage() {
  const { portfolioValue, adjustPortfolioProportionally, preferences, holdings, language } = usePortfolio();
  const isZh = language === 'zh';
  const l = (en: string, zh: string) => (isZh ? zh : en);
  const [baseAdvice, setBaseAdvice] = useState<StockAdvice[]>(() => getFilteredAdvice(preferences));
  const [targetHoldingCount, setTargetHoldingCount] = useState(preferences.targetHoldings || 5);
  const [executionMode, setExecutionMode] = useState<'signals' | 'rebalance'>('signals');
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [adviceWarning, setAdviceWarning] = useState<string | null>(null);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] = useState<Record<string, 'executed' | 'not-executed' | null>>({});
  const [showPortfolioAdjustModal, setShowPortfolioAdjustModal] = useState(false);
  const [currentPortfolioValue, setCurrentPortfolioValue] = useState(portfolioValue);
  const [targetPortfolioValue, setTargetPortfolioValue] = useState(portfolioValue.toString());
  const [refreshKey, setRefreshKey] = useState(0);
  const headerDate = useMemo(
    () =>
      new Intl.DateTimeFormat(isZh ? 'zh-CN' : 'en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(new Date()),
    [isZh]
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadAdvice() {
      setIsLoadingAdvice(true);
      try {
        const response = await fetchDailyAdvice({
          preferences,
          portfolioValue: 100000,
          signal: controller.signal,
        });

        setBaseAdvice(
          response.suggestions.map((item) => ({
            ...item,
            baseDollarAmount: item.baseDollarAmount ?? item.dollarAmount ?? 0,
          }))
        );
        setAdviceWarning(null);
      } catch {
        if (controller.signal.aborted) return;
        setBaseAdvice(getFilteredAdvice(preferences));
        setAdviceWarning(
          l(
            'Using local advice cache. Start backend for multi-agent responses.',
            '当前使用本地建议缓存，启动后端后可获取多 Agent 实时建议。'
          )
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingAdvice(false);
        }
      }
    }

    void loadAdvice();
    return () => controller.abort();
  }, [preferences, refreshKey]);

  useEffect(() => {
    if (!preferences.targetHoldings) return;
    setTargetHoldingCount(preferences.targetHoldings);
  }, [preferences.targetHoldings]);

  // Calculate adjusted advice based on portfolio value change
  const adjustedAdvice = useMemo(() => {
    const ratio = currentPortfolioValue / 100000;
    return baseAdvice.map(stock => ({
      ...stock,
      dollarAmount: Math.round(stock.baseDollarAmount * ratio),
    }));
  }, [currentPortfolioValue, baseAdvice]);

  const prioritizedAdvice = useMemo(() => {
    const scoreAction = (action: StockAdvice['action']) => {
      if (action === 'Buy' || action === 'Sell') return 2;
      return 1;
    };

    return [...adjustedAdvice].sort((a, b) => {
      const actionDiff = scoreAction(b.action) - scoreAction(a.action);
      if (actionDiff !== 0) return actionDiff;

      const dollarDiff = Math.abs(b.dollarAmount) - Math.abs(a.dollarAmount);
      if (dollarDiff !== 0) return dollarDiff;

      return b.targetAllocation - a.targetAllocation;
    });
  }, [adjustedAdvice]);

  useEffect(() => {
    if (prioritizedAdvice.length === 0) return;
    setTargetHoldingCount((prev) => Math.min(Math.max(1, prev), prioritizedAdvice.length));
  }, [prioritizedAdvice.length]);

  const holdingCountOptions = useMemo(() => {
    if (prioritizedAdvice.length === 0) return [];
    const presets = [1, 3, 5, prioritizedAdvice.length];
    return [...new Set(presets.filter((count) => count >= 1 && count <= prioritizedAdvice.length))].sort(
      (a, b) => a - b
    );
  }, [prioritizedAdvice.length]);

  const displayedAdvice = useMemo(
    () => prioritizedAdvice.slice(0, Math.min(targetHoldingCount, prioritizedAdvice.length)),
    [prioritizedAdvice, targetHoldingCount]
  );
  const remainingAdviceCount = Math.max(0, prioritizedAdvice.length - displayedAdvice.length);

  const rebalancePlan = useMemo(
    () => buildRebalancePlan(holdings, preferences.targetHoldings, preferences.coreHoldings),
    [holdings, preferences.targetHoldings, preferences.coreHoldings]
  );
  const rebalanceTrimValue = useMemo(
    () => rebalancePlan.trim.reduce((sum, holding) => sum + holding.value, 0),
    [rebalancePlan.trim]
  );

  const portfolioChange = currentPortfolioValue - 100000;
  const isReducingPortfolio = portfolioChange < 0;

  const handleExecution = (symbol: string, executed: boolean) => {
    if (!executed) {
      setSelectedStock(symbol);
      setShowExecutionModal(true);
    } else {
      setExecutionStatus({ ...executionStatus, [symbol]: 'executed' });
    }
  };

  const handleNotExecutedReason = (reason: string) => {
    if (selectedStock) {
      setExecutionStatus({ ...executionStatus, [selectedStock]: 'not-executed' });
    }
    setShowExecutionModal(false);
  };

  const handlePortfolioAdjust = () => {
    const newPortfolioValue = parseFloat(targetPortfolioValue);
    if (!isNaN(newPortfolioValue) && newPortfolioValue > 0 && newPortfolioValue !== currentPortfolioValue) {
      setCurrentPortfolioValue(newPortfolioValue);
      adjustPortfolioProportionally(newPortfolioValue);
      setShowPortfolioAdjustModal(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Buy':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Sell':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Buy':
        return <TrendingUp size={16} />;
      case 'Sell':
        return <TrendingDown size={16} />;
      default:
        return <Minus size={16} />;
    }
  };

  const getActionLabel = (action: string) => {
    if (!isZh) return action;
    if (action === 'Buy') return '买入';
    if (action === 'Sell') return '卖出';
    if (action === 'Hold') return '持有';
    return action;
  };

  const getTrimReason = (holding: Holding) => {
    if (holding.allocation - holding.suggestedAllocation > 3) {
      return l(
        `Over target allocation by ${(holding.allocation - holding.suggestedAllocation).toFixed(1)}%.`,
        `高于目标仓位 ${(holding.allocation - holding.suggestedAllocation).toFixed(1)}%。`
      );
    }
    if (holding.totalReturn < 0) {
      return l(
        'Lower conviction due to negative trend and return profile.',
        '由于趋势偏弱且收益表现不佳，当前优先级下调。'
      );
    }
    return l(
      'Lower priority vs your core holdings and target position count.',
      '相较核心持仓与目标持仓数量，该标的优先级更低。'
    );
  };

  const totalChanges =
    executionMode === 'signals'
      ? displayedAdvice.reduce((sum, stock) => sum + Math.abs(stock.dollarAmount), 0)
      : rebalanceTrimValue;

  const headerSummary =
    executionMode === 'signals'
      ? l(`${displayedAdvice.length} suggestions`, `${displayedAdvice.length} 条建议`)
      : rebalancePlan.trim.length > 0
        ? l(`Trim ${rebalancePlan.trim.length} positions`, `建议减仓 ${rebalancePlan.trim.length} 个持仓`)
        : l('Already aligned with target', '当前已与目标一致');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <Link to="/" className="text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">{t(language, 'page_daily_advice')}</h1>
            <p className="text-xs text-gray-500">{headerDate} • {headerSummary}</p>
          </div>
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            disabled={isLoadingAdvice}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={16} className={isLoadingAdvice ? 'animate-spin' : ''} />
            {isLoadingAdvice ? t(language, 'refreshing') : t(language, 'refresh')}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {adviceWarning && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-3">
              <p className="text-xs text-amber-700">{adviceWarning}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setExecutionMode('signals')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  executionMode === 'signals'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {l('Signal Picks', '信号机会')}
              </button>
              <button
                onClick={() => setExecutionMode('rebalance')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  executionMode === 'rebalance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {l('Rebalance Plan', '再平衡方案')}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              {executionMode === 'signals'
                ? l('Trade from today’s top opportunities.', '根据今日优先机会执行交易。')
                : l(
                    `Trim to your target of ${rebalancePlan.effectiveTargetCount} holdings while preserving core positions.`,
                    `在保留核心持仓前提下，减仓至目标 ${rebalancePlan.effectiveTargetCount} 个持仓。`
                  )}
            </p>
          </CardContent>
        </Card>

        {/* Portfolio Value Adjustment */}
        <Card className="border-purple-100 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <DollarSign size={20} className="text-purple-600 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-purple-900">{l('Portfolio Value', '组合市值')}</p>
                    <p className="text-xs text-purple-700">{l('Adjust to see updated suggestions', '调整后可查看更新建议')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setTargetPortfolioValue(currentPortfolioValue.toString());
                      setShowPortfolioAdjustModal(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
                  >
                    <Edit3 size={14} />
                    {l('Adjust', '调整')}
                  </button>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-semibold text-purple-900">
                    ${currentPortfolioValue.toLocaleString()}
                  </span>
                  {portfolioChange !== 0 && (
                    <span className={`text-sm font-medium ${isReducingPortfolio ? 'text-red-600' : 'text-green-600'}`}>
                      {isReducingPortfolio ? '' : '+'}${Math.abs(portfolioChange).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Change Impact Alert */}
        {isReducingPortfolio && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 mb-1">
                    {l('Withdrawing', '转出资金')} ${Math.abs(portfolioChange).toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-700">
                    {l(
                      'Monkey suggests proportional reduction across all positions to maintain balanced allocation. Sell orders adjusted below.',
                      'Monkey 建议按比例降低各持仓以保持配置平衡，下方已同步调整卖出建议。'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {portfolioChange > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp size={20} className="text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-900 mb-1">
                    {l('Adding', '新增资金')} ${portfolioChange.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-700">
                    {l(
                      'Monkey suggests investing additional capital according to optimal allocation strategy. Buy orders increased below.',
                      'Monkey 建议按最优配置投入新增资金，下方买入建议已相应提高。'
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Portfolio Impact Summary */}
        <Card className="border-blue-100 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-blue-900">{l('Portfolio Impact', '组合影响')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-blue-700">
                  {executionMode === 'signals' ? l('Total Changes', '总调整金额') : l('Capital to Trim', '待减仓金额')}
                </p>
                <p className="text-lg font-semibold text-blue-900">
                  ${(totalChanges / 1000).toFixed(0)}k
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700">
                  {executionMode === 'signals' ? l('Risk Level', '风险等级') : l('Target Holdings', '目标持仓数')}
                </p>
                <p className="text-lg font-semibold text-blue-900">
                  {executionMode === 'signals'
                    ? l('Moderate', '中等')
                    : `${rebalancePlan.currentCount} → ${rebalancePlan.effectiveTargetCount}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700">
                  {executionMode === 'signals' ? l('Est. Return', '预期收益') : l('Core Holdings', '核心持仓')}
                </p>
                <p className="text-sm font-medium text-blue-900">
                  {executionMode === 'signals' ? '8-12%' : rebalancePlan.coreSymbols.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-700">
                  {executionMode === 'signals' ? l('Time Horizon', '投资周期') : l('Trim Candidates', '减仓候选')}
                </p>
                <p className="text-sm font-medium text-blue-900">
                  {executionMode === 'signals' ? l('3-6 months', '3-6个月') : rebalancePlan.trim.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {executionMode === 'signals' && (
          <Card className="border-blue-100 bg-blue-50/40">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">{l('Execution Scope', '执行范围')}</p>
                <p className="text-[11px] text-gray-500">{l('Top', '今日前')} {prioritizedAdvice.length} {l('signals today', '条信号')}</p>
              </div>
              <p className="text-xs text-gray-600">
                {l('Execute', '执行')}{' '}
                <span className="font-semibold text-blue-700">{displayedAdvice.length}</span>{' '}
                {l('positions and keep', '个仓位，保留')}{' '}
                <span className="font-semibold text-gray-800">{remainingAdviceCount}</span>{' '}
                {l('on watchlist.', '个在观察列表。')}
              </p>
            </div>

            {prioritizedAdvice.length > 0 && (
              <div className="space-y-2">
                <input
                  type="range"
                  min={1}
                  max={prioritizedAdvice.length}
                  value={targetHoldingCount}
                  onChange={(e) => setTargetHoldingCount(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600"
                />
                <div className="flex items-center justify-between text-[11px] text-gray-500">
                  <span>{l('Min', '最少')} 1</span>
                  <span>{l('Max', '最多')} {prioritizedAdvice.length}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2">
              {holdingCountOptions.map((count) => (
                <button
                  key={count}
                  onClick={() => setTargetHoldingCount(count)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    targetHoldingCount === count
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {count === prioritizedAdvice.length ? l('All', '全部') : `${l('Top', '前')} ${count}`}
                </button>
              ))}
            </div>
          </CardContent>
          </Card>
        )}

        {/* Stock Recommendations */}
        <div className="space-y-3">
          {executionMode === 'signals' &&
            displayedAdvice.map((stock) => (
            <Card key={stock.symbol} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Stock Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{stock.symbol}</h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border flex items-center gap-1 ${getActionColor(
                            stock.action
                          )}`}
                        >
                          {getActionIcon(stock.action)}
                          {getActionLabel(stock.action)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${stock.currentPrice}
                      </p>
                      <p className="text-xs text-gray-500">{l('Current', '当前')}</p>
                    </div>
                  </div>

                  {/* Allocation Info */}
                  {stock.dollarAmount !== 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">{l('Target Allocation', '目标仓位')}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {stock.targetAllocation}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">
                          {stock.action === 'Sell' ? l('Reduce by', '减仓金额') : l('Investment Amount', '投入金额')}
                        </span>
                        <span
                          className={`text-sm font-semibold ${
                            stock.action === 'Sell' ? 'text-red-600' : 'text-green-600'
                          }`}
                        >
                          {stock.action === 'Sell' ? '-' : '+'}$
                          {Math.abs(stock.dollarAmount).toLocaleString()}
                        </span>
                      </div>
                      {currentPortfolioValue !== 100000 && stock.baseDollarAmount !== 0 && (
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">{l('Original amount', '原始金额')}</span>
                            <span className="text-xs text-gray-500">
                              {stock.action === 'Sell' ? '-' : '+'}$
                              {Math.abs(stock.baseDollarAmount).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reasoning */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{l('Monkey Reasoning', 'Monkey 分析')}</p>
                    <p className="text-sm text-gray-700">{stock.reasoning}</p>
                  </div>

                  {/* Risk Metrics */}
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-xs text-gray-600 hover:text-gray-900">
                      <span>{l('Risk Analysis', '风险分析')}</span>
                      <ChevronDown
                        size={16}
                        className="group-open:rotate-180 transition-transform"
                      />
                    </summary>
                    <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{l('Momentum', '动量')}</span>
                        <span className="font-medium text-gray-700">
                          {stock.risk.momentum}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{l('Volatility', '波动率')}</span>
                        <span className="font-medium text-gray-700">
                          {stock.risk.volatility}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">{l('Max Drawdown', '最大回撤')}</span>
                        <span className="font-medium text-gray-700">
                          {stock.risk.drawdown}
                        </span>
                      </div>
                    </div>
                  </details>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {!executionStatus[stock.symbol] ? (
                      <>
                        <button
                          onClick={() => handleExecution(stock.symbol, true)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          {l('I Executed', '已执行')}
                        </button>
                        <button
                          onClick={() => handleExecution(stock.symbol, false)}
                          className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          {l('Did Not Execute', '暂不执行')}
                        </button>
                      </>
                    ) : (
                      <div
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                          executionStatus[stock.symbol] === 'executed'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        <Check size={16} />
                        {executionStatus[stock.symbol] === 'executed'
                          ? l('Executed', '已执行')
                          : l('Not Executed', '未执行')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {executionMode === 'signals' && displayedAdvice.length === 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">{l('No advice available for current filters.', '当前筛选条件下暂无建议。')}</p>
              </CardContent>
            </Card>
          )}

          {executionMode === 'rebalance' && (
            <Card className="border-blue-100 bg-blue-50/40">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-blue-900">
                  {l('Current', '当前')} {rebalancePlan.currentCount} {l('positions', '个持仓')} • {l('Target', '目标')} {rebalancePlan.effectiveTargetCount}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {l('Core holdings are protected:', '核心持仓已保护：')} {rebalancePlan.coreSymbols.join(', ') || l('None', '无')}。
                </p>
                {rebalancePlan.coreOverflow && (
                  <p className="text-xs text-amber-700 mt-2">
                    {l(
                      'Core holdings exceed target. Increase target or reduce core list in Settings.',
                      '核心持仓数量超过目标，请在设置中提高目标持仓数或减少核心持仓。'
                    )}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {executionMode === 'rebalance' &&
            rebalancePlan.trim.map((holding) => (
              <Card key={holding.symbol} className="overflow-hidden border-red-100">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{holding.symbol}</h3>
                        <span className="px-2 py-0.5 rounded text-xs font-medium border text-red-700 bg-red-50 border-red-200">
                          {l('Trim', '减仓')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{holding.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">${holding.value.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{holding.allocation.toFixed(1)}% {l('allocation', '仓位')}</p>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-xs text-red-700">{l('Monkey Reasoning', 'Monkey 分析')}</p>
                    <p className="text-sm text-red-900 mt-1">{getTrimReason(holding)}</p>
                  </div>

                  <div className="flex gap-2">
                    {!executionStatus[holding.symbol] ? (
                      <>
                        <button
                          onClick={() => handleExecution(holding.symbol, true)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          {l('I Reduced', '已减仓')}
                        </button>
                        <button
                          onClick={() => handleExecution(holding.symbol, false)}
                          className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          {l('Keep for Now', '暂时保留')}
                        </button>
                      </>
                    ) : (
                      <div
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                          executionStatus[holding.symbol] === 'executed'
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                      >
                        <Check size={16} />
                        {executionStatus[holding.symbol] === 'executed' ? l('Reduced', '已减仓') : l('Deferred', '已延后')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

          {executionMode === 'rebalance' && rebalancePlan.trim.length === 0 && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm font-medium text-gray-900">{l('Portfolio already within target.', '当前持仓已在目标范围内。')}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {l(
                    'No trim action needed today. You can still review signal picks mode for new opportunities.',
                    '今天无需减仓，你仍可切换到信号模式查看新机会。'
                  )}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Execution Modal */}
      <Dialog open={showExecutionModal} onOpenChange={setShowExecutionModal}>
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <DialogTitle>{l("Why didn't you execute?", '为什么没有执行？')}</DialogTitle>
            <DialogDescription>
              {l('Help us understand your decision-making process', '帮助我们理解你的决策过程')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            {[
              { label: l('Fear / Risk concern', '担心风险'), value: 'fear' },
              { label: l('No time today', '今天没时间'), value: 'no-time' },
              { label: l('I disagree with advice', '我不认同这个建议'), value: 'disagree' },
              { label: l('Waiting for better entry', '等待更好的入场点'), value: 'waiting' },
              { label: l('Other reason', '其他原因'), value: 'other' },
            ].map((reason) => (
              <button
                key={reason.value}
                onClick={() => handleNotExecutedReason(reason.value)}
                className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">{reason.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Portfolio Adjust Modal */}
      <Dialog open={showPortfolioAdjustModal} onOpenChange={setShowPortfolioAdjustModal}>
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <DialogTitle>{l('Adjust Portfolio Value', '调整组合市值')}</DialogTitle>
            <DialogDescription>
              {l('Update your portfolio value to see adjusted recommendations', '更新你的组合市值以查看调整后的建议')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">{l('Current Portfolio', '当前组合')}</label>
              <p className="text-lg font-semibold text-gray-900 mb-3">
                ${currentPortfolioValue.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">{l('New Portfolio Value', '新的组合市值')}</label>
              <Input
                type="number"
                value={targetPortfolioValue}
                onChange={(e) => setTargetPortfolioValue(e.target.value)}
                placeholder={l('Enter new portfolio value', '输入新的组合市值')}
                className="w-full"
              />
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                {parseFloat(targetPortfolioValue) < currentPortfolioValue
                  ? l('Withdrawing funds: Monkey will suggest proportional position reductions', '转出资金：Monkey 将建议按比例减仓')
                  : parseFloat(targetPortfolioValue) > currentPortfolioValue
                  ? l('Adding funds: Monkey will suggest optimal allocation of new capital', '新增资金：Monkey 将建议新增资金的最优配置')
                  : l('Monkey will maintain current allocation strategy', 'Monkey 将维持当前配置策略')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPortfolioAdjustModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {l('Cancel', '取消')}
              </button>
              <button
                onClick={handlePortfolioAdjust}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {l('Update Advice', '更新建议')}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
