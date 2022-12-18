import { Config } from '../config';
import { Request } from '../types';

export async function validateJsonBody(request: Request) {
  try {
    const headers = request.headers as Headers;

    if (headers.get('content-type')?.includes('application/json')) {
      const requestClone = request.clone();

      await requestClone.json();
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
        data: 'Invalid request',
      }),
      {
        status: 400,
        headers: Config.headers,
      },
    );
  }
}
