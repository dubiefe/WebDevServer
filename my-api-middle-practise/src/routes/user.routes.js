// src/routes/cursos.routes.js
import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, loginSchema, emailValidationSchema, updateUserSchema, updateUserPassword } from '../schemas/user.schema.js';
import { createCompanySchema } from '../schemas/company.schema.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import uploadMiddleware from '../middleware/upload.js';

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

router.put('/validation', authMiddleware, validate(emailValidationSchema), userController.emailValidation)

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
 *         description: Unauthorized - wrong credentials
 */
router.post('/login', validate(loginSchema), userController.login)

router.put('/register', authMiddleware, validate(updateUserSchema), userController.onboardingPersonalData)

router.patch('/company', authMiddleware, validate(createCompanySchema), userController.onboardingCompanyData)

router.patch('/logo', authMiddleware, uploadMiddleware.single("file"), userController.addCompanyLogo)

router.get('/', authMiddleware, userController.getUser)

router.post('/refresh', userController.refreshUserToken)

router.post('/logout', authMiddleware, userController.logout)

router.delete('/', authMiddleware, userController.deleteUser)

router.put('/password', authMiddleware, validate(updateUserPassword), userController.changePassword)

export default router;