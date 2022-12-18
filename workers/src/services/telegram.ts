import { String } from '../config';
import {
  CommandList,
  ExecuteCommandData,
  ExecuteCommandParams,
  ExecuteCommandResBody,
} from '../types';
import { CloudflareApiService } from './cloudflare-api';
import { TelegramBotService } from './telegram-bot';

export class TelegramService {
  private readonly commands: CommandList = {
    start: async (params) => await this.start(params),
    help: async (params) => await this.help(params),
    maintenance: async (params) => await this.maintenance(params),
    underattack: async (params) => await this.underAttack(params),
  };

  public constructor(
    private readonly env: Env,
    private readonly cloudflareApiService: CloudflareApiService,
    private readonly telegramBotService: TelegramBotService,
  ) {}

  public async executeCommand(data: ExecuteCommandData): Promise<ExecuteCommandResBody> {
    const allowedUser = JSON.parse(
      (await this.env.CONFIG.get('webmaster_id')) as string,
    ) as ConfigWebmasterId;

    if (
      data.message &&
      data.message.text &&
      data.message.text.startsWith('/') &&
      allowedUser.includes(data.message.from?.id as number)
    ) {
      const textArray = data.message.text.substring(1).match(/[^ ]+/g);
      let command = textArray?.shift();

      if (command?.endsWith(`${this.telegramBotService.username}`)) {
        command = command.substring(0, command.length - this.telegramBotService.username.length);
      }

      if (Object.keys(this.commands).includes(command as string)) {
        return await this.commands[command as string]({
          args: textArray || [],
          chatId: data.message.chat.id,
          chatType: data.message.chat.type,
          messageId: data.message.message_id,
        });
      }
    }

    return {
      success: false,
      message: 'Command not found',
    };
  }

  private async start({
    args,
    chatId,
    chatType,
    messageId,
  }: ExecuteCommandParams): Promise<ExecuteCommandResBody> {
    let text;

    if (args[0] === 'help' && chatType === 'private') {
      return await this.help({
        args: [],
        chatId,
        chatType,
        messageId,
      });
    } else {
      text = String.start;
    }

    const response = await this.telegramBotService.sendMessage({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_to_message_id: messageId,
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Command executed',
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

  private async help({
    args,
    chatId,
    chatType,
    messageId,
  }: ExecuteCommandParams): Promise<ExecuteCommandResBody> {
    let text;
    let replyMarkup;

    if (chatType === 'private') {
      if (args) {
        text = String.help.none(args.join(' '));
      } else {
        text = String.help.self;
      }
    } else {
      text = String.help.nonPrivate;
      replyMarkup = {
        inline_keyboard: [
          [
            {
              text: 'Click here',
              url: 'https://t.me/kweeksbot?start=help',
            },
          ],
        ],
      };
    }

    const response = await this.telegramBotService.sendMessage({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_to_message_id: messageId,
      reply_markup: replyMarkup,
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Command executed',
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

  private async maintenance({
    args,
    chatId,
    messageId,
  }: ExecuteCommandParams): Promise<ExecuteCommandResBody> {
    let text;

    if (args[0] === 'on') {
      const check = (await this.env.CONFIG.get('route_id')) as ConfigRouteId;

      if (!check) {
        const data = await this.cloudflareApiService.createWorkerRoute({
          pattern: '*kweeksnews.com/*',
          script: 'maintenance',
        });

        if (data.success) {
          await this.env.CONFIG.put('route_id', data.result.id);
          text = String.maintenance.on;
        } else {
          text = String.maintenance.setFailed;
        }
      } else {
        text = String.maintenance.alreadySet('on');
      }
    } else if (args[0] === 'off') {
      const check = (await this.env.CONFIG.get('route_id')) as ConfigRouteId;

      if (check) {
        const data = await this.cloudflareApiService.deleteWorkerRoute({
          id: check,
        });

        if (data.success) {
          await this.env.CONFIG.delete('route_id');
          text = String.maintenance.off;
        } else {
          text = String.maintenance.setFailed;
        }
      } else {
        text = String.maintenance.alreadySet('off');
      }
    } else if (args) {
      text = String.unknownValue;
    } else {
      const check = (await this.env.CONFIG.get('route_id')) as ConfigRouteId;

      if (check) {
        text = String.maintenance.self('on');
      } else {
        text = String.maintenance.self('off');
      }
    }

    const response = await this.telegramBotService.sendMessage({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_to_message_id: messageId,
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Command executed',
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

  private async underAttack({
    args,
    chatId,
    messageId,
  }: ExecuteCommandParams): Promise<ExecuteCommandResBody> {
    let text;

    if (args[0] === 'on') {
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
    } else if (args[0] === 'off') {
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
    } else if (args) {
      text = String.unknownValue;
    } else {
      const check = await this.cloudflareApiService.getSecurityLevel();

      if (check.result.value === 'under_attack') {
        text = String.underattack.self('on');
      } else {
        text = String.underattack.self('off');
      }
    }

    const response = await this.telegramBotService.sendMessage({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_to_message_id: messageId,
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Command executed',
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
