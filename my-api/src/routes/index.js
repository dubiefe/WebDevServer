// src/routes/index.js
import { Router } from 'express';
import booksroutes from './books.routes.js';

const router = Router();

router.use('/api/books', booksroutes);

router.get('/', (req, res) => {
  res.json({
    mensaje: 'Books API v1.0',
    endpoints: {
      books: '/api/books',
      health: '/health'
    }
  });
});

export default router;