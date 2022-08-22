import { localEnv } from '../index';

export const Config = {
  apiKey: localEnv.API_KEY,
  dateFormat: 'D MMMM YYYY, HH:mm:ss',
  headers: new Headers({
    'content-type': 'application/json',
    'user-agent': 'KweeksHook/2.0.0 (+https://webhook.kweeksnews.com/)',
  }),
  freshstatus: {
    url: 'https://status.kweeksnews.com',
  },
  telegram: {
    token: localEnv.TELEGRAM_TOKEN,
    username: '@kweeksbot',
  },
  cloudflare: {
    token: localEnv.CLOUDFLARE_TOKEN,
    zoneId: localEnv.CLOUDFLARE_ZONEID,
    accountMail: localEnv.CLOUDFLARE_ACCOUNTMAIL,
  },
};
