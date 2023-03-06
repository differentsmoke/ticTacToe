import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import Board from "../islands/Board.tsx";

export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const resp = await ctx.render({ user: ctx.state.user });
    return resp;
  },
};

export default function Home(props: any) {
  return (
    <div class="p-4 mx-auto max-w-screen-md">
      HELLO
      <div>
        <Board />
      </div>
    </div>
  );
}
