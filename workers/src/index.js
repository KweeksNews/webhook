import 'regenerator-runtime';

import handleFetchEvent from './router';

addEventListener('fetch', (event) => {
  event.respondWith(handleFetchEvent(event.request, event));
});
