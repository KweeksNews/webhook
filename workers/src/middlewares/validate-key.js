import CONFIG from '../config/config';

const validateKey = (event) => {
  const { param } = event.request;

  if (param.key == CONFIG.apiKey) {
    event.request.validKey = true;
  } else {
    return new Response(JSON.stringify({
      success: false,
      data: 'Invalid API key.',
    }), {
      status: 401,
      headers: CONFIG.headers,
    });
  }
};

export default validateKey;
