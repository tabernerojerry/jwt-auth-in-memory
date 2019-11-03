import { Response } from 'express'

export const sendRefreshToken = (res: Response, token: String) => {
  res.cookie('jid', token, {
    httpOnly: true,
    path: '/refresh-token' // Only add the cookie when the user refresh the page to /refresh-token url only
  });
}