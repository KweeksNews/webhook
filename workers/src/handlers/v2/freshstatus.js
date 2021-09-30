import moment from 'moment';

import CONFIG from '../../config/config';

class FreshstatusHandler {
  constructor({
    telegramBot,
  }) {
    this.telegramBot = telegramBot;
  }

  async handle(request) {
    try {
      const data = await request.json();

      if (await this.executeCommand(data)) {
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

  async executeCommand(data) {
    const chatId = JSON.parse(await KV.get('chat-id'));
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

  // eslint-disable-next-line class-methods-use-this
  formatDate(date) {
    return moment(date).format(CONFIG.dateFormat);
  }

  async sendIncidentOpenedLog(data) {
    const text = '<b>#INCIDENTOPENED</b>\n\n'
    + `<b>Name:</b> ${data.title}\n`
    + `<b>Description:</b> ${data.description}\n`
    + `<b>Start Time:</b> ${this.formatDate(data.start_time)}\n`
    + `<b>Affected Services:</b> ${data.affected_services}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${CONFIG.freshstatus.url}/incident/${data.id}`,
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

  async sendIncidentClosedLog(data) {
    const text = '<b>#INCIDENTCLOSED</b>\n\n'
    + `<b>Name:</b> ${data.title}\n`
    + `<b>Note:</b> ${data.message}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${CONFIG.freshstatus.url}/incident/${data.incident_id}`,
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

  async sendIncidentNoteCreatedLog(data) {
    const text = '<b>#INCIDENTNOTECREATED</b>\n\n'
    + `<b>Name:</b> ${data.title}\n`
    + `<b>Note:</b> ${data.message}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${CONFIG.freshstatus.url}/incident/${data.incident_id}`,
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

  async sendMaintenancePlannedLog(data) {
    const text = '<b>#MAINTENANCEPLANNED</b>\n\n'
    + `<b>Name:</b> ${data.title}\n`
    + `<b>Description:</b> ${data.description}\n`
    + `<b>Scheduled Start Time:</b> ${this.formatDate(data.scheduled_start_time)}\n`
    + `<b>Scheduled End Time:</b> ${this.formatDate(data.scheduled_end_time)}\n`
    + `<b>Affected Services:</b> ${data.affected_services}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${CONFIG.freshstatus.url}/incident/${data.id}`,
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

  async sendMaintenanceClosedLog(data) {
    const text = '<b>#MAINTENANCECLOSED</b>\n\n'
    + `<b>Name:</b> ${data.title}\n`
    + `<b>Note:</b> ${data.message}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${CONFIG.freshstatus.url}/incident/${data.incident_id}`,
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

  async sendMaintenanceNoteCreatedLog(data) {
    const text = '<b>#MAINTENANCENOTECREATED</b>\n\n'
    + `<b>Name:</b> ${data.title}\n`
    + `<b>Note:</b> ${data.message}`;
    const replyMarkup = JSON.stringify({
      inline_keyboard: [
        [
          {
            text: 'More Info',
            url: `${CONFIG.freshstatus.url}/incident/${data.incident_id}`,
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

export default FreshstatusHandler;
