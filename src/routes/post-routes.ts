import express from 'express';
import { PostController } from '../controllers/post-controller';
import { authenticateReq } from '../middlewares/authenticateRequest';
import { validateReq } from '../middlewares/validateReq';
import { postSchema } from '../schemas/Post';
import { generalLimiter, strictLimiter } from '../middlewares/rateLimitter';

const router = express.Router();

const postController = new PostController()

router.use(authenticateReq);

router.post('/post',strictLimiter,validateReq(postSchema),postController.createPost)

router.get('/post/:id',generalLimiter,postController.getPost)

router.get('/post',generalLimiter,postController.getAllPost)

router.put('/post/:id',strictLimiter,postController.updatePost)

router.delete('/post/:id',strictLimiter,postController.deletePost)

export default router