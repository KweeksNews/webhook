import { Config } from '../config';
import { Request } from '../router';

export function validateKey(request: Request, env: Env) {
  const { params } = request;

  if (params?.key == env.API_KEY) {
    request.validKey = true;
  } else {
    return new Response(
      JSON.stringify({
        success: false,
        data: 'Invalid API key',
      }),
      {
        status: 401,
        headers: Config.headers,
      },
    );
  }
}
