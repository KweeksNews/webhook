import CONFIG from '../config/config';

const validateKey = (request, event) => {
  const { params } = request;

  if (params.key == CONFIG.apiKey) {
    request.validKey = true;
    event.request.validKey = true;
  } else {
    return new Response(JSON.stringify({
      success: false,
      data: 'Invalid API key',
    }), {
      status: 401,
      headers: CONFIG.headers,
    });
  }
};

export default validateKey;
