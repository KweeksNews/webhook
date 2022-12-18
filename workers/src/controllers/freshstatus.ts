import { Config } from '../config';
import { FreshstatusService } from '../services';

export class FreshstatusController {
  public constructor(private readonly freshstatusService: FreshstatusService) {}

  public async sendNotification(request: Request) {
    try {
      const data = await request.json();

      if (await this.freshstatusService.sendNotification(data)) {
        return new Response(
          JSON.stringify({
            success: true,
            data: 'Request success',
          }),
          {
            status: 200,
            headers: Config.headers,
          },
        );
      }

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
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          data: (error as Error).message,
        }),
        {
          status: 500,
          headers: Config.headers,
        },
      );
    }
  }
}
