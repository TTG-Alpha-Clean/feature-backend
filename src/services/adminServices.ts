import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, SignOptions, Secret } from 'jsonwebtoken';

export async function loginAdmin(username: string, password: string): Promise<any> {
  const { rows } = await pool.query(
    'SELECT id, username, password FROM admin_users WHERE username = $1 LIMIT 1',
    [username]
  );

  if (!rows.length) {
    return { ok: false, status: 401, msg: 'Credenciais inválidas.' };
  }

  const admin = rows[0];
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return { ok: false, status: 401, msg: 'Credenciais inválidas.' };
  }

  const secret = process.env.JWT_SECRET as Secret;
  if (!secret) {
    throw new Error('JWT_SECRET não está definida nas variáveis de ambiente.');
  }

  // Forçando a tipagem para evitar erro de "string não atribuível a expiresIn"
  const expiresIn = (process.env.JWT_EXPIRES_IN || '1h') as unknown as number;

  const payload: JwtPayload = {
    id: admin.id,
    username: admin.username
  };

  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn
  };

  const token = jwt.sign(payload, secret, options);

  return {
    ok: true,
    token,
    admin: {
      id: admin.id,
      username: admin.username
    }
  };
}
