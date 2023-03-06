import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface State {
  user: string;
}

const connections = new Map<string, WebSocket>();

function logError(msg: string) {
  console.error(msg);
}

function handleConnected(ws: WebSocket, user: string) {
  connections.set(user, ws);
  console.log(`User ${user} connected.`);
}

function handleMessage(data: string) {
  for (const [_, conn] of connections) {
    conn.send(data);
  }
}

function handleError(e: Event | ErrorEvent) {
  console.log(e instanceof ErrorEvent ? e.message : e.type);
}

function handleClose(ws: WebSocket, user: string) {
  logError("Disconnected from client ...");
  connections.delete(user);
}

export const handler = (
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
): Response => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const user = ctx.state.user;
  const { socket: ws, response } = Deno.upgradeWebSocket(req);

  ws.onopen = () => handleConnected(ws, user);
  ws.onmessage = (m) => handleMessage(m.data);
  ws.onclose = () => handleClose(ws, user);
  ws.onerror = (e) => handleError(e);

  return response;
};
