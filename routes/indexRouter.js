import express from "express";
import { homeController } from "../controllers/indexControllers.js";
import { OTP } from "../models/OTP.js";

const router = express.Router();

// create();

/* GET home page. */
router.get("/", homeController);

export default router;
// create();
async function create() {
  try {
    OTP.create({
      userEmail: "user@example.com",
      otp: 'artst'
    })
    console.log("created otp")
  } catch (error) {
    console.error(error.message);
  }
}