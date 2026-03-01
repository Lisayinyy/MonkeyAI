import { marketSeed } from "../data/seed.js";

function getVolatilityLabel(changePercent) {
  const absChange = Math.abs(changePercent);
  if (absChange >= 1.8) return "High";
  if (absChange >= 0.8) return "Moderate";
  return "Low";
}

function getMinuteDrift() {
  const seed = Math.floor(Date.now() / 60000);
  return ((seed % 11) - 5) * 0.03;
}

export function getMarketSummary(symbol = "SPY") {
  const upperSymbol = String(symbol || "SPY").toUpperCase();
  const base = marketSeed[upperSymbol] || marketSeed.SPY;
  const drift = getMinuteDrift();

  const price = Number((base.price * (1 + drift / 100)).toFixed(2));
  const change = Number((base.change + drift).toFixed(2));

  return {
    spy: {
      symbol: base.symbol,
      price,
      change,
      trend: change >= 0 ? "up" : "down",
    },
    volatility: getVolatilityLabel(change),
    lastUpdated: new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    }),
  };
}

