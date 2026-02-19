// src/routes/cursos.routes.js
import { Router } from 'express';
import * as booksController from '../controllers/books.controller.js';
import { validate } from '../middleware/validateRequest.js';
import { createBookSchema, updateBookSchema } from '../schemas/books.schema.js';

const router = Router();

router.get('/', booksController.getAll);
router.get('/:id', booksController.getById);
router.post('/', validate(createBookSchema), booksController.post);
router.put('/:id', validate(updateBookSchema), booksController.put);
router.patch('/:id', validate(updateBookSchema), booksController.patch);
router.delete('/:id', booksController.delete_book);

export default router;