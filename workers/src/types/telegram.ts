import { Update } from '@grammyjs/types';

export type CommandList = {
  [key: string]: (params: ExecuteCommandParams) => Promise<ExecuteCommandResBody>;
};

export type ExecuteCommandData = Update;

export type ExecuteCommandParams = {
  args: string[];
  chatId: number;
  chatType: string;
  messageId: number;
};

export type ExecuteCommandResBody = {
  success: boolean;
  message: string;
  data?: unknown;
};
