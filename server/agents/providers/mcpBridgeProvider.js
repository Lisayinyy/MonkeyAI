function trimSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

export async function runMcpBridgeProvider({
  agentId,
  messages,
  context,
  config,
}) {
  const bridgeUrl = trimSlash(config.bridgeUrl || process.env.MCP_BRIDGE_URL);
  const bridgePath = config.bridgePath || process.env.MCP_BRIDGE_PATH || "/invoke";
  const authToken = config.authToken || process.env.MCP_BRIDGE_TOKEN;

  if (!bridgeUrl) {
    throw new Error(
      `Agent "${agentId}" uses mcp-bridge provider but MCP_BRIDGE_URL is not set.`,
    );
  }

  const url = `${bridgeUrl}${bridgePath.startsWith("/") ? bridgePath : `/${bridgePath}`}`;
  const requestBody = {
    agentId,
    messages,
    context: context || {},
    metadata: config.metadata || {},
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(requestBody),
  });

  const rawText = await response.text();
  let body = null;
  try {
    body = rawText ? JSON.parse(rawText) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const detail = body?.error || body?.message || rawText || "Unknown MCP bridge error";
    throw new Error(`MCP bridge failed (${response.status}): ${detail}`);
  }

  return {
    provider: "mcp-bridge",
    model: body?.model || "mcp-agent",
    agentId,
    reply:
      body?.reply ||
      body?.output ||
      body?.message ||
      "MCP bridge responded without a text reply.",
    toolCalls: Array.isArray(body?.toolCalls) ? body.toolCalls : [],
    raw: body,
  };
}

