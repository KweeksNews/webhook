import { handleFetchEvent } from './router';

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    return await handleFetchEvent(req, env, ctx);
  },
};
