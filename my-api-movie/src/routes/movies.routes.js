// src/routes/cursos.routes.js
import { Router } from 'express';
import * as moviesController from '../controllers/movies.controller.js';
import { validate } from '../middleware/validateRequest.js';
import { createMovieSchema, updateMovieSchema } from '../schemas/movies.schema.js';

const router = Router();

export default router;