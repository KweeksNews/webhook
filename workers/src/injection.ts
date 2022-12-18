import { Config } from './config';
import { FreshstatusController, TelegramController, WordPressController } from './controllers';
import {
  CloudflareApiService,
  FreshstatusService,
  TelegramBotService,
  TelegramService,
  WordPressService,
} from './services';

export class AppInjection {
  public readonly freshstatusController: FreshstatusController;
  public readonly telegramController: TelegramController;
  public readonly wordPressController: WordPressController;

  public constructor(private readonly env: Env) {
    const cloudflareApiService = new CloudflareApiService(
      env.CLOUDFLARE_TOKEN,
      env.CLOUDFLARE_ZONEID,
    );
    const telegramBotService = new TelegramBotService(env.TELEGRAM_TOKEN, Config.telegram.username);

    const freshstatusService = new FreshstatusService(env, telegramBotService);
    const telegramService = new TelegramService(env, cloudflareApiService, telegramBotService);
    const wordPressService = new WordPressService(env, telegramBotService);

    this.freshstatusController = new FreshstatusController(freshstatusService);
    this.telegramController = new TelegramController(telegramService);
    this.wordPressController = new WordPressController(wordPressService);
  }
}
