import CONFIG from '../../config/config';
import STRING from '../../config/string';

class TelegramHandler {
  constructor({
    telegramBot,
    cloudflareApi,
  }) {
    this.telegramBot = telegramBot;
    this.cloudflareApi = cloudflareApi;
    this.commands = {
      start: (args) => this.start(args),
      help: (args) => this.help(args),
      maintenance: (args) => this.maintenance(args),
      underattack: (args) => this.underAttack(args),
    };
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
    const allowedUser = JSON.parse(await KV.get('webmaster-id'));

    if (data.message?.text?.startsWith('/') && allowedUser.includes(data.message.from.id)) {
      const textArray = data.message.text.substring(1).split(' ');
      let command = textArray.shift();

      if (command.endsWith(`${this.telegramBot.username}`)) {
        command = command.substring(0, command.length - this.telegramBot.username.length);
      }

      if (Object.keys(this.commands).includes(command)) {
        this.chatId = data.message.chat.id;
        this.chatType = data.message.chat.type;
        this.messageId = data.message.message_id;

        await this.commands[command](textArray);

        return true;
      }
    }

    return false;
  }

  async start(args) {
    let text = '';

    if (args == 'help' && this.chatType == 'private') {
      await this.help('');
    } else {
      text = STRING.start;
    }

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: this.messageId,
    });
  }

  async help(args) {
    let text = '';
    let replyMarkup = '';

    if (this.chatType == 'private') {
      if (args && args != '') {
        text = STRING.helpNone(args);
      } else {
        text = STRING.help;
      }
    } else {
      text = STRING.helpNonPrivate;
      replyMarkup = JSON.stringify({
        inline_keyboard: [
          [
            {
              text: 'Click here',
              url: 'https://t.me/kweeksbot?start=help',
            },
          ],
        ],
      });
    }

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: this.messageId,
      replyMarkup,
    });
  }

  async maintenance(args) {
    let text = '';

    if (args == 'on') {
      const check = await KV.get('route-id');

      if (!check) {
        text = STRING.maintenanceAlreadySet('on');
      } else {
        const data = await this.cloudflareApi.createWorkerRoute({
          pattern: '*kweeksnews.com/*',
          script: 'maintenance',
        });

        if (data.success) {
          await KV.put('route-id', data.result.id);
          text = STRING.maintenanceOn;
        } else {
          text = STRING.maintenanceSetFailed;
        }
      }
    } else if (args == 'off') {
      const check = await KV.get('route-id');

      if (check) {
        const data = await this.cloudflareApi.deleteWorkerRoute({
          routeId: check,
        });

        if (data.success) {
          await KV.delete('route-id');
          text = STRING.maintenanceOff;
        } else {
          text = STRING.maintenanceSetFailed;
        }
      } else {
        text = STRING.maintenanceAlreadySet('off');
      }
    } else if (args && args != '') {
      text = STRING.unknownValue;
    } else {
      const check = await KV.get('route-id');

      if (check) {
        text = STRING.maintenance('on');
      } else {
        text = STRING.maintenance('off');
      }
    }

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: this.messageId,
    });
  }

  async underAttack(args) {
    let text = '';

    if (args == 'on') {
      const check = await this.cloudflareApi.getSecurityLevel();

      if (check.result.value != 'under_attack') {
        const data = await this.cloudflareApi.changeSecurityLevel({
          value: 'under_attack',
        });

        if (data.success) {
          text = STRING.underattackOn;
        } else {
          text = STRING.underattackSetFailed;
        }
      } else {
        text = STRING.underattackAlreadySet('on');
      }
    } else if (args == 'off') {
      const check = await this.cloudflareApi.getSecurityLevel();

      if (check.result.value == 'under_attack') {
        const data = await this.cloudflareApi.changeSecurityLevel({
          value: 'medium',
        });

        if (data.success) {
          text = STRING.underattackOff;
        } else {
          text = STRING.underattackSetFailed;
        }
      } else {
        text = STRING.underattackAlreadySet('off');
      }
    } else if (args && args != '') {
      text = STRING.unknownValue;
    } else {
      const check = await this.cloudflareApi.getSecurityLevel();

      if (check.result.value == 'under_attack') {
        text = STRING.underattack('on');
      } else {
        text = STRING.underattack('off');
      }
    }

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: this.messageId,
    });
  }
}

export default TelegramHandler;