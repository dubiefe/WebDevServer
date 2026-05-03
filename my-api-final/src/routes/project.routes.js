// src/routes/project.routes.js
import { Router } from 'express';
import * as projectController from '../controllers/project.controller.js';
import { validate } from '../middleware/validate.js';
import { createProjectSchema, updateProjectSchema } from '../schemas/project.schema.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/project/:
 *   post:
 *     tags:
 *       - Project
 *     summary: Creata a new project in the company of the user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       409:
 *         description: Error during creation
 */
router.post('/', authMiddleware, validate(createProjectSchema), projectController.createProject);

/**
 * @openapi
 * /api/project/:id:
 *   put:
 *     tags:
 *       - Project
 *     summary: Update a project
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the project to update
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updatedProject:
 *                   $ref: '#/components/schemas/Project'
 *       409:
 *         description: Error updating project
 */
router.put('/:id', authMiddleware, validate(updateProjectSchema), projectController.updateProject)

/**
 * @openapi
 * /api/project:
 *   get:
 *     tags:
 *       - Project
 *     summary: Get all projects in the company
 *     parameters:
 *      - in: path
 *        name: client
 *        schema:
 *          type: string
 *        description: Filter parameter for the client name
 *      - in: path
 *        name: name
 *        schema:
 *          type: string
 *        description: Filter parameter for the client name
 *      - in: path
 *        name: active
 *        schema:
 *          type: boolean
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
 *         description: Project filtered
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
 *                      $ref: '#/components/schemas/Project'
 *       409:
 *         description: Error getting projects
 */
router.get('/', authMiddleware, projectController.getAllProjects);

/**
 * @openapi
 * /api/project/archived:
 *   get:
 *     tags:
 *       - Project
 *     summary: Get all archived projects in the company
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: array
 *                   items:
 *                      $ref: '#/components/schemas/Project'
 *       409:
 *         description: Error getting archived projects
 */
router.get('/archived', authMiddleware, projectController.getAllArchivedProjects);

/**
 * @openapi
 * /api/project/:id:
 *   get:
 *     tags:
 *       - Project
 *     summary: Get a specific project
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the project to find
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       409:
 *         description: Error getting project
 */
router.get('/:id', authMiddleware, projectController.getProject);

/**
 * @openapi
 * /api/project/:id:
 *   delete:
 *     tags:
 *       - Project
 *     summary: Delete project (soft or hard)
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the project to delete
 *      - in: query
 *        name: soft
 *        schema:
 *          type: boolean
 *        description: Indicate if it should be a soft-delete (if not, don't put it in the params)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project deleted (soft or hard)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deletedProject:
 *                   $ref: '#/components/schemas/Project'
 *       409:
 *         description: Error during deletion
 */
router.delete('/:id', authMiddleware, projectController.deleteProject);

/**
 * @openapi
 * /api/project/:id/restore:
 *   patch:
 *     tags:
 *       - Project
 *     summary: Restore soft-deleted project
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        description: Id of the project to restore
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project restored
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 restoredProject:
 *                   $ref: '#/components/schemas/Project'
 *       409:
 *         description: Error during restore
 */
router.patch('/:id/restore', authMiddleware, projectController.restoreProject);

export default router;