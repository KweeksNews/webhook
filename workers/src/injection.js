import CONFIG from './config/config';

import CloudflareApi from './services/cloudflare-api';
import TelegramBot from './services/telegram-bot';

import FreshstatusHandler from './handlers/freshstatus';
import TelegramHandler from './handlers/telegram';
import WordPressHandler from './handlers/wordpress';

const cloudflareApi = new CloudflareApi({
  token: CONFIG.cloudflare.token,
  zoneId: CONFIG.cloudflare.zoneId,
  accountMail: CONFIG.cloudflare.accountMail,
});

const telegramBot = new TelegramBot({
  token: CONFIG.telegram.token,
  username: CONFIG.telegram.username,
});

const freshstatusHandler = new FreshstatusHandler({
  telegramBot,
});

const telegramHandler = new TelegramHandler({
  telegramBot,
  cloudflareApi,
});

const wordPressHandler = new WordPressHandler({
  telegramBot,
});

const handleFreshstatus = (request) => freshstatusHandler.handle(request);

const handleTelegram = (request) => telegramHandler.handle(request);

const handleWordPress = (request) => wordPressHandler.handle(request);

export {
  handleFreshstatus,
  handleTelegram,
  handleWordPress,
};
