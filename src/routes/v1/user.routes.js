import { Router } from 'express';
import { UserController } from '../../controllers/user.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateUserSchema, paginationSchema } from '../../validators/user.validator.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// GET  /api/v1/users            (admin only)
router.get('/', authorize('admin'), validate(paginationSchema, 'query'), UserController.getAll);

// GET  /api/v1/users/:id        (admin or self)
router.get('/:id', UserController.getById);

// PUT  /api/v1/users/:id        (admin or self)
router.put('/:id', validate(updateUserSchema), UserController.update);

// DELETE /api/v1/users/:id      (admin only)
router.delete('/:id', authorize('admin'), UserController.delete);

export default router;
