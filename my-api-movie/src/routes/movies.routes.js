// src/routes/cursos.routes.js
import { Router } from 'express';
import * as moviesController from '../controllers/movies.controller.js';
import { validate } from '../middleware/validateRequest.js';
import { createMovieSchema, updateMovieSchema } from '../schemas/movies.schema.js';
import uploadMiddleware from '../middleware/handleStorage.js';

const router = Router();

router.get('/', moviesController.getAll);
router.get('/:id', moviesController.getByID);
router.post('/', validate(createMovieSchema), moviesController.post);
router.put('/:id', validate(updateMovieSchema), moviesController.put);
router.delete('/:id', moviesController.deleteMovie);
router.post('/:id/rent', moviesController.rent);
router.post('/:id/return', moviesController.returnMovie);
router.patch("/:id/cover", uploadMiddleware.single("file"), moviesController.uploadMovieCover);
router.get("/:id/cover", moviesController.getMovieCover);
router.get("/stats/top", moviesController.getTop);

export default router;