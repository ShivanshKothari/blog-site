import express from 'express';
import { editorController, publishController, deleteController, reviewController, previewController } from '../controllers/editorControllers.js';
import fileUpload from 'express-fileupload';

const router = express.Router();

// Configure file upload middleware
router.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Editor routes
router.get('/:lastPath', editorController);
router.post('/publish/:id?', publishController);  // For new posts and editing existing posts
router.post('/delete/:id', deleteController);
router.post('/review/:id', reviewController);
router.get('/preview/:id', previewController);

export default router;