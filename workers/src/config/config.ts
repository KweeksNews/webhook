export const Config = {
  date: {
    format: 'D MMMM YYYY, HH:mm:ss z',
    timezone: 'Asia/Jakarta',
  },
  headers: new Headers({
    'content-type': 'application/json',
    'user-agent': 'KweeksHook/2.0.0 (+https://webhook.kweeksnews.com/)',
  }),
  freshstatus: {
    url: 'https://status.kweeksnews.com',
  },
  telegram: {
    username: '@kweeksbot',
  },
};
