import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Não autenticado.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não definida no ambiente');
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded; 

    next();
  } catch (err: unknown) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}
