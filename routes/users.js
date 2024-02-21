import express from "express";
import {loginController, submitController, editorController } from "../controllers/usersControllers.js";


const router = express.Router();

/* GET users listing. */
router.get("/", loginController);

router.post("/submit", submitController);

router.get("/editor", editorController);

export default router;
