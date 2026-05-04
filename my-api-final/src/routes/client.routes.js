// src/routes/client.routes.js
import { Router } from 'express';
import * as clientController from '../controllers/client.controller.js';
import { validate } from '../middleware/validate.js';
import { createClientSchema, updateClientSchema } from '../schemas/client.schema.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/client/:
 *   post:
 *     tags:
 *       - Client
 *     summary: Creata a new client in the company of the user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       409:
 *         description: Error during creation
 */
router.post('/', authMiddleware, validate(createClientSchema), clientController.createClient);

/**
 * @openapi
 * /api/client/:id:
 *   put:
 *     tags:
 *       - Client
 *     summary: Update a client
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the client to update
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Client updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedClient:
 *                   $ref: '#/components/schemas/Client'
 *       409:
 *         description: Error updating client
 */
router.put('/:id', authMiddleware, validate(updateClientSchema), clientController.updateClient)

/**
 * @openapi
 * /api/client:
 *   get:
 *     tags:
 *       - Client
 *     summary: Get all clients in the company
 *     parameters:
 *      - in: path
 *        name: name
 *        schema:
 *          type: string
 *        description: Filter parameter for the client name
 *      - in: path
 *        name: sort
 *        schema:
 *          type: string
 *        description: Filter parameter to sort the client
 *      - in: path
 *        name: page
 *        schema:
 *          type: number
 *        description: Pagination parameter for the page to display
 *      - in: path
 *        name: limit
 *        schema:
 *          type: number
 *        description: Pagination parameter for the number of client per page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client filtered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPages:
 *                   type: number
 *                 totalItems:
 *                   type: number
 *                 currentPage:
 *                   type: string
 *                 content:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Client'
 *       409:
 *         description: Error getting clients
 */
router.get('/', authMiddleware, clientController.getAllClient);

/**
 * @openapi
 * /api/client/archived:
 *   get:
 *     tags:
 *       - Client
 *     summary: Get all archived clients in the company
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Client'
 *       409:
 *         description: Error getting archived clients
 */
router.get('/archived', authMiddleware, clientController.getAllArchivedClients);

/**
 * @openapi
 * /api/client/:id:
 *   get:
 *     tags:
 *       - Client
 *     summary: Get a specific client
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the client to find
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 client:
 *                   $ref: '#/components/schemas/Client'
 *       409:
 *         description: Error getting client
 */
router.get('/:id', authMiddleware, clientController.getClient);

/**
 * @openapi
 * /api/client/:id:
 *   delete:
 *     tags:
 *       - Client
 *     summary: Delete client (soft or hard)
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the client to delete
 *      - in: query
 *        name: soft
 *        schema:
 *          type: boolean
 *        description: Indicate if it should be a soft-delete (if not, don't put it in the params)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client deleted (soft or hard)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedClient:
 *                   $ref: '#/components/schemas/Client'
 *       409:
 *         description: Error during deletion
 */
router.delete('/:id', authMiddleware, clientController.deleteClient);

/**
 * @openapi
 * /api/client/:id/restore:
 *   patch:
 *     tags:
 *       - Client
 *     summary: Restore soft-deleted user
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the client to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client restored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restoredClient:
 *                   $ref: '#/components/schemas/Client'
 *       409:
 *         description: Error during restore
 */
router.patch('/:id/restore', authMiddleware, clientController.restoreClient);

export default router;