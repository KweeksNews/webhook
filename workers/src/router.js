import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

import validateKey from './middlewares/validate-key';
import { handleTelegram, handleWordPress } from './injection';

const router = Router();

router.get('/', (event) => getAssetFromKV(event, {
  mapRequestToAsset: (request) => new Request(`${new URL(request.url).origin}/index.html`, request),
}));

// TODO implement Freshstatus handler
// router.post('/api:key/freshstatus', validateKey);

router.post('/api:key/telegram', validateKey, handleTelegram);

router.post('/api:key/wordpress', validateKey, handleWordPress);

router.all('*', async (event) => {
  try {
    return await getAssetFromKV(event);
  } catch (e) {
    return getAssetFromKV(event, {
      mapRequestToAsset: (request) => new Request(`${new URL(request.url).origin}/404.html`, request),
    });
  }
});

export default router;
