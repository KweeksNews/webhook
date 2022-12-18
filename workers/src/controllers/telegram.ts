import { Config } from '../config';
import { TelegramService } from '../services';

export class TelegramController {
  public constructor(private readonly telegramService: TelegramService) {}

  public async executeCommand(request: Request) {
    try {
      const data = await request.json();

      if (await this.telegramService.executeCommand(data)) {
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
