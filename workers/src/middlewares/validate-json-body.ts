import { Config } from '../config';

export async function validateJsonBody(request: Request) {
  try {
    const { headers } = request;

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
        data: (error as Error).message,
      }),
      {
        status: 400,
        headers: Config.headers,
      },
    );
  }
}
