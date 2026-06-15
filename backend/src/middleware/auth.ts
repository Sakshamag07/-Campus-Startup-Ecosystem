import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

// 💡 1. Fixed: Removed the duplicate 'import { Request } from "express"' line.
// 💡 2. Fixed: Expanded the interface so TypeScript knows id, email, role, and isPremium exist.
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
    isPremium: boolean;
  };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Access token is required. Authorization header missing or formatted incorrectly.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'supersecretjwtkey123!';
    const decoded = jwt.verify(token, secret) as any;
    
    // 💡 3. Fixed: This assignment will now work flawlessly without throwing a TS error!
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as Role,
      isPremium: decoded.isPremium || false,
    };
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired access token.' });
  }
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'User is not authenticated.' });
      return;
    }

    // 💡 4. Fixed: TypeScript can now safely type-check this because 'req.user.role' matches the Prisma 'Role' type.
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: `Forbidden: Access restricted. Requires one of the following roles: [${allowedRoles.join(', ')}]` });
      return;
    }

    next();
  };
};

export const requirePremium = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'User is not authenticated.' });
    return;
  }

  if (!req.user.isPremium) {
    res.status(403).json({ error: 'Subscription required: This action requires a Premium Campus Startup subscription plan.' });
    return;
  }

  next();
};