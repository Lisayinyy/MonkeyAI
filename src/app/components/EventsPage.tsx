import { Link } from 'react-router';
import { ArrowLeft, TrendingUp, Calendar, AlertCircle, Newspaper } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface Event {
  id: string;
  type: 'earnings' | 'macro' | 'news' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  affectedSymbols: string[];
  timestamp: string;
  portfolioImpact: string;
}

export function EventsPage() {
  const events: Event[] = [
    {
      id: '1',
      type: 'earnings',
      title: 'NVDA Earnings Report',
      description: 'Q4 2025 earnings expected after market close on Feb 26',
      impact: 'high',
      affectedSymbols: ['NVDA'],
      timestamp: '4 days away',
      portfolioImpact: 'High volatility expected. 12% of your portfolio.',
    },
    {
      id: '2',
      type: 'macro',
      title: 'Fed Interest Rate Decision',
      description: 'FOMC meeting scheduled for March 2. Rate hold expected.',
      impact: 'high',
      affectedSymbols: ['SPY', 'All Holdings'],
      timestamp: '8 days away',
      portfolioImpact: 'Affects all tech positions. Monitor for policy guidance.',
    },
    {
      id: '3',
      type: 'earnings',
      title: 'META Earnings Report',
      description: 'Q4 2025 earnings beat expectations, revenue up 18%',
      impact: 'high',
      affectedSymbols: ['META'],
      timestamp: '2 hours ago',
      portfolioImpact: 'Positive impact. 10% of portfolio. Consider increasing position.',
    },
    {
      id: '4',
      type: 'news',
      title: 'AI Regulation Bill Proposed',
      description: 'Senate introduces new AI safety and transparency framework',
      impact: 'medium',
      affectedSymbols: ['MSFT', 'GOOGL', 'META'],
      timestamp: '5 hours ago',
      portfolioImpact: 'Monitoring regulatory risk. Affects 37% of portfolio.',
    },
    {
      id: '5',
      type: 'alert',
      title: 'TSLA Price Alert',
      description: 'Stock down 8.2% today on production concerns',
      impact: 'medium',
      affectedSymbols: ['TSLA'],
      timestamp: '1 day ago',
      portfolioImpact: 'Consider rebalancing per AI advice. 5% of portfolio.',
    },
    {
      id: '6',
      type: 'earnings',
      title: 'AAPL Earnings Report',
      description: 'Strong iPhone sales in China. Services revenue grew 15%',
      impact: 'medium',
      affectedSymbols: ['AAPL'],
      timestamp: '3 days ago',
      portfolioImpact: 'Positive momentum. 18% of portfolio maintained.',
    },
    {
      id: '7',
      type: 'macro',
      title: 'CPI Data Release',
      description: 'Inflation cooled to 2.4%. Below expectations.',
      impact: 'medium',
      affectedSymbols: ['SPY', 'All Holdings'],
      timestamp: '5 days ago',
      portfolioImpact: 'Positive for equities. Risk-on sentiment supported.',
    },
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'earnings':
        return <TrendingUp size={20} className="text-blue-600" />;
      case 'macro':
        return <Calendar size={20} className="text-purple-600" />;
      case 'alert':
        return <AlertCircle size={20} className="text-amber-600" />;
      default:
        return <Newspaper size={20} className="text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <Link to="/" className="text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">Portfolio Events</h1>
            <p className="text-xs text-gray-500">Monitoring your holdings</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Summary Banner */}
        <Card className="border-blue-100 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">Upcoming Events</p>
                <p className="text-xs text-blue-700">2 high-impact events this week</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-blue-900">7</p>
                <p className="text-xs text-blue-700">Active alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Event Header */}
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getEventIcon(event.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {event.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${getImpactColor(
                            event.impact
                          )}`}
                        >
                          {event.impact} impact
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{event.timestamp}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700">{event.description}</p>

                  {/* Affected Symbols */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {event.affectedSymbols.map((symbol) => (
                      <span
                        key={symbol}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                      >
                        {symbol}
                      </span>
                    ))}
                  </div>

                  {/* Portfolio Impact */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Impact on Your Portfolio</p>
                    <p className="text-sm text-gray-900">{event.portfolioImpact}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
