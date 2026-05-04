// src/routes/deliveryNote.routes.js
import { Router } from 'express';
import * as deliveryNoteController from '../controllers/deliveryNote.controller.js';
import { validate } from '../middleware/validate.js';
import { createDeliveryNoteSchema, signDeliveryNoteSchema } from '../schemas/deliveryNote.schema.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/deliverynote/:
 *   post:
 *     tags:
 *       - Delivery Note
 *     summary: Creat a new delivery note in the company of the user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryNote'
 *     responses:
 *       200:
 *         description: Delivery note created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deliveryNote:
 *                   $ref: '#/components/schemas/DeliveryNote'
 *       409:
 *         description: Error during creation
 */
router.post('/', authMiddleware, validate(createDeliveryNoteSchema), deliveryNoteController.createDeliveryNote);

/**
 * @openapi
 * /api/deliverynote:
 *   get:
 *     tags:
 *       - Delivery Note
 *     summary: Get all delivery notes in the company
 *     parameters:
 *      - in: path
 *        name: project
 *        schema:
 *          type: string
 *        description: Filter parameter for the delivery note
 *      - in: path
 *        name: client
 *        schema:
 *          type: string
 *        description: Filter parameter for the delivery note
 *      - in: path
 *        name: format
 *        schema:
 *          type: string
 *        description: Filter parameter for the delivery note
 *      - in: path
 *        name: signed
 *        schema:
 *          type: string
 *        description: Filter parameter for the delivery note
 *      - in: path
 *        name: from
 *        schema:
 *          type: string
 *        description: Filter parameter for the delivery note
 *      - in: path
 *        name: to
 *        schema:
 *          type: string
 *        description: Filter parameter for the delivery note
 *      - in: path
 *        name: sort
 *        schema:
 *          type: string
 *        description: Filter parameter to sort the delivery notes
 *      - in: path
 *        name: page
 *        schema:
 *          type: number
 *        description: Pagination parameter for the page to display
 *      - in: path
 *        name: limit
 *        schema:
 *          type: number
 *        description: Pagination parameter for the number of delivery notes per page
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery notes filtered
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
 *                      $ref: '#/components/schemas/DeliveryNote'
 *       409:
 *         description: Error getting delivery notes
 */
router.get('/', authMiddleware, deliveryNoteController.getAllDeliveryNotes);

/**
 * @openapi
 * /api/deliverynote/:id:
 *   get:
 *     tags:
 *       - Delivery Note
 *     summary: Get a specific delivery note
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the delivery note to find
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery note found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deliveryNote:
 *                   $ref: '#/components/schemas/DeliveryNote'
 *       409:
 *         description: Error getting delivery note
 */
router.get('/:id', authMiddleware, deliveryNoteController.getDeliveryNote);

/**
 * @openapi
 * /api/deliverynote/pdf/:id:
 *   get:
 *     tags:
 *       - Delivery Note
 *     summary: Generate a PDF for the delivery note
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the delivery note
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generated for the delivery note
 *         content:
 *           application/pdf
 *       409:
 *         description: Error during PDF generation
 */
router.get('/pdf/:id/', authMiddleware, deliveryNoteController.downloadPDF);

/**
 * @openapi
 * /api/deliverynote/:id/sign:
 *   âtch:
 *     tags:
 *       - Delivery Note
 *     summary: Sign and generate a PDF for the delivery note
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the delivery note
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - signature
 *             properties:
 *               signature:
 *                 type: string
 *                 example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+X6QAAAABJRU5ErkJggg=="
 *     responses:
 *       200:
 *         description: Signed and PDF generated for the delivery note
 *         content:
 *           application/pdf
 *       409:
 *         description: Error during signing process
 */
router.patch('/:id/sign', authMiddleware, validate(signDeliveryNoteSchema), deliveryNoteController.sign)

/**
 * @openapi
 * /api/deliverynote/:id:
 *   delete:
 *     tags:
 *       - Delivery Note
 *     summary: Delete delivery note
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the delivery note to delete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delivery note deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedDeliveryNote:
 *                   $ref: '#/components/schemas/DeliveryNote'
 *       409:
 *         description: Error during deletion
 */
router.delete('/:id', authMiddleware, deliveryNoteController.deleteDeliveryNote);

export default router;