import { Config } from '../config';
import { WordPressService } from '../services';

export class WordPressController {
  public constructor(private readonly wordPressService: WordPressService) {}

  public async sendNotification(request: Request) {
    try {
      const data = await request.json();

      if (await this.wordPressService.sendNotification(data)) {
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
