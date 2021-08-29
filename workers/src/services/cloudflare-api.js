class CloudflareApi {
  constructor({
    token,
    zoneId,
    accountMail,
  }) {
    this.token = token;
    this.zoneId = zoneId;
    this.accountMail = accountMail;
    this.url = `https://api.cloudflare.com/client/v4/zones/${zoneId}`;
    this.headers = new Headers({
      'content-type': 'application/json',
      'x-auth-email': accountMail,
      'x-auth-key': token,
    });
  }

  async getSecurityLevel() {
    const url = `${this.url}/settings/security_level`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    return response.json();
  }

  async changeSecurityLevel({
    value,
  }) {
    const url = `${this.url}/settings/security_level`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify({
        value,
      }),
    });

    return response.json();
  }

  async createWorkerRoute({
    pattern,
    script,
  }) {
    const url = `${this.url}/workers/routes`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        pattern,
        script,
      }),
    });

    return response.json();
  }

  async deleteWorkerRoute({
    routeId,
  }) {
    const url = `${this.url}/workers/routes/${routeId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });

    return response.json();
  }
}

export default CloudflareApi;
