import { pool } from "../config/db.js";

// CREATE
export async function createInformation(id_service, description) {
  const result = await pool.query(
    `INSERT INTO informations (id_service, description, created_at, updated_at)
     VALUES ($1, $2, NOW(), NOW())
     RETURNING *`,
    [id_service, description]
  );
  return result.rows[0];
}

// UPDATE
export async function updateInformation(id, description) {
  const result = await pool.query(
    `UPDATE informations
     SET description = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [description, id]
  );
  return result.rows[0];
}
