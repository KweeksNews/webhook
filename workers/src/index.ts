import 'reflect-metadata';
import { container } from 'tsyringe';
import { Config } from './config';
import { AppRouter } from './router';
import { Request } from './types';

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    container.register('Env', { useValue: env });
    container.register('CloudflareToken', { useValue: env.CLOUDFLARE_TOKEN });
    container.register('CloudflareZoneId', { useValue: env.CLOUDFLARE_ZONEID });
    container.register('TelegramToken', { useValue: env.TELEGRAM_TOKEN });
    container.register('TelegramUsername', { useValue: Config.telegram.username });

    const router = container.resolve(AppRouter);

    console.log(req);
    return await router.handle(req, env, ctx);
  },
};
