import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { type Cookie, deleteCookie, getCookies, setCookie } from "http";

interface State {
  user: string;
}

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const cookies = getCookies(req.headers);
  const user = cookies.user || makeUser();
  ctx.state.user = user;
  const resp = await ctx.next();
  if (req.headers.get("upgrade") != "websocket") {
    setCookie(resp.headers, { name: "user", value: user });
  }
  return resp;
}

function makeUser() {
  return crypto.randomUUID();
}
