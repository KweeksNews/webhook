// eslint-disable-next-line import/no-unresolved
import manifest from '__STATIC_CONTENT_MANIFEST';
import { Router, Request as IReq, IHTTPMethods as HttpMethods } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { Config } from './config';
import { handleFreshstatus, handleTelegram, handleWordPress } from './injection';
import { validateKey, validateJsonBody } from './middlewares';

export interface Request extends IReq {
  validKey?: boolean;
}

export async function handleFetchEvent(
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  return rootRouter.handle(req, env, ctx);
}

const rootRouter = Router<Request, HttpMethods>();
const apiRouter = Router<Request, HttpMethods>({ base: '/api:key' });

rootRouter
  .get('/', (req, env, ctx) =>
    getAssetFromKV(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { request: req as any, waitUntil: ctx.waitUntil },
      {
        ASSET_MANIFEST: JSON.parse(manifest),
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        cacheControl: { bypassCache: true },
        mapRequestToAsset: (request) =>
          new Request(`${new URL(request.url).origin}/index.html`, request),
      },
    ),
  )
  .all('/api:key/*', validateKey, apiRouter.handle)
  .all('*', async (req, env, ctx) => {
    if (req.method == 'GET') {
      try {
        return await getAssetFromKV(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { request: req as any, waitUntil: ctx.waitUntil },
          {
            ASSET_MANIFEST: JSON.parse(manifest),
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            cacheControl: { bypassCache: true },
          },
        );
      } catch (e) {
        return getAssetFromKV(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          { request: req as any, waitUntil: ctx.waitUntil },
          {
            ASSET_MANIFEST: JSON.parse(manifest),
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            cacheControl: { bypassCache: true },
            mapRequestToAsset: (request) =>
              new Request(`${new URL(request.url).origin}/404.html`, request),
          },
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          data: 'Invalid request',
        }),
        {
          status: 200,
          headers: Config.headers,
        },
      );
    }
  });

apiRouter
  .post('/v2/freshstatus', validateJsonBody, handleFreshstatus)
  .post('/v2/telegram', validateJsonBody, handleTelegram)
  .post('/v2/wordpress', validateJsonBody, handleWordPress);
