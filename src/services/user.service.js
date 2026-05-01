import { UserModel } from '../models/user.model.js';

export const UserService = {

  async getAll(pagination) {
    return UserModel.findAll(pagination);
  },

  async getById(id) {
    const user = await UserModel.findById(id);
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
    return user;
  },

  async update(id, fields) {
    if (fields.email && await UserModel.existsByEmail(fields.email, id)) {
      throw Object.assign(new Error('Email already in use'), { status: 409 });
    }
    const user = await UserModel.findById(id);
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
    return UserModel.update(id, fields);
  },

  async delete(id) {
    const user = await UserModel.findById(id);
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
    await UserModel.delete(id);
  },
};
