import { UserService } from '../services/user.service.js';

export const UserController = {

  getAll(req, res, next) {
    try {
      const data = UserService.getAll(req.query);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  },

  getById(req, res, next) {
    try {
      const user = UserService.getById(req.params.id);
      res.json({ success: true, data: { user } });
    } catch (err) { next(err); }
  },

  update(req, res, next) {
    try {
      const user = UserService.update(req.params.id, req.body);
      res.json({ success: true, data: { user } });
    } catch (err) { next(err); }
  },

  delete(req, res, next) {
    try {
      UserService.delete(req.params.id);
      res.status(204).send();
    } catch (err) { next(err); }
  },
};
