import CONFIG from './config/config';

import CloudflareApi from './services/cloudflare-api';
import TelegramBot from './services/telegram-bot';

const services = {
  cloudflareApi: new CloudflareApi({
    token: CONFIG.cloudflare.token,
    zoneId: CONFIG.cloudflare.zoneId,
    accountMail: CONFIG.cloudflare.accountMail,
  }),
  telegramBot: new TelegramBot({
    token: CONFIG.telegram.token,
    username: CONFIG.telegram.username,
  }),
};

export default services;
