import express from "express";
import { editorController, publishController } from "../controllers/editorControllers.js";
import { upload } from "../utilities/multer.js";
import fileUpload from "express-fileupload";

const router = express.Router();
router.use(fileUpload());
// Edit or create blog posts
router.get("/:lastPath", editorController);

// Submit request to publish or edit blog posts
router.post("/submit", publishController);

export default router;