class TelegramBot {
  constructor({
    token,
    username,
  }) {
    this.token = token;
    this.username = username;
    this.url = `https://api.telegram.org/bot${token}`;
  }

  // eslint-disable-next-line class-methods-use-this
  addUrlOptions(
    urlString,
    options = {},
  ) {
    let url = urlString;

    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(options)) {
      if (options[key]) url += `&${key}=${options[key]}`;
    }

    return url;
  }

  async sendMessage({
    chatId,
    text,
    parseMode = '',
    replyToMessageId = 0,
    replyMarkup = '',
    disableWebPagePreview = false,
    disableNotification = false,
  }) {
    let url = `${this.url}/sendMessage?chat_id=${chatId}&text=${text}`;

    url = this.addUrlOptions(url, {
      parse_mode: parseMode,
      reply_to_message_id: replyToMessageId,
      reply_markup: replyMarkup,
      disable_web_page_preview: disableWebPagePreview,
      disable_notification: disableNotification,
    });

    await fetch(url);
  }

  async forwardMessage({
    chatId,
    fromChatId,
    disableNotification = false,
    messageId,
  }) {
    let url = `${this.url}/sendMessage?chat_id=${chatId}&from_chat_id=${fromChatId}&message_id=${messageId}`;

    url = this.addUrlOptions(url, {
      disable_notification: disableNotification,
    });

    await fetch(url);
  }

  async sendPhoto({
    chatId,
    photo,
    caption = '',
    parseMode = '',
    disableNotification = false,
    replyToMessageId = 0,
  }) {
    let url = `${this.url}/sendPhoto?chat_id=${chatId}&photo=${photo}`;

    url = this.addUrlOptions(url, {
      caption,
      parse_mode: parseMode,
      disable_notification: disableNotification,
      reply_to_message_id: replyToMessageId,
    });

    await fetch(url);
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
    let url = `${this.url}/sendVideo?chat_id=${chatId}&video=${video}`;

    url = this.addUrlOptions(url, {
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

    await fetch(url);
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
    let url = `${this.url}/sendAnimation?chat_id=${chatId}&animation=${animation}`;

    url = this.addUrlOptions(url, {
      duration,
      width,
      height,
      thumb,
      caption,
      parse_mode: parseMode,
      disable_notification: disableNotification,
      reply_to_message_id: replyToMessageId,
    });

    await fetch(url);
  }
}

export default TelegramBot;
