import moment from 'moment';
import { inject, singleton } from 'tsyringe';
import { Config } from '../config';
import {
  IncidentClosedNotificationData,
  IncidentOpenNotificationData,
  MaintenanceClosedNotificationData,
  MaintenanceOpenNotificationData,
  MaintenancePlannedNotificationData,
  SendFreshstatusNotificationData,
  SendFreshstatusNotificationResBody,
} from '../types';
import { TelegramBotService } from './telegram-bot';

@singleton()
export class FreshstatusService {
  public constructor(
    @inject('Env') private readonly env: Env,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  public async sendNotification(
    data: SendFreshstatusNotificationData,
  ): Promise<SendFreshstatusNotificationResBody> {
    const chatId = JSON.parse((await this.env.CONFIG.get('chat_id')) as string) as ConfigChatId;

    switch (data.event_data.event_type) {
      case 'INCIDENT_OPEN':
        return await this.sendIncidentOpenedLog(
          data as IncidentOpenNotificationData,
          chatId.server,
        );
      case 'INCIDENT_CLOSED':
        return await this.sendIncidentClosedLog(
          data as IncidentClosedNotificationData,
          chatId.server,
        );
      case 'MAINTENANCE_PLANNED':
        return await this.sendMaintenancePlannedLog(
          data as MaintenancePlannedNotificationData,
          chatId.server,
        );
      case 'MAINTENANCE_OPEN':
        return await this.sendMaintenanceOpenLog(
          data as MaintenanceOpenNotificationData,
          chatId.server,
        );
      case 'MAINTENANCE_CLOSED':
        return await this.sendMaintenanceClosedLog(
          data as MaintenanceClosedNotificationData,
          chatId.server,
        );
      default:
        return {
          success: false,
          message: 'Invalid event type',
        };
    }
  }

  private formatDate(date: string): string {
    return moment(date).format(Config.dateFormat);
  }

  private async sendIncidentOpenedLog(
    data: IncidentOpenNotificationData,
    chatId: number,
  ): Promise<SendFreshstatusNotificationResBody> {
    const text =
      '<b>#INCIDENTOPENED</b>\n\n' +
      `<b>ID:</b> ${data.id}\n` +
      `<b>Title:</b> ${data.title}\n` +
      `<b>Description:</b> ${data.description}\n` +
      `<b>Start Time:</b> ${this.formatDate(data.start_time)}\n` +
      `<b>Affected Services:</b> ${data.affected_services}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.id}`,
          },
        ],
      ],
    };

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

  private async sendIncidentClosedLog(
    data: IncidentClosedNotificationData,
    chatId: number,
  ): Promise<SendFreshstatusNotificationResBody> {
    const text =
      '<b>#INCIDENTCLOSED</b>\n\n' +
      `<b>ID:</b> ${data.id}\n` +
      `<b>Title</b> ${data.title}\n` +
      `<b>End Time:</b> ${this.formatDate(data.end_time)}\n` +
      `<b>Affected Services:</b> ${data.affected_services}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.id}`,
          },
        ],
      ],
    };

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

  private async sendMaintenancePlannedLog(
    data: MaintenancePlannedNotificationData,
    chatId: number,
  ): Promise<SendFreshstatusNotificationResBody> {
    const text =
      '<b>#MAINTENANCEPLANNED</b>\n\n' +
      `<b>ID:</b> ${data.id}\n` +
      `<b>Title</b> ${data.title}\n` +
      `<b>Description:</b> ${data.description}\n` +
      `<b>Scheduled Start Time:</b> ${this.formatDate(data.scheduled_start_time)}\n` +
      `<b>Scheduled End Time:</b> ${this.formatDate(data.scheduled_end_time)}\n` +
      `<b>Affected Services:</b> ${data.affected_services}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.id}`,
          },
        ],
      ],
    };

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

  private async sendMaintenanceOpenLog(
    data: MaintenanceOpenNotificationData,
    chatId: number,
  ): Promise<SendFreshstatusNotificationResBody> {
    const text =
      '<b>#MAINTENANCESTARTED</b>\n\n' +
      `<b>ID:</b> ${data.id}\n` +
      `<b>Title</b> ${data.title}\n` +
      `<b>Start Time:</b> ${this.formatDate(data.start_time)}\n` +
      `<b>Affected Services:</b> ${data.affected_services}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.id}`,
          },
        ],
      ],
    };

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

  private async sendMaintenanceClosedLog(
    data: MaintenanceClosedNotificationData,
    chatId: number,
  ): Promise<SendFreshstatusNotificationResBody> {
    const text =
      '<b>#MAINTENANCECLOSED</b>\n\n' +
      `<b>ID:</b> ${data.id}\n` +
      `<b>Title</b> ${data.title}\n` +
      `<b>End Time:</b> ${this.formatDate(data.end_time)}\n` +
      `<b>Affected Services:</b> ${data.affected_services}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.id}`,
          },
        ],
      ],
    };

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
}
