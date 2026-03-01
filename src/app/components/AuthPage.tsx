import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2, Mail, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { usePortfolio } from '../contexts/PortfolioContext';
import { useAuth } from '../contexts/AuthContext';

type AuthMethod = 'google' | 'email';

export function AuthPage() {
  const navigate = useNavigate();
  const { language } = usePortfolio();
  const { signInWithGoogle, sendMagicLink, signInWithEmail, pendingMagicEmail } = useAuth();
  const [method, setMethod] = useState<AuthMethod>('google');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const isZh = language === 'zh';
  const l = (en: string, zh: string) => (isZh ? zh : en);
  const normalizedEmail = email.trim().toLowerCase();

  const isValidEmail = useMemo(() => /\S+@\S+\.\S+/.test(normalizedEmail), [normalizedEmail]);

  async function handleGoogleSignIn() {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/onboarding', { replace: true });
    } catch {
      setError(l('Unable to sign in with Google right now.', '当前无法使用 Google 登录。'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSendMagicLink() {
    if (!isValidEmail) {
      setError(l('Please enter a valid email.', '请输入有效邮箱地址。'));
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await sendMagicLink(normalizedEmail);
      setLinkSent(true);
    } catch {
      setError(l('Failed to send login link.', '发送登录链接失败。'));
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteEmailSignIn() {
    if (!isValidEmail) {
      setError(l('Please enter the same email.', '请输入相同的邮箱地址。'));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signInWithEmail(normalizedEmail);
      navigate('/onboarding', { replace: true });
    } catch {
      setError(l('Email sign-in failed.', '邮箱登录失败。'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-flow-bg px-5 py-7">
      <div className="auth-flow-orb top" />
      <div className="auth-flow-orb bottom" />

      <div className="auth-flow-shell space-y-4">
        <div className="flex items-center gap-2.5">
          <Link to="/welcome" className="auth-soft-chip p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
            <ArrowLeft size={18} className="text-slate-700" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{l('Sign In', '登录')}</h1>
            <p className="text-xs text-slate-500">{l('Choose your login method', '选择你的登录方式')}</p>
          </div>
        </div>

        <div className="auth-glass-card rounded-3xl p-4">
          <div className="auth-soft-chip grid grid-cols-2 gap-1.5 rounded-xl p-1 mb-4">
            <button
              onClick={() => setMethod('google')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                method === 'google'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setMethod('email')}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                method === 'email'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Email
            </button>
          </div>

          {method === 'google' && (
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-60 inline-flex items-center justify-center gap-2"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  G
                </span>
                {loading ? l('Signing in...', '登录中...') : l('Continue with Google', '使用 Google 继续')}
              </button>
              <p className="text-[11px] text-slate-500">
                {l('Fastest for first-time users', '首次使用推荐，速度最快')}
              </p>
            </div>
          )}

          {method === 'email' && (
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-700">{l('Email address', '邮箱地址')}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder={l('you@example.com', 'you@example.com')}
                className="bg-white border-slate-300"
              />

              {!linkSent ? (
                <button
                  onClick={handleSendMagicLink}
                  disabled={loading}
                  className="auth-gradient-button w-full rounded-2xl px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {loading ? l('Sending link...', '发送中...') : l('Send Magic Link', '发送邮箱登录链接')}
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 flex items-start gap-2">
                    <CheckCircle2 size={15} className="mt-0.5 text-blue-600 flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-5">
                      {l('Magic link sent to', '登录链接已发送到')} {normalizedEmail || pendingMagicEmail}
                    </p>
                  </div>
                  <button
                    onClick={handleCompleteEmailSignIn}
                    disabled={loading}
                    className="auth-gradient-button w-full rounded-2xl px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {loading ? l('Signing in...', '登录中...') : l("I've opened the link", '我已打开链接')}
                  </button>
                </div>
              )}
            </div>
          )}

          {error && <p className="mt-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-2.5 py-2">{error}</p>}
        </div>

        <div className="auth-glass-card rounded-2xl border border-amber-200/70 bg-amber-50/85 p-3.5">
          <p className="text-xs text-amber-700 flex items-start gap-1.5 leading-5">
            <Sparkles size={14} className="mt-0.5 flex-shrink-0" />
            {l(
              'MVP mode: Auth flow UI is live. Next step can connect this to Supabase Auth.',
              'MVP 阶段：登录流程 UI 已打通，下一步可直接接入 Supabase Auth。'
            )}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            l('Secure Session', '安全会话'),
            l('Email Link', '邮箱链接'),
            l('Google Login', 'Google 登录'),
          ].map((item) => (
            <div key={item} className="auth-soft-chip rounded-xl px-2 py-2 text-center text-[11px] text-slate-600">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
