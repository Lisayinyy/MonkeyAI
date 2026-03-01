function resolveAllowedOrigin(requestOrigin) {
  const explicit = process.env.CORS_ORIGIN;
  if (explicit && explicit.trim()) return explicit.trim();
  return requestOrigin || "*";
}

export function setCorsHeaders(res, requestOrigin) {
  const allowedOrigin = resolveAllowedOrigin(requestOrigin);
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
}

export function sendJson(res, statusCode, payload, requestOrigin) {
  setCorsHeaders(res, requestOrigin);

  if (statusCode === 204) {
    res.writeHead(204);
    res.end();
    return;
  }

  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

export async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) return {};
  const rawBody = Buffer.concat(chunks).toString("utf-8");
  if (!rawBody.trim()) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error("Invalid JSON body.");
  }
}

