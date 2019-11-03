import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';

import { ApolloContext } from './interfaces/apollo-context.interface';

export const isAuth: MiddlewareFn<ApolloContext> = ({context}, next) => {
  const { authorization } = context.req.headers;

  if (!authorization) {
    throw new Error('Not Authenticated!');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload;
  } catch(err) {
    console.log('Error', err);
    throw new Error('Not Authenticated!');
  }

  return next();
};
