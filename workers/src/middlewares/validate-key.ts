import { Config } from '../config';
import { Request } from '../types';

export async function validateKey(request: Request, env: Env) {
  const headers = request.headers as Headers;
  const apiKey = JSON.parse((await env.CONFIG.get('api_key')) as string) as ConfigApiKey;
  let requestApiKey = '';

  if (headers.get('x-api-key')) {
    requestApiKey = headers.get('x-api-key') as string;
  } else if (headers.get('php-auth-pw')) {
    requestApiKey = headers.get('php-auth-pw') as string;
  } else if (headers.get('x-telegram-bot-api-secret-token')) {
    requestApiKey = headers.get('x-telegram-bot-api-secret-token') as string;
  }

  if (apiKey.includes(requestApiKey)) {
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
