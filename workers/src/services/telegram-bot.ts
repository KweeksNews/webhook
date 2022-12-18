export class TelegramBotService {
  private readonly baseUrl = `https://api.telegram.org/bot${this.token}`;
  private readonly headers = new Headers({
    'content-type': 'application/json',
  });

  public constructor(private readonly token: string, public readonly username: string) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private composeFetchBody(options: any): string {
    Object.keys(options).forEach((key) => {
      if (
        !options[key] ||
        options[key] === undefined ||
        (Array.isArray(options[key]) && options[key].length === 0)
      ) {
        delete options[key];
      }
    });

    return JSON.stringify(options);
  }

  public async sendMessage({
    chatId,
    text,
    parseMode,
    disableWebPagePreview,
    disableNotification,
    replyToMessageId,
    replyMarkup,
  }: {
    chatId: number | string;
    text: string;
    parseMode?: string;
    disableWebPagePreview?: boolean;
    disableNotification?: boolean;
    replyToMessageId?: number;
    replyMarkup?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    const url = `${this.baseUrl}/sendMessage`;
    const body = this.composeFetchBody({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: disableWebPagePreview,
      disable_notification: disableNotification,
      reply_to_message_id: replyToMessageId,
      reply_markup: replyMarkup,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });

    return response.json();
  }

  public async forwardMessage({
    chatId,
    fromChatId,
    disableNotification,
    messageId,
  }: {
    chatId: string;
    fromChatId: string;
    disableNotification?: boolean;
    messageId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    const url = `${this.baseUrl}/forwardMessage`;
    const body = this.composeFetchBody({
      chat_id: chatId,
      from_chat_id: fromChatId,
      disable_notification: disableNotification,
      message_id: messageId,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });

    return response.json();
  }

  public async sendPhoto({
    chatId,
    photo,
    caption,
    parseMode,
    disableNotification,
    replyToMessageId,
  }: {
    chatId: string;
    photo: string;
    caption?: string;
    parseMode?: string;
    disableNotification?: boolean;
    replyToMessageId?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    const url = `${this.baseUrl}/sendPhoto`;
    const body = this.composeFetchBody({
      chat_id: chatId,
      photo,
      caption,
      parse_mode: parseMode,
      disable_notification: disableNotification,
      reply_to_message_id: replyToMessageId,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });

    return response.json();
  }

  public async sendVideo({
    chatId,
    video,
    duration,
    width,
    height,
    thumb,
    caption,
    parseMode,
    supportsStreaming,
    disableNotification,
    replyToMessageId,
  }: {
    chatId: string;
    video: string;
    duration?: number;
    width?: number;
    height?: number;
    thumb?: string;
    caption?: string;
    parseMode?: string;
    supportsStreaming?: boolean;
    disableNotification?: boolean;
    replyToMessageId?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    const url = `${this.baseUrl}/sendVideo`;
    const body = this.composeFetchBody({
      chat_id: chatId,
      video,
      duration,
      width,
      height,
      thumb,
      caption,
      parse_mode: parseMode,
      supports_streaming: supportsStreaming,
      disable_notification: disableNotification,
      reply_to_message_id: replyToMessageId,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });

    return response.json();
  }

  public async sendAnimation({
    chatId,
    animation,
    duration,
    width,
    height,
    thumb,
    caption,
    parseMode,
    disableNotification,
    replyToMessageId,
  }: {
    chatId: string;
    animation: string;
    duration?: number;
    width?: number;
    height?: number;
    thumb?: string;
    caption?: string;
    parseMode?: string;
    disableNotification?: boolean;
    replyToMessageId?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    const url = `${this.baseUrl}/sendAnimation`;
    const body = this.composeFetchBody({
      chat_id: chatId,
      animation,
      duration,
      width,
      height,
      thumb,
      caption,
      parse_mode: parseMode,
      disable_notification: disableNotification,
      reply_to_message_id: replyToMessageId,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });

    return response.json();
  }
}
