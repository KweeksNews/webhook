import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

import validateKey from './middlewares/validate-key';
import validateJsonBody from './middlewares/validate-json-body';
import { handleFreshstatus, handleTelegram, handleWordPress } from './injection';

const router = Router();

router.get('/', (_, event) => getAssetFromKV(event, {
  mapRequestToAsset: (request) => new Request(`${new URL(request.url).origin}/index.html`, request),
}));

router.post('/api:key/freshstatus', validateKey, validateJsonBody, handleFreshstatus);

router.post('/api:key/telegram', validateKey, validateJsonBody, handleTelegram);

router.post('/api:key/wordpress', validateKey, validateJsonBody, handleWordPress);

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
