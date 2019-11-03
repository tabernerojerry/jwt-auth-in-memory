import { sign } from 'jsonwebtoken';

import { User } from './models/User';

export const createAccessToken = async (user: User): Promise<string> => {
  return sign(
    { userId: user.id },
    // put exclamation mark to say typescript the variable is define
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: '15m' }
  );
};

export const createRefreshToken = async (user: User): Promise<string> => {
  return sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    // put exclamation mark to say typescript the variable is define
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: '7d' }
  );
};
