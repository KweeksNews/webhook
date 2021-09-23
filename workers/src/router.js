import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

import CONFIG from './config/config';
import validateKey from './middlewares/validate-key';
import validateJsonBody from './middlewares/validate-json-body';
import { handleFreshstatusv2, handleTelegramv2, handleWordPressv2 } from './injection-v2';

const rootRouter = Router();
const apiRouter = Router({ base: '/api:key' });

apiRouter
  .post('/v2/freshstatus', validateKey, validateJsonBody, handleFreshstatusv2)
  .post('/v2/telegram', validateKey, validateJsonBody, handleTelegramv2)
  .post('/v2/wordpress', validateKey, validateJsonBody, handleWordPressv2);

rootRouter
  .get('/', (_, event) => getAssetFromKV(event, {
    mapRequestToAsset: (request) => new Request(
      `${new URL(request.url).origin}/index.html`, request,
    ),
  }))
  .all('/api:key/*', apiRouter.handle)
  .all('*', async (_, event) => {
    if (event.request.method == 'GET') {
      try {
        return await getAssetFromKV(event);
      } catch (e) {
        return getAssetFromKV(event, {
          mapRequestToAsset: (request) => new Request(
            `${new URL(request.url).origin}/404.html`, request,
          ),
        });
      }
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          data: 'Invalid request',
        }),
        {
          status: 200,
          headers: CONFIG.headers,
        },
      );
    }
  });

export default (request, event) => rootRouter.handle(request, event);
