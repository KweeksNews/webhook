import { Config } from './config';
import { FreshstatusHandler, TelegramHandler, WordPressHandler } from './handlers';
import { CloudflareApi, TelegramBot } from './services';

const services = {
  cloudflareApi: new CloudflareApi(
    Config.cloudflare.token,
    Config.cloudflare.zoneId,
    Config.cloudflare.accountMail,
  ),
  telegramBot: new TelegramBot(Config.telegram.token, Config.telegram.username),
};

const handler = {
  freshstatusHandler: new FreshstatusHandler(services.telegramBot),
  telegramHandler: new TelegramHandler(services.telegramBot, services.cloudflareApi),
  wordPressHandler: new WordPressHandler(services.telegramBot),
};

export async function handleFreshstatus(request: Request, env: Env) {
  return handler.freshstatusHandler.handle(request, env);
}

export async function handleTelegram(request: Request, env: Env) {
  return handler.telegramHandler.handle(request, env);
}

export async function handleWordPress(request: Request, env: Env) {
  return handler.wordPressHandler.handle(request, env);
}
