import { NextFunction, Response } from 'express';
import { AuthorizedRequest } from '../types/request';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || '';
const tokenName = process.env.SESSION_TOKEN_NAME!;

export const optionalProtect = async (
  req: AuthorizedRequest<any>,
  res: Response,
  next: NextFunction
) => {
  // If system doesn't support cookies, use authorization header
  const cookieToken = req.cookies[tokenName];
  const requestToken = cookieToken || req.headers.authorization?.split(' ')[1];

  if (requestToken) {
    try {
      const decoded: any = jwt.verify(requestToken, secret);

      req.user = decoded.id;

      next();
    } catch (err: any) {
      res.clearCookie(tokenName);
      next();
    }
  } else {
    next();
  }
}

export const protect = async (
  req: AuthorizedRequest<any>,
  res: Response,
  next: NextFunction
) => {
  // If system doesn't support cookies, use authorization header
  const cookieToken = req.cookies[tokenName];
  const requestToken = cookieToken || req.headers.authorization?.split(' ')[1];

  if (requestToken) {
    try {
      const decoded: any = jwt.verify(requestToken, secret);

      req.user = decoded.id;

      next();
    } catch (err: any) {
      res.clearCookie(tokenName);
      res.status(400).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};
