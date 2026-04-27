// src/routes/cursos.routes.js
import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.js';
import { createUserSchema, loginSchema, emailValidationSchema, updateUserSchema, updateUserPassword } from '../schemas/user.schema.js';
import { createCompanySchema } from '../schemas/company.schema.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminRoleMiddleware } from '../middleware/role.middleware.js';
import uploadMiddleware from '../middleware/upload.js';

const router = Router();

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new users
 *     description: Create a user account and return JWT accessToken & refreshToken
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
 *                   $ref: '#/components/schemas/UserVisible'
 *       409:
 *         description: Conflict - The email already exists
 */
router.post('/register', validate(createUserSchema), userController.register);
/**
 * @openapi
 * /api/user/validation:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Validate the code sent to the user's email (max 3 attempts)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - verificationCode
 *             properties:
 *               verificationCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Email validated
 *       400:
 *         description: Incorrect code
 *       429:
 *         description: Too many attempts
 */
router.put('/validation', authMiddleware, validate(emailValidationSchema), userController.emailValidation)

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Initiate a session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login validated
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
 *       401:
 *         description: Credentials incorrect
 *       404:
 *         description: User not existing
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

router.post('/invite', authMiddleware, adminRoleMiddleware, userController.inviteColleagues)

export default router;