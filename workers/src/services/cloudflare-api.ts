import { inject, singleton } from 'tsyringe';
import {
  ChangeSecurityLevelParams,
  ChangeSecurityLevelResBody,
  CreateWorkerRouteParams,
  CreateWorkerRouteResBody,
  DeleteWorkerRouteParams,
  DeleteWorkerRouteResBody,
  GetSecurityLevelResBody,
} from '../types';

@singleton()
export class CloudflareApiService {
  private readonly baseUrl = `https://api.cloudflare.com/client/v4`;
  private readonly headers = new Headers({
    authorization: `Bearer ${this.token}`,
    'content-type': 'application/json',
  });

  public constructor(
    @inject('CloudflareToken') private readonly token: string,
    @inject('CloudflareZoneId') private readonly zoneId: string,
  ) {}

  /**
   * Use this method to get current zone security level setting. On success, the security level settings is returned.
   */
  public async getSecurityLevel(): Promise<GetSecurityLevelResBody> {
    const url = `${this.baseUrl}/zones/${this.zoneId}/settings/security_level`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });

    return response.json();
  }

  /**
   * Use this method to change current zone security level setting. On success, the security level settings is returned.
   */
  public async changeSecurityLevel(
    params: ChangeSecurityLevelParams,
  ): Promise<ChangeSecurityLevelResBody> {
    const url = `${this.baseUrl}/zones/${this.zoneId}/settings/security_level`;

    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(params),
    });

    return response.json();
  }

  /**
   * Use this method to create worker route on current zone. On success, the route id is returned.
   */
  public async createWorkerRoute(
    params: CreateWorkerRouteParams,
  ): Promise<CreateWorkerRouteResBody> {
    const url = `${this.baseUrl}/zones/${this.zoneId}/workers/routes`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(params),
    });

    return response.json();
  }

  /**
   * Use this method to delete worker route on current zone. On success, the route id is returned.
   */
  public async deleteWorkerRoute({
    id,
  }: DeleteWorkerRouteParams): Promise<DeleteWorkerRouteResBody> {
    const url = `${this.baseUrl}/zones/${this.zoneId}/workers/routes/${id}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    });

    return response.json();
  }
}
