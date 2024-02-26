import express from "express";
import bcrypt from "bcrypt";
import { homeController } from "../controllers/indexControllers.js";
import { User } from "../models/userData.js";

const router = express.Router();

// create();

/* GET home page. */
router.get("/", homeController);

export default router;
create();
async function create() {
  try {
    bcrypt.hash("Shivansh@2004", 10)
    .then((hashedPassword) => {
      User.create({
        firstName: "Shivansh Kothari",
        lastName: "Kothari",
        email: "shivanshkothari2004@gmail.com",
        password: hashedPassword,

      });
    })
    
  } catch (error) {
    console.error(error.message);
  }
}