import { Config } from './config';
import { FreshstatusHandler, TelegramHandler, WordPressHandler } from './handlers';
import { CloudflareApi, TelegramBot } from './services';

export async function handleFreshstatus(request: Request, env: Env) {
  const telegramBot = new TelegramBot(env.TELEGRAM_TOKEN, Config.telegram.username);
  const handler = new FreshstatusHandler(telegramBot);

  return handler.handle(request, env);
}

export async function handleTelegram(request: Request, env: Env) {
  const telegramBot = new TelegramBot(env.TELEGRAM_TOKEN, Config.telegram.username);
  const cloudflareApi = new CloudflareApi(env.CLOUDFLARE_TOKEN, env.CLOUDFLARE_ZONEID);
  const handler = new TelegramHandler(telegramBot, cloudflareApi);

  return handler.handle(request, env);
}

export async function handleWordPress(request: Request, env: Env) {
  const telegramBot = new TelegramBot(env.TELEGRAM_TOKEN, Config.telegram.username);
  const handler = new WordPressHandler(telegramBot);

  return handler.handle(request, env);
}
