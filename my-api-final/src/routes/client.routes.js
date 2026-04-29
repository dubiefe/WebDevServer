// src/routes/client.routes.js
import { Router } from 'express';
import * as clientController from '../controllers/client.controller.js';
import { validate } from '../middleware/validate.js';
import { createClientSchema } from '../schemas/client.schema.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', authMiddleware, validate(createClientSchema), clientController.createClient);

export default router;