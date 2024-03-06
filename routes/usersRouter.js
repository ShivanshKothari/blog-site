import express from "express";
import {loginController, logoutController, submitController, signupController, redundantEmailValidationController, verifyController, verifyOTPController, signupSubmitController } from "../controllers/usersControllers.js";


const router = express.Router();

// GET login page. 
router.get("/", loginController);

// GET login page. 
router.get("/logout", logoutController);

// Credentials check on submission and create session cookie
router.post("/submit", submitController);

// GET signup page. 
router.get("/signup", signupController);

// POST signup data.  
router.post("/verify/:lastPath", verifyController);

// POST signup data.  
router.post("/signup/submit", signupSubmitController);

// Validate Email Address Unique
router.post('/validateMail', redundantEmailValidationController);

// Verify OTP for forgot password
router.post('/verifyOTP', verifyOTPController);

export default router;
