import moment from 'moment';
import { inject, singleton } from 'tsyringe';
import { Config } from '../config';
import {
  IncidentNoteCreatedNotificationData,
  IncidentOpenNotificationData,
  MaintenanceNoteCreatedNotificationData,
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
      case 'INCIDENT_NOTE_CREATE':
        if ((data as IncidentNoteCreatedNotificationData).incident_status === 'Closed') {
          return await this.sendIncidentClosedLog(
            data as IncidentNoteCreatedNotificationData,
            chatId.server,
          );
        } else {
          return await this.sendIncidentNoteCreatedLog(
            data as IncidentNoteCreatedNotificationData,
            chatId.server,
          );
        }
      case 'MAINTENANCE_PLANNED':
        return await this.sendMaintenancePlannedLog(
          data as MaintenancePlannedNotificationData,
          chatId.server,
        );
      case 'MAINTENANCE_NOTE_CREATE':
        if ((data as MaintenanceNoteCreatedNotificationData).incident_status === 'Closed') {
          return await this.sendMaintenanceClosedLog(
            data as MaintenanceNoteCreatedNotificationData,
            chatId.server,
          );
        } else {
          return await this.sendMaintenanceNoteCreatedLog(
            data as MaintenanceNoteCreatedNotificationData,
            chatId.server,
          );
        }
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
      `<b>Title</b> ${data.title}\n` +
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
    data: IncidentNoteCreatedNotificationData,
    chatId: number,
  ): Promise<SendFreshstatusNotificationResBody> {
    const text =
      '<b>#INCIDENTCLOSED</b>\n\n' +
      `<b>Title</b> ${data.title}\n` +
      `<b>Note:</b> ${data.message}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.incident_id}`,
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

  private async sendIncidentNoteCreatedLog(
    data: IncidentNoteCreatedNotificationData,
    chatId: number,
  ): Promise<SendFreshstatusNotificationResBody> {
    const text =
      '<b>#INCIDENTNOTECREATED</b>\n\n' +
      `<b>Title</b> ${data.title}\n` +
      `<b>Note:</b> ${data.message}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.incident_id}`,
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

  private async sendMaintenanceClosedLog(
    data: MaintenanceNoteCreatedNotificationData,
    chatId: number,
  ): Promise<SendFreshstatusNotificationResBody> {
    const text =
      '<b>#MAINTENANCECLOSED</b>\n\n' +
      `<b>Title</b> ${data.title}\n` +
      `<b>Note:</b> ${data.message}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.incident_id}`,
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

  private async sendMaintenanceNoteCreatedLog(
    data: MaintenanceNoteCreatedNotificationData,
    chatId: number,
  ): Promise<SendFreshstatusNotificationResBody> {
    const text =
      '<b>#MAINTENANCENOTECREATED</b>\n\n' +
      `<b>Title</b> ${data.title}\n` +
      `<b>Note:</b> ${data.message}`;
    const replyMarkup = {
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${Config.freshstatus.url}/incident/${data.incident_id}`,
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
