import CONFIG from '../config/config';

class WordPressHandler {
  constructor({
    telegramBot,
  }) {
    this.telegramBot = telegramBot;
  }

  async handle(request) {
    try {
      const data = await request.json();
      const { headers } = request;

      if (await this.executeCommand(headers, data)) {
        return new Response(JSON.stringify({
          success: true,
          data: 'Request success',
        }), {
          status: 200,
          headers: CONFIG.headers,
        });
      }

      return new Response(JSON.stringify({
        success: false,
        data: 'Invalid request',
      }), {
        status: 200,
        headers: CONFIG.headers,
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        data: error.message,
      }), {
        status: 500,
        headers: CONFIG.headers,
      });
    }
  }

  async executeCommand(headers, data) {
    const userAgent = JSON.parse(await KV.get('user-agent'));
    const chatId = JSON.parse(await KV.get('chat-id'));

    if (headers.get('user-agent') == userAgent.kweeksnews) {
      switch (data.channel) {
        case 'wordpress':
          this.chatId = chatId.wordpress;
          await this.sendWordPressLog(data);
          return true;
        case 'content':
          this.chatId = chatId.content;
          await this.sendContentLog(data);
          return true;
        case 'user':
          this.chatId = chatId.user;
          await this.sendUserLog(data);
          return true;
        default:
          return false;
      }
    }

    return false;
  }

  async sendWordPressLog(data) {
    let text = `<b>${data.event}</b>\n\n`;

    if (data.name) text += `<b>Name:</b> ${data.name}\n`;
    if (data.dev) text += `<b>Dev:</b> ${data.dev}\n`;
    if (data.from) text += `<b>From:</b> ${data.from}\n`;
    if (data.to) text += `<b>To:</b> ${data.to}\n`;

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
    });
  }

  async sendContentLog(data) {
    let text = `<b>${data.event}</b>\n\n`;
    let replyMarkup = '';

    if (data.title) text += `<b>Title:</b> ${data.title}\n`;
    if (data.post) text += `<b>Post:</b> ${data.post}\n`;
    if (data.category) text += `<b>Category:</b> ${data.category}\n`;
    if (data.tag) text += `<b>Tag:</b> ${data.tag}\n`;
    if (data.type) text += `<b>Type:</b> ${data.type}\n`;
    if (data.author) text += `<b>Author:</b> ${data.author}\n`;
    if (data.from) text += `<b>From:</b> ${data.from}\n`;
    if (data.email) text += `<b>Email:</b> ${data.email}\n`;
    if (data.comment) text += `<b>Comment:</b> ${data.comment}\n`;
    if (data.editedby) text += `<b>Edited By:</b> ${data.editedby}\n`;
    if (data.deletedby) text += `<b>Deleted By:</b> ${data.deletedby}\n`;
    if (data.via) text += `<b>Via:</b> ${data.via}\n`;
    if (data.status) text += `<b>Status:</b> ${data.status}\n`;
    if (data.useragent) text += `<b>User Agent:</b> ${data.useragent}\n`;
    if (data.ipaddress) text += `<b>IP Address:</b> ${data.ipaddress}\n`;
    if (data.url) text += `<b>URL:</b> <a href="${data.url}">click here</a>\n`;
    if (data.homeurl && data.id) {
      replyMarkup = JSON.stringify({
        inline_keyboard: [
          [
            {
              text: 'Review',
              url: `${data.homeurl}/wp-admin/post.php?post=${data.id}&action=edit`,
            },
          ],
        ],
      });
    }

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  async sendUserLog(data) {
    let text = `<b>${data.event}</b>\n\n`;

    if (data.nicename && data.username) text += `<b>User:</b> ${data.nicename} (${data.username})\n`;
    if (!data.nicename && data.username) text += `<b>User:</b> ${data.username}\n`;
    if (data.email) text += `<b>Email:</b> ${data.email}\n`;
    if (data.role) text += `<b>Role:</b> ${data.role}\n`;
    if (data.oldrole) text += `<b>Old Role:</b> ${data.oldrole}\n`;
    if (data.newrole) text += `<b>New Role:</b> ${data.newrole}\n`;
    if (data.ipaddress) text += `<b>IP Address:</b> ${data.ipaddress}\n`;

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
    });
  }
}

export default WordPressHandler;
