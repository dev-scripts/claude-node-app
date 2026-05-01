import mysql from 'mysql2/promise';
import { env } from './env.js';

let _pool = null;

export function getPool() {
  if (_pool) return _pool;

  _pool = mysql.createPool({
    host:               env.DB_HOST,
    port:               env.DB_PORT,
    user:               env.DB_USER,
    password:           env.DB_PASSWORD,
    database:           env.DB_NAME,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    timezone:           'Z',
  });

  return _pool;
}

// Run a query and return all rows
export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

// Run a query and return only the first row
export async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] ?? null;
}

// Run INSERT/UPDATE/DELETE and return ResultSetHeader
export async function execute(sql, params = []) {
  const [result] = await getPool().execute(sql, params);
  return result;
}

export async function closePool() {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}
