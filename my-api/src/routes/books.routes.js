// src/routes/cursos.routes.js
import { Router } from 'express';
import * as booksController from '../controllers/books.controller.js';

const router = Router();

router.get('/', booksController.getAll);
router.get('/:id', booksController.getById);
router.get('/', booksController.post);

export default router;