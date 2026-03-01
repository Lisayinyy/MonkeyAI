import type { InvestmentPreferences } from "../contexts/PortfolioContext";
import type { StockAdvice } from "../utils/adviceEngine";

type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
  signal?: AbortSignal;
};

export type MarketSummary = {
  spy: {
    symbol: string;
    price: number;
    change: number;
    trend: "up" | "down";
  };
  volatility: string;
  lastUpdated: string;
};

export type AdviceResponse = {
  generatedAt: string;
  basePortfolioValue: number;
  suggestions: Array<StockAdvice & { dollarAmount: number }>;
  summary: {
    buy: number;
    hold: number;
    sell: number;
    confidence: number;
  };
};

export type AgentChatResponse = {
  provider: string;
  model: string;
  agentId: string;
  reply: string;
  toolCalls?: unknown[];
  raw?: unknown;
};

const API_BASE = String(import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

function toUrl(path: string) {
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(toUrl(path), {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
  }

  return payload.data as T;
}

export function fetchMarketSummary(symbol = "SPY", signal?: AbortSignal) {
  return request<MarketSummary>(`/api/market-summary?symbol=${encodeURIComponent(symbol)}`, {
    signal,
  });
}

export function fetchDailyAdvice(input: {
  preferences: InvestmentPreferences;
  portfolioValue: number;
  signal?: AbortSignal;
}) {
  return request<AdviceResponse>("/api/advice", {
    method: "POST",
    body: {
      preferences: input.preferences,
      portfolioValue: input.portfolioValue,
    },
    signal: input.signal,
  });
}

export function fetchAgentReply(input: {
  agentId: string;
  prompt?: string;
  messages?: ChatMessage[];
  context?: Record<string, unknown>;
  signal?: AbortSignal;
}) {
  return request<AgentChatResponse>("/api/agent/chat", {
    method: "POST",
    body: input,
    signal: input.signal,
  });
}
