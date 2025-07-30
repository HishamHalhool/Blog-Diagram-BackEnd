import express from 'express';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);

export default router; 