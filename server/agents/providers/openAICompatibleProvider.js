function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || "https://api.openai.com/v1").replace(/\/+$/, "");
}

function normalizeReply(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item?.text === "string" ? item.text : ""))
      .filter(Boolean)
      .join("\n");
  }
  if (content == null) return "";
  return JSON.stringify(content);
}

export async function runOpenAICompatibleProvider({
  agentId,
  messages,
  config,
}) {
  const apiKey = config.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      `Agent "${agentId}" uses openai-compatible provider but OPENAI_API_KEY is not set.`,
    );
  }

  const model = config.model || process.env.OPENAI_MODEL || "gpt-4.1-mini";
  const baseUrl = normalizeBaseUrl(config.baseUrl || process.env.OPENAI_BASE_URL);
  const url = `${baseUrl}/chat/completions`;

  const payload = {
    model,
    temperature: Number(config.temperature ?? 0.3),
    messages: Array.isArray(messages) ? messages : [],
  };

  if (typeof config.systemPrompt === "string" && config.systemPrompt.trim()) {
    payload.messages = [
      { role: "system", content: config.systemPrompt.trim() },
      ...payload.messages,
    ];
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  const rawText = await response.text();
  let body = null;
  try {
    body = rawText ? JSON.parse(rawText) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const detail = body?.error?.message || rawText || "Unknown provider error";
    throw new Error(`OpenAI-compatible provider failed (${response.status}): ${detail}`);
  }

  const firstChoice = body?.choices?.[0];
  const reply = normalizeReply(firstChoice?.message?.content);

  return {
    provider: "openai-compatible",
    model,
    agentId,
    reply: reply || "No content returned from provider.",
    raw: body,
    toolCalls: firstChoice?.message?.tool_calls || [],
  };
}

