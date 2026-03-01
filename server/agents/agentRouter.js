import { runMockProvider } from "./providers/mockProvider.js";
import { runOpenAICompatibleProvider } from "./providers/openAICompatibleProvider.js";
import { runMcpBridgeProvider } from "./providers/mcpBridgeProvider.js";

const fallbackAgentMap = {
  advisor: { provider: "mock" },
  market: { provider: "mock" },
  risk: { provider: "mock" },
};

const providerHandlers = {
  mock: runMockProvider,
  "openai-compatible": runOpenAICompatibleProvider,
  "mcp-bridge": runMcpBridgeProvider,
};

function parseAgentMap(raw) {
  if (!raw) return { ...fallbackAgentMap };

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...fallbackAgentMap };
    }
    return { ...fallbackAgentMap, ...parsed };
  } catch {
    return { ...fallbackAgentMap };
  }
}

function normalizeMessage(message) {
  if (!message || typeof message !== "object") return null;
  const role = ["system", "user", "assistant", "tool"].includes(message.role)
    ? message.role
    : null;
  if (!role) return null;

  const content =
    typeof message.content === "string"
      ? message.content
      : message.content == null
        ? ""
        : JSON.stringify(message.content);

  return { role, content };
}

export function createAgentRouter(env = process.env) {
  const configuredMap = parseAgentMap(env.AGENT_MAP);
  const defaultProvider = env.DEFAULT_AGENT_PROVIDER || "mock";

  async function chat({ agentId, messages, prompt, context }) {
    const resolvedAgentId = agentId || "advisor";
    const agentConfig = configuredMap[resolvedAgentId] || { provider: defaultProvider };
    const providerName = agentConfig.provider || defaultProvider;
    const handler = providerHandlers[providerName];

    if (!handler) {
      throw new Error(
        `Unsupported provider "${providerName}". Supported: ${Object.keys(providerHandlers).join(", ")}`,
      );
    }

    const normalizedMessages = Array.isArray(messages)
      ? messages.map(normalizeMessage).filter(Boolean)
      : [];

    if (normalizedMessages.length === 0 && typeof prompt === "string" && prompt.trim()) {
      normalizedMessages.push({ role: "user", content: prompt.trim() });
    }

    if (normalizedMessages.length === 0) {
      throw new Error("No message provided. Send `messages` or a `prompt`.");
    }

    return handler({
      agentId: resolvedAgentId,
      messages: normalizedMessages,
      context,
      config: agentConfig,
    });
  }

  function listAgents() {
    return Object.entries(configuredMap).map(([id, config]) => ({
      id,
      provider: config.provider || defaultProvider,
    }));
  }

  return {
    chat,
    listAgents,
  };
}

