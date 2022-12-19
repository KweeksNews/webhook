import { Config } from '../config';
import { Request } from '../types';

export async function validateKey(request: Request, env: Env) {
  const headers = request.headers as Headers;
  const apiKey = JSON.parse((await env.CONFIG.get('api_key')) as string) as ConfigApiKey;
  let requestApiKey = '';

  if (headers.has('authorization')) {
    const value = headers.get('authorization') as string;
    const type = value.split(' ')[0];

    if (type === 'Basic') {
      requestApiKey = atob(value.split(' ')[1]).split(':')[1];
    }
  } else if (headers.has('x-api-key')) {
    requestApiKey = headers.get('x-api-key') as string;
  } else if (headers.has('x-telegram-bot-api-secret-token')) {
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
