class TelegramBot {
  constructor({
    token,
    username,
  }) {
    this.token = token;
    this.username = username;
    this.url = `https://api.telegram.org/bot${token}`;
    this.headers = new Headers({
      'content-type': 'application/json',
    });
  }

  // eslint-disable-next-line class-methods-use-this
  composeFetchBody(
    options = {},
  ) {
    Object.keys(options).forEach((key) => {
      if (!options[key]) delete options[key];
    });

    return JSON.stringify(options);
  }

  async sendMessage({
    chatId,
    text,
    parseMode = '',
    disableWebPagePreview = false,
    disableNotification = false,
    replyToMessageId = 0,
    replyMarkup = '',
  }) {
    const url = `${this.url}/sendMessage`;
    const body = this.composeFetchBody({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: disableWebPagePreview,
      disable_notification: disableNotification,
      reply_to_message_id: replyToMessageId,
      reply_markup: replyMarkup,
    });

    await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });
  }

  async forwardMessage({
    chatId,
    fromChatId,
    disableNotification = false,
    messageId,
  }) {
    const url = `${this.url}/forwardMessage`;
    const body = this.composeFetchBody({
      chat_id: chatId,
      from_chat_id: fromChatId,
      disable_notification: disableNotification,
      message_id: messageId,
    });

    await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });
  }

  async sendPhoto({
    chatId,
    photo,
    caption = '',
    parseMode = '',
    disableNotification = false,
    replyToMessageId = 0,
  }) {
    const url = `${this.url}/sendPhoto`;
    const body = this.composeFetchBody({
      chat_id: chatId,
      photo,
      caption,
      parse_mode: parseMode,
      disable_notification: disableNotification,
      reply_to_message_id: replyToMessageId,
    });

    await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });
  }

  async sendVideo({
    chatId,
    video,
    duration = 0,
    width = 0,
    height = 0,
    thumb = '',
    caption = '',
    parseMode = '',
    supportsStreaming = false,
    disableNotification = false,
    replyToMessageId = 0,
  }) {
    const url = `${this.url}/sendVideo`;
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

    await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });
  }

  async sendAnimation({
    chatId,
    animation,
    duration = 0,
    width = 0,
    height = 0,
    thumb = '',
    caption = '',
    parseMode = '',
    disableNotification = false,
    replyToMessageId = 0,
  }) {
    const url = `${this.url}/sendAnimation`;
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

    await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body,
    });
  }
}

export default TelegramBot;
