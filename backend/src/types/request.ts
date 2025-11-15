import { Request } from "express";

export type AuthorizedRequest<T> = Request<never, never, T> & {
  user?: string;
};

export type TokenUser = {
  id: string;
};