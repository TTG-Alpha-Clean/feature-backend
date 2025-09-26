import { Request, Response } from 'express';
import { loginAdmin } from '../services/adminServices';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export async function adminLogin(req: Request, res: Response): Promise<Response> {
  const username = req.body.username || req.body.email;
  const password = req.body.password || req.body.senha;

  if (!username || !password) {
    return res.status(400).json({ error: 'Informe usuário e senha.' });
  }

  const result = await loginAdmin(username, password);

  if (!result.ok) {
    return res.status(result.status || 401).json({ error: result.msg });
  }

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 hora
  });

  return res.json({
    token: result.token,
    user: {
      id: result.admin.id,
      username: result.admin.username,
      role: 'admin'
    }
  });
}


export function adminLogout(req: Request, res: Response): Response {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.json({ message: 'Logout realizado com sucesso' });
}


export function checkAuth(req: AuthenticatedRequest, res: Response) {
  return res.status(200).json({ user: req.user });
}
