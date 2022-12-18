import { Message, Params } from '@grammyjs/types';

export * from '@grammyjs/types';

export type SendMessageParams = Params<'sendMessage', 'sendMessage'>[0];

export type ForwardMessageParams = Params<'forwardMessage', 'forwardMessage'>[0];

type ErrorResBody = {
  ok: false;
  error_code: number;
  description: string;
};

export type SendMessageResBody =
  | {
      ok: true;
      result: Message.TextMessage;
    }
  | ErrorResBody;

export type ForwardMessageResBody =
  | {
      ok: true;
      result: Message;
    }
  | ErrorResBody;
