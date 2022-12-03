import moment from 'moment';
import { Config } from '../config';
import { TelegramBot } from '../services';

export class FreshstatusHandler {
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
    this.chatId = chatId.server;

    switch (data.event_data?.event_type) {
      case 'INCIDENT_OPEN':
        await this.sendIncidentOpenedLog(data);
        return true;
      case 'INCIDENT_NOTE_CREATE':
        if (data.incident_status == 'Closed') {
          await this.sendIncidentClosedLog(data);
        } else {
          await this.sendIncidentNoteCreatedLog(data);
        }
        return true;
      case 'MAINTENANCE_PLANNED':
        await this.sendMaintenancePlannedLog(data);
        return true;
      case 'MAINTENANCE_NOTE_CREATE':
        if (data.incident_status == 'Closed') {
          await this.sendMaintenanceClosedLog(data);
        } else {
          await this.sendMaintenanceNoteCreatedLog(data);
        }
        return true;
      default:
        return false;
    }
  }

  public formatDate(date: string) {
    return moment(date).format(Config.dateFormat);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendIncidentOpenedLog(data: any) {
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

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendIncidentClosedLog(data: any) {
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

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendIncidentNoteCreatedLog(data: any) {
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

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendMaintenancePlannedLog(data: any) {
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

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendMaintenanceClosedLog(data: any) {
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

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async sendMaintenanceNoteCreatedLog(data: any) {
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

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyMarkup,
    });
  }
}
