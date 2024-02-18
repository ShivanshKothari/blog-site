import express from 'express';
import { blogController } from '../controllers/blogsControllers.js';

const router = express.Router();


router.get('/:postPath', blogController);

export default router;