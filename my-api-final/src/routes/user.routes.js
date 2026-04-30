// src/routes/user.routes.js
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

/**
 * @openapi
 * /api/user/register:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update the user data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated
 *       409:
 *         description: Error updating user
 */
router.put('/register', authMiddleware, validate(updateUserSchema), userController.onboardingPersonalData)

/**
 * @openapi
 * /api/user/company:
 *   patch:
 *     tags:
 *       - Auth
 *     summary: Update the user company data
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: Company linked to the user
 *       409:
 *         description: Error updating user company
 */
router.patch('/company', authMiddleware, validate(createCompanySchema), userController.onboardingCompanyData)

/**
 * @openapi
 * /api/user/logo:
 *   patch:
 *     tags:
 *       - Auth
 *     summary: Update the company logo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *          multipart/form-data:
 *              schema:
 *                  type: object
 *                  properties:
 *                      file:
 *                          type: string
 *                          format: binary
 *     responses:
 *       200:
 *         description: Company logo updated
 *       400:
 *         description: Missing file in the request body
 *       401:
 *         description: No company linked to the user
 */
router.patch('/logo', authMiddleware, uploadMiddleware.single("file"), userController.addCompanyLogo)

/**
 * @openapi
 * /api/user/:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Update the user company data
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Error finding user
 */
router.get('/', authMiddleware, userController.getUser)

/**
 * @openapi
 * /api/user/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh user's accessToken
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company linked to the user
 *       400:
 *         description: Missing refreshToken in the body
 *       401:
 *         description: Refresh Token expired of invalid
 */
router.post('/refresh', userController.refreshUserToken)

/**
 * @openapi
 * /api/user/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out
 *       409:
 *         description: Error during logout
 */
router.post('/logout', authMiddleware, userController.logout)

/**
 * @openapi
 * /api/user/:
 *   delete:
 *     tags:
 *       - Auth
 *     summary: Delete user (soft or hard)
 *     parameters:
 *      - in: query
 *        name: soft
 *        schema:
 *          type: boolean
 *        description: Indicate if it should be a soft-delete (if not, don't put it in the params)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted (soft or hard)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedUser:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Error during deletion
 */
router.delete('/', authMiddleware, userController.deleteUser)

/**
 * @openapi
 * /api/user/password:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Updating user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated
 *       401:
 *         description: Incorrect previous password
 */
router.put('/password', authMiddleware, validate(updateUserPassword), userController.changePassword)

/**
 * @openapi
 * /api/user/:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Invite new user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User invited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   $ref: '#/components/schemas/User'
 *       409:
 *         description: Error during invite
 */
router.post('/invite', authMiddleware, adminRoleMiddleware, userController.inviteColleagues)

export default router;