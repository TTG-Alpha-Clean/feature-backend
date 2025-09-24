import 'dotenv/config';
import bcrypt from 'bcrypt';
import { pool } from '../src/config/db.js';

const username = 'admin';
const plain = 'SenhaAlphaClean2077';
const hash = await bcrypt.hash(plain, 10);

await pool.query(
  `INSERT INTO admin_users (username, password)
   VALUES ($1, $2)
   ON CONFLICT (username) DO NOTHING`,
  [username, hash]
);

console.log('✅ Admin criado/garantido.');
process.exit(0);
