import { Link } from 'react-router';
import { ArrowRight, CheckCircle2, Globe, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { usePortfolio } from '../contexts/PortfolioContext';

export function WelcomePage() {
  const { language, setLanguage } = usePortfolio();
  const isZh = language === 'zh';
  const l = (en: string, zh: string) => (isZh ? zh : en);

  return (
    <div className="auth-flow-bg px-5 py-7">
      <div className="auth-flow-orb top" />
      <div className="auth-flow-orb bottom" />

      <div className="auth-flow-shell space-y-5">
        <div className="flex justify-between items-center">
          <span className="auth-brand-chip">
            <Sparkles size={12} />
            Monkey
          </span>
          <div className="inline-flex items-center rounded-full border border-blue-200/70 bg-white/80 p-1 text-xs shadow-sm">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-full transition-colors ${language === 'en' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('zh')}
              className={`px-2.5 py-1 rounded-full transition-colors ${language === 'zh' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              中文
            </button>
          </div>
        </div>

        <div className="auth-glass-card rounded-3xl p-6">
          <h1 className="text-[28px] leading-[1.15] font-semibold text-slate-900">
            {l('Your Personal Investment Agent', '你的个人投资代理')}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {l(
              'Get daily advice, track execution, and improve decision discipline with one app.',
              '在一个 App 里获取每日建议、跟踪执行，并持续提升你的决策纪律。'
            )}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-2.5 py-2.5 text-center">
              <p className="text-[18px] font-semibold text-blue-700">7</p>
              <p className="text-[11px] text-blue-800/80">{l('Core Views', '核心视图')}</p>
            </div>
            <div className="rounded-xl border border-sky-100 bg-sky-50/70 px-2.5 py-2.5 text-center">
              <p className="text-[18px] font-semibold text-sky-700">24h</p>
              <p className="text-[11px] text-sky-800/80">{l('Advice Cycle', '建议周期')}</p>
            </div>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-2.5 py-2.5 text-center">
              <p className="text-[18px] font-semibold text-indigo-700">2</p>
              <p className="text-[11px] text-indigo-800/80">{l('Languages', '语言支持')}</p>
            </div>
          </div>
        </div>

        <div className="auth-glass-card rounded-3xl p-5 space-y-3.5">
          <p className="text-sm font-semibold text-slate-900">{l('What happens next', '接下来会做什么')}</p>
          {[
            {
              icon: <CheckCircle2 size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />,
              text: l('Sign in with Google or email', '用 Google 或邮箱登录'),
            },
            {
              icon: <TrendingUp size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />,
              text: l('Answer a short onboarding questionnaire', '完成一个简短的问卷'),
            },
            {
              icon: <ShieldCheck size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />,
              text: l('Get personalized portfolio suggestions', '获得个性化投资建议'),
            },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-2.5 text-sm text-slate-700">
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <Link
          to="/auth"
          className="auth-gradient-button w-full inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-white font-medium transition-colors"
        >
          {l('Get Started', '开始使用')}
          <ArrowRight size={18} />
        </Link>

        <p className="flex items-center justify-center gap-1 text-xs text-slate-500">
          <Globe size={13} />
          {l('You can switch language anytime in Settings.', '你可以随时在设置中切换语言。')}
        </p>
      </div>
    </div>
  );
}
