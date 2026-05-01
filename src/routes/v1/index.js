import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
// Import future feature routes here:
// import productRoutes from './product.routes.js';

const router = Router();

router.use('/auth',  authRoutes);
router.use('/users', userRoutes);
// router.use('/products', productRoutes);

export default router;
