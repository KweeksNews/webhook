import { String } from '../config';
import { CloudflareApiService } from './cloudflare-api';
import { TelegramBotService } from './telegram-bot';

export class TelegramService {
  private readonly commands: {
    [key: string]: (
      args: string,
      chatId: number,
      chatType: string,
      messageId: number,
    ) => Promise<void>;
  } = {
    start: async (args: string, chatId: number, chatType: string, messageId: number) =>
      await this.start(args, chatId, chatType, messageId),
    help: async (args: string, chatId: number, chatType: string, messageId: number) =>
      await this.help(args, chatId, chatType, messageId),
    maintenance: async (args: string, chatId: number, chatType: string, messageId: number) =>
      await this.maintenance(args, chatId, chatType, messageId),
    underattack: async (args: string, chatId: number, chatType: string, messageId: number) =>
      await this.underAttack(args, chatId, chatType, messageId),
  };

  public constructor(
    private readonly env: Env,
    private readonly cloudflareApiService: CloudflareApiService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async executeCommand(data: any) {
    const allowedUser = JSON.parse((await this.env.CONFIG.get('webmaster-id')) as string);

    if (data.message?.text?.startsWith('/') && allowedUser.includes(data.message.from.id)) {
      const textArray = data.message.text.substring(1).split(' ');
      let command = textArray.shift();

      if (command.endsWith(`${this.telegramBotService.username}`)) {
        command = command.substring(0, command.length - this.telegramBotService.username.length);
      }

      if (Object.keys(this.commands).includes(command)) {
        await this.commands[command](
          textArray,
          data.message.chat.id,
          data.message.chat.type,
          data.message.message_id,
        );

        return true;
      }
    }

    return false;
  }

  private async start(args: string, chatId: number, chatType: string, messageId: number) {
    let text = '';

    if (args === 'help' && chatType === 'private') {
      return await this.help('', chatId, chatType, messageId);
    } else {
      text = String.start;
    }

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: messageId,
    });
  }

  private async help(args: string, chatId: number, chatType: string, messageId: number) {
    let text = '';
    let replyMarkup = '';

    if (chatType === 'private') {
      if (args && args != '') {
        text = String.help.none(args);
      } else {
        text = String.help.self;
      }
    } else {
      text = String.help.nonPrivate;
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

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: messageId,
      replyMarkup,
    });
  }

  private async maintenance(args: string, chatId: number, _: string, messageId: number) {
    let text = '';

    if (args === 'on') {
      const check = await this.env.CONFIG.get('route-id');

      if (!check) {
        const data = await this.cloudflareApiService.createWorkerRoute({
          pattern: '*kweeksnews.com/*',
          script: 'maintenance',
        });

        if (data.success) {
          await this.env.CONFIG.put('route-id', data.result.id);
          text = String.maintenance.on;
        } else {
          text = String.maintenance.setFailed;
        }
      } else {
        text = String.maintenance.alreadySet('on');
      }
    } else if (args === 'off') {
      const check = await this.env.CONFIG.get('route-id');

      if (check) {
        const data = await this.cloudflareApiService.deleteWorkerRoute({
          id: check,
        });

        if (data.success) {
          await this.env.CONFIG.delete('route-id');
          text = String.maintenance.off;
        } else {
          text = String.maintenance.setFailed;
        }
      } else {
        text = String.maintenance.alreadySet('off');
      }
    } else if (args && args != '') {
      text = String.unknownValue;
    } else {
      const check = await this.env.CONFIG.get('route-id');

      if (check) {
        text = String.maintenance.self('on');
      } else {
        text = String.maintenance.self('off');
      }
    }

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: messageId,
    });
  }

  private async underAttack(args: string, chatId: number, _: string, messageId: number) {
    let text = '';

    if (args === 'on') {
      const check = await this.cloudflareApiService.getSecurityLevel();

      if (check.result.value != 'under_attack') {
        const data = await this.cloudflareApiService.changeSecurityLevel({
          value: 'under_attack',
        });

        if (data.success) {
          text = String.underattack.on;
        } else {
          text = String.underattack.setFailed;
        }
      } else {
        text = String.underattack.alreadySet('on');
      }
    } else if (args === 'off') {
      const check = await this.cloudflareApiService.getSecurityLevel();

      if (check.result.value === 'under_attack') {
        const data = await this.cloudflareApiService.changeSecurityLevel({
          value: 'medium',
        });

        if (data.success) {
          text = String.underattack.off;
        } else {
          text = String.underattack.setFailed;
        }
      } else {
        text = String.underattack.alreadySet('off');
      }
    } else if (args && args != '') {
      text = String.unknownValue;
    } else {
      const check = await this.cloudflareApiService.getSecurityLevel();

      if (check.result.value === 'under_attack') {
        text = String.underattack.self('on');
      } else {
        text = String.underattack.self('off');
      }
    }

    await this.telegramBotService.sendMessage({
      chatId: chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: messageId,
    });
  }
}
