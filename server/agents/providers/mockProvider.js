const defaultPlans = [
  "Review current concentration risk for top 3 holdings.",
  "Stage entries over 2-3 days to reduce timing risk.",
  "Set max drawdown alert at portfolio level (example: -6%).",
];

export async function runMockProvider({ agentId, messages }) {
  const latestUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user")?.content;

  const hasPrompt = typeof latestUserMessage === "string" && latestUserMessage.trim().length > 0;
  const tip = hasPrompt ? defaultPlans[0] : defaultPlans[1];

  return {
    provider: "mock",
    model: "rule-based",
    agentId,
    reply: tip,
    actionPlan: defaultPlans,
    toolCalls: [],
  };
}
