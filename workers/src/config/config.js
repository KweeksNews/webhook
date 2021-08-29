const CONFIG = {
  apiKey: API_KEY,
  dateFormat: 'D MMMM YYYY, HH:mm:ss',
  headers: new Headers({
    'content-type': 'application/json',
    'user-agent': 'KweeksHook/2.0.0 (+https://webhook.kweeksnews.com/)',
  }),
  freshstatus: {
    url: 'https://status.kweeksnews.com',
  },
  telegram: {
    token: TELEGRAM_TOKEN,
    username: '@kweeksbot',
  },
  cloudflare: {
    token: CLOUDFLARE_TOKEN,
    zoneId: CLOUDFLARE_ZONEID,
    accountMail: CLOUDFLARE_ACCOUNTMAIL,
  },
};

export default CONFIG;
