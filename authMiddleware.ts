import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { mockDB } from '../services/mockDb';
import { IUser } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required. No Bearer token provided.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string; role: string; email: string };
    const user = mockDB.users.find(u => u._id === decoded.id || u.email === decoded.email);

    if (!user) {
      res.status(401).json({ success: false, message: 'User matching token session not found.' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid or expired authentication token.' });
    return;
  }
};
