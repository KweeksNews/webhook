export class CloudflareApi {
  private readonly url = `https://api.cloudflare.com/client/v4/zones/${this.zoneId}`;
  private readonly headers = new Headers({
    'content-type': 'application/json',
    'x-auth-email': this.accountMail,
    'x-auth-key': this.token,
  });

  public constructor(
    private readonly token: string,
    private readonly zoneId: string,
    private readonly accountMail: string,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getSecurityLevel(): Promise<any> {
    const url = `${this.url}/settings/security_level`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    return response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async changeSecurityLevel({ value }: { value: string }): Promise<any> {
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

  public async createWorkerRoute({
    pattern,
    script,
  }: {
    pattern: string;
    script: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async deleteWorkerRoute({ id }: { id: string }): Promise<any> {
    const url = `${this.url}/workers/routes/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });

    return response.json();
  }
}

export default CloudflareApi;
