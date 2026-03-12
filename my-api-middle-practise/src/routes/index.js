// src/routes/index.js
import { Router } from 'express';
import authroutes from './auth.routes.js';
import notesroutes from './notes.routes.js';

const router = Router();

router.use('/auth', authroutes);
router.use('/notes', notesroutes);

router.get('/', (req, res) => {
  res.json({
    mensage: 'Movies API v1.0',
    endpoints: {
      auth: '/api/auth',
      notes: '/api/notes',
      health: '/health'
    }
  });
});

export default router;