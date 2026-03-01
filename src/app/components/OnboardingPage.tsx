import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, CheckCircle2, Clock3, Globe, ShieldCheck, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useAuth } from '../contexts/AuthContext';

type RiskProfile = 'conservative' | 'balanced' | 'aggressive';

const sectorList = ['Technology', 'Healthcare', 'Finance', 'Consumer', 'Energy', 'Utilities'];

export function OnboardingPage() {
  const navigate = useNavigate();
  const { preferences, updatePreferences, language, setLanguage } = usePortfolio();
  const { completeOnboarding, user } = useAuth();
  const isZh = language === 'zh';
  const l = (en: string, zh: string) => (isZh ? zh : en);

  const [riskProfile, setRiskProfile] = useState<RiskProfile>('balanced');
  const [timeHorizon, setTimeHorizon] = useState(preferences.timeHorizon);
  const [targetHoldings, setTargetHoldings] = useState(String(preferences.targetHoldings || 6));
  const [preferredSectors, setPreferredSectors] = useState<string[]>(
    preferences.preferredSectors.length > 0 ? preferences.preferredSectors : ['Technology', 'Healthcare']
  );
  const [dividendFocus, setDividendFocus] = useState(preferences.dividendFocus);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const toggleSector = (sector: string) => {
    setPreferredSectors((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    );
  };

  const riskToSettings = (risk: RiskProfile) => {
    if (risk === 'conservative') {
      return { returnTarget: 10, tradingStyle: 'long-term' as const };
    }
    if (risk === 'aggressive') {
      return { returnTarget: 25, tradingStyle: 'swing' as const };
    }
    return { returnTarget: 15, tradingStyle: 'long-term' as const };
  };

  const handleFinish = () => {
    const parsedCount = parseInt(targetHoldings, 10);
    if (Number.isNaN(parsedCount) || parsedCount < 3 || parsedCount > 15) {
      setError(l('Please enter holdings count between 3 and 15.', '持仓数量请输入 3 到 15。'));
      return;
    }

    if (preferredSectors.length === 0) {
      setError(l('Please choose at least one preferred sector.', '请至少选择一个偏好行业。'));
      return;
    }

    if (!acceptTerms) {
      setError(l('Please confirm terms before continuing.', '请先确认条款后再继续。'));
      return;
    }

    setError(null);
    setSaving(true);

    const mapped = riskToSettings(riskProfile);
    updatePreferences({
      tradingStyle: mapped.tradingStyle,
      returnTarget: mapped.returnTarget,
      timeHorizon,
      dividendFocus,
      targetHoldings: parsedCount,
      preferredSectors,
      coreHoldings: [],
    });

    if (typeof window !== 'undefined' && user?.email) {
      window.localStorage.setItem(
        `monkey-onboarding-profile:${user.email.toLowerCase()}`,
        JSON.stringify({
          riskProfile,
          timeHorizon,
          targetHoldings: parsedCount,
          preferredSectors,
          dividendFocus,
        })
      );
    }

    completeOnboarding();
    navigate('/', { replace: true });
  };

  const sectorLabel = (sector: string) =>
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
                : sector === 'Utilities'
                  ? '公用事业'
                  : sector
    );

  return (
    <div className="auth-flow-bg pb-28">
      <div className="auth-flow-orb top" />
      <div className="auth-flow-orb bottom" />

      <div className="auth-flow-shell px-4 pt-5 space-y-4">
        <div className="auth-glass-card rounded-2xl px-4 py-3 flex items-start justify-between gap-3">
          <div>
            <p className="auth-brand-chip">
              <Target size={12} />
              {l('Setup', '设置')}
            </p>
            <h1 className="mt-2 text-xl font-semibold text-slate-900">{l('Quick Setup', '快速设置')}</h1>
            <p className="text-xs text-slate-500 mt-1">{l('Personalize your first recommendations', '先完成偏好设置，再生成你的首批建议')}</p>
          </div>
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-white p-1 text-xs shadow-sm">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-2.5 py-1 rounded-full ${language === 'zh' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              中文
            </button>
          </div>
        </div>

        <div className="auth-glass-card rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span>{l('Progress', '进度')}</span>
            <span>100%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
          </div>
        </div>

        <Card className="auth-glass-card rounded-2xl border-blue-100 bg-blue-50/85">
          <CardContent className="p-4 text-sm text-blue-900">
            <p className="font-medium">
              {l('Welcome', '欢迎')} {user?.name || l('Investor', '投资者')}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {l('This takes about 1 minute. You can edit everything later in Settings.', '预计 1 分钟，可在设置页随时修改。')}
            </p>
          </CardContent>
        </Card>

        <Card className="auth-glass-card rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <ShieldCheck size={17} />
              {l('Risk Preference', '风险偏好')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2">
            {[
              { value: 'conservative', en: 'Conservative', zh: '稳健' },
              { value: 'balanced', en: 'Balanced', zh: '平衡' },
              { value: 'aggressive', en: 'Aggressive', zh: '进取' },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setRiskProfile(item.value as RiskProfile)}
                className={`auth-choice-chip px-3 py-2 rounded-lg text-sm font-medium ${
                  riskProfile === item.value ? 'active' : ''
                }`}
              >
                {l(item.en, item.zh)}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="auth-glass-card rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <Clock3 size={16} />
              {l('Time Horizon', '投资周期')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-4 gap-2">
            {[6, 12, 24, 36].map((month) => (
              <button
                key={month}
                onClick={() => setTimeHorizon(month)}
                className={`auth-choice-chip px-3 py-2 rounded-lg text-sm font-medium ${
                  timeHorizon === month ? 'active' : ''
                }`}
              >
                {month}{l('m', '个月')}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="auth-glass-card rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <Briefcase size={17} />
              {l('Portfolio Construction', '组合构建')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 mb-1">{l('Always keep around', '长期保留约')}</p>
              <Input
                type="number"
                inputMode="numeric"
                value={targetHoldings}
                onChange={(e) => setTargetHoldings(e.target.value)}
                min={3}
                max={15}
                placeholder={l('e.g. 6', '例如 6')}
                className="border-slate-300"
              />
              <p className="text-[11px] text-gray-500 mt-1">{l('Range: 3 to 15 holdings', '范围：3 到 15 个持仓')}</p>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/75 px-3 py-2.5">
              <div>
                <p className="text-sm font-medium text-slate-900">{l('Dividend Focus', '股息偏好')}</p>
                <p className="text-xs text-slate-500">{l('Prefer dividend-paying stocks', '优先推荐分红型股票')}</p>
              </div>
              <button
                onClick={() => setDividendFocus((prev) => !prev)}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${dividendFocus ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'}`}
              >
                {dividendFocus ? l('On', '开') : l('Off', '关')}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="auth-glass-card rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-slate-900">
              <Globe size={17} />
              {l('Preferred Sectors', '偏好行业')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {sectorList.map((sector) => (
              <button
                key={sector}
                onClick={() => toggleSector(sector)}
                className={`auth-choice-chip px-3 py-2 rounded-lg text-sm font-medium ${
                  preferredSectors.includes(sector) ? 'active' : ''
                }`}
              >
                {sectorLabel(sector)}
              </button>
            ))}
          </CardContent>
        </Card>

        <label className="auth-glass-card rounded-xl border border-slate-200 px-3 py-3 flex items-start gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            {l(
              'I understand Monkey provides educational insights, not financial advice.',
              '我理解 Monkey 提供的是教育性信息，不构成投资建议。'
            )}
          </span>
        </label>

        {error && <p className="text-xs text-red-600 rounded-xl border border-red-200 bg-red-50 px-3 py-2">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-[430px] mx-auto px-4 pb-5 pt-3 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
          <button
            onClick={handleFinish}
            disabled={saving}
            className="auth-gradient-button w-full rounded-2xl px-4 py-3.5 text-white font-medium disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={17} />
            {saving ? l('Saving...', '保存中...') : l('Complete Setup', '完成设置')}
          </button>
        </div>
      </div>
    </div>
  );
}
