// src/routes/cursos.routes.js
import { Router } from 'express';
import * as commentController from '../controllers/comment.controller.js';

const router = Router();

router.post('/comment/', commentController.createComment);
router.get('post/:id/comments/', commentController.listComments);
router.delete('/comment/:id/', commentController.deleteComment);
router.patch('/comment/:id/restore/', commentController.restoreComment)

export default router;