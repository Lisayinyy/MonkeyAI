import { Link } from 'react-router';
import { ArrowLeft, TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function MonthlyReportPage() {
  const reportPeriod = 'January 2026';
  const overallScore = 71;

  const performanceData = [
    { month: 'Aug', score: 68 },
    { month: 'Sep', score: 65 },
    { month: 'Oct', score: 70 },
    { month: 'Nov', score: 73 },
    { month: 'Dec', score: 75 },
    { month: 'Jan', score: 71 },
  ];

  const biasPatterns = [
    {
      bias: 'Loss Aversion',
      severity: 'High',
      frequency: 8,
      impact: 'Held TSLA 3 weeks past sell signal. Lost additional 12% value.',
      color: 'red',
    },
    {
      bias: 'FOMO Trading',
      severity: 'Medium',
      frequency: 5,
      impact: 'Chased NVDA at peak. Entry 7% above AI suggestion.',
      color: 'amber',
    },
    {
      bias: 'Hesitation',
      severity: 'Medium',
      frequency: 6,
      impact: 'Delayed META buy by 3 days. Missed 4.2% gain.',
      color: 'amber',
    },
  ];

  const monthlyStats = {
    totalAdvice: 18,
    executed: 13,
    delayed: 3,
    ignored: 2,
    executionRate: 72.2,
    avgDelayDays: 1.8,
    portfolioReturn: 3.2,
    marketReturn: 4.1,
  };

  const keyDecisions = [
    {
      date: 'Jan 28',
      action: 'Sold TSLA',
      result: 'Good',
      reasoning: 'Finally executed after 3 weeks. Limited further loss.',
      impact: 'Prevented -$2,400 additional loss',
    },
    {
      date: 'Jan 22',
      action: 'Bought NVDA',
      result: 'Fair',
      reasoning: 'Executed but chased price. Entry could be better.',
      impact: 'Up +2.1%, below potential +4.8%',
    },
    {
      date: 'Jan 15',
      action: 'Ignored META buy',
      result: 'Missed',
      reasoning: 'Waited for lower price that never came.',
      impact: 'Missed +$1,800 opportunity',
    },
    {
      date: 'Jan 8',
      action: 'Held AAPL',
      result: 'Good',
      reasoning: 'Followed advice. Position stable.',
      impact: 'Maintained position, +1.2%',
    },
  ];

  const recommendations = [
    {
      title: 'Set Strict Stop-Loss Rules',
      description:
        'Create automated rules to exit losing positions. Your loss aversion cost you $2,400 this month.',
      priority: 'Critical',
    },
    {
      title: 'Wait for Entry Points',
      description:
        'Resist FOMO. Stick to AI-suggested entry prices. Patience would have saved 7% on NVDA.',
      priority: 'High',
    },
    {
      title: 'Execute Within 24 Hours',
      description:
        'Your 1.8-day average delay is hurting returns. Faster execution would improve performance by ~1.5%.',
      priority: 'High',
    },
    {
      title: 'Review Before Ignoring',
      description:
        'When you disagree with AI advice, document why. You missed a profitable META trade by ignoring.',
      priority: 'Medium',
    },
  ];

  const behaviorMetrics = [
    { metric: 'Discipline', score: 82, change: 5 },
    { metric: 'Loss Aversion', score: 58, change: -3 },
    { metric: 'FOMO Control', score: 65, change: 2 },
    { metric: 'Consistency', score: 78, change: -2 },
    { metric: 'Patience', score: 74, change: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white sticky top-0 z-10">
        <div className="p-4">
          <Link to="/insights" className="text-white mb-3 inline-block">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold">Monthly Investment Report</h1>
          <p className="text-sm text-blue-100">{reportPeriod}</p>
          <div className="mt-4 flex items-center gap-4">
            <div>
              <p className="text-sm text-blue-100">Overall Score</p>
              <p className="text-4xl font-semibold">{overallScore}</p>
            </div>
            <div className="flex-1 text-right">
              <p className="text-sm text-blue-100">vs Previous Month</p>
              <p className="text-2xl font-semibold flex items-center justify-end gap-1">
                <TrendingDown size={20} />
                -4 pts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Executive Summary */}
        <Card className="border-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 leading-relaxed">
              Your behavioral score decreased this month primarily due to{' '}
              <span className="font-medium text-red-600">increased loss aversion</span>. You held
              losing positions significantly longer than recommended, particularly TSLA. While your
              discipline improved, the delay in cutting losses offset gains from good decisions.
              Focus on implementing stop-loss rules and faster execution to improve next month.
            </p>
          </CardContent>
        </Card>

        {/* Score Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">6-Month Score Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Statistics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">This Month's Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Advice Given</p>
                <p className="text-2xl font-semibold text-gray-900">{monthlyStats.totalAdvice}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Execution Rate</p>
                <p className="text-2xl font-semibold text-green-600">
                  {monthlyStats.executionRate}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg Delay</p>
                <p className="text-2xl font-semibold text-amber-600">
                  {monthlyStats.avgDelayDays}d
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Portfolio Return</p>
                <p className="text-2xl font-semibold text-blue-600">
                  +{monthlyStats.portfolioReturn}%
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Executed on time</span>
                <span className="font-medium text-gray-900">{monthlyStats.executed}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Delayed execution</span>
                <span className="font-medium text-amber-600">{monthlyStats.delayed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Not executed</span>
                <span className="font-medium text-red-600">{monthlyStats.ignored}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 -mx-4 -mb-4 p-4 rounded-b-lg">
              <div className="flex items-center gap-2 text-sm">
                <Info size={16} className="text-blue-600" />
                <span className="text-gray-700">
                  Your return was {(monthlyStats.marketReturn - monthlyStats.portfolioReturn).toFixed(1)}%
                  below market (SPY: +{monthlyStats.marketReturn}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Bias Patterns */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Key Bias Patterns Detected</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {biasPatterns.map((pattern, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  pattern.color === 'red'
                    ? 'border-red-200 bg-red-50'
                    : 'border-amber-200 bg-amber-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4
                      className={`font-medium text-sm ${
                        pattern.color === 'red' ? 'text-red-900' : 'text-amber-900'
                      }`}
                    >
                      {pattern.bias}
                    </h4>
                    <p
                      className={`text-xs ${
                        pattern.color === 'red' ? 'text-red-600' : 'text-amber-600'
                      }`}
                    >
                      Occurred {pattern.frequency} times
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      pattern.color === 'red'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {pattern.severity}
                  </span>
                </div>
                <p
                  className={`text-xs ${
                    pattern.color === 'red' ? 'text-red-700' : 'text-amber-700'
                  }`}
                >
                  <span className="font-medium">Example:</span> {pattern.impact}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Behavioral Metrics Change */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Behavioral Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {behaviorMetrics.map((metric) => (
              <div key={metric.metric} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{metric.metric}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.score >= 75
                          ? 'bg-green-500'
                          : metric.score >= 60
                          ? 'bg-blue-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${metric.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{metric.score}</span>
                  <span
                    className={`text-xs font-medium w-12 text-right ${
                      metric.change > 0
                        ? 'text-green-600'
                        : metric.change < 0
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {metric.change > 0 ? '+' : ''}
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Key Decisions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Key Decisions This Month</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {keyDecisions.map((decision, index) => (
              <div key={index} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{decision.action}</p>
                    <p className="text-xs text-gray-500">{decision.date}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      decision.result === 'Good'
                        ? 'bg-green-50 text-green-700'
                        : decision.result === 'Fair'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {decision.result}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{decision.reasoning}</p>
                <p className="text-xs font-medium text-gray-900">{decision.impact}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="border-blue-200">
          <CardHeader className="pb-3 bg-blue-50 rounded-t-lg">
            <CardTitle className="text-base text-blue-900">
              Action Plan for Next Month
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex gap-3">
                <div className="mt-1">
                  {rec.priority === 'Critical' ? (
                    <AlertTriangle size={18} className="text-red-600" />
                  ) : rec.priority === 'High' ? (
                    <Target size={18} className="text-amber-600" />
                  ) : (
                    <CheckCircle2 size={18} className="text-blue-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        rec.priority === 'Critical'
                          ? 'bg-red-100 text-red-700'
                          : rec.priority === 'High'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{rec.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4">
          <h3 className="font-medium mb-1">Ready to improve?</h3>
          <p className="text-sm text-blue-100 mb-3">
            Implement these recommendations and track your progress throughout February.
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function Info({ size, className }: { size: number; className: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}
