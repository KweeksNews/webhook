import { singleton } from 'tsyringe';
import { Config } from '../config';
import { TelegramService } from '../services';
import { Request } from '../types';

@singleton()
export class TelegramController {
  public constructor(private readonly telegramService: TelegramService) {}

  public async executeCommand(request: Request) {
    try {
      const data = await request.json();

      const body = await this.telegramService.executeCommand(data);

      return new Response(JSON.stringify(body), {
        status: 200,
        headers: Config.headers,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Internal server error',
        }),
        {
          status: 500,
          headers: Config.headers,
        },
      );
    }
  }
}
