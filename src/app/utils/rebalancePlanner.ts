import type { Holding } from '../contexts/PortfolioContext';

const CASH_SYMBOL = 'CASH';

function uniqueSymbols(symbols: string[]) {
  return [...new Set(symbols)];
}

function getKeepScore(holding: Holding) {
  const targetBias = holding.suggestedAllocation * 2;
  const performanceBias = holding.totalReturn * 1.2;
  const momentumBias = holding.dayChange * 0.8;
  const concentrationPenalty = Math.max(0, holding.allocation - holding.suggestedAllocation) * 1.5;

  return targetBias + performanceBias + momentumBias - concentrationPenalty;
}

export interface RebalancePlan {
  currentCount: number;
  targetCount: number;
  effectiveTargetCount: number;
  coreOverflow: boolean;
  coreSymbols: string[];
  keep: Holding[];
  trim: Holding[];
}

export function buildRebalancePlan(
  holdings: Holding[],
  targetHoldingCount: number,
  coreSymbols: string[] = []
): RebalancePlan {
  const investable = holdings.filter((holding) => holding.symbol !== CASH_SYMBOL);
  const currentCount = investable.length;

  if (currentCount === 0) {
    return {
      currentCount: 0,
      targetCount: 0,
      effectiveTargetCount: 0,
      coreOverflow: false,
      coreSymbols: [],
      keep: [],
      trim: [],
    };
  }

  const clampedTarget = Math.max(1, Math.min(Math.round(targetHoldingCount), currentCount));
  const existingSymbols = new Set(investable.map((holding) => holding.symbol));
  const validCoreSymbols = uniqueSymbols(coreSymbols).filter((symbol) => existingSymbols.has(symbol));

  const coreHoldings = investable.filter((holding) => validCoreSymbols.includes(holding.symbol));
  const nonCore = investable.filter((holding) => !validCoreSymbols.includes(holding.symbol));
  const rankedNonCore = [...nonCore].sort((a, b) => getKeepScore(b) - getKeepScore(a));

  const effectiveTargetCount = Math.max(clampedTarget, coreHoldings.length);
  const nonCoreSlots = Math.max(0, effectiveTargetCount - coreHoldings.length);
  const keepNonCore = rankedNonCore.slice(0, nonCoreSlots);

  const keepSymbols = new Set([...coreHoldings, ...keepNonCore].map((holding) => holding.symbol));
  const keep = investable.filter((holding) => keepSymbols.has(holding.symbol));
  const trim = investable.filter((holding) => !keepSymbols.has(holding.symbol));

  return {
    currentCount,
    targetCount: clampedTarget,
    effectiveTargetCount,
    coreOverflow: coreHoldings.length > clampedTarget,
    coreSymbols: validCoreSymbols,
    keep,
    trim,
  };
}

