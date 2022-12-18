import { Config } from '../config';
import { WordPressService } from '../services';
import { Request } from '../types';

export class WordPressController {
  public constructor(private readonly wordPressService: WordPressService) {}

  public async sendNotification(request: Request): Promise<Response> {
    try {
      const data = await request.json();

      const body = await this.wordPressService.sendNotification(data);
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