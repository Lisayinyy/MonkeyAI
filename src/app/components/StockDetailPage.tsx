import { Link, useParams } from 'react-router';
import { ChevronLeft, TrendingUp, TrendingDown, Clock, DollarSign, BarChart3, Brain } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { StockPriceChart } from './StockPriceChart';

export function StockDetailPage() {
  const { symbol } = useParams();

  // Mock stock data - in real app, this would be fetched based on symbol
  const stockData = {
    AAPL: {
      symbol: 'AAPL',
      name: 'Apple Inc',
      price: 189.23,
      change: 2.45,
      changePercent: 1.31,
      volume: '52.4M',
      marketCap: '2.94T',
      pe: 31.2,
      dayHigh: 191.45,
      dayLow: 187.32,
      week52High: 199.62,
      week52Low: 164.08,
      aiSummary: `Apple continues to demonstrate strong fundamentals with robust iPhone sales and growing services revenue. The company's ecosystem strategy creates high customer retention rates. Recent product launches show innovation in AI integration.

**Key Strengths:** 
• Dominant market position in premium smartphones
• Growing services segment (Apple Music, iCloud, App Store) with 90% gross margins
• Strong balance sheet with $166B in cash
• Expanding into AR/VR and AI markets

**Potential Risks:**
• China market regulatory uncertainties
• Smartphone market saturation in developed countries
• Antitrust scrutiny on App Store practices

**Monkey's Take:** Suitable for long-term investors seeking stability with growth potential. Current valuation is fair given the company's consistent performance and innovation pipeline.`,
    },
    NVDA: {
      symbol: 'NVDA',
      name: 'NVIDIA Corp',
      price: 918.45,
      change: 12.34,
      changePercent: 1.36,
      volume: '48.2M',
      marketCap: '2.27T',
      pe: 72.4,
      dayHigh: 925.67,
      dayLow: 905.23,
      week52High: 974.29,
      week52Low: 403.85,
      aiSummary: `NVIDIA has positioned itself as the dominant player in AI chip manufacturing, with data center revenue growing 217% year-over-year. The company's CUDA software ecosystem creates a significant moat.

**Key Strengths:**
• Market leader in AI/ML accelerators with 80%+ market share
• Strong demand from cloud providers (AWS, Azure, Google Cloud)
• Gaming GPU business remains solid
• Expanding into automotive and edge AI markets

**Potential Risks:**
• High valuation multiples leave little room for disappointment
• Increasing competition from AMD and custom chips from big tech
• Export restrictions to China could impact 20-25% of revenue

**Monkey's Take:** High-growth opportunity but comes with elevated risk due to premium valuation. Best suited for growth-focused investors with higher risk tolerance. Consider dollar-cost averaging into position.`,
    },
    TSLA: {
      symbol: 'TSLA',
      name: 'Tesla Inc',
      price: 245.67,
      change: -4.56,
      changePercent: -1.82,
      volume: '112.4M',
      marketCap: '776B',
      pe: 68.9,
      dayHigh: 252.34,
      dayLow: 243.12,
      week52High: 299.29,
      week52Low: 138.80,
      aiSummary: `Tesla faces a critical transition period balancing EV leadership with autonomous driving ambitions. Production efficiency improvements contrast with margin pressure from price cuts.

**Key Strengths:**
• Leading EV brand with strong customer loyalty
• Vertical integration provides cost advantages
• Energy storage business growing rapidly
• FSD (Full Self-Driving) technology development

**Potential Risks:**
• Intense competition from legacy automakers and Chinese EV makers
• CEO distraction with other ventures
• Margin compression from aggressive pricing
• Autonomous driving timeline uncertainties

**Monkey's Take:** Highly volatile with binary outcomes dependent on autonomous driving success. Suitable only for aggressive growth investors comfortable with significant price swings. Not recommended for conservative portfolios.`,
    },
  };

  const stock = stockData[symbol?.toUpperCase() as keyof typeof stockData] || stockData.AAPL;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f23] pb-4">
      {/* Header */}
      <div className="bg-white dark:bg-[#1a1a2e] border-b border-gray-200 dark:border-[#60a5fa]/15 sticky top-0 z-10">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/market" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
              <ChevronLeft size={24} />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{stock.symbol}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stock.name}</p>
            </div>
          </div>

          {/* Price Info */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">${stock.price}</p>
              <div className="flex items-center gap-2 mt-1">
                {stock.changePercent >= 0 ? (
                  <TrendingUp size={16} className="text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown size={16} className="text-red-600 dark:text-red-400" />
                )}
                <span
                  className={`text-sm font-medium ${
                    stock.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stock.changePercent >= 0 ? '+' : ''}
                  {stock.change} ({stock.changePercent >= 0 ? '+' : ''}
                  {stock.changePercent}%)
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Today</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              <span>Updated 10:23 AM ET</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Statistics */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 dark:text-gray-100">
              <BarChart3 size={18} />
              Key Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stock.marketCap}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">P/E Ratio</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stock.pe}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Volume</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stock.volume}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Day Range</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {stock.dayLow} - {stock.dayHigh}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">52 Week High</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stock.week52High}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">52 Week Low</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stock.week52Low}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monkey's AI Summary - The unique feature! */}
        <Card className="border-blue-100 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Brain size={20} className="text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-base text-blue-900 dark:text-blue-300">Monkey's Summary</CardTitle>
              <span className="ml-auto text-xs bg-blue-600 dark:bg-blue-500 text-white px-2 py-1 rounded-full">
                AI Analysis
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="text-sm text-blue-900 dark:text-blue-200 whitespace-pre-line leading-relaxed">
                {stock.aiSummary}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-400 italic">
                💡 This AI-generated analysis is based on recent market data and company fundamentals. 
                Always do your own research before making investment decisions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Price Chart */}
        <Card className="dark:bg-[#1a1a2e] dark:border-[#60a5fa]/15">
          <CardHeader className="pb-3">
            <CardTitle className="text-base dark:text-gray-100">Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <StockPriceChart 
              symbol={stock.symbol}
              currentPrice={stock.price}
              changePercent={stock.changePercent}
            />
          </CardContent>
        </Card>

        {/* Action Button */}
        <Link
          to="/portfolio"
          className="w-full bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <DollarSign size={18} />
          Add to Portfolio
        </Link>
      </div>
    </div>
  );
}