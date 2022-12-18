// eslint-disable-next-line import/no-unresolved
import manifest from '__STATIC_CONTENT_MANIFEST';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { Router, Request as IReq, IHTTPMethods as HttpMethods } from 'itty-router';
import { Config } from './config';
import { AppInjection } from './injection';
import { validateKey, validateJsonBody } from './middlewares';

export interface Request extends IReq {
  validKey?: boolean;
}

export class AppRouter {
  private readonly rootRouter: Router;
  private readonly apiRouter: Router;

  public constructor(private readonly env: Env) {
    this.rootRouter = Router<Request, HttpMethods>();
    this.apiRouter = Router<Request, HttpMethods>({ base: '/api' });

    const injection = new AppInjection(this.env);

    const freshstatusController = injection.freshstatusController;
    const telegramController = injection.telegramController;
    const wordPressController = injection.wordPressController;

    this.rootRouter
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
      .all('/api:key/*', validateKey, this.apiRouter.handle)
      .all('*', async (req, env, ctx) => {
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
          const response = await getAssetFromKV(
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

          return new Response(response.body, { status: 404, headers: response.headers });
        }
      });

    this.apiRouter
      .post('/v2/freshstatus', validateJsonBody, freshstatusController.sendNotification)
      .post('/v2/telegram', validateJsonBody, telegramController.executeCommand)
      .post('/v2/wordpress', validateJsonBody, wordPressController.sendNotification)
      .all('*', async () => {
        return new Response(
          JSON.stringify({
            success: false,
            data: 'Not found',
          }),
          {
            status: 404,
            headers: Config.headers,
          },
        );
      });
  }

  public async handle(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return this.rootRouter.handle(req, env, ctx);
  }
}
