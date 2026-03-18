// src/routes/cursos.routes.js
import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema.js';

const router = Router();

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new users
 *     description: Create a user account and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 refresh_token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Conflict - The email already exists
 */
router.post('/register', validate(createUserSchema), userController.register);

export default router;