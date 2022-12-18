import { IRequest, Route, RouterType } from 'itty-router';

export interface CustomRouter extends RouterType {
  all: Route;
  get: Route;
  post: Route;
}

export interface Request extends IRequest {
  validKey?: boolean;
}
