import services from './injection';

import FreshstatusHandler from './handlers/v2/freshstatus';
import TelegramHandler from './handlers/v2/telegram';
import WordPressHandler from './handlers/v2/wordpress';

const handlerv2 = {
  freshstatusHandler: new FreshstatusHandler({
    telegramBot: services.telegramBot,
  }),
  telegramHandler: new TelegramHandler({
    telegramBot: services.telegramBot,
    cloudflareApi: services.cloudflareApi,
  }),
  wordPressHandler: new WordPressHandler({
    telegramBot: services.telegramBot,
  }),
};

const handleFreshstatusv2 = (request) => handlerv2.freshstatusHandler.handle(request);
const handleTelegramv2 = (request) => handlerv2.telegramHandler.handle(request);
const handleWordPressv2 = (request) => handlerv2.wordPressHandler.handle(request);

export {
  handleFreshstatusv2,
  handleTelegramv2,
  handleWordPressv2,
};
