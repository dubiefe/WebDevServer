// src/routes/index.js
import { Router } from 'express';
import moviesroutes from './movies.routes.js';

const router = Router();

router.use('/api/movies', moviesroutes);

router.get('/', (req, res) => {
  res.json({
    mensage: 'Movies API v1.0',
    endpoints: {
      movies: '/api/movies',
      health: '/health'
    }
  });
});

export default router;