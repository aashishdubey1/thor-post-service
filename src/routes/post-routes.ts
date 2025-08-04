import express from 'express';
import { PostController } from '../controllers/post-controller';
import { Post } from '../models/Post';
import { authenticateReq } from '../middlewares/authenticateRequest';

const router = express.Router();
const postController = new PostController()

router.use(authenticateReq);

router.post('/post',postController.createPost)

router.get('/post/:id',postController.getPost)

router.get('/post',postController.getAllPost)

router.put('/post/:id',postController.updatePost)

router.delete('/post/:id',postController.deletePost)