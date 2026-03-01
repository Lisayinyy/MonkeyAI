import { useState, useMemo } from 'react';
import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis } from 'recharts';

interface PriceDataPoint {
  time: string;
  price: number;
  date: Date;
}

interface StockPriceChartProps {
  symbol: string;
  currentPrice: number;
  changePercent: number;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

export function StockPriceChart({ symbol, currentPrice, changePercent }: StockPriceChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('1D');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isPositive = changePercent >= 0;

  // Generate mock price data based on time range
  const priceData = useMemo(() => {
    const data: PriceDataPoint[] = [];
    const now = new Date();
    let points = 0;
    let interval = 0;
    let volatility = 0;

    switch (selectedRange) {
      case '1D':
        points = 78; // Every 5 minutes in trading day (6.5 hours)
        interval = 5 * 60 * 1000;
        volatility = 0.003;
        break;
      case '1W':
        points = 35; // 7 days, 5 points per day
        interval = 24 * 60 * 60 * 1000 / 5;
        volatility = 0.008;
        break;
      case '1M':
        points = 30; // ~1 point per day
        interval = 24 * 60 * 60 * 1000;
        volatility = 0.015;
        break;
      case '3M':
        points = 60; // ~1 point per 1.5 days
        interval = 1.5 * 24 * 60 * 60 * 1000;
        volatility = 0.025;
        break;
      case '1Y':
        points = 52; // ~1 point per week
        interval = 7 * 24 * 60 * 60 * 1000;
        volatility = 0.04;
        break;
      case '5Y':
        points = 60; // ~1 point per month
        interval = 30 * 24 * 60 * 60 * 1000;
        volatility = 0.08;
        break;
    }

    // Start from the base price and work backwards
    const trend = changePercent / 100;
    let price = currentPrice / (1 + trend);

    for (let i = 0; i < points; i++) {
      const timeAgo = now.getTime() - (points - i) * interval;
      const date = new Date(timeAgo);
      
      // Add some random walk with trend
      const randomChange = (Math.random() - 0.5) * volatility;
      const trendComponent = (trend / points) * 1.5;
      price = price * (1 + randomChange + trendComponent);
      
      let timeStr = '';
      if (selectedRange === '1D') {
        timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      } else if (selectedRange === '1W') {
        timeStr = date.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        timeStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      data.push({
        time: timeStr,
        price: parseFloat(price.toFixed(2)),
        date,
      });
    }

    // Make sure the last point is the current price
    data[data.length - 1].price = currentPrice;

    return data;
  }, [selectedRange, currentPrice, changePercent]);

  const minPrice = Math.min(...priceData.map(d => d.price));
  const maxPrice = Math.max(...priceData.map(d => d.price));
  const priceRange = maxPrice - minPrice;
  const yAxisDomain = [
    minPrice - priceRange * 0.05,
    maxPrice + priceRange * 0.05
  ];

  const displayData = activeIndex !== null ? priceData[activeIndex] : priceData[priceData.length - 1];

  return (
    <div className="space-y-3">
      {/* Chart */}
      <div 
        className="relative -mx-2"
        onMouseLeave={() => setActiveIndex(null)}
        onTouchEnd={() => setActiveIndex(null)}
        style={{ touchAction: 'pan-y' }}
      >
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart 
            data={priceData} 
            margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
            onMouseMove={(state: any) => {
              if (state && state.activeTooltipIndex !== undefined) {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
          >
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0.4} 
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0} 
                />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time"
              hide={true}
            />
            <YAxis 
              domain={yAxisDomain}
              hide={true}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2.5}
              fill={`url(#gradient-${symbol})`}
              animationDuration={500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Hover indicator dot */}
        {activeIndex !== null && (
          <div 
            className="absolute top-2 left-4 bg-white dark:bg-[#1a1a2e] px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-[#60a5fa]/20"
            style={{ pointerEvents: 'none' }}
          >
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              ${displayData.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {displayData.time}
            </p>
          </div>
        )}
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between gap-1 border-t border-gray-200 dark:border-[#60a5fa]/15 pt-3">
        {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as TimeRange[]).map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              selectedRange === range
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252541]'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}
