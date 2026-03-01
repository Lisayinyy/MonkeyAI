import { Link } from 'react-router';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { ArrowRight, AlertCircle, CheckCircle2, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { usePortfolio } from '../contexts/PortfolioContext';

export function InsightsPage() {
  const { language } = usePortfolio();
  const isZh = language === 'zh';
  const l = (en: string, zh: string) => (isZh ? zh : en);

  const behavioralData = [
    { trait: l('Discipline', '纪律性'), score: 82, fullMark: 100 },
    { trait: l('Consistency', '一致性'), score: 78, fullMark: 100 },
    { trait: l('FOMO Control', 'FOMO 控制'), score: 65, fullMark: 100 },
    { trait: l('Loss Aversion', '损失厌恶'), score: 58, fullMark: 100 },
    { trait: l('Patience', '耐心'), score: 74, fullMark: 100 },
  ];

  const adviceGap = {
    totalAdvice: 42,
    executed: 31,
    notExecuted: 11,
    executionRate: 73.8,
  };

  const recentDecisions = [
    {
      date: l('Feb 20', '2月20日'),
      advice: l('Buy NVDA', '买入 NVDA'),
      action: l('Executed', '已执行'),
      outcome: 'positive',
    },
    {
      date: l('Feb 18', '2月18日'),
      advice: l('Reduce TSLA', '减仓 TSLA'),
      action: l('Not Executed', '未执行'),
      reason: l('Fear of locking in loss', '担心止损确认亏损'),
      outcome: 'negative',
    },
    {
      date: l('Feb 15', '2月15日'),
      advice: l('Hold AAPL', '持有 AAPL'),
      action: l('Executed', '已执行'),
      outcome: 'neutral',
    },
    {
      date: l('Feb 12', '2月12日'),
      advice: l('Buy META', '买入 META'),
      action: l('Delayed 2 days', '延后 2 天'),
      reason: l('Waited for lower price', '等待更低价格'),
      outcome: 'negative',
    },
  ];

  const improvements = [
    {
      title: l('Reduce Loss Aversion', '降低损失厌恶'),
      description: l(
        'You tend to hold losing positions too long. Consider setting stop-loss rules.',
        '你倾向于过久持有亏损仓位，建议设置止损规则。'
      ),
      priority: 'high',
    },
    {
      title: l('Control FOMO', '控制追涨情绪'),
      description: l(
        'Resist chasing momentum. Stick to your planned entry points.',
        '避免追涨，按计划入场。'
      ),
      priority: 'medium',
    },
    {
      title: l('Increase Consistency', '提升执行一致性'),
      description: l(
        'Execute advice within 24 hours for better results.',
        '建议在 24 小时内执行，结果通常更好。'
      ),
      priority: 'medium',
    },
  ];

  const overallScore = 71;

  return (
    <div className="min-h-screen bg-gray-50 pb-4">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="p-4">
          <h1 className="text-xl font-semibold text-gray-900">{l('Behavioral Insights', '行为洞察')}</h1>
          <p className="text-xs text-gray-500">{l('Understand your investment psychology', '了解你的投资心理')}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="border-blue-100 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">{l('Overall Behavioral Score', '综合行为评分')}</p>
                <p className="text-4xl font-semibold text-blue-900 mt-1">{overallScore}</p>
                <p className="text-xs text-blue-600 mt-1">{l('Good standing • Keep improving', '整体表现良好 · 持续提升')}</p>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="32" stroke="#dbeafe" strokeWidth="8" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="#2563eb"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(overallScore / 100) * 201.06} 201.06`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{l('Behavioral Profile', '行为画像')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={behavioralData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="trait" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {behavioralData.map((item) => (
                <div key={item.trait} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{item.trait}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.score >= 75 ? 'bg-green-500' : item.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{l('Advice-Action Gap', '建议执行差距')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-semibold text-gray-900">{adviceGap.executionRate}%</p>
                <p className="text-xs text-gray-500 mt-1">{l('Execution Rate (30 days)', '执行率（30天）')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {adviceGap.executed}/{adviceGap.totalAdvice}
                </p>
                <p className="text-xs text-gray-500">{l('Executed', '已执行')}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>{l('Executed', '已执行')}</span>
                <span>{adviceGap.executed} ({((adviceGap.executed / adviceGap.totalAdvice) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${(adviceGap.executed / adviceGap.totalAdvice) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>{l('Not Executed', '未执行')}</span>
                <span>{adviceGap.notExecuted} ({((adviceGap.notExecuted / adviceGap.totalAdvice) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-red-400 h-2.5 rounded-full" style={{ width: `${(adviceGap.notExecuted / adviceGap.totalAdvice) * 100}%` }} />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600">{l('Most common reason for not executing:', '最常见未执行原因：')}</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{l('"Fear / Risk concern" (6 times)', '“担忧风险” （6次）')}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{l("Monkey's Summary", 'Monkey 总结')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              {isZh
                ? '你在执行投资计划上表现出较强纪律性，但在回撤阶段会出现一定损失厌恶，亏损仓位持有时间偏长。你的追涨情绪控制仍有提升空间，有时会在计划外追随短期动量。整体来看你是方法型投资者，但仍需加强回撤阶段的情绪管理。'
                : 'You demonstrate strong discipline in following your investment plan. However, you show signs of loss aversion during drawdowns and hold losing trades longer than suggested. Your FOMO control still needs improvement. Overall, you are a methodical investor with room to improve emotional discipline.'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{l('Recent Decisions', '近期决策')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDecisions.map((decision, index) => (
              <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{decision.advice}</p>
                    <p className="text-xs text-gray-500">{decision.date}</p>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      decision.outcome === 'positive'
                        ? 'text-green-600'
                        : decision.outcome === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {decision.outcome === 'positive' ? <CheckCircle2 size={14} /> : decision.outcome === 'negative' ? <AlertCircle size={14} /> : <Minus size={14} />}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`px-2 py-1 rounded ${
                      decision.action === l('Executed', '已执行')
                        ? 'bg-green-50 text-green-700'
                        : decision.action.includes(l('Delayed', '延后'))
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {decision.action}
                  </span>
                  {decision.reason && <span className="text-gray-500 italic">{decision.reason}</span>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{l('Suggested Improvements', '建议改进')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {improvements.map((improvement, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  improvement.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className={`text-sm font-medium ${improvement.priority === 'high' ? 'text-red-900' : 'text-blue-900'}`}>
                    {improvement.title}
                  </h4>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      improvement.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {l(improvement.priority, improvement.priority === 'high' ? '高' : '中')}
                  </span>
                </div>
                <p className={`text-xs ${improvement.priority === 'high' ? 'text-red-700' : 'text-blue-700'}`}>
                  {improvement.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Link
          to="/monthly-report"
          className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{l('View Full Monthly Report', '查看完整月报')}</p>
              <p className="text-xs text-blue-100 mt-1">{l('Detailed analysis & recommendations', '查看详细分析与建议')}</p>
            </div>
            <ArrowRight size={20} />
          </div>
        </Link>
      </div>
    </div>
  );
}

