import { useState, useEffect, useMemo } from 'react';
import { ChevronRight, User, Bell, TrendingUp, DollarSign, Info, Target, Clock, Briefcase, X, Moon, Sun, Monitor, LogOut, LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useNavigate } from 'react-router';
import { t } from '../i18n/uiText';
import { useAuth } from '../contexts/AuthContext';

export function SettingsPage() {
  const {
    portfolioValue,
    preferences,
    updatePreferences,
    theme,
    setTheme,
    holdings,
    language,
    setLanguage,
  } = usePortfolio();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isZh = language === 'zh';
  const l = (en: string, zh: string) => (isZh ? zh : en);
  const displayName = user?.name || 'John Investor';
  const displayEmail = user?.email || 'john.investor@email.com';
  
  const [notifications, setNotifications] = useState({
    dailyAdvice: true,
    portfolioAlerts: true,
    earningsReminders: true,
    behavioralInsights: false,
    weeklyReport: true,
  });

  const [aiExplanations, setAiExplanations] = useState(true);
  const [riskLevel, setRiskLevel] = useState('Medium');
  const [investmentStyle, setInvestmentStyle] = useState('Growth');
  const [maxPosition, setMaxPosition] = useState([15]);
  const [newExcludedStock, setNewExcludedStock] = useState('');
  const [isEditingTargetHoldings, setIsEditingTargetHoldings] = useState(false);
  const [targetHoldingsDraft, setTargetHoldingsDraft] = useState(
    String(preferences.targetHoldings)
  );
  const sectorName = (sector: string) =>
    l(
      sector,
      sector === 'Technology'
        ? '科技'
        : sector === 'Healthcare'
          ? '医疗健康'
          : sector === 'Finance'
            ? '金融'
            : sector === 'Consumer'
              ? '消费'
              : sector === 'Energy'
                ? '能源'
                : sector === 'Real Estate'
                  ? '房地产'
                  : sector === 'Utilities'
                    ? '公用事业'
                    : sector === 'Materials'
                      ? '原材料'
                      : sector
    );

  const availableSectors = [
    'Technology',
    'Healthcare',
    'Finance',
    'Consumer',
    'Energy',
    'Real Estate',
    'Utilities',
    'Materials',
  ];

  const investableHoldings = useMemo(
    () => holdings.filter((holding) => holding.symbol !== 'CASH'),
    [holdings]
  );

  const investableSymbols = useMemo(
    () => investableHoldings.map((holding) => holding.symbol),
    [investableHoldings]
  );

  const maxTargetHoldings = Math.max(1, investableHoldings.length);

  useEffect(() => {
    setTargetHoldingsDraft(String(preferences.targetHoldings));
  }, [preferences.targetHoldings]);

  useEffect(() => {
    const validCoreHoldings = preferences.coreHoldings.filter((symbol) =>
      investableSymbols.includes(symbol)
    );
    const safeTarget = Math.min(
      Math.max(preferences.targetHoldings, Math.max(1, validCoreHoldings.length)),
      maxTargetHoldings
    );

    const shouldUpdateCore = validCoreHoldings.length !== preferences.coreHoldings.length;
    const shouldUpdateTarget = safeTarget !== preferences.targetHoldings;

    if (!shouldUpdateCore && !shouldUpdateTarget) return;

    updatePreferences({
      ...(shouldUpdateCore ? { coreHoldings: validCoreHoldings } : {}),
      ...(shouldUpdateTarget ? { targetHoldings: safeTarget } : {}),
    });
  }, [
    preferences.coreHoldings,
    preferences.targetHoldings,
    investableSymbols,
    maxTargetHoldings,
  ]);

  const toggleCoreHolding = (symbol: string) => {
    const exists = preferences.coreHoldings.includes(symbol);
    const nextCoreHoldings = exists
      ? preferences.coreHoldings.filter((item) => item !== symbol)
      : [...preferences.coreHoldings, symbol];

    const safeTarget = Math.max(preferences.targetHoldings, nextCoreHoldings.length || 1);

    updatePreferences({
      coreHoldings: nextCoreHoldings,
      targetHoldings: Math.min(safeTarget, maxTargetHoldings),
    });
  };

  const applyTargetHoldingsDraft = () => {
    const parsed = parseInt(targetHoldingsDraft, 10);
    const minAllowed = Math.max(1, preferences.coreHoldings.length);
    const fallback = preferences.targetHoldings || minAllowed;
    const safeValue = Number.isNaN(parsed) ? fallback : parsed;
    const clampedValue = Math.min(Math.max(safeValue, minAllowed), maxTargetHoldings);

    updatePreferences({ targetHoldings: clampedValue });
    setTargetHoldingsDraft(String(clampedValue));
    setIsEditingTargetHoldings(false);
  };

  const toggleSector = (sector: string) => {
    const newSectors = preferences.preferredSectors.includes(sector)
      ? preferences.preferredSectors.filter((s) => s !== sector)
      : [...preferences.preferredSectors, sector];
    updatePreferences({ preferredSectors: newSectors });
  };

  const addExcludedStock = () => {
    if (newExcludedStock.trim() && !preferences.excludedStocks.includes(newExcludedStock.toUpperCase())) {
      updatePreferences({
        excludedStocks: [...preferences.excludedStocks, newExcludedStock.toUpperCase()],
      });
      setNewExcludedStock('');
    }
  };

  const removeExcludedStock = (stock: string) => {
    updatePreferences({
      excludedStocks: preferences.excludedStocks.filter((s) => s !== stock),
    });
  };

  const handleSwitchAccount = () => {
    signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-900">{t(language, 'settings_title')}</h1>
          <p className="text-xs text-gray-500">{t(language, 'settings_subtitle')}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Settings Update Tip */}
        <Card className="border-blue-100 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-950/30">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {l(
                  'Changed your preferences? Go to ',
                  '修改偏好后，请到'
                )}
                <strong>{l("Today's Investment Advice", '今日投资建议')}</strong>
                {l(' and click ', '，点击')}
                <strong>{l('Refresh', '刷新')}</strong>
                {l(' to see updated recommendations.', '查看最新建议。')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Section - MOVED TO TOP */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 dark:text-gray-100">
              <User size={18} />
              {l('Profile', '个人资料')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button 
              onClick={() => navigate('/profile')}
              className="w-full flex items-center justify-between text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#252541] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{displayEmail}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
            </button>
            <div className="pt-3 border-t border-gray-100 dark:border-[#60a5fa]/10">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">{l('Portfolio Value', '组合市值')}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">${portfolioValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">{l('Member Since', '加入时间')}</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{l('Aug 2025', '2025年8月')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-100 bg-blue-50/50 dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-900 dark:text-gray-100">
              {l('Account Access', '账号操作')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={signOut}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                {l('Log Out', '退出登录')}
              </button>
              <button
                onClick={handleSwitchAccount}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
              >
                <LogIn size={15} />
                {l('Switch Account', '切换账号')}
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mt-2">
              {l('Need another account? Use switch account to re-login quickly.', '如果要登录另一个账号，点“切换账号”即可快速重新登录。')}
            </p>
          </CardContent>
        </Card>

        {/* Investment Goals */}
        <Card className="border-purple-100 bg-purple-50 dark:border-purple-500/20 dark:bg-purple-950/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-purple-900">
              <Target size={18} />
              {l('Investment Goals', '投资目标')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Return Target */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-900 font-medium">{l('Target Return', '目标收益率')}</span>
                <span className="text-lg font-semibold text-purple-900">
                  {preferences.returnTarget}%
                </span>
              </div>
              <Slider
                value={[preferences.returnTarget]}
                onValueChange={(value) => updatePreferences({ returnTarget: value[0] })}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-purple-700 mt-1">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Time Horizon */}
            <div className="pt-3 border-t border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-purple-700" />
                  <span className="text-sm text-purple-900 font-medium">{l('Time Horizon', '投资周期')}</span>
                </div>
                <span className="text-lg font-semibold text-purple-900">
                  {preferences.timeHorizon} {l('months', '个月')}
                </span>
              </div>
              <Slider
                value={[preferences.timeHorizon]}
                onValueChange={(value) => updatePreferences({ timeHorizon: value[0] })}
                min={3}
                max={60}
                step={3}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-purple-700 mt-1">
                <span>3 mo</span>
                <span>60 mo</span>
              </div>
            </div>

            {/* Dividend Focus */}
            <div className="pt-3 border-t border-purple-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-900">{l('Dividend Focus', '股息偏好')}</p>
                <p className="text-xs text-purple-700">{l('Prioritize dividend-paying stocks', '优先推荐高股息股票')}</p>
              </div>
              <Switch
                checked={preferences.dividendFocus}
                onCheckedChange={(checked) => updatePreferences({ dividendFocus: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Construction */}
        <Card className="border-blue-100 bg-blue-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-blue-900">
              <Briefcase size={18} />
              {l('Portfolio Construction', '组合构建')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/80 rounded-lg p-3 border border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-blue-900">{l('Always Keep Around', '长期保留数量')}</p>
                {!isEditingTargetHoldings && (
                  <button
                    onClick={() => setIsEditingTargetHoldings(true)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    {t(language, 'edit')}
                  </button>
                )}
              </div>
              <p className="text-xs text-blue-700 mb-3">
                {l(
                  `Current ${investableHoldings.length} positions. Target controls long-term portfolio size.`,
                  `当前 ${investableHoldings.length} 个持仓。该目标用于控制长期持仓规模。`
                )}
              </p>
              {isEditingTargetHoldings ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={targetHoldingsDraft}
                      onChange={(e) => setTargetHoldingsDraft(e.target.value)}
                      min={Math.max(1, preferences.coreHoldings.length)}
                      max={maxTargetHoldings}
                      className="bg-white"
                    />
                    <button
                      onClick={applyTargetHoldingsDraft}
                      className="px-3.5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {t(language, 'confirm')}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-blue-700">
                      {l(
                        `Enter ${Math.max(1, preferences.coreHoldings.length)} to ${maxTargetHoldings}`,
                        `请输入 ${Math.max(1, preferences.coreHoldings.length)} 到 ${maxTargetHoldings}`
                      )}
                    </p>
                    <button
                      onClick={() => {
                        setTargetHoldingsDraft(String(preferences.targetHoldings));
                        setIsEditingTargetHoldings(false);
                      }}
                      className="text-[11px] text-gray-500 hover:text-gray-700"
                    >
                      {t(language, 'cancel')}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2.5">
                  <p className="text-sm text-blue-900">
                    {l('Always keep around', '长期保留约')}{' '}
                    <span className="font-semibold text-blue-700">{preferences.targetHoldings}</span>{' '}
                    {l('positions.', '个持仓。')}
                  </p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-900">{l('Core Holdings (Always Keep)', '核心持仓（始终保留）')}</p>
                <p className="text-xs text-gray-500">{preferences.coreHoldings.length} {l('selected', '已选')}</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {investableHoldings.map((holding) => {
                  const isCore = preferences.coreHoldings.includes(holding.symbol);
                  return (
                    <button
                      key={holding.symbol}
                      onClick={() => toggleCoreHolding(holding.symbol)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isCore
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {holding.symbol}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-500 mt-2">
                {l('Core positions are excluded from trim candidates.', '核心仓位不会进入减仓候选。')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trading Style */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase size={18} />
              {l('Trading Style', '交易风格')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'long-term', label: l('Long-term', '长线') },
                  { value: 'swing', label: l('Swing', '波段') },
                  { value: 'day-trader', label: l('Day Trader', '日内') },
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => updatePreferences({ tradingStyle: style.value as any })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      preferences.tradingStyle === style.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-3 flex gap-2">
                <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  {preferences.tradingStyle === 'long-term' &&
                    l(
                      'Hold positions for months to years. Focus on fundamentals and long-term growth.',
                      '持仓周期从数月到数年，重视基本面与长期增长。'
                    )}
                  {preferences.tradingStyle === 'swing' &&
                    l(
                      'Hold positions for days to weeks. Capture short-term price movements.',
                      '持仓周期从数天到数周，捕捉短期价格波动。'
                    )}
                  {preferences.tradingStyle === 'day-trader' &&
                    l(
                      'Intraday trading. Enter and exit positions within the same day.',
                      '日内交易，同一天内完成开仓和平仓。'
                    )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Preferences */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{l('Preferred Sectors', '偏好行业')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-xs text-gray-600">
                {l(
                  'Select sectors you want to focus on. Monkey will prioritize recommendations from these sectors.',
                  '选择你更关注的行业，Monkey 会优先推荐这些行业的机会。'
                )}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {availableSectors.map((sector) => (
                  <button
                    key={sector}
                    onClick={() => toggleSector(sector)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      preferences.preferredSectors.includes(sector)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sectorName(sector)}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Excluded Stocks */}
        <Card className="border-red-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-red-900">{l('Excluded Stocks', '排除股票')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-xs text-gray-600">
                {l(
                  "Add stocks you don't want to see in recommendations.",
                  '添加你不希望在建议中出现的股票。'
                )}
              </p>
              
              <div className="flex gap-2">
                <Input
                  value={newExcludedStock}
                  onChange={(e) => setNewExcludedStock(e.target.value.toUpperCase())}
                  placeholder={l('Enter ticker (e.g., AAPL)', '输入股票代码（如 AAPL）')}
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addExcludedStock();
                    }
                  }}
                />
                <button
                  onClick={addExcludedStock}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  {l('Add', '添加')}
                </button>
              </div>

              {preferences.excludedStocks.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {preferences.excludedStocks.map((stock) => (
                    <div
                      key={stock}
                      className="flex items-center gap-1 bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm"
                    >
                      <span className="font-medium">{stock}</span>
                      <button
                        onClick={() => removeExcludedStock(stock)}
                        className="hover:bg-red-200 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Risk Preference */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={18} />
              {l('Risk Preference', '风险偏好')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setRiskLevel(level)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      riskLevel === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {l(level, level === 'Low' ? '低' : level === 'Medium' ? '中' : '高')}
                  </button>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-3 flex gap-2">
                <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  {riskLevel === 'Low' &&
                    l(
                      'Focus on stable, dividend-paying stocks. Lower volatility, slower growth.',
                      '偏向稳定和分红型股票，波动更低，增长相对更慢。'
                    )}
                  {riskLevel === 'Medium' &&
                    l(
                      'Balanced approach. Mix of growth and stability. Moderate volatility.',
                      '平衡策略，兼顾成长与稳健，波动中等。'
                    )}
                  {riskLevel === 'High' &&
                    l(
                      'Aggressive growth focus. Higher volatility, higher potential returns.',
                      '偏向激进成长，波动更大，潜在回报更高。'
                    )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Style */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{l('Investment Style', '投资风格')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {['Quality', 'Growth', 'Momentum', 'Low Volatility'].map((style) => (
                <button
                  key={style}
                  onClick={() => setInvestmentStyle(style)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    investmentStyle === style
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {l(
                    style,
                    style === 'Quality'
                      ? '质量'
                      : style === 'Growth'
                        ? '成长'
                        : style === 'Momentum'
                          ? '动量'
                          : '低波动'
                  )}
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-600">
              {investmentStyle === 'Quality' &&
                l(
                  'High-quality companies with strong fundamentals',
                  '偏向基本面扎实、经营质量高的公司'
                )}
              {investmentStyle === 'Growth' &&
                l('Fast-growing companies, higher risk-reward', '偏向高成长公司，风险收益更高')}
              {investmentStyle === 'Momentum' &&
                l('Follow price trends and market momentum', '顺应价格趋势和市场动量')}
              {investmentStyle === 'Low Volatility' &&
                l('Stable stocks with lower price swings', '偏向波动较小、走势更稳的股票')}
            </div>
          </CardContent>
        </Card>

        {/* Max Position Size */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign size={18} />
              {l('Maximum Single Position', '单一持仓上限')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{l('Max allocation per stock', '每只股票最大占比')}</span>
                <span className="text-2xl font-semibold text-blue-600">{maxPosition[0]}%</span>
              </div>
              <Slider
                value={maxPosition}
                onValueChange={setMaxPosition}
                min={5}
                max={30}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>5%</span>
                <span>30%</span>
              </div>
              <div className="bg-amber-50 rounded-lg p-3 flex gap-2">
                <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  {l(
                    'Monkey will recommend reducing any position that exceeds this threshold.',
                    '任何超过该阈值的仓位，Monkey 都会建议减仓。'
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell size={18} />
              {l('Notifications', '通知')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{l('Daily Advice', '每日建议')}</p>
                <p className="text-xs text-gray-500">{l("Get today's recommendations", '接收今日投资建议')}</p>
              </div>
              <Switch
                checked={notifications.dailyAdvice}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, dailyAdvice: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{l('Portfolio Alerts', '持仓提醒')}</p>
                <p className="text-xs text-gray-500">{l('Price movements & news', '价格波动与新闻')}</p>
              </div>
              <Switch
                checked={notifications.portfolioAlerts}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, portfolioAlerts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{l('Earnings Reminders', '财报提醒')}</p>
                <p className="text-xs text-gray-500">{l('Upcoming earnings dates', '即将到来的财报日期')}</p>
              </div>
              <Switch
                checked={notifications.earningsReminders}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, earningsReminders: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{l('Behavioral Insights', '行为洞察')}</p>
                <p className="text-xs text-gray-500">{l('Weekly behavior updates', '每周行为更新')}</p>
              </div>
              <Switch
                checked={notifications.behavioralInsights}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, behavioralInsights: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{l('Weekly Summary', '每周总结')}</p>
                <p className="text-xs text-gray-500">{l('Performance & decision recap', '表现与决策回顾')}</p>
              </div>
              <Switch
                checked={notifications.weeklyReport}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, weeklyReport: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Agent Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t(language, 'preferences_title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t(language, 'preferences_explanations')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t(language, 'preferences_explanations_desc')}
                </p>
              </div>
              <Switch checked={aiExplanations} onCheckedChange={setAiExplanations} />
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-[#60a5fa]/10">
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {t(language, 'preferences_language')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t(language, 'preferences_language_desc')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(language, 'lang_en')}
                </button>
                <button
                  onClick={() => setLanguage('zh')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    language === 'zh'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t(language, 'lang_zh')}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Mode */}
        <Card className="border-indigo-100 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
              <Monitor size={18} />
              {l('Theme Mode', '主题模式')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-xs text-indigo-700 dark:text-indigo-400">
                {l('Choose your preferred appearance', '选择你偏好的显示外观')}
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-indigo-500 bg-white shadow-md'
                      : 'border-indigo-200 dark:border-indigo-700 bg-white/50 dark:bg-white/10 hover:border-indigo-300 dark:hover:border-indigo-600'
                  }`}
                >
                  <Sun size={20} className={theme === 'light' ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'} />
                  <span className={`text-xs font-medium ${
                    theme === 'light' ? 'text-indigo-900' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {l('Light', '浅色')}
                  </span>
                </button>

                <button
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-indigo-500 bg-[#1a1a2e] shadow-md shadow-indigo-900/50'
                      : 'border-indigo-200 dark:border-indigo-700 bg-white/50 dark:bg-white/10 hover:border-indigo-300 dark:hover:border-indigo-600'
                  }`}
                >
                  <Moon size={20} className={theme === 'dark' ? 'text-indigo-400' : 'text-gray-500 dark:text-gray-400'} />
                  <span className={`text-xs font-medium ${
                    theme === 'dark' ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {l('Dark', '深色')}
                  </span>
                </button>

                <button
                  onClick={() => setTheme('auto')}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    theme === 'auto'
                      ? 'border-indigo-500 bg-gradient-to-br from-white to-gray-800 shadow-md'
                      : 'border-indigo-200 dark:border-indigo-700 bg-white/50 dark:bg-white/10 hover:border-indigo-300 dark:hover:border-indigo-600'
                  }`}
                >
                  <Monitor size={20} className={theme === 'auto' ? 'text-indigo-600' : 'text-gray-500 dark:text-gray-400'} />
                  <span className={`text-xs font-medium ${
                    theme === 'auto' ? 'text-indigo-900' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {l('Auto', '自动')}
                  </span>
                </button>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-lg p-3 flex gap-2">
                <Info size={16} className="text-indigo-700 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-indigo-800 dark:text-indigo-300">
                  {theme === 'light' &&
                    l(
                      'Always use light mode for a clean, bright experience.',
                      '始终使用浅色模式，界面更清爽明亮。'
                    )}
                  {theme === 'dark' &&
                    l(
                      'Always use dark mode for a sleek, focused experience.',
                      '始终使用深色模式，视觉更聚焦沉浸。'
                    )}
                  {theme === 'auto' &&
                    l(
                      'Automatically adapts to your system preferences.',
                      '根据系统设置自动切换主题。'
                    )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-3">
            <CardTitle className="text-base dark:text-gray-100">{l('Data & Privacy', '数据与隐私')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center justify-between text-left">
              <span className="text-sm text-gray-700 dark:text-gray-300">{l('Export My Data', '导出我的数据')}</span>
              <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
            </button>
            <button className="w-full flex items-center justify-between text-left">
              <span className="text-sm text-gray-700 dark:text-gray-300">{l('Privacy Policy', '隐私政策')}</span>
              <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
            </button>
            <button className="w-full flex items-center justify-between text-left">
              <span className="text-sm text-gray-700 dark:text-gray-300">{l('Terms of Service', '服务条款')}</span>
              <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
            </button>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardContent className="p-4">
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Monkey</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{l('Version 1.2.0', '版本 1.2.0')}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {l('Not financial advice. For educational purposes only.', '非投资建议，仅供学习与参考。')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
