import CONFIG from '../config/config';

const validateJsonBody = async (request) => {
  try {
    const { headers } = request;

    if (headers.get('content-type').includes('application/json')) {
      const requestClone = await request.clone();
      await requestClone.json();
    } else {
      return new Response(JSON.stringify({
        success: false,
        data: 'Invalid content type',
      }), {
        status: 400,
        headers: CONFIG.headers,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      data: error.message,
    }), {
      status: 400,
      headers: CONFIG.headers,
    });
  }
};

export default validateJsonBody;
