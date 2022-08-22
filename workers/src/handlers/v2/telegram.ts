import { Config, String } from '../../config';
import { CloudflareApi, TelegramBot } from '../../services';

export class TelegramHandler {
  private readonly commands: { [key: string]: (args: string, env: Env) => Promise<void> } = {
    start: async (args: string) => await this.start(args),
    help: async (args: string) => await this.help(args),
    maintenance: async (args: string, env: Env) => await this.maintenance(args, env),
    underattack: async (args: string) => await this.underAttack(args),
  };
  private chatId!: string;
  private chatType!: string;
  private messageId!: number;

  public constructor(
    private readonly telegramBot: TelegramBot,
    private readonly cloudflareApi: CloudflareApi,
  ) {}

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
    const allowedUser = JSON.parse((await env.CONFIG.get('webmaster-id')) as string);

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

        await this.commands[command](textArray, env);

        return true;
      }
    }

    return false;
  }

  public async start(args: string) {
    let text = '';

    if (args == 'help' && this.chatType == 'private') {
      await this.help('');
    } else {
      text = String.start;
    }

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: this.messageId,
    });
  }

  public async help(args: string) {
    let text = '';
    let replyMarkup = '';

    if (this.chatType == 'private') {
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

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: this.messageId,
      replyMarkup,
    });
  }

  public async maintenance(args: string, env: Env) {
    let text = '';

    if (args == 'on') {
      const check = await env.CONFIG.get('route-id');

      if (!check) {
        text = String.maintenance.alreadySet('on');
      } else {
        const data = await this.cloudflareApi.createWorkerRoute({
          pattern: '*kweeksnews.com/*',
          script: 'maintenance',
        });

        if (data.success) {
          await env.CONFIG.put('route-id', data.result.id);
          text = String.maintenance.on;
        } else {
          text = String.maintenance.setFailed;
        }
      }
    } else if (args == 'off') {
      const check = await env.CONFIG.get('route-id');

      if (check) {
        const data = await this.cloudflareApi.deleteWorkerRoute({
          id: check,
        });

        if (data.success) {
          await env.CONFIG.delete('route-id');
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
      const check = await env.CONFIG.get('route-id');

      if (check) {
        text = String.maintenance.self('on');
      } else {
        text = String.maintenance.self('off');
      }
    }

    await this.telegramBot.sendMessage({
      chatId: this.chatId,
      text,
      parseMode: 'HTML',
      replyToMessageId: this.messageId,
    });
  }

  public async underAttack(args: string) {
    let text = '';

    if (args == 'on') {
      const check = await this.cloudflareApi.getSecurityLevel();

      if (check.result.value != 'under_attack') {
        const data = await this.cloudflareApi.changeSecurityLevel({
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
    } else if (args == 'off') {
      const check = await this.cloudflareApi.getSecurityLevel();

      if (check.result.value == 'under_attack') {
        const data = await this.cloudflareApi.changeSecurityLevel({
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
      const check = await this.cloudflareApi.getSecurityLevel();

      if (check.result.value == 'under_attack') {
        text = String.underattack.self('on');
      } else {
        text = String.underattack.self('off');
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
