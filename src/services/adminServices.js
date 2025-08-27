import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function loginAdmin(username, password) {
  const { rows } = await pool.query(
    'SELECT id, username, password FROM admin_users WHERE username = $1 LIMIT 1',
    [username]
  );
  if (!rows.length) return { ok: false, status: 401, msg: 'Credenciais inválidas.' };

  const admin = rows[0];
  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) return { ok: false, status: 401, msg: 'Credenciais inválidas.' };

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  return { ok: true, token, admin: { id: admin.id, username: admin.username } };
}



