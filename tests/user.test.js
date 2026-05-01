/**
 * Tests for auth endpoints.
 * Uses a real in-memory users array injected via environment mock.
 * For CI with a real MySQL DB, set DB_* env vars.
 */
import request from 'supertest';

process.env.JWT_SECRET  = 'test-secret-for-jest-only-32chars!!';
process.env.NODE_ENV    = 'test';
process.env.DB_HOST     = 'localhost';
process.env.DB_PASSWORD = '';

// ── Minimal in-memory DB ──────────────────────────────────────────────────────
const store = { users: [] };

// Patch mysql2 before any app imports
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// We test at the HTTP layer using supertest.
// Import app AFTER patching env so config picks up test values.
import { createApp } from '../src/app.js';
import { UserModel  } from '../src/models/user.model.js';
import { getPool    } from '../src/config/database.js';

// Override UserModel methods to use in-memory store
const now = () => new Date().toISOString();

UserModel.existsByEmail = async (email, excludeId) =>
  !!store.users.find(u => u.email === email && u.id !== excludeId);

UserModel.create = async ({ id, name, email, password, role = 'user' }) => {
  const u = { id, name, email, password, role, is_active: 1, created_at: now(), updated_at: now() };
  store.users.push(u);
  return UserModel.findById(id);
};

UserModel.findById = async (id) => {
  const u = store.users.find(u => u.id === id);
  if (!u) return null;
  const { password: _, ...safe } = u;
  return safe;
};

UserModel.findByEmail = async (email) =>
  store.users.find(u => u.email === email) ?? null;

UserModel.updatePassword = async (id, hashed) => {
  const u = store.users.find(u => u.id === id);
  if (u) u.password = hashed;
};

UserModel.findAll = async ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  const rows = store.users.slice(offset, offset + limit).map(({ password: _, ...u }) => u);
  return { rows, total: store.users.length, page, limit, pages: 1 };
};

UserModel.update = async (id, fields) => {
  const u = store.users.find(u => u.id === id);
  if (u) Object.assign(u, fields, { updated_at: now() });
  return UserModel.findById(id);
};

UserModel.delete = async (id) => {
  const idx = store.users.findIndex(u => u.id === id);
  if (idx !== -1) store.users.splice(idx, 1);
  return true;
};

const app = createApp();

beforeEach(() => { store.users = []; });

// ── Register ──────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/register', () => {
  test('registers a new user and returns tokens', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'Password1' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.user.email).toBe('alice@example.com');
    expect(res.body.data.user.password).toBeUndefined();
  });

  test('rejects duplicate email with 409', async () => {
    await request(app).post('/api/v1/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'Password1' });
    const res = await request(app).post('/api/v1/auth/register')
      .send({ name: 'Alice2', email: 'alice@example.com', password: 'Password1' });
    expect(res.status).toBe(409);
  });

  test('rejects weak password with 422', async () => {
    const res = await request(app).post('/api/v1/auth/register')
      .send({ name: 'Bob', email: 'bob@example.com', password: 'weak' });
    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });
});

// ── Login ─────────────────────────────────────────────────────────────────────
describe('POST /api/v1/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'Password1' });
  });

  test('returns tokens on valid credentials', async () => {
    const res = await request(app).post('/api/v1/auth/login')
      .send({ email: 'alice@example.com', password: 'Password1' });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  test('rejects wrong password with 401', async () => {
    const res = await request(app).post('/api/v1/auth/login')
      .send({ email: 'alice@example.com', password: 'WrongPass1' });
    expect(res.status).toBe(401);
  });
});

// ── /me ───────────────────────────────────────────────────────────────────────
describe('GET /api/v1/auth/me', () => {
  test('returns profile when authenticated', async () => {
    const reg = await request(app).post('/api/v1/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'Password1' });

    const res = await request(app).get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${reg.body.data.accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('alice@example.com');
  });

  test('returns 401 without token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });
});
