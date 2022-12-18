import { Config } from '../config';
import { Request } from '../types';

export async function validateJsonBody(request: Request) {
  try {
    const { headers } = request;

    if (headers.get('content-type')?.includes('application/json')) {
      await request.json();
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          data: 'Invalid content type',
        }),
        {
          status: 400,
          headers: Config.headers,
        },
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        data: (error as Error).message,
      }),
      {
        status: 400,
        headers: Config.headers,
      },
    );
  }
}
