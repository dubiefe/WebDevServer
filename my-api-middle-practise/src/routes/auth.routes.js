// src/routes/cursos.routes.js
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validateRequest.js';
import { createUserSchema, updateUserSchema } from '../schemas/users.schema.js';

const router = Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

export default router;