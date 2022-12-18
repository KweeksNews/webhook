import {
  ForwardMessageParams,
  ForwardMessageResBody,
  SendMessageParams,
  SendMessageResBody,
} from '../types';

export class TelegramBotService {
  private readonly baseUrl = `https://api.telegram.org/bot${this.token}`;
  private readonly headers = new Headers({
    'content-type': 'application/json',
  });

  public constructor(private readonly token: string, public readonly username: string) {}

  /**
   * Use this method to send text messages. On success, the sent Message is returned.
   */
  public async sendMessage(params: SendMessageParams): Promise<SendMessageResBody> {
    const url = `${this.baseUrl}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(params),
    });

    return response.json();
  }

  /**
   * Use this method to forward messages of any kind. Service messages can't be forwarded. On success, the sent Message is returned.
   */
  public async forwardMessage(params: ForwardMessageParams): Promise<ForwardMessageResBody> {
    const url = `${this.baseUrl}/forwardMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(params),
    });

    return response.json();
  }
}
