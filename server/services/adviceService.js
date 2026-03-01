import { adviceSeed, BASE_PORTFOLIO_VALUE } from "../data/seed.js";

function normalizePreferences(preferences = {}) {
  const safePreferredSectors = Array.isArray(preferences.preferredSectors)
    ? preferences.preferredSectors
    : [];
  const safeExcludedStocks = Array.isArray(preferences.excludedStocks)
    ? preferences.excludedStocks
    : [];

  return {
    tradingStyle: preferences.tradingStyle || "long-term",
    preferredSectors: safePreferredSectors,
    excludedStocks: safeExcludedStocks,
    dividendFocus: Boolean(preferences.dividendFocus),
  };
}

function getFilteredAdvice(preferences) {
  const normalized = normalizePreferences(preferences);
  let filtered = [...adviceSeed];

  if (normalized.excludedStocks.length > 0) {
    filtered = filtered.filter(
      (advice) => !normalized.excludedStocks.includes(advice.symbol),
    );
  }

  if (normalized.preferredSectors.length > 0) {
    const preferredAdvice = filtered.filter((advice) =>
      normalized.preferredSectors.includes(advice.sector),
    );
    const otherAdvice = filtered.filter(
      (advice) => !normalized.preferredSectors.includes(advice.sector),
    );
    filtered = [...preferredAdvice, ...otherAdvice.slice(0, 2)];
  }

  if (normalized.tradingStyle === "day-trader") {
    filtered = filtered.filter(
      (advice) =>
        advice.risk.momentum === "Strong" ||
        advice.risk.momentum === "Moderate" ||
        advice.action === "Sell",
    );
  } else if (normalized.tradingStyle === "long-term") {
    filtered = filtered.filter(
      (advice) =>
        advice.risk.volatility === "Low" ||
        advice.risk.volatility === "Medium" ||
        advice.action === "Hold",
    );
  }

  if (normalized.dividendFocus) {
    const dividendSymbols = ["JNJ", "PG", "XOM", "JPM"];
    const dividendAdvice = filtered.filter((advice) =>
      dividendSymbols.includes(advice.symbol),
    );
    const otherAdvice = filtered.filter(
      (advice) => !dividendSymbols.includes(advice.symbol),
    );
    filtered = [...dividendAdvice, ...otherAdvice.slice(0, 3)];
  }

  return filtered.slice(0, 6);
}

function getSuggestionSummary(suggestions) {
  const summary = suggestions.reduce(
    (acc, item) => {
      if (item.action === "Buy") acc.buy += 1;
      if (item.action === "Hold") acc.hold += 1;
      if (item.action === "Sell") acc.sell += 1;
      return acc;
    },
    { buy: 0, hold: 0, sell: 0 },
  );

  const confidence = Math.max(
    64,
    Math.min(92, 78 + summary.buy * 2 - summary.sell),
  );

  return {
    ...summary,
    confidence,
  };
}

export function getAdvice({ preferences, portfolioValue = BASE_PORTFOLIO_VALUE } = {}) {
  const baseSuggestions = getFilteredAdvice(preferences);
  const ratio = portfolioValue / BASE_PORTFOLIO_VALUE;

  const suggestions = baseSuggestions.map((item) => ({
    ...item,
    dollarAmount: Math.round(item.baseDollarAmount * ratio),
  }));

  return {
    generatedAt: new Date().toISOString(),
    basePortfolioValue: BASE_PORTFOLIO_VALUE,
    suggestions,
    summary: getSuggestionSummary(suggestions),
  };
}

