import { TelegramBotService } from './telegram-bot';

export class WordPressService {
  public constructor(
    private readonly env: Env,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendNotification(data: any) {
    const chatId = JSON.parse((await this.env.CONFIG.get('chat-id')) as string);

    switch (data.channel) {
      case 'wordpress':
        await this.sendWordPressLog(data, chatId.wordpress);
        return true;
      case 'content':
        await this.sendContentLog(data, chatId.content);
        return true;
      case 'user':
        await this.sendUserLog(data, chatId.user);
        return true;
      default:
        return false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendWordPressLog(data: any, chatId: string) {
    let text = `<b>${data.event}</b>\n\n`;

    if (data.name) text += `<b>Name:</b> ${data.name}\n`;
    if (data.dev) text += `<b>Dev:</b> ${data.dev}\n`;
    if (data.from) text += `<b>From:</b> ${data.from}\n`;
    if (data.to) text += `<b>To:</b> ${data.to}\n`;

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendContentLog(data: any, chatId: string) {
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

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendUserLog(data: any, chatId: string) {
    let text = `<b>${data.event}</b>\n\n`;

    if (data.nicename && data.username)
      text += `<b>User:</b> ${data.nicename} (${data.username})\n`;
    if (!data.nicename && data.username) text += `<b>User:</b> ${data.username}\n`;
    if (data.email) text += `<b>Email:</b> ${data.email}\n`;
    if (data.role) text += `<b>Role:</b> ${data.role}\n`;
    if (data.oldrole) text += `<b>Old Role:</b> ${data.oldrole}\n`;
    if (data.newrole) text += `<b>New Role:</b> ${data.newrole}\n`;
    if (data.ipaddress) text += `<b>IP Address:</b> ${data.ipaddress}\n`;

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
    });
  }
}
