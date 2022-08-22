import { Config } from '../../config';
import { TelegramBot } from '../../services';

export class WordPressHandler {
  private chatId!: string;

  public constructor(private readonly telegramBot: TelegramBot) {}

  public async handle(request: Request, env: Env) {
    try {
      const data = await request.json();

      if (await this.executeCommand(data, env)) {
        return new Response(
          JSON.stringify({
            success: true,
            data: 'Request success',
          }),
          {
            status: 200,
            headers: Config.headers,
          },
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          data: 'Invalid request',
        }),
        {
          status: 200,
          headers: Config.headers,
        },
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          data: (error as Error).message,
        }),
        {
          status: 500,
          headers: Config.headers,
        },
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async executeCommand(data: any, env: Env) {
    const chatId = JSON.parse((await env.CONFIG.get('chat-id')) as string);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendWordPressLog(data: any) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendContentLog(data: any) {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendUserLog(data: any) {
    let text = `<b>${data.event}</b>\n\n`;

    if (data.nicename && data.username)
      text += `<b>User:</b> ${data.nicename} (${data.username})\n`;
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
