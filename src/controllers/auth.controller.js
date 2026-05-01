import { AuthService } from '../services/auth.service.js';
import { UserService } from '../services/user.service.js';

export const AuthController = {

  async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async login(req, res, next) {
    try {
      const result = await AuthService.login(req.body);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  },

  async me(req, res, next) {
    try {
      const user = await UserService.getById(req.user.sub);
      res.json({ success: true, data: { user } });
    } catch (err) { next(err); }
  },

  async changePassword(req, res, next) {
    try {
      await AuthService.changePassword(req.user.sub, req.body);
      res.json({ success: true, message: 'Password updated' });
    } catch (err) { next(err); }
  },
};
