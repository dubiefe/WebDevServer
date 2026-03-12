// src/routes/cursos.routes.js
import { Router } from 'express';
import * as noteController from '../controllers/notes.controller.js';
import authMiddleware from '../middleware/session.middleware.js';
import { validate } from '../middleware/validateRequest.js';
import { createUserSchema, updateUserSchema } from '../schemas/users.schema.js';

const router = Router();

// GET /api/notes
router.get('/', authMiddleware, noteController.getNotes);

// POST /api/auth/login
router.post('/', authMiddleware, noteController.createNote);

export default router;