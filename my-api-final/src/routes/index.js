// src/routes/index.js
import { Router } from 'express';
import userRoutes from './user.routes.js';
import clientRoutes from './client.routes.js';

const router = Router();

router.use('/user', userRoutes);
router.use('/client', clientRoutes);

router.get('/', (req, res) => {
  res.json({
    mensage: 'Movies API v1.0',
    endpoints: {
      user: '/api/user',
      health: '/health'
    }
  });
});

export default router;