import 'regenerator-runtime';

import router from './router';

addEventListener('fetch', (event) => {
  event.respondWith(router.handle(event));
});
