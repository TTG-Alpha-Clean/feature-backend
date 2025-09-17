import { Request, Response } from 'express';
import { loginAdmin } from '../services/adminServices';

export async function adminLogin(req: Request, res: Response): Promise<Response> {
  const { username, password } = req.body || {};
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Informe usuário e senha.' });
  }

  const result = await loginAdmin(username, password);

  if (!result.ok) {
    return res.status(result.status || 401).json({ error: result.msg });
  }

  // Cookie com JWT
  res.cookie('token', result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000, // 1 hora
  });

  return res.json({ message: 'Login realizado com sucesso' });
}

export function adminLogout(req: Request, res: Response): Response {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.json({ message: 'Logout realizado com sucesso' });
}
