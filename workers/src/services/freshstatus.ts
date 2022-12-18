import moment from 'moment';
import { Config } from '../config';
import { TelegramBotService } from './telegram-bot';

export class FreshstatusService {
  public constructor(
    private readonly env: Env,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendNotification(data: any) {
    const chatId = JSON.parse((await this.env.CONFIG.get('chat-id')) as string).server;

    switch (data.event_data?.event_type) {
      case 'INCIDENT_OPEN':
        await this.sendIncidentOpenedLog(data, chatId);
        return true;
      case 'INCIDENT_NOTE_CREATE':
        if (data.incident_status === 'Closed') {
          await this.sendIncidentClosedLog(data, chatId);
        } else {
          await this.sendIncidentNoteCreatedLog(data, chatId);
        }
        return true;
      case 'MAINTENANCE_PLANNED':
        await this.sendMaintenancePlannedLog(data, chatId);
        return true;
      case 'MAINTENANCE_NOTE_CREATE':
        if (data.incident_status === 'Closed') {
          await this.sendMaintenanceClosedLog(data, chatId);
        } else {
          await this.sendMaintenanceNoteCreatedLog(data, chatId);
        }
        return true;
      default:
        return false;
    }
  }

  private formatDate(date: string) {
    return moment(date).format(Config.dateFormat);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendIncidentOpenedLog(data: any, chatId: string) {
    const text =
      '<b>#INCIDENTOPENED</b>\n\n' +
      `<b>Name:</b> ${data.title}\n` +
      `<b>Description:</b> ${data.description}\n` +
      `<b>Start Time:</b> ${this.formatDate(data.start_time)}\n` +
      `<b>Affected Services:</b> ${data.affected_services}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.id}`,
          },
        ],
      ],
    });

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendIncidentClosedLog(data: any, chatId: string) {
    const text =
      '<b>#INCIDENTCLOSED</b>\n\n' +
      `<b>Name:</b> ${data.title}\n` +
      `<b>Note:</b> ${data.message}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.incident_id}`,
          },
        ],
      ],
    });

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendIncidentNoteCreatedLog(data: any, chatId: string) {
    const text =
      '<b>#INCIDENTNOTECREATED</b>\n\n' +
      `<b>Name:</b> ${data.title}\n` +
      `<b>Note:</b> ${data.message}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.incident_id}`,
          },
        ],
      ],
    });

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendMaintenancePlannedLog(data: any, chatId: string) {
    const text =
      '<b>#MAINTENANCEPLANNED</b>\n\n' +
      `<b>Name:</b> ${data.title}\n` +
      `<b>Description:</b> ${data.description}\n` +
      `<b>Scheduled Start Time:</b> ${this.formatDate(data.scheduled_start_time)}\n` +
      `<b>Scheduled End Time:</b> ${this.formatDate(data.scheduled_end_time)}\n` +
      `<b>Affected Services:</b> ${data.affected_services}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.id}`,
          },
        ],
      ],
    });

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendMaintenanceClosedLog(data: any, chatId: string) {
    const text =
      '<b>#MAINTENANCECLOSED</b>\n\n' +
      `<b>Name:</b> ${data.title}\n` +
      `<b>Note:</b> ${data.message}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.incident_id}`,
          },
        ],
      ],
    });

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async sendMaintenanceNoteCreatedLog(data: any, chatId: string) {
    const text =
      '<b>#MAINTENANCENOTECREATED</b>\n\n' +
      `<b>Name:</b> ${data.title}\n` +
      `<b>Note:</b> ${data.message}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.incident_id}`,
          },
        ],
      ],
    });

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }
}
