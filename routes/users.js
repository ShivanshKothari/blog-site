import express from "express";
import {loginController, logoutController, submitController, editorController } from "../controllers/usersControllers.js";


const router = express.Router();

// GET login page. 
router.get("/", loginController);

// GET login page. 
router.get("/logout", logoutController);

// Credentials check on submission and create session cookie
router.post("/submit", submitController);

// Edit post
router.get("/edit/:lastPath", editorController);

export default router;
