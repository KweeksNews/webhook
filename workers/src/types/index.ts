import { IRequest, Route, RouterType } from 'itty-router';

export * from './cloudflare-api';
export * from './telegram-bot';

export * from './freshstatus';
export * from './wordpress';
export * from './telegram';

export type CustomRouter = RouterType & {
  all: Route;
  get: Route;
  post: Route;
};

export type Request = IRequest & {
  validKey?: boolean;
};
