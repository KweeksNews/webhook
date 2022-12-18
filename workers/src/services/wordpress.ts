import { TelegramBotService } from './telegram-bot';
import { SendWordPressNotificationData, SendWordPressNotificationResBody } from '../types';

export class WordPressService {
  public constructor(
    private readonly env: Env,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  public async sendNotification(
    data: SendWordPressNotificationData,
  ): Promise<SendWordPressNotificationResBody> {
    const chatId = JSON.parse((await this.env.CONFIG.get('chat_id')) as string) as ConfigChatId;

    switch (data.channel) {
      case 'wordpress':
        return await this.sendWordPressLog(data, chatId.wordpress);
      case 'content':
        return await this.sendContentLog(data, chatId.content);
      case 'user':
        return await this.sendUserLog(data, chatId.user);
      default:
        return {
          success: false,
          message: 'Invalid notification channel',
        };
    }
  }

  private async sendWordPressLog(
    data: SendWordPressNotificationData,
    chatId: number,
  ): Promise<SendWordPressNotificationResBody> {
    let text = `<b>${data.event}</b>\n\n`;

    if (data.name) text += `<b>Name:</b> ${data.name}\n`;
    if (data.dev) text += `<b>Dev:</b> ${data.dev}\n`;
    if (data.from) text += `<b>From:</b> ${data.from}\n`;
    if (data.to) text += `<b>To:</b> ${data.to}\n`;

    const response = await this.telegramBotService.sendMessage({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Notification sent',
        data: {
          telegram: response.result,
        },
      };
    } else {
      return {
        success: false,
        message: response.description,
      };
    }
  }

  private async sendContentLog(
    data: SendWordPressNotificationData,
    chatId: number,
  ): Promise<SendWordPressNotificationResBody> {
    let text = `<b>${data.event}</b>\n\n`;
    let replyMarkup;

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
      replyMarkup = {
        inline_keyboard: [
          [
            {
              text: 'Review',
              url: `${data.homeurl}/wp-admin/post.php?post=${data.id}&action=edit`,
            },
          ],
        ],
      };
    }

    const response = await this.telegramBotService.sendMessage({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup,
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Notification sent',
        data: {
          telegram: response.result,
        },
      };
    } else {
      return {
        success: false,
        message: response.description,
      };
    }
  }

  private async sendUserLog(
    data: SendWordPressNotificationData,
    chatId: number,
  ): Promise<SendWordPressNotificationResBody> {
    let text = `<b>${data.event}</b>\n\n`;

    if (data.nicename && data.username)
      text += `<b>User:</b> ${data.nicename} (${data.username})\n`;
    if (!data.nicename && data.username) text += `<b>User:</b> ${data.username}\n`;
    if (data.email) text += `<b>Email:</b> ${data.email}\n`;
    if (data.role) text += `<b>Role:</b> ${data.role}\n`;
    if (data.oldrole) text += `<b>Old Role:</b> ${data.oldrole}\n`;
    if (data.newrole) text += `<b>New Role:</b> ${data.newrole}\n`;
    if (data.ipaddress) text += `<b>IP Address:</b> ${data.ipaddress}\n`;

    const response = await this.telegramBotService.sendMessage({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Notification sent',
        data: {
          telegram: response.result,
        },
      };
    } else {
      return {
        success: false,
        message: response.description,
      };
    }
  }
}
