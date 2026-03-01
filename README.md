# Monkey - AI Investment Assistant (Mobile-first)

Figma source file:
[AI Investment Coach App](https://www.figma.com/design/aBnL2CYJ0gBL0MdUfDbVQo/AI-Investment-Coach-App)

## What is implemented

- Mobile-first React Web app (Vite + TypeScript)
- Multi-page investment assistant UI
- Backend API server (`server/`) with pluggable multi-agent providers:
  - `mock`
  - `openai-compatible`
  - `mcp-bridge`
- Frontend wired to backend for:
  - `GET /api/market-summary`
  - `POST /api/advice`
  - `POST /api/agent/chat`

## Run locally

Install dependencies:

```bash
npm i
```

Start frontend:

```bash
npm run dev
```

Start backend in another terminal:

```bash
npm run dev:server
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`
- Health check: `http://localhost:8787/health`

## Run as mobile app (Capacitor)

Capacitor native projects are now created:

- iOS project: `ios/`
- Android project: `android/`

Common commands:

```bash
# Rebuild web assets and sync into native projects
npm run mobile:sync

# Open iOS project in Xcode
npm run mobile:ios

# Open Android project in Android Studio
npm run mobile:android
```

Recommended workflow:

1. Keep API server running: `npm run dev:server`
2. Build + sync: `npm run mobile:sync`
3. Open iOS/Android project and run on simulator/device from Xcode or Android Studio

## Environment setup

Copy `.env.example` to `.env` and adjust values.

Important fields:

- `DEFAULT_AGENT_PROVIDER=mock|openai-compatible|mcp-bridge`
- `AGENT_MAP` for per-agent routing
- `OPENAI_API_KEY` if using `openai-compatible`
- `MCP_BRIDGE_URL` if using `mcp-bridge`

## Example `AGENT_MAP`

```bash
AGENT_MAP={"advisor":{"provider":"openai-compatible","model":"gpt-4.1-mini"},"market":{"provider":"mcp-bridge","bridgeUrl":"https://your-mcp-gateway.com"},"risk":{"provider":"mock"}}
```

## Notes on Figma implementation

For pixel-perfect 1:1 implementation, use a Figma link that includes `node-id` (specific frame/component).  
Current repository already contains a generated UI baseline; backend and API wiring are now in place for real agent integration.

If you want direct Figma-node-to-code extraction in Codex, first configure Figma MCP in your local Codex environment:

```bash
codex mcp add figma --url https://mcp.figma.com/mcp
codex mcp login figma
```

Then restart Codex and provide a `design/...?...node-id=` link.
