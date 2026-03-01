import { createServer } from "node:http";
import { URL } from "node:url";
import { createAgentRouter } from "./agents/agentRouter.js";
import { sendJson, readJsonBody } from "./lib/http.js";
import { getMarketSummary } from "./services/marketService.js";
import { getAdvice } from "./services/adviceService.js";

const port = Number(process.env.PORT || 8787);
const agentRouter = createAgentRouter(process.env);

const server = createServer(async (req, res) => {
  const origin = req.headers.origin;
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, null, origin);
    return;
  }

  try {
    if (req.method === "GET" && url.pathname === "/health") {
      sendJson(
        res,
        200,
        {
          status: "ok",
          timestamp: new Date().toISOString(),
          agents: agentRouter.listAgents(),
        },
        origin,
      );
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/agents") {
      sendJson(
        res,
        200,
        {
          agents: agentRouter.listAgents(),
        },
        origin,
      );
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/market-summary") {
      const symbol = url.searchParams.get("symbol") || "SPY";
      sendJson(
        res,
        200,
        {
          data: getMarketSummary(symbol),
        },
        origin,
      );
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/advice") {
      const body = await readJsonBody(req);
      const portfolioValue = Number(body.portfolioValue);

      const data = getAdvice({
        preferences: body.preferences,
        portfolioValue: Number.isFinite(portfolioValue) && portfolioValue > 0 ? portfolioValue : undefined,
      });

      sendJson(res, 200, { data }, origin);
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/agent/chat") {
      const body = await readJsonBody(req);
      const data = await agentRouter.chat({
        agentId: body.agentId,
        messages: body.messages,
        prompt: body.prompt,
        context: body.context,
      });

      sendJson(res, 200, { data }, origin);
      return;
    }

    sendJson(
      res,
      404,
      {
        error: "Not Found",
        path: url.pathname,
      },
      origin,
    );
  } catch (error) {
    sendJson(
      res,
      500,
      {
        error: "Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      origin,
    );
  }
});

server.listen(port, () => {
  console.log(`AI Investment backend listening on http://localhost:${port}`);
});

