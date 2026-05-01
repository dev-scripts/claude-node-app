import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from '../../validators/user.validator.js';

const router = Router();

// POST /api/v1/auth/register
router.post('/register', validate(registerSchema), AuthController.register);

// POST /api/v1/auth/login
router.post('/login', validate(loginSchema), AuthController.login);

// GET  /api/v1/auth/me          (protected)
router.get('/me', authenticate, AuthController.me);

// PUT  /api/v1/auth/password    (protected)
router.put('/password', authenticate, validate(changePasswordSchema), AuthController.changePassword);

export default router;
