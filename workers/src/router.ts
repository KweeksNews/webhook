// eslint-disable-next-line import/no-unresolved
import manifest from '__STATIC_CONTENT_MANIFEST';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { Router } from 'itty-router';
import { singleton } from 'tsyringe';
import { Config } from './config';
import { FreshstatusController, TelegramController, WordPressController } from './controllers';
import { validateKey, validateJsonBody } from './middlewares';
import { CustomRouter, Request } from './types';

@singleton()
export class AppRouter {
  private readonly rootRouter: CustomRouter;
  private readonly apiRouter: CustomRouter;

  public constructor(
    private readonly freshstatusController: FreshstatusController,
    private readonly telegramController: TelegramController,
    private readonly wordPressController: WordPressController,
  ) {
    this.rootRouter = <CustomRouter>Router();
    this.apiRouter = <CustomRouter>Router({ base: '/api' });

    const sendFreshstatusNotification = this.freshstatusController.sendNotification;
    const executeTelegramCommand = this.telegramController.executeCommand;
    const sendWordPressNotification = this.wordPressController.sendNotification;

    this.rootRouter
      .get<CustomRouter>('/', (req, env, ctx) =>
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
      .all<CustomRouter>('/api/*', this.apiRouter.handle)
      .all<CustomRouter>('*', async (req, env, ctx) => {
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

          return new Response(response.body, {
            status: 404,
            headers: response.headers,
          });
        }
      });

    this.apiRouter
      .post<CustomRouter>(
        '/freshstatus',
        validateKey,
        validateJsonBody,
        sendFreshstatusNotification,
      )
      .post<CustomRouter>('/telegram', validateKey, validateJsonBody, executeTelegramCommand)
      .post<CustomRouter>('/wordpress', validateKey, validateJsonBody, sendWordPressNotification)
      .all<CustomRouter>('*', async () => {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Not found',
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
