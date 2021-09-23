import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

import validateKey from './middlewares/validate-key';
import validateJsonBody from './middlewares/validate-json-body';
import { handleFreshstatusv2, handleTelegramv2, handleWordPressv2 } from './injection-v2';

const router = Router();

router.get('/', (_, event) => getAssetFromKV(event, {
  mapRequestToAsset: (request) => new Request(`${new URL(request.url).origin}/index.html`, request),
}));

router.post('/api:key/v2/freshstatus', validateKey, validateJsonBody, handleFreshstatusv2);

router.post('/api:key/v2/telegram', validateKey, validateJsonBody, handleTelegramv2);

router.post('/api:key/v2/wordpress', validateKey, validateJsonBody, handleWordPressv2);

router.all('*', async (_, event) => {
  try {
    return await getAssetFromKV(event);
  } catch (e) {
    return getAssetFromKV(event, {
      mapRequestToAsset: (request) => new Request(`${new URL(request.url).origin}/404.html`, request),
    });
  }
});

export default (request, event) => router.handle(request, event);
