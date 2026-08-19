import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type TokenPayload = {
  username: string;
  id: string;
};

export type AuthenticatedRequest = Request & {
  user?: TokenPayload;
};

export const authentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.get('authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authorization.replace('Bearer ', '');

  const secret = process.env.SECRET;

  if (!secret) {
    return res.status(500).json({ message: 'Missing SECRET' });
  }

  try {
    const decodedToken = jwt.verify(token, secret) as TokenPayload;

    if (!decodedToken.id) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decodedToken;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};