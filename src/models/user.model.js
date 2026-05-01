import { query, queryOne, execute } from '../config/database.js';

export const UserModel = {

  async findAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const rows = await query(
      `SELECT id, name, email, role, is_active, created_at, updated_at
       FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    const [{ total }] = await query('SELECT COUNT(*) AS total FROM users');
    return { rows, total, page, limit, pages: Math.ceil(total / limit) };
  },

  async findById(id) {
    return queryOne(
      `SELECT id, name, email, role, is_active, created_at, updated_at FROM users WHERE id = ?`,
      [id]
    );
  },

  async findByEmail(email) {
    // Returns password hash — only for auth use
    return queryOne(`SELECT * FROM users WHERE email = ?`, [email]);
  },

  async create({ id, name, email, password, role = 'user' }) {
    await execute(
      `INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      [id, name, email, password, role]
    );
    return this.findById(id);
  },

  async update(id, fields) {
    const allowed = ['name', 'email', 'role', 'is_active'];
    const entries = Object.entries(fields).filter(([k]) => allowed.includes(k));
    if (entries.length === 0) return this.findById(id);

    const setClauses = entries.map(([k]) => `${k} = ?`).join(', ');
    const values     = entries.map(([, v]) => v);

    await execute(
      `UPDATE users SET ${setClauses} WHERE id = ?`,
      [...values, id]
    );
    return this.findById(id);
  },

  async updatePassword(id, hashedPassword) {
    await execute(`UPDATE users SET password = ? WHERE id = ?`, [hashedPassword, id]);
  },

  async delete(id) {
    const result = await execute(`DELETE FROM users WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  },

  async existsByEmail(email, excludeId = null) {
    const row = excludeId
      ? await queryOne(`SELECT id FROM users WHERE email = ? AND id != ?`, [email, excludeId])
      : await queryOne(`SELECT id FROM users WHERE email = ?`, [email]);
    return !!row;
  },
};
