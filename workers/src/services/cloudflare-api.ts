export class CloudflareApi {
  private readonly baseUrl = `https://api.cloudflare.com/client/v4`;
  private readonly headers = new Headers({
    authorization: `Bearer ${this.token}`,
    'content-type': 'application/json',
  });

  public constructor(private readonly token: string, private readonly zoneId: string) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getSecurityLevel(): Promise<any> {
    const url = `${this.baseUrl}/zones/${this.zoneId}/settings/security_level`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    return response.json();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async changeSecurityLevel({ value }: { value: string }): Promise<any> {
    const url = `${this.baseUrl}/zones/${this.zoneId}/settings/security_level`;

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
    const url = `${this.baseUrl}/zones/${this.zoneId}/workers/routes`;

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
    const url = `${this.baseUrl}/zones/${this.zoneId}/workers/routes/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });

    return response.json();
  }
}

export default CloudflareApi;
