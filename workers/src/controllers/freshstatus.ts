import autoBind from 'auto-bind';
import { singleton } from 'tsyringe';
import { Config } from '../config';
import { FreshstatusService } from '../services';
import { Request } from '../types';

@singleton()
export class FreshstatusController {
  public constructor(private readonly freshstatusService: FreshstatusService) {
    autoBind(this);
  }

  public async sendNotification(request: Request): Promise<Response> {
    try {
      const data = await request.json();

      const body = await this.freshstatusService.sendNotification(data);
      let statusCode;

      if (body.success) {
        statusCode = 200;
      } else {
        statusCode = 400;
      }

      return new Response(JSON.stringify(body), {
        status: statusCode,
        headers: Config.headers,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          data: 'Internal server error',
        }),
        {
          status: 500,
          headers: Config.headers,
        },
      );
    }
  }
}
