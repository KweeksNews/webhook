import { AppRouter } from './router';
import { Request } from './types';

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    const router = new AppRouter(env);

    return await router.handle(req, env, ctx);
  },
};
