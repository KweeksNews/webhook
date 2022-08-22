import { handleFetchEvent } from './router';

let localEnv: Env;

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    localEnv = env;
    handleFetchEvent(req, env, ctx);
  },
};

export { localEnv };
