import express from 'express';
import { blogController } from '../controllers/blogsControllers.js';

const router = express.Router();

// Load blog
router.get('/:lastPath', blogController);

export default router;