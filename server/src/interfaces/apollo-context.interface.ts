import { Response, Request } from 'express';

export interface ApolloContext {
  req: Request,
  res: Response,
  payload?: { userId: string }
}
