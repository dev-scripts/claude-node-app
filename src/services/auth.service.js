import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';
import { UserModel } from '../models/user.model.js';

export const AuthService = {

  async register({ name, email, password }) {
    if (await UserModel.existsByEmail(email)) {
      throw Object.assign(new Error('Email already registered'), { status: 409 });
    }
    const hashed = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
    const user   = await UserModel.create({ id: uuidv4(), name, email, password: hashed });
    return { user, ...this.generateTokens(user) };
  },

  async login({ email, password }) {
    const record = await UserModel.findByEmail(email);
    if (!record) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    if (!record.is_active) throw Object.assign(new Error('Account is deactivated'), { status: 403 });

    const valid = await bcrypt.compare(password, record.password);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const { password: _, ...user } = record;
    return { user, ...this.generateTokens(user) };
  },

  generateTokens(user) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken  = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
    return { accessToken, refreshToken };
  },

  verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
  },

  async changePassword(userId, { current_password, new_password }) {
    const user = await UserModel.findById(userId);
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

    const record = await UserModel.findByEmail(user.email);
    const valid  = await bcrypt.compare(current_password, record.password);
    if (!valid) throw Object.assign(new Error('Current password is incorrect'), { status: 400 });

    const hashed = await bcrypt.hash(new_password, env.BCRYPT_ROUNDS);
    await UserModel.updatePassword(userId, hashed);
  },
};
