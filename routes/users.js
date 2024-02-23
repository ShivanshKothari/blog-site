import express from "express";
import {loginController, submitController, editorController } from "../controllers/usersControllers.js";


const router = express.Router();

// GET login page. 
router.get("/", loginController);

// Credentials check on submission and create session cookie
router.post("/submit", submitController);

// Edit post
router.get("/editor", editorController);

export default router;
